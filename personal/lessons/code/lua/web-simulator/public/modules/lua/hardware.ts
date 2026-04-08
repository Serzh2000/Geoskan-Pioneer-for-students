import { log } from '../ui/logger.js';

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
    window.fengari.lua.lua_newtable(L);
    const methods = ['read', 'set', 'reset', 'write', 'setFunction'];
    methods.forEach(m => {
        window.fengari.lua.lua_pushcfunction(L, (L: any) => {
            log(`GPIO: ${m} called`, 'info');
            if (m === 'read') window.fengari.lua.lua_pushboolean(L, false);
            return m === 'read' ? 1 : 0;
        });
        window.fengari.lua.lua_setfield(L, -2, m);
    });
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
