import { simState } from '../state.js';
import { log } from '../ui/logger.js';
import { pushCommand, triggerEvent, MCECommands, MCEEvents } from '../mce-events.js';

export const ap_push = function(L: any) {
    if (window.fengari.lua.lua_gettop(L) < 1) return 0;
    const event = window.fengari.lua.lua_tointeger(L, 1);
    simState.command_queue.push(event);
    pushCommand(event);
    return 0;
};

export const ap_goToPoint = function(L: any) {
    if (window.fengari.lua.lua_gettop(L) < 3) return 0;
    const lat = window.fengari.lua.lua_tonumber(L, 1);
    const lon = window.fengari.lua.lua_tonumber(L, 2);
    const alt = window.fengari.lua.lua_tonumber(L, 3);
    simState.target_pos = { x: (lon - 304206500) * 0.01, y: (lat - 600859810) * 0.01, z: alt };
    simState.status = 'ПОЛЕТ_GPS';
    log(`AP: Полет GPS (${lat}, ${lon}, ${alt})`);
    return 0;
};

export const ap_goToLocalPoint = function(L: any) {
    if (window.fengari.lua.lua_gettop(L) < 3) return 0;
    const x = window.fengari.lua.lua_tonumber(L, 1);
    const y = window.fengari.lua.lua_tonumber(L, 2);
    const z = window.fengari.lua.lua_tonumber(L, 3);
    const time = (window.fengari.lua.lua_gettop(L) >= 4) ? window.fengari.lua.lua_tonumber(L, 4) : 0;
    
    simState.target_pos = { x, y, z };
    simState.status = 'ПОЛЕТ_К_ТОЧКЕ';
    log(`AP: Полет к точке (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})${time > 0 ? ' за ' + time + 'с' : ''}`);
    return 0;
};

export const ap_updateYaw = function(L: any) {
    if (window.fengari.lua.lua_gettop(L) < 1) return 0;
    const yaw = window.fengari.lua.lua_tonumber(L, 1);
    simState.target_yaw = yaw;
    log(`AP: Установка курса ${yaw.toFixed(2)} рад`);
    return 0;
};
