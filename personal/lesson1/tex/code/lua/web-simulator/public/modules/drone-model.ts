import * as THREE from 'three';
import { simState } from './state.js';

// Create a radial gradient texture for glowing LEDs
function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

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

    // 4 Base LEDs (under the motors or on the arms, let's put them on the arms)
    const baseLedOffsets = [
        [0.04, 0.04],   // FR
        [0.04, -0.04],  // BR
        [-0.04, -0.04], // BL
        [-0.04, 0.04]   // FL
    ];
    baseLedOffsets.forEach((offset, i) => {
        const ledGeom = new THREE.SphereGeometry(0.008, 12, 12);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const ledMesh = new THREE.Mesh(ledGeom, ledMat);
        ledMesh.name = `base_led_${i}`;
        ledMesh.position.set(offset[0], offset[1], 0.038);
        droneGroup.add(ledMesh);
        
        // Add a small light to each base LED
        const light = new THREE.PointLight(0x000000, 0, 0.4);
        light.name = `base_led_light_${i}`;
        ledMesh.add(light);
    });

    // LED Matrix 5x5 Module (Top)
    const ledMatrixGroup = new THREE.Group();
    ledMatrixGroup.position.z = 0.045; // Above the top plate
    const matrixBoardGeom = new THREE.BoxGeometry(0.07, 0.07, 0.002);
    const matrixBoardMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const matrixBoard = new THREE.Mesh(matrixBoardGeom, matrixBoardMat);
    matrixBoard.castShadow = true;
    ledMatrixGroup.add(matrixBoard);

    // 5x5 Physical LED meshes
    const ledSpacing = 0.012;
    const ledGeom = new THREE.BoxGeometry(0.008, 0.008, 0.002);
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const index = row * 5 + col;
            const xOffset = (col - 2) * ledSpacing;
            const yOffset = (2 - row) * ledSpacing;
            
            const ledMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const ledMesh = new THREE.Mesh(ledGeom, ledMat);
            ledMesh.name = `matrix_led_${index}`;
            ledMesh.position.set(xOffset, yOffset, 0.002); // slightly above board
            ledMatrixGroup.add(ledMesh);
        }
    }
    
    droneGroup.add(ledMatrixGroup);

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
    const fpvCamera = new THREE.PerspectiveCamera(80, 16/9, 0.01, 1000); // Минимальный near
    // Смещаем камеру вперед, поднимаем выше (0.05)
    fpvCamera.position.set(0.18, 0, 0.05); 
    fpvCamera.up.set(0, 0, 1); 
    // Направляем взгляд чуть вниз, чтобы не было видно горизонта отсечения под дроном
    fpvCamera.lookAt(new THREE.Vector3(1, 0, -0.1)); 
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

export function updateLEDs(droneMesh: THREE.Object3D, droneState: any) {
    if (!droneState.leds || droneState.leds.length === 0) return;

    // Update Base LEDs (0-3)
    for (let i = 0; i < 4; i++) {
        const led = droneState.leds[i] || {r:0, g:0, b:0, w:0};
        const ledMesh = droneMesh.getObjectByName(`base_led_${i}`) as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial> | undefined;
        
        if (ledMesh) {
            const r = (led.r || 0) / 255;
            const g = (led.g || 0) / 255;
            const b = (led.b || 0) / 255;
            const color = new THREE.Color(r, g, b);
            ledMesh.material.color.set(color);
            
            const light = ledMesh.getObjectByName(`base_led_light_${i}`) as THREE.PointLight | undefined;
            if (light) {
                light.color.set(color);
                light.intensity = (r + g + b > 0) ? 0.6 : 0;
            }
        }
    }

    // Update Matrix LEDs (4-28) using physical meshes
    for (let i = 0; i < 25; i++) {
        const stateIdx = i + 4;
        if (stateIdx >= droneState.leds.length) break;
        
        const led = droneState.leds[stateIdx];
        if (!led) continue;

        const ledMesh = droneMesh.getObjectByName(`matrix_led_${i}`) as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial> | undefined;
        if (ledMesh) {
            const r = (led.r || 0) / 255;
            const g = (led.g || 0) / 255;
            const b = (led.b || 0) / 255;
            ledMesh.material.color.setRGB(r, g, b);
        }
    }
}

export function animateRotors(droneMesh: THREE.Object3D, dt: number, droneState: any) {
    if (!droneState.running) return;
    const isArmed = droneState.status !== 'ГОТОВ' && droneState.status !== 'IDLE' && droneState.status !== 'ПРИЗЕМЛЕН' && droneState.status !== 'ОСТАНОВЛЕН' && droneState.status !== 'ЗАПУСК';
    if (isArmed) {
        for (let i = 0; i < 4; i++) {
            const rotor = droneMesh.getObjectByName(`rotor_${i}`);
            if (rotor) {
                const dir = (i === 0 || i === 1) ? 1 : -1; 
                const speed = (droneState.status === 'ВЗВЕДЕН') ? 15 : 40; // Rad/s
                rotor.rotation.z += speed * dir * dt;
            }
        }
    }
}
