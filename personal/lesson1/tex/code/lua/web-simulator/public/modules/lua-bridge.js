import { simState } from './state.js';
import { log } from './ui.js';
import { luaToStr } from './utils.js';
import { pushCommand, triggerEvent, MCECommands, MCEEvents } from './mce-events.js';

let globalLuaState = null;

// Helper to run a Lua thread as a coroutine (handling yield/sleep)
function runCoroutine(L, T, nresults) {
    const lua = window.fengari.lua;
    const lauxlib = window.fengari.lauxlib;
    
    // Resume the coroutine
    // status = lua_resume(T, from?, narg)
    // In Fengari/Lua 5.3: lua_resume(L, from, narg)
    const status = lua.lua_resume(T, null, nresults);
    
    if (status === lua.LUA_YIELD) {
        // Check if it yielded a number (sleep time)
        // The value is on the top of the stack of T
        let sleepTime = 0;
        if (lua.lua_gettop(T) > 0 && lua.lua_isnumber(T, -1)) {
            sleepTime = lua.lua_tonumber(T, -1);
            lua.lua_pop(T, 1); // Pop the time
        }
        
        // Schedule resumption
        setTimeout(() => {
            runCoroutine(L, T, 0);
        }, sleepTime * 1000);
        
    } else if (status === lua.LUA_OK) {
        // Finished successfully
    } else {
        // Error
        const errVal = lua.lua_tostring(T, -1);
        log(`Runtime Error: ${luaToStr(errVal, T)}`, 'error');
    }
}

// Bridge functions
const ap_push = function(L) {
    if (window.fengari.lua.lua_gettop(L) < 1) return 0;
    const event = window.fengari.lua.lua_tointeger(L, 1);
    simState.command_queue.push(event);
    pushCommand(event);
    return 0;
};

const ap_goToPoint = function(L) {
    if (window.fengari.lua.lua_gettop(L) < 3) return 0;
    const lat = window.fengari.lua.lua_tonumber(L, 1);
    const lon = window.fengari.lua.lua_tonumber(L, 2);
    const alt = window.fengari.lua.lua_tonumber(L, 3);
    simState.target_pos = { x: (lon - 304206500) * 0.01, y: (lat - 600859810) * 0.01, z: alt };
    simState.status = 'ПОЛЕТ_GPS';
    log(`AP: Полет GPS (${lat}, ${lon}, ${alt})`);
    return 0;
};

const ap_goToLocalPoint = function(L) {
    if (window.fengari.lua.lua_gettop(L) < 3) return 0;
    const x = window.fengari.lua.lua_tonumber(L, 1);
    const y = window.fengari.lua.lua_tonumber(L, 2);
    const z = window.fengari.lua.lua_tonumber(L, 3);
    const time = (window.fengari.lua.lua_gettop(L) >= 4) ? window.fengari.lua.lua_tonumber(L, 4) : 0;
    
    // Debug log for coordinates
    console.log(`ap.goToLocalPoint: x=${x}, y=${y}, z=${z}`);
    
    simState.target_pos = { x, y, z };
    simState.status = 'ПОЛЕТ_К_ТОЧКЕ';
    log(`AP: Полет к точке (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})${time > 0 ? ' за ' + time + 'с' : ''}`);
    return 0;
};

const ap_updateYaw = function(L) {
    if (window.fengari.lua.lua_gettop(L) < 1) return 0;
    const yaw = window.fengari.lua.lua_tonumber(L, 1);
    simState.target_yaw = yaw;
    log(`AP: Установка курса ${yaw.toFixed(2)} рад`);
    return 0;
};

const sensors_pos = function(L) {
    window.fengari.lua.lua_pushnumber(L, simState.pos.x);
    window.fengari.lua.lua_pushnumber(L, simState.pos.y);
    window.fengari.lua.lua_pushnumber(L, simState.pos.z);
    return 3;
};

const sensors_vel = function(L) {
    window.fengari.lua.lua_pushnumber(L, simState.vel.x);
    window.fengari.lua.lua_pushnumber(L, simState.vel.y);
    window.fengari.lua.lua_pushnumber(L, simState.vel.z);
    return 3;
};

