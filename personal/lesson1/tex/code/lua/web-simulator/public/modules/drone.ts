import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { simState, pathPoints, MAX_PATH_POINTS } from './state.js';
import { log } from './ui/logger.js';
import { setupEnvironment, envGroup, addObjectToScene } from './environment.js';
import { createDroneModel, updateLEDs, animateRotors } from './drone-model.js';
import { updateCamera } from './camera.js';

console.log('[3D] Module drone.ts loaded');

// --- Global Engine Objects ---
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls;
let droneMesh: THREE.Object3D;
let transformControl: TransformControls;
let raycaster: THREE.Raycaster, mouse: THREE.Vector2;
let selectionHelper: THREE.BoxHelper;

// --- Trail Visualization ---
let flightPath: THREE.Line;
let pathParticles: THREE.Points;
let pathGeometry: THREE.BufferGeometry;
let positionsBuffer: Float32Array;

// --- Interaction State ---
export let is3DActive = false;
let canvasContainer: HTMLElement;
let selectedObject: THREE.Object3D | null = null;
let pointerDownPos = new THREE.Vector2();
let isHittingGizmo = false;

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
        
        transformControl.addEventListener('change', () => {
            if (selectionHelper) selectionHelper.update();
            
            if (selectedObject) {
                if (selectedObject === droneMesh) {
                    simState.pos.x = selectedObject.position.x;
                    simState.pos.y = selectedObject.position.y;
                    simState.pos.z = Math.max(0, selectedObject.position.z);
                    selectedObject.position.z = simState.pos.z;
                } else if (selectedObject.userData.draggable) {
                    selectedObject.position.z = Math.max(0, selectedObject.position.z);
                }
            }
        });

        transformControl.addEventListener('dragging-changed', (event: any) => {
            const isDragging = event.value;
            (window as any).isTransforming = isDragging;
            if (controls) controls.enabled = !isDragging && (window as any).cameraMode === 'free';
        });

        scene.add(transformControl);
        (window as any).transformControl = transformControl;

        // 4. Selection Visualizer
        const dummy = new THREE.Object3D();
        scene.add(dummy);
        selectionHelper = new THREE.BoxHelper(dummy, 0x38bdf8);
        if (selectionHelper.material && !Array.isArray(selectionHelper.material)) {
            selectionHelper.material.depthTest = false;
        }
        selectionHelper.visible = false;
        selectionHelper.renderOrder = 9999;
        scene.add(selectionHelper);

        // 5. Environment & Drone
        setupEnvironment(scene);
        droneMesh = createDroneModel();
        droneMesh.up.set(0, 0, 1);
        scene.add(droneMesh);

        // 6. Trail System
        initTrail();

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
        
        updateCamera(camera, droneMesh, controls, (window as any).cameraMode || 'drone');
        
    } catch (e: any) {
        is3DActive = false;
        console.error('[3D] Critical error during init3D:', e);
        log(`Ошибка 3D: ${e.message}`, 'error');
    }
}

function initTrail() {
    pathGeometry = new THREE.BufferGeometry();
    positionsBuffer = new Float32Array(MAX_PATH_POINTS * 3);
    pathGeometry.setAttribute('position', new THREE.BufferAttribute(positionsBuffer, 3));
    pathGeometry.setDrawRange(0, 0);

    const lineMat = new THREE.LineBasicMaterial({ 
        color: 0x00ffff, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false
    });
    flightPath = new THREE.Line(pathGeometry, lineMat);
    flightPath.renderOrder = 9997;
    flightPath.frustumCulled = false;
    scene.add(flightPath);

    const pointMat = new THREE.PointsMaterial({ 
        color: 0x38bdf8, size: 0.18, transparent: true, opacity: 0.7, depthTest: false, depthWrite: false
    });
    pathParticles = new THREE.Points(pathGeometry, pointMat);
    pathParticles.renderOrder = 9998;
    pathParticles.frustumCulled = false;
    scene.add(pathParticles);
}

function onPointerDown(event: PointerEvent) {
    pointerDownPos.set(event.clientX, event.clientY);
    
    if (!renderer || !camera || !transformControl) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const gizmoHits = raycaster.intersectObject(transformControl, true);
    isHittingGizmo = gizmoHits.length > 0 || (transformControl as any).axis !== null;
}

function onPointerUp(event: PointerEvent) {
    if (simState.running || (window as any).cameraMode === 'fpv') return;
    
    if (isHittingGizmo || transformControl.dragging || (transformControl as any).axis !== null) {
        isHittingGizmo = false;
        return;
    }

    const dist = pointerDownPos.distanceTo(new THREE.Vector2(event.clientX, event.clientY));
    if (dist > 5) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const targets = [droneMesh, ...(envGroup ? envGroup.children : [])].filter(o => o.visible);
    const intersects = raycaster.intersectObjects(targets, true);

    if (intersects.length > 0) {
        let obj: any = intersects[0].object;
        while (obj.parent && obj.parent !== scene && obj.parent !== envGroup) obj = obj.parent;

        if (obj === droneMesh || (obj.userData && obj.userData.draggable)) {
            handleSelection(obj, event.clientX, event.clientY);
            return;
        }
    }
    
    handleDeselection();
}

