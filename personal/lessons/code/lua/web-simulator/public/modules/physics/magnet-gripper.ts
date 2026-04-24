import * as THREE from 'three';
import type { DroneState } from '../state.js';
import { log } from '../ui/logger.js';

export function updateMagnetGripper(
    drone: DroneState,
    getObstacles: () => THREE.Object3D[]
) {
    if (!drone.magnetGripper.active) {
        if (drone.magnetGripper.attachedObjectId) {
            const obj = getObstacles().find((item) => item.uuid === drone.magnetGripper.attachedObjectId);
            if (obj) {
                obj.userData.attachedToDrone = null;
                log('[Magnet] Объект отпущен', 'info');
            }
            drone.magnetGripper.attachedObjectId = null;
        }
        return;
    }

    if (drone.magnetGripper.attachedObjectId) {
        const obj = getObstacles().find((item) => item.uuid === drone.magnetGripper.attachedObjectId);
        if (obj) {
            obj.position.set(drone.pos.x, drone.pos.y, drone.pos.z - 0.15);
            obj.rotation.set(drone.orientation.roll, drone.orientation.pitch, drone.orientation.yaw);
        }
        return;
    }

    const obstacles = getObstacles();
    const dronePos = new THREE.Vector3(drone.pos.x, drone.pos.y, drone.pos.z);
    for (const obj of obstacles) {
        if (obj.userData?.draggable || obj.userData?.type === 'Груз') {
            const dist = dronePos.distanceTo(obj.position);
            if (dist < 0.25) {
                drone.magnetGripper.attachedObjectId = obj.uuid;
                obj.userData.attachedToDrone = drone.id;
                log('[Magnet] Объект захвачен', 'success');
                break;
            }
        }
    }
}
