import * as THREE from 'three';
import { log } from '../ui/logger.js';
import { transformControl, transformHelper, controls, droneMeshes, selectedObject } from './scene-init.js';
import { drones, currentDroneId, simState, simSettings } from '../state.js';
import { envGroup, addObjectToScene, updateSceneObjectPoints, updateSceneObjectValue } from '../environment.js';
import { MarkerMapOptions, SceneObjectOptions, ScenePathPoint } from '../environment/obstacles.js';
import { handleDeselection } from './selection.js';
import { handleSelection } from './input.js';
import { updateTransformModeDecorations } from './transform.js';

export type TransformMode = 'translate' | 'rotate' | 'scale';
export type RotationAxis = 'x' | 'y' | 'z';

const ROTATION_STEP_OPTIONS = [5, 15, 45] as const;
let rotationStepDegrees = 15;
let initialTransformTarget: THREE.Object3D | null = null;
let initialTransformSnapshot: {
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
    scale: THREE.Vector3;
} | null = null;

function formatPoints(points: ScenePathPoint[]) {
    return points.map((point) => `${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}`).join('\n');
}

function normalizePoints(points: unknown): ScenePathPoint[] {
    if (!Array.isArray(points)) return [];
    return points
        .map((point: any) => ({
            x: Number(point?.x),
            y: Number(point?.y),
            z: Number(point?.z ?? 0)
        }))
        .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z));
}

function parsePointsText(pointsText: string) {
    const points = pointsText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const values = line
                .split(/[;, ]+/)
                .map((value) => value.trim())
                .filter(Boolean)
                .map(Number);
            return {
                x: values[0],
                y: values[1],
                z: Number.isFinite(values[2]) ? values[2] : 0
            };
        })
        .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));

    return points;
}

export function getSceneTopLevelObjects() {
    const objects: THREE.Object3D[] = [];
    for (const id in droneMeshes) {
        if (droneMeshes[id]) objects.push(droneMeshes[id]);
    }
    if (envGroup) objects.push(...envGroup.children);
    return objects;
}

export function findSceneObjectById(id: string) {
    return getSceneTopLevelObjects().find((obj) => obj.uuid === id) || null;
}

export function isTransformableObject(target: THREE.Object3D | null | undefined) {
    if (!target || !target.parent) return false;
    for (const id in droneMeshes) {
        if (target === droneMeshes[id]) return true;
    }
    return !!target.userData?.draggable;
}

export function getRotationStepOptions() {
    return [...ROTATION_STEP_OPTIONS];
}

export function getRotationStepDegrees() {
    return rotationStepDegrees;
}

export function setRotationStepDegrees(step: number) {
    const normalized = ROTATION_STEP_OPTIONS.includes(step as typeof ROTATION_STEP_OPTIONS[number]) ? step : 15;
    rotationStepDegrees = normalized;
    if (transformControl?.getMode() === 'rotate') {
        transformControl.setRotationSnap(THREE.MathUtils.degToRad(rotationStepDegrees));
    }
    if ((window as any).setTransformToolbarRotationStep) {
        (window as any).setTransformToolbarRotationStep(rotationStepDegrees);
    }
    return rotationStepDegrees;
}

export function rememberSelectedObjectInitialTransform(target: THREE.Object3D) {
    initialTransformTarget = target;
    initialTransformSnapshot = {
        position: target.position.clone(),
        quaternion: target.quaternion.clone(),
        scale: target.scale.clone()
    };
}

export function clearSelectedObjectInitialTransform(target?: THREE.Object3D | null) {
    if (target && initialTransformTarget && target !== initialTransformTarget) return;
    initialTransformTarget = null;
    initialTransformSnapshot = null;
}

export function rotateSelectedObjectByDegrees(axis: RotationAxis, deltaDegrees: number) {
    if (!selectedObject || !transformControl || !isTransformableObject(selectedObject) || simState.running) return false;
    const radians = THREE.MathUtils.degToRad(deltaDegrees);
    selectedObject.rotation[axis] += radians;
    selectedObject.updateMatrixWorld(true);
    transformControl.dispatchEvent({ type: 'change', target: transformControl });
    updateTransformModeDecorations(transformControl.getMode(), selectedObject);
    return true;
}

export function resetSelectedObjectToInitialTransform() {
    if (!selectedObject || !transformControl || !isTransformableObject(selectedObject) || simState.running) return false;
    if (!initialTransformTarget || !initialTransformSnapshot || selectedObject !== initialTransformTarget) return false;

    selectedObject.position.copy(initialTransformSnapshot.position);
    selectedObject.quaternion.copy(initialTransformSnapshot.quaternion);
    selectedObject.scale.copy(initialTransformSnapshot.scale);
    selectedObject.updateMatrixWorld(true);
    transformControl.dispatchEvent({ type: 'change', target: transformControl });
    updateTransformModeDecorations(transformControl.getMode(), selectedObject);
    return true;
}

