
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

export interface DroneState {
    id: string;
    name: string;
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
    script: string;
    luaState: any; // fengari state
}

export const drones: Record<string, DroneState> = {};
export let currentDroneId: string = 'drone_1';

export function createDroneState(id: string, name: string, x: number = 0, y: number = 0, z: number = 0): DroneState {
    const drone: DroneState = {
        id, name,
        running: false,
        current_time: 0,
        pos: { x, y, z },
        vel: { x: 0, y: 0, z: 0 },
        accel: { x: 0, y: 0, z: 9.81 },
        gyro: { x: 0, y: 0, z: 0 },
        orientation: { roll: 0, pitch: 0, yaw: 0 },
        battery: 100,
        status: 'ГОТОВ',
        target_alt: z,
        target_pos: { x, y, z },
        target_yaw: 0,
        command_queue: [],
        timers: [],
        leds: Array.from({ length: 29 }, () => ({ r: 0, g: 0, b: 0, w: 0 })),
        script: '-- Pioneer Lua Script\n\nap.push(Ev.MCE_TAKEOFF)',
        luaState: null
    };
    drones[id] = drone;
    return drone;
}

// Initialize the first default drone
createDroneState('drone_1', 'Pioneer 1');

// Backward compatibility alias: simState points to the currently selected drone
export const simState = new Proxy({} as DroneState, {
    get: (target, prop) => {
        if (!drones[currentDroneId]) return undefined;
        return (drones[currentDroneId] as any)[prop];
    },
    set: (target, prop, value) => {
        if (!drones[currentDroneId]) return false;
        (drones[currentDroneId] as any)[prop] = value;
        return true;
    }
});

export function setCurrentDrone(id: string) {
    if (drones[id]) currentDroneId = id;
}

export const MAX_PATH_POINTS = 2000;
export const pathPoints: Record<string, Vector3[]> = { 'drone_1': [] };

export function resetRuntimeStatePreservePose(id: string = currentDroneId) {
    const drone = drones[id];
    if (!drone) return;
    const posePos = { x: drone.pos.x, y: drone.pos.y, z: drone.pos.z };
    const poseOrientation = {
        roll: drone.orientation.roll,
        pitch: drone.orientation.pitch,
        yaw: drone.orientation.yaw
    };

    resetState(id);

    drone.pos = posePos;
    drone.orientation = poseOrientation;
    drone.target_alt = posePos.z;
    drone.target_pos = { x: posePos.x, y: posePos.y, z: posePos.z };
    drone.target_yaw = poseOrientation.yaw;
}

export function getDroneFromLua(L: any): DroneState {
    window.fengari.lua.lua_getglobal(L, window.fengari.to_luastring("__DRONE_ID__"));
    const idStr = window.fengari.lua.lua_tostring(L, -1);
    const id = idStr ? window.fengari.to_jsstring(idStr) : currentDroneId;
    window.fengari.lua.lua_pop(L, 1);
    return drones[id] || drones[currentDroneId];
}

export function resetState(id: string = currentDroneId) {
    const drone = drones[id];
    if (!drone) return;
    drone.running = false;
    drone.current_time = 0;
    drone.vel = { x: 0, y: 0, z: 0 };
    drone.accel = { x: 0, y: 0, z: 9.81 };
    drone.gyro = { x: 0, y: 0, z: 0 };
    drone.battery = 100;
    drone.status = 'ГОТОВ';
    drone.command_queue = [];
    drone.timers = [];
    drone.leds = Array.from({ length: 29 }, () => ({ r: 0, g: 0, b: 0, w: 0 }));
    pathPoints[id] = [];
}
