import * as THREE from 'three';
import { SceneObjectOptions } from './types.js';
import { setCommonMeta, applyShadows } from './utils.js';

export function createApartmentBuildingMesh(options: SceneObjectOptions = {}) {
    const floors = Math.max(5, Math.min(20, options.floors ?? 9));
    const colors = [0xe5e7eb, 0xef4444, 0x2563eb, 0x10b981, 0xf59e0b];
    const bodyColor = colors[Math.floor(Math.random() * colors.length)];
    
    const group = setCommonMeta(new THREE.Group(), 'Многоэтажка', {
        floors,
        collidableRadius: 2.6
    });

    const width = 4.8;
    const depth = 3.6;
    const floorHeight = 0.72;
    const height = floors * floorHeight + 0.8;

    const base = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.4, depth + 0.4, 0.28),
        new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.95 })
    );
    base.position.z = 0.14;
    group.add(base);

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(width, depth, height),
        new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.92, metalness: 0.02 })
    );
    body.position.z = height * 0.5 + 0.28;
    group.add(body);

    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.2, depth + 0.2, 0.24),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 })
    );
    roof.position.z = height + 0.4;
    group.add(roof);

    const balconyMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.78, metalness: 0.08 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, emissive: 0xfef3c7, emissiveIntensity: 0.22, roughness: 0.65 });
    for (let floor = 0; floor < floors; floor++) {
        const z = 0.65 + floor * floorHeight + 0.45;
        for (let i = -1; i <= 1; i++) {
            const x = i * 1.3;

            const frontWindow = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.34), windowMat);
            frontWindow.position.set(x, depth * 0.5 + 0.05, z);
            group.add(frontWindow);

            const backWindow = frontWindow.clone();
            backWindow.position.y = -depth * 0.5 - 0.05;
            group.add(backWindow);

            const balcony = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.4, 0.08), balconyMat);
            balcony.position.set(x, depth * 0.5 + 0.18, z - 0.22);
            group.add(balcony);
        }
    }

    applyShadows(group);
    return group;
}
