/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./global.d.ts" />
/// <reference path="./shims.d.ts" />
import * as THREE from 'three';
import * as fengari from 'fengari-web';
import { simState, resetState } from './modules/state.js';
import { init3D, updateDrone3D, is3DActive, addObject, deleteSelectedObject } from './modules/drone.js';
import { updatePhysics } from './modules/physics.js';
import { runLuaScript, stopLuaScript, updateTimers, triggerLuaCallback } from './modules/lua/index.js';
import { initEditor, getEditorValue, setEditorValue, layoutEditor } from './modules/editor.js';
import { initUI } from './modules/ui/index.js';
import { log } from './modules/ui/logger.js';
import { updateStats } from './modules/ui/stats.js';

// Global assignments for legacy/Lua support
(window as any).THREE = THREE;
(window as any).fengari = fengari;

// Global Loop
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
    if (simState.running) return;
    
    const code = getEditorValue();
    if (!code.trim()) {
        log('Пустой код, запуск отменен', 'warn');
        return;
    }

    resetSimulation();
    simState.running = true;
    simState.status = 'ЗАПУСК';
    
    const success = runLuaScript(code);
    if (success) {
        log('Скрипт запущен', 'success');
        triggerLuaCallback(1); // Ev.MCE_PREFLIGHT
    } else {
        simState.running = false;
        simState.status = 'ОШИБКА';
    }
}

function stopSimulation() {
    if (!simState.running) return;
    simState.running = false;
    simState.status = 'IDLE';
    stopLuaScript();
    log('Симуляция остановлена', 'warn');
}

function resetSimulation() {
    stopSimulation();
    resetState();
    log('Состояние сброшено', 'info');
    // Re-run init code or just wait for start
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

    updateTimers();

    if (simState.running) {
        simState.current_time += dt;
        updatePhysics(dt);
        // Additional loop logic if needed
    }

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
