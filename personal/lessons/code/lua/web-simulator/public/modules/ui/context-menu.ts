import { log } from './logger.js';

type MenuCallbacks = {
    onTransform: (mode: string) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onResetOrigin?: () => void;
};

type ObjectToolPanelCallbacks = {
    title: string;
    activeMode?: string | null;
    onTransform: (mode: string) => void;
    rotationStepDeg: number;
    onSetRotationStep: (step: number) => void;
    onRotateStep: (axis: 'x' | 'y' | 'z', direction: 1 | -1) => void;
    onResetTransform: () => void;
    onExit: () => void;
};

let callbacks: MenuCallbacks = {
    onTransform: () => {},
    onDelete: () => {},
    onDuplicate: () => {}
};

let toolPanelCallbacks: ObjectToolPanelCallbacks = {
    title: '',
    activeMode: null,
    onTransform: () => {},
    rotationStepDeg: 15,
    onSetRotationStep: () => {},
    onRotateStep: () => {},
    onResetTransform: () => {},
    onExit: () => {}
};

export function initContextMenu() {
    const prevMenu = document.getElementById('object-context-menu');
    if (prevMenu) prevMenu.remove();
    const prevToolPanel = document.getElementById('transform-toolbar');
    if (prevToolPanel) prevToolPanel.remove();
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
        #transform-toolbar {
            position: fixed;
            left: 50%;
            bottom: 24px;
            transform: translateX(-50%) translateY(12px);
            min-width: 320px;
            max-width: min(92vw, 560px);
            padding: 10px 12px;
            border: 1px solid rgba(56, 189, 248, 0.2);
            border-radius: 16px;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.9));
            box-shadow: 0 18px 40px rgba(2, 6, 23, 0.45);
            backdrop-filter: blur(14px);
            display: none;
            flex-direction: column;
            gap: 10px;
            z-index: 2100;
            opacity: 0;
            transition: opacity 0.18s ease, transform 0.18s ease;
        }
        #transform-toolbar.visible {
            display: flex;
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        #transform-toolbar .transform-toolbar-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        #transform-toolbar .transform-toolbar-title {
            font-size: 13px;
            font-weight: 600;
            color: #e2e8f0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        #transform-toolbar .transform-toolbar-hint {
            font-size: 11px;
            color: #94a3b8;
            white-space: nowrap;
        }
        #transform-toolbar .transform-toolbar-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        #transform-toolbar .transform-btn {
            border: 1px solid rgba(148, 163, 184, 0.28);
            background: rgba(30, 41, 59, 0.9);
            color: #cbd5e1;
            border-radius: 12px;
            padding: 9px 12px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }
        #transform-toolbar .transform-btn:hover,
        #transform-toolbar .transform-btn:focus {
            outline: none;
            border-color: rgba(56, 189, 248, 0.55);
            color: #f8fafc;
            background: rgba(30, 41, 59, 1);
            transform: translateY(-1px);
        }
        #transform-toolbar .transform-btn.active {
            border-color: rgba(56, 189, 248, 0.65);
            background: rgba(56, 189, 248, 0.16);
            color: #38bdf8;
            box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.12);
        }
        #transform-toolbar .transform-btn.exit {
            margin-left: auto;
            color: #fca5a5;
            border-color: rgba(248, 113, 113, 0.28);
            background: rgba(69, 10, 10, 0.22);
        }
        #transform-toolbar .transform-toolbar-subtitle {
            width: 100%;
            font-size: 11px;
            color: #94a3b8;
            margin-top: 2px;
        }
        #transform-toolbar .transform-toolbar-separator {
            width: 1px;
            align-self: stretch;
            background: rgba(148, 163, 184, 0.2);
            margin: 0 2px;
        }
        #transform-toolbar .transform-step-group {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 6px;
            border-radius: 12px;
            background: rgba(15, 23, 42, 0.42);
            border: 1px solid rgba(148, 163, 184, 0.18);
        }
        #transform-toolbar .transform-step-label {
            font-size: 11px;
            color: #94a3b8;
            margin-right: 2px;
        }
        #transform-toolbar .transform-step-btn {
            min-width: 44px;
            padding: 7px 9px;
            font-size: 12px;
        }
        #transform-toolbar .transform-axis-btn {
            min-width: 58px;
            padding: 8px 10px;
        }
        #transform-toolbar .transform-reset-btn {
            width: 100%;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'object-context-menu';
    menu.setAttribute('role', 'menu');

    const toolbar = document.createElement('div');
    toolbar.id = 'transform-toolbar';
    toolbar.setAttribute('role', 'toolbar');

    const toolbarTop = document.createElement('div');
    toolbarTop.className = 'transform-toolbar-top';
    const toolbarTitle = document.createElement('div');
    toolbarTitle.className = 'transform-toolbar-title';
    const toolbarHint = document.createElement('div');
    toolbarHint.className = 'transform-toolbar-hint';
    toolbarHint.textContent = 'Esc: снять выделение';
    toolbarTop.appendChild(toolbarTitle);
    toolbarTop.appendChild(toolbarHint);

    const toolbarActions = document.createElement('div');
    toolbarActions.className = 'transform-toolbar-actions';

    toolbar.appendChild(toolbarTop);
    toolbar.appendChild(toolbarActions);

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
        addButton('Наклонить', '🔄', () => callbacks.onTransform('rotate'));
        addButton('Масштаб', '📏', () => callbacks.onTransform('scale'));
        addButton('Дублировать', '📋', () => callbacks.onDuplicate());
        if (callbacks.onResetOrigin) {
            addButton('Вернуть в начало', '🏠', () => callbacks.onResetOrigin && callbacks.onResetOrigin());
        }
        addButton('Удалить', '🗑️', () => callbacks.onDelete(), 'danger');
        addButton('Отмена', '✖', () => {}, 'cancel');
    };

    const hide = () => {
        menu.classList.remove('visible');
    };

    const setToolbarMode = (mode?: string | null) => {
        toolPanelCallbacks.activeMode = mode || null;
        const buttons = toolbar.querySelectorAll<HTMLButtonElement>('[data-transform-mode]');
        buttons.forEach((button) => {
            button.classList.toggle('active', button.dataset.transformMode === toolPanelCallbacks.activeMode);
        });
        const rotateSections = toolbar.querySelectorAll<HTMLElement>('[data-rotate-only]');
        rotateSections.forEach((section) => {
            section.style.display = toolPanelCallbacks.activeMode === 'rotate' ? '' : 'none';
        });
    };

    const hideToolbar = () => {
        toolbar.classList.remove('visible');
    };

    const setRotationStep = (step: number) => {
        toolPanelCallbacks.rotationStepDeg = step;
        const buttons = toolbar.querySelectorAll<HTMLButtonElement>('[data-rotation-step]');
        buttons.forEach((button) => {
            button.classList.toggle('active', Number(button.dataset.rotationStep) === step);
        });
    };

    const renderToolbar = () => {
        toolbarTitle.textContent = toolPanelCallbacks.title || 'Инструменты объекта';
        toolbarActions.innerHTML = '';

        const addToolbarButton = (label: string, mode: string | null, action: () => void, extraClass = '') => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `transform-btn ${extraClass}`.trim();
            button.textContent = label;
            if (mode) button.dataset.transformMode = mode;
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                action();
            });
            toolbarActions.appendChild(button);
            return button;
        };

        addToolbarButton('Перемещение', 'translate', () => toolPanelCallbacks.onTransform('translate'));
        addToolbarButton('Поворот', 'rotate', () => toolPanelCallbacks.onTransform('rotate'));
        addToolbarButton('Масштаб', 'scale', () => toolPanelCallbacks.onTransform('scale'));

        const separator = document.createElement('div');
        separator.className = 'transform-toolbar-separator';
        toolbarActions.appendChild(separator);

        const stepGroup = document.createElement('div');
        stepGroup.className = 'transform-step-group';
        stepGroup.setAttribute('data-rotate-only', 'true');

        const stepLabel = document.createElement('span');
        stepLabel.className = 'transform-step-label';
        stepLabel.textContent = 'Шаг';
        stepGroup.appendChild(stepLabel);

        [5, 15, 45].forEach((step) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'transform-btn transform-step-btn';
            button.textContent = `${step}°`;
            button.dataset.rotationStep = String(step);
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                toolPanelCallbacks.onSetRotationStep(step);
            });
            stepGroup.appendChild(button);
        });
        toolbarActions.appendChild(stepGroup);

        const axisGroup = document.createElement('div');
        axisGroup.className = 'transform-toolbar-actions';
        axisGroup.setAttribute('data-rotate-only', 'true');
        axisGroup.style.width = '100%';

        const subtitle = document.createElement('div');
        subtitle.className = 'transform-toolbar-subtitle';
        subtitle.textContent = 'Быстрый поворот по осям X / Y / Z';
        axisGroup.appendChild(subtitle);

        const axisButtons = [
            { label: 'X -', axis: 'x', direction: -1 },
            { label: 'X +', axis: 'x', direction: 1 },
            { label: 'Y -', axis: 'y', direction: -1 },
            { label: 'Y +', axis: 'y', direction: 1 },
            { label: 'Z -', axis: 'z', direction: -1 },
            { label: 'Z +', axis: 'z', direction: 1 }
        ] as const;

        axisButtons.forEach(({ label, axis, direction }) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'transform-btn transform-axis-btn';
            button.textContent = label;
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                toolPanelCallbacks.onRotateStep(axis, direction);
            });
            axisGroup.appendChild(button);
        });

        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.className = 'transform-btn transform-reset-btn';
        resetButton.textContent = 'Вернуть в исходное состояние';
        resetButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            toolPanelCallbacks.onResetTransform();
        });
        axisGroup.appendChild(resetButton);
        toolbarActions.appendChild(axisGroup);

        addToolbarButton('Снять выделение', null, () => toolPanelCallbacks.onExit(), 'exit');

        setToolbarMode(toolPanelCallbacks.activeMode);
        setRotationStep(toolPanelCallbacks.rotationStepDeg);
    };

    const show = (x: number, y: number) => {
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
    document.body.appendChild(toolbar);

    window.showContextMenu = (x: number, y: number, onTransform: (mode: string) => void, onDelete: () => void, onDuplicate: () => void, onResetOrigin?: () => void) => {
        callbacks = { onTransform, onDelete, onDuplicate, onResetOrigin };
        show(x, y);
    };

    window.hideContextMenu = hide;
    (window as any).showGizmoToolbar = (
        title: string,
        activeMode: string | null | undefined,
        rotationStepDeg: number,
        onTransform: (mode: string) => void,
        onSetRotationStep: (step: number) => void,
        onRotateStep: (axis: 'x' | 'y' | 'z', direction: 1 | -1) => void,
        onResetTransform: () => void,
        onExit: () => void
    ) => {
        toolPanelCallbacks = {
            title,
            activeMode: activeMode || null,
            onTransform,
            rotationStepDeg,
            onSetRotationStep,
            onRotateStep,
            onResetTransform,
            onExit
        };
        renderToolbar();
        toolbar.classList.add('visible');
    };
    (window as any).hideGizmoToolbar = hideToolbar;
    (window as any).setGizmoToolbarMode = setToolbarMode;
    (window as any).setTransformToolbarRotationStep = setRotationStep;

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
