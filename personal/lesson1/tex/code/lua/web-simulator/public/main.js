
import { simState, resetState } from './modules/state.js';
import { init3D, updateDrone3D, is3DActive, addObject, deleteSelectedObject } from './modules/drone.js';
import { updatePhysics } from './modules/physics.js';
import { runLuaScript, stopLuaScript, updateTimers, triggerLuaCallback } from './modules/lua-bridge.js';
import { initEditor, getEditorValue, setEditorValue, layoutEditor } from './modules/editor.js';
import { initUI, updateStats, log } from './modules/ui.js';

// Global Loop
let animationFrameId;

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
    init3D(container);

    // Start Loop
    animate();
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
    simState.status = 'ОСТАНОВЛЕН';
    stopLuaScript();
    log('Симуляция остановлена', 'warn');
}

function resetSimulation() {
    stopSimulation();
    resetState();
    log('Состояние сброшено', 'info');
    // Re-run init code or just wait for start
}

async function loadFileContent(path) {
    try {
        const res = await fetch(`/api/file-content?path=${encodeURIComponent(path)}`);
        const data = await res.json();
        setEditorValue(data.content);
        log(`Файл загружен: ${path}`, 'success');
    } catch (e) {
        log('Ошибка загрузки файла', 'error');
    }
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const now = performance.now() / 1000;
    // Simple delta time (fixed or calculated)
    const dt = 0.02; // 50Hz physics

    if (simState.running) {
        simState.current_time += dt;
        updateTimers();
        updatePhysics(dt);
    }

    updateDrone3D();
    updateStats();
}

// Start everything
window.addEventListener('DOMContentLoaded', init);