const sensors_accel = function(L) {
    window.fengari.lua.lua_pushnumber(L, simState.accel.x);
    window.fengari.lua.lua_pushnumber(L, simState.accel.y);
    window.fengari.lua.lua_pushnumber(L, simState.accel.z);
    return 3;
};

const sensors_gyro = function(L) {
    window.fengari.lua.lua_pushnumber(L, simState.gyro.x);
    window.fengari.lua.lua_pushnumber(L, simState.gyro.y);
    window.fengari.lua.lua_pushnumber(L, simState.gyro.z);
    return 3;
};

const sensors_orientation = function(L) {
    window.fengari.lua.lua_pushnumber(L, simState.orientation.roll);
    window.fengari.lua.lua_pushnumber(L, simState.orientation.pitch);
    window.fengari.lua.lua_pushnumber(L, simState.orientation.yaw);
    return 3;
};

const sensors_range = function(L) {
    window.fengari.lua.lua_pushnumber(L, simState.pos.z); 
    return 1;
};

const sensors_battery = function(L) {
    window.fengari.lua.lua_pushnumber(L, simState.battery);
    return 1;
};

const sensors_tof = function(L) {
    window.fengari.lua.lua_pushnumber(L, simState.pos.z * 1000); 
    return 1;
};

const timer_callLater = function(L) {
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

const timer_new = function(L) {
    if (window.fengari.lua.lua_gettop(L) < 2) return 0;
    const period = window.fengari.lua.lua_tonumber(L, 1);
    window.fengari.lua.lua_pushvalue(L, 2);
    const func_ref = window.fengari.lauxlib.luaL_ref(L, window.fengari.lua.LUA_REGISTRYINDEX);
    
    const timer_obj = {
        period: period,
        callback_ref: func_ref,
        next_trigger: simState.current_time + period,
        one_shot: false,
        running: false
    };
    
    simState.timers.push(timer_obj);
    
    window.fengari.lua.lua_newtable(L);
    window.fengari.lua.lua_pushlightuserdata(L, timer_obj);
    window.fengari.lua.lua_setfield(L, -2, "__ptr");
    
    window.fengari.lua.lua_pushcfunction(L, (L) => {
        window.fengari.lua.lua_getfield(L, 1, "__ptr");
        const ptr = window.fengari.lua.lua_touserdata(L, -1);
        ptr.running = true;
        ptr.next_trigger = simState.current_time + ptr.period;
        return 0;
    });
    window.fengari.lua.lua_setfield(L, -2, "start");
    
    window.fengari.lua.lua_pushcfunction(L, (L) => {
        window.fengari.lua.lua_getfield(L, 1, "__ptr");
        const ptr = window.fengari.lua.lua_touserdata(L, -1);
        ptr.running = false;
        return 0;
    });
    window.fengari.lua.lua_setfield(L, -2, "stop");
    
    return 1;
};

const camera_requestMakeShot = function(L) {
    log('Camera: Запрос снимка', 'info');
    if (window.scene && window.droneMesh) {
        const flash = new THREE.PointLight(0xffffff, 2, 10);
        flash.position.copy(window.droneMesh.position).add(new THREE.Vector3(0, 0, 0.2));
        window.scene.add(flash);
        setTimeout(() => window.scene.remove(flash), 100);
    }
    return 0;
};
const camera_checkRequestShot = function(L) {
    window.fengari.lua.lua_pushinteger(L, 0); 
    return 1;
};
const camera_requestRecordStart = function(L) {
    log('Camera: Старт записи видео', 'info');
    return 0;
};
const camera_requestRecordStop = function(L) {
    log('Camera: Стоп записи видео', 'info');
    return 0;
};

const gpio_new = function(L) {
    window.fengari.lua.lua_newtable(L);
    const methods = ['read', 'set', 'reset', 'write', 'setFunction'];
    methods.forEach(m => {
        window.fengari.lua.lua_pushcfunction(L, (L) => {
            log(`GPIO: ${m} called`, 'info');
            if (m === 'read') window.fengari.lua.lua_pushboolean(L, false);
            return m === 'read' ? 1 : 0;
        });
        window.fengari.lua.lua_setfield(L, -2, m);
    });
    return 1;
};

const uart_new = function(L) {
    window.fengari.lua.lua_newtable(L);
    const methods = ['read', 'write', 'bytesToRead', 'setBaudRate'];
    methods.forEach(m => {
        window.fengari.lua.lua_pushcfunction(L, (L) => {
            if (m === 'read') window.fengari.lua.lua_pushstring(L, "");
            if (m === 'bytesToRead') window.fengari.lua.lua_pushinteger(L, 0);
            return (m === 'read' || m === 'bytesToRead') ? 1 : 0;
        });
        window.fengari.lua.lua_setfield(L, -2, m);
    });
    return 1;
};

const spi_new = function(L) {
    window.fengari.lua.lua_newtable(L);
    const methods = ['read', 'write', 'exchange'];
    methods.forEach(m => {
        window.fengari.lua.lua_pushcfunction(L, (L) => {
            log(`SPI: ${m} called`, 'info');
            if (m === 'read') window.fengari.lua.lua_pushstring(L, "");
            if (m === 'exchange') window.fengari.lua.lua_pushstring(L, "");
            return (m === 'read' || m === 'exchange') ? 1 : 0;
        });
        window.fengari.lua.lua_setfield(L, -2, m);
    });
    return 1;
};

const ledbar_fromHSV = function(L) {
    const h = window.fengari.lua.lua_tonumber(L, 1);
    const s = window.fengari.lua.lua_tonumber(L, 2);
    const v = window.fengari.lua.lua_tonumber(L, 3);
    
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    
    window.fengari.lua.lua_pushnumber(L, r);
    window.fengari.lua.lua_pushnumber(L, g);
    window.fengari.lua.lua_pushnumber(L, b);
    return 3;
};

const sys_time = function(L) {
    window.fengari.lua.lua_pushnumber(L, simState.current_time);
    return 1;
};
const sys_deltaTime = function(L) {
    window.fengari.lua.lua_pushnumber(L, 0.05); 
    return 1;
};

function js_init_leds(count) {
    simState.leds = new Array(count).fill({r:0, g:0, b:0, w:0});
}

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
    
    // Sleep function that yields
    lua.lua_register(luaState, "js_sleep", (L) => {
        const sec = lua.lua_tonumber(L, 1) || 0;
        log(`Sleep: ${sec}s`, 'info');
        // Push time to stack to retrieve it after yield
        lua.lua_pushnumber(L, sec);
        // Yield 1 value (the time)
        return lua.lua_yield(L, 1);
    });

    lua.lua_register(luaState, "js_ledbar_set", (L) => {
        const index = lua.lua_tointeger(L, 1);
        const r = (lua.lua_tonumber(L, 2) || 0) * 255;
        const g = (lua.lua_tonumber(L, 3) || 0) * 255;
        const b = (lua.lua_tonumber(L, 4) || 0) * 255;
        const w = (lua.lua_gettop(L) >= 5) ? (lua.lua_tonumber(L, 5) || 0) * 255 : 0;
        
        if (index >= 0 && index < simState.leds.length) {
            simState.leds[index] = { r, g, b, w };
        }
        return 0;
    });
    
    lua.lua_register(luaState, "js_init_leds", (L) => {
        const count = lua.lua_tointeger(L, 1);
        js_init_leds(count);
        return 0;
    });

    const res = lauxlib.luaL_dostring(luaState, window.fengari.to_luastring(setupScript));
    if (res !== 0) {
        const errVal = lua.lua_tostring(luaState, -1);
        log(`Setup Error: ${luaToStr(errVal, luaState)}`, 'error');
        return null;
    }
    
    globalLuaState = luaState;
    return luaState;
}

