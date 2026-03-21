import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { drones, simState, pathPoints, MAX_PATH_POINTS, currentDroneId } from './state.js';
import { log } from './ui/logger.js';
import { setupEnvironment, envGroup, addObjectToScene } from './environment.js';
import { createDroneModel, updateLEDs, animateRotors } from './drone-model.js';
import { updateCamera } from './camera.js';

console.log('[3D] Module drone.ts loaded');

// --- Global Engine Objects ---
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls;
let droneMeshes: Record<string, THREE.Object3D> = {};
let droneTrails: Record<string, { path: THREE.Line, particles: THREE.Points, geo: THREE.BufferGeometry }> = {};

let transformControl: TransformControls;
let transformHelper: THREE.Object3D;
let raycaster: THREE.Raycaster, mouse: THREE.Vector2;
let selectionHelper: THREE.BoxHelper;

// --- Interaction State ---
export let is3DActive = false;
let canvasContainer: HTMLElement;
let selectedObject: THREE.Object3D | null = null;
let pointerDownPos = new THREE.Vector2();
let isHittingGizmo = false;

const n = (value: number) => Number.isFinite(value) ? value.toFixed(2) : 'NaN';
const objectLabel = (obj: THREE.Object3D | null | undefined) => {
    if (!obj) return 'null';
    const type = (obj.userData && obj.userData.type) ? obj.userData.type : obj.type;
    const name = obj.name ? obj.name : 'unnamed';
    return `${type}/${name}`;
};
const objectPose = (obj: THREE.Object3D | null | undefined) => {
    if (!obj) return 'pos=(null)';
    return `pos=(${n(obj.position.x)}, ${n(obj.position.y)}, ${n(obj.position.z)}) rot=(${n(obj.rotation.x)}, ${n(obj.rotation.y)}, ${n(obj.rotation.z)})`;
};

export type TransformMode = 'translate' | 'rotate' | 'scale';
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

/**
 * Initialize the 3D Engine
 */
