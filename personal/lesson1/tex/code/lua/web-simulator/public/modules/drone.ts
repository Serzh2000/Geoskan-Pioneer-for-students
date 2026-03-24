/**
 * Главный модуль 3D-сцены (Three.js).
 * Экспортирует функции для инициализации и обновления сцены.
 */
import * as THREE from 'three';
import { drones, simState, pathPoints, MAX_PATH_POINTS, currentDroneId, simSettings } from './state.js';
import { log } from './ui/logger.js';
import { addObjectToScene, envGroup } from './environment.js';
import { createDroneModel, updateLEDs, animateRotors } from './drone-model.js';
import { updateCamera } from './camera.js';
import { 
    initScene, scene, camera, renderer, controls, transformControl, 
    transformHelper, raycaster, mouse, selectionHelper, 
    droneMeshes, droneTrails, is3DActive, selectedObject, 
    pointerDownPos, isHittingGizmo, setSelectedObject, setPointerDownPos, setIsHittingGizmo, onWindowResize 
} from './scene/scene-init.js';
import { setupTransformControlListeners } from './scene/transform.js';
import { onPointerDown, onPointerUp, handleSelection } from './scene/input.js';
import { handleDeselection, deselectObject } from './scene/selection.js';
import { 
    getSceneTopLevelObjects, findSceneObjectById, activateTransformMode, 
    getSelectedSceneObjectId, resetDroneToOrigin, deleteSelectedObject, 
    duplicateObject, addObject, TransformMode
} from './scene/object-manager.js';

(window as any).scene = scene;
(window as any).camera = camera;
(window as any).setSelectedObject = setSelectedObject;

export { is3DActive, selectedObject, droneMeshes, envGroup, scene };
export { 
    addObject, deleteSelectedObject, duplicateObject, resetDroneToOrigin,
    listSceneObjects, selectSceneObjectById, deleteSceneObjectById, 
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
}

export function init3D(container: HTMLElement) {
    try {
        initScene(container);
        setupTransformControlListeners();

        transformControl.addEventListener('mouseDown', () => setIsHittingGizmo(true));
        transformControl.addEventListener('mouseUp', () => setIsHittingGizmo(false));

        // Init Drones
        syncDrones();

        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        renderer.domElement.addEventListener('pointerup', onPointerUp);
        renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('keydown', onKeyDown);

        log('3D-сцена загружена.', 'success');
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
                delete droneTrails[id];
            }
            delete droneMeshes[id];
        }
    }
}

function initTrailForDrone(id: string) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_PATH_POINTS * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setDrawRange(0, 0);

    const colorHex = parseInt(simSettings.tracerColor.replace('#', ''), 16);

    const pathMat = new THREE.LineBasicMaterial({ 
        color: colorHex, linewidth: simSettings.tracerWidth, transparent: true, opacity: 0.6 
    });
    // Используем THREE.Line, так как LineBasicMaterial работает с ним
    const path = new THREE.Line(geo, pathMat);
    path.frustumCulled = false;

    const particleMat = new THREE.PointsMaterial({
        color: colorHex, size: simSettings.tracerWidth * 0.025, sizeAttenuation: true, transparent: true, opacity: 0.8
    });
    const particles = new THREE.Points(geo, particleMat);
    particles.frustumCulled = false;
    
    scene.add(path);
    scene.add(particles);
    
    droneTrails[id] = { path, particles, geo };
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

    const drone = drones[id];
    const pts = pathPoints[id] || [];
    const trail = droneTrails[id];

    if (simSettings.showTracer && pts.length > 1) {
        const pos = trail.geo.attributes.position.array as Float32Array;
        for (let i = 0; i < pts.length; i++) {
            pos[i * 3] = pts[i].x;
            pos[i * 3 + 1] = pts[i].y;
            pos[i * 3 + 2] = pts[i].z;
        }
        trail.geo.setDrawRange(0, pts.length);
        trail.geo.attributes.position.needsUpdate = true;
        
        const pathMat = trail.path.material as THREE.LineBasicMaterial;
        const particleMat = trail.particles.material as THREE.PointsMaterial;
        
        const colorHex = parseInt(simSettings.tracerColor.replace('#', ''), 16);
        pathMat.color.setHex(colorHex);
        pathMat.linewidth = simSettings.tracerWidth;
        particleMat.color.setHex(colorHex);
        particleMat.size = simSettings.tracerWidth * 0.025;

        // В Three.js WebGLRenderer иногда плохо работает с linewidth != 1
        // Но видимость должна работать корректно
        trail.path.visible = simSettings.tracerShape === 'line' || simSettings.tracerShape === 'both';
        trail.particles.visible = simSettings.tracerShape === 'points' || simSettings.tracerShape === 'both';
        
        // Форсируем обновление матрицы для пути
        trail.path.updateMatrixWorld();
    } else {
        trail.path.visible = trail.particles.visible = false;
    }
}

function onKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target.closest && target.closest('.monaco-editor'))) return;
    if (!selectedObject) return;

    switch (event.key.toLowerCase()) {
        case 'delete': case 'backspace': deleteSelectedObject(); break;
        case 'escape': handleDeselection(); break;
        case 't': if (selectedObject) activateTransformMode('translate', selectedObject); break;
        case 'r': if (selectedObject) activateTransformMode('rotate', selectedObject); break;
        case 's': if (selectedObject) activateTransformMode('scale', selectedObject); break;
    }
}