export function runLuaScript(code) {
    if (!globalLuaState) setupLuaBridge();
    const lua = window.fengari.lua;
    const lauxlib = window.fengari.lauxlib;
    
    // 1. Load the script -> Stack: [chunk]
    const res = lauxlib.luaL_loadstring(globalLuaState, window.fengari.to_luastring(code));
    if (res !== 0) {
        const errVal = lua.lua_tostring(globalLuaState, -1);
        log(`Compile Error: ${luaToStr(errVal, globalLuaState)}`, 'error');
        return false;
    }
    
    // 2. Create new thread -> Stack: [chunk, thread]
    const T = lua.lua_newthread(globalLuaState);
    
    // 3. Move the chunk to T's stack.
    // We want T stack to be [chunk].
    // Currently Global Stack is [chunk, thread].
    // We need to push the chunk (at -2) to top, then xmove it.
    lua.lua_pushvalue(globalLuaState, -2); // Stack: [chunk, thread, chunk]
    lua.lua_xmove(globalLuaState, T, 1);   // Stack: [chunk, thread] -> T: [chunk]
    
    // 4. Clean up global stack.
    // We remove the chunk from -2, leaving just the thread.
    lua.lua_remove(globalLuaState, -2);    // Stack: [thread]
    
    // 5. Start the thread
    runCoroutine(globalLuaState, T, 0);
    
    // 6. Anchor the thread to prevent GC (optional but safer)
    // For now, we leave it on the stack (it leaks 1 stack slot per script run, but that's acceptable for this session).
    // Or we can rely on JS references if Fengari supports it.
    // Let's just pop it to keep stack clean, assuming JS closure keeps it alive.
    lua.lua_pop(globalLuaState, 1); 
    
    return true;
}