function handleSelection(obj: THREE.Object3D, x: number, y: number) {
    if (selectedObject && selectedObject !== obj) deselectObject();

    selectedObject = obj;
    
    const emissiveColor = new THREE.Color(0x38bdf8);
    selectedObject.traverse((node: any) => {
        if (node.isMesh && node.material) {
            if (node.userData.originalEmissive === undefined) {
                node.userData.originalEmissive = node.material.emissive ? node.material.emissive.getHex() : 0;
            }
            node.material.emissive = emissiveColor;
            node.material.emissiveIntensity = 0.6;
        }
    });

    if (selectionHelper) {
        selectionHelper.setFromObject(obj);
        selectionHelper.visible = true;
    }

    if ((window as any).showContextMenu) {
        (window as any).showContextMenu(x, y, 
            (mode: string) => {
                setTimeout(() => {
                    if (transformControl && selectedObject) {
                        transformControl.attach(selectedObject);
                        transformControl.setMode(mode as any);
                        transformControl.visible = true;
                        transformControl.enabled = true;
                        if (controls) controls.enabled = false;
                        log(`Инструмент: ${mode.toUpperCase()}`, 'info');
                    }
                }, 50);
            },
            () => deleteObject(),
            () => duplicateObject()
        );
    }
    
    log(`Выбран: ${obj.userData.type || 'Дрон'}`);
}

function handleDeselection() {
    if (selectedObject) deselectObject();
    if (transformControl) transformControl.detach();
    if ((window as any).hideContextMenu) (window as any).hideContextMenu();
    if (controls) controls.enabled = (window as any).cameraMode === 'free';
}

function deselectObject() {
    if (!selectedObject) return;
    
    selectedObject.traverse((node: any) => {
        if (node.isMesh && node.material) {
            node.material.emissive = new THREE.Color(node.userData.originalEmissive || 0);
            node.material.emissiveIntensity = 0;
        }
    });
    
    if (selectionHelper) selectionHelper.visible = false;
    selectedObject = null;
}

function deleteObject() {
    if (selectedObject && selectedObject !== droneMesh) {
        const obj = selectedObject;
        handleDeselection();
        if (envGroup) envGroup.remove(obj);
        log('Объект удален', 'info');
    }
}

function duplicateObject() {
    if (selectedObject && selectedObject !== droneMesh) {
        const clone = selectedObject.clone();
        clone.position.x += 1;
        clone.position.y += 1;
        if (envGroup) envGroup.add(clone);
        
        const lastX = pointerDownPos.x;
        const lastY = pointerDownPos.y;
        
        handleDeselection();
        handleSelection(clone, lastX, lastY);
        log('Объект дублирован', 'success');
    }
}

export function addObject(type: string) {
    const obj = addObjectToScene(type, camera);
    if (obj) {
        handleDeselection();
        handleSelection(obj, window.innerWidth / 2, window.innerHeight / 2);
    }
}

export function updateDrone3D(dt: number) {
    if (!is3DActive || !droneMesh || !renderer || !camera) return;
    
    if (simState.running && transformControl && transformControl.object) {
        transformControl.detach();
        if (selectionHelper) selectionHelper.visible = false;
    }
    
    if (transformControl && transformControl.object && !simState.running) {
        transformControl.visible = true;
    }
    
    if (selectionHelper && selectionHelper.visible) {
        const pulse = 1.0 + Math.sin(Date.now() * 0.005) * 0.1;
        selectionHelper.scale.set(pulse, pulse, pulse);
    }
    
    droneMesh.position.set(simState.pos.x, simState.pos.y, simState.pos.z);
    droneMesh.rotation.set(simState.orientation.roll, simState.orientation.pitch, simState.orientation.yaw, 'ZYX');

    updateLEDs(droneMesh);
    updateTrail();
    updateCamera(camera, droneMesh, controls, (window as any).cameraMode || 'drone');
    animateRotors(droneMesh, dt);
    
    const arrow = droneMesh.getObjectByName('orientation_arrow');
    if (arrow) {
        const scale = Math.max(1, camera.position.distanceTo(droneMesh.position) * 0.15);
        arrow.scale.set(scale, scale, scale);
    }

    renderer.render(scene, camera);
}

function updateTrail() {
    if (!is3DActive || !pathGeometry) return;

    const status = (simState.status || '').toUpperCase();
    const isFlying = simState.running && (
        status.includes('ПОЛЕТ') || status.includes('ВЗЛЕТ') || status.includes('ПОСАДКА') || status === 'ВЗВЕДЕН'
    );

    if (isFlying) {
        const last = pathPoints[pathPoints.length - 1];
        const distSq = last ? 
            (simState.pos.x - last.x)**2 + (simState.pos.y - last.y)**2 + (simState.pos.z - last.z)**2 : 
            100;

        if (distSq > 0.01) {
            pathPoints.push({ x: simState.pos.x, y: simState.pos.y, z: simState.pos.z });
            if (pathPoints.length > MAX_PATH_POINTS) pathPoints.shift();
        }
    }

    if (pathPoints.length > 1) {
        const pos = pathGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pathPoints.length; i++) {
            pos[i * 3] = pathPoints[i].x;
            pos[i * 3 + 1] = pathPoints[i].y;
            pos[i * 3 + 2] = pathPoints[i].z;
        }
        pathGeometry.setDrawRange(0, pathPoints.length);
        pathGeometry.attributes.position.needsUpdate = true;
        flightPath.visible = pathParticles.visible = true;
    } else {
        flightPath.visible = pathParticles.visible = false;
    }
}

function onKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target.closest && target.closest('.monaco-editor'))) return;
    if (!selectedObject) return;

    switch (event.key.toLowerCase()) {
        case 'delete': case 'backspace': deleteObject(); break;
        case 'escape': handleDeselection(); break;
        case 't': if (transformControl) transformControl.setMode('translate'); break;
        case 'r': if (transformControl) transformControl.setMode('rotate'); break;
        case 's': if (transformControl) transformControl.setMode('scale'); break;
    }
}

function onWindowResize() {
    if (!canvasContainer || !camera || !renderer) return;
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
}
