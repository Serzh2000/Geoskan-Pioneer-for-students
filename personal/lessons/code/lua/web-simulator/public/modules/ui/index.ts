/**
 * Главный модуль пользовательского интерфейса (UI).
 * Отвечает за инициализацию всех компонентов интерфейса, привязку обработчиков
 * событий к кнопкам (запуск, остановка, перезапуск), управление переключением
 * вкладок (редактор, справочник API, настройки и др.), а также настройку
 * загрузки файлов с сервера и локально.
 */
import { log } from './logger.js';
import { initContextMenu } from './context-menu.js';
import { initSceneManager } from './scene-manager.js';
import { initDroneManager } from './drone-manager.js';
import { renderApiDocs } from './api-docs-ui.js';
import { initLEDMatrixUI } from './led-matrix.js';
import { initSettingsUI } from './settings.js';

export interface UICallbacks {
    onEditorResize?: () => void;
    onRun: () => void;
    onStop: () => void;
    onRestart: () => void;
    onFileSelect: (path: string) => void;
    onLocalFileLoad: (name: string, content: string) => void;
    onSceneAction?: (type: string) => void;
    onSceneUpdate?: () => void;
    sceneManager?: {
        list: () => Array<{
            id: string;
            name: string;
            sceneType: string;
            draggable: boolean;
            isDrone: boolean;
            selected: boolean;
            position: { x: number; y: number; z: number };
            rotation: { x: number; y: number; z: number };
            scale: { x: number; y: number; z: number };
        }>;
        select: (id: string) => boolean;
        remove: (id: string) => boolean;
        add: (type: string) => void;
        setMode: (mode: 'translate' | 'rotate' | 'scale', id?: string) => boolean;
        resetDroneOrigin: () => boolean;
        getSelectedId: () => string | null;
    };
}

export function initUI(callbacks: UICallbacks) {
    initContextMenu();
    initSceneManager(callbacks);
    initDroneManager(callbacks.onSceneUpdate);
    renderApiDocs();
    initLEDMatrixUI();
    initSettingsUI();

    // Tab Switching logic
    (window as any).switchTab = function(tabId: string) {
        // Deactivate all buttons and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Find button that triggers this tabId
        // Assuming onclick="switchTab('tabId')" is in HTML
        const buttons = document.querySelectorAll('.tab-btn');
        for (let i = 0; i < buttons.length; i++) {
            const btn = buttons[i];
            const onclick = btn.getAttribute('onclick');
            if (onclick && onclick.includes(`'${tabId}'`)) {
                btn.classList.add('active');
            }
        }
        
        const tabEl = document.getElementById(tabId);
        if (tabEl) {
            tabEl.classList.add('active');
            // If switching to editor, layout monaco
            if (tabId === 'editor-tab') {
                if (callbacks.onEditorResize) callbacks.onEditorResize();
            }
        }
    };

    // Camera Mode Switching
    (window as any).setCameraMode = function(mode: string) {
        (window as any).cameraMode = mode;
        // Update button styles
        const buttons = document.querySelectorAll('.camera-controls button') as NodeListOf<HTMLButtonElement>;
        buttons.forEach(btn => {
            const onclick = btn.getAttribute('onclick') || '';
            if (onclick.includes(`'${mode}'`)) {
                btn.style.background = '#38bdf8';
                btn.style.color = '#0f172a';
            } else {
                btn.style.background = '';
                btn.style.color = '';
            }
        });
        log(`Режим камеры: ${mode.toUpperCase()}`, 'info');
    };
    
    // Set default camera mode
    (window as any).setCameraMode('free');

    const runBtn = document.getElementById('run-btn');
    const stopBtn = document.getElementById('stop-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Button Event Listeners
    if (runBtn) runBtn.addEventListener('click', callbacks.onRun);
    if (stopBtn) stopBtn.addEventListener('click', callbacks.onStop);
    if (restartBtn) restartBtn.addEventListener('click', callbacks.onRestart);

    // File Selector
    const fileSelector = document.getElementById('file-selector') as HTMLSelectElement | null;
    if (fileSelector) {
        fetch('/api/files')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(files => {
                fileSelector.innerHTML = '<option value="">Выберите файл...</option>';
                if (Array.isArray(files)) {
                    files.forEach((f: string) => {
                        const opt = document.createElement('option');
                        opt.value = f;
                        opt.textContent = f;
                        fileSelector.appendChild(opt);
                    });
                }
            })
            .catch(err => {
                console.error('Failed to load file list:', err);
                fileSelector.innerHTML = '<option value="">Ошибка загрузки (API недоступно)</option>';
            });

        fileSelector.addEventListener('change', async (e: Event) => {
            const target = e.target as HTMLSelectElement;
            const path = target.value;
            if (!path || path.includes('Загрузка')) return;
            callbacks.onFileSelect(path);
        });
    }

    // Local File Input
    const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
    if (fileInput) {
        fileInput.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                if (evt.target?.result) {
                    callbacks.onLocalFileLoad(file.name, evt.target.result as string);
                }
            };
            reader.readAsText(file);
        });
    }
}
