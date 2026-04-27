import * as THREE from 'three';
import { updateSceneObjectPoints } from '../environment/index.js';
import type { ScenePathPoint } from '../environment/obstacles.js';
import { log } from '../shared/logging/logger.js';
import { normalizePoints } from './object-catalog.js';
import { camera, raycaster, renderer, scene, selectedObject } from './scene-init.js';
import { exitTransformMode } from './selection.js';

const groundPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const SNAP_THRESHOLD = 0.18;

type EditingState = {
    active: boolean;
    target: THREE.Object3D | null;
    originalPoints: ScenePathPoint[];
    workingPoints: ScenePathPoint[];
    hoverPoint: ScenePathPoint | null;
    previewGroup: THREE.Group | null;
    lastSnapAxes: string[];
};

const editingState: EditingState = {
    active: false,
    target: null,
    originalPoints: [],
    workingPoints: [],
    hoverPoint: null,
    previewGroup: null,
    lastSnapAxes: []
};

function clonePoints(points: ScenePathPoint[]) {
    return points.map((point) => ({ x: point.x, y: point.y, z: point.z ?? 0 }));
}

function pointToVector(point: ScenePathPoint) {
    return new THREE.Vector3(point.x, point.y, point.z ?? 0);
}

function localPointToWorldVector(point: ScenePathPoint) {
    const local = pointToVector(point);
    if (!editingState.target) return local;
    return editingState.target.localToWorld(local);
}

function worldVectorToLocalPoint(point: THREE.Vector3): ScenePathPoint {
    if (!editingState.target) {
        return { x: point.x, y: point.y, z: point.z };
    }
    const local = editingState.target.worldToLocal(point.clone());
    return {
        x: local.x,
        y: local.y,
        z: local.z
    };
}

function roundIfClose(value: number) {
    const rounded = Math.round(value);
    return Math.abs(value - rounded) <= SNAP_THRESHOLD ? rounded : value;
}

function applySoftSnap(point: THREE.Vector3) {
    const next = point.clone();
    const snapAxes: string[] = [];

    const snappedX = roundIfClose(next.x);
    if (snappedX !== next.x) snapAxes.push('X');
    next.x = snappedX;

    const snappedY = roundIfClose(next.y);
    if (snappedY !== next.y) snapAxes.push('Y');
    next.y = snappedY;

    const snappedZ = roundIfClose(next.z);
    if (snappedZ !== next.z) snapAxes.push('Z');
    next.z = Math.max(0, snappedZ);

    return { point: next, snapAxes };
}

function setCoordsHint(point: ScenePathPoint | null, snapAxes: string[] = []) {
    const coordsEl = document.getElementById('scene-click-coords');
    if (!coordsEl) return;
    if (!point) {
        coordsEl.style.display = 'none';
        coordsEl.textContent = '';
        return;
    }

    const snappedText = snapAxes.length ? ` | прилипание: ${snapAxes.join(', ')}` : '';
    coordsEl.textContent =
        `Курсор: ${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}${snappedText}`;
    coordsEl.style.display = 'block';
}

function disposePreviewGroup() {
    if (!editingState.previewGroup) return;
    editingState.previewGroup.removeFromParent();
    editingState.previewGroup.traverse((node: any) => {
        if (node.geometry) node.geometry.dispose();
        if (node.material) {
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach((material: THREE.Material) => material.dispose());
        }
    });
    editingState.previewGroup = null;
}

function buildMarker(point: ScenePathPoint, color: number, radius: number) {
    const marker = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 16, 16),
        new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.95,
            depthTest: false
        })
    );
    marker.position.copy(pointToVector(point));
    marker.renderOrder = 9800;
    return marker;
}

function refreshPreview() {
    disposePreviewGroup();
    if (!editingState.active || !scene) return;

    const group = new THREE.Group();
    group.name = '__linear_feature_preview__';

    const previewPoints = clonePoints(editingState.workingPoints);
    if (editingState.hoverPoint) previewPoints.push({ ...editingState.hoverPoint });

    if (previewPoints.length >= 2) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(previewPoints.map(localPointToWorldVector));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.95,
            depthTest: false
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.renderOrder = 9799;
        group.add(line);
    }

    editingState.workingPoints.forEach((point, index) => {
        group.add(buildMarker(
            {
                x: localPointToWorldVector(point).x,
                y: localPointToWorldVector(point).y,
                z: localPointToWorldVector(point).z
            },
            index === 0 ? 0x34d399 : 0x38bdf8,
            0.12
        ));
    });

    if (editingState.hoverPoint) {
        group.add(buildMarker(
            {
                x: localPointToWorldVector(editingState.hoverPoint).x,
                y: localPointToWorldVector(editingState.hoverPoint).y,
                z: localPointToWorldVector(editingState.hoverPoint).z
            },
            0xf59e0b,
            0.1
        ));
    }

    group.traverse((node: any) => {
        node.renderOrder = 9800;
    });
    scene.add(group);
    editingState.previewGroup = group;
}

