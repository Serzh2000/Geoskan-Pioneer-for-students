
import { simState } from './state.js';

// DOM Elements
const logs = document.getElementById('logs');
const osdAlt = document.getElementById('osd-alt');
const osdSpd = document.getElementById('osd-spd');
const osdBat = document.getElementById('osd-bat');
const stateAlt = document.getElementById('state-alt');
const stateBat = document.getElementById('state-bat');
const stateStatus = document.getElementById('state-status');
const stateTime = document.getElementById('state-time');
const camParams = document.getElementById('cam-params');
const runBtn = document.getElementById('run-btn');
const stopBtn = document.getElementById('stop-btn');

export function log(msg, type = 'info') {
    const div = document.createElement('div');
    div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    if (type === 'error') div.className = 'log-error';
    if (type === 'warn') div.className = 'log-warn';
    if (type === 'success') div.className = 'log-success';
    logs.appendChild(div);
    logs.scrollTop = logs.scrollHeight;
}

export function updateStats() {
    // Update OSD
    if (osdAlt) osdAlt.textContent = simState.pos.z.toFixed(1);
    const speed = Math.sqrt(simState.vel.x**2 + simState.vel.y**2 + simState.vel.z**2);
    if (osdSpd) osdSpd.textContent = speed.toFixed(1);
    if (osdBat) osdBat.textContent = Math.floor(simState.battery);

    // Update Telemetry Panel
    if (stateAlt) stateAlt.textContent = simState.pos.z.toFixed(2);
    if (stateBat) stateBat.textContent = Math.floor(simState.battery);
    if (stateStatus) {
        stateStatus.textContent = simState.status;
        // Color coding for status
        if (simState.status.includes('ПОЛЕТ') || simState.status.includes('ВЗЛЕТ') || simState.status.includes('ПОСАДКА')) {
            stateStatus.style.color = '#4ade80'; // Green
        } else if (simState.status === 'ВЗВЕДЕН') {
            stateStatus.style.color = '#facc15'; // Yellow
        } else if (simState.status === 'ОШИБКА' || simState.status === 'CRASHED') {
            stateStatus.style.color = '#f87171'; // Red
        } else {
            stateStatus.style.color = '#fff';
        }
    }
    if (stateTime) stateTime.textContent = simState.current_time.toFixed(1);

    // Update Camera Params Visibility
    if (window.cameraMode === 'fpv') {
        if (camParams) camParams.style.display = 'flex';
    } else {
        if (camParams) camParams.style.display = 'none';
    }

    // Update Button States
    if (simState.running) {
        if (runBtn) {
            runBtn.disabled = true;
            runBtn.style.opacity = '0.5';
            runBtn.style.cursor = 'not-allowed';
        }
        if (stopBtn) {
            stopBtn.disabled = false;
            stopBtn.style.opacity = '1';
            stopBtn.style.cursor = 'pointer';
        }
    } else {
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.style.opacity = '1';
            runBtn.style.cursor = 'pointer';
        }
        if (stopBtn) {
            stopBtn.disabled = true;
            stopBtn.style.opacity = '0.5';
            stopBtn.style.cursor = 'not-allowed';
        }
    }
}

