import * as THREE from 'three';

export function setupLights(scene: THREE.Scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Main top-down light for clean shadows
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 20, 15);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -30;
    mainLight.shadow.camera.right = 30;
    mainLight.shadow.camera.top = 30;
    mainLight.shadow.camera.bottom = -30;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);

    // Soft fill lights with slight blue tint for dark environment
    const fill1 = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fill1.position.set(-15, 10, 5);
    scene.add(fill1);

    const fill2 = new THREE.DirectionalLight(0xffffff, 0.3);
    fill2.position.set(15, -10, 5);
    scene.add(fill2);
    
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.5);
    scene.add(hemiLight);
}
