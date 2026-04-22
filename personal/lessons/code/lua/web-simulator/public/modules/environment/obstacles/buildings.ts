import * as THREE from 'three';
import { SceneObjectOptions } from './types.js';
import { setCommonMeta, applyShadows, clearGeneratedChildren } from './utils.js';

type BuildingFace = 'front' | 'back';
type WindowIncidentKind = 'smoke' | 'fire' | 'thief';

interface BuildingWindowIncident {
    floor: number;
    face: BuildingFace;
    window: number;
    kind: WindowIncidentKind;
}

interface BuildingWindowSlot {
    floor: number;
    face: BuildingFace;
    window: number;
    position: THREE.Vector3;
    outward: number;
}

const WINDOW_COUNT_PER_FACE = 3;

function clampBuildingFloors(value: unknown) {
    return Math.max(5, Math.min(20, Number(value) || 9));
}

function parseIncidentKind(value: string): WindowIncidentKind | null {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'smoke' || normalized === 'дым') return 'smoke';
    if (normalized === 'fire' || normalized === 'пожар') return 'fire';
    if (normalized === 'thief' || normalized === 'вор') return 'thief';
    return null;
}

function parseWindowIncidents(rawValue: unknown, floors: number): BuildingWindowIncident[] {
    if (typeof rawValue !== 'string' || !rawValue.trim()) return [];

    const incidents: BuildingWindowIncident[] = [];
    const entries = rawValue
        .split(/\r?\n|;/)
        .map((entry) => entry.trim())
        .filter(Boolean);

    for (const entry of entries) {
        const match = entry.match(/^(\d+)\s*:\s*(?:(front|back|перед|зад)\s*:\s*)?(\d+)\s*=\s*([a-zа-я]+)$/i);
        if (!match) continue;

        const floor = Number(match[1]);
        const faceRaw = (match[2] || 'front').toLowerCase();
        const window = Number(match[3]);
        const kind = parseIncidentKind(match[4]);
        if (!kind) continue;
        if (!Number.isFinite(floor) || floor < 1 || floor > floors) continue;
        if (!Number.isFinite(window) || window < 1 || window > WINDOW_COUNT_PER_FACE) continue;

        const face: BuildingFace = (faceRaw === 'back' || faceRaw === 'зад') ? 'back' : 'front';
        incidents.push({ floor, face, window, kind });
    }

    return incidents;
}

function getWindowSlots(floors: number, depth: number, floorHeight: number) {
    const slots: BuildingWindowSlot[] = [];
    for (let floor = 0; floor < floors; floor++) {
        const z = 0.65 + floor * floorHeight + 0.45;
        for (let i = -1; i <= 1; i++) {
            const x = i * 1.3;
            slots.push({
                floor: floor + 1,
                face: 'front',
                window: i + 2,
                position: new THREE.Vector3(x, depth * 0.5 + 0.05, z),
                outward: 1
            });
            slots.push({
                floor: floor + 1,
                face: 'back',
                window: i + 2,
                position: new THREE.Vector3(x, -depth * 0.5 - 0.05, z),
                outward: -1
            });
        }
    }
    return slots;
}

