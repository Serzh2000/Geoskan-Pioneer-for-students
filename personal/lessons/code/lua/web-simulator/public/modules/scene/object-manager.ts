import * as THREE from 'three';
import { log } from '../ui/logger.js';
import { transformControl, transformHelper, controls, droneMeshes, selectedObject, scene } from './scene-init.js';
import { drones, currentDroneId, simState } from '../state.js';
import { envGroup, addObjectToScene } from '../environment.js';
import { handleDeselection, deselectObject } from './selection.js';
import { handleSelection } from './input.js';

export type TransformMode = 'translate' | 'rotate' | 'scale';

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

export function activateTransformMode(mode: TransformMode, target: THREE.Object3D) {
    if (!transformControl || !target || !target.parent) return false;
    transformControl.attach(target);
    transformControl.setMode(mode);
    transformControl.visible = true;
    if (transformHelper) transformHelper.visible = true;
    transformControl.enabled = true;
    if (controls) controls.enabled = false;
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
            scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }
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
        handleSelection(clone, window.innerWidth / 2, window.innerHeight / 2);
        log('Объект дублирован', 'success');
    }
}

export function addObject(type: string) {
    const obj = addObjectToScene(type, (window as any).camera);
    if (obj) {
        handleDeselection();
        handleSelection(obj, window.innerWidth / 2, window.innerHeight / 2);
    }
}
