/**
 * Главный модуль 3D-сцены (Three.js).
 * Экспортирует функции для инициализации и обновления сцены.
 */
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { drones, simState, pathPoints, MAX_PATH_POINTS, currentDroneId, simSettings } from './state.js';
import { log } from './ui/logger.js';
import { addObjectToScene, envGroup } from './environment.js';
import { createDroneModel, updateLEDs, animateRotors } from './drone-model.js';
import { updateCamera } from './camera.js';
import { 
    initScene, scene, camera, renderer, controls, transformControl, 
    transformHelper, raycaster, mouse, selectionHelper, 
    droneMeshes, droneTrails, is3DActive, selectedObject, 
    pointerDownPos, isHittingGizmo, setSelectedObject, setPointerDownPos, setIsHittingGizmo,
    onWindowResize, syncViewportDependentSceneVisuals
} from './scene/scene-init.js';
import { setupTransformControlListeners } from './scene/transform.js';
import { onPointerDown, onPointerUp, handleSelection } from './scene/input.js';
import { handleDeselection, deselectObject } from './scene/selection.js';
import { 
    getSceneTopLevelObjects, findSceneObjectById, activateTransformMode, 
    getSelectedSceneObjectId, resetDroneToOrigin, deleteSelectedObject, 
    duplicateObject, addObject, appendPointToSelectedLinearObject, updateSelectedSceneObject, TransformMode
} from './scene/object-manager.js';

(window as any).scene = scene;
(window as any).camera = camera;
(window as any).setSelectedObject = setSelectedObject;

export { is3DActive, selectedObject, droneMeshes, envGroup, scene };
export { 
    addObject, deleteSelectedObject, duplicateObject, resetDroneToOrigin,
    listSceneObjects, selectSceneObjectById, deleteSceneObjectById,
    appendPointToSelectedLinearObject, updateSelectedSceneObject,
    setSceneObjectTransformMode, getSelectedSceneObjectId
} from './scene/object-manager.js';
export type { TransformMode } from './scene/object-manager.js';

export interface SceneObjectInfo {
    id: string;
    name: string;
    sceneType: string;
    objectType: string;
    draggable: boolean;
    isDrone: boolean;
    selected: boolean;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    supportsValue?: boolean;
    supportsPoints?: boolean;
    value?: string;
    pointsText?: string;
    metaLines?: string[];
}

let scenePointerDownCaptureHandler: ((event: PointerEvent) => void) | null = null;
let scenePointerUpCaptureHandler: ((event: PointerEvent) => void) | null = null;

function isScenePointerEvent(event: PointerEvent) {
    if (!renderer?.domElement) return false;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    return path.includes(renderer.domElement) || event.target === renderer.domElement;
}

function registerScenePointerHandlers() {
    if (!renderer?.domElement) return;

    if (scenePointerDownCaptureHandler) {
        document.removeEventListener('pointerdown', scenePointerDownCaptureHandler, true);
    }
    if (scenePointerUpCaptureHandler) {
        document.removeEventListener('pointerup', scenePointerUpCaptureHandler, true);
    }

    scenePointerDownCaptureHandler = (event: PointerEvent) => {
        if (!isScenePointerEvent(event)) return;
        log(`[3D-CLICK] document capture pointerdown target=${(event.target as HTMLElement | null)?.tagName || 'unknown'}`, 'info');
        onPointerDown(event);
    };

    scenePointerUpCaptureHandler = (event: PointerEvent) => {
        if (!isScenePointerEvent(event)) return;
        log(`[3D-CLICK] document capture pointerup target=${(event.target as HTMLElement | null)?.tagName || 'unknown'}`, 'info');
        onPointerUp(event);
    };

    document.addEventListener('pointerdown', scenePointerDownCaptureHandler, true);
    document.addEventListener('pointerup', scenePointerUpCaptureHandler, true);
}

function getTracerColorHex() {
    const color = new THREE.Color(simSettings.tracerColor || '#38bdf8');
    return color.getHex();
}

