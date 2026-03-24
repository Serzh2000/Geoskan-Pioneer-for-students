import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { drones, currentDroneId, simState } from '../state.js';
import { log } from '../ui/logger.js';
import { droneMeshes, selectedObject, setSelectedObject, transformControl, controls } from './scene-init.js';

export function setupTransformControlListeners() {
    transformControl.addEventListener('change', () => {
        if ((window as any).selectionHelper) (window as any).selectionHelper.update();
        
        if (selectedObject) {
            let selectedDroneId: string | null = null;
            for (const id in droneMeshes) {
                if (selectedObject === droneMeshes[id]) {
                    selectedDroneId = id;
                    break;
                }
            }
            if (selectedDroneId) {
                const drone = drones[selectedDroneId];
                if (drone) {
                    drone.pos.x = selectedObject.position.x;
                    drone.pos.y = selectedObject.position.y;
                    drone.pos.z = Math.max(0, selectedObject.position.z);
                    selectedObject.position.z = drone.pos.z;
                    drone.orientation.yaw = selectedObject.rotation.z;
                    drone.target_alt = drone.pos.z;
                    drone.target_pos = { ...drone.pos };
                    drone.target_yaw = drone.orientation.yaw;
                }
            } else if (selectedObject.userData && selectedObject.userData.draggable) {
                selectedObject.position.z = Math.max(0, selectedObject.position.z);
            }
        }
    });

    transformControl.addEventListener('dragging-changed', (event: any) => {
        const isDragging = event.value;
        (window as any).isTransforming = isDragging;
        if (controls) controls.enabled = !isDragging && (window as any).cameraMode === 'free';
    });
}
