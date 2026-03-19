
import { simState } from './state.js';
import { triggerLuaCallback } from './lua/index.js';
import { getObstacles } from './drone.js';

export function updatePhysics(dt: number) {
    // Process Command Queue
    if (simState.command_queue.length > 0) {
        const cmd = simState.command_queue.shift();
        
        // Command Handlers
        if (cmd === 1 || cmd === 4) {
            simState.status = 'ВЗВЕДЕН'; // Ev.MCE_PREFLIGHT or ENGINES_ARM
            triggerLuaCallback(11); // Ev.ENGINES_STARTED
        }
        if (cmd === 2) { // Ev.MCE_TAKEOFF
            simState.target_pos.z = 1.0;
            // Also ensure we keep current X/Y if not set
            if (simState.target_pos.x === 0 && simState.target_pos.y === 0) {
                simState.target_pos.x = simState.pos.x;
                simState.target_pos.y = simState.pos.y;
            }
            simState.status = 'ВЗЛЕТ';
        }
        if (cmd === 3) { // Ev.MCE_LANDING
            simState.target_pos.z = 0;
            simState.status = 'ПОСАДКА';
        }
        if (cmd === 4) simState.status = 'ВЗВЕДЕН'; // Ev.ENGINES_ARM
        if (cmd === 5) simState.status = 'ГОТОВ';   // Ev.ENGINES_DISARM
    }

    // Physics Update Logic
    const isFlying = (simState.status !== 'ГОТОВ' && simState.status !== 'ПРИЗЕМЛЕН' && simState.status !== 'ВЗВЕДЕН' && simState.status !== 'IDLE');
    
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
        
        // Let's use simple velocity for yaw or direct lerp
        const yaw_vel = errYaw * kp_yaw;
        simState.orientation.yaw += yaw_vel * dt;
        
        // Transform global acceleration to local acceleration for realistic tilt
        // Correct transformation based on current yaw
        const cosY = Math.cos(simState.orientation.yaw);
        const sinY = Math.sin(simState.orientation.yaw);
        
        // Acceleration relative to drone body
        // Forward is +X body, Right is -Y body (NED/ENU confusion often happens here, assume standard math)
        // Standard rotation matrix for Z-rotation:
        // x' = x cos - y sin
        // y' = x sin + y cos
        // Inverse (to body frame):
        // x_body = ax cos + ay sin
        // y_body = -ax sin + ay cos
        
        const local_ax = ax * cosY + ay * sinY;
        const local_ay = -ax * sinY + ay * cosY;

        const maxTilt = 0.35; 
        // Forward acceleration (local_ax) pitches nose down (+pitch) ? No, pitch down is usually negative in flight dynamics but depends on frame.
        // Let's assume standard ThreeJS/GL frame where Y is up... wait, we use Z up.
        // If accelerating forward (+X), we need to pitch DOWN (nose down). 
        // If accelerating right (+Y), we need to roll RIGHT (right wing down).
        
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
    checkEvents();
}

function checkEvents() {
    if (simState.status === 'CRASHED' || simState.status === 'IDLE' || simState.status === 'ГОТОВ' || simState.status === 'ВЗВЕДЕН') return;

    // Collision Check (SHOCK)
    const obstacles = getObstacles();
    for (const obj of obstacles) {
        // Simple bounding sphere/box collision
        const dist = Math.sqrt(
            (obj.position.x - simState.pos.x)**2 + 
            (obj.position.y - simState.pos.y)**2 + 
            (obj.position.z - simState.pos.z)**2
        );
        // Gates are larger, pylons smaller. Using approx radius.
        const radius = (obj.userData.type === 'Ворота') ? 0.8 : 0.3;
        if (dist < radius) {
            simState.status = 'CRASHED';
            triggerLuaCallback(16); // Ev.SHOCK
            return;
        }
    }

    // Takeoff Complete
    if (simState.status === 'ВЗЛЕТ' && Math.abs(simState.pos.z - simState.target_pos.z) < 0.1) {
        simState.status = 'ПОЛЕТ';
        triggerLuaCallback(6); // Ev.TAKEOFF_COMPLETE
    }
    
    // Landing Complete
    if (simState.status === 'ПОСАДКА' && simState.pos.z < 0.05) {
        simState.status = 'ПРИЗЕМЛЕН';
        triggerLuaCallback(7); // Ev.COPTER_LANDED
    }
    
    // Point Reached
    if (simState.status === 'ПОЛЕТ_К_ТОЧКЕ') {
        const dist = Math.sqrt(
            (simState.target_pos.x - simState.pos.x)**2 + 
            (simState.target_pos.y - simState.pos.y)**2 + 
            (simState.target_pos.z - simState.pos.z)**2
        );
        if (dist < 0.1) {
            simState.status = 'ПОЛЕТ';
            triggerLuaCallback(10); // Ev.POINT_REACHED
        }
    }
}
