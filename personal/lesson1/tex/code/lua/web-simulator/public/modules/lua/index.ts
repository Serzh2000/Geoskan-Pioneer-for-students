import { simState } from '../state.js';
import { log } from '../ui/logger.js';
import { luaToStr } from '../utils.js';
import { triggerEvent } from '../mce-events.js';
import { runCoroutine } from './runner.js';
import { ap_push, ap_goToPoint, ap_goToLocalPoint, ap_updateYaw } from './autopilot.js';
import { sensors_pos, sensors_vel, sensors_accel, sensors_gyro, sensors_orientation, sensors_range, sensors_battery, sensors_tof } from './sensors.js';
import { timer_callLater, timer_new, sys_time, sys_deltaTime, js_sleep } from './timers.js';
import { camera_requestMakeShot, camera_checkRequestShot, camera_requestRecordStart, camera_requestRecordStop, gpio_new, uart_new, spi_new } from './hardware.js';
import { ledbar_fromHSV, js_init_leds } from './leds.js';

let globalLuaState: any = null;

export function setupLuaBridge() {
    const L = window.fengari.L;
    const lua = window.fengari.lua;
    const lauxlib = window.fengari.lauxlib;
    const lualib = window.fengari.lualib;

    const setupScript = `
        Ev = { 
            MCE_PREFLIGHT=1, MCE_TAKEOFF=2, MCE_LANDING=3, ENGINES_ARM=4, ENGINES_DISARM=5, 
            TAKEOFF_COMPLETE=6, COPTER_LANDED=7, LOW_VOLTAGE=8, STATE_CHANGED=9, POINT_REACHED=10,
            ENGINES_STARTED=11, POINT_DECELERATION=12, LOW_VOLTAGE1=13, LOW_VOLTAGE2=14,
            SYNC_START=15, SHOCK=16, CONTROL_FAIL=17, ENGINE_FAIL=18
        }
        ap = { 
            push = js_ap_push,
            goToPoint = js_ap_goToPoint,
            goToLocalPoint = js_ap_goToLocalPoint,
            updateYaw = js_ap_updateYaw
        }
        Sensors = { 
            lpsPosition = js_sensors_pos,
            lpsVelocity = js_sensors_vel,
            accel = js_sensors_accel,
            gyro = js_sensors_gyro,
            orientation = js_sensors_orientation,
            range = js_sensors_range,
            battery = js_sensors_battery,
            tof = js_sensors_tof
        }
        Timer = { 
            callLater = js_timer_callLater,
            new = js_timer_new
        }
        camera = {
            requestMakeShot = js_camera_requestMakeShot,
            checkRequestShot = js_camera_checkRequestShot,
            requestRecordStart = js_camera_requestRecordStart,
            requestRecordStop = js_camera_requestRecordStop,
            checkRequestRecord = js_camera_checkRequestShot
        }
        Gpio = { new = js_gpio_new, A=1, B=2, C=3, D=4, E=5, INPUT=0, OUTPUT=1, ALTFU=2 }
        Uart = { new = js_uart_new, PARITY_NONE=0, PARITY_EVEN=1, PARITY_ODD=2, ONE_STOP=1, TWO_STOP=2 }
        Spi = { new = js_spi_new, MSB=0, LSB=1, MODE0=0, MODE1=1, MODE2=2, MODE3=3 }
        
        time = js_sys_time
        deltaTime = js_sys_deltaTime
        launchTime = function() return 0 end
        boardNumber = "SIMULATOR"
        sleep = js_sleep

        Ledbar = {}
        Ledbar.fromHSV = js_ledbar_fromHSV
        Ledbar.__index = Ledbar
        function Ledbar.new(count)
            local obj = setmetatable({ count = count }, Ledbar)
            js_init_leds(count)
            return obj
        end
        function Ledbar:set(index, r, g, b, w)
            js_ledbar_set(index, r or 0, g or 0, b or 0, w or 0)
        end
        function callback(event) end
    `;

    const luaState = lauxlib.luaL_newstate();
    lualib.luaL_openlibs(luaState);

    lua.lua_register(luaState, "js_ap_push", ap_push);
    lua.lua_register(luaState, "js_ap_goToPoint", ap_goToPoint);
    lua.lua_register(luaState, "js_ap_goToLocalPoint", ap_goToLocalPoint);
    lua.lua_register(luaState, "js_ap_updateYaw", ap_updateYaw);
    lua.lua_register(luaState, "js_sensors_pos", sensors_pos);
    lua.lua_register(luaState, "js_sensors_vel", sensors_vel);
    lua.lua_register(luaState, "js_sensors_accel", sensors_accel);
    lua.lua_register(luaState, "js_sensors_gyro", sensors_gyro);
    lua.lua_register(luaState, "js_sensors_orientation", sensors_orientation);
    lua.lua_register(luaState, "js_sensors_range", sensors_range);
    lua.lua_register(luaState, "js_sensors_battery", sensors_battery);
    lua.lua_register(luaState, "js_sensors_tof", sensors_tof);
    lua.lua_register(luaState, "js_timer_callLater", timer_callLater);
    lua.lua_register(luaState, "js_timer_new", timer_new);
    lua.lua_register(luaState, "js_camera_requestMakeShot", camera_requestMakeShot);
    lua.lua_register(luaState, "js_camera_checkRequestShot", camera_checkRequestShot);
    lua.lua_register(luaState, "js_camera_requestRecordStart", camera_requestRecordStart);
    lua.lua_register(luaState, "js_camera_requestRecordStop", camera_requestRecordStop);
    lua.lua_register(luaState, "js_gpio_new", gpio_new);
    lua.lua_register(luaState, "js_uart_new", uart_new);
    lua.lua_register(luaState, "js_spi_new", spi_new);
    lua.lua_register(luaState, "js_sys_time", sys_time);
    lua.lua_register(luaState, "js_sys_deltaTime", sys_deltaTime);
    lua.lua_register(luaState, "js_ledbar_fromHSV", ledbar_fromHSV);
    lua.lua_register(luaState, "js_init_leds", js_init_leds);
    lua.lua_register(luaState, "js_ledbar_set", function(L: any) {
        const i = lua.lua_tointeger(L, 1);
        const r = lua.lua_tonumber(L, 2);
        const g = lua.lua_tonumber(L, 3);
        const b = lua.lua_tonumber(L, 4);
        const w = lua.lua_tonumber(L, 5);
        if (simState.leds[i]) {
            simState.leds[i] = { r: r*255, g: g*255, b: b*255, w: w*255 };
        } else {
            simState.leds[i] = { r: r*255, g: g*255, b: b*255, w: w*255 };
        }
        return 0;
    });
    lua.lua_register(luaState, "js_sleep", js_sleep);

    const res = lauxlib.luaL_dostring(luaState, window.fengari.to_luastring(setupScript));
    if (res !== 0) {
        const errVal = lua.lua_tostring(luaState, -1);
        log(`Lua Setup Error: ${luaToStr(errVal, luaState)}`, 'error');
    } else {
        setLuaState(luaState);
    }
}