export function init3D(container: HTMLElement) {
    console.log('[3D] init3D called');
    canvasContainer = container;
    
    try {
        // 1. Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a);
        scene.fog = new THREE.FogExp2(0x0f172a, 0.02);

        const width = canvasContainer.clientWidth || window.innerWidth;
        const height = canvasContainer.clientHeight || window.innerHeight;
        const aspect = width / height;
        
        camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.shadowMap.enabled = true;
        
        canvasContainer.innerHTML = '';
        canvasContainer.appendChild(renderer.domElement);
        console.log('[3D] Renderer initialized and appended');

        // 2. Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enabled = false; 

        // 3. Transformation Gizmo
        transformControl = new TransformControls(camera, renderer.domElement);
        transformControl.size = 1.0;
        transformControl.visible = false;
        log('[3DDBG] TransformControls создан', 'info');
        
        transformControl.addEventListener('change', () => {
            if (selectionHelper) selectionHelper.update();
            const axis = (transformControl as any).axis || 'none';
            log(`[3DDBG] change axis=${axis} dragging=${transformControl.dragging} target=${objectLabel(selectedObject)} ${objectPose(selectedObject)}`, 'info');
            
            if (selectedObject) {
                let selectedDroneId: string | null = null;
                for (const id in droneMeshes) {
                    if (selectedObject === droneMeshes[id]) {
                        selectedDroneId = id;
                        break;
                    }
                }
                if (selectedDroneId) {
                    const drone = drones[selectedDroneId];
                    if (drone) {
                        drone.pos.x = selectedObject.position.x;
                        drone.pos.y = selectedObject.position.y;
                        drone.pos.z = Math.max(0, selectedObject.position.z);
                        selectedObject.position.z = drone.pos.z;
                        drone.orientation.yaw = selectedObject.rotation.z;
                        drone.target_alt = drone.pos.z;
                        drone.target_pos = { ...drone.pos };
                        drone.target_yaw = drone.orientation.yaw;
                    }
                } else if (selectedObject.userData && selectedObject.userData.draggable) {
                    selectedObject.position.z = Math.max(0, selectedObject.position.z);
                }
            }
        });

        transformControl.addEventListener('dragging-changed', (event: any) => {
            const isDragging = event.value;
            (window as any).isTransforming = isDragging;
            if (controls) controls.enabled = !isDragging && (window as any).cameraMode === 'free';
            log(`[3DDBG] dragging-changed value=${isDragging} controlsEnabled=${controls ? controls.enabled : false} axis=${(transformControl as any).axis || 'none'} target=${objectLabel(transformControl.object || selectedObject)}`, 'info');
        });
        transformControl.addEventListener('mouseDown', () => {
            isHittingGizmo = true;
            log(`[3DDBG] gizmo mouseDown axis=${(transformControl as any).axis || 'none'} target=${objectLabel(transformControl.object || selectedObject)}`, 'info');
        });
        transformControl.addEventListener('mouseUp', () => {
            isHittingGizmo = false;
            log(`[3DDBG] gizmo mouseUp axis=${(transformControl as any).axis || 'none'} target=${objectLabel(transformControl.object || selectedObject)}`, 'info');
        });

        transformHelper = (transformControl as any).getHelper ? (transformControl as any).getHelper() : (transformControl as unknown as THREE.Object3D);
        scene.add(transformHelper);
        transformHelper.visible = false;
        (window as any).transformControl = transformControl;

        // 4. Selection Visualizer
        const dummy = new THREE.Object3D();
        dummy.name = 'selection_dummy';
        scene.add(dummy);
        selectionHelper = new THREE.BoxHelper(dummy, 0x38bdf8);
        if (selectionHelper.material && !Array.isArray(selectionHelper.material)) {
            selectionHelper.material.depthTest = false;
        }
        selectionHelper.visible = false;
        selectionHelper.renderOrder = 9999;
        scene.add(selectionHelper);

        // 5. Environment & Drones
        setupEnvironment(scene);
        syncDrones();

        // 7. Interaction Listeners
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        renderer.domElement.addEventListener('pointerup', onPointerUp);
        renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('resize', onWindowResize);

        is3DActive = true;
        console.log('[3D] Initialization successful');
        log('3D-сцена загружена.', 'success');
        
        updateCamera(camera, droneMeshes[currentDroneId] || null, controls, (window as any).cameraMode || 'drone');
        
    } catch (e: any) {
        is3DActive = false;
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

    const pathMat = new THREE.LineBasicMaterial({ 
        color: 0x38bdf8, linewidth: 2, transparent: true, opacity: 0.6 
    });
    const path = new THREE.Line(geo, pathMat);
    path.frustumCulled = false;

    const particleMat = new THREE.PointsMaterial({
        color: 0x0ea5e9, size: 0.05, sizeAttenuation: true, transparent: true, opacity: 0.8
    });
    const particles = new THREE.Points(geo, particleMat);
    
    scene.add(path);
    scene.add(particles);
    
    droneTrails[id] = { path, particles, geo };
}

function onPointerDown(event: PointerEvent) {
    pointerDownPos.set(event.clientX, event.clientY);
    if (!transformControl) return;
    isHittingGizmo = transformControl.dragging || (transformControl as any).axis !== null;
    log(`[3DDBG] pointerDown x=${event.clientX} y=${event.clientY} dragging=${transformControl.dragging} axis=${(transformControl as any).axis || 'none'} isHittingGizmo=${isHittingGizmo}`, 'info');
}

function onPointerUp(event: PointerEvent) {
    if (simState.running || (window as any).cameraMode === 'fpv') return;
    if (!renderer || !camera || !transformControl || !raycaster) return;
    const hasActiveTransformTool = !!(transformControl.object && transformControl.visible);
    log(`[3DDBG] pointerUp x=${event.clientX} y=${event.clientY} hasActiveTool=${hasActiveTransformTool} dragging=${transformControl.dragging} axis=${(transformControl as any).axis || 'none'}`, 'info');
    
    if (isHittingGizmo || transformControl.dragging || (transformControl as any).axis !== null) {
        isHittingGizmo = false;
        log('[3DDBG] pointerUp пропущен из-за активного gizmo', 'info');
        return;
    }

    const dist = pointerDownPos.distanceTo(new THREE.Vector2(event.clientX, event.clientY));
    if (dist > 5) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const currentDrone = droneMeshes[currentDroneId];
    const targets = currentDrone ? [currentDrone, ...(envGroup ? envGroup.children : [])].filter(o => o && o.visible && o.layers) : [...(envGroup ? envGroup.children : [])].filter(o => o && o.visible && o.layers);
    
    // Add all other drones to targets
    for (const id in droneMeshes) {
        if (id !== currentDroneId && droneMeshes[id]) {
            targets.push(droneMeshes[id]);
        }
    }
    
    log(`[3DDBG] raycast targets=${targets.length} ndc=(${n(mouse.x)}, ${n(mouse.y)})`, 'info');
    
    try {
        const intersects = raycaster.intersectObjects(targets, true);
        log(`[3DDBG] raycast intersects=${intersects.length}`, 'info');
        if (intersects.length > 0) {
            let obj: any = intersects[0].object;
            while (obj.parent && obj.parent !== scene && obj.parent !== envGroup) obj = obj.parent;
            log(`[3DDBG] raycast hit ${objectLabel(obj)} ${objectPose(obj)}`, 'info');

            let isDrone = false;
            for (const id in droneMeshes) {
                if (obj === droneMeshes[id]) isDrone = true;
            }

            if (isDrone || (obj.userData && obj.userData.draggable)) {
                handleSelection(obj, event.clientX, event.clientY);
                return;
            }
        }
    } catch (e) {
        console.warn('[3D] Raycasting failed:', e);
    }

    if (hasActiveTransformTool) return;
    log('[3DDBG] deselection по клику мимо объекта', 'info');
    handleDeselection();
}

function handleSelection(obj: THREE.Object3D, x: number, y: number, showMenu = true) {
    log(`[3DDBG] handleSelection target=${objectLabel(obj)} ${objectPose(obj)} at=(${x}, ${y})`, 'info');
    if (selectedObject && selectedObject !== obj) deselectObject();

    selectedObject = obj;
    
    const emissiveColor = new THREE.Color(0x38bdf8);
    selectedObject.traverse((node: any) => {
        if (node.isMesh && node.material) {
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach((mat: any) => {
                if (mat.emissive) {
                    if (mat.userData.originalEmissive === undefined) {
                        mat.userData.originalEmissive = mat.emissive.getHex();
                    }
                    mat.emissive.copy(emissiveColor);
                    mat.emissiveIntensity = 0.6;
                }
            });
        }
    });

    if (selectionHelper) {
        selectionHelper.setFromObject(obj);
        selectionHelper.visible = true;
    }

    if (showMenu && (window as any).showContextMenu) {
        let isDrone = false;
        for (const id in droneMeshes) {
            if (obj === droneMeshes[id]) isDrone = true;
        }

        (window as any).showContextMenu(x, y, 
            (mode: string) => {
                const target = selectedObject === obj ? selectedObject : obj;
                if (!transformControl || !target || !target.parent) {
                    log('Инструмент не активирован: объект не выбран', 'warn');
                    log(`[3DDBG] onTransform fail mode=${mode} transform=${!!transformControl} target=${objectLabel(target as any)}`, 'warn');
                    return;
                }
                const ok = activateTransformMode(mode as TransformMode, target);
                if (ok) {
                    log(`[3DDBG] onTransform success mode=${mode} target=${objectLabel(target)} ${objectPose(target)} controlsEnabled=${controls ? controls.enabled : false}`, 'info');
                }
            },
            () => deleteSelectedObject(),
            () => duplicateObject(),
            isDrone ? () => resetDroneToOrigin() : undefined
        );
        log(`[3DDBG] showContextMenu для ${objectLabel(obj)} at=(${x}, ${y})`, 'info');
    }
    
    log(`Выбран: ${obj.userData.type || 'Дрон'}`);
}

function handleDeselection() {
    log(`[3DDBG] handleDeselection selected=${objectLabel(selectedObject)} transformTarget=${objectLabel((transformControl && transformControl.object) ? transformControl.object : null)}`, 'info');
    if (selectedObject) deselectObject();
    if (transformControl) transformControl.detach();
    if (transformHelper) transformHelper.visible = false;
    if ((window as any).hideContextMenu) (window as any).hideContextMenu();
    if (controls) controls.enabled = (window as any).cameraMode === 'free';
    log(`[3DDBG] handleDeselection done controlsEnabled=${controls ? controls.enabled : false}`, 'info');
}

function deselectObject() {
    if (!selectedObject) return;
    log(`[3DDBG] deselectObject ${objectLabel(selectedObject)} ${objectPose(selectedObject)}`, 'info');
    
    selectedObject.traverse((node: any) => {
        if (node.isMesh && node.material) {
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach((mat: any) => {
                if (mat.emissive && mat.userData.originalEmissive !== undefined) {
                    mat.emissive.setHex(mat.userData.originalEmissive);
                    mat.emissiveIntensity = 0;
                }
            });
        }
    });
    
    if (selectionHelper) {
        selectionHelper.visible = false;
        const dummy = scene.getObjectByName('selection_dummy');
        if (dummy) selectionHelper.setFromObject(dummy);
    }
    selectedObject = null;
}

export function getSceneTopLevelObjects() {
    const objects: THREE.Object3D[] = [];
    for (const id in droneMeshes) {
        if (droneMeshes[id]) objects.push(droneMeshes[id]);
    }
    if (envGroup) objects.push(...envGroup.children);
    return objects;
}

function findSceneObjectById(id: string) {
    return getSceneTopLevelObjects().find((obj) => obj.uuid === id) || null;
}

function activateTransformMode(mode: TransformMode, target: THREE.Object3D) {
    if (!transformControl || !target || !target.parent) return false;
    transformControl.attach(target);
    transformControl.setMode(mode);
    transformControl.visible = true;
    if (transformHelper) transformHelper.visible = true;
    transformControl.enabled = true;
    if (controls) controls.enabled = false;
    log(`Инструмент: ${mode.toUpperCase()}`, 'info');
    log(`[3DDBG] activateTransformMode mode=${mode} target=${objectLabel(target)} ${objectPose(target)}`, 'info');
    return true;
}

export function getSelectedSceneObjectId() {
    return selectedObject ? selectedObject.uuid : null;
}

export function listSceneObjects(): SceneObjectInfo[] {
    const selectedId = selectedObject ? selectedObject.uuid : '';
    return getSceneTopLevelObjects().map((obj) => {
        let isDrone = false;
        for (const id in droneMeshes) {
            if (obj === droneMeshes[id]) isDrone = true;
        }
        return {
            id: obj.uuid,
            name: obj.name || (obj.userData?.type || obj.type),
            sceneType: obj.userData?.type || obj.type,
            objectType: obj.type,
            draggable: !!obj.userData?.draggable,
            isDrone: isDrone,
            selected: obj.uuid === selectedId,
            position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
            rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
            scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }
        };
    });
}

