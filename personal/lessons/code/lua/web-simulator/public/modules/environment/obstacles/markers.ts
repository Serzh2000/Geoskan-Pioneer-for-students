import * as THREE from 'three';
import { setCommonMeta, applyShadows } from './utils.js';
import {
    DEFAULT_APRILTAG_DICTIONARY,
    DEFAULT_ARUCO_DICTIONARY,
    MARKER_DICTIONARIES,
    MARKER_DICTIONARY_OPTIONS,
    MarkerDictionaryId
} from './marker-dictionaries.js';
import {
    MarkerMapAnchor,
    MarkerMapOptions,
    MarkerMapStartCorner,
    MarkerMapTraversal
} from './types.js';

const MARKER_CANVAS_SIZE = 1024;
const SHEET_SIZE = 1.05;
const SHEET_THICKNESS = 0.018;
const MARKER_SHEET_NAME = 'marker-sheet';
const MARKER_LOCAL_NORMAL = new THREE.Vector3(0, 0, 1);
const SURFACE_EPSILON = 0.0005;
const DEFAULT_MARKER_MAP_OPTIONS = {
    rows: 5,
    columns: 5,
    startId: 0,
    idStep: 1,
    markerSize: SHEET_SIZE,
    gapX: 0.2,
    gapY: 0.2,
    traversal: 'row-major' as MarkerMapTraversal,
    startCorner: 'top-left' as MarkerMapStartCorner,
    anchor: 'center' as MarkerMapAnchor,
    snake: false,
    rotationDeg: 0
};

type MarkerKind = 'ArUco' | 'AprilTag';

interface NormalizedMarkerMapOptions {
    rows: number;
    columns: number;
    startId: number;
    idStep: number;
    markerSize: number;
    gapX: number;
    gapY: number;
    traversal: MarkerMapTraversal;
    startCorner: MarkerMapStartCorner;
    anchor: MarkerMapAnchor;
    snake: boolean;
    rotationDeg: number;
}

interface MarkerSurfaceCandidate {
    anchor: THREE.Vector3;
    normal: THREE.Vector3;
    score: number;
}

