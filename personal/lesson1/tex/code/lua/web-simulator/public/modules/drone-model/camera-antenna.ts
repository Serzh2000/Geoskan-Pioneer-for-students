import * as THREE from 'three';

export function createCameraAndAntenna() {
    const group = new THREE.Group();
    
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
    (window as any).fpvCamera = fpvCamera;
    
    group.add(camGroup);

    // Antenna
    const ant = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.002, 0.08, 8),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    ant.position.set(-0.05, 0, 0.08);
    ant.rotation.x = 0.2;
    group.add(ant);

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
    group.add(arrowHelper);
    
    return group;
}
