import type { UICallbacks } from './index.js';

export function initSidebar(callbacks: UICallbacks) {
    const panels = document.querySelector('.sidebar-panels') as HTMLElement | null;
    const resizer = document.getElementById('sidebar-resizer') as HTMLElement | null;
    if (!panels || !resizer) return;

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

    const syncSidebarMode = (panelId: string | null) => {
        panels.classList.toggle('is-fullscreen', panelId === 'settings-panel' && panels.style.width !== '0px');
    };

    (window as any).openPanel = function(panelId: string) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        const isAlreadyActive = panel.classList.contains('active');

        document.querySelectorAll('.sidebar-panel').forEach((p) => p.classList.remove('active'));
        document.querySelectorAll('.sidebar-tab-btn').forEach((b) => b.classList.remove('active'));

        if (isAlreadyActive && panels.style.width !== '0px') {
            panels.style.width = '0px';
            syncSidebarCollapsedState();
            syncSidebarMode(null);
            refreshViewportLayout();
            return;
        }

        panels.style.width = panelId === 'settings-panel' ? '100%' : (localStorage.getItem('sidebar-width') || '450px');
        syncSidebarCollapsedState();
        syncSidebarMode(panelId);
        panel.classList.add('active');

        const buttons = document.querySelectorAll('.sidebar-tab-btn');
        buttons.forEach((btn) => {
            if (btn.getAttribute('onclick')?.includes(`'${panelId}'`)) {
                btn.classList.add('active');
            }
        });

        if (panelId === 'editor-panel' && callbacks.onEditorResize) {
            setTimeout(callbacks.onEditorResize, 350);
        }
        refreshViewportLayout();
    };

    (window as any).closePanel = function() {
        panels.style.width = '0px';
        syncSidebarCollapsedState();
        syncSidebarMode(null);
        document.querySelectorAll('.sidebar-tab-btn').forEach((b) => b.classList.remove('active'));
        refreshViewportLayout();
    };

    resizer.addEventListener('mousedown', () => {
        isResizing = true;
        resizer.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = e.clientX - 50;
        if (newWidth > 200 && newWidth < window.innerWidth * 0.8) {
            panels.style.width = `${newWidth}px`;
            localStorage.setItem('sidebar-width', `${newWidth}px`);
            syncSidebarCollapsedState();
            syncSidebarMode(document.querySelector('.sidebar-panel.active')?.id ?? null);
            if (callbacks.onEditorResize) callbacks.onEditorResize();
            refreshViewportLayout();
        }
    });

    window.addEventListener('mouseup', () => {
        if (!isResizing) return;
        isResizing = false;
        resizer.classList.remove('dragging');
        document.body.style.cursor = '';
    });

    (window as any).switchTab = (window as any).openPanel;
    syncSidebarCollapsedState();
    syncSidebarMode(document.querySelector('.sidebar-panel.active')?.id ?? null);
}