function parseMarkerId(value: string) {
    const parsed = Number.parseInt(value || '0', 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function getMarkerKindKey(kind: MarkerKind) {
    return kind === 'AprilTag' ? 'apriltag' : 'aruco';
}

function getDefaultDictionary(kind: MarkerKind): MarkerDictionaryId {
    return (kind === 'AprilTag' ? DEFAULT_APRILTAG_DICTIONARY : DEFAULT_ARUCO_DICTIONARY) as MarkerDictionaryId;
}

export function getMarkerDictionaryOptions(kind: 'aruco' | 'apriltag') {
    return [...MARKER_DICTIONARY_OPTIONS[kind]];
}

export function normalizeMarkerDictionaryId(kind: MarkerKind, dictionaryId?: string): MarkerDictionaryId {
    if (dictionaryId && dictionaryId in MARKER_DICTIONARIES) {
        const normalized = dictionaryId as MarkerDictionaryId;
        if (MARKER_DICTIONARIES[normalized].kind === getMarkerKindKey(kind)) return normalized;
    }
    return getDefaultDictionary(kind);
}

function getDictionaryDefinition(kind: MarkerKind, dictionaryId?: string) {
    const normalizedId = normalizeMarkerDictionaryId(kind, dictionaryId);
    return {
        dictionaryId: normalizedId,
        definition: MARKER_DICTIONARIES[normalizedId]
    };
}

function normalizeMarkerValue(kind: MarkerKind, dictionaryId: MarkerDictionaryId, value: string) {
    const definition = MARKER_DICTIONARIES[dictionaryId];
    const parsed = parseMarkerId(value);
    const clamped = Math.min(parsed, definition.markerCount - 1);
    return String(clamped);
}

function clampInt(value: unknown, fallback: number, min: number, max: number) {
    const parsed = Number.parseInt(String(value ?? ''), 10);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(Math.max(parsed, min), max);
}

function clampNumber(value: unknown, fallback: number, min: number, max: number) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(Math.max(parsed, min), max);
}

function wrapMarkerId(markerId: number, dictionaryId: MarkerDictionaryId) {
    const count = MARKER_DICTIONARIES[dictionaryId].markerCount;
    if (count <= 0) return 0;
    return ((markerId % count) + count) % count;
}

function normalizeMarkerMapOptions(options: MarkerMapOptions | undefined): NormalizedMarkerMapOptions {
    const traversal = options?.traversal === 'column-major' ? 'column-major' : DEFAULT_MARKER_MAP_OPTIONS.traversal;
    const startCorner = (
        options?.startCorner === 'top-right'
        || options?.startCorner === 'bottom-left'
        || options?.startCorner === 'bottom-right'
    ) ? options.startCorner : DEFAULT_MARKER_MAP_OPTIONS.startCorner;
    const anchor = (
        options?.anchor === 'top-left'
        || options?.anchor === 'top-right'
        || options?.anchor === 'bottom-left'
        || options?.anchor === 'bottom-right'
        || options?.anchor === 'start'
    ) ? options.anchor : DEFAULT_MARKER_MAP_OPTIONS.anchor;

    return {
        rows: clampInt(options?.rows, DEFAULT_MARKER_MAP_OPTIONS.rows, 1, 20),
        columns: clampInt(options?.columns, DEFAULT_MARKER_MAP_OPTIONS.columns, 1, 20),
        startId: clampInt(options?.startId, DEFAULT_MARKER_MAP_OPTIONS.startId, 0, 100000),
        idStep: clampInt(options?.idStep, DEFAULT_MARKER_MAP_OPTIONS.idStep, 1, 1000),
        markerSize: clampNumber(options?.markerSize, DEFAULT_MARKER_MAP_OPTIONS.markerSize, 0.2, 5),
        gapX: clampNumber(options?.gapX, DEFAULT_MARKER_MAP_OPTIONS.gapX, 0, 10),
        gapY: clampNumber(options?.gapY, DEFAULT_MARKER_MAP_OPTIONS.gapY, 0, 10),
        traversal,
        startCorner,
        anchor,
        snake: !!options?.snake,
        rotationDeg: clampNumber(options?.rotationDeg, DEFAULT_MARKER_MAP_OPTIONS.rotationDeg, -180, 180)
    };
}

function bytesToBitMatrix(bytes: number[], markerSize: number) {
    const matrix = Array.from({ length: markerSize }, () => Array<number>(markerSize).fill(0));
    const totalBits = markerSize * markerSize;
    let bitIndex = 0;
    for (const byte of bytes) {
        for (let mask = 1 << 7; mask !== 0 && bitIndex < totalBits; mask >>= 1) {
            const row = Math.floor(bitIndex / markerSize);
            const column = bitIndex % markerSize;
            matrix[row][column] = byte & mask ? 1 : 0;
            bitIndex++;
        }
    }
    return matrix;
}

function getMarkerMatrix(kind: MarkerKind, dictionaryId: MarkerDictionaryId, value: string) {
    const definition = MARKER_DICTIONARIES[dictionaryId];
    const markerId = parseMarkerId(normalizeMarkerValue(kind, dictionaryId, value));
    return {
        markerId,
        matrix: bytesToBitMatrix(definition.firstRotationBytes[markerId], definition.markerSize),
        definition
    };
}

function createMarkerTexture(kind: MarkerKind, dictionaryId: MarkerDictionaryId, value: string) {
    const canvas = document.createElement('canvas');
    canvas.width = MARKER_CANVAS_SIZE;
    canvas.height = MARKER_CANVAS_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const { matrix, definition } = getMarkerMatrix(kind, dictionaryId, value);
    const size = MARKER_CANVAS_SIZE;
    const quietZone = 104;
    const outerMarkerSize = size - quietZone * 2;
    const borderCells = 1;
    const payloadSize = definition.markerSize;
    const totalCells = payloadSize + borderCells * 2;
    const cellSize = Math.floor(outerMarkerSize / totalCells);
    const markerSize = cellSize * totalCells;
    const offset = Math.floor((size - markerSize) / 2);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(offset, offset, markerSize, markerSize);

    for (let y = 0; y < payloadSize; y++) {
        for (let x = 0; x < payloadSize; x++) {
            ctx.fillStyle = matrix[y][x] ? '#ffffff' : '#0a0a0a';
            ctx.fillRect(
                offset + (x + borderCells) * cellSize,
                offset + (y + borderCells) * cellSize,
                cellSize,
                cellSize
            );
        }
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d4d4d8';
    ctx.strokeRect(1, 1, size - 2, size - 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
}

function applyMarkerMetadata(group: THREE.Group, kind: MarkerKind, dictionaryId: MarkerDictionaryId, value: string) {
    const definition = MARKER_DICTIONARIES[dictionaryId];
    const normalizedValue = normalizeMarkerValue(kind, dictionaryId, value);
    group.userData.value = normalizedValue;
    group.userData.markerDictionary = dictionaryId;
    group.userData.markerDictionaryLabel = definition.label;
    group.userData.markerKind = kind;
    group.userData.supportsMarkerDictionary = true;
    group.userData.surfaceAttached = true;
    group.name = `${group.userData.type} ${definition.label} #${normalizedValue}`;
}

function createMarkerMesh(kind: MarkerKind, value = '0', dictionaryId?: string) {
    const { dictionaryId: normalizedDictionaryId } = getDictionaryDefinition(kind, dictionaryId);
    const group = setCommonMeta(new THREE.Group(), kind === 'ArUco' ? 'ArUco маркер' : 'AprilTag маркер', {
        supportsValue: true,
        supportsMarkerDictionary: true,
        value,
        collidableRadius: 0.42,
        markerKind: kind
    });

    applyMarkerMetadata(group, kind, normalizedDictionaryId, value);

    const texture = createMarkerTexture(kind, normalizedDictionaryId, group.userData.value as string);
    const frontMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        color: 0xffffff,
        roughness: 0.94,
        metalness: 0.01
    });
    const backMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        color: 0xffffff,
        roughness: 0.96,
        metalness: 0.01
    });
    const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.98,
        metalness: 0
    });

    const sheet = new THREE.Mesh(
        new THREE.BoxGeometry(SHEET_SIZE, SHEET_SIZE, SHEET_THICKNESS),
        [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMaterial, backMaterial]
    );
    sheet.name = MARKER_SHEET_NAME;
    group.add(sheet);

    applyShadows(group);
    return group;
}

