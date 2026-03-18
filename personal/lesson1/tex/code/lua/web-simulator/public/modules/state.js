
export const simState = {
    running: false,
    current_time: 0,
    pos: { x: 0, y: 0, z: 0 },
    vel: { x: 0, y: 0, z: 0 },
    accel: { x: 0, y: 0, z: 9.81 },
    gyro: { x: 0, y: 0, z: 0 },
    orientation: { roll: 0, pitch: 0, yaw: 0 }, // Initial yaw is 0 (+X direction)
    battery: 100,
    status: 'IDLE',
    target_alt: 0,
    target_pos: { x: 0, y: 0, z: 0 },
    target_yaw: 0,
    command_queue: [],
    timers: [],
    leds: [] // Array of {r, g, b, w}
};

export const MAX_PATH_POINTS = 500;
export let pathPoints = [];

export function resetState() {
    simState.running = false;
    simState.current_time = 0;
    simState.pos = { x: 0, y: 0, z: 0 };
    simState.vel = { x: 0, y: 0, z: 0 };
    simState.accel = { x: 0, y: 0, z: 9.81 };
    simState.gyro = { x: 0, y: 0, z: 0 };
    simState.orientation = { roll: 0, pitch: 0, yaw: 0 };
    simState.battery = 100;
    simState.status = 'ГОТОВ';
    simState.target_alt = 0;
    simState.target_pos = { x: 0, y: 0, z: 0 };
    simState.target_yaw = 0;
    simState.command_queue = [];
    simState.timers = [];
    simState.leds = [];
    pathPoints.length = 0;
}
