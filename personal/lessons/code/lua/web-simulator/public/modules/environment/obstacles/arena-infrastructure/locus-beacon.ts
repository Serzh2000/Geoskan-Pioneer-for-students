import * as THREE from 'three';
import { setCommonMeta, applyShadows } from '../utils.js';

export function createLocusBeaconMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Локус-маяк', { collidableRadius: 0.4 });
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.65, metalness: 0.35 });

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.4, 12), mastMat);
    mast.rotation.x = Math.PI / 2;
    mast.position.z = 1.2;
    group.add(mast);

    const emitter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.16, 24),
        new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x38bdf8, emissiveIntensity: 0.35 })
    );
    emitter.rotation.x = Math.PI / 2;
    emitter.position.z = 2.15;
    group.add(emitter);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.25, 0.02, 12, 30),
        new THREE.MeshStandardMaterial({ color: 0x93c5fd, emissive: 0x38bdf8, emissiveIntensity: 0.25 })
    );
    ring.position.z = 2.15;
    group.add(ring);

    applyShadows(group);
    return group;
}