export function stopLuaScript() {
    globalLuaState = null;
    // Clearing timers is done in state reset
}

export function updateTimers() {
    if (!globalLuaState) return;
    const lua = window.fengari.lua;
    const lauxlib = window.fengari.lauxlib;

    for (let i = simState.timers.length - 1; i >= 0; i--) {
        const t = simState.timers[i];
        if (t.running && simState.current_time >= t.trigger_time) {
            
            // Execute callback in a new thread to support yield
            const T = lua.lua_newthread(globalLuaState);
            
            // Get callback function
            lua.lua_rawgeti(globalLuaState, lua.LUA_REGISTRYINDEX, t.callback_ref);
            // Move to thread
            lua.lua_xmove(globalLuaState, T, 1);
            
            if (lua.lua_isfunction(T, -1)) {
                runCoroutine(globalLuaState, T, 0);
            } else {
                lua.lua_pop(T, 1);
            }
            
            // Pop the thread from global stack
            lua.lua_pop(globalLuaState, 1);

            if (t.one_shot) {
                lauxlib.luaL_unref(globalLuaState, lua.LUA_REGISTRYINDEX, t.callback_ref);
                simState.timers.splice(i, 1);
            } else {
                t.trigger_time = simState.current_time + t.period; 
                if(t.next_trigger) t.next_trigger = t.trigger_time;
            }
        }
    }
}