function getHoverPointFromEvent(event: PointerEvent) {
    if (!renderer || !camera || !raycaster) return null;
    const rect = renderer.domElement.getBoundingClientRect();
    const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);

    const intersection = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(groundPlane, intersection)) return null;
    const snapped = applySoftSnap(intersection);
    return {
        point: worldVectorToLocalPoint(snapped.point),
        worldPoint: {
            x: snapped.point.x,
            y: snapped.point.y,
            z: snapped.point.z
        } satisfies ScenePathPoint,
        snapAxes: snapped.snapAxes
    };
}

function syncObjectPoints() {
    if (!editingState.target) return false;
    const ok = updateSceneObjectPoints(editingState.target, editingState.workingPoints);
    if (ok) {
        (window as any).updateSceneManager?.();
    }
    return ok;
}

function resetState() {
    disposePreviewGroup();
    editingState.active = false;
    editingState.target = null;
    editingState.originalPoints = [];
    editingState.workingPoints = [];
    editingState.hoverPoint = null;
    editingState.lastSnapAxes = [];
    setCoordsHint(null);
    (window as any).updateSceneManager?.();
}

export function isLinearFeatureEditingActive(objectId?: string) {
    if (!editingState.active) return false;
    return !objectId || editingState.target?.uuid === objectId;
}

export function getLinearFeatureEditingTargetId() {
    return editingState.target?.uuid || null;
}

export function startLinearFeatureEditing(target = selectedObject) {
    if (!target?.userData?.supportsPoints) {
        log('Визуальная прокладка доступна только для дороги или рельс', 'warn');
        return false;
    }

    const points = normalizePoints(target.userData?.points);
    if (points.length < 2) {
        log('Для визуальной прокладки нужно минимум 2 точки у объекта', 'warn');
        return false;
    }

    if (editingState.active && editingState.target?.uuid === target.uuid) return true;
    if (editingState.active) finishLinearFeatureEditing(true);

    exitTransformMode();
    editingState.active = true;
    editingState.target = target;
    editingState.originalPoints = clonePoints(points);
    editingState.workingPoints = clonePoints(points);
    editingState.hoverPoint = null;
    editingState.lastSnapAxes = [];
    refreshPreview();
    (window as any).updateSceneManager?.();
    log('Режим прокладки включен: ЛКМ добавляет точку, Backspace удаляет последнюю, Enter/ПКМ завершает, Esc отменяет', 'info');
    return true;
}

export function finishLinearFeatureEditing(commit = true) {
    if (!editingState.active || !editingState.target) return false;

    if (!commit) {
        updateSceneObjectPoints(editingState.target, editingState.originalPoints);
        log('Прокладка маршрута отменена, исходные точки восстановлены', 'info');
    } else {
        log('Прокладка маршрута завершена', 'success');
    }

    resetState();
    return true;
}

export function handleLinearEditingPointerMove(event: PointerEvent) {
    if (!editingState.active) return false;
    const hover = getHoverPointFromEvent(event);
    if (!hover) return true;

    editingState.hoverPoint = hover.point;
    editingState.lastSnapAxes = hover.snapAxes;
    setCoordsHint(hover.worldPoint, hover.snapAxes);
    refreshPreview();
    return true;
}

export function handleLinearEditingPointerUp(event: PointerEvent) {
    if (!editingState.active) return false;

    if (event.button === 2) {
        finishLinearFeatureEditing(true);
        return true;
    }
    if (event.button !== 0) return true;

    const hover = editingState.hoverPoint ? {
        point: editingState.hoverPoint,
        worldPoint: {
            x: localPointToWorldVector(editingState.hoverPoint).x,
            y: localPointToWorldVector(editingState.hoverPoint).y,
            z: localPointToWorldVector(editingState.hoverPoint).z
        } satisfies ScenePathPoint,
        snapAxes: editingState.lastSnapAxes
    } : getHoverPointFromEvent(event);
    if (!hover) return true;

    editingState.hoverPoint = hover.point;
    editingState.lastSnapAxes = hover.snapAxes;
    editingState.workingPoints.push({ ...hover.point });
    const ok = syncObjectPoints();
    if (ok) {
        setCoordsHint(hover.worldPoint, hover.snapAxes);
        refreshPreview();
    }
    return true;
}

export function handleLinearEditingKeyDown(event: KeyboardEvent) {
    if (!editingState.active) return false;

    if (event.key === 'Enter') {
        event.preventDefault();
        finishLinearFeatureEditing(true);
        return true;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        finishLinearFeatureEditing(false);
        return true;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        if (editingState.workingPoints.length <= 2) {
            log('У маршрута должно остаться минимум 2 точки', 'warn');
            return true;
        }
        editingState.workingPoints.pop();
        syncObjectPoints();
        refreshPreview();
        return true;
    }

    return false;
}
