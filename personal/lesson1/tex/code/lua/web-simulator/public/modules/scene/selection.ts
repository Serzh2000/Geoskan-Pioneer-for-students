import * as THREE from 'three';
import { controls, transformControl, transformHelper, selectedObject, setSelectedObject, scene, selectionHelper } from './scene-init.js';
import { log } from '../ui/logger.js';

export function handleDeselection() {
    if (selectedObject) deselectObject();
    if (transformControl) transformControl.detach();
    if (transformHelper) transformHelper.visible = false;
    if ((window as any).hideContextMenu) (window as any).hideContextMenu();
    if (controls) controls.enabled = (window as any).cameraMode === 'free';
}

export function deselectObject() {
    if (!selectedObject) return;
    
    selectedObject.traverse((node: any) => {
        if (node.isMesh && node.material) {
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach((mat: any) => {
                if (mat.emissive && mat.userData.originalEmissive !== undefined) {
                    mat.emissive.setHex(mat.userData.originalEmissive);
                    mat.emissiveIntensity = 0;
                }
            });
        }
    });
    
    if (selectionHelper) {
        selectionHelper.visible = false;
        const dummy = scene.getObjectByName('selection_dummy');
        if (dummy) selectionHelper.setFromObject(dummy);
    }
    setSelectedObject(null);
}
