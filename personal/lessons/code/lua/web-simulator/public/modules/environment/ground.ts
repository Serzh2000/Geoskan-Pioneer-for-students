import * as THREE from 'three';
import { createTrussArena } from './truss-arena.js';

export function createGround(scene: THREE.Scene, envGroup: THREE.Group) {
    const groundSize = 200;
    const groundGeom = new THREE.PlaneGeometry(groundSize, groundSize);
    
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const W = canvas.width;
        const H = canvas.height;
        
        // Base background - professional dark slate
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, W, H);

        // Draw coordinate grid
        const pxPerMeter = 102.4;

        // Minor grid lines (every 0.5m) - subtle blue
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i += 0.5) {
            const pos = i * pxPerMeter;
            ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, H); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(W, pos); ctx.stroke();
        }

        // Major grid lines (every 1m) - brighter blue
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 2;
        for (let i = 0; i <= 10; i += 1) {
            const pos = i * pxPerMeter;
            ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, H); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(W, pos); ctx.stroke();
        }

        // 10m boundary lines (thickest)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, W, H);

        // Add some digital noise/texture
        ctx.globalAlpha = 0.05;
        for (let i = 0; i < 5000; i++) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
        }
        ctx.globalAlpha = 1;
    }
    
    const gridTex = new THREE.CanvasTexture(canvas);
    gridTex.wrapS = THREE.RepeatWrapping;
    gridTex.wrapT = THREE.RepeatWrapping;
    gridTex.repeat.set(groundSize / 10, groundSize / 10);
    gridTex.anisotropy = 16;
    gridTex.colorSpace = THREE.SRGBColorSpace;

    const groundMat = new THREE.MeshStandardMaterial({ 
        map: gridTex,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.receiveShadow = true;
    ground.name = 'Ground';
    ground.userData = { type: 'ground' };
    scene.add(ground); // Explicitly add to scene for easier raycasting

    const arenaAccentMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.15,
        roughness: 0.5,
        metalness: 0.1
    });
    const arenaAccent = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), arenaAccentMat);
    arenaAccent.position.z = 0.01;
    ground.add(arenaAccent);

    const ringMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4,
        roughness: 0.2,
        metalness: 0.5,
        side: THREE.DoubleSide
    });
    const centerRing = new THREE.Mesh(new THREE.RingGeometry(1.35, 1.9, 64), ringMat);
    centerRing.position.z = 0.012;
    ground.add(centerRing);

    // Добавляем площадку H (Landing Pad) под дроном (0,0)
    const padGeom = new THREE.PlaneGeometry(2, 2);
    const padCanvas = document.createElement('canvas');
    padCanvas.width = 256; padCanvas.height = 256;
    const pctx = padCanvas.getContext('2d');
    if (pctx) {
        pctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        pctx.fillRect(0, 0, 256, 256);
        pctx.strokeStyle = '#38bdf8';
        pctx.lineWidth = 15;
        pctx.strokeRect(10, 10, 236, 236);
        pctx.fillStyle = '#38bdf8';
        pctx.font = 'bold 160px sans-serif';
        pctx.textAlign = 'center';
        pctx.textBaseline = 'middle';
        pctx.fillText('H', 128, 128);
    }
    const padTex = new THREE.CanvasTexture(padCanvas);
    const padMat = new THREE.MeshStandardMaterial({ map: padTex, transparent: true, opacity: 0.95 });
    const landingPad = new THREE.Mesh(padGeom, padMat);
    landingPad.position.set(0, 0, 0.015);
    ground.add(landingPad);

    const borderMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.1 });
    const cornerMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.5 });
    const borderSegments = [
        { x: 0, y: 8.4, w: 17.6, h: 0.34 },
        { x: 0, y: -8.4, w: 17.6, h: 0.34 },
        { x: 8.4, y: 0, w: 0.34, h: 17.6 },
        { x: -8.4, y: 0, w: 0.34, h: 17.6 }
    ];
    borderSegments.forEach(({ x, y, w, h }) => {
        const strip = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.08), borderMat);
        strip.position.set(x, y, 0.045);
        strip.receiveShadow = true;
        ground.add(strip);
    });

    [
        [7.95, 7.95],
        [-7.95, 7.95],
        [7.95, -7.95],
        [-7.95, -7.95]
    ].forEach(([x, y]) => {
        const corner = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.085), cornerMat);
        corner.position.set(x, y, 0.048);
        corner.receiveShadow = true;
        ground.add(corner);
    });

    envGroup.add(ground);

    // Добавляем фермовую конструкцию (Truss Arena) и сетку как на фото
    createTrussArena(envGroup);
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
