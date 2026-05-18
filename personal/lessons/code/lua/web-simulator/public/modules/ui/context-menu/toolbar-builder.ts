import type { ObjectToolPanelCallbacks } from './types.js';

type ToolbarDom = {
    toolbar: HTMLElement;
    toolbarTitle: HTMLElement;
    toolbarActions: HTMLElement;
};

type ToolbarApi = {
    setToolbarMode: (mode?: string | null) => void;
    setRotationStep: (step: number) => void;
};

export function renderContextToolbar(
    dom: ToolbarDom,
    callbacks: ObjectToolPanelCallbacks,
    api: ToolbarApi
) {
    const { toolbar, toolbarTitle, toolbarActions } = dom;
    toolbarTitle.textContent = callbacks.title || 'Инструменты объекта';
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
    };

    addToolbarButton('Перемещение', 'translate', () => callbacks.onTransform('translate'));
    addToolbarButton('Поворот', 'rotate', () => callbacks.onTransform('rotate'));
    addToolbarButton('Масштаб', 'scale', () => callbacks.onTransform('scale'));

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
            callbacks.onSetRotationStep(step);
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
            callbacks.onRotateStep(axis, direction);
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
        callbacks.onResetTransform();
    });
    axisGroup.appendChild(resetButton);
    toolbarActions.appendChild(axisGroup);

    addToolbarButton('Снять выделение', null, () => callbacks.onExit(), 'exit');

    api.setToolbarMode(callbacks.activeMode);
    api.setRotationStep(callbacks.rotationStepDeg);
    toolbar.classList.add('visible');
}