export function activateTransformMode(mode: TransformMode, target: THREE.Object3D) {
    if (!transformControl || !target || !target.parent || simState.running) return false;
    if (!isTransformableObject(target)) return false;

    transformControl.attach(target);
    transformControl.setMode(mode);
    transformControl.enabled = true;
    transformControl.size = mode === 'rotate' ? 1.3 : 1.15;
    transformControl.showX = true;
    transformControl.showY = true;
    transformControl.showZ = true;
    transformControl.setSpace(mode === 'scale' ? 'local' : 'world');
    transformControl.setTranslationSnap(null);
    transformControl.setScaleSnap(null);
    transformControl.setRotationSnap(mode === 'rotate' ? THREE.MathUtils.degToRad(rotationStepDegrees) : null);
    transformControl.visible = simSettings.showGizmo;
    if (transformHelper) {
        transformHelper.visible = simSettings.showGizmo;
        transformHelper.updateMatrixWorld(true);
    }
    if ((window as any).setGizmoToolbarMode) (window as any).setGizmoToolbarMode(mode);
    if ((window as any).setTransformToolbarRotationStep) {
        (window as any).setTransformToolbarRotationStep(rotationStepDegrees);
    }
    updateTransformModeDecorations(mode, target);
    if (controls) controls.enabled = (window as any).cameraMode === 'free' && !(window as any).isTransforming;
    return true;
}

export function getSelectedSceneObjectId() {
    return selectedObject ? selectedObject.uuid : null;
}

export function listSceneObjects(): any[] {
    const selectedId = selectedObject ? selectedObject.uuid : '';
    return getSceneTopLevelObjects().map((obj) => {
        let isDrone = false;
        for (const id in droneMeshes) {
            if (obj === droneMeshes[id]) isDrone = true;
        }
        const metaLines: string[] = [];
        if (obj.userData?.value !== undefined) metaLines.push(`Значение: ${obj.userData.value}`);
        if (obj.userData?.markerDictionaryLabel && !obj.userData?.isMarkerMap) {
            metaLines.push(`Словарь: ${obj.userData.markerDictionaryLabel}`);
        }
        if (obj.userData?.floors !== undefined) metaLines.push(`Этажей: ${obj.userData.floors}`);
        if (obj.userData?.featureKind === 'road') metaLines.push('Редактируемый маршрут: дорога');
        if (obj.userData?.featureKind === 'rail') metaLines.push('Редактируемый маршрут: железная дорога');
        if (obj.userData?.presetName) metaLines.push(`Пресет: ${obj.userData.presetName}`);
        if (Array.isArray(obj.userData?.markerMapSummaryLines)) metaLines.push(...obj.userData.markerMapSummaryLines);

        const points = normalizePoints(obj.userData?.points);
        return {
            id: obj.uuid,
            name: obj.name || (obj.userData?.type || obj.type),
            sceneType: obj.userData?.type || obj.type,
            objectType: obj.type,
            draggable: !!obj.userData?.draggable,
            isDrone: isDrone,
            selected: obj.uuid === selectedId,
            position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
            rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
            scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z },
            supportsValue: !!obj.userData?.supportsValue,
            supportsMarkerDictionary: !!obj.userData?.supportsMarkerDictionary,
            supportsPoints: !!obj.userData?.supportsPoints,
            markerKind: obj.userData?.markerKind ? String(obj.userData.markerKind) : '',
            markerDictionary: obj.userData?.markerDictionary ? String(obj.userData.markerDictionary) : '',
            value: obj.userData?.value !== undefined ? String(obj.userData.value) : '',
            pointsText: points.length ? formatPoints(points) : '',
            metaLines
        };
    });
}

export function selectSceneObjectById(id: string) {
    const obj = findSceneObjectById(id);
    if (!obj) return false;
    handleSelection(obj, window.innerWidth / 2, window.innerHeight / 2, false);
    return true;
}

export function setSceneObjectTransformMode(mode: TransformMode, id?: string) {
    const target = id ? findSceneObjectById(id) : selectedObject;
    if (!target) return false;
    if (!selectedObject || selectedObject.uuid !== target.uuid) {
        handleSelection(target, window.innerWidth / 2, window.innerHeight / 2, false);
    }
    return activateTransformMode(mode, target);
}

export function deleteSceneObjectById(id: string) {
    const obj = findSceneObjectById(id);
    let isDrone = false;
    for (const droneId in droneMeshes) {
        if (obj === droneMeshes[droneId]) isDrone = true;
    }
    if (!obj || isDrone) return false;
    handleSelection(obj, window.innerWidth / 2, window.innerHeight / 2, false);
    deleteSelectedObject();
    return true;
}