export function runLuaScript(code: string) {
    if (!globalLuaState) setupLuaBridge();
    const lua = window.fengari.lua;
    const lauxlib = window.fengari.lauxlib;
    
    const res = lauxlib.luaL_loadstring(globalLuaState, window.fengari.to_luastring(code));
    if (res !== 0) {
        const errVal = lua.lua_tostring(globalLuaState, -1);
        log(`Compile Error: ${luaToStr(errVal, globalLuaState)}`, 'error');
        return false;
    }
    
    const T = lua.lua_newthread(globalLuaState);
    lua.lua_pushvalue(globalLuaState, -2);
    lua.lua_xmove(globalLuaState, T, 1);
    lua.lua_pop(globalLuaState, 2); 
    
    runCoroutine(globalLuaState, T, 0, globalLuaState);
    return true;
}

export function stopLuaScript() {
    globalLuaState = null;
}

export function updateTimers() {
    if (!globalLuaState) return;
    const lua = window.fengari.lua;
    const lauxlib = window.fengari.lauxlib;

    for (let i = simState.timers.length - 1; i >= 0; i--) {
        const t = simState.timers[i];
        if (t.running && simState.current_time >= t.trigger_time) {
            
            const T = lua.lua_newthread(globalLuaState);
            lua.lua_rawgeti(globalLuaState, lua.LUA_REGISTRYINDEX, t.callback_ref);
            lua.lua_xmove(globalLuaState, T, 1);
            
            if (lua.lua_isfunction(T, -1)) {
                runCoroutine(globalLuaState, T, 0, globalLuaState);
            } else {
                lua.lua_pop(T, 1);
            }
            
            lua.lua_pop(globalLuaState, 1);

            if (t.one_shot) {
                lauxlib.luaL_unref(globalLuaState, lua.LUA_REGISTRYINDEX, t.callback_ref);
                simState.timers.splice(i, 1);
            } else {
                t.trigger_time = simState.current_time + (t.period || 0); 
                if(t.next_trigger) t.next_trigger = t.trigger_time;
            }
        }
    }
}

export function triggerLuaCallback(eventCode: number) {
    if (!globalLuaState) return;
    const lua = window.fengari.lua;
    
    triggerEvent(eventCode);
    
    const T = lua.lua_newthread(globalLuaState);
    lua.lua_getglobal(T, window.fengari.to_luastring("callback"));
    
    if (lua.lua_isfunction(T, -1)) {
        lua.lua_pushinteger(T, eventCode);
        runCoroutine(globalLuaState, T, 1, globalLuaState);
    } else {
        lua.lua_pop(T, 1);
    }
    
    lua.lua_pop(globalLuaState, 1); 
}

export function setLuaState(state: any) {
    globalLuaState = state;
}

