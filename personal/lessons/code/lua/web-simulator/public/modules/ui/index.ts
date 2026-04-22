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
import type { MarkerMapOptions } from '../environment/obstacles.js';

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
            supportsValue?: boolean;
            supportsMarkerDictionary?: boolean;
            supportsPoints?: boolean;
            floors?: number;
            markerKind?: string;
            markerDictionary?: string;
            value?: string;
            pointsText?: string;
            metaLines?: string[];
        }>;
        select: (id: string) => boolean;
        remove: (id: string) => boolean;
        add: (
            type: string,
            options?: { value?: string; markerDictionary?: string; pointsText?: string; floors?: number; markerMap?: MarkerMapOptions }
        ) => void;
        updateSelected: (params: { value?: string; markerDictionary?: string; pointsText?: string; floors?: number }) => boolean;
        appendPoint: () => boolean;
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

    const sceneContainer = document.querySelector('.scene-container') as HTMLElement | null;
    const createNoticeApi = () => {
        if (!sceneContainer) return;
        let notice = document.getElementById('simulation-notice') as HTMLDivElement | null;
        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'simulation-notice';
            notice.className = 'simulation-notice';
            notice.innerHTML = `
                <div class="simulation-notice__title">Предупреждение по таймингам</div>
                <div class="simulation-notice__message"></div>
                <button type="button" class="simulation-notice__close" aria-label="Скрыть">Понятно</button>
            `;
            sceneContainer.appendChild(notice);
        }

        const messageEl = notice.querySelector('.simulation-notice__message') as HTMLDivElement | null;
        const closeBtn = notice.querySelector('.simulation-notice__close') as HTMLButtonElement | null;
        let hideTimer = 0;
        const hideNotice = () => {
            notice?.classList.remove('visible');
        };

        closeBtn?.addEventListener('click', hideNotice);
        (window as any).showSimulationNotice = (message: string, level: 'warn' | 'info' = 'warn') => {
            if (!notice || !messageEl) return;
            window.clearTimeout(hideTimer);
            notice.dataset.level = level;
            messageEl.textContent = message;
            notice.classList.add('visible');
            hideTimer = window.setTimeout(hideNotice, 6500);
        };
    };
    createNoticeApi();

    const applyHudVisibility = (overlayId: string, buttonId: string, storageKey: string, visible: boolean) => {
        const overlay = document.getElementById(overlayId);
        const button = document.getElementById(buttonId) as HTMLButtonElement | null;
        if (!overlay || !button) return;
        overlay.classList.toggle('is-hidden', !visible);
        button.classList.toggle('active', visible);
        button.setAttribute('aria-pressed', visible ? 'true' : 'false');
        localStorage.setItem(storageKey, visible ? '1' : '0');
    };

    const initHudToggle = (overlayId: string, buttonId: string, storageKey: string) => {
        const button = document.getElementById(buttonId) as HTMLButtonElement | null;
        if (!button) return;
        const initialVisible = localStorage.getItem(storageKey) !== '0';
        applyHudVisibility(overlayId, buttonId, storageKey, initialVisible);
        button.addEventListener('click', () => {
            const overlay = document.getElementById(overlayId);
            const visible = overlay ? overlay.classList.contains('is-hidden') : true;
            applyHudVisibility(overlayId, buttonId, storageKey, visible);
        });
    };

    initHudToggle('telemetry-overlay', 'toggle-telemetry-btn', 'hud-telemetry-visible');
    initHudToggle('matrix-overlay', 'toggle-matrix-btn', 'hud-matrix-visible');

    // Scene Object List logic (handled by scene manager)
    const updateObjectList = (objects: any[], selectedId: string | null, onSelect: (id: string) => void) => {
        const objList = document.getElementById('scene-object-list');
        if (objList) {
            objList.innerHTML = '';
            objects.forEach(obj => {
                const item = document.createElement('div');
                item.className = 'scene-object-item' + (selectedId === obj.id ? ' selected' : '');
                
                // Icon based on type
                let icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>';
                if (obj.type === 'gate') icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V3h18v18M3 7h18"/></svg>';
                if (obj.type === 'pylon') icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 22h20L12 2z"/></svg>';
                if (obj.type === 'aruco' || obj.type === 'apriltag') icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M7 7h10v10H7z"/></svg>';
                
                item.innerHTML = `${icon} <span>${obj.name || obj.type}</span>`;
                item.onclick = () => onSelect(obj.id);
                objList.appendChild(item);
            });
        }
    };

    // Sidebar logic
    const panels = document.querySelector('.sidebar-panels') as HTMLElement;
    const resizer = document.getElementById('sidebar-resizer') as HTMLElement;
    let isResizing = false;
    let viewportRefreshFrame = 0;

    const refreshViewportLayout = () => {
        window.cancelAnimationFrame(viewportRefreshFrame);
        viewportRefreshFrame = window.requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'));
            window.setTimeout(() => window.dispatchEvent(new Event('resize')), 180);
            window.setTimeout(() => window.dispatchEvent(new Event('resize')), 360);
        });
    };

    const syncSidebarCollapsedState = () => {
        panels.classList.toggle('is-collapsed', panels.style.width === '0px');
    };

    (window as any).openPanel = function(panelId: string) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        const isAlreadyActive = panel.classList.contains('active');
        
        // Deactivate all
        document.querySelectorAll('.sidebar-panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.sidebar-tab-btn').forEach(b => b.classList.remove('active'));

        if (isAlreadyActive && panels.style.width !== '0px') {
            // Toggle off
            panels.style.width = '0px';
            syncSidebarCollapsedState();
            refreshViewportLayout();
        } else {
            // Toggle on
            panels.style.width = localStorage.getItem('sidebar-width') || '450px';
            syncSidebarCollapsedState();
            panel.classList.add('active');
            
            // Activate button
            const buttons = document.querySelectorAll('.sidebar-tab-btn');
            buttons.forEach(btn => {
                if (btn.getAttribute('onclick')?.includes(`'${panelId}'`)) {
                    btn.classList.add('active');
                }
            });

            if (panelId === 'editor-panel' && callbacks.onEditorResize) {
                setTimeout(callbacks.onEditorResize, 350); // After transition
            }
            refreshViewportLayout();
        }
    };

    (window as any).closePanel = function() {
        panels.style.width = '0px';
        syncSidebarCollapsedState();
        document.querySelectorAll('.sidebar-tab-btn').forEach(b => b.classList.remove('active'));
        refreshViewportLayout();
    };

    // Resizer logic
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        resizer.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = e.clientX - 50; // Sidebar tabs width
        if (newWidth > 200 && newWidth < window.innerWidth * 0.8) {
            panels.style.width = `${newWidth}px`;
            localStorage.setItem('sidebar-width', `${newWidth}px`);
            syncSidebarCollapsedState();
            if (callbacks.onEditorResize) callbacks.onEditorResize();
            refreshViewportLayout();
        }
    });

    window.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove('dragging');
            document.body.style.cursor = '';
        }
    });

    // Replace old tab switching logic
    (window as any).switchTab = (window as any).openPanel;
    syncSidebarCollapsedState();

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

