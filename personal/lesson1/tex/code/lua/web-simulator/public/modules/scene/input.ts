import * as THREE from 'three';
import { log } from '../ui/logger.js';
import { pointerDownPos, isHittingGizmo, transformControl, controls, raycaster, mouse, camera, droneMeshes, selectedObject, renderer } from './scene-init.js';
import { currentDroneId, simState } from '../state.js';
import { envGroup } from '../environment.js';
import { handleDeselection, deselectObject } from './selection.js';
import { deleteSelectedObject, duplicateObject, resetDroneToOrigin, activateTransformMode } from './object-manager.js';

export function onPointerDown(event: PointerEvent) {
    pointerDownPos.set(event.clientX, event.clientY);
    if (!transformControl) return;
    (window as any).isHittingGizmo = transformControl.dragging || (transformControl as any).axis !== null;
}

export function onPointerUp(event: PointerEvent) {
    if (simState.running && (window as any).cameraMode === 'fpv') return;
    if (!renderer || !camera || !transformControl || !raycaster) return;
    
    if ((window as any).isHittingGizmo || transformControl.dragging || (transformControl as any).axis !== null) {
        (window as any).isHittingGizmo = false;
        return;
    }

    const dist = pointerDownPos.distanceTo(new THREE.Vector2(event.clientX, event.clientY));
    if (dist > 5) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    const targets = [];
    for (const id in droneMeshes) {
        if (droneMeshes[id]) targets.push(droneMeshes[id]);
    }
    if (envGroup) {
        for (const child of envGroup.children) {
            if (child.visible) targets.push(child);
        }
    }
    const ground = (window as any).scene ? (window as any).scene.getObjectByName('Ground') : null;
    if (ground) targets.push(ground);
    
    try {
        const intersects = raycaster.intersectObjects(targets, true);
        if (intersects.length > 0) {
            let obj: any = intersects[0].object;
            while (obj.parent && obj.parent !== (window as any).scene && obj.parent !== envGroup) obj = obj.parent;
            
            if (obj.name === 'Ground' || obj.userData?.type === 'ground') {
                handleDeselection();
                return;
            }
            
            let isDrone = false;
            for (const id in droneMeshes) {
                if (obj === droneMeshes[id]) isDrone = true;
            }

            if (isDrone || (obj.userData && obj.userData.draggable)) {
                handleSelection(obj, event.clientX, event.clientY);
                return;
            }
        }
    } catch (e) {
        console.warn('[3D] Raycasting failed:', e);
    }

    handleDeselection();
}

export function handleSelection(obj: THREE.Object3D, x: number, y: number, showMenu = true) {
    if (selectedObject && selectedObject !== obj) deselectObject();

    (window as any).setSelectedObject(obj);
    
    const emissiveColor = new THREE.Color(0x38bdf8);
    obj.traverse((node: any) => {
        if (node.isMesh && node.material) {
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach((mat: any) => {
                if (mat.emissive) {
                    if (mat.userData.originalEmissive === undefined) {
                        mat.userData.originalEmissive = mat.emissive.getHex();
                    }
                    mat.emissive.copy(emissiveColor);
                    mat.emissiveIntensity = 0.6;
                }
            });
        }
    });

    if ((window as any).selectionHelper) {
        (window as any).selectionHelper.setFromObject(obj);
        (window as any).selectionHelper.visible = true;
    }

    if (showMenu && (window as any).showContextMenu) {
        let isDrone = false;
        for (const id in droneMeshes) {
            if (obj === droneMeshes[id]) isDrone = true;
        }

        (window as any).showContextMenu(x, y, 
            (mode: string) => {
                const target = selectedObject;
                if (!transformControl) return;
                if (!target || !target.parent) return;
                activateTransformMode(mode as any, target);
            },
            () => deleteSelectedObject(),
            () => duplicateObject(),
            isDrone ? () => resetDroneToOrigin() : undefined
        );
    }
}
