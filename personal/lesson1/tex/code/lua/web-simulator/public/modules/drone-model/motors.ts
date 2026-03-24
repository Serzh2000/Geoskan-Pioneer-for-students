import * as THREE from 'three';

export function createMotors(motorMat: THREE.Material, propMatCW: THREE.Material, propMatCCW: THREE.Material) {
    const motorsGroup = new THREE.Group();
    
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
        motorsGroup.add(motor);
        
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
        
        motorsGroup.add(propGroup);
    });

    return motorsGroup;
}