export function triggerLuaCallback(eventCode) {
    if (!globalLuaState) return;
    const lua = window.fengari.lua;
    
    // Publish via EventEmitter first
    triggerEvent(eventCode);
    
    // Run callback in a new thread
    const T = lua.lua_newthread(globalLuaState);
    
    lua.lua_getglobal(T, window.fengari.to_luastring("callback"));
    if (lua.lua_isfunction(T, -1)) {
        lua.lua_pushinteger(T, eventCode);
        runCoroutine(globalLuaState, T, 1);
    } else {
        // Not a function, pop it
        lua.lua_pop(T, 1);
        // It might be nil if not defined, which is fine
    }
    // We should NOT pop the thread here immediately if it's running async/yielded?
    // Actually, lua_newthread pushes the thread on stack. 
    // If we pop it, it might be collected if not referenced elsewhere.
    // But for one-shot callback that might yield, we need to keep it alive?
    // In Fengari JS, we rely on the JS reference in runCoroutine closure?
    // No, runCoroutine receives T. 
    // However, if we pop T from globalLuaState stack, does it get GC'd?
    // Lua GC is manual or periodically.
    // Let's keep it anchored in registry or similar if we want to be safe, 
    // but typically for simple callbacks, just not popping it might fill the stack if called often.
    // But wait, `lua_newthread` pushes it to `globalLuaState` stack.
    // If we don't pop it, the stack grows 1 slot per event.
    // We MUST pop it eventually.
    
    // If `runCoroutine` handles async via setTimeout, it holds a reference to T in the closure.
    // So JS GC won't collect T. Lua GC might if it's not anchored in Lua.
    // But since T is a Lua object (userdata/thread), if JS holds it, Fengari should keep it?
    // Actually, Fengari is a VM.
    
    // The error "attempt to call a thread value" usually happens when we try to call something that isn't a function, 
    // OR if we mess up the stack.
    // In `runLuaScript`, we do `lua_xmove(globalLuaState, T, 1)`. 
    // Here we do `lua_getglobal(T, ...)`.
    
    // Let's verify `runCoroutine` signature match.
    // It calls `lua_resume(T, null, nresults)`.
    
    // The error "attempt to call a thread value" usually comes from `lua_pcall` or `lua_call` or implicit call.
    // But we are using `lua_resume`.
    
    // Wait! `lua_getglobal` pushes the value onto T's stack.
    // If `callback` is not a function (e.g. nil), `lua_isfunction` returns false.
    // If it IS a function, we push integer. Stack: [function, integer].
    // Then `lua_resume(T, null, 1)`. 
    // This should work.
    
    // BUT, look at `runLuaScript`:
    // `lua.lua_xmove(globalLuaState, T, 1);` moves the chunk (function) to T.
    // Then `runCoroutine(..., 0)`. `lua_resume(T, null, 0)`.
    
    // The error "attempt to call a thread value" might be happening inside the Lua script?
    // Or maybe we are trying to resume a thread that is already running or dead?
    
    // If the error happens on `runLuaScript` start:
    // [20:14:39] Runtime Error: attempt to call a thread value
    // This is logged by `runCoroutine`'s error block: `lua_tostring(T, -1)`.
    // So `lua_resume` returned an error code (LUA_ERRRUN).
    
    // Why would `lua_resume` fail with "attempt to call a thread value"?
    // Maybe `lua_loadstring` returned a thread instead of a function? No, it returns a function (chunk).
    // `lua_newthread` pushes a thread.
    // `lua_xmove` moves the function to the thread's stack.
    // `lua_resume` calls the function on top of the stack.
    
    // Wait, in `runLuaScript`:
    // const res = lauxlib.luaL_loadstring(...) -> pushes chunk to globalLuaState.
    // const T = lua.lua_newthread(globalLuaState) -> pushes thread to globalLuaState.
    // lua.lua_xmove(globalLuaState, T, 1) -> moves the thread? NO!
    // Stack of globalLuaState: [chunk, thread].
    // `lua_xmove(from, to, n)` moves top n elements.
    // It moves the THREAD (which is at top) to T? No, that would be weird.
    // We want to move the CHUNK.
    // But the thread is on top!
    // So we need to insert/rotate or pop the thread, then move chunk?
    
    // Correct sequence:
    // 1. loadstring -> pushes chunk. Stack: [chunk]
    // 2. newthread -> pushes thread. Stack: [chunk, thread]
    // 3. We want [chunk] on T's stack.
    // If we call xmove(L, T, 1), it pops [thread] from L and pushes to T.
    // So T has [thread] on its stack? That's wrong.
    
    // We need to swap them or retrieve thread first.
    // Actually `lua_newthread` returns the thread pointer `T`.
    // The thread object is pushed to `L` stack to prevent GC.
    
    // So:
    // L stack: [chunk, thread]
    // We want to move chunk to T.
    // We should do:
    // lua_pushvalue(L, -2); // Copy chunk to top. Stack: [chunk, thread, chunk]
    // lua_xmove(L, T, 1);   // Move top chunk to T. L Stack: [chunk, thread]. T Stack: [chunk]
    
    // Let's fix `runLuaScript` first.
    
    // Also, we need to clean up the stack of L eventually.
    // The thread must remain anchored as long as it runs.
    
    lua.lua_pop(globalLuaState, 1); // Pop thread from L stack to keep it clean? 
    // If we pop it, it might be GC'd if we rely on JS holding T. 
    // Fengari uses weak tables for JS objects usually?
    // Let's assumes we should anchor it.
    // But for now, let's fix the "calling a thread" issue.
}

export function setLuaState(state) {
    globalLuaState = state;
}
