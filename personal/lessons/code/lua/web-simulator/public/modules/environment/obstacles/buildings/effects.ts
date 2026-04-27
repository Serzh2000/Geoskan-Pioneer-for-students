import * as THREE from 'three';
import { BuildingWindowIncident, BuildingWindowSlot } from './shared.js';

function createSmokeEffect(slot: BuildingWindowSlot) {
    const group = new THREE.Group();
    const sootPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.025, 0.24),
        new THREE.MeshStandardMaterial({
            color: 0x0a0a0f,
            transparent: true,
            opacity: 0.85,
            roughness: 1
        })
    );
    sootPlate.position.copy(slot.position).add(new THREE.Vector3(0, 0.05 * slot.outward, 0.02));
    group.add(sootPlate);

    const puffConfigs = [
        { offset: new THREE.Vector3(-0.18, 0.22 * slot.outward, 0.06), radius: 0.18, color: 0x334155, opacity: 0.7 },
        { offset: new THREE.Vector3(0.16, 0.25 * slot.outward, 0.12), radius: 0.22, color: 0x475569, opacity: 0.65 },
        { offset: new THREE.Vector3(-0.08, 0.35 * slot.outward, 0.22), radius: 0.28, color: 0x64748b, opacity: 0.55 },
        { offset: new THREE.Vector3(0.12, 0.42 * slot.outward, 0.35), radius: 0.32, color: 0x94a3b8, opacity: 0.45 },
        { offset: new THREE.Vector3(-0.15, 0.55 * slot.outward, 0.5), radius: 0.35, color: 0xcbd5e1, opacity: 0.35 },
        { offset: new THREE.Vector3(0.05, 0.68 * slot.outward, 0.65), radius: 0.38, color: 0xe2e8f0, opacity: 0.25 },
        { offset: new THREE.Vector3(-0.2, 0.8 * slot.outward, 0.8), radius: 0.4, color: 0xf1f5f9, opacity: 0.15 },
        { offset: new THREE.Vector3(0.25, 0.35 * slot.outward, 0.25), radius: 0.2, color: 0x475569, opacity: 0.5 },
        { offset: new THREE.Vector3(-0.25, 0.45 * slot.outward, 0.4), radius: 0.24, color: 0x64748b, opacity: 0.4 }
    ];

    puffConfigs.forEach((config, index) => {
        const puff = new THREE.Mesh(
            new THREE.SphereGeometry(config.radius, 12, 12),
            new THREE.MeshStandardMaterial({
                color: config.color,
                transparent: true,
                opacity: config.opacity,
                roughness: 1,
                metalness: 0
            })
        );
        puff.scale.set(
            1.0 + Math.sin(index) * 0.2,
            0.9 + Math.cos(index) * 0.15,
            1.0 + Math.sin(index * 1.5) * 0.2
        );
        puff.position.copy(slot.position).add(config.offset);
        group.add(puff);
    });

    return group;
}

function createFireEffect(slot: BuildingWindowSlot) {
    const group = new THREE.Group();

    const burnMark = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.04, 0.3),
        new THREE.MeshStandardMaterial({
            color: 0x110c08,
            emissive: 0x221108,
            emissiveIntensity: 0.4,
            roughness: 1
        })
    );
    burnMark.position.copy(slot.position).add(new THREE.Vector3(0, 0.06 * slot.outward, 0.03));
    group.add(burnMark);

    const flameConfigs = [
        { color: 0xff6b1a, emissive: 0xff4d00, radius: 0.12, height: 0.6, x: 0.0, y: 0.22, z: 0.2, leanX: 0.1, leanZ: 0.15 },
        { color: 0xff9f1c, emissive: 0xff8c42, radius: 0.09, height: 0.5, x: -0.12, y: 0.18, z: 0.15, leanX: -0.15, leanZ: 0.1 },
        { color: 0xffc04d, emissive: 0xff9f1c, radius: 0.08, height: 0.45, x: 0.14, y: 0.16, z: 0.12, leanX: 0.2, leanZ: -0.1 },
        { color: 0xffe7a1, emissive: 0xffd166, radius: 0.06, height: 0.35, x: 0.04, y: 0.25, z: 0.25, leanX: -0.05, leanZ: 0.2 }
    ];

    flameConfigs.forEach((config) => {
        const flameGroup = new THREE.Group();
        const flame = new THREE.Mesh(
            new THREE.ConeGeometry(config.radius, config.height, 8),
            new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.emissive,
                emissiveIntensity: 1.5,
                transparent: true,
                opacity: 0.9,
                roughness: 0.1
            })
        );

        flame.geometry.translate(0, config.height / 2, 0);
        flameGroup.position.copy(slot.position).add(new THREE.Vector3(config.x, config.y * slot.outward, config.z));
        flameGroup.rotation.x = -Math.PI / 2 + config.leanZ * slot.outward;
        flameGroup.rotation.z = config.leanX;
        flameGroup.add(flame);
        group.add(flameGroup);
    });

    const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshStandardMaterial({
            color: 0xffffcc,
            emissive: 0xfff0b8,
            emissiveIntensity: 2.0,
            transparent: true,
            opacity: 0.8
        })
    );
    core.position.copy(slot.position).add(new THREE.Vector3(0, 0.15 * slot.outward, 0.05));
    core.scale.set(1.5, 0.8, 0.6);
    group.add(core);

    const glow = new THREE.PointLight(0xff7a18, 2.5, 4, 1.5);
    glow.position.copy(slot.position).add(new THREE.Vector3(0, 0.25 * slot.outward, 0.2));
    group.add(glow);

    return group;
}

function createThiefEffect(slot: BuildingWindowSlot) {
    const group = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a0f, roughness: 0.9 });
    const clothesMaterial = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    const thief = new THREE.Group();
    thief.position.copy(slot.position).add(new THREE.Vector3(0, 0.35 * slot.outward, 0.1));
    thief.rotation.set(-Math.PI / 2, 0, slot.outward > 0 ? 0 : Math.PI);
    group.add(thief);

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.2, 4, 8), clothesMaterial);
    torso.rotation.x = 0.2;
    thief.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), bodyMaterial);
    head.position.set(0, 0.28, 0.05);
    thief.add(head);

    const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.2, 2, 6), clothesMaterial);
    leftArm.position.set(-0.12, 0.15, 0.05);
    leftArm.rotation.z = 0.5;
    thief.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.2, 2, 6), clothesMaterial);
    rightArm.position.set(0.12, 0.15, 0.05);
    rightArm.rotation.z = -0.5;
    thief.add(rightArm);

    const leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.25, 2, 6), clothesMaterial);
    leftLeg.position.set(-0.06, -0.2, 0);
    leftLeg.rotation.z = 0.1;
    thief.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.25, 2, 6), clothesMaterial);
    rightLeg.position.set(0.06, -0.2, 0);
    rightLeg.rotation.z = -0.1;
    thief.add(rightLeg);

    const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2, 6), ropeMaterial);
    rope.position.copy(slot.position).add(new THREE.Vector3(0, 0.5 * slot.outward, 0.5));
    rope.rotation.x = Math.PI / 2;
    group.add(rope);

    return group;
}

export function addIncidentEffect(group: THREE.Group, slot: BuildingWindowSlot, incident: BuildingWindowIncident) {
    const effect = incident.kind === 'smoke'
        ? createSmokeEffect(slot)
        : incident.kind === 'fire'
            ? createFireEffect(slot)
            : createThiefEffect(slot);
    group.add(effect);
}
