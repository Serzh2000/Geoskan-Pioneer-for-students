import { runMCETests } from './mce-events.js';

export function runIntegrationTests(droneMesh, camera, controls) {
    console.log('--- RUNNING INTEGRATION TESTS ---');
    let passed = true;
    
    // 1. Check if drone forward vector is +X
    const droneForward = new THREE.Vector3(1, 0, 0);
    droneForward.applyQuaternion(droneMesh.quaternion);
    if (Math.abs(droneForward.x - 1) > 0.01 || Math.abs(droneForward.y) > 0.01) {
        console.error('TEST FAILED: Drone is not facing +X. Forward vector:', droneForward);
        passed = false;
    } else {
        console.log('OK: Drone is facing +X');
    }

    // 2. Check if arrow points to +Y (as requested by user)
    const arrow = droneMesh.getObjectByName('orientation_arrow');
    if (arrow) {
        const arrowHead = arrow.children[1];
        const localPos = arrowHead.position.clone(); // Should be (0, 0.1, 0)
        // Since the arrow head is along Y
        if (Math.abs(localPos.y - 0.1) > 0.001) {
            console.error('TEST FAILED: Arrow head is not at +Y locally.');
            passed = false;
        } else {
            console.log('OK: Arrow points to +Y');
        }
    } else {
        console.error('TEST FAILED: orientation_arrow not found');
        passed = false;
    }

    // 3. Check Camera LookAt in Chase Mode
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    if (camDir.x < 0.5) {
        console.error('TEST FAILED: Camera is not looking along +X. Direction:', camDir);
        passed = false;
    } else {
        console.log('OK: Camera is looking along +X');
    }
    
    // 4. Check OrbitControls tilt limits (-90 to +90 equivalent)
    if (controls) {
        if (controls.minPolarAngle !== 0 || controls.maxPolarAngle !== Math.PI) {
            console.error(`TEST FAILED: OrbitControls polar angle limits are not 0 to PI. Found: ${controls.minPolarAngle} to ${controls.maxPolarAngle}`);
            passed = false;
        } else {
            console.log('OK: OrbitControls pitch limits cover full -90 to +90 degrees');
        }
    }

    if (passed) {
        console.log('--- ALL INTEGRATION TESTS PASSED ---');
    }
    
    // Run MCE unit tests
    runMCETests();
}
