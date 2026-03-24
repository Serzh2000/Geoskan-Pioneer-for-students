import * as THREE from 'three';
import { DroneOrbitControls } from './DroneOrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { log } from '../ui/logger.js';
import { setupEnvironment, envGroup } from '../environment.js';

export let scene: THREE.Scene;
export let camera: THREE.PerspectiveCamera;
export let renderer: THREE.WebGLRenderer;
export let controls: DroneOrbitControls;

export let transformControl: TransformControls;
export let transformHelper: THREE.Object3D;
export let raycaster: THREE.Raycaster;
export let mouse: THREE.Vector2;
export let selectionHelper: THREE.BoxHelper;

export let canvasContainer: HTMLElement;
export let droneMeshes: Record<string, THREE.Object3D> = {};
export let droneTrails: Record<string, { path: THREE.Line, particles: THREE.Points, geo: THREE.BufferGeometry }> = {};

export let is3DActive = false;
export let selectedObject: THREE.Object3D | null = null;
export let pointerDownPos = new THREE.Vector2();
export let isHittingGizmo = false;

export function setSelectedObject(obj: THREE.Object3D | null) {
    selectedObject = obj;
}

export function setPointerDownPos(x: number, y: number) {
    pointerDownPos.set(x, y);
}

export function setIsHittingGizmo(val: boolean) {
    isHittingGizmo = val;
}

export function initScene(container: HTMLElement) {
    canvasContainer = container;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.02);

    const width = canvasContainer.clientWidth || window.innerWidth;
    const height = canvasContainer.clientHeight || window.innerHeight;
    const aspect = width / height;
    
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.shadowMap.enabled = true;
    
    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(renderer.domElement);

    controls = new DroneOrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    
    controls.enabled = false; 

    controls.addEventListener('change', () => {
        // Убрано сверхподробное логирование вращения камеры
    });

    transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.size = 1.0;
    transformControl.visible = false;
    
    transformHelper = (transformControl as any).getHelper ? (transformControl as any).getHelper() : (transformControl as unknown as THREE.Object3D);
    scene.add(transformHelper);
    transformHelper.visible = false;
    (window as any).transformControl = transformControl;

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
    (window as any).selectionHelper = selectionHelper;

    setupEnvironment(scene);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    is3DActive = true;
}

export function onWindowResize() {
    if (!canvasContainer || !camera || !renderer) return;
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
}
