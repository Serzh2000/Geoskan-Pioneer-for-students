/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./global.d.ts" />
/// <reference path="./shims.d.ts" />
import * as THREE from 'three';
import * as fengari from 'fengari-web';
import { simState, resetState, resetRuntimeStatePreservePose, drones, currentDroneId } from './modules/state.js';
import { init3D, updateDrone3D, is3DActive, addObject, deleteSelectedObject, listSceneObjects, selectSceneObjectById, deleteSceneObjectById, setSceneObjectTransformMode, resetDroneToOrigin, getSelectedSceneObjectId } from './modules/drone.js';
import { updatePhysics } from './modules/physics.js';
import { runLuaScript, stopLuaScript, triggerLuaCallback } from './modules/lua/index.js';
import { setLocalFrameOrigin } from './modules/lua/autopilot.js';
/**
 * Главный входной файл (Entry Point) клиентской части веб-симулятора.
 * Инициализирует все подсистемы: 3D-сцену, пользовательский интерфейс, 
 * редактор кода (Monaco Editor) и физический движок. 
 * Управляет главным циклом обновления (requestAnimationFrame), 
 * запуском/остановкой Lua-скриптов и связью между UI и логикой симуляции.
 */
import { initEditor, getEditorValue, setEditorValue, layoutEditor } from './modules/editor.js';
import { initUI } from './modules/ui/index.js';
import { log } from './modules/ui/logger.js';
import { updateStats } from './modules/ui/stats.js';

// Global assignments for legacy/Lua support
(window as any).THREE = THREE;
(window as any).fengari = fengari;

// Global Loop
import { simSettings } from './modules/state.js';

let animationFrameId: number;
let lastTime = 0;

// Global error handler for debugging
window.onerror = function(message, source, lineno, colno, error) {
    const errorMsg = `[Global Error] ${message} at ${source}:${lineno}:${colno}`;
    console.error(errorMsg, error);
    log(errorMsg, 'error');
    return false;
};

function init() {
    log('Инициализация системы...', 'info');

    // Initialize UI with callbacks
    initUI({
        onRun: startSimulation,
        onStop: stopSimulation,
        onRestart: resetSimulation,
        onFileSelect: loadFileContent,
        onLocalFileLoad: (name, content) => {
            setEditorValue(content);
            log(`Локальный файл загружен: ${name}`, 'success');
        },
        onEditorResize: layoutEditor,
        onSceneAction: (action) => {
            if (action === 'delete') deleteSelectedObject();
            else addObject(action);
        },
        sceneManager: {
            list: () => listSceneObjects(),
            select: (id: string) => selectSceneObjectById(id),
            remove: (id: string) => deleteSceneObjectById(id),
            add: (type: string) => addObject(type),
            setMode: (mode: 'translate' | 'rotate' | 'scale', id?: string) => setSceneObjectTransformMode(mode, id),
            resetDroneOrigin: () => resetDroneToOrigin(),
            getSelectedId: () => getSelectedSceneObjectId()
        }
    });

    // Initialize Editor
    initEditor();

    // Initialize 3D Scene
    const container = document.getElementById('canvas-container');
    if (container) init3D(container);

    // Start Loop
    animate(0);
}

function startSimulation() {
    log(`[DEBUG] startSimulation called. currentDroneId: ${currentDroneId}`, 'info');
    
    // Run all drones
    let anyStarted = false;

    // First save current editor code to the currently selected drone
    if (drones[currentDroneId]) {
        const editorCode = getEditorValue();
        log(`[DEBUG] getEditorValue() returned length: ${editorCode.length}`, 'info');
        drones[currentDroneId].script = editorCode;
    } else {
        log(`[DEBUG] drones[currentDroneId] is undefined!`, 'error');
    }

    for (const id in drones) {
        const drone = drones[id];
        
        // Always try to run, even if it was running before (stop it first)
        const code = drone.script;
        log(`[DEBUG] Drone ${id} script length: ${code ? code.length : 0}`, 'info');
        if (!code || !code.trim()) continue;

        stopLuaScript(id);
        resetRuntimeStatePreservePose(id);
        setLocalFrameOrigin(drone.pos.x, drone.pos.y, drone.pos.z);
        drone.running = true;
        drone.status = 'ЗАПУСК';
        
        try {
            runLuaScript(id, code);
            log(`Скрипт запущен для ${drone.name}`, 'success');
            
            try {
                triggerLuaCallback(id, 1); // Ev.MCE_PREFLIGHT
            } catch (errCb) {
                console.error("Error in triggerLuaCallback:", errCb);
                throw errCb;
            }
            
            anyStarted = true;
        } catch (e: any) {
            drone.running = false;
            drone.status = 'ОШИБКА';
            const errMsg = e instanceof Error ? e.message : String(e);
            log(`Ошибка запуска скрипта ${drone.name}: ${errMsg}`, 'error');
            console.error(`[Main] Error running script for ${id}:`, e);
            anyStarted = true; // Set to true so we don't show the "Нет скриптов" warning if it actually tried to run
        }
    }
    
    if (!anyStarted) {
        log('Нет скриптов для запуска', 'warn');
    }
}

function stopSimulation() {
    for (const id in drones) {
        const drone = drones[id];
        if (drone.running) {
            stopLuaScript(id);
            drone.running = false;
            drone.status = 'ОСТАНОВЛЕН';
            log(`Остановлен: ${drone.name}`, 'warn');
        }
    }
}

function resetSimulation() {
    stopSimulation();
    for (const id in drones) {
        resetState(id);
    }
    log('Симуляция сброшена', 'info');
}

async function loadFileContent(path: string) {
    try {
        const res = await fetch(`/api/file-content?path=${encodeURIComponent(path)}`);
        const data = await res.json();
        setEditorValue(data.content);
        log(`Файл загружен: ${path}`, 'success');
    } catch (e) {
        log('Ошибка загрузки файла', 'error');
    }
}

function animate(time: number) {
    animationFrameId = requestAnimationFrame(animate);

    if (!lastTime) lastTime = time;
    let dt = (time - lastTime) / 1000;
    if (dt > 0.1) dt = 0.1; // Cap dt
    lastTime = time;

    dt *= simSettings.simSpeed;

    updatePhysics(dt);

    if (is3DActive) {
        updateDrone3D(dt);
    }
    
    updateStats();
}

// Make sure global functions are accessible for HTML events
declare global {
    interface Window {
        init: () => void;
    }
}
window.init = init;

// Start everything
window.addEventListener('DOMContentLoaded', init);
