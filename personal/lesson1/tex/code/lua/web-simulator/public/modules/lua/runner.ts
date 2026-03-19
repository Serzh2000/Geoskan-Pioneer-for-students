import { log } from '../ui/logger.js';
import { luaToStr } from '../utils.js';

export function runCoroutine(L: any, T: any, nresults: any, globalLuaState: any) {
    const lua = window.fengari.lua;
    const status = lua.lua_resume(T, null, nresults);
    
    if (status === lua.LUA_YIELD) {
        let sleepTime = 0;
        if (lua.lua_gettop(T) > 0 && lua.lua_isnumber(T, -1)) {
            sleepTime = lua.lua_tonumber(T, -1);
            lua.lua_pop(T, 1); 
        }
        setTimeout(() => {
            if (globalLuaState) runCoroutine(L, T, 0, globalLuaState);
        }, sleepTime * 1000);
        
    } else if (status !== lua.LUA_OK) {
        const errVal = lua.lua_tostring(T, -1);
        log(`Runtime Error: ${luaToStr(errVal, T)}`, 'error');
    }
}