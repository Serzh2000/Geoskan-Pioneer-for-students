type SimulationControlHandlers = {
    start: () => void;
    stop: () => void;
    reset: () => void;
};

let registeredHandlers: SimulationControlHandlers | null = null;

export function configureSimulationControls(handlers: SimulationControlHandlers): void {
    registeredHandlers = handlers;
}

export function restartAndRunSimulation(): void {
    if (!registeredHandlers) {
        console.warn('[SimulationControls] Handlers are not configured yet.');
        return;
    }

    registeredHandlers.reset();
    registeredHandlers.start();
}

export function resetSimulationState(): void {
    if (!registeredHandlers) {
        console.warn('[SimulationControls] Handlers are not configured yet.');
        return;
    }

    registeredHandlers.reset();
}
