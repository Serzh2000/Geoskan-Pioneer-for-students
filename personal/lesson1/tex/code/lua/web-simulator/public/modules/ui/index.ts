import { log } from './logger.js';
import { initContextMenu } from './context-menu.js';

export interface UICallbacks {
    onEditorResize?: () => void;
    onRun: () => void;
    onStop: () => void;
    onRestart: () => void;
    onFileSelect: (path: string) => void;
    onLocalFileLoad: (name: string, content: string) => void;
    onSceneAction?: (type: string) => void;
}

export function initUI(callbacks: UICallbacks) {
    initContextMenu();

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
            .then(res => res.json())
            .then(files => {
                files.forEach((f: string) => {
                    const opt = document.createElement('option');
                    opt.value = f;
                    opt.textContent = f;
                    fileSelector.appendChild(opt);
                });
            })
            .catch(err => console.error('Failed to load file list:', err));

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

function createSceneControls(callbacks: UICallbacks) {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'scene-toolbar';
    toolbar.style.position = 'absolute';
    toolbar.style.bottom = '20px';
    toolbar.style.left = '50%';
    toolbar.style.transform = 'translateX(-50%)';
    toolbar.style.display = 'flex';
    toolbar.style.gap = '10px';
    toolbar.style.background = 'rgba(15, 23, 42, 0.8)';
    toolbar.style.padding = '8px 12px';
    toolbar.style.borderRadius = '8px';
    toolbar.style.border = '1px solid #334155';
    toolbar.style.zIndex = '10';

    const tools = [
        { label: '➕ Ворота', type: 'gate' },
        { label: '➕ Пилон', type: 'pylon' },
        { label: '➕ Флаг', type: 'flag' },
        { label: '🗑️ Удалить', type: 'delete', color: '#f87171' }
    ];

    tools.forEach(tool => {
        const btn = document.createElement('button');
        btn.textContent = tool.label;
        btn.style.background = tool.color || '#1e293b';
        btn.style.color = '#fff';
        btn.style.border = '1px solid #475569';
        btn.style.padding = '4px 8px';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '12px';
        btn.onclick = () => {
            if (callbacks.onSceneAction) {
                callbacks.onSceneAction(tool.type);
            }
        };
        toolbar.appendChild(btn);
    });

    container.appendChild(toolbar);
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