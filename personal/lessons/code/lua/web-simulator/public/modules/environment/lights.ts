import * as THREE from 'three';

export function setupLights(scene: THREE.Scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Increased ambient to lighten shadows
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(20, 40, 30); // Moved light to cast shadow at an angle
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -30;
    mainLight.shadow.camera.right = 30;
    mainLight.shadow.camera.top = 30;
    mainLight.shadow.camera.bottom = -30;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);
    
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 0.4);
    scene.add(hemiLight);
}