export function updateSceneObjectDetails(obj: any | null) {
    const detailsEl = document.getElementById('scene-object-details');
    const valInput = document.getElementById('scene-selected-value') as HTMLInputElement;
    const ptsInput = document.getElementById('scene-selected-points') as HTMLTextAreaElement;
    const appendBtn = document.getElementById('scene-append-point-btn') as HTMLButtonElement;

    if (!obj) {
        if (detailsEl) detailsEl.innerHTML = 'Выберите объект в списке';
        if (valInput) valInput.style.display = 'none';
        if (ptsInput) ptsInput.style.display = 'none';
        if (appendBtn) appendBtn.style.display = 'none';
        return;
    }

    if (detailsEl) {
        detailsEl.innerHTML = `Тип: ${obj.type}
Имя: ${obj.name || 'Нет'}
Перемещаемый: ${obj.isStatic ? 'нет' : 'да'}
Позиция: ${obj.position.x.toFixed(2)}, ${obj.position.y.toFixed(2)}, ${obj.position.z.toFixed(2)}
Поворот: ${obj.rotation.x.toFixed(2)}, ${obj.rotation.y.toFixed(2)}, ${obj.rotation.z.toFixed(2)}
Масштаб: ${obj.scale.x.toFixed(2)}, ${obj.scale.y.toFixed(2)}, ${obj.scale.z.toFixed(2)}`;
    }

    // Dynamic fields for selected object
    if (obj.type === 'aruco' || obj.type === 'apriltag') {
        if (valInput) {
            valInput.style.display = 'block';
            valInput.value = obj.meta?.value !== undefined ? obj.meta.value : '';
            valInput.placeholder = 'ID маркера';
        }
    } else {
        if (valInput) valInput.style.display = 'none';
    }

    if (obj.type === 'road' || obj.type === 'rail') {
        if (ptsInput) {
            ptsInput.style.display = 'block';
            ptsInput.value = obj.meta?.points ? obj.meta.points.map((p: any) => `${p.x},${p.y},${p.z}`).join('\n') : '';
        }
        if (appendBtn) appendBtn.style.display = 'block';
    } else {
        if (ptsInput) ptsInput.style.display = 'none';
        if (appendBtn) appendBtn.style.display = 'none';
    }
}
