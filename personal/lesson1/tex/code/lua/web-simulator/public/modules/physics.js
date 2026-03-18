
import { simState } from './state.js';
import { triggerLuaCallback } from './lua-bridge.js';

export function updatePhysics(dt) {
    // Process Command Queue
    if (simState.command_queue.length > 0) {
        const cmd = simState.command_queue.shift();
        
        // Command Handlers
        if (cmd === 1) simState.status = 'ВЗВЕДЕН'; // Ev.MCE_PREFLIGHT
        if (cmd === 2) { // Ev.MCE_TAKEOFF
            simState.target_pos.z = 1.0;
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
        // PID-like smooth control
        const kp = 2.0; // Proportional gain
        const kp_yaw = 1.5;
        
        // Altitude (Z)
        const errZ = simState.target_pos.z - simState.pos.z;
        const dz = errZ * kp * dt;
        simState.pos.z += dz;
        simState.vel.z = dz / dt;

        // Position (X, Y)
        const errX = simState.target_pos.x - simState.pos.x;
        const errY = simState.target_pos.y - simState.pos.y;
        
        const dx = errX * kp * dt;
        const dy = errY * kp * dt;
        
        simState.pos.x += dx;
        simState.pos.y += dy;
        simState.vel.x = dx / dt;
        simState.vel.y = dy / dt;
        
        // Yaw
        let errYaw = simState.target_yaw - simState.orientation.yaw;
        // Normalize angle
        while (errYaw > Math.PI) errYaw -= 2 * Math.PI;
        while (errYaw < -Math.PI) errYaw += 2 * Math.PI;
        
        simState.orientation.yaw += errYaw * kp_yaw * dt;
        
        // Simple roll/pitch tilt based on velocity for visual realism
        const maxTilt = 0.2; // rad
        simState.orientation.pitch = Math.max(-maxTilt, Math.min(maxTilt, simState.vel.x * 0.1));
        simState.orientation.roll = Math.max(-maxTilt, Math.min(maxTilt, -simState.vel.y * 0.1));
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