function getTracerWidthPx() {
    return Math.max(1, Number(simSettings.tracerWidth) || 1);
}

function getTracerPointSize() {
    return Math.max(0.08, getTracerWidthPx() * 0.08);
}

function shouldShowTracerLine() {
    return simSettings.tracerShape === 'line' || simSettings.tracerShape === 'both';
}

function shouldShowTracerPoints() {
    return simSettings.tracerShape === 'points' || simSettings.tracerShape === 'both';
}

export function init3D(container: HTMLElement) {
    try {
        initScene(container);
        setupTransformControlListeners();

        transformControl.addEventListener('mouseDown', () => setIsHittingGizmo(true));
        transformControl.addEventListener('mouseUp', () => setIsHittingGizmo(false));

        // Init Drones
        syncDrones();
        syncViewportDependentSceneVisuals();

        renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
        registerScenePointerHandlers();
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('keydown', onKeyDown);

        log('3D-сцена загружена.', 'success');
        log('[3D-CLICK] Обработчики pointerdown/pointerup подключены через document capture', 'info');
        updateCamera(camera, droneMeshes[currentDroneId] || null, controls, (window as any).cameraMode || 'drone');
        
    } catch (e: any) {
        console.error('[3D] Critical error during init3D:', e);
        log(`Ошибка 3D: ${e.message}`, 'error');
    }
}

export function syncDrones() {
    // Add missing drones
    for (const id in drones) {
        if (!droneMeshes[id]) {
            const mesh = createDroneModel();
            mesh.up.set(0, 0, 1);
            scene.add(mesh);
            droneMeshes[id] = mesh;
            initTrailForDrone(id);
        }
    }
    // Remove deleted drones
    for (const id in droneMeshes) {
        if (!drones[id]) {
            scene.remove(droneMeshes[id]);
            if (droneTrails[id]) {
                scene.remove(droneTrails[id].path);
                scene.remove(droneTrails[id].particles);
                droneTrails[id].lineGeometry.dispose();
                droneTrails[id].pointsGeometry.dispose();
                (droneTrails[id].path.material as LineMaterial).dispose();
                (droneTrails[id].particles.material as THREE.PointsMaterial).dispose();
                delete droneTrails[id];
            }
            delete droneMeshes[id];
        }
    }
}

function initTrailForDrone(id: string) {
    const lineGeometry = new LineGeometry();
    log(`[3D-INIT] Инициализация трейла для ${id}`, 'info');

    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_PATH_POINTS * 3);
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setDrawRange(0, 0);

    const colorHex = getTracerColorHex();
    const tracerWidth = getTracerWidthPx();

    const pathMat = new LineMaterial({
        color: colorHex,
        linewidth: tracerWidth,
        transparent: true,
        opacity: 0.9,
        depthTest: false,
        depthWrite: false
    });
    const path = new Line2(lineGeometry, pathMat);
    path.frustumCulled = false;
    path.renderOrder = 9000;
    path.visible = false;

    const particleMat = new THREE.PointsMaterial({
        color: colorHex,
        size: getTracerPointSize(),
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
    });
    const particles = new THREE.Points(pointsGeometry, particleMat);
    particles.frustumCulled = false;
    particles.visible = false;
    particles.renderOrder = 8999;
    
    scene.add(path);
    scene.add(particles);
    
    droneTrails[id] = { path, particles, lineGeometry, pointsGeometry };
    log(`[3D-INIT] Трейл для ${id} готов`, 'info');
}

export function getObstacles() {
    return envGroup ? envGroup.children : [];
}

