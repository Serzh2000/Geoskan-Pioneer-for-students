/* eslint-disable @typescript-eslint/no-explicit-any */
import { drones, currentDroneId } from '../state.js';
import { log } from '../ui/logger.js';
import { beginDisarmedFall, AIRBORNE_ALTITUDE_EPSILON } from '../physics/events.js';
import { triggerLuaCallback } from '../lua/index.js';

let pyodideInstance: any = null;
let pyodideLoadPromise: Promise<any> | null = null;

// Для упрощённой Phase1-реализации исполняем Python только для одного дрона:
// текущий выбранный `currentDroneId`. Для него и храним cancel флаг.
const cancelledRuns: Record<string, boolean> = {};
const localOriginByDrone: Record<string, { x: number; y: number; z: number }> = {};
const lastManualSpeedUpdateMs: Record<string, number> = {};

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.src = src;
        el.async = true;
        el.onload = () => resolve();
        el.onerror = (e) => reject(e);
        document.head.appendChild(el);
    });
}

async function ensurePyodide(): Promise<any> {
    if (pyodideInstance) return pyodideInstance;
    if (pyodideLoadPromise) return pyodideLoadPromise;

    pyodideLoadPromise = (async () => {
        log('[Python] Загрузка рантайма (Pyodide)...', 'info');
        // Загружаем Pyodide с CDN.
        // Важно: в нашем проекте нет статического bundling для WASM, поэтому используем script tag.
        const pyodideUrl = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
        const indexURL = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/';

        // Уже мог быть загружен.
        if (!(window as any).loadPyodide) {
            await loadScript(pyodideUrl);
        }

        const loadPyodide = (window as any).loadPyodide;
        pyodideInstance = await loadPyodide({ indexURL });

        // Определяем JS<->Python bridge: pioneer_sdk (минимальный набор).
        // Модуль должен существовать до выполнения пользовательского кода.
        await installPioneerSdkModule(pyodideInstance);

        log('[Python] Рантайм готов.', 'success');
        return pyodideInstance;
    })();

    return pyodideLoadPromise;
}

function getDroneOrDefault(id: string) {
    return drones[id] || drones[currentDroneId];
}

