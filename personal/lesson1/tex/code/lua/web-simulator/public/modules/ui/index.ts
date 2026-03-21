import { log } from './logger.js';
import { initContextMenu } from './context-menu.js';
import { apiDocs } from '../api-docs.js';
import { drones, createDroneState, currentDroneId, setCurrentDrone } from '../state.js';
import { getEditorValue, setEditorValue } from '../editor.js';

export interface UICallbacks {
    onEditorResize?: () => void;
    onRun: () => void;
    onStop: () => void;
    onRestart: () => void;
    onFileSelect: (path: string) => void;
    onLocalFileLoad: (name: string, content: string) => void;
    onSceneAction?: (type: string) => void;
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
    initDroneManager(callbacks);
    renderApiDocs();
    initLEDMatrixUI();

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
        // loadFileList(fileSelector); // Assuming loadFileList is imported or defined elsewhere. 
        // If not, we should probably fetch it.
        // Based on main.ts, loadFileContent is passed as callback.
        // We need to fetch list of files from server.
        fetch('/api/files')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(files => {
                // Remove the initial "Загрузка файлов..." option if needed, 
                // or just clear it
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

function initSceneManager(callbacks: UICallbacks) {
    if (!callbacks.sceneManager) return;

    const listEl = document.getElementById('scene-object-list');
    const detailsEl = document.getElementById('scene-object-details');
    const addTypeEl = document.getElementById('scene-add-type') as HTMLSelectElement | null;
    const addBtn = document.getElementById('scene-add-btn');
    const deleteBtn = document.getElementById('scene-delete-btn');
    const resetDroneBtn = document.getElementById('scene-drone-origin-btn');
    const modeTranslateBtn = document.getElementById('scene-mode-translate');
    const modeRotateBtn = document.getElementById('scene-mode-rotate');
    const modeScaleBtn = document.getElementById('scene-mode-scale');

    const format = (v: number) => Number.isFinite(v) ? v.toFixed(2) : 'NaN';

    const render = () => {
        if (!listEl || !detailsEl || !callbacks.sceneManager) return;
        const objects = callbacks.sceneManager.list();
        const selectedId = callbacks.sceneManager.getSelectedId();

        listEl.innerHTML = '';
        for (const obj of objects) {
            const row = document.createElement('button');
            row.type = 'button';
            row.className = 'scene-manager-item' + (obj.id === selectedId ? ' active' : '');
            row.textContent = `${obj.sceneType}${obj.isDrone ? ' (дрон)' : ''}`;
            row.onclick = () => {
                callbacks.sceneManager && callbacks.sceneManager.select(obj.id);
                render();
            };
            listEl.appendChild(row);
        }

        const selected = objects.find((o) => o.id === selectedId) || objects[0];
        if (!selected) {
            detailsEl.textContent = 'Объекты сцены не найдены';
            return;
        }
        detailsEl.textContent = `Тип: ${selected.sceneType}
Имя: ${selected.name}
Перемещаемый: ${selected.draggable ? 'да' : 'нет'}
Позиция: ${format(selected.position.x)}, ${format(selected.position.y)}, ${format(selected.position.z)}
Поворот: ${format(selected.rotation.x)}, ${format(selected.rotation.y)}, ${format(selected.rotation.z)}
Масштаб: ${format(selected.scale.x)}, ${format(selected.scale.y)}, ${format(selected.scale.z)}`;
    };

    if (addBtn && addTypeEl) {
        addBtn.addEventListener('click', () => {
            callbacks.sceneManager && callbacks.sceneManager.add(addTypeEl.value);
            render();
        });
    }
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const selectedId = callbacks.sceneManager && callbacks.sceneManager.getSelectedId();
            if (selectedId && callbacks.sceneManager) callbacks.sceneManager.remove(selectedId);
            render();
        });
    }
    if (resetDroneBtn) {
        resetDroneBtn.addEventListener('click', () => {
            callbacks.sceneManager && callbacks.sceneManager.resetDroneOrigin();
            render();
        });
    }
    if (modeTranslateBtn) {
        modeTranslateBtn.addEventListener('click', () => {
            const selectedId = callbacks.sceneManager && callbacks.sceneManager.getSelectedId();
            callbacks.sceneManager && callbacks.sceneManager.setMode('translate', selectedId || undefined);
            render();
        });
    }
    if (modeRotateBtn) {
        modeRotateBtn.addEventListener('click', () => {
            const selectedId = callbacks.sceneManager && callbacks.sceneManager.getSelectedId();
            callbacks.sceneManager && callbacks.sceneManager.setMode('rotate', selectedId || undefined);
            render();
        });
    }
    if (modeScaleBtn) {
        modeScaleBtn.addEventListener('click', () => {
            const selectedId = callbacks.sceneManager && callbacks.sceneManager.getSelectedId();
            callbacks.sceneManager && callbacks.sceneManager.setMode('scale', selectedId || undefined);
            render();
        });
    }

