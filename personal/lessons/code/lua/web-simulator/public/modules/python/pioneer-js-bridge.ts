/* eslint-disable @typescript-eslint/no-explicit-any */
import { drones } from '../core/state.js';
import { beginDisarmedFall, AIRBORNE_ALTITUDE_EPSILON } from '../physics/events.js';
import { triggerLuaCallback } from '../lua/index.js';
import { cancelledRuns, getDroneOrDefault, lastManualSpeedUpdateMs, localOriginByDrone } from './runtime-shared.js';

export function installJsRuntimeAPI() {
    const w = window as any;

    w.py_is_cancelled = (id: string) => Boolean(cancelledRuns[id]);

    w.pioneer_arm = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        if (d.status === 'ГОТОВ' || d.status === 'ПРИЗЕМЛЕН' || d.status === 'DISARMED_FALL') {
            d.status = 'ВЗВЕДЕН';
            d.pendingLocalPoint = false;
            d.pointReachedFlag = false;
            triggerLuaCallback(id, 11);
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

        if (d.status === 'ВЗВЕДЕН') {
            d.pendingLocalPoint = true;
        } else if (d.status === 'ВЗЛЕТ' || d.status === 'ПОЛЕТ' || d.status === 'ПОЛЕТ_К_ТОЧКЕ') {
            d.pendingLocalPoint = false;
            d.status = 'ПОЛЕТ_К_ТОЧКЕ';
        } else {
            d.pendingLocalPoint = true;
        }
        return true;
    };

    w.pioneer_go_to_local_point_body_fixed = (id: string, x: any, y: any, z: any, yaw: any) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        return w.pioneer_go_to_local_point(id, x, y, z, yaw);
    };

    w.pioneer_point_reached = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        const d = getDroneOrDefault(id);
        const val = Boolean(d.pointReachedFlag);
        d.pointReachedFlag = false;
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
        for (let i = 0; i < d.leds.length; i += 1) {
            d.leds[i] = { r: rn, g: gn, b: bn, w: 0 };
        }
        return true;
    };

    w.pioneer_close_connection = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        return null;
    };

    w.pioneer_camera_get_frame = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        return null;
    };

    w.pioneer_camera_get_cv_frame = (id: string) => {
        if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED');
        return null;
    };
}
