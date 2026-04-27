import * as THREE from 'three';

export type BuildingFace = 'front' | 'back';
export type WindowIncidentKind = 'smoke' | 'fire' | 'thief';

export interface BuildingWindowIncident {
    floor: number;
    face: BuildingFace;
    window: number;
    kind: WindowIncidentKind;
}

export interface BuildingWindowSlot {
    floor: number;
    face: BuildingFace;
    window: number;
    position: THREE.Vector3;
    outward: number;
}

export const WINDOW_COUNT_PER_FACE = 3;

export function clampBuildingFloors(value: unknown) {
    return Math.max(5, Math.min(20, Number(value) || 9));
}
