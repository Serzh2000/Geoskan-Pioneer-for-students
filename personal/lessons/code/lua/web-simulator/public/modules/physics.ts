/**
 * Модуль физического движка симулятора.
 * Отвечает за расчет кинематики полета каждого дрона:
 * применение управляющих воздействий (от автопилота или скрипта),
 * расчет скоростей, координат, ориентации (кватернионов),
 * а также обработку столкновений с объектами сцены (препятствиями).
 */
import { drones, pathPoints, DroneState, MAX_PATH_POINTS } from './state.js';
import { triggerLuaCallback, updateTimers } from './lua/index.js';
import { getObstacles } from './drone.js';
import { log } from './ui/logger.js';
import * as THREE from 'three';

export function updatePhysics(dt: number) {
    updateTimers();

    for (const id in drones) {
        const simState = drones[id];
        
        // Process Command Queue
        if (simState.command_queue.length > 0) {
            const cmd = simState.command_queue.shift();
            
            // Command Handlers
            if (cmd === 1 || cmd === 4) {
                simState.status = 'ВЗВЕДЕН'; // Ev.MCE_PREFLIGHT or ENGINES_ARM
                triggerLuaCallback(id, 11); // Ev.ENGINES_STARTED
            }
            if (cmd === 2) { // Ev.MCE_TAKEOFF
                // Взлёт должен быть разрешен только после арминга (ВЗВЕДЕН).
                // Иначе скрипты могут "притянуть" дрон в полёт/к точке без arming.
                if (simState.status !== 'ВЗВЕДЕН') {
                    log(
                        `[Physics] TAKEOFF игнорирован: status=${simState.status} (нужен ВЗВЕДЕН)`,
                        'warn'
                    );
                    return;
                }
                // Устанавливаем высоту взлета 1.0м ТОЛЬКО если целевая высота не была задана выше
                if (simState.target_pos.z < 1.0) {
                    simState.target_pos.z = 1.0;
                }
                if (simState.target_pos.x === 0 && simState.target_pos.y === 0) {
                    simState.target_pos.x = simState.pos.x;
                    simState.target_pos.y = simState.pos.y;
                }
                simState.status = 'ВЗЛЕТ';
            }
            if (cmd === 3) { // Ev.MCE_LANDING
                simState.target_pos.z = 0;
                simState.target_pos.x = simState.pos.x;
                simState.target_pos.y = simState.pos.y;
                simState.status = 'ПОСАДКА';
                simState.pendingLocalPoint = false;
                simState.pointReachedFlag = false;
            }
            if (cmd === 4) simState.status = 'ВЗВЕДЕН'; // Ev.ENGINES_ARM
            if (cmd === 5) {
                simState.status = 'ГОТОВ';   // Ev.ENGINES_DISARM
                simState.pendingLocalPoint = false;
                simState.pointReachedFlag = false;
            }
        }

        // Physics Update Logic
        // Дрона нельзя считать "летящим", пока он в статусах подготовки/запуска:
        // иначе команды вроде goToLocalPoint смогут двигать дрон на земле.
        const isFlying = (
            simState.status !== 'ГОТОВ' &&
            simState.status !== 'ПРИЗЕМЛЕН' &&
            simState.status !== 'ВЗВЕДЕН' &&
            simState.status !== 'IDLE' &&
            simState.status !== 'ЗАПУСК' &&
            simState.status !== 'ОСТАНОВЛЕН' &&
            simState.status !== 'ОШИБКА' &&
            simState.status !== 'CRASHED'
        );
        
        if (simState.running) {
            simState.current_time += dt;
        }

        // Track path (tracer) должен работать и при посадке в Python,
        // даже если скрипт уже завершился и `running=false`.
        // Поэтому привязываем запись траектории к факту полёта/движения, а не к runtime-флагу.
        if (isFlying && Math.random() < 0.1) { // Add point every 10 frames approx
            if (!pathPoints[id]) pathPoints[id] = [];
            pathPoints[id].push({ ...simState.pos });
            if (pathPoints[id].length > MAX_PATH_POINTS) pathPoints[id].shift();
        }

        if (isFlying) {
            // PID-like smooth control with proper acceleration
            const kp = 4.0; // Proportional gain for position
            const kd = 2.5; // Damping (derivative) gain
            const kp_yaw = 5.0;
            const kd_yaw = 2.0;
            
            // Altitude (Z)
            const errZ = simState.target_pos.z - simState.pos.z;
            const az = errZ * kp - simState.vel.z * kd;
            simState.vel.z += az * dt;
            simState.pos.z += simState.vel.z * dt;

            // Position (X, Y)
            const errX = simState.target_pos.x - simState.pos.x;
            const errY = simState.target_pos.y - simState.pos.y;
            
            const ax = errX * kp - simState.vel.x * kd;
            const ay = errY * kp - simState.vel.y * kd;
            
            simState.vel.x += ax * dt;
            simState.vel.y += ay * dt;
            simState.pos.x += simState.vel.x * dt;
            simState.pos.y += simState.vel.y * dt;
            
            // Yaw
            let errYaw = simState.target_yaw - simState.orientation.yaw;
            while (errYaw > Math.PI) errYaw -= 2 * Math.PI;
            while (errYaw < -Math.PI) errYaw += 2 * Math.PI;
            
            const yaw_vel = errYaw * kp_yaw;
            simState.orientation.yaw += yaw_vel * dt;
            
            const cosY = Math.cos(simState.orientation.yaw);
            const sinY = Math.sin(simState.orientation.yaw);
            
            const local_ax = ax * cosY + ay * sinY;
            const local_ay = -ax * sinY + ay * cosY;

            const maxTilt = 0.35; 
            const targetPitch = Math.max(-maxTilt, Math.min(maxTilt, -local_ax * 0.1));
            const targetRoll = Math.max(-maxTilt, Math.min(maxTilt, local_ay * 0.1));
            
            // Smoothly interpolate current tilt to target tilt
            simState.orientation.pitch += (targetPitch - simState.orientation.pitch) * 10 * dt;
            simState.orientation.roll += (targetRoll - simState.orientation.roll) * 10 * dt;
            
            if (simState.pos.z < 0) {
                simState.pos.z = 0;
                simState.vel.z = 0;
            }
        } else {
            // Ground physics (simple)
            if (simState.pos.z > 0) {
                simState.pos.z -= 9.81 * dt * dt;
                if (simState.pos.z < 0) simState.pos.z = 0;
            }
            simState.vel = {x:0, y:0, z:0};
            simState.orientation.pitch = 0;
            simState.orientation.roll = 0;
        }

        // Event Triggers
        checkEvents(simState);
    }
}

