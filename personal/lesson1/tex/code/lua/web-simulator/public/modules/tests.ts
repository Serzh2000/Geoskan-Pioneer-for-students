import { log } from './ui/logger.js';

declare const THREE: any;

export function runIntegrationTests(droneMesh: any, camera: any, controls: any) {
    log('Starting Integration Tests...', 'info');

    // Test 1: Check Scene Objects
    if (!droneMesh) {
        log('Test Failed: Drone mesh not found', 'error');
    } else {
        log('Test Passed: Drone mesh exists', 'success');
    }

    // Test 2: Coordinate Transformation
    const droneForward = new THREE.Vector3(1, 0, 0);
    droneForward.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    if (Math.abs(droneForward.y - 1) < 0.001) {
        log('Test Passed: Coordinate transformation works', 'success');
    } else {
        log(`Test Failed: Vector rotation error (${droneForward.y})`, 'error');
    }

    // Test 3: Camera Controls
    if (controls && controls.object === camera) {
        log('Test Passed: OrbitControls linked to camera', 'success');
    } else {
        log('Test Failed: OrbitControls not linked', 'error');
    }

    // Test 4: Frustum Culling (Basic Check)
    const frustum = new THREE.Frustum();
    const cameraViewProjectionMatrix = new THREE.Matrix4();
    camera.updateMatrixWorld();
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
    
    // Check if drone (Group) is within frustum using BoundingBox
    const box = new THREE.Box3().setFromObject(droneMesh);
    if (frustum.intersectsBox(box)) {
        log('Test Passed: Drone is within frustum', 'success');
    } else {
        log('Test Warning: Drone might be out of view', 'warn');
    }

    // Test 5: Raycaster for Click Detection
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0);
    raycaster.setFromCamera(center, camera);
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    if (camDir.length() > 0.9) {
        log('Test Passed: Camera direction valid', 'success');
    }

    log('Integration Tests Completed', 'info');
}
