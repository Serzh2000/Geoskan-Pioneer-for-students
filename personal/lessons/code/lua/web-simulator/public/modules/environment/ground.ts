import * as THREE from 'three';

export function createGround(scene: THREE.Scene, envGroup: THREE.Group) {
    // Ground Plane (Geoscan Arena style)
    const groundSize = 200;
    const groundGeom = new THREE.PlaneGeometry(groundSize, groundSize);
    
    // Procedural "arena" texture (dark rubber + subtle pattern + grid + orange markings)
    const canvas = document.createElement('canvas');
    canvas.width = 2048; canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const W = canvas.width;
        const H = canvas.height;

        // Base
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(0, 0, W, H);

        // Subtle diagonal pattern
        ctx.globalAlpha = 0.18;
        ctx.strokeStyle = '#111c2f';
        ctx.lineWidth = 6;
        for (let i = -H; i < W + H; i += 96) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i - H, H);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Micro noise (cheap)
        ctx.globalAlpha = 0.08;
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * W;
            const y = Math.random() * H;
            const v = Math.floor(40 + Math.random() * 40);
            ctx.fillStyle = `rgb(${v},${v},${v})`;
            ctx.fillRect(x, y, 2, 2);
        }
        ctx.globalAlpha = 1;

        // Grid
        const stepMajor = 128;   // major grid
        const stepMinor = 32;    // minor grid

        ctx.strokeStyle = '#1e2b44';
        ctx.lineWidth = 1;
        for (let i = 0; i <= W; i += stepMinor) {
            if (i % stepMajor === 0) continue;
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
        }

        ctx.strokeStyle = '#2a3a5c';
        ctx.lineWidth = 2;
        for (let i = 0; i <= W; i += stepMajor) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
        }

        // Arena border + markings (orange)
        const pad = 140;
        const pad2 = 260;
        ctx.strokeStyle = '#ff6a00';
        ctx.lineWidth = 10;
        ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);

        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 6;
        ctx.strokeRect(pad2, pad2, W - pad2 * 2, H - pad2 * 2);
        ctx.globalAlpha = 1;

        // Corner "L" markers
        const mark = 90;
        const corners: Array<[number, number, number, number]> = [
            [pad, pad, 1, 1],
            [W - pad, pad, -1, 1],
            [pad, H - pad, 1, -1],
            [W - pad, H - pad, -1, -1]
        ];
        ctx.strokeStyle = '#ffb020';
        ctx.lineWidth = 14;
        corners.forEach(([cx, cy, sx, sy]) => {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + sx * mark, cy);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx, cy + sy * mark);
            ctx.stroke();
        });

        // Center text
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 120px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GEOSCAN', W / 2, H / 2 - 50);
        ctx.font = 'bold 64px sans-serif';
        ctx.fillText('ARENA', W / 2, H / 2 + 40);
        ctx.globalAlpha = 1;

        // Vignette
        const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.1, W / 2, H / 2, W * 0.75);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    }
    
    const gridTex = new THREE.CanvasTexture(canvas);
    gridTex.wrapS = THREE.RepeatWrapping;
    gridTex.wrapT = THREE.RepeatWrapping;
    // Keep markings readable at typical zoom levels
    gridTex.repeat.set(groundSize / 50, groundSize / 50);
    gridTex.anisotropy = 16;
    gridTex.colorSpace = THREE.SRGBColorSpace;

    const groundMat = new THREE.MeshStandardMaterial({ 
        map: gridTex,
        roughness: 0.95,
        metalness: 0.05
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
