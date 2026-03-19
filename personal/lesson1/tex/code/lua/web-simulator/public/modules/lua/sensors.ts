import { simState } from '../state.js';

export const sensors_pos = function(L: any) {
    window.fengari.lua.lua_pushnumber(L, simState.pos.x);
    window.fengari.lua.lua_pushnumber(L, simState.pos.y);
    window.fengari.lua.lua_pushnumber(L, simState.pos.z);
    return 3;
};

export const sensors_vel = function(L: any) {
    window.fengari.lua.lua_pushnumber(L, simState.vel.x);
    window.fengari.lua.lua_pushnumber(L, simState.vel.y);
    window.fengari.lua.lua_pushnumber(L, simState.vel.z);
    return 3;
};

export const sensors_accel = function(L: any) {
    window.fengari.lua.lua_pushnumber(L, simState.accel.x);
    window.fengari.lua.lua_pushnumber(L, simState.accel.y);
    window.fengari.lua.lua_pushnumber(L, simState.accel.z);
    return 3;
};

export const sensors_gyro = function(L: any) {
    window.fengari.lua.lua_pushnumber(L, simState.gyro.x);
    window.fengari.lua.lua_pushnumber(L, simState.gyro.y);
    window.fengari.lua.lua_pushnumber(L, simState.gyro.z);
    return 3;
};

export const sensors_orientation = function(L: any) {
    window.fengari.lua.lua_pushnumber(L, simState.orientation.roll);
    window.fengari.lua.lua_pushnumber(L, simState.orientation.pitch);
    window.fengari.lua.lua_pushnumber(L, simState.orientation.yaw);
    return 3;
};

export const sensors_range = function(L: any) {
    window.fengari.lua.lua_pushnumber(L, simState.pos.z); 
    return 1;
};

export const sensors_battery = function(L: any) {
    window.fengari.lua.lua_pushnumber(L, simState.battery);
    return 1;
};

export const sensors_tof = function(L: any) {
    window.fengari.lua.lua_pushnumber(L, simState.pos.z * 1000); 
    return 1;
};

