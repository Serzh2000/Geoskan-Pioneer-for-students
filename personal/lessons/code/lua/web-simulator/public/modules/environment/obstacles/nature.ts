import * as THREE from 'three';
import { setCommonMeta, applyShadows } from './utils.js';

export function createHillMesh() {
    const geom = new THREE.ConeGeometry(2, 2.5, 12);
    const mat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.9 });
    const hill = setCommonMeta(new THREE.Mesh(geom, mat), 'Холм', { collidableRadius: 1.5 });
    hill.rotation.x = Math.PI / 2;
    hill.position.z = 1.25;
    applyShadows(hill);
    return hill;
}

export function createFirTreeMesh() {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.07, 0.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x5b4636 })
    );
    trunk.position.z = 0.2;
    trunk.rotation.x = Math.PI / 2;
    group.add(trunk);

    for (let i = 0; i < 3; i++) {
        const cone = new THREE.Mesh(
            new THREE.ConeGeometry(0.4 - i * 0.1, 0.6, 12),
            new THREE.MeshStandardMaterial({ color: 0x2d4a22 })
        );
        cone.position.z = 0.5 + i * 0.4;
        cone.rotation.x = Math.PI / 2;
        group.add(cone);
    }
    setCommonMeta(group, 'Ель', { collidableRadius: 0.4 });
    applyShadows(group);
    return group;
}

export function createTreeMesh(scale = 1) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08 * scale, 0.1 * scale, 0.9 * scale, 10),
        new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.95 })
    );
    trunk.position.z = 0.45 * scale;
    trunk.rotation.x = Math.PI / 2;
    group.add(trunk);

    const crown = new THREE.Mesh(
        new THREE.SphereGeometry(0.5 * scale, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.9 })
    );
    crown.position.z = 1.15 * scale;
    group.add(crown);

    setCommonMeta(group, 'Дерево', { collidableRadius: 0.5 * scale });
    applyShadows(group);
    return group;
}

export function createParkPatch(width: number, depth: number) {
    const group = new THREE.Group();
    const patch = new THREE.Mesh(
        new THREE.BoxGeometry(width, depth, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x9ad17b, roughness: 0.98 })
    );
    patch.position.z = 0.025;
    group.add(patch);
    return group;
}