    window.setInterval(render, 250);
    render();
}

async function loadFileList(selector: HTMLSelectElement) {
    try {
        const res = await fetch('/api/files');
        const files: string[] = await res.json();
        selector.innerHTML = '<option value="">Выберите пример...</option>' + 
            files.map(f => `<option value="${f}">${f}</option>`).join('');
    } catch (e) {
        console.error('Failed to load files', e);
        log('Failed to load files list', 'error');
    }
}

function renderApiDocs() {
    const container = document.getElementById('api-docs');
    if (!container) return;

    let html = '';
    
    // Group APIs by prefix
    const groups: Record<string, any[]> = {};
    for (const [name, doc] of Object.entries(apiDocs)) {
        const prefix = name.includes('.') ? name.split('.')[0] : (name.startsWith('Ev.') ? 'Events' : 'Globals');
        const groupName = name.startsWith('Ev.') ? 'События (Ev.*)' : (prefix === 'Globals' ? 'Глобальные функции' : `Объект ${prefix}`);
        
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push({ name, ...doc });
    }

    for (const [groupName, entries] of Object.entries(groups)) {
        html += `<div class="api-category-title">${groupName}</div>`;
        for (const entry of entries) {
            html += `
                <div class="api-entry">
                    <div class="api-header">
                        <span class="api-name">${entry.name}</span>
                        <span class="api-kind">${entry.kind || 'Method'}</span>
                    </div>
                    <div class="api-desc">${entry.desc}</div>
                    <div class="api-details">
                        ${entry.syntax ? `<div class="api-details-row"><span class="api-details-label">Синтаксис:</span><span class="api-details-value">${entry.syntax}</span></div>` : ''}
                        ${entry.params ? `<div class="api-details-row"><span class="api-details-label">Аргументы:</span><span class="api-details-value">${entry.params}</span></div>` : ''}
                        ${entry.returns ? `<div class="api-details-row"><span class="api-details-label">Возвращает:</span><span class="api-details-value">${entry.returns}</span></div>` : ''}
                    </div>
                    ${entry.example ? `<div class="api-example">${entry.example}</div>` : ''}
                </div>
            `;
        }
    }
    
    container.innerHTML = html;
}

function initLEDMatrixUI() {
    const grid = document.getElementById('led-matrix-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'led-pixel';
        pixel.id = `led-pixel-${i + 4}`; // offset by 4 for base LEDs
        pixel.title = `LED ${i + 4}`;
        grid.appendChild(pixel);
    }
}

function initDroneManager(callbacks: UICallbacks) {
    const list = document.getElementById('drone-list') as HTMLSelectElement;
    const addBtn = document.getElementById('add-drone-btn') as HTMLButtonElement;
    const delBtn = document.getElementById('del-drone-btn') as HTMLButtonElement;

    function updateList() {
        list.innerHTML = '';
        for (const id in drones) {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = drones[id].name;
            if (id === currentDroneId) opt.selected = true;
            list.appendChild(opt);
        }
    }

    list.addEventListener('change', () => {
        // Save current script before switching
        if (drones[currentDroneId]) {
            drones[currentDroneId].script = getEditorValue();
        }
        setCurrentDrone(list.value);
        setEditorValue(drones[currentDroneId].script);
        // Refresh scene
        if (callbacks.onSceneUpdate) callbacks.onSceneUpdate();
    });

    addBtn.addEventListener('click', () => {
        const num = Object.keys(drones).length + 1;
        const id = `drone_${num}_${Date.now()}`;
        const name = `Pioneer ${num}`;
        // Random offset for new drones
        const x = (Math.random() - 0.5) * 4;
        const y = (Math.random() - 0.5) * 4;
        createDroneState(id, name, x, y, 0);
        updateList();
        if (callbacks.onSceneUpdate) callbacks.onSceneUpdate();
        log(`Added new drone: ${name}`);
    });

    delBtn.addEventListener('click', () => {
        if (Object.keys(drones).length <= 1) {
            log('Cannot delete the last drone.', 'error');
            return;
        }
        const id = list.value;
        if (id) {
            delete drones[id];
            setCurrentDrone(Object.keys(drones)[0]);
            setEditorValue(drones[currentDroneId].script);
            updateList();
            if (callbacks.onSceneUpdate) callbacks.onSceneUpdate();
            log(`Deleted drone: ${id}`);
        }
    });

    updateList();
}
