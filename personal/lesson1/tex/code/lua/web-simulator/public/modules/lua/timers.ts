import { simState } from '../state.js';

export const timer_callLater = function(L: any) {
    if (window.fengari.lua.lua_gettop(L) < 2) return 0;
    const delay = window.fengari.lua.lua_tonumber(L, 1);
    window.fengari.lua.lua_pushvalue(L, 2);
    const func_ref = window.fengari.lauxlib.luaL_ref(L, window.fengari.lua.LUA_REGISTRYINDEX);
    
    simState.timers.push({
        trigger_time: simState.current_time + delay,
        callback_ref: func_ref,
        one_shot: true,
        running: true
    });
    return 0;
};

export const timer_new = function(L: any) {
    if (window.fengari.lua.lua_gettop(L) < 2) return 0;
    const period = window.fengari.lua.lua_tonumber(L, 1);
    window.fengari.lua.lua_pushvalue(L, 2);
    const func_ref = window.fengari.lauxlib.luaL_ref(L, window.fengari.lua.LUA_REGISTRYINDEX);
    
    const timer_obj = {
        period: period,
        callback_ref: func_ref,
        next_trigger: simState.current_time + period,
        trigger_time: simState.current_time + period,
        one_shot: false,
        running: false
    };
    
    simState.timers.push(timer_obj);
    
    window.fengari.lua.lua_newtable(L);
    window.fengari.lua.lua_pushlightuserdata(L, timer_obj);
    window.fengari.lua.lua_setfield(L, -2, "__ptr");
    
    window.fengari.lua.lua_pushcfunction(L, (L: any) => {
        window.fengari.lua.lua_getfield(L, 1, "__ptr");
        const ptr = window.fengari.lua.lua_touserdata(L, -1);
        ptr.running = true;
        ptr.next_trigger = simState.current_time + ptr.period;
        return 0;
    });
    window.fengari.lua.lua_setfield(L, -2, "start");
    
    window.fengari.lua.lua_pushcfunction(L, (L: any) => {
        window.fengari.lua.lua_getfield(L, 1, "__ptr");
        const ptr = window.fengari.lua.lua_touserdata(L, -1);
        ptr.running = false;
        return 0;
    });
    window.fengari.lua.lua_setfield(L, -2, "stop");
    
    return 1;
};

export const sys_time = function(L: any) {
    window.fengari.lua.lua_pushnumber(L, simState.current_time);
    return 1;
};

export const sys_deltaTime = function(L: any) {
    window.fengari.lua.lua_pushnumber(L, 0.05); 
    return 1;
};

export const js_sleep = function(L: any) {
    const delay = window.fengari.lua.lua_tonumber(L, 1);
    window.fengari.lua.lua_pushnumber(L, delay);
    return window.fengari.lua.lua_yield(L, 1);
};