export function selectSceneObjectById(id: string) {
    const obj = findSceneObjectById(id);
    if (!obj) return false;
    handleSelection(obj, window.innerWidth / 2, window.innerHeight / 2, false);
    return true;
}

export function setSceneObjectTransformMode(mode: TransformMode, id?: string) {
    const target = id ? findSceneObjectById(id) : selectedObject;
    if (!target) return false;
    if (!selectedObject || selectedObject.uuid !== target.uuid) {
        handleSelection(target, window.innerWidth / 2, window.innerHeight / 2, false);
    }
    return activateTransformMode(mode, target);
}

export function deleteSceneObjectById(id: string) {
    const obj = findSceneObjectById(id);
    let isDrone = false;
    for (const droneId in droneMeshes) {
        if (obj === droneMeshes[droneId]) isDrone = true;
    }
    if (!obj || isDrone) return false;
    handleSelection(obj, window.innerWidth / 2, window.innerHeight / 2, false);
    deleteSelectedObject();
    return true;
}

export function resetDroneToOrigin() {
    const currentDrone = droneMeshes[currentDroneId];
    if (!currentDrone) return false;
    const droneState = drones[currentDroneId];
    
    if (simState.running) {
        log('Нельзя вернуть дрон в начало во время выполнения скрипта', 'warn');
        return false;
    }
    log(`[3DDBG] resetDroneToOrigin for ${currentDroneId}`, 'info');
    
    droneState.pos = { x: 0, y: 0, z: 0 };
    droneState.orientation = { roll: 0, pitch: 0, yaw: 0 };
    droneState.vel = { x: 0, y: 0, z: 0 };
    droneState.target_alt = 0;
    droneState.target_pos = { x: 0, y: 0, z: 0 };
    droneState.target_yaw = 0;
    currentDrone.position.set(0, 0, 0);
    currentDrone.rotation.set(0, 0, 0, 'ZYX');
    log(`Дрон ${currentDroneId} возвращен в начало системы координат`, 'success');
    log('[3DDBG] resetDroneToOrigin completed', 'success');
    
    if (selectedObject === currentDrone && transformControl) {
        transformControl.detach();
        transformControl.attach(currentDrone);
    }
    return true;
}

