describe('drone FSM validation', () => {
    let MCECommands: typeof import('../public/modules/autopilot/mce-events.js').MCECommands;
    let applyGoToLocalPointRequest: typeof import('../public/modules/autopilot/fsm.js').applyGoToLocalPointRequest;
    let enterLandingProcess: typeof import('../public/modules/autopilot/fsm.js').enterLandingProcess;
    let enterPreflight: typeof import('../public/modules/autopilot/fsm.js').enterPreflight;
    let enterTakeoffProcess: typeof import('../public/modules/autopilot/fsm.js').enterTakeoffProcess;
    let handlePreflightTimeout: typeof import('../public/modules/autopilot/fsm.js').handlePreflightTimeout;
    let queueMceCommand: typeof import('../public/modules/autopilot/fsm.js').queueMceCommand;
    let setDroneFsmState: typeof import('../public/modules/autopilot/fsm.js').setDroneFsmState;
    let withCommandSource: typeof import('../public/modules/autopilot/fsm.js').withCommandSource;
    let createDroneState: typeof import('../public/modules/core/state.js').createDroneState;
    let resetState: typeof import('../public/modules/core/state.js').resetState;
    let processCommandQueue: typeof import('../public/modules/physics/commands.js').processCommandQueue;
    let drone: ReturnType<typeof import('../public/modules/core/state.js').createDroneState>;
    const logLines: string[] = [];

    beforeAll(async () => {
        const logsEl = {
            appendChild(node: { innerHTML?: string }) {
                logLines.push(String(node.innerHTML || ''));
            },
            scrollTop: 0,
            scrollHeight: 0
        };

        (globalThis as any).window = {};
        (globalThis as any).document = {
            getElementById: (id: string) => (id === 'logs' ? logsEl : null),
            createElement: () => ({ className: '', innerHTML: '' })
        };

        await import('../public/modules/shared/logging/logger.js');
        ({ MCECommands } = await import('../public/modules/autopilot/mce-events.js'));
        ({
            applyGoToLocalPointRequest,
            enterLandingProcess,
            enterPreflight,
            enterTakeoffProcess,
            handlePreflightTimeout,
            queueMceCommand,
            setDroneFsmState,
            withCommandSource
        } = await import('../public/modules/autopilot/fsm.js'));
        ({ createDroneState, resetState } = await import('../public/modules/core/state.js'));
        ({ processCommandQueue } = await import('../public/modules/physics/commands.js'));
        drone = createDroneState('fsm_test_drone', 'FSM Test Drone');
    });

    beforeEach(() => {
        resetState(drone.id);
        drone.running = true;
        logLines.length = 0;
    });

    test('stops simulation on instantaneous TAKEOFF -> goToLocalPoint -> LANDING sequence', () => {
        queueMceCommand(drone, MCECommands.MCE_TAKEOFF, 'direct');
        applyGoToLocalPointRequest(drone, { x: 1, y: 0, z: 1 });

        expect(() => queueMceCommand(drone, MCECommands.MCE_LANDING, 'direct')).toThrow(
            'CRITICAL ERROR: Вызовы команд произошли одновременно! Код выполнился мгновенно без использования Timer.callLater. В реальности дрон проигнорирует эти команды или упадет.'
        );
        expect(drone.running).toBe(false);
        expect(drone.status).toBe('ОШИБКА');
    });

    test('ignores TAKEOFF outside PREFLIGHT', () => {
        expect(enterTakeoffProcess(drone)).toBe(false);
        expect(drone.fsmState).toBe('IDLE');
        expect(logLines.some((line) => line.includes('WARNING: Команда взлета проигнорирована: моторы не запущены'))).toBe(true);
    });

    test('rejects goToLocalPoint on ground', () => {
        expect(applyGoToLocalPointRequest(drone, { x: 1, y: 2, z: 1 })).toBe(false);
        expect(drone.fsmState).toBe('IDLE');
        expect(logLines.some((line) => line.includes('CRITICAL WARNING: Команда goToLocalPoint вызвана на земле!'))).toBe(true);
    });

    test('throws detailed FSM error for goToLocalPoint during PREFLIGHT', () => {
        setDroneFsmState(drone, 'PREFLIGHT');

        expect(() => applyGoToLocalPointRequest(drone, { x: 1, y: 0, z: 1 })).toThrow(
            'Ошибка FSM: Невозможный переход из состояния PREFLIGHT через команду GO_TO_LOCAL_POINT'
        );
    });

    test('returns to IDLE after PREFLIGHT timeout', () => {
        expect(enterPreflight(drone)).toBe(true);
        drone.current_time = 3.1;

        expect(handlePreflightTimeout(drone)).toBe(true);
        expect(drone.fsmState).toBe('IDLE');
        expect(logLines.some((line) => line.includes('WARNING: Превышено время ожидания взлета.'))).toBe(true);
    });

    test('landing overwrites active movement without delay', () => {
        setDroneFsmState(drone, 'FLYING_HOVER');
        expect(applyGoToLocalPointRequest(drone, { x: 2, y: 0, z: 1 })).toBe(true);

        expect(enterLandingProcess(drone)).toBe(true);
        expect(drone.fsmState).toBe('LANDING_PROCESS');
        expect(logLines.some((line) => line.includes('WARNING: Команда посадки (LANDING) перетерла активную команду движения к точке'))).toBe(true);
    });

    test('ignores late timer command when FSM is incompatible', () => {
        setDroneFsmState(drone, 'LANDING_PROCESS');
        const accepted = withCommandSource(drone, 'timer', () => applyGoToLocalPointRequest(drone, { x: 1, y: 0, z: 1 }));

        expect(accepted).toBe(false);
        expect(logLines.some((line) => line.includes('WARNING: Таймер сработал слишком поздно. Команда отклонена конечным автоматом'))).toBe(true);
    });

    test('accepts goToLocalPoint from timer when drone already hovers', () => {
        setDroneFsmState(drone, 'FLYING_HOVER');

        const accepted = withCommandSource(drone, 'timer', () => applyGoToLocalPointRequest(drone, { x: 1, y: 1, z: 1 }));

        expect(accepted).toBe(true);
        expect(drone.fsmState).toBe('FLYING_MOVING');
        expect(drone.target_pos).toEqual({ x: 1, y: 1, z: 1 });
    });

    test('throws detailed FSM error for TAKEOFF from flying state', () => {
        setDroneFsmState(drone, 'FLYING_MOVING');

        expect(() => enterTakeoffProcess(drone)).toThrow(
            'Ошибка FSM: Невозможный переход из состояния FLYING_MOVING через команду MCE_TAKEOFF'
        );
    });

    test('processes PREFLIGHT then TAKEOFF through queued MCE commands', () => {
        queueMceCommand(drone, MCECommands.MCE_PREFLIGHT, 'direct');
        queueMceCommand(drone, MCECommands.MCE_TAKEOFF, 'direct');

        processCommandQueue(drone, drone.id);
        expect(drone.fsmState).toBe('PREFLIGHT');

        processCommandQueue(drone, drone.id);
        expect(drone.fsmState).toBe('TAKEOFF_PROCESS');
        expect(drone.target_pos.z).toBeGreaterThanOrEqual(1);
    });
});