export function createArucoMarkerMesh(value = '0', dictionaryId?: string) {
    return createMarkerMesh('ArUco', value, dictionaryId);
}

export function createAprilTagMarkerMesh(value = '0', dictionaryId?: string) {
    return createMarkerMesh('AprilTag', value, dictionaryId);
}

function getAnchorPosition(
    options: NormalizedMarkerMapOptions,
    startCell: { row: number; column: number }
) {
    const width = (options.columns - 1) * (options.markerSize + options.gapX);
    const height = (options.rows - 1) * (options.markerSize + options.gapY);

    switch (options.anchor) {
        case 'top-left':
            return new THREE.Vector2(0, 0);
        case 'top-right':
            return new THREE.Vector2(width, 0);
        case 'bottom-left':
            return new THREE.Vector2(0, -height);
        case 'bottom-right':
            return new THREE.Vector2(width, -height);
        case 'start':
            return new THREE.Vector2(
                startCell.column * (options.markerSize + options.gapX),
                -startCell.row * (options.markerSize + options.gapY)
            );
        case 'center':
        default:
            return new THREE.Vector2(width * 0.5, -height * 0.5);
    }
}

function applyMarkerMapMetadata(
    group: THREE.Group,
    kind: MarkerKind,
    dictionaryId: MarkerDictionaryId,
    options: NormalizedMarkerMapOptions
) {
    const definition = MARKER_DICTIONARIES[dictionaryId];
    const count = options.rows * options.columns;
    const lastId = wrapMarkerId(options.startId + options.idStep * Math.max(0, count - 1), dictionaryId);
    const title = kind === 'AprilTag' ? 'AprilTag карта' : 'ArUco карта';
    const traversalLabel = options.traversal === 'column-major' ? 'по столбцам' : 'по строкам';
    const cornerLabels: Record<MarkerMapStartCorner, string> = {
        'top-left': 'сверху слева',
        'top-right': 'сверху справа',
        'bottom-left': 'снизу слева',
        'bottom-right': 'снизу справа'
    };

    group.name = `${title} ${options.rows}x${options.columns}`;
    group.userData = {
        ...group.userData,
        draggable: true,
        type: title,
        label: title,
        collidableRadius: Math.max(options.columns * (options.markerSize + options.gapX), options.rows * (options.markerSize + options.gapY)) * 0.6,
        isMarkerMap: true,
        markerMapKind: kind,
        markerMapConfig: { ...options },
        markerMapCount: count,
        markerMapStartId: options.startId,
        markerMapLastId: lastId,
        markerDictionary: dictionaryId,
        markerDictionaryLabel: definition.label,
        markerMapSummaryLines: [
            `Карта: ${options.rows} x ${options.columns} (${count} шт.)`,
            `ID: ${options.startId} -> ${lastId}, шаг ${options.idStep}`,
            `Словарь: ${definition.label}`,
            `Порядок: ${traversalLabel}, старт ${cornerLabels[options.startCorner]}${options.snake ? ', змейка' : ''}`,
            `Шаг сетки: ${(options.markerSize + options.gapX).toFixed(2)} x ${(options.markerSize + options.gapY).toFixed(2)} м`,
            `Размер маркера: ${options.markerSize.toFixed(2)} м, поворот: ${options.rotationDeg.toFixed(0)}°`
        ]
    };
}

