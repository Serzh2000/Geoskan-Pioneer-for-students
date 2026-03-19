import * as THREE from 'three';
import { simState } from './state.js';

export let envGroup: THREE.Group;

export function setupEnvironment(scene: THREE.Scene) {
    // Lights
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

    // Environment Group
    envGroup = new THREE.Group();
    scene.add(envGroup);

    // Ground Plane with Grid Texture
    const groundSize = 200;
    const groundGeom = new THREE.PlaneGeometry(groundSize, groundSize);
    
    // Procedural Grid Texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0,0,1024,1024);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        // 1m grid
        const step = 64; 
        for(let i=0; i<=1024; i+=step) {
            ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,1024); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(1024,i); ctx.stroke();
        }
        // Subgrid
        ctx.strokeStyle = '#172033';
        ctx.lineWidth = 1;
        const subStep = 16;
        for(let i=0; i<=1024; i+=subStep) {
            if (i%step === 0) continue;
            ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,1024); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(1024,i); ctx.stroke();
        }
    }
    
    const gridTex = new THREE.CanvasTexture(canvas);
    gridTex.wrapS = THREE.RepeatWrapping;
    gridTex.wrapT = THREE.RepeatWrapping;
    gridTex.repeat.set(groundSize/16, groundSize/16);
    gridTex.anisotropy = 16;
    gridTex.colorSpace = THREE.SRGBColorSpace;

    const groundMat = new THREE.MeshStandardMaterial({ 
        map: gridTex,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.receiveShadow = true;
    envGroup.add(ground);

    createObstacles();

    const axesHelper = new THREE.AxesHelper(2);
    axesHelper.position.z = 0.01;
    scene.add(axesHelper);

    createAxesLabels(scene);
}

function createObstacles() {
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

function createAxesLabels(scene: THREE.Scene) {
    const makeLabel = (text: string, pos: THREE.Vector3, color: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = color;
            ctx.font = 'bold 48px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(text, 32, 48);
        }
        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex });
        const sprite = new THREE.Sprite(mat);
        sprite.position.copy(pos);
        sprite.scale.set(0.5, 0.5, 0.5);
        scene.add(sprite);
    };
    makeLabel('X', new THREE.Vector3(2.2, 0, 0.2), '#f87171');
    makeLabel('Y', new THREE.Vector3(0, 2.2, 0.2), '#4ade80');
    makeLabel('Z', new THREE.Vector3(0, 0, 2.2), '#38bdf8');
}

export function createGateMesh() {
    const group = new THREE.Group();
    group.userData.draggable = true;
    group.userData.type = 'Ворота';
    
    const mat = new THREE.MeshStandardMaterial({ color: 0xff8800, roughness: 0.7, emissive: 0xff4400, emissiveIntensity: 0.1 });
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.5 });
    
    const legGeom = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const leg1 = new THREE.Mesh(legGeom, mat); leg1.position.set(0, -0.75, 1); leg1.rotation.x = Math.PI/2;
    const leg2 = new THREE.Mesh(legGeom, mat); leg2.position.set(0, 0.75, 1); leg2.rotation.x = Math.PI/2;
    group.add(leg1); group.add(leg2);
    
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.1, 16, 32), ringMat);
    torus.position.z = 1.5;
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

export function addObjectToScene(type: string, camera: THREE.Camera) {
    if (!envGroup) return null;
    let obj: THREE.Object3D | undefined;
    if (type === 'gate') obj = createGateMesh();
    else if (type === 'pylon') obj = createPylonMesh();
    else if (type === 'flag') obj = createFlagMesh();
    
    if (obj) {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.multiplyScalar(5);
        const pos = camera.position.clone().add(dir);
        obj.position.set(pos.x, pos.y, 0); 
        envGroup.add(obj);
        return obj;
    }
    return null;
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