function installJsRuntimeAPI() {
    const w = window as any;

    w.py_is_cancelled = (id: string) => Boolean(cancelledRuns[id]);

    w.pioneer_arm = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        
        if (d.status === 'ГОТОВ' || d.status === 'ПРИЗЕМЛЕН' || d.status === 'DISARMED_FALL') {
            d.status = 'ВЗВЕДЕН';
            d.pendingLocalPoint = false;
            d.pointReachedFlag = false;
            triggerLuaCallback(id, 11); // Ev.ENGINES_STARTED
            return true;
        }
        return false;
    };

    w.pioneer_disarm = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        
        if (d.pos.z > AIRBORNE_ALTITUDE_EPSILON) {
            beginDisarmedFall(d, id, 'pioneer.disarm() в воздухе');
        } else {
            d.status = 'ГОТОВ';
            d.pendingLocalPoint = false;
            d.pointReachedFlag = false;
            d.vel = { x: 0, y: 0, z: 0 };
            d.target_pos = { ...d.pos, z: 0 };
            d.target_alt = 0;
        }
        return true;
    };

    w.pioneer_takeoff = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        const takeoffAlt = 1.0;
        d.target_pos.x = d.pos.x;
        d.target_pos.y = d.pos.y;
        d.target_pos.z = Math.max(d.pos.z, d.pos.z + takeoffAlt);
        d.target_alt = d.target_pos.z;
        d.pointReachedFlag = false;
        d.status = 'ВЗЛЕТ';
        return true;
    };

    w.pioneer_land = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        d.target_pos.x = d.pos.x;
        d.target_pos.y = d.pos.y;
        d.target_pos.z = 0;
        d.pendingLocalPoint = false;
        d.pointReachedFlag = false;
        d.status = 'ПОСАДКА';
        return true;
    };

    w.pioneer_go_to_local_point = (id: string, x: any, y: any, z: any, yaw: any) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        const origin = localOriginByDrone[id] || { x: 0, y: 0, z: 0 };

        const tx = x == null ? d.pos.x : origin.x + Number(x);
        const ty = y == null ? d.pos.y : origin.y + Number(y);
        const tz = z == null ? d.pos.z : origin.z + Number(z);
        const yawm = yaw == null ? d.target_yaw : Number(yaw);

        d.target_pos = { x: tx, y: ty, z: tz };
        d.target_yaw = yawm;
        d.pointReachedFlag = false;

        // Ключевая логика совместимости с pendingLocalPoint:
        // если команда пришла до takeoff'а, держим target, а режим к точке включим после TAKEOFF_COMPLETE.
        if (d.status === 'ВЗВЕДЕН') {
            d.pendingLocalPoint = true;
        } else if (d.status === 'ВЗЛЕТ' || d.status === 'ПОЛЕТ' || d.status === 'ПОЛЕТ_К_ТОЧКЕ') {
            d.pendingLocalPoint = false;
            d.status = 'ПОЛЕТ_К_ТОЧКЕ';
        } else {
            // На земле не двигаем: оставляем статус как есть, но target можно подготовить.
            // Для Phase1 достаточно мягкого поведения.
            d.pendingLocalPoint = true;
        }
        return true;
    };

    // Phase1 fallback: трактуем body-fixed как local frame без вращения.
    w.pioneer_go_to_local_point_body_fixed = (id: string, x: any, y: any, z: any, yaw: any) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        return w.pioneer_go_to_local_point(id, x, y, z, yaw);
    };

    w.pioneer_point_reached = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        const val = Boolean(d.pointReachedFlag);
        d.pointReachedFlag = false; // after each read
        return val;
    };

    w.pioneer_set_manual_speed = (id: string, vx: any, vy: any, vz: any, yaw_rate: any) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        const now = performance.now();
        const last = lastManualSpeedUpdateMs[id];
        const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.05;
        lastManualSpeedUpdateMs[id] = now;

        const vxn = Number(vx);
        const vyn = Number(vy);
        const vzn = Number(vz);
        const yrn = Number(yaw_rate);

        // Переводим скорость в новый target_pos, чтобы использовать текущий PID в physics.ts.
        d.status = 'ПОЛЕТ';
        d.pendingLocalPoint = false;

        d.target_pos = {
            x: d.pos.x + vxn * dt,
            y: d.pos.y + vyn * dt,
            z: Math.max(0, d.pos.z + vzn * dt)
        };
        d.target_yaw = d.target_yaw + yrn * dt;
        d.pointReachedFlag = false;
        return true;
    };

    // Phase1 fallback: body-fixed manual speed = world/local manual speed.
    w.pioneer_set_manual_speed_body_fixed = (id: string, vx: any, vy: any, vz: any, yaw_rate: any) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        return w.pioneer_set_manual_speed(id, vx, vy, vz, yaw_rate);
    };

    w.pioneer_get_local_position_lps = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        return [d.pos.x, d.pos.y, d.pos.z];
    };

    w.pioneer_get_dist_sensor_data = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        return d.pos.z;
    };

    w.pioneer_get_battery_status = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        return d.battery;
    };

    w.pioneer_get_autopilot_state = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        switch (d.status) {
            case 'ВЗВЕДЕН': return 'ARMED';
            case 'ВЗЛЕТ': return 'TAKEOFF';
            case 'ПОЛЕТ':
            case 'ПОЛЕТ_К_ТОЧКЕ': return 'MISSION';
            case 'ПОСАДКА': return 'LANDING';
            case 'ПРИЗЕМЛЕН': return 'LANDED';
            case 'ГОТОВ':
            case 'IDLE': return 'DISARMED';
            case 'CRASHED': return 'ROOT';
            default: return d.status;
        }
    };

    w.pioneer_led_control = (id: string, r: any, g: any, b: any) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        const rn = Number(r);
        const gn = Number(g);
        const bn = Number(b);

        for (let i = 0; i < d.leds.length; i++) {
            d.leds[i] = { r: rn, g: gn, b: bn, w: 0 };
        }
        return true;
    };

    w.pioneer_close_connection = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        return null;
    };

    // Camera (Phase1 заглушка)
    w.pioneer_camera_get_frame = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        return null;
    };
    w.pioneer_camera_get_cv_frame = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        return null;
    };
}

