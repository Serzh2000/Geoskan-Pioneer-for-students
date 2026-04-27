/**
 * Модуль управления роем (Менеджер дронов) в UI.
 * Позволяет переключаться между различными дронами в симуляции,
 * добавлять новые дроны на сцену со случайным смещением, а также
 * удалять дроны из симуляции (если их больше одного).
 * Сохраняет и восстанавливает скрипты в редакторе при переключении.
 */
import { log } from '../shared/logging/logger.js';
import { drones, createDroneState, currentDroneId, setCurrentDrone } from '../core/state.js';
import { getEditorValue, setEditorValue } from '../editor/index.js';

export function initDroneManager(onSceneUpdate?: () => void) {
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
        if (onSceneUpdate) onSceneUpdate();
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
        if (onSceneUpdate) onSceneUpdate();
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
            if (onSceneUpdate) onSceneUpdate();
            log(`Deleted drone: ${id}`);
        }
    });

    updateList();
}
