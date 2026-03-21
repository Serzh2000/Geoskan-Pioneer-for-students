import { log } from './logger.js';

type MenuCallbacks = {
    onTransform: (mode: string) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onResetOrigin?: () => void;
};

let callbacks: MenuCallbacks = {
    onTransform: () => {},
    onDelete: () => {},
    onDuplicate: () => {}
};

export function initContextMenu() {
    const prevMenu = document.getElementById('object-context-menu');
    if (prevMenu) prevMenu.remove();
    const prevStyle = document.getElementById('ctx-menu-style');
    if (prevStyle) prevStyle.remove();

    const style = document.createElement('style');
    style.id = 'ctx-menu-style';
    style.textContent = `
        #object-context-menu {
            position: fixed;
            min-width: 170px;
            background: rgba(15, 23, 42, 0.96);
            border: 1px solid #334155;
            border-radius: 10px;
            padding: 6px;
            display: none;
            flex-direction: column;
            gap: 4px;
            z-index: 2000;
            box-shadow: 0 12px 28px rgba(0,0,0,0.45);
            backdrop-filter: blur(8px);
        }
        #object-context-menu.visible {
            display: flex;
        }
        #object-context-menu .ctx-header {
            font-size: 11px;
            color: #94a3b8;
            padding: 6px 10px;
            border-bottom: 1px solid #334155;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        #object-context-menu .ctx-btn {
            background: transparent;
            border: none;
            color: #e2e8f0;
            text-align: left;
            padding: 8px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #object-context-menu .ctx-btn:hover,
        #object-context-menu .ctx-btn:focus {
            background: rgba(56, 189, 248, 0.12);
            color: #38bdf8;
            outline: none;
        }
        #object-context-menu .ctx-btn.danger {
            color: #f87171;
        }
        #object-context-menu .ctx-btn.cancel {
            color: #94a3b8;
            border-top: 1px solid #334155;
            margin-top: 4px;
        }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'object-context-menu';
    menu.setAttribute('role', 'menu');

    const header = document.createElement('div');
    header.className = 'ctx-header';
    header.textContent = 'Действия над объектом';
    menu.appendChild(header);

    const addButton = (label: string, icon: string, action: () => void, className = '') => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `ctx-btn ${className}`.trim();
        button.innerHTML = `<span>${icon}</span><span>${label}</span>`;
        const run = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            log(`[3DDBG] context-menu action "${label}"`, 'info');
            hide();
            action();
        };
        button.addEventListener('pointerdown', run);
        button.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') run(e);
        });
        menu.appendChild(button);
        return button;
    };

    const renderButtons = () => {
        menu.innerHTML = '';
        menu.appendChild(header);
        addButton('Переместить', '📍', () => callbacks.onTransform('translate'));
        addButton('Повернуть', '🔄', () => callbacks.onTransform('rotate'));
        addButton('Масштаб', '📏', () => callbacks.onTransform('scale'));
        addButton('Дублировать', '📋', () => callbacks.onDuplicate());
        if (callbacks.onResetOrigin) {
            addButton('Вернуть в начало', '🏠', () => callbacks.onResetOrigin && callbacks.onResetOrigin());
        }
        addButton('Удалить', '🗑️', () => callbacks.onDelete(), 'danger');
        addButton('Отмена', '✖', () => {}, 'cancel');
    };

    const hide = () => {
        if (menu.classList.contains('visible')) log('[3DDBG] context-menu hide', 'info');
        menu.classList.remove('visible');
    };

    const show = (x: number, y: number) => {
        log(`[3DDBG] context-menu show x=${x} y=${y}`, 'info');
        renderButtons();
        menu.style.left = `${Math.max(0, x)}px`;
        menu.style.top = `${Math.max(0, y)}px`;
        menu.classList.add('visible');
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            menu.style.left = `${Math.max(0, window.innerWidth - rect.width - 6)}px`;
        }
        if (rect.bottom > window.innerHeight) {
            menu.style.top = `${Math.max(0, window.innerHeight - rect.height - 6)}px`;
        }
    };

    menu.addEventListener('pointerdown', (e) => e.stopPropagation());
    menu.addEventListener('mousedown', (e) => e.stopPropagation());
    menu.addEventListener('click', (e) => e.stopPropagation());
    menu.addEventListener('contextmenu', (e) => e.preventDefault());

    document.body.appendChild(menu);

    window.showContextMenu = (x: number, y: number, onTransform: (mode: string) => void, onDelete: () => void, onDuplicate: () => void, onResetOrigin?: () => void) => {
        callbacks = { onTransform, onDelete, onDuplicate, onResetOrigin };
        log('[3DDBG] context-menu callbacks обновлены', 'info');
        show(x, y);
    };

    window.hideContextMenu = hide;

    document.addEventListener('pointerdown', (e: PointerEvent) => {
        const target = e.target as Node | null;
        if (!target) return;
        if (!menu.classList.contains('visible')) return;
        if (menu.contains(target)) return;
        hide();
    }, true);

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape') hide();
    });
}
