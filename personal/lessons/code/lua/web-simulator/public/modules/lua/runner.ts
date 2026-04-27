import { log } from '../shared/logging/logger.js';
import { luaToStr } from './utils.js';
import { drones } from '../core/state.js';

export function runCoroutine(L: any, T: any, nresults: any, id: string) {
    const drone = drones[id];
    if (!drone || !drone.running || !drone.luaState) return;

    const lua = window.fengari.lua;
    let status;
    try {
        status = lua.lua_resume(T, L, nresults);
    } catch (e) {
        console.error(`[runCoroutine] lua_resume threw an error for drone ${id}:`, e);
        throw e;
    }
    
    if (status === lua.LUA_YIELD) {
        let sleepTime = 0;
        if (lua.lua_gettop(T) > 0 && lua.lua_isnumber(T, -1)) {
            sleepTime = lua.lua_tonumber(T, -1);
            lua.lua_pop(T, 1); 
        }
        setTimeout(() => {
            runCoroutine(L, T, 0, id);
        }, sleepTime * 1000);
        
    } else if (status !== lua.LUA_OK) {
        const errVal = lua.lua_tostring(T, -1);
        log(`Runtime Error (${id}): ${luaToStr(errVal, T)}`, 'error');
        if (drone) {
            drone.running = false;
            drone.status = 'ОШИБКА';
        }
    }
}