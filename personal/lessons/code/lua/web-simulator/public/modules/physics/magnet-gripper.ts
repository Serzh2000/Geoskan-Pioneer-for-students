import * as THREE from 'three';
import type { DroneState } from '../state.js';
import { log } from '../ui/logger.js';

const CARGO_TYPES = new Set(['Грузик', 'Груз']);
const CARGO_GRAVITY = 9.81;
const CARGO_GROUND_Z = 0;
const CARGO_GROUND_BOUNCE_DAMPING = 0.18;
const CARGO_AIR_DRAG = 0.2;

type CargoVelocity = {
    x: number;
    y: number;
    z: number;
};

function isCargoObject(obj: THREE.Object3D) {
    return CARGO_TYPES.has(obj.userData?.type);
}

function getCargoVelocity(obj: THREE.Object3D): CargoVelocity {
    const vel = obj.userData?.physicsVelocity as Partial<CargoVelocity> | undefined;
    return {
        x: typeof vel?.x === 'number' ? vel.x : 0,
        y: typeof vel?.y === 'number' ? vel.y : 0,
        z: typeof vel?.z === 'number' ? vel.z : 0
    };
}

function setCargoVelocity(obj: THREE.Object3D, velocity: CargoVelocity) {
    obj.userData.physicsVelocity = velocity;
}

export function updateDetachedCargoPhysics(dt: number, getObstacles: () => THREE.Object3D[]) {
    const obstacles = getObstacles();
    for (const obj of obstacles) {
        if (!isCargoObject(obj) || obj.userData?.attachedToDrone) continue;

        const velocity = getCargoVelocity(obj);
        const isMoving = Math.abs(velocity.x) > 0.001 || Math.abs(velocity.y) > 0.001 || Math.abs(velocity.z) > 0.001;
        const isAboveGround = obj.position.z > CARGO_GROUND_Z;
        if (!isMoving && !isAboveGround) continue;

        velocity.z -= CARGO_GRAVITY * dt;
        velocity.x -= velocity.x * CARGO_AIR_DRAG * dt;
        velocity.y -= velocity.y * CARGO_AIR_DRAG * dt;

        obj.position.x += velocity.x * dt;
        obj.position.y += velocity.y * dt;
        obj.position.z += velocity.z * dt;

        if (obj.position.z <= CARGO_GROUND_Z) {
            obj.position.z = CARGO_GROUND_Z;
            velocity.z = Math.abs(velocity.z) > 0.5 ? -velocity.z * CARGO_GROUND_BOUNCE_DAMPING : 0;
            if (Math.abs(velocity.z) < 0.1) velocity.z = 0;
            if (Math.abs(velocity.x) < 0.05) velocity.x = 0;
            if (Math.abs(velocity.y) < 0.05) velocity.y = 0;
        }

        setCargoVelocity(obj, velocity);
    }
}

export function updateMagnetGripper(
    drone: DroneState,
    getObstacles: () => THREE.Object3D[]
) {
    if (!drone.magnetGripper.active) {
        if (drone.magnetGripper.attachedObjectId) {
            const obj = getObstacles().find((item) => item.uuid === drone.magnetGripper.attachedObjectId);
            if (obj) {
                obj.userData.attachedToDrone = null;
                setCargoVelocity(obj, { ...drone.vel });
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
            obj.rotation.set(drone.orientation.pitch, drone.orientation.roll, drone.orientation.yaw, 'ZYX');
        }
        return;
    }

    const obstacles = getObstacles();
    const dronePos = new THREE.Vector3(drone.pos.x, drone.pos.y, drone.pos.z);
    for (const obj of obstacles) {
        // Захватываем перетаскиваемые объекты или специальные грузики
        if (obj.userData?.draggable || isCargoObject(obj)) {
            const dist = dronePos.distanceTo(obj.position);
            if (dist < 0.35) {
                drone.magnetGripper.attachedObjectId = obj.uuid;
                obj.userData.attachedToDrone = drone.id;
                setCargoVelocity(obj, { x: 0, y: 0, z: 0 });
                log(`[Magnet] Объект "${obj.userData.type || 'Груз'}" захвачен`, 'success');
                break;
            }
        }
    }
}
