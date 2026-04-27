import { simState, resetState } from '../public/modules/core/state.js';

describe('Simulation State', () => {
    beforeEach(() => {
        resetState();
    });

    test('should have default values after reset', () => {
        expect(simState.running).toBe(false);
        expect(simState.status).toBe('ГОТОВ');
        expect(simState.pos).toEqual({ x: 0, y: 0, z: 0 });
        expect(simState.orientation.yaw).toBe(0);
        expect(simState.battery).toBe(100);
    });

    test('should update position', () => {
        simState.pos.x = 10;
        simState.pos.y = 20;
        simState.pos.z = 5;
        expect(simState.pos).toEqual({ x: 10, y: 20, z: 5 });
    });

    test('should update orientation', () => {
        simState.orientation.yaw = Math.PI;
        expect(simState.orientation.yaw).toBeCloseTo(Math.PI);
    });
});