export function updateDrone3D(dt: number) {
    if (!is3DActive || !renderer || !camera) return;

    if (simState.running && transformControl && transformControl.object) {
        log(`[3DDBG] updateDrone3D detach while running target=${(transformControl.object as any).name || 'unknown'}`, 'info');
        transformControl.detach();
        if (transformHelper) transformHelper.visible = false;
        if (selectionHelper) selectionHelper.visible = false;
    }
    
    if (transformControl && transformControl.object && !simState.running) {
        transformControl.visible = simSettings.showGizmo;
        if (transformHelper) transformHelper.visible = simSettings.showGizmo;
    }
    
    // Обновляем позицию selectionHelper если объект движется и выделен
    if (simState.running && selectedObject && selectionHelper && selectionHelper.visible) {
        selectionHelper.update();
    }
    
    if (selectionHelper && selectionHelper.visible) {
        const pulse = 1.0 + Math.sin(Date.now() * 0.005) * 0.1;
        selectionHelper.scale.set(pulse, pulse, pulse);
    }
    
    syncDrones();
    
    // Update all drones
    for (const id in drones) {
        const drone = drones[id];
        const mesh = droneMeshes[id];
        if (!mesh) continue;

        mesh.position.set(drone.pos.x, drone.pos.y, drone.pos.z);
        mesh.rotation.set(drone.orientation.roll, drone.orientation.pitch, drone.orientation.yaw, 'ZYX');

        updateLEDs(mesh, drone);
        updateTrailForDrone(id);
        animateRotors(mesh, dt, drone);

        const arrow = mesh.getObjectByName('orientation_arrow');
        if (arrow) {
            const scale = Math.max(1, camera.position.distanceTo(mesh.position) * 0.15);
            arrow.scale.set(scale, scale, scale);
        }
    }

    if (droneMeshes[currentDroneId]) {
        updateCamera(camera, droneMeshes[currentDroneId], controls, (window as any).cameraMode || 'drone');
    }

    try {
        renderer.render(scene, camera);
    } catch (e) {
        console.error('[3D] Render error:', e);
    }
}

function updateTrailForDrone(id: string) {
    if (!is3DActive || !droneTrails[id]) return;

    const pts = pathPoints[id] || [];
    const trail = droneTrails[id];

    if (simSettings.showTracer && pts.length > 1) {
        const pointPositions = trail.pointsGeometry.attributes.position.array as Float32Array;
        const linePositions = new Float32Array(pts.length * 3);
        for (let i = 0; i < pts.length; i++) {
            pointPositions[i * 3] = pts[i].x;
            pointPositions[i * 3 + 1] = pts[i].y;
            pointPositions[i * 3 + 2] = pts[i].z;

            linePositions[i * 3] = pts[i].x;
            linePositions[i * 3 + 1] = pts[i].y;
            linePositions[i * 3 + 2] = pts[i].z;
        }
        trail.pointsGeometry.setDrawRange(0, pts.length);
        trail.pointsGeometry.attributes.position.needsUpdate = true;
        trail.lineGeometry.setPositions(linePositions);
        trail.lineGeometry.computeBoundingSphere();
        
        const pathMat = trail.path.material as LineMaterial;
        const particleMat = trail.particles.material as THREE.PointsMaterial;
        
        const colorHex = getTracerColorHex();
        const tracerWidth = getTracerWidthPx();
        pathMat.color.setHex(colorHex);
        pathMat.linewidth = tracerWidth;
        particleMat.color.setHex(colorHex);
        particleMat.size = getTracerPointSize();

        trail.path.visible = shouldShowTracerLine();
        trail.particles.visible = shouldShowTracerPoints();
        
        if (linePositions.length >= 6) {
            trail.path.computeLineDistances();
        }
        trail.path.updateMatrixWorld(true);
    } else {
        trail.path.visible = trail.particles.visible = false;
    }
}

function onKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target.closest && target.closest('.monaco-editor'))) return;

    if (event.key.toLowerCase() === 'escape') {
        if (transformControl?.object || selectedObject) handleDeselection();
        return;
    }

    if (!selectedObject) return;

    switch (event.key.toLowerCase()) {
        case 'delete': case 'backspace': deleteSelectedObject(); break;
        case 't': if (selectedObject) activateTransformMode('translate', selectedObject); break;
        case 'r': if (selectedObject) activateTransformMode('rotate', selectedObject); break;
        case 's': if (selectedObject) activateTransformMode('scale', selectedObject); break;
    }
}