function summarizeWindowIncidents(incidents: BuildingWindowIncident[]) {
    if (!incidents.length) return [];
    return incidents.map((incident) => {
        const kindLabel = incident.kind === 'smoke'
            ? 'дым'
            : incident.kind === 'fire'
                ? 'пожар'
                : 'вор';
        const faceLabel = incident.face === 'front' ? 'перед' : 'зад';
        return `Окно ${incident.floor}:${faceLabel}:${incident.window} -> ${kindLabel}`;
    });
}

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

    // Больше клубов дыма с разным размером и смещением
    const puffConfigs = [
        { offset: new THREE.Vector3(-0.18, 0.22 * slot.outward, 0.06), radius: 0.18, color: 0x334155, opacity: 0.7 },
        { offset: new THREE.Vector3(0.16, 0.25 * slot.outward, 0.12), radius: 0.22, color: 0x475569, opacity: 0.65 },
        { offset: new THREE.Vector3(-0.08, 0.35 * slot.outward, 0.22), radius: 0.28, color: 0x64748b, opacity: 0.55 },
        { offset: new THREE.Vector3(0.12, 0.42 * slot.outward, 0.35), radius: 0.32, color: 0x94a3b8, opacity: 0.45 },
        { offset: new THREE.Vector3(-0.15, 0.55 * slot.outward, 0.5), radius: 0.35, color: 0xcbd5e1, opacity: 0.35 },
        { offset: new THREE.Vector3(0.05, 0.68 * slot.outward, 0.65), radius: 0.38, color: 0xe2e8f0, opacity: 0.25 },
        { offset: new THREE.Vector3(-0.2, 0.8 * slot.outward, 0.8), radius: 0.4, color: 0xf1f5f9, opacity: 0.15 },
        // Дополнительные клубы для "густоты"
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
        // Асимметричное масштабирование для каждого клуба
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

    // Языки пламени через вытянутые и искривленные конусы
    const flameConfigs = [
        { color: 0xff6b1a, emissive: 0xff4d00, radius: 0.12, height: 0.6, x: 0.0, y: 0.22, z: 0.2, leanX: 0.1, leanZ: 0.15, scale: 1.0 },
        { color: 0xff9f1c, emissive: 0xff8c42, radius: 0.09, height: 0.5, x: -0.12, y: 0.18, z: 0.15, leanX: -0.15, leanZ: 0.1, scale: 0.8 },
        { color: 0xffc04d, emissive: 0xff9f1c, radius: 0.08, height: 0.45, x: 0.14, y: 0.16, z: 0.12, leanX: 0.2, leanZ: -0.1, scale: 0.7 },
        { color: 0xffe7a1, emissive: 0xffd166, radius: 0.06, height: 0.35, x: 0.04, y: 0.25, z: 0.25, leanX: -0.05, leanZ: 0.2, scale: 0.6 }
    ];

    flameConfigs.forEach((config, index) => {
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
        
        // Смещаем геометрию, чтобы вращение было от основания
        flame.geometry.translate(0, config.height / 2, 0);
        
        flameGroup.position.copy(slot.position).add(new THREE.Vector3(
            config.x,
            config.y * slot.outward,
            config.z
        ));
        
        flameGroup.rotation.x = -Math.PI / 2 + config.leanZ * slot.outward;
        flameGroup.rotation.z = config.leanX;
        
        flameGroup.add(flame);
        group.add(flameGroup);
    });

    // Ядро пламени (самое горячее место)
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
    
    // Упрощенная, но более цельная фигура вора
    const thief = new THREE.Group();
    thief.position.copy(slot.position).add(new THREE.Vector3(0, 0.35 * slot.outward, 0.1));
    thief.rotation.set(-Math.PI / 2, 0, slot.outward > 0 ? 0 : Math.PI);
    group.add(thief);

    // Туловище
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.2, 4, 8), clothesMaterial);
    torso.rotation.x = 0.2;
    thief.add(torso);

    // Голова в капюшоне
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), bodyMaterial);
    head.position.set(0, 0.28, 0.05);
    thief.add(head);

    // Руки (держатся за трос/окно)
    const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.2, 2, 6), clothesMaterial);
    leftArm.position.set(-0.12, 0.15, 0.05);
    leftArm.rotation.z = 0.5;
    thief.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.2, 2, 6), clothesMaterial);
    rightArm.position.set(0.12, 0.15, 0.05);
    rightArm.rotation.z = -0.5;
    thief.add(rightArm);

    // Ноги
    const leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.25, 2, 6), clothesMaterial);
    leftLeg.position.set(-0.06, -0.2, 0);
    leftLeg.rotation.z = 0.1;
    thief.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.25, 2, 6), clothesMaterial);
    rightLeg.position.set(0.06, -0.2, 0);
    rightLeg.rotation.z = -0.1;
    thief.add(rightLeg);

    // Трос
    const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2, 6), ropeMaterial);
    rope.position.copy(slot.position).add(new THREE.Vector3(0, 0.5 * slot.outward, 0.5));
    rope.rotation.x = Math.PI / 2;
    group.add(rope);

    return group;
}

