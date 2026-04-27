import type { DroneState } from '../core/state.js';
import { triggerLuaCallback } from '../lua/index.js';
import { log } from '../shared/logging/logger.js';
import {
    AIRBORNE_ALTITUDE_EPSILON,
    beginDisarmedFall
} from './events.js';

export type CommandQueueResult = 'continue' | 'abortFrame';

export function processCommandQueue(simState: DroneState, id: string): CommandQueueResult {
    if (simState.command_queue.length === 0) return 'continue';

    const cmd = simState.command_queue.shift();

    if (cmd === 1 || cmd === 4) {
        simState.status = 'ВЗВЕДЕН';
        triggerLuaCallback(id, 11);
    }

    if (cmd === 2) {
        if (simState.status !== 'ВЗВЕДЕН') {
            log(
                `[Physics] TAKEOFF игнорирован: status=${simState.status} (нужен ВЗВЕДЕН)`,
                'warn'
            );
            return 'abortFrame';
        }

        if (simState.target_pos.z < 1.0) {
            simState.target_pos.z = 1.0;
        }
        if (simState.target_pos.x === 0 && simState.target_pos.y === 0) {
            simState.target_pos.x = simState.pos.x;
            simState.target_pos.y = simState.pos.y;
        }
        simState.status = 'ВЗЛЕТ';
    }

    if (cmd === 3) {
        simState.target_pos.z = 0;
        simState.target_pos.x = simState.pos.x;
        simState.target_pos.y = simState.pos.y;
        simState.status = 'ПОСАДКА';
        simState.pendingLocalPoint = false;
        simState.pointReachedFlag = false;
    }

    if (cmd === 4) simState.status = 'ВЗВЕДЕН';

    if (cmd === 5) {
        if (simState.pos.z > AIRBORNE_ALTITUDE_EPSILON) {
            beginDisarmedFall(simState, id, 'DISARM в воздухе: двигатели отключены, начинается свободное падение.');
        } else {
            simState.status = 'ГОТОВ';
            simState.pendingLocalPoint = false;
            simState.pointReachedFlag = false;
            simState.vel = { x: 0, y: 0, z: 0 };
            simState.target_pos = { ...simState.pos, z: 0 };
            simState.target_alt = 0;
        }
    }

    return 'continue';
}
