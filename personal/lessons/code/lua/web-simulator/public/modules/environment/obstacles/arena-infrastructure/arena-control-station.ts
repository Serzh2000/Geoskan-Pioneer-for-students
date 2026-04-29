import * as THREE from 'three';
import { setCommonMeta, applyShadows } from '../utils.js';

export function createArenaControlStationMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Пульт полигона', { collidableRadius: 0.8 });
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.82, metalness: 0.12 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x38bdf8, emissiveIntensity: 0.25 });

    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.65, 0.78), deskMat);
    desk.position.z = 0.39;
    group.add(desk);

    const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.08, 0.4), screenMat);
    monitor.position.set(0, 0.24, 1.05);
    group.add(monitor);

    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.03), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    keyboard.position.set(0, 0.18, 0.8);
    group.add(keyboard);

    applyShadows(group);
    return group;
}