async function installPioneerSdkModule(pyodide: any) {
    if ((window as any).__pioneer_sdk_installed) return;
    installJsRuntimeAPI();

    const prelude = `
import sys, types
import js

m = types.ModuleType('pioneer_sdk')

class Pioneer:
    def __init__(self, simulator=True, name='pioneer', ip='192.168.4.1', mavlink_port=8001, connection_method='udpout', device='/dev/serial0', baud=115200, logger=True, log_connection=True, **kwargs):
        self._id = js.SIM_DRONE_ID

    def connected(self):
        return True

    def close_connection(self):
        return js.pioneer_close_connection(self._id)

    def arm(self):
        return bool(js.pioneer_arm(self._id))

    def disarm(self):
        return bool(js.pioneer_disarm(self._id))

    def takeoff(self):
        return bool(js.pioneer_takeoff(self._id))

    def land(self):
        return bool(js.pioneer_land(self._id))

    def go_to_local_point(self, x=None, y=None, z=None, yaw=None):
        return bool(js.pioneer_go_to_local_point(self._id, x, y, z, yaw))

    def go_to_local_point_body_fixed(self, x, y, z, yaw):
        return bool(js.pioneer_go_to_local_point_body_fixed(self._id, x, y, z, yaw))

    def point_reached(self):
        return bool(js.pioneer_point_reached(self._id))

    def set_manual_speed(self, vx, vy, vz, yaw_rate):
        return bool(js.pioneer_set_manual_speed(self._id, vx, vy, vz, yaw_rate))

    def set_manual_speed_body_fixed(self, vx, vy, vz, yaw_rate):
        return bool(js.pioneer_set_manual_speed_body_fixed(self._id, vx, vy, vz, yaw_rate))

    def get_local_position_lps(self, get_last_received=True):
        return js.pioneer_get_local_position_lps(self._id)

    def get_dist_sensor_data(self, get_last_received=True):
        return js.pioneer_get_dist_sensor_data(self._id)

    def get_battery_status(self, get_last_received=True):
        return js.pioneer_get_battery_status(self._id)

    def get_autopilot_state(self):
        return js.pioneer_get_autopilot_state(self._id)

    def led_control(self, r=0, g=0, b=0):
        return bool(js.pioneer_led_control(self._id, r, g, b))

    # Phase1: заглушка для совместимости
    def send_rc_channels(self, channel_1=0xFF, channel_2=0xFF, channel_3=0xFF, channel_4=0xFF, channel_5=0xFF, channel_6=0xFF, channel_7=0xFF, channel_8=0xFF):
        return True

class Camera:
    def __init__(self, timeout=0.5, ip='192.168.4.1', port=8888, video_buffer_size=65000, log_connection=True):
        pass

    def connect(self):
        return True

    def disconnect(self):
        return True

    def get_frame(self):
        return js.pioneer_camera_get_frame(js.SIM_DRONE_ID)

    def get_cv_frame(self):
        return js.pioneer_camera_get_cv_frame(js.SIM_DRONE_ID)

m.Pioneer = Pioneer
m.Camera = Camera
sys.modules['pioneer_sdk'] = m
`;

    pyodide.runPython(prelude);
    (window as any).__pioneer_sdk_installed = true;
}

type ActivePythonRun = {
    promise: Promise<any>;
};

const activeRuns: Record<string, ActivePythonRun> = {};

export async function initPythonRuntime(): Promise<void> {
    await ensurePyodide();
}

export async function runPythonScript(droneId: string, code: string): Promise<void> {
    const pyodide = await ensurePyodide();
    if (!drones[droneId]) return;

    cancelledRuns[droneId] = false;
    lastManualSpeedUpdateMs[droneId] = 0;
    localOriginByDrone[droneId] = { x: drones[droneId].pos.x, y: drones[droneId].pos.y, z: drones[droneId].pos.z };

    (window as any).SIM_DRONE_ID = droneId;

    const normalizedUserCode = (code || '')
        .replace(/\r\n/g, '\n');

    // Минимальная трансформация под web-runtime:
    // - запускаем код внутри async функции
    // - заменяем time.sleep(x) -> await asyncio.sleep(x)
    // Это позволяет не "убивать" UI, т.к. sleep становится кооперативным.
    const transformedUserCode = normalizedUserCode
        .replace(/\btime\.sleep\s*\(/g, 'await asyncio.sleep(');

    const indentedUserCode = transformedUserCode
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n');

    // Исполняем в async контексте, чтобы await asyncio.sleep(...) работал.
    const wrapped = `
import asyncio, js

async def __user_main():
${indentedUserCode}

try:
    await __user_main()
except Exception as e:
    # Если нас остановили — молча выходим.
    if str(e).find('PYTHON_CANCELLED') >= 0:
        pass
    else:
        raise
`;

    const promise = pyodide.runPythonAsync(wrapped);
    activeRuns[droneId] = { promise };

    promise.then(() => {
        if (activeRuns[droneId]) {
            drones[droneId].running = false;
        }
    }).catch((e: any) => {
        // Если пользователь нажал Stop — JS bridge выбросит PYTHON_CANCELLED.
        const msg = e instanceof Error ? e.message : String(e);
        log(`Python run error (${droneId}): ${msg}`, 'error');
    });
}

export function stopPythonScript(droneId: string): void {
    cancelledRuns[droneId] = true;
    const d = drones[droneId];
    if (d) {
        d.running = false;
        d.status = 'ОСТАНОВЛЕН';
        d.pendingLocalPoint = false;
        d.pointReachedFlag = false;
    }
}