function checkEvents(simState: DroneState) {
    if (simState.status === 'CRASHED' || simState.status === 'IDLE' || simState.status === 'ГОТОВ' || simState.status === 'ВЗВЕДЕН' || simState.status === 'ПРИЗЕМЛЕН') return;

    const id = simState.id;

    // Collision Check (SHOCK)
    const obstacles = getObstacles();
    for (const obj of obstacles) {
        if (!obj.userData || !obj.userData.type) continue;
        
        const objPos = new THREE.Vector3();
        obj.getWorldPosition(objPos);
        
        const dist = Math.sqrt(
            (objPos.x - simState.pos.x)**2 + 
            (objPos.y - simState.pos.y)**2 + 
            (objPos.z - simState.pos.z)**2
        );
        const radius = (obj.userData.type === 'Ворота') ? 0.8 : 0.3;
        
        const isClose = dist < radius;
        const isGround = obj.name === 'Ground' || obj.userData.type === 'Ground' || objPos.z <= 0.01;
        const isNotJustTakingOff = simState.pos.z > 0.1;

        if (isClose && isNotJustTakingOff && !isGround) {
            simState.status = 'CRASHED';
            simState.pendingLocalPoint = false;
            simState.pointReachedFlag = false;
            triggerLuaCallback(id, 16); // Ev.SHOCK
            log(`[Physics] Дрон ${id} столкнулся с препятствием!`, 'warn');
            return;
        }
    }

    // Takeoff Complete
    if (simState.status === 'ВЗЛЕТ' && Math.abs(simState.pos.z - simState.target_pos.z) < 0.1) {
        simState.status = 'ПОЛЕТ';
        triggerLuaCallback(id, 6); // Ev.TAKEOFF_COMPLETE

        // Если во время взлёта был задан gotoLocalPoint — переводим в режим полёта к точке.
        if (simState.pendingLocalPoint) {
            simState.pendingLocalPoint = false;
            simState.status = 'ПОЛЕТ_К_ТОЧКЕ';
        }
    }
    
    // Landing Complete
    if (simState.status === 'ПОСАДКА' && simState.pos.z < 0.05) {
        simState.status = 'ПРИЗЕМЛЕН';
        triggerLuaCallback(id, 7); // Ev.COPTER_LANDED
    }
    
    // Point Reached
    if (simState.status === 'ПОЛЕТ_К_ТОЧКЕ') {
        const dist = Math.sqrt(
            (simState.target_pos.x - simState.pos.x)**2 + 
            (simState.target_pos.y - simState.pos.y)**2 + 
            (simState.target_pos.z - simState.pos.z)**2
        );
        if (dist < 0.15) {
            simState.status = 'ПОЛЕТ';
            triggerLuaCallback(id, 10); // Ev.POINT_REACHED
            simState.pointReachedFlag = true;
        }
    }
}