export function getObstacles() {
    return envGroup ? envGroup.children : [];
}

export function deleteSelectedObject() {
    let isDrone = false;
    for (const id in droneMeshes) {
        if (selectedObject === droneMeshes[id]) isDrone = true;
    }
    
    if (selectedObject && !isDrone) {
        const obj = selectedObject;
        log(`[3DDBG] deleteSelectedObject start ${objectLabel(obj)} ${objectPose(obj)}`, 'warn');

        handleDeselection();

        obj.traverse((child: any) => {
            if (child.isMesh) {
                if (child.geometry) {
                    child.geometry.dispose();
                }
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((material: THREE.Material) => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            }
        });

        obj.removeFromParent();

        log('Объект удален', 'info');
        log(`[3DDBG] deleteSelectedObject done ${objectLabel(obj)}`, 'warn');
    }
}

function duplicateObject() {
    let isDrone = false;
    for (const id in droneMeshes) {
        if (selectedObject === droneMeshes[id]) isDrone = true;
    }

    if (selectedObject && !isDrone) {
        log(`[3DDBG] duplicateObject source ${objectLabel(selectedObject)} ${objectPose(selectedObject)}`, 'info');
        const clone = selectedObject.clone();
        clone.position.x += 1;
        clone.position.y += 1;
        if (envGroup) envGroup.add(clone);
        
        const lastX = pointerDownPos.x;
        const lastY = pointerDownPos.y;
        
        handleDeselection();
        handleSelection(clone, lastX, lastY);
        log('Объект дублирован', 'success');
        log(`[3DDBG] duplicateObject clone ${objectLabel(clone)} ${objectPose(clone)}`, 'success');
    }
}

export function addObject(type: string) {
    log(`[3DDBG] addObject request type=${type}`, 'info');
    const obj = addObjectToScene(type, camera);
    if (obj) {
        handleDeselection();
        handleSelection(obj, window.innerWidth / 2, window.innerHeight / 2);
        log(`[3DDBG] addObject created ${objectLabel(obj)} ${objectPose(obj)}`, 'success');
    } else {
        log(`[3DDBG] addObject failed type=${type}`, 'warn');
    }
}

export function updateDrone3D(dt: number) {
    if (!is3DActive || !renderer || !camera) return;

    if (simState.running && transformControl && transformControl.object) {
        log(`[3DDBG] updateDrone3D detach while running target=${objectLabel(transformControl.object)}`, 'info');
        transformControl.detach();
        if (transformHelper) transformHelper.visible = false;
        if (selectionHelper) selectionHelper.visible = false;
    }
    
    if (transformControl && transformControl.object && !simState.running) {
        transformControl.visible = true;
        if (transformHelper) transformHelper.visible = true;
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

    if (pts.length > 1) {
        const pos = trail.geo.attributes.position.array as Float32Array;
        for (let i = 0; i < pts.length; i++) {
            pos[i * 3] = pts[i].x;
            pos[i * 3 + 1] = pts[i].y;
            pos[i * 3 + 2] = pts[i].z;
        }
        trail.geo.setDrawRange(0, pts.length);
        trail.geo.attributes.position.needsUpdate = true;
        trail.path.visible = trail.particles.visible = true;
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

function onWindowResize() {
    if (!canvasContainer || !camera || !renderer) return;
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
}
