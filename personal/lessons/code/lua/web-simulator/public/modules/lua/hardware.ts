import { log } from '../shared/logging/logger.js';
import { getDroneFromLua } from '../core/state.js';

declare const THREE: any;

export const camera_requestMakeShot = function(L: any) {
    log('Camera: Запрос снимка', 'info');
    if (window.scene && window.droneMesh) {
        const flash = new THREE.PointLight(0xffffff, 2, 10);
        flash.position.copy(window.droneMesh.position).add(new THREE.Vector3(0, 0, 0.2));
        window.scene.add(flash);
        setTimeout(() => window.scene.remove(flash), 100);
    }
    return 0;
};

export const camera_checkRequestShot = function(L: any) {
    window.fengari.lua.lua_pushinteger(L, 0); 
    return 1;
};

export const camera_requestRecordStart = function(L: any) {
    log('Camera: Старт записи видео', 'info');
    return 0;
};

export const camera_requestRecordStop = function(L: any) {
    log('Camera: Стоп записи видео', 'info');
    return 0;
};

export const gpio_new = function(L: any) {
    const lua = window.fengari.lua;
    const port = lua.lua_tointeger(L, 1);
    const pin = lua.lua_tointeger(L, 2);
    const mode = lua.lua_tointeger(L, 3);

    const isMagnetPin = (gpioPort: number, gpioPin: number) =>
        (gpioPort === 3 && gpioPin === 3) || (gpioPort === 1 && gpioPin === 1);

    const readNumberField = (state: any, field: string) => {
        lua.lua_getfield(state, 1, field);
        const value = lua.lua_tointeger(state, -1);
        lua.lua_pop(state, 1);
        return value;
    };

    const readBooleanField = (state: any, field: string) => {
        lua.lua_getfield(state, 1, field);
        const value = lua.lua_toboolean(state, -1);
        lua.lua_pop(state, 1);
        return value;
    };

    const writeState = (state: any, active: boolean) => {
        lua.lua_pushboolean(state, active ? 1 : 0);
        lua.lua_setfield(state, 1, "__state");

        const gpioPort = readNumberField(state, "__port");
        const gpioPin = readNumberField(state, "__pin");
        if (isMagnetPin(gpioPort, gpioPin)) {
            const simState = getDroneFromLua(state);
            simState.magnetGripper.active = active;
        }
    };

    window.fengari.lua.lua_newtable(L);

    lua.lua_pushinteger(L, port);
    lua.lua_setfield(L, -2, "__port");
    lua.lua_pushinteger(L, pin);
    lua.lua_setfield(L, -2, "__pin");
    lua.lua_pushinteger(L, mode);
    lua.lua_setfield(L, -2, "__mode");
    lua.lua_pushboolean(L, 0);
    lua.lua_setfield(L, -2, "__state");

    window.fengari.lua.lua_pushcfunction(L, (state: any) => {
        log(`GPIO: read called`, 'info');
        lua.lua_pushboolean(state, readBooleanField(state, "__state"));
        return 1;
    });
    window.fengari.lua.lua_setfield(L, -2, "read");

    window.fengari.lua.lua_pushcfunction(L, (state: any) => {
        log(`GPIO: set called`, 'info');
        writeState(state, true);
        return 0;
    });
    window.fengari.lua.lua_setfield(L, -2, "set");

    window.fengari.lua.lua_pushcfunction(L, (state: any) => {
        log(`GPIO: reset called`, 'info');
        writeState(state, false);
        return 0;
    });
    window.fengari.lua.lua_setfield(L, -2, "reset");

    window.fengari.lua.lua_pushcfunction(L, (state: any) => {
        log(`GPIO: write called`, 'info');
        const active = lua.lua_toboolean(state, 2);
        writeState(state, active);
        return 0;
    });
    window.fengari.lua.lua_setfield(L, -2, "write");

    window.fengari.lua.lua_pushcfunction(L, (state: any) => {
        log(`GPIO: setFunction called`, 'info');
        const nextMode = lua.lua_tointeger(state, 2);
        lua.lua_pushinteger(state, nextMode);
        lua.lua_setfield(state, 1, "__mode");
        return 0;
    });
    window.fengari.lua.lua_setfield(L, -2, "setFunction");

    return 1;
};

export const uart_new = function(L: any) {
    window.fengari.lua.lua_newtable(L);
    const methods = ['read', 'write', 'bytesToRead', 'setBaudRate'];
    methods.forEach(m => {
        window.fengari.lua.lua_pushcfunction(L, (L: any) => {
            if (m === 'read') window.fengari.lua.lua_pushstring(L, "");
            if (m === 'bytesToRead') window.fengari.lua.lua_pushinteger(L, 0);
            return (m === 'read' || m === 'bytesToRead') ? 1 : 0;
        });
        window.fengari.lua.lua_setfield(L, -2, m);
    });
    return 1;
};

export const spi_new = function(L: any) {
    window.fengari.lua.lua_newtable(L);
    const methods = ['read', 'write', 'exchange'];
    methods.forEach(m => {
        window.fengari.lua.lua_pushcfunction(L, (L: any) => {
            log(`SPI: ${m} called`, 'info');
            if (m === 'read') window.fengari.lua.lua_pushstring(L, "");
            if (m === 'exchange') window.fengari.lua.lua_pushstring(L, "");
            return (m === 'read' || m === 'exchange') ? 1 : 0;
        });
        window.fengari.lua.lua_setfield(L, -2, m);
    });
    return 1;
};
