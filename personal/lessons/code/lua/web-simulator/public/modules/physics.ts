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
import {
    AIRBORNE_ALTITUDE_EPSILON,
    applyCrashState,
    beginDisarmedFall,
    checkPhysicsEvents,
    shouldCrashOnGroundImpact
} from './physics/events.js';
import { updateDetachedCargoPhysics, updateMagnetGripper } from './physics/magnet-gripper.js';
import {
    MANUAL_TAKEOFF_ALTITUDE,
    MANUAL_TAKEOFF_THROTTLE,
    TRACE_SAMPLE_INTERVAL
} from './physics/constants.js';
import { bodyPlanarToWorld, worldPlanarToBody } from './physics/frames.js';

export function updatePhysics(dt: number) {
    updateTimers();
    updateDetachedCargoPhysics(dt, getObstacles);

    const STABILIZE_MAX_TILT = 0.8;
    const ALTHOLD_MAX_TILT = 0.65;
    const LOITER_VISUAL_TILT_GAIN = 0.14;
    const LOITER_VISUAL_TILT_LIMIT = 0.55;
    const AUTO_MAX_TILT = 0.55;
    const AUTO_TILT_GAIN = 0.14;
    const AUTO_TILT_RESPONSE = 14.0;
    const STICK_DEADZONE = 0.04;
    const MAX_YAW_RATE = 2.8;
    const STABILIZE_MAX_BODY_SPEED = 8.0;
    const ALTHOLD_MAX_BODY_SPEED = 5.5;
    const LOITER_MAX_BODY_SPEED = 3.5;
    const STABILIZE_MAX_CLIMB_RATE = 6.0;
    const ALTHOLD_MAX_CLIMB_RATE = 3.5;
    const LOITER_MAX_CLIMB_RATE = 2.2;
    const STABILIZE_BODY_ACCEL = 16.0;
    const ALTHOLD_BODY_ACCEL = 12.0;
    const LOITER_BODY_ACCEL = 9.0;
    const MANUAL_VERTICAL_ACCEL = 10.0;

    const applyDeadzone = (value: number) => Math.abs(value) < STICK_DEADZONE ? 0 : value;
    const clampStick = (channel: number) => Math.max(-1, Math.min(1, (channel - 1500) / 500));
    const normalizeThrottle = (channel: number) => Math.max(0, Math.min(1, (channel - 1000) / 1000));
    const approach = (current: number, target: number, maxDelta: number) => {
        if (current < target) return Math.min(current + maxDelta, target);
        if (current > target) return Math.max(current - maxDelta, target);
        return current;
    };

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
                if (simState.pos.z > AIRBORNE_ALTITUDE_EPSILON) {
                    beginDisarmedFall(simState, id, 'DISARM в воздухе: двигатели отключены, начинается свободное падение.');
                } else {
                    simState.status = 'ГОТОВ';   // Ev.ENGINES_DISARM
                    simState.pendingLocalPoint = false;
                    simState.pointReachedFlag = false;
                    simState.vel = { x: 0, y: 0, z: 0 };
                    simState.target_pos = { ...simState.pos, z: 0 };
                    simState.target_alt = 0;
                }
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
            simState.status !== 'DISARMED_FALL' &&
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
            if (armActive && (simState.status === 'ГОТОВ' || simState.status === 'ПРИЗЕМЛЕН' || simState.status === 'DISARMED_FALL')) {
                simState.status = 'ВЗВЕДЕН';
                triggerLuaCallback(id, 11); // Ev.ENGINES_STARTED
            } else if (!armActive && (simState.status === 'ВЗВЕДЕН' || isFlying)) {
                // Дизарм на земле не должен приводить к взрыву/крашу.
                if (isAirborne) {
                    beginDisarmedFall(simState, id, 'DISARM в воздухе: двигатели отключены, начинается свободное падение.');
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
                const roll = applyDeadzone(clampStick(simState.rcChannels[0]));
                const pitch = applyDeadzone(clampStick(simState.rcChannels[1]));
                const throttle = normalizeThrottle(simState.rcChannels[2]);
                const yaw = applyDeadzone(clampStick(simState.rcChannels[3]));

                let maxBodySpeed = STABILIZE_MAX_BODY_SPEED;
                let maxClimbRate = STABILIZE_MAX_CLIMB_RATE;
                let bodyAccel = STABILIZE_BODY_ACCEL;
                let targetTiltLimit = STABILIZE_MAX_TILT;

                if (simState.flightMode === 'ALTHOLD') {
                    maxBodySpeed = ALTHOLD_MAX_BODY_SPEED;
                    maxClimbRate = ALTHOLD_MAX_CLIMB_RATE;
                    bodyAccel = ALTHOLD_BODY_ACCEL;
                    targetTiltLimit = ALTHOLD_MAX_TILT;
                } else if (simState.flightMode === 'LOITER') {
                    maxBodySpeed = LOITER_MAX_BODY_SPEED;
                    maxClimbRate = LOITER_MAX_CLIMB_RATE;
                    bodyAccel = LOITER_BODY_ACCEL;
                    targetTiltLimit = LOITER_VISUAL_TILT_LIMIT;
                }

                const currentBodyVelocity = worldPlanarToBody(simState.vel.x, simState.vel.y, simState.orientation.yaw);
                const targetBodyForwardSpeed = pitch * maxBodySpeed;
                const targetBodyRightSpeed = roll * maxBodySpeed;
                const nextBodyForwardSpeed = approach(currentBodyVelocity.forward, targetBodyForwardSpeed, bodyAccel * dt);
                const nextBodyRightSpeed = approach(currentBodyVelocity.right, targetBodyRightSpeed, bodyAccel * dt);
                const targetVerticalSpeed = ((throttle - 0.5) * 2) * maxClimbRate;

                simState.orientation.yaw += yaw * MAX_YAW_RATE * dt;

                if (simState.flightMode === 'STABILIZE') {
                    simState.vel.z = approach(simState.vel.z, targetVerticalSpeed, MANUAL_VERTICAL_ACCEL * dt);
                } else if (simState.flightMode === 'ALTHOLD') {
                    simState.vel.z = approach(simState.vel.z, targetVerticalSpeed, MANUAL_VERTICAL_ACCEL * dt);
                } else if (simState.flightMode === 'LOITER') {
                    // Оптический поток: если под нами что-то есть, поднимаемся
                    let terrainAlt = 0;
                    const obstacles = getObstacles();
                    for (const obj of obstacles) {
                        if (obj.position.z < simState.pos.z && Math.abs(obj.position.x - simState.pos.x) < 0.5 && Math.abs(obj.position.y - simState.pos.y) < 0.5) {
                            terrainAlt = Math.max(terrainAlt, obj.position.z + 0.5);
                        }
                    }
                    simState.vel.z = approach(simState.vel.z, targetVerticalSpeed, MANUAL_VERTICAL_ACCEL * dt);
                    if (simState.pos.z <= terrainAlt && simState.vel.z < 0) {
                        simState.vel.z = 0;
                        simState.pos.z = terrainAlt;
                    }
                }

                const targetWorldVelocity = bodyPlanarToWorld(
                    nextBodyRightSpeed,
                    nextBodyForwardSpeed,
                    simState.orientation.yaw
                );

                simState.vel.x = targetWorldVelocity.x;
                simState.vel.y = targetWorldVelocity.y;
                simState.pos.x += simState.vel.x * dt;
                simState.pos.y += simState.vel.y * dt;
                simState.pos.z += simState.vel.z * dt;

                if (simState.flightMode === 'LOITER') {
                    simState.orientation.pitch = Math.max(
                        -LOITER_VISUAL_TILT_LIMIT,
                        Math.min(LOITER_VISUAL_TILT_LIMIT, nextBodyForwardSpeed * LOITER_VISUAL_TILT_GAIN)
                    );
                    simState.orientation.roll = Math.max(
                        -LOITER_VISUAL_TILT_LIMIT,
                        Math.min(LOITER_VISUAL_TILT_LIMIT, nextBodyRightSpeed * LOITER_VISUAL_TILT_GAIN)
                    );
                } else {
                    const tiltGain = targetTiltLimit / Math.max(0.001, maxBodySpeed);
                    simState.orientation.pitch = Math.max(-targetTiltLimit, Math.min(targetTiltLimit, nextBodyForwardSpeed * tiltGain));
                    simState.orientation.roll = Math.max(-targetTiltLimit, Math.min(targetTiltLimit, nextBodyRightSpeed * tiltGain));
                }

                simState.target_pos = { ...simState.pos };
                simState.target_alt = simState.pos.z;
                simState.target_yaw = simState.orientation.yaw;
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

                const bodyAccel = worldPlanarToBody(ax, ay, simState.orientation.yaw);
                const targetPitch = Math.max(-AUTO_MAX_TILT, Math.min(AUTO_MAX_TILT, bodyAccel.forward * AUTO_TILT_GAIN));
                const targetRoll = Math.max(-AUTO_MAX_TILT, Math.min(AUTO_MAX_TILT, bodyAccel.right * AUTO_TILT_GAIN));

                // Smoothly interpolate current tilt to target tilt
                simState.orientation.pitch += (targetPitch - simState.orientation.pitch) * AUTO_TILT_RESPONSE * dt;
                simState.orientation.roll += (targetRoll - simState.orientation.roll) * AUTO_TILT_RESPONSE * dt;
            }

            if (simState.pos.z <= 0) {
                const verticalImpactSpeed = Math.max(0, -simState.vel.z);
                const totalImpactSpeed = Math.sqrt(
                    simState.vel.x ** 2
                    + simState.vel.y ** 2
                    + simState.vel.z ** 2
                );

                simState.pos.z = 0;

                if (shouldCrashOnGroundImpact(prevPos.z, verticalImpactSpeed, totalImpactSpeed)) {
                    applyCrashState(
                        simState,
                        id,
                        `жесткий удар о землю: h=${prevPos.z.toFixed(2)}м, vz=${verticalImpactSpeed.toFixed(2)}м/с, v=${totalImpactSpeed.toFixed(2)}м/с`
                    );
                } else if (simState.status === 'ПОСАДКА') {
                    simState.status = 'ПРИЗЕМЛЕН';
                    simState.vel = { x: 0, y: 0, z: 0 };
                    simState.target_pos = { ...simState.pos, z: 0 };
                    simState.target_alt = 0;
                    triggerLuaCallback(id, 7);
                } else {
                    simState.status = 'ГОТОВ';
                    simState.vel = { x: 0, y: 0, z: 0 };
                    simState.target_pos = { ...simState.pos, z: 0 };
                    simState.target_alt = 0;
                }
            }
        } else if (simState.status === 'DISARMED_FALL') {
            const impactVel = { ...simState.vel };
            simState.vel.z -= 9.81 * dt;
            simState.pos.x += simState.vel.x * dt;
            simState.pos.y += simState.vel.y * dt;
            simState.pos.z += simState.vel.z * dt;

            if (simState.pos.z <= 0) {
                const verticalImpactSpeed = Math.max(0, -impactVel.z);
                const totalImpactSpeed = Math.sqrt(
                    impactVel.x ** 2
                    + impactVel.y ** 2
                    + impactVel.z ** 2
                );
                simState.pos.z = 0;

                if (shouldCrashOnGroundImpact(prevPos.z, verticalImpactSpeed, totalImpactSpeed)) {
                    simState.status = 'CRASHED';
                    simState.running = false;
                    simState.target_pos = { ...simState.pos };
                    simState.target_alt = 0;
                    simState.vel = { x: 0, y: 0, z: 0 };
                    log(
                        `[Physics] Дрон ${id} разрушен при ударе о землю: h=${prevPos.z.toFixed(2)}м, vz=${verticalImpactSpeed.toFixed(2)}м/с, v=${totalImpactSpeed.toFixed(2)}м/с.`,
                        'warn'
                    );
                    triggerLuaCallback(id, 16);
                } else {
                    simState.status = 'ГОТОВ';
                    simState.vel = { x: 0, y: 0, z: 0 };
                    simState.target_pos = { ...simState.pos, z: 0 };
                    simState.target_alt = 0;
                    log(
                        `[Physics] Дрон ${id} безопасно отключен после падения: h=${prevPos.z.toFixed(2)}м, vz=${verticalImpactSpeed.toFixed(2)}м/с.`,
                        'info'
                    );
                }
            }
        } else if (simState.status === 'CRASHED') {
            // Свободное падение после уже зафиксированного разрушения
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
