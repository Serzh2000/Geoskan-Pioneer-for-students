import * as THREE from 'three';

export function setupLights(scene: THREE.Scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
    scene.add(ambientLight);
    
    // Main top-down light for clean shadows
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.45);
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

    // Soft fills for a bright engineering lab look
    const fill1 = new THREE.DirectionalLight(0xffffff, 0.42);
    fill1.position.set(-15, 10, 5);
    scene.add(fill1);

    const fill2 = new THREE.DirectionalLight(0xfff3eb, 0.28);
    fill2.position.set(15, -10, 5);
    scene.add(fill2);
    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe5e7eb, 0.8);
    scene.add(hemiLight);
}
