import * as THREE from 'three';

export function createGateMesh() {
    const group = new THREE.Group();
    group.userData.draggable = true;
    group.userData.type = 'Ворота';
    
    const mat = new THREE.MeshStandardMaterial({ color: 0xff8800, roughness: 0.7, emissive: 0xff4400, emissiveIntensity: 0.1 });
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.5 });
    
    const legGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.5);
    const leg1 = new THREE.Mesh(legGeom, mat); leg1.position.set(0, -0.6, 0.75); leg1.rotation.x = Math.PI/2;
    const leg2 = new THREE.Mesh(legGeom, mat); leg2.position.set(0, 0.6, 0.75); leg2.rotation.x = Math.PI/2;
    group.add(leg1); group.add(leg2);
    
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 16, 32), ringMat);
    torus.position.z = 1.2;
    torus.rotation.y = Math.PI/2;
    group.add(torus);
    
    group.traverse((o: any) => { if((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; }});
    return group;
}

export function createPylonMesh() {
    const pylonGeom = new THREE.ConeGeometry(0.3, 2, 8);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.8 });
    const pylon = new THREE.Mesh(pylonGeom, pylonMat);
    pylon.rotation.x = Math.PI/2;
    pylon.position.z = 1;
    pylon.userData.draggable = true;
    pylon.userData.type = 'Пилон';
    pylon.castShadow = true;
    pylon.receiveShadow = true;
    return pylon;
}

export function createFlagMesh() {
    const group = new THREE.Group();
    group.userData.draggable = true;
    group.userData.type = 'Флаг';
    
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    pole.rotation.x = Math.PI/2;
    pole.position.z = 1;
    group.add(pole);
    
    const flag = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.6, 0.4), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
    flag.position.set(0, 0.3, 1.8);
    group.add(flag);
    
    return group;
}

export function createLandingPad(scene: THREE.Scene, pos: THREE.Vector3) {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(0,0,64,64);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('H', 32, 48);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.CircleGeometry(0.5, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.8 });
    const pad = new THREE.Mesh(geometry, material);
    
    pad.position.copy(pos);
    pad.position.z += 0.01;
    pad.name = 'landing_pad';
    pad.userData = { type: 'pad' };
    scene.add(pad);
    return pad;
}

export function createObstacles(envGroup: THREE.Group) {
    const gate1 = createGateMesh();
    gate1.position.set(5, 0, 0);
    envGroup.add(gate1);

    const gate2 = createGateMesh();
    gate2.position.set(5, 5, 0);
    gate2.rotation.z = Math.PI/4;
    envGroup.add(gate2);
    
    const gate3 = createGateMesh();
    gate3.position.set(5, -5, 0);
    gate3.rotation.z = -Math.PI/4;
    envGroup.add(gate3);
    
    for(let i=0; i<5; i++) {
        const pylon = createPylonMesh();
        pylon.position.set(-5, -5 + i*2.5, 1);
        envGroup.add(pylon);
    }
}
