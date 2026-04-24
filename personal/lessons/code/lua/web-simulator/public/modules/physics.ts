/**
 * Модуль физического движка симулятора.
 * Отвечает за расчет кинематики полета каждого дрона:
 * применение управляющих воздействий (от автопилота или скрипта),
 * расчет скоростей, координат, ориентации (кватернионов),
 * а также обработку столкновений с объектами сцены (препятствиями).
 */
import { drones, pathPoints, MAX_PATH_POINTS, simSettings, matchesAuxRange } from './state.js';
import { triggerLuaCallback, updateTimers } from './lua/index.js';
import { getObstacles } from './drone.js';
import { log } from './ui/logger.js';
import { checkPhysicsEvents } from './physics/events.js';
import { updateDetachedCargoPhysics, updateMagnetGripper } from './physics/magnet-gripper.js';
import {
    MANUAL_TAKEOFF_ALTITUDE,
    MANUAL_TAKEOFF_THROTTLE,
    TRACE_SAMPLE_INTERVAL
} from './physics/constants.js';

export function updatePhysics(dt: number) {
    updateTimers();
    updateDetachedCargoPhysics(dt, getObstacles);

    const AIRBORNE_ALTITUDE_EPSILON = 0.1;
    const STABILIZE_MAX_TILT = 0.75;
    const STABILIZE_LATERAL_ACCEL = 18.0;
    const ALTHOLD_MAX_TILT = 0.65;
    const ALTHOLD_LATERAL_ACCEL = 14.0;
    const LOITER_VISUAL_TILT_GAIN = 0.14;
    const LOITER_VISUAL_TILT_LIMIT = 0.55;
    const AUTO_MAX_TILT = 0.55;
    const AUTO_TILT_GAIN = 0.14;
    const AUTO_TILT_RESPONSE = 14.0;

    for (const id in drones) {
        const simState = drones[id];
        const prevPos = { ...simState.pos };
        let ax = 0;
        let ay = 0;
        
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

        // Обновление режима полета на основе RC каналов (CH5)
        if (simSettings.gamepadConnected) {
            const ch5 = simState.rcChannels[4];
            if (matchesAuxRange(ch5, simSettings.gamepadModeRanges.loiter)) simState.flightMode = 'LOITER';
            else if (matchesAuxRange(ch5, simSettings.gamepadModeRanges.althold)) simState.flightMode = 'ALTHOLD';
            else if (matchesAuxRange(ch5, simSettings.gamepadModeRanges.stabilize)) simState.flightMode = 'STABILIZE';

            // Логика Arming через RC канал (CH6)
            const ch6 = simState.rcChannels[5];
            const armActive = matchesAuxRange(ch6, simSettings.gamepadAuxRanges.arm);
            const isAirborne = simState.pos.z > AIRBORNE_ALTITUDE_EPSILON;
            if (armActive && (simState.status === 'ГОТОВ' || simState.status === 'ПРИЗЕМЛЕН')) {
                simState.status = 'ВЗВЕДЕН';
                triggerLuaCallback(id, 11); // Ev.ENGINES_STARTED
            } else if (!armActive && (simState.status === 'ВЗВЕДЕН' || isFlying)) {
                // Дизарм на земле не должен приводить к взрыву/крашу.
                if (isAirborne) {
                    simState.status = 'CRASHED';
                    simState.running = false;
                    log(`[Physics] DISARM в воздухе! Дрон ${id} падает.`, 'warn');
                } else {
                    simState.status = 'ГОТОВ';
                    simState.vel = { x: 0, y: 0, z: 0 };
                    simState.target_pos = { ...simState.pos, z: 0 };
                    simState.target_alt = 0;
                }
            }

            const throttle = simState.rcChannels[2];
            if (armActive && simState.status === 'ВЗВЕДЕН' && throttle >= MANUAL_TAKEOFF_THROTTLE) {
                simState.target_pos.x = simState.pos.x;
                simState.target_pos.y = simState.pos.y;
                simState.target_pos.z = Math.max(simState.pos.z + MANUAL_TAKEOFF_ALTITUDE, MANUAL_TAKEOFF_ALTITUDE);
                simState.status = 'ВЗЛЕТ';
            }
        }

        // Магнитный захват
        updateMagnetGripper(simState, getObstacles);

        // Track path (tracer) должен работать и при посадке в Python,
        // даже если скрипт уже завершился и `running=false`.
        // Поэтому привязываем запись траектории к факту полёта/движения, а не к runtime-флагу.
        if (isFlying) {
            simState.traceSampleAccumulator += dt;
            while (simState.traceSampleAccumulator >= TRACE_SAMPLE_INTERVAL) {
                if (!pathPoints[id]) pathPoints[id] = [];
                pathPoints[id].push({ ...simState.pos });
                if (pathPoints[id].length > MAX_PATH_POINTS) pathPoints[id].shift();
                simState.traceSampleAccumulator -= TRACE_SAMPLE_INTERVAL;
            }
        } else {
            simState.traceSampleAccumulator = 0;
        }

        if (isFlying) {
            if (simSettings.gamepadConnected && simState.flightMode !== 'AUTO') {
                // Управление с пульта
                const roll = (simState.rcChannels[0] - 1500) / 500;    // -1..1
                const pitch = (simState.rcChannels[1] - 1500) / 500;   // -1..1
                const throttle = (simState.rcChannels[2] - 1000) / 1000; // 0..1
                const yaw = (simState.rcChannels[3] - 1500) / 500;     // -1..1

                if (simState.flightMode === 'STABILIZE') {
                    // Ручной режим: газ напрямую влияет на вертикальную скорость, ролл/питч на углы
                    simState.vel.z += (throttle * 15.0 - 9.81) * dt; 
                    simState.pos.z += simState.vel.z * dt;
                    
                    simState.orientation.pitch = pitch * STABILIZE_MAX_TILT;
                    simState.orientation.roll = roll * STABILIZE_MAX_TILT;
                    simState.orientation.yaw += yaw * 3.0 * dt;

                    // Горизонтальное движение считаем в локальных осях дрона и
                    // поворачиваем в мировые координаты по текущему yaw.
                    const drag = 0.5;
                    const localForwardAccel = Math.sin(simState.orientation.pitch) * -STABILIZE_LATERAL_ACCEL;
                    const localRightAccel = Math.sin(simState.orientation.roll) * STABILIZE_LATERAL_ACCEL;
                    const cosYaw = Math.cos(simState.orientation.yaw);
                    const sinYaw = Math.sin(simState.orientation.yaw);
                    const worldAx = localRightAccel * cosYaw - localForwardAccel * sinYaw;
                    const worldAy = localRightAccel * sinYaw + localForwardAccel * cosYaw;
                    simState.vel.x += (worldAx - simState.vel.x * drag) * dt;
                    simState.vel.y += (worldAy - simState.vel.y * drag) * dt;
                    simState.pos.x += simState.vel.x * dt;
                    simState.pos.y += simState.vel.y * dt;

                } else if (simState.flightMode === 'ALTHOLD') {
                    // Удержание высоты: стик газа меняет целевую высоту
                    const targetClimbRate = (throttle - 0.5) * 4.0; // -2..2 м/с
                    simState.target_pos.z += targetClimbRate * dt;
                    if (simState.target_pos.z < 0) simState.target_pos.z = 0;

                    // PID для высоты
                    const errZ = simState.target_pos.z - simState.pos.z;
                    simState.vel.z += (errZ * 4.0 - simState.vel.z * 2.5) * dt;
                    simState.pos.z += simState.vel.z * dt;

                    // Горизонтально как в stabilize
                    simState.orientation.pitch = pitch * ALTHOLD_MAX_TILT;
                    simState.orientation.roll = roll * ALTHOLD_MAX_TILT;
                    simState.orientation.yaw += yaw * 3.0 * dt;

                    const drag = 0.8;
                    const localForwardAccel = Math.sin(simState.orientation.pitch) * -ALTHOLD_LATERAL_ACCEL;
                    const localRightAccel = Math.sin(simState.orientation.roll) * ALTHOLD_LATERAL_ACCEL;
                    const cosYaw = Math.cos(simState.orientation.yaw);
                    const sinYaw = Math.sin(simState.orientation.yaw);
                    const worldAx = localRightAccel * cosYaw - localForwardAccel * sinYaw;
                    const worldAy = localRightAccel * sinYaw + localForwardAccel * cosYaw;
                    simState.vel.x += (worldAx - simState.vel.x * drag) * dt;
                    simState.vel.y += (worldAy - simState.vel.y * drag) * dt;
                    simState.pos.x += simState.vel.x * dt;
                    simState.pos.y += simState.vel.y * dt;

                } else if (simState.flightMode === 'LOITER') {
                    // Удержание позиции (Navigation)
                    // Стики задают целевую скорость
                    const targetVy = -pitch * 3.0;
                    const targetVx = roll * 3.0;
                    const targetVz = (throttle - 0.5) * 2.0;

                    // Оптический поток: если под нами что-то есть, поднимаемся
                    let terrainAlt = 0;
                    const obstacles = getObstacles();
                    for (const obj of obstacles) {
                        if (obj.position.z < simState.pos.z && Math.abs(obj.position.x - simState.pos.x) < 0.5 && Math.abs(obj.position.y - simState.pos.y) < 0.5) {
                            terrainAlt = Math.max(terrainAlt, obj.position.z + 0.5);
                        }
                    }
                    
                    const effectiveTargetZ = Math.max(simState.target_pos.z, terrainAlt);
                    simState.target_pos.z += targetVz * dt;
                    
                    // Позиция X, Y обновляется на основе скорости от стиков
                    simState.target_pos.x += targetVx * dt;
                    simState.target_pos.y += targetVy * dt;

                    // PID контроль для следования за target_pos
                    const kp = 5.0;
                    const kd = 3.0;
                    
                    const errX = simState.target_pos.x - simState.pos.x;
                    const errY = simState.target_pos.y - simState.pos.y;
                    const errZ = effectiveTargetZ - simState.pos.z;

                    simState.vel.x += (errX * kp - simState.vel.x * kd) * dt;
                    simState.vel.y += (errY * kp - simState.vel.y * kd) * dt;
                    simState.vel.z += (errZ * kp - simState.vel.z * kd) * dt;

                    simState.pos.x += simState.vel.x * dt;
                    simState.pos.y += simState.vel.y * dt;
                    simState.pos.z += simState.vel.z * dt;

                    simState.orientation.yaw += yaw * 3.0 * dt;
                    
                    // Наклоны для визуализации скорости (Y - вперед, X - вправо)
                    simState.orientation.pitch = Math.max(
                        -LOITER_VISUAL_TILT_LIMIT,
                        Math.min(LOITER_VISUAL_TILT_LIMIT, -simState.vel.y * LOITER_VISUAL_TILT_GAIN)
                    );
                    simState.orientation.roll = Math.max(
                        -LOITER_VISUAL_TILT_LIMIT,
                        Math.min(LOITER_VISUAL_TILT_LIMIT, simState.vel.x * LOITER_VISUAL_TILT_GAIN)
                    );
                }
            } else {
                // AUTO Mode (PID-like smooth control from scripts)
                const kp = 4.0; 
                const kd = 2.5; 
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
                
                ax = errX * kp - simState.vel.x * kd;
                ay = errY * kp - simState.vel.y * kd;
                
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
            }
            
            const cosY = Math.cos(simState.orientation.yaw);
            const sinY = Math.sin(simState.orientation.yaw);
            
            const local_ax = ax * cosY + ay * sinY;
            const local_ay = -ax * sinY + ay * cosY;

            const targetPitch = Math.max(-AUTO_MAX_TILT, Math.min(AUTO_MAX_TILT, -local_ay * AUTO_TILT_GAIN));
            const targetRoll = Math.max(-AUTO_MAX_TILT, Math.min(AUTO_MAX_TILT, local_ax * AUTO_TILT_GAIN));
            
            // Smoothly interpolate current tilt to target tilt
            simState.orientation.pitch += (targetPitch - simState.orientation.pitch) * AUTO_TILT_RESPONSE * dt;
            simState.orientation.roll += (targetRoll - simState.orientation.roll) * AUTO_TILT_RESPONSE * dt;
            
            if (simState.pos.z < 0) {
                simState.pos.z = 0;
                simState.vel.z = 0;
                simState.vel.x = 0;
                simState.vel.y = 0;
            }
        } else if (simState.status === 'CRASHED') {
            // Свободное падение при разбитии/Disarm в воздухе
            simState.vel.z -= 9.81 * dt;
            simState.pos.x += simState.vel.x * dt;
            simState.pos.y += simState.vel.y * dt;
            simState.pos.z += simState.vel.z * dt;

            if (simState.pos.z <= 0) {
                simState.pos.z = 0;
                simState.vel = { x: 0, y: 0, z: 0 };
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

        // Обработка коллизий (кроме уже разбитого)
        if (simState.status !== 'CRASHED') {
            checkPhysicsEvents(simState, prevPos);
        }
    }
}
