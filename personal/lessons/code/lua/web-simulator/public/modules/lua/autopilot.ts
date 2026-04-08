import { getDroneFromLua } from '../state.js';
import { log } from '../ui/logger.js';
import { pushCommand, triggerEvent, MCECommands, MCEEvents } from '../mce-events.js';

let localFrameOrigin = { x: 0, y: 0, z: 0 };

export function setLocalFrameOrigin(x: number, y: number, z: number) {
    localFrameOrigin = { x, y, z };
    log(`AP: Локальная система координат установлена в (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`, 'info');
}

export const ap_push = function(L: any) {
    if (window.fengari.lua.lua_gettop(L) < 1) return 0;
    const event = window.fengari.lua.lua_tointeger(L, 1);
    const simState = getDroneFromLua(L);
    simState.command_queue.push(event);
    pushCommand(event);
    log(`[Lua AP] ap.push(${event}) - Команда добавлена в очередь`, 'info');
    return 0;
};

export const ap_goToPoint = function(L: any) {
    if (window.fengari.lua.lua_gettop(L) < 3) return 0;
    const lat = window.fengari.lua.lua_tonumber(L, 1);
    const lon = window.fengari.lua.lua_tonumber(L, 2);
    const alt = window.fengari.lua.lua_tonumber(L, 3);
    const simState = getDroneFromLua(L);
    simState.target_pos = { x: (lon - 304206500) * 0.01, y: (lat - 600859810) * 0.01, z: alt };
    simState.status = 'ПОЛЕТ_GPS';
    log(`[Lua AP] ap.goToPoint(${lat}, ${lon}, ${alt}) - Полет GPS запущен`, 'info');
    return 0;
};

export const ap_goToLocalPoint = function(L: any) {
    if (window.fengari.lua.lua_gettop(L) < 3) return 0;
    const x = window.fengari.lua.lua_tonumber(L, 1);
    const y = window.fengari.lua.lua_tonumber(L, 2);
    const z = window.fengari.lua.lua_tonumber(L, 3);
    const time = (window.fengari.lua.lua_gettop(L) >= 4) ? window.fengari.lua.lua_tonumber(L, 4) : 0;
    
    const simState = getDroneFromLua(L);
    simState.target_pos = {
        x: localFrameOrigin.x + x,
        y: localFrameOrigin.y + y,
        z: localFrameOrigin.z + z
    };
    simState.status = 'ПОЛЕТ_К_ТОЧКЕ';
    log(`[Lua AP] ap.goToLocalPoint(${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}) -> глобально (${simState.target_pos.x.toFixed(2)}, ${simState.target_pos.y.toFixed(2)}, ${simState.target_pos.z.toFixed(2)})${time > 0 ? ' за ' + time + 'с' : ''}`, 'info');
    return 0;
};

export const ap_updateYaw = function(L: any) {
    if (window.fengari.lua.lua_gettop(L) < 1) return 0;
    const yaw = window.fengari.lua.lua_tonumber(L, 1);
    const simState = getDroneFromLua(L);
    simState.target_yaw = yaw;
    log(`[Lua AP] ap.updateYaw(${yaw.toFixed(2)} рад)`, 'info');
    return 0;
};
