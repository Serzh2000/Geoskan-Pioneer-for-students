import * as THREE from 'three';
import { simState } from './state.js';

export function createDroneModel() {
    const droneGroup = new THREE.Group();
    
    // Materials
    const carbonMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        roughness: 0.4, 
        metalness: 0.3
    });
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.6 });
    const plasticMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.9 });
    const propMatCW = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, transparent: true, opacity: 0.9 });
    const propMatCCW = new THREE.MeshStandardMaterial({ color: 0xf87171, transparent: true, opacity: 0.9 });

    // Frame Plates
    const plateGeom = new THREE.BoxGeometry(0.14, 0.14, 0.002);
    const bottomPlate = new THREE.Mesh(plateGeom, carbonMat);
    bottomPlate.position.z = -0.015;
    bottomPlate.castShadow = true;
    droneGroup.add(bottomPlate);
    
    const topPlate = new THREE.Mesh(plateGeom, carbonMat);
    topPlate.position.z = 0.035;
    topPlate.castShadow = true;
    droneGroup.add(topPlate);
    
    // Stack
    const stackGeom = new THREE.BoxGeometry(0.06, 0.06, 0.03);
    const stack = new THREE.Mesh(stackGeom, pcbMat);
    stack.position.z = 0.01;
    stack.castShadow = true;
    droneGroup.add(stack);

    // Arms
    const armGeom = new THREE.BoxGeometry(0.45, 0.03, 0.01);
    const arm1 = new THREE.Mesh(armGeom, plasticMat);
    arm1.rotation.z = Math.PI / 4;
    arm1.castShadow = true;
    droneGroup.add(arm1);
    const arm2 = new THREE.Mesh(armGeom, plasticMat);
    arm2.rotation.z = -Math.PI / 4;
    arm2.castShadow = true;
    droneGroup.add(arm2);

    // Battery
    const batGeom = new THREE.BoxGeometry(0.09, 0.04, 0.025);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 });
    const battery = new THREE.Mesh(batGeom, batMat);
    battery.position.z = -0.04;
    battery.castShadow = true;
    droneGroup.add(battery);

    // Camera Module (Front)
    const camGroup = new THREE.Group();
    camGroup.position.set(0.07, 0, 0.02);
    
    const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0x000000 }));
    camGroup.add(camBody);
    
    const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.01, 16),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0, metalness: 0.8 })
    );
    lens.rotation.z = Math.PI / 2;
    lens.position.x = 0.01;
    camGroup.add(lens);
    
    // FPV Camera Logic Object
    const fpvCamera = new THREE.PerspectiveCamera(80, 16/9, 0.01, 1000);
    fpvCamera.rotation.set(0, -Math.PI / 2, -Math.PI / 2); 
    fpvCamera.position.x = 0.02;
    camGroup.add(fpvCamera);
    window.fpvCamera = fpvCamera;
    
    droneGroup.add(camGroup);

    // Antenna
    const ant = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.002, 0.08, 8),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    ant.position.set(-0.05, 0, 0.08);
    ant.rotation.x = 0.2;
    droneGroup.add(ant);

    // Orientation Arrow
    const arrowHelper = new THREE.Group();
    arrowHelper.name = 'orientation_arrow';
    const arrowShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.2, 12), new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 }));
    arrowShaft.rotation.z = 0; 
    arrowHelper.add(arrowShaft);
    
    const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.06, 12), new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 }));
    arrowHead.position.y = 0.1; 
    arrowHelper.add(arrowHead);
    
    arrowHelper.position.z = 0.15;
    droneGroup.add(arrowHelper);

    // Motors & Props
    const motorGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.03, 16);
    const armLen = 0.16;
    const motorOffsets = [
        [armLen, -armLen],  // FR
        [-armLen, armLen],  // BL
        [armLen, armLen],   // FL
        [-armLen, -armLen]  // BR
    ];
    
    motorOffsets.forEach((offset, i) => {
        const motor = new THREE.Mesh(motorGeom, motorMat);
        motor.position.set(offset[0], offset[1], 0.02);
        motor.rotation.x = Math.PI / 2;
        motor.castShadow = true;
        droneGroup.add(motor);
        
        const propGroup = new THREE.Group();
        propGroup.name = `rotor_${i}`;
        propGroup.position.set(offset[0], offset[1], 0.04);
        
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.01, 8), motorMat);
        hub.rotation.x = Math.PI / 2;
        propGroup.add(hub);
        
        const isDiag1 = (i === 0 || i === 1);
        const bladeMat = isDiag1 ? propMatCW : propMatCCW;
        const bladeGeom = new THREE.BoxGeometry(0.12, 0.015, 0.001);
        
        const blade = new THREE.Mesh(bladeGeom, bladeMat);
        blade.rotation.x = 0.1 * (isDiag1 ? 1 : -1);
        propGroup.add(blade);
        
        droneGroup.add(propGroup);
    });

    return droneGroup;
}

export function updateLEDs(droneMesh: THREE.Object3D) {
    if (simState.leds && simState.leds.length > 0) {
        const ledCount = 4;
        for (let i = 0; i < ledCount; i++) {
            const led = simState.leds[i] || {r:0, g:0, b:0, w:0};
        let ledMesh = droneMesh.getObjectByName(`led_${i}`) as THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | undefined;
        if (!ledMesh) {
            const ledGeom = new THREE.SphereGeometry(0.012, 12, 12);
            const ledMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            ledMesh = new THREE.Mesh(ledGeom, ledMat);
            ledMesh.name = `led_${i}`;
            const offset = 0.04;
            const positions = [[offset, offset], [offset, -offset], [-offset, -offset], [-offset, offset]];
            ledMesh.position.set(positions[i][0], positions[i][1], 0.038);
            droneMesh.add(ledMesh);
            const light = new THREE.PointLight(0x000000, 0, 0.4);
            light.name = `led_light_${i}`;
            ledMesh.add(light);
        }
        if (ledMesh) {
            const color = new THREE.Color((led.r||0)/255, (led.g||0)/255, (led.b||0)/255);
            ledMesh.material.color.set(color);
            const light = ledMesh.getObjectByName(`led_light_${i}`) as THREE.PointLight | undefined;
            if (light) {
                light.color.set(color);
                light.intensity = (led.r + led.g + led.b > 0) ? 0.6 : 0;
            }
        }
    }
}
}

export function animateRotors(droneMesh: THREE.Object3D, dt: number) {
    if (!simState.running) return;
    const isArmed = simState.status !== 'ГОТОВ' && simState.status !== 'IDLE' && simState.status !== 'ПРИЗЕМЛЕН' && simState.status !== 'ОСТАНОВЛЕН' && simState.status !== 'ЗАПУСК';
    if (isArmed) {
        for (let i = 0; i < 4; i++) {
            const rotor = droneMesh.getObjectByName(`rotor_${i}`);
            if (rotor) {
                const dir = (i === 0 || i === 1) ? 1 : -1; 
                const speed = (simState.status === 'ВЗВЕДЕН') ? 15 : 40; // Rad/s
                rotor.rotation.z += speed * dir * dt;
            }
        }
    }
}