export function initUI(callbacks) {
    // Context Menu for 3D Objects
    const ctxMenu = document.createElement('div');
    ctxMenu.id = 'object-context-menu';
    
    const header = document.createElement('div');
    header.className = 'ctx-header';
    header.textContent = 'Действия над объектом';
    
    const moveBtn = document.createElement('button');
    moveBtn.className = 'ctx-btn';
    moveBtn.innerHTML = '<span>📍</span> Переместить';
    
    const propsBtn = document.createElement('button');
    propsBtn.className = 'ctx-btn';
    propsBtn.innerHTML = '<span>⚙️</span> Свойства';
    
    const delBtn = document.createElement('button');
    delBtn.className = 'ctx-btn danger';
    delBtn.innerHTML = '<span>🗑️</span> Удалить';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'ctx-btn cancel';
    cancelBtn.innerHTML = '<span>✖</span> Отмена';

    ctxMenu.appendChild(header);
    ctxMenu.appendChild(moveBtn);
    ctxMenu.appendChild(propsBtn);
    ctxMenu.appendChild(delBtn);
    ctxMenu.appendChild(cancelBtn);
    document.body.appendChild(ctxMenu);

    window.showContextMenu = function(x, y, onMove, onDelete) {
        // Position at mouse cursor but keep it within viewport
        const menuWidth = 160; // approximate width
        const menuHeight = 150; // approximate height
        
        let posX = x;
        let posY = y;
        
        // Adjust if it goes off-screen
        if (posX + menuWidth > window.innerWidth) posX = window.innerWidth - menuWidth;
        if (posY + menuHeight > window.innerHeight) posY = window.innerHeight - menuHeight;
        
        ctxMenu.style.left = posX + 'px';
        ctxMenu.style.top = posY + 'px';
        // Remove center transform so left/top absolute works correctly
        ctxMenu.style.transform = 'none'; 
        ctxMenu.classList.add('visible');
        
        // Focus first button for accessibility
        setTimeout(() => moveBtn.focus(), 50);
        
        moveBtn.onclick = () => {
            window.hideContextMenu();
            if (onMove) onMove();
        };
        delBtn.onclick = () => {
            if (confirm('Вы уверены, что хотите удалить этот объект?')) {
                window.hideContextMenu();
                if (onDelete) onDelete();
            }
        };
        propsBtn.onclick = () => {
            window.hideContextMenu();
            log('Свойства объекта (в разработке)', 'info');
        };
        cancelBtn.onclick = () => {
            window.hideContextMenu();
        };
    };

    window.hideContextMenu = function() {
        ctxMenu.classList.remove('visible');
    };

    // Close menu on outside click or Escape
    document.addEventListener('mousedown', (e) => {
        if (ctxMenu.classList.contains('visible') && !ctxMenu.contains(e.target)) {
            window.hideContextMenu();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ctxMenu.classList.contains('visible')) {
            window.hideContextMenu();
        }
    });

    // Tab Switching
    window.switchTab = function(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => btn.getAttribute('onclick').includes(tabId));
        if (activeBtn) activeBtn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        // Trigger resize for editor if needed
        if (tabId === 'editor-tab' && callbacks.onEditorResize) {
            callbacks.onEditorResize();
        }
    };

    // Camera Mode Switching
    window.setCameraMode = function(mode) {
        window.cameraMode = mode;
        // Visual feedback for buttons
        const buttons = document.querySelectorAll('.camera-controls button');
        buttons.forEach(btn => {
            const btnText = btn.textContent.toLowerCase();
            const isActive = (mode === 'drone' && btnText.includes('chase')) ||
                             (mode === 'fpv' && btnText.includes('fpv')) ||
                             (mode === 'free' && btnText.includes('свободная')) ||
                             (mode === 'ground' && btnText.includes('земля'));
            
            if (isActive) {
                btn.style.background = '#38bdf8';
                btn.style.color = '#020617';
            } else {
                btn.style.background = '';
                btn.style.color = '';
            }
        });
        log(`Камера: ${mode.toUpperCase()}`, 'info');
    };
    
    // Set default camera mode
    window.setCameraMode('drone');

    // Button Event Listeners
    if (runBtn) runBtn.addEventListener('click', callbacks.onRun);
    if (stopBtn) stopBtn.addEventListener('click', callbacks.onStop);
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.addEventListener('click', callbacks.onRestart);

    // File Selector
    const fileSelector = document.getElementById('file-selector');
    if (fileSelector) {
        loadFileList(fileSelector);
        fileSelector.addEventListener('change', async (e) => {
            const path = e.target.value;
            if (!path) return;
            callbacks.onFileSelect(path);
        });
    }

    // Local File Input
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => callbacks.onLocalFileLoad(file.name, e.target.result);
            reader.readAsText(file);
        });
    }

    // Initialize Scene Controls
    createSceneControls(callbacks);
}

function createSceneControls(callbacks) {
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

async function loadFileList(selector) {
    try {
        const res = await fetch('/api/files');
        const files = await res.json();
        selector.innerHTML = '<option value="">Выберите пример...</option>' + 
            files.map(f => `<option value="${f}">${f}</option>`).join('');
    } catch (e) {
        console.error('Failed to load files', e);
        log('Failed to load files list', 'error');
    }
}
