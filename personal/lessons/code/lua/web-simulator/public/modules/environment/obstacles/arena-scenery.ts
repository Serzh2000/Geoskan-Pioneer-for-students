import * as THREE from 'three';
import { setCommonMeta, applyShadows } from './utils.js';
import { createHillMesh, createFirTreeMesh } from './nature.js';

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