export function resetDroneToOrigin() {
    const currentDrone = droneMeshes[currentDroneId];
    if (!currentDrone) return false;
    const droneState = drones[currentDroneId];
    
    if (simState.running) {
        log('Нельзя вернуть дрон в начало во время выполнения скрипта', 'warn');
        return false;
    }
    
    droneState.pos = { x: 0, y: 0, z: 0 };
    droneState.orientation = { roll: 0, pitch: 0, yaw: 0 };
    droneState.vel = { x: 0, y: 0, z: 0 };
    droneState.target_alt = 0;
    droneState.target_pos = { x: 0, y: 0, z: 0 };
    droneState.target_yaw = 0;
    droneState.pendingLocalPoint = false;
    currentDrone.position.set(0, 0, 0);
    currentDrone.rotation.set(0, 0, 0, 'ZYX');
    log(`Дрон ${currentDroneId} возвращен в начало системы координат`, 'success');
    
    if (selectedObject === currentDrone && transformControl) {
        transformControl.detach();
        transformControl.attach(currentDrone);
    }
    return true;
}

export function deleteSelectedObject() {
    let isDrone = false;
    for (const id in droneMeshes) {
        if (selectedObject === droneMeshes[id]) isDrone = true;
    }
    
    if (selectedObject && !isDrone) {
        const obj = selectedObject;
        handleDeselection();

        obj.traverse((child: any) => {
            if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((material: THREE.Material) => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            }
        });
        obj.removeFromParent();
        log('Объект удален', 'info');
    }
}

export function duplicateObject() {
    let isDrone = false;
    for (const id in droneMeshes) {
        if (selectedObject === droneMeshes[id]) isDrone = true;
    }

    if (selectedObject && !isDrone) {
        const clone = selectedObject.clone();
        clone.position.x += 1;
        clone.position.y += 1;
        if (envGroup) envGroup.add(clone);
        
        handleDeselection();
        handleSelection(clone, window.innerWidth / 2, window.innerHeight / 2, false, false);
        log('Объект дублирован', 'success');
    }
}

export function addObject(
    type: string,
    options: { value?: string; markerDictionary?: string; pointsText?: string; floors?: number; markerMap?: MarkerMapOptions } = {}
) {
    const parsedPoints = options.pointsText ? parsePointsText(options.pointsText) : [];
    const objectOptions: SceneObjectOptions = {
        value: options.value,
        markerDictionary: options.markerDictionary,
        floors: options.floors,
        points: parsedPoints.length >= 2 ? parsedPoints : undefined,
        markerMap: options.markerMap
    };
    const obj = addObjectToScene(type, controls?.camera || null, objectOptions);
    if (obj) {
        handleDeselection();
        handleSelection(obj, window.innerWidth / 2, window.innerHeight / 2, false, false);
        log(`Добавлен объект: ${obj.userData?.type || obj.name}`, 'success');
    } else {
        log(`Не удалось добавить объект типа "${type}"`, 'warn');
    }
}

export function updateSelectedSceneObject(params: { value?: string; markerDictionary?: string; pointsText?: string }) {
    if (!selectedObject || selectedObject.userData?.draggable === false) return false;

    let updated = false;
    if ((params.value !== undefined || params.markerDictionary !== undefined) && selectedObject.userData?.supportsValue) {
        updated = updateSceneObjectValue(selectedObject, {
            value: params.value,
            markerDictionary: params.markerDictionary
        }) || updated;
    }

    if (params.pointsText !== undefined && selectedObject.userData?.supportsPoints) {
        const points = parsePointsText(params.pointsText);
        if (points.length < 2) {
            log('Для дороги или рельс нужно минимум 2 точки', 'warn');
            return false;
        }
        updated = updateSceneObjectPoints(selectedObject, points) || updated;
    }

    if (updated) {
        handleSelection(selectedObject, window.innerWidth / 2, window.innerHeight / 2, false);
        log('Параметры объекта обновлены', 'success');
    }

    return updated;
}

export function appendPointToSelectedLinearObject() {
    if (!selectedObject || !selectedObject.userData?.supportsPoints) return false;

    const points = normalizePoints(selectedObject.userData?.points);
    if (points.length < 2) return false;

    const last = points[points.length - 1];
    const prev = points[points.length - 2];
    const dir = new THREE.Vector3(last.x - prev.x, last.y - prev.y, last.z - prev.z);
    if (dir.lengthSq() < 0.0001) dir.set(4, 0, 0);
    dir.normalize().multiplyScalar(5);

    points.push({
        x: last.x + dir.x,
        y: last.y + dir.y,
        z: Math.max(0, last.z + dir.z)
    });

    const ok = updateSceneObjectPoints(selectedObject, points);
    if (ok) {
        handleSelection(selectedObject, window.innerWidth / 2, window.innerHeight / 2, false);
        log('В маршрут добавлена новая точка', 'success');
    }
    return ok;
}
