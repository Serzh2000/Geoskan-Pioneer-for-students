import type { DroneState } from '../core/state.js';
import { MAX_PATH_POINTS, pathPoints } from '../core/state.js';
import { TRACE_SAMPLE_INTERVAL } from './constants.js';

export function updateTracePath(id: string, simState: DroneState, dt: number, isFlying: boolean) {
    if (isFlying) {
        simState.traceSampleAccumulator += dt;
        while (simState.traceSampleAccumulator >= TRACE_SAMPLE_INTERVAL) {
            if (!pathPoints[id]) pathPoints[id] = [];
            pathPoints[id].push({ ...simState.pos });
            if (pathPoints[id].length > MAX_PATH_POINTS) pathPoints[id].shift();
            simState.traceSampleAccumulator -= TRACE_SAMPLE_INTERVAL;
        }
        return;
    }

    simState.traceSampleAccumulator = 0;
}
