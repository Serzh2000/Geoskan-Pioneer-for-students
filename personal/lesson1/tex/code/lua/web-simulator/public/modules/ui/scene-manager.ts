/**
 * Модуль управления сценой (Менеджер сцены) в UI.
 * Отображает список объектов на 3D сцене (дроны, препятствия, грузы),
 * позволяет их выделять, удалять, сбрасывать позицию дрона, а также
 * переключать режимы трансформации (перемещение, поворот, масштабирование).
 */
import { log } from './logger.js';
import { UICallbacks } from './index.js';

export function initSceneManager(callbacks: UICallbacks) {
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
        detailsEl.textContent = `Тип: ${selected.sceneType}\nИмя: ${selected.name}\nПеремещаемый: ${selected.draggable ? 'да' : 'нет'}\nПозиция: ${format(selected.position.x)}, ${format(selected.position.y)}, ${format(selected.position.z)}\nПоворот: ${format(selected.rotation.x)}, ${format(selected.rotation.y)}, ${format(selected.rotation.z)}\nМасштаб: ${format(selected.scale.x)}, ${format(selected.scale.y)}, ${format(selected.scale.z)}`;
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
