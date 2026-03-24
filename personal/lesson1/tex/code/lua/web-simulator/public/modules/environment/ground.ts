import * as THREE from 'three';

export function createGround(scene: THREE.Scene, envGroup: THREE.Group) {
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
    ground.userData = { type: 'ground' };
    envGroup.add(ground);

    // Invisible plane for mouse interaction (Ground)
    const planeGeo = new THREE.PlaneGeometry(100, 100);
    const planeMat = new THREE.MeshBasicMaterial({ visible: false });
    const groundPlane = new THREE.Mesh(planeGeo, planeMat);
    groundPlane.name = 'Ground';
    scene.add(groundPlane);
}

export function createAxesLabels(scene: THREE.Scene) {
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
