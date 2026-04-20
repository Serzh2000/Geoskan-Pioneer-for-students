import * as THREE from 'three';
import { setCommonMeta, applyShadows } from './utils.js';

export function createStyledLandingPad(text: string, bgColor = '#2563eb', textColor = '#ffffff') {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 15;
        ctx.strokeRect(15, 15, 226, 226);
        
        if (text !== 'H') {
            ctx.setLineDash([20, 10]);
            ctx.strokeRect(35, 35, 186, 186);
            ctx.setLineDash([]);
        }

        ctx.fillStyle = textColor;
        ctx.font = 'bold 120px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.MeshStandardMaterial({ map: tex, transparent: true, opacity: 0.95 })
    );
    setCommonMeta(mesh, `Площадка ${text}`, { collidableRadius: 1 });
    mesh.position.z = 0.01;
    return mesh;
}

export function createLandingPad(scene: THREE.Scene, pos: THREE.Vector3) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    if (ctx) {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, 0, 128, 128);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 10;
        ctx.strokeRect(10, 10, 108, 108);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 84px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('H', 64, 68);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.CircleGeometry(0.9, 48);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.92 });
    const pad = new THREE.Mesh(geometry, material);

    pad.position.copy(pos);
    pad.position.z += 0.015;
    pad.name = 'landing_pad';
    pad.userData = { type: 'pad' };
    scene.add(pad);
    return pad;
}

export function createTransportMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Транспорт', { collidableRadius: 0.5 });
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.4, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    body.position.z = 0.2;
    group.add(body);
    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.35, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    roof.position.set(-0.1, 0, 0.45);
    group.add(roof);
    applyShadows(group);
    return group;
}
