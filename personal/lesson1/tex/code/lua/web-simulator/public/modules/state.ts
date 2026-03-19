
export interface Vector3 { x: number; y: number; z: number; }
export interface Orientation { roll: number; pitch: number; yaw: number; }
export interface LedColor { r: number; g: number; b: number; w: number; }
export interface TimerTask {
    trigger_time: number;
    callback_ref: number;
    one_shot: boolean;
    running: boolean;
    period?: number;
    next_trigger?: number;
}

export interface SimState {
    running: boolean;
    current_time: number;
    pos: Vector3;
    vel: Vector3;
    accel: Vector3;
    gyro: Vector3;
    orientation: Orientation;
    battery: number;
    status: string;
    target_alt: number;
    target_pos: Vector3;
    target_yaw: number;
    command_queue: number[];
    timers: TimerTask[];
    leds: LedColor[];
}

export const simState: SimState = {
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

export const MAX_PATH_POINTS = 2000;
export const pathPoints: Vector3[] = [];

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