function createMarkerMapMesh(kind: MarkerKind, dictionaryId?: string, options?: MarkerMapOptions) {
    const { dictionaryId: normalizedDictionaryId } = getDictionaryDefinition(kind, dictionaryId);
    const normalizedOptions = normalizeMarkerMapOptions(options);
    const title = kind === 'AprilTag' ? 'AprilTag карта' : 'ArUco карта';
    const group = setCommonMeta(new THREE.Group(), title, {
        isMarkerMap: true,
        supportsValue: false,
        supportsMarkerDictionary: false
    });

    const horizontalFromLeft = normalizedOptions.startCorner === 'top-left' || normalizedOptions.startCorner === 'bottom-left';
    const verticalFromTop = normalizedOptions.startCorner === 'top-left' || normalizedOptions.startCorner === 'top-right';
    const startCell = {
        row: verticalFromTop ? 0 : normalizedOptions.rows - 1,
        column: horizontalFromLeft ? 0 : normalizedOptions.columns - 1
    };
    const anchor = getAnchorPosition(normalizedOptions, startCell);
    const scaleFactor = normalizedOptions.markerSize / SHEET_SIZE;

    let index = 0;
    const outerCount = normalizedOptions.traversal === 'column-major' ? normalizedOptions.columns : normalizedOptions.rows;
    const innerCount = normalizedOptions.traversal === 'column-major' ? normalizedOptions.rows : normalizedOptions.columns;

    for (let outer = 0; outer < outerCount; outer++) {
        const reverseLine = normalizedOptions.snake && outer % 2 === 1;
        for (let inner = 0; inner < innerCount; inner++) {
            const logicalInner = reverseLine ? innerCount - 1 - inner : inner;
            const logicalRow = normalizedOptions.traversal === 'column-major' ? logicalInner : outer;
            const logicalColumn = normalizedOptions.traversal === 'column-major' ? outer : logicalInner;
            const row = verticalFromTop ? logicalRow : normalizedOptions.rows - 1 - logicalRow;
            const column = horizontalFromLeft ? logicalColumn : normalizedOptions.columns - 1 - logicalColumn;
            const markerId = wrapMarkerId(normalizedOptions.startId + normalizedOptions.idStep * index, normalizedDictionaryId);
            const marker = createMarkerMesh(kind, String(markerId), normalizedDictionaryId);
            marker.position.set(
                column * (normalizedOptions.markerSize + normalizedOptions.gapX) - anchor.x,
                -row * (normalizedOptions.markerSize + normalizedOptions.gapY) - anchor.y,
                SHEET_THICKNESS * 0.5 * scaleFactor + SURFACE_EPSILON
            );
            marker.scale.setScalar(scaleFactor);
            marker.userData.draggable = false;
            marker.userData.partOfMarkerMap = true;
            group.add(marker);
            index++;
        }
    }

    group.rotation.z = THREE.MathUtils.degToRad(normalizedOptions.rotationDeg);
    applyMarkerMapMetadata(group, kind, normalizedDictionaryId, normalizedOptions);
    applyShadows(group);
    return group;
}

export function createArucoMarkerMapMesh(dictionaryId?: string, options?: MarkerMapOptions) {
    return createMarkerMapMesh('ArUco', dictionaryId, options);
}

export function createAprilTagMarkerMapMesh(dictionaryId?: string, options?: MarkerMapOptions) {
    return createMarkerMapMesh('AprilTag', dictionaryId, options);
}

export function isMarkerObject(object: THREE.Object3D) {
    return object.userData?.markerKind === 'ArUco' || object.userData?.markerKind === 'AprilTag';
}

