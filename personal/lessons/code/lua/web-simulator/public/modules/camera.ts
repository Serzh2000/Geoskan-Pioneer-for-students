import * as THREE from 'three';
import { simState } from './state.js';

function syncOrbitControlsFromCamera(camera: THREE.PerspectiveCamera, controls: any) {
    if (!controls) return;
    const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
    controls.radius = offset.length() || 10;
    controls.elevation = Math.asin(Math.max(-1, Math.min(1, offset.z / controls.radius)));
    controls.azimuth = Math.atan2(offset.y, offset.x);
}

export function updateCamera(camera: THREE.PerspectiveCamera, droneMesh: THREE.Object3D | null, controls: any, mode: string) {
    if (!camera) return;

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

    if (!droneMesh) {
        // Fallback to ground view if no drone selected
        if (mode !== 'free') {
            const groundPos = new THREE.Vector3(0, 0, 17.5);
            camera.position.lerp(groundPos, 0.05);
            const m = new THREE.Matrix4();
            m.lookAt(camera.position, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
            camera.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(m), 0.1);
        } else if (controls) {
            controls.update();
        }
        return;
    }

    if (mode === 'drone') {
        // Режим "Дрон" (chase) - плавное следование сверху
        const targetPos = droneMesh.position.clone();
        targetPos.z += 6; // Высота камеры для обзора (уменьшена в 2 раза)
        camera.position.lerp(targetPos, 0.1);
        
        // Направляем камеру строго вниз на дрон с правильной ориентацией карты (Y - верх экрана)
        const m = new THREE.Matrix4();
        m.lookAt(camera.position, droneMesh.position, new THREE.Vector3(0, 0, 1));
        camera.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(m), 0.1);

    } else if (mode === 'fpv') {
        if (window.fpvCamera) {
            const camWorldPos = new THREE.Vector3();
            window.fpvCamera.getWorldPosition(camWorldPos);
            const camWorldRot = new THREE.Quaternion();
            window.fpvCamera.getWorldQuaternion(camWorldRot);

            camera.position.lerp(camWorldPos, 0.5);
            camera.quaternion.slerp(camWorldRot, 0.5);
            
            // Ensure FPV camera is always updated
            window.fpvCamera.updateMatrixWorld();
        }
    } else if (mode === 'ground') {
        // Режим "Земля" - плавный переход к виду сверху
        const groundPos = new THREE.Vector3(0, 0, 17.5); // Высота уменьшена в 2 раза
        camera.position.lerp(groundPos, 0.05);
        
        // Направляем камеру строго вниз на центр сцены
        const m = new THREE.Matrix4();
        m.lookAt(camera.position, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
        camera.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(m), 0.1);
        
    } else if (mode === 'free') {
        if (controls) {
            // При переходе в свободный режим ставим камеру слева относительно прежнего
            // ракурса так, чтобы она смотрела вдоль оси Y на текущий объект.
            if ((window as any).lastCameraMode !== 'free') {
                const targetPos = droneMesh.position.clone();
                controls.target.copy(droneMesh.position);
                camera.position.copy(targetPos.add(new THREE.Vector3(0, -9, 6)));
                camera.up.set(0, 0, 1);
                syncOrbitControlsFromCamera(camera, controls);
                controls.update();
            }
            controls.update();
        }
    }
    
    (window as any).lastCameraMode = mode;
}