function addIncidentEffect(group: THREE.Group, slot: BuildingWindowSlot, incident: BuildingWindowIncident) {
    const effect = incident.kind === 'smoke'
        ? createSmokeEffect(slot)
        : incident.kind === 'fire'
            ? createFireEffect(slot)
            : createThiefEffect(slot);
    group.add(effect);
}

function rebuildApartmentBuilding(group: THREE.Group) {
    clearGeneratedChildren(group);

    const floors = clampBuildingFloors(group.userData.floors);
    group.userData.floors = floors;
    const bodyColor = Number(group.userData.bodyColor) || 0xe5e7eb;
    const windowIncidents = parseWindowIncidents(group.userData.value, floors);
    group.userData.windowIncidentsSummaryLines = summarizeWindowIncidents(windowIncidents);

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
    const windowSlots = getWindowSlots(floors, depth, floorHeight);

    for (const slot of windowSlots) {
        const hasFire = windowIncidents.some((incident) =>
            incident.kind === 'fire'
            && incident.floor === slot.floor
            && incident.face === slot.face
            && incident.window === slot.window
        );
        const windowMat = new THREE.MeshStandardMaterial({
            color: hasFire ? 0x2b1208 : 0x1e293b,
            emissive: hasFire ? 0xff7a18 : 0xfef3c7,
            emissiveIntensity: hasFire ? 0.55 : 0.22,
            roughness: 0.65
        });

        const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.34), windowMat);
        windowMesh.position.copy(slot.position);
        group.add(windowMesh);

        const balcony = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.4, 0.08), balconyMat);
        balcony.position.set(slot.position.x, slot.position.y + 0.13 * slot.outward, slot.position.z - 0.22);
        group.add(balcony);
    }

    for (const incident of windowIncidents) {
        const slot = windowSlots.find((candidate) =>
            candidate.floor === incident.floor
            && candidate.face === incident.face
            && candidate.window === incident.window
        );
        if (slot) addIncidentEffect(group, slot, incident);
    }

    applyShadows(group);
}

export function createApartmentBuildingMesh(options: SceneObjectOptions = {}) {
    const colors = [0xe5e7eb, 0xef4444, 0x2563eb, 0x10b981, 0xf59e0b];
    const bodyColor = colors[Math.floor(Math.random() * colors.length)];
    
    const group = setCommonMeta(new THREE.Group(), 'Многоэтажка', {
        floors: clampBuildingFloors(options.floors ?? 9),
        collidableRadius: 2.6,
        supportsValue: true,
        value: options.value || '',
        bodyColor,
        valueLabel: 'Сценарии в окнах'
    });
    rebuildApartmentBuilding(group);
    return group;
}

export function updateApartmentBuildingIncidents(object: THREE.Object3D, value: string | undefined) {
    const group = object as THREE.Group;
    if (group.userData?.type !== 'Многоэтажка') return false;
    group.userData.value = value || '';
    rebuildApartmentBuilding(group);
    return true;
}

export function updateApartmentBuildingMetadata(
    object: THREE.Object3D,
    params: { value?: string; floors?: number }
) {
    const group = object as THREE.Group;
    if (group.userData?.type !== 'Многоэтажка') return false;
    if (params.value !== undefined) group.userData.value = params.value || '';
    if (params.floors !== undefined) group.userData.floors = clampBuildingFloors(params.floors);
    rebuildApartmentBuilding(group);
    return true;
}
