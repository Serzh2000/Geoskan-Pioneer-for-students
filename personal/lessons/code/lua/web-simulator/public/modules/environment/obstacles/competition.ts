import * as THREE from 'three';
import { setCommonMeta, applyShadows } from './utils.js';

export function createGateMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Ворота', { collidableRadius: 0.95 });

    const mat = new THREE.MeshStandardMaterial({ color: 0xff8800, roughness: 0.7, emissive: 0xff4400, emissiveIntensity: 0.1 });
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.5 });

    const legGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.5);
    const leg1 = new THREE.Mesh(legGeom, mat);
    leg1.position.set(0, -0.6, 0.75);
    leg1.rotation.x = Math.PI / 2;
    const leg2 = new THREE.Mesh(legGeom, mat);
    leg2.position.set(0, 0.6, 0.75);
    leg2.rotation.x = Math.PI / 2;
    group.add(leg1, leg2);

    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 16, 32), ringMat);
    torus.position.z = 1.2;
    torus.rotation.y = Math.PI / 2;
    group.add(torus);

    applyShadows(group);
    return group;
}

export function createPylonMesh() {
    const pylonGeom = new THREE.ConeGeometry(0.3, 2, 8);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.8 });
    const pylon = setCommonMeta(new THREE.Mesh(pylonGeom, pylonMat), 'Пилон', { collidableRadius: 0.4 });
    pylon.rotation.x = Math.PI / 2;
    pylon.position.z = 1;
    pylon.castShadow = true;
    pylon.receiveShadow = true;
    return pylon;
}

export function createFlagMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Флаг', { collidableRadius: 0.45 });

    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 2),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 })
    );
    pole.rotation.x = Math.PI / 2;
    pole.position.z = 1;
    group.add(pole);

    const flag = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.6, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.7, emissive: 0x1d4ed8, emissiveIntensity: 0.12 })
    );
    flag.position.set(0, 0.3, 1.8);
    group.add(flag);

    applyShadows(group);
    return group;
}
