import * as THREE from 'three';
import { createTrussArenaMesh } from '../truss-arena.js';
import { setCommonMeta, applyShadows } from './utils.js';
import { createStyledLandingPad } from './pads.js';
import { createHillMesh, createFirTreeMesh } from './nature.js';
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
    const crate = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.35, 0.28),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.92 })
    );
    crate.position.z = 0.14;
    group.add(crate);

    const strapMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7, metalness: 0.1 });
    const strapX = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.37, 0.3), strapMaterial);
    strapX.position.z = 0.14;
    group.add(strapX);
    const strapY = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.06, 0.3), strapMaterial);
    strapY.position.z = 0.14;
    group.add(strapY);

    const handle = new THREE.Mesh(
        new THREE.TorusGeometry(0.08, 0.015, 10, 24),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.55, roughness: 0.28 })
    );
    handle.rotation.x = Math.PI / 2;
    handle.position.z = 0.32;
    group.add(handle);

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

export function createSettlementMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Макет поселения', { collidableRadius: 2.4 });
    const houseColors = [0xf8fafc, 0xfef3c7, 0xfce7f3, 0xdbeafe, 0xecfccb];
    const roofColors = [0xb91c1c, 0x9a3412, 0x7c2d12, 0x991b1b, 0x854d0e];
    const footprint = [
        [-1.1, -0.6, 0.9],
        [0, -0.5, 1.1],
        [1.1, -0.4, 0.8],
        [-0.6, 0.7, 1.2],
        [0.8, 0.8, 1.0]
    ];
    const road = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.44, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.96 })
    );
    road.position.set(0, 0.08, 0.015);
    group.add(road);

    const roadStripe = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.04, 0.01),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.82 })
    );
    roadStripe.position.set(0, 0.08, 0.036);
    group.add(roadStripe);

    footprint.forEach(([x, y, scale], index) => {
        const width = 0.64 * scale;
        const depth = 0.56 * scale;
        const height = 0.36 * scale;
        const house = new THREE.Group();
        house.position.set(x, y, 0);
        house.rotation.z = (index % 3 - 1) * 0.04;

        const foundation = new THREE.Mesh(
            new THREE.BoxGeometry(width + 0.06, depth + 0.06, 0.04),
            new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.98 })
        );
        foundation.position.z = 0.02;
        house.add(foundation);

        const base = new THREE.Mesh(
            new THREE.BoxGeometry(width, depth, height),
            new THREE.MeshStandardMaterial({ color: houseColors[index % houseColors.length], roughness: 0.94 })
        );
        base.position.z = height * 0.5 + 0.04;
        house.add(base);

        const roofRise = 0.16 * scale;
        const roofThickness = 0.05 * scale;
        const roofHalfSpan = width * 0.54;
        const roofDepth = depth + 0.12 * scale;
        const roofSlopeLength = Math.sqrt(roofHalfSpan * roofHalfSpan + roofRise * roofRise);
        const roofPitch = Math.atan2(roofRise, roofHalfSpan);
        const roofMat = new THREE.MeshStandardMaterial({
            color: roofColors[index % roofColors.length],
            roughness: 0.9
        });
        const roofBaseZ = height + 0.08 * scale;

        const leftSlope = new THREE.Mesh(
            new THREE.BoxGeometry(roofSlopeLength, roofDepth, roofThickness),
            roofMat
        );
        leftSlope.position.set(-roofHalfSpan * 0.48, 0, roofBaseZ + roofRise * 0.5);
        leftSlope.rotation.y = -roofPitch;
        house.add(leftSlope);

        const rightSlope = new THREE.Mesh(
            new THREE.BoxGeometry(roofSlopeLength, roofDepth, roofThickness),
            roofMat
        );
        rightSlope.position.set(roofHalfSpan * 0.48, 0, roofBaseZ + roofRise * 0.5);
        rightSlope.rotation.y = roofPitch;
        house.add(rightSlope);

        const ridge = new THREE.Mesh(
            new THREE.BoxGeometry(0.04 * scale, roofDepth * 0.96, 0.035 * scale),
            new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.88 })
        );
        ridge.position.set(0, 0, roofBaseZ + roofRise + roofThickness * 0.15);
        house.add(ridge);

        const door = new THREE.Mesh(
            new THREE.BoxGeometry(0.1 * scale, 0.03, 0.18 * scale),
            new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.9 })
        );
        door.position.set(0, depth * 0.5 + 0.016, 0.13 * scale);
        house.add(door);

        [-0.17, 0.17].forEach((windowX) => {
            const window = new THREE.Mesh(
                new THREE.BoxGeometry(0.1 * scale, 0.025, 0.09 * scale),
                new THREE.MeshStandardMaterial({
                    color: 0x1d4ed8,
                    emissive: 0xe0f2fe,
                    emissiveIntensity: 0.18,
                    roughness: 0.35
                })
            );
            window.position.set(windowX * scale, depth * 0.5 + 0.014, 0.24 * scale);
            house.add(window);
        });

        if (index % 2 === 1) {
            const chimney = new THREE.Mesh(
                new THREE.BoxGeometry(0.06 * scale, 0.06 * scale, 0.16 * scale),
                new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.92 })
            );
            chimney.position.set(-0.14 * scale, -0.1 * scale, roofBaseZ + roofRise * 0.9);
            house.add(chimney);
        }

        group.add(house);
    });

    applyShadows(group);
    return group;
}

export function createForestPatchMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Лесной массив', { collidableRadius: 1.9 });
    const layout = [
        [-0.9, -0.4, 0.95],
        [-0.2, -0.7, 1.05],
        [0.8, -0.5, 0.9],
        [-0.7, 0.5, 1.1],
        [0.1, 0.3, 1],
        [0.85, 0.55, 1.15]
    ];

    layout.forEach(([x, y, scale]) => {
        const tree = createFirTreeMesh();
        tree.position.set(x, y, 0);
        tree.scale.setScalar(scale);
        group.add(tree);
    });

    applyShadows(group);
    return group;
}

export function createArenaHillClusterMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Группа холмов', { collidableRadius: 3.2 });
    const positions = [
        [-1.1, -0.2, 0.85],
        [0.75, -0.35, 1],
        [0.1, 1, 0.72]
    ];
    positions.forEach(([x, y, scale]) => {
        const hill = createHillMesh();
        hill.position.set(x, y, 0);
        hill.scale.setScalar(scale);
        group.add(hill);
    });
    applyShadows(group);
    return group;
}
