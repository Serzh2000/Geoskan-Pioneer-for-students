import { createContextMenuDom } from './context-menu-dom.js';

type MenuCallbacks = {
    onTransform: (mode: string) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onShowCoords?: () => void;
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

    const { style, menu, header, toolbar, toolbarTitle, toolbarActions } = createContextMenuDom();
    document.head.appendChild(style);

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
        if (callbacks.onShowCoords) {
            addButton('Координаты', '🎯', () => callbacks.onShowCoords && callbacks.onShowCoords());
        }
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

    window.showContextMenu = (x: number, y: number, onTransform: (mode: string) => void, onDelete: () => void, onDuplicate: () => void, onShowCoords?: () => void, onResetOrigin?: () => void) => {
        callbacks = { onTransform, onDelete, onDuplicate, onShowCoords, onResetOrigin };
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