function updateMarkerMaterials(sheet: THREE.Mesh, kind: MarkerKind, dictionaryId: MarkerDictionaryId, value: string) {
    if (!Array.isArray(sheet.material)) return;
    const texturedMaterials = sheet.material.filter(
        (material, index) => (index === 4 || index === 5) && material instanceof THREE.MeshStandardMaterial
    ) as THREE.MeshStandardMaterial[];
    const mapsToDispose = new Set<THREE.Texture>();
    texturedMaterials.forEach((material) => {
        if (material.map) mapsToDispose.add(material.map);
    });
    mapsToDispose.forEach((map) => map.dispose());

    const texture = createMarkerTexture(kind, dictionaryId, value);
    texturedMaterials.forEach((material) => {
        material.map = texture;
        material.needsUpdate = true;
    });
}

export function updateMarkerValue(
    object: THREE.Object3D,
    params: { value?: string; dictionaryId?: string }
) {
    const group = object as THREE.Group;
    if (!group.userData.supportsValue || !isMarkerObject(group)) return false;

    const kind = group.userData.markerKind === 'AprilTag' ? 'AprilTag' : 'ArUco';
    const { dictionaryId } = getDictionaryDefinition(kind, params.dictionaryId || String(group.userData.markerDictionary || ''));
    const normalizedValue = normalizeMarkerValue(kind, dictionaryId, params.value ?? String(group.userData.value ?? '0'));
    applyMarkerMetadata(group, kind, dictionaryId, normalizedValue);

    const sheet = group.children.find((child) => child.name === MARKER_SHEET_NAME) as THREE.Mesh | undefined;
    if (sheet) {
        updateMarkerMaterials(sheet, kind, dictionaryId, normalizedValue);
    }
    return true;
}

function clampValue(value: number, min: number, max: number) {
    if (min > max) return (min + max) / 2;
    return Math.min(Math.max(value, min), max);
}

function makeCandidate(position: THREE.Vector3, anchor: THREE.Vector3, normal: THREE.Vector3): MarkerSurfaceCandidate {
    return {
        anchor,
        normal,
        score: position.distanceToSquared(anchor)
    };
}

function addBoxSurfaceCandidates(
    candidates: MarkerSurfaceCandidate[],
    position: THREE.Vector3,
    box: THREE.Box3
) {
    const size = new THREE.Vector3();
    box.getSize(size);
    if (size.lengthSq() < 0.0001) return;

    const x = clampValue(position.x, box.min.x, box.max.x);
    const y = clampValue(position.y, box.min.y, box.max.y);
    const z = clampValue(position.z, box.min.z, box.max.z);

    candidates.push(makeCandidate(position, new THREE.Vector3(x, y, box.max.z), new THREE.Vector3(0, 0, 1)));
    if (size.z > SURFACE_EPSILON) {
        candidates.push(makeCandidate(position, new THREE.Vector3(box.min.x, y, z), new THREE.Vector3(-1, 0, 0)));
        candidates.push(makeCandidate(position, new THREE.Vector3(box.max.x, y, z), new THREE.Vector3(1, 0, 0)));
        candidates.push(makeCandidate(position, new THREE.Vector3(x, box.min.y, z), new THREE.Vector3(0, -1, 0)));
        candidates.push(makeCandidate(position, new THREE.Vector3(x, box.max.y, z), new THREE.Vector3(0, 1, 0)));
    }
}

export function snapMarkerToSurface(object: THREE.Object3D, surfaceObjects: THREE.Object3D[] = []) {
    if (!isMarkerObject(object)) return false;

    const marker = object as THREE.Group;
    const currentPosition = marker.position.clone();
    const candidates: MarkerSurfaceCandidate[] = [
        makeCandidate(currentPosition, new THREE.Vector3(currentPosition.x, currentPosition.y, 0), new THREE.Vector3(0, 0, 1))
    ];

    for (const surface of surfaceObjects) {
        if (!surface || surface === marker || surface.parent === marker || marker.parent === surface) continue;
        if (isMarkerObject(surface)) continue;
        const box = new THREE.Box3().setFromObject(surface);
        if (box.isEmpty()) continue;
        addBoxSurfaceCandidates(candidates, currentPosition, box);
    }

    let best = candidates[0];
    for (const candidate of candidates) {
        if (candidate.score < best.score) best = candidate;
    }

    const normal = best.normal.clone().normalize();
    marker.position.copy(best.anchor).addScaledVector(normal, SHEET_THICKNESS * 0.5 + SURFACE_EPSILON);
    marker.quaternion.setFromUnitVectors(MARKER_LOCAL_NORMAL, normal);
    marker.userData.surfaceNormal = { x: normal.x, y: normal.y, z: normal.z };
    return true;
}
