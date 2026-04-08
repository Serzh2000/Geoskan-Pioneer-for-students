import * as THREE from 'three';

export function createFrame(carbonMat: THREE.Material, pcbMat: THREE.Material, plasticMat: THREE.Material) {
    const frameGroup = new THREE.Group();
    
    // Frame Plates
    const plateGeom = new THREE.BoxGeometry(0.14, 0.14, 0.002);
    const bottomPlate = new THREE.Mesh(plateGeom, carbonMat);
    bottomPlate.position.z = -0.015;
    bottomPlate.castShadow = true;
    frameGroup.add(bottomPlate);
    
    const topPlate = new THREE.Mesh(plateGeom, carbonMat);
    topPlate.position.z = 0.035;
    topPlate.castShadow = true;
    frameGroup.add(topPlate);
    
    // Stack
    const stackGeom = new THREE.BoxGeometry(0.06, 0.06, 0.03);
    const stack = new THREE.Mesh(stackGeom, pcbMat);
    stack.position.z = 0.01;
    stack.castShadow = true;
    frameGroup.add(stack);

    // Arms
    const armGeom = new THREE.BoxGeometry(0.45, 0.03, 0.01);
    const arm1 = new THREE.Mesh(armGeom, plasticMat);
    arm1.rotation.z = Math.PI / 4;
    arm1.castShadow = true;
    frameGroup.add(arm1);
    const arm2 = new THREE.Mesh(armGeom, plasticMat);
    arm2.rotation.z = -Math.PI / 4;
    arm2.castShadow = true;
    frameGroup.add(arm2);

    // Battery
    const batGeom = new THREE.BoxGeometry(0.09, 0.04, 0.025);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 });
    const battery = new THREE.Mesh(batGeom, batMat);
    battery.position.z = -0.04;
    battery.castShadow = true;
    frameGroup.add(battery);

    return frameGroup;
}
