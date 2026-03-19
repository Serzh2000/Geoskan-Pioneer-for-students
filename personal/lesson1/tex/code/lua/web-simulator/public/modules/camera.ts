import * as THREE from 'three';
import { simState } from './state.js';

export function updateCamera(camera: THREE.PerspectiveCamera, droneMesh: THREE.Object3D, controls: any, mode: string) {
    const overlay = document.getElementById('fpv-overlay');
    
    if (controls) {
        const isTransforming = (window as any).isTransforming || false;
        const hasAttachedObject = (window as any).transformControl && (window as any).transformControl.object;
        controls.enabled = (mode === 'free' && !isTransforming && !hasAttachedObject);
    }
    
    if (mode === 'fpv') {
        if (overlay) overlay.style.opacity = '1';
    } else {
        if (overlay) overlay.style.opacity = '0';
    }

    if (mode === 'drone') {
        const relativeOffset = new THREE.Vector3(-0.8, 0, 0.4);
        const cameraOffset = relativeOffset.applyMatrix4(droneMesh.matrixWorld);
        camera.position.lerp(cameraOffset, 0.1);
        const lookTarget = droneMesh.position.clone();
        lookTarget.z += 0.1; 
        const targetRotation = new THREE.Quaternion();
        const m = new THREE.Matrix4();
        m.lookAt(camera.position, lookTarget, camera.up);
        targetRotation.setFromRotationMatrix(m);
        camera.quaternion.slerp(targetRotation, 0.1);

    } else if (mode === 'fpv') {
        if (window.fpvCamera) {
            const camWorldPos = new THREE.Vector3();
            window.fpvCamera.getWorldPosition(camWorldPos);
            const camWorldRot = new THREE.Quaternion();
            window.fpvCamera.getWorldQuaternion(camWorldRot);
            camera.position.lerp(camWorldPos, 0.5);
            camera.quaternion.slerp(camWorldRot, 0.5);
            camera.rotateZ(-Math.PI / 2);
            // Ensure FPV camera is always updated
            window.fpvCamera.updateMatrixWorld();
        }
    } else if (mode === 'ground') {
        const groundPos = new THREE.Vector3(3, 3, 2);
        camera.position.lerp(groundPos, 0.05);
        const targetRotation = new THREE.Quaternion();
        const m = new THREE.Matrix4();
        m.lookAt(camera.position, droneMesh.position, camera.up);
        targetRotation.setFromRotationMatrix(m);
        camera.quaternion.slerp(targetRotation, 0.1);
        
    } else if (mode === 'free') {
        if (controls) controls.update();
    }
}
