import * as THREE from 'three';
import { createTrussArenaMesh } from '../truss-arena.js';
import { setCommonMeta, applyShadows } from './utils.js';
import { createStyledLandingPad } from './pads.js';
import { DEFAULT_CARGO_MASS_KG, DEFAULT_CARGO_PHYSICS_MATERIAL } from '../../physics/materials.js';

export function createArenaSpaceMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Арена с сеткой', { collidableRadius: 9.5 });
    const frame = createTrussArenaMesh(11, 4);
    group.add(frame);
    applyShadows(group);
    return group;
}

export function createStartPositionMesh(label = '1') {
    const safeLabel = (label || '1').trim().slice(0, 3) || '1';
    const pad = createStyledLandingPad(safeLabel, '#ef4444');
    pad.name = `Стартовая позиция ${safeLabel}`;
    pad.userData.type = 'Стартовая позиция';
    pad.userData.value = safeLabel;
    return pad;
}

export function createArenaHeliportMesh() {
    const pad = createStyledLandingPad('H', '#2563eb');
    pad.name = 'Хелипорт';
    pad.userData.type = 'Хелипорт';
    return pad;
}

export function createChargeStationMesh() {
    const pad = createStyledLandingPad('⚡', '#475569');
    pad.name = 'Станция заряда';
    pad.userData.type = 'Станция заряда';
    return pad;
}

export function createCargoMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Грузик', { collidableRadius: 0.22 });
    group.userData.massKg = DEFAULT_CARGO_MASS_KG;
    group.userData.physicsMaterial = { ...DEFAULT_CARGO_PHYSICS_MATERIAL };
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.94, metalness: 0.04 });
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xc97316, roughness: 0.78, metalness: 0.08 });
    const topMaterial = new THREE.MeshStandardMaterial({ color: 0xdda15e, roughness: 0.7, metalness: 0.08 });
    const strapMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.68, metalness: 0.12 });
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.24 });
    const bumperMaterial = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.82, metalness: 0.08 });
    const accentMaterial = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.62, metalness: 0.1 });

    const pallet = new THREE.Group();
    const palletBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.04), woodMaterial);
    palletBase.position.z = 0.04;
    pallet.add(palletBase);
    const palletSlatOffsets = [-0.1, 0, 0.1];
    palletSlatOffsets.forEach((x) => {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.34, 0.025), woodMaterial);
        slat.position.set(x, 0, 0.072);
        pallet.add(slat);
    });
    const palletFeetOffsets = [
        [-0.11, -0.11],
        [0.11, -0.11],
        [-0.11, 0.11],
        [0.11, 0.11]
    ];
    palletFeetOffsets.forEach(([x, y]) => {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.05), woodMaterial);
        foot.position.set(x, y, 0.025);
        pallet.add(foot);
    });
    group.add(pallet);

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.2), bodyMaterial);
    body.position.z = 0.17;
    group.add(body);

    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.028), topMaterial);
    lid.position.z = 0.288;
    group.add(lid);

    const cornerOffsets = [
        [-0.14, -0.14],
        [0.14, -0.14],
        [-0.14, 0.14],
        [0.14, 0.14]
    ];
    cornerOffsets.forEach(([x, y]) => {
        const corner = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.24), bumperMaterial);
        corner.position.set(x, y, 0.17);
        group.add(corner);
    });

    const strapX = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.29, 0.24), strapMaterial);
    strapX.position.z = 0.17;
    group.add(strapX);
    const strapY = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.03, 0.24), strapMaterial);
    strapY.position.z = 0.17;
    group.add(strapY);

    const topStrapX = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.29, 0.005), strapMaterial);
    topStrapX.position.z = 0.303;
    group.add(topStrapX);
    const topStrapY = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.03, 0.005), strapMaterial);
    topStrapY.position.z = 0.303;
    group.add(topStrapY);

    const buckleTop = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.015), metalMaterial);
    buckleTop.position.z = 0.308;
    group.add(buckleTop);

    const frontPlate = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.014, 0.08), accentMaterial);
    frontPlate.position.set(0, 0.148, 0.19);
    group.add(frontPlate);

    const topFrame = new THREE.Group();
    const postOffsets = [
        [-0.09, -0.09],
        [0.09, -0.09],
        [-0.09, 0.09],
        [0.09, 0.09]
    ];
    postOffsets.forEach(([x, y]) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.08, 10), metalMaterial);
        post.rotation.x = Math.PI / 2; // Make it vertical (Z-up)
        post.position.set(x, y, 0.34);
        topFrame.add(post);
    });
    const frameBars = [
        { geometry: new THREE.BoxGeometry(0.20, 0.012, 0.012), position: [0, -0.09, 0.38] },
        { geometry: new THREE.BoxGeometry(0.20, 0.012, 0.012), position: [0, 0.09, 0.38] },
        { geometry: new THREE.BoxGeometry(0.012, 0.20, 0.012), position: [-0.09, 0, 0.38] },
        { geometry: new THREE.BoxGeometry(0.012, 0.20, 0.012), position: [0.09, 0, 0.38] }
    ];
    frameBars.forEach(({ geometry, position }) => {
        const bar = new THREE.Mesh(geometry, metalMaterial);
        bar.position.set(position[0], position[1], position[2]);
        topFrame.add(bar);
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 10, 24), metalMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.z = 0.405;
    topFrame.add(ring);
    group.add(topFrame);

    const cableOffsets = [
        [-0.06, -0.06],
        [0.06, -0.06],
        [-0.06, 0.06],
        [0.06, 0.06]
    ];
    cableOffsets.forEach(([x, y]) => {
        const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.1, 8), strapMaterial);
        cable.rotation.x = Math.PI / 2; // Make Z-up
        cable.rotation.y = x > 0 ? 0.35 : -0.35; // Tilt towards center
        cable.rotation.x += y > 0 ? -0.35 : 0.35; // Tilt towards center
        cable.position.set(x, y, 0.34);
        group.add(cable);
    });

    applyShadows(group);
    return group;
}

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

export function createLightTowerMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Световая мачта', { collidableRadius: 0.5 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.72, metalness: 0.28 });

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 3.8, 12), darkMat);
    mast.rotation.x = Math.PI / 2;
    mast.position.z = 1.9;
    group.add(mast);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.18), darkMat);
    head.position.set(0, 0, 3.65);
    group.add(head);

    for (let i = -1; i <= 1; i++) {
        const lamp = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.12, 0.12),
            new THREE.MeshStandardMaterial({ color: 0xf8fafc, emissive: 0xfde68a, emissiveIntensity: 0.45 })
        );
        lamp.position.set(i * 0.28, 0.05, 3.65);
        group.add(lamp);
    }

    applyShadows(group);
    return group;
}

export function createVideoTowerMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Видеомачта', { collidableRadius: 0.45 });
    const mat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.72, metalness: 0.25 });

    const tripodOffsets = [
        [-0.18, -0.14],
        [0.18, -0.14],
        [0, 0.18]
    ];
    tripodOffsets.forEach(([x, y]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 1.4, 8), mat);
        leg.position.set(x, y, 0.7);
        leg.rotation.set(Math.PI / 2 - 0.12, 0, 0);
        group.add(leg);
    });

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.16), mat);
    head.position.set(0, 0, 1.45);
    group.add(head);

    const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.12, 16),
        new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.25, metalness: 0.55 })
    );
    lens.position.set(0, 0.12, 1.45);
    lens.rotation.x = Math.PI / 2;
    group.add(lens);

    applyShadows(group);
    return group;
}

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
