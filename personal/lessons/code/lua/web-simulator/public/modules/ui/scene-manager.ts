import { UICallbacks } from './index.js';
import {
    DEFAULT_APRILTAG_DICTIONARY,
    DEFAULT_ARUCO_DICTIONARY,
    MARKER_DICTIONARY_OPTIONS
} from '../environment/obstacles/marker-dictionaries.js';
import type { MarkerMapOptions } from '../environment/obstacles.js';

export function initSceneManager(callbacks: UICallbacks) {
    if (!callbacks.sceneManager) return;

    const listEl = document.getElementById('scene-object-list');
    const detailsEl = document.getElementById('scene-object-details');
    const addTypeEl = document.getElementById('scene-add-type') as HTMLSelectElement | null;
    const addDictionaryEl = document.getElementById('scene-add-dictionary') as HTMLSelectElement | null;
    const addValueEl = document.getElementById('scene-add-value') as HTMLInputElement | null;
    const addMapSettingsEl = document.getElementById('scene-add-map-settings') as HTMLDivElement | null;
    const addMapSummaryEl = document.getElementById('scene-add-map-summary') as HTMLDivElement | null;
    const addMapRowsEl = document.getElementById('scene-add-map-rows') as HTMLInputElement | null;
    const addMapColumnsEl = document.getElementById('scene-add-map-columns') as HTMLInputElement | null;
    const addMapStartIdEl = document.getElementById('scene-add-map-start-id') as HTMLInputElement | null;
    const addMapIdStepEl = document.getElementById('scene-add-map-id-step') as HTMLInputElement | null;
    const addMapMarkerSizeEl = document.getElementById('scene-add-map-marker-size') as HTMLInputElement | null;
    const addMapRotationEl = document.getElementById('scene-add-map-rotation') as HTMLInputElement | null;
    const addMapGapXEl = document.getElementById('scene-add-map-gap-x') as HTMLInputElement | null;
    const addMapGapYEl = document.getElementById('scene-add-map-gap-y') as HTMLInputElement | null;
    const addMapTraversalEl = document.getElementById('scene-add-map-traversal') as HTMLSelectElement | null;
    const addMapStartCornerEl = document.getElementById('scene-add-map-start-corner') as HTMLSelectElement | null;
    const addMapAnchorEl = document.getElementById('scene-add-map-anchor') as HTMLSelectElement | null;
    const addMapSnakeEl = document.getElementById('scene-add-map-snake') as HTMLInputElement | null;
    const addPointsEl = document.getElementById('scene-add-points') as HTMLTextAreaElement | null;
    const addBtn = document.getElementById('scene-add-btn');
    const presetTypeEl = document.getElementById('scene-preset-type') as HTMLSelectElement | null;
    const presetBtn = document.getElementById('scene-preset-btn');
    const selectedDictionaryEl = document.getElementById('scene-selected-dictionary') as HTMLSelectElement | null;
    const selectedValueEl = document.getElementById('scene-selected-value') as HTMLInputElement | null;
    const selectedPointsEl = document.getElementById('scene-selected-points') as HTMLTextAreaElement | null;
    const applyMetaBtn = document.getElementById('scene-apply-meta-btn');
    const appendPointBtn = document.getElementById('scene-append-point-btn');
    const deleteBtn = document.getElementById('scene-delete-btn');
    const resetDroneBtn = document.getElementById('scene-drone-origin-btn');
    const modeTranslateBtn = document.getElementById('scene-mode-translate');
    const modeRotateBtn = document.getElementById('scene-mode-rotate');
    const modeScaleBtn = document.getElementById('scene-mode-scale');

    let lastSelectedId: string | null = null;

    const format = (v: number) => Number.isFinite(v) ? v.toFixed(2) : 'NaN';
    const getMarkerMode = (type: string | undefined | null) => (type || '').toLowerCase().includes('april') ? 'apriltag' : 'aruco';
    const mapInputs = [
        addMapRowsEl,
        addMapColumnsEl,
        addMapStartIdEl,
        addMapIdStepEl,
        addMapMarkerSizeEl,
        addMapRotationEl,
        addMapGapXEl,
        addMapGapYEl,
        addMapTraversalEl,
        addMapStartCornerEl,
        addMapAnchorEl,
        addMapSnakeEl
    ].filter(Boolean) as Array<HTMLInputElement | HTMLSelectElement>;

    const clampInt = (value: string | undefined, fallback: number, min: number, max: number) => {
        const parsed = Number.parseInt(value || '', 10);
        if (!Number.isFinite(parsed)) return fallback;
        return Math.min(Math.max(parsed, min), max);
    };
    const clampNumber = (value: string | undefined, fallback: number, min: number, max: number) => {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return fallback;
        return Math.min(Math.max(parsed, min), max);
    };

    const fillDictionarySelect = (selectEl: HTMLSelectElement | null, mode: 'aruco' | 'apriltag', value?: string) => {
        if (!selectEl) return;
        const options = MARKER_DICTIONARY_OPTIONS[mode];
        selectEl.innerHTML = '';
        for (const option of options) {
            const opt = document.createElement('option');
            opt.value = option.id;
            opt.textContent = option.label;
            selectEl.appendChild(opt);
        }
        const fallback = mode === 'apriltag' ? DEFAULT_APRILTAG_DICTIONARY : DEFAULT_ARUCO_DICTIONARY;
        selectEl.value = value && options.some((option) => option.id === value) ? value : fallback;
    };

    const isEditorFocused = () => {
        const active = document.activeElement;
        return active === addValueEl
            || active === addPointsEl
            || active === addDictionaryEl
            || mapInputs.includes(active as HTMLInputElement | HTMLSelectElement)
            || active === selectedValueEl
            || active === selectedDictionaryEl
            || active === selectedPointsEl;
    };

    const isMarkerMapType = (type: string) => type === 'aruco-map' || type === 'apriltag-map';
    const isSingleMarkerType = (type: string) => type === 'aruco' || type === 'apriltag';
    const isValueInputType = (type: string) => isSingleMarkerType(type) || type === 'start-position';
    const readAddMarkerMapOptions = (): MarkerMapOptions => ({
        rows: clampInt(addMapRowsEl?.value, 5, 1, 20),
        columns: clampInt(addMapColumnsEl?.value, 5, 1, 20),
        startId: clampInt(addMapStartIdEl?.value, 0, 0, 100000),
        idStep: clampInt(addMapIdStepEl?.value, 1, 1, 1000),
        markerSize: clampNumber(addMapMarkerSizeEl?.value, 1.05, 0.2, 5),
        rotationDeg: clampNumber(addMapRotationEl?.value, 0, -180, 180),
        gapX: clampNumber(addMapGapXEl?.value, 0.2, 0, 10),
        gapY: clampNumber(addMapGapYEl?.value, 0.2, 0, 10),
        traversal: addMapTraversalEl?.value === 'column-major' ? 'column-major' : 'row-major',
        startCorner: (
            addMapStartCornerEl?.value === 'top-right'
            || addMapStartCornerEl?.value === 'bottom-left'
            || addMapStartCornerEl?.value === 'bottom-right'
        ) ? addMapStartCornerEl.value : 'top-left',
        anchor: (
            addMapAnchorEl?.value === 'top-left'
            || addMapAnchorEl?.value === 'top-right'
            || addMapAnchorEl?.value === 'bottom-left'
            || addMapAnchorEl?.value === 'bottom-right'
            || addMapAnchorEl?.value === 'start'
        ) ? addMapAnchorEl.value : 'center',
        snake: !!addMapSnakeEl?.checked
    });

    const updateMapSummary = () => {
        if (!addMapSummaryEl) return;
        const options = readAddMarkerMapOptions();
        const total = options.rows! * options.columns!;
        const firstId = options.startId!;
        const lastId = firstId + Math.max(0, total - 1) * options.idStep!;
        const traversalLabel = options.traversal === 'column-major' ? 'по столбцам' : 'по строкам';
        const cornerLabelMap = {
            'top-left': 'сверху слева',
            'top-right': 'сверху справа',
            'bottom-left': 'снизу слева',
            'bottom-right': 'снизу справа'
        } as const;
        addMapSummaryEl.textContent =
            `${options.rows} x ${options.columns}, ID ${firstId}-${lastId}, ${traversalLabel}, `
            + `старт ${cornerLabelMap[options.startCorner as keyof typeof cornerLabelMap]}`
            + `${options.snake ? ', змейкой' : ''}`;
    };

    const updateAddControlsState = () => {
        if (!addTypeEl || !addValueEl || !addPointsEl || !addDictionaryEl) return;
        const type = addTypeEl.value;
        const isSingleMarker = isSingleMarkerType(type);
        const needsValueInput = isValueInputType(type);
        const isMarkerMap = isMarkerMapType(type);
        const isMarker = isSingleMarker || isMarkerMap;
        const isPath = type === 'road' || type === 'rail';
        if (isMarker) fillDictionarySelect(addDictionaryEl, getMarkerMode(type), addDictionaryEl.value);
        addDictionaryEl.disabled = !isMarker;
        addDictionaryEl.style.display = isMarker ? 'block' : 'none';
        addValueEl.disabled = !needsValueInput;
        addValueEl.style.display = needsValueInput ? 'block' : 'none';
        addPointsEl.disabled = !isPath;
        addValueEl.placeholder = isSingleMarker
            ? 'ID маркера'
            : type === 'start-position'
                ? 'Номер стартовой позиции'
                : 'Только для объектов с номером';
        addPointsEl.placeholder = isPath
            ? 'Каждая строка: X, Y, Z\n0, 0, 0\n6, 0, 0\n10, 4, 0'
            : 'Только для дорог и путей';
        if (addMapSettingsEl) addMapSettingsEl.classList.toggle('visible', isMarkerMap);
        mapInputs.forEach((input) => {
            input.disabled = !isMarkerMap;
        });
        updateMapSummary();
    };

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
            if (selectedDictionaryEl) selectedDictionaryEl.value = '';
            if (selectedValueEl) selectedValueEl.value = '';
            if (selectedPointsEl) selectedPointsEl.value = '';
            return;
        }

        const detailLines = [
            `Тип: ${selected.sceneType}`,
            `Имя: ${selected.name}`,
            `Перемещаемый: ${selected.draggable ? 'да' : 'нет'}`,
            `Позиция: ${format(selected.position.x)}, ${format(selected.position.y)}, ${format(selected.position.z)}`,
            `Поворот: ${format(selected.rotation.x)}, ${format(selected.rotation.y)}, ${format(selected.rotation.z)}`,
            `Масштаб: ${format(selected.scale.x)}, ${format(selected.scale.y)}, ${format(selected.scale.z)}`
        ];
        if (selected.metaLines?.length) detailLines.push(...selected.metaLines);
        detailsEl.textContent = detailLines.join('\n');

        const selectionChanged = lastSelectedId !== selected.id;
        if (selectionChanged || !isEditorFocused()) {
            if (selectedDictionaryEl && selected.supportsMarkerDictionary) {
                fillDictionarySelect(
                    selectedDictionaryEl,
                    getMarkerMode(selected.markerKind || selected.sceneType),
                    selected.markerDictionary
                );
            } else if (selectedDictionaryEl) {
                selectedDictionaryEl.innerHTML = '<option value="">Словарь маркера</option>';
                selectedDictionaryEl.value = '';
            }
            if (selectedValueEl) selectedValueEl.value = selected.value || '';
            if (selectedPointsEl) selectedPointsEl.value = selected.pointsText || '';
        }
        lastSelectedId = selected.id;

        if (selectedDictionaryEl) {
            const isMarkerDictionaryEditable = !!selected.supportsMarkerDictionary;
            selectedDictionaryEl.disabled = !isMarkerDictionaryEditable;
            selectedDictionaryEl.style.display = isMarkerDictionaryEditable ? 'block' : 'none';
        }
        if (selectedValueEl) {
            selectedValueEl.disabled = !selected.supportsValue;
            selectedValueEl.placeholder = selected.supportsValue ? 'Значение маркера' : 'У выбранного объекта нет значения';
            selectedValueEl.style.display = selected.supportsValue ? 'block' : 'none';
        }
        if (selectedPointsEl) {
            selectedPointsEl.disabled = !selected.supportsPoints;
            selectedPointsEl.placeholder = selected.supportsPoints
                ? 'Каждая строка: X, Y, Z'
                : 'Маршрут можно редактировать только у дорог и рельс';
            selectedPointsEl.style.display = selected.supportsPoints ? 'block' : 'none';
        }
        if (appendPointBtn) appendPointBtn.toggleAttribute('disabled', !selected.supportsPoints);
    };

    if (addTypeEl) {
        addTypeEl.addEventListener('change', updateAddControlsState);
        updateAddControlsState();
    }
    mapInputs.forEach((input) => {
        input.addEventListener('input', updateMapSummary);
        input.addEventListener('change', updateMapSummary);
    });

    if (addBtn && addTypeEl) {
        addBtn.addEventListener('click', () => {
            const type = addTypeEl.value;
            callbacks.sceneManager && callbacks.sceneManager.add(addTypeEl.value, {
                markerDictionary: (isSingleMarkerType(type) || isMarkerMapType(type)) ? addDictionaryEl?.value || undefined : undefined,
                value: isValueInputType(type) ? addValueEl?.value.trim() || undefined : undefined,
                pointsText: addPointsEl?.value.trim() || undefined,
                markerMap: isMarkerMapType(type) ? readAddMarkerMapOptions() : undefined
            });
            render();
        });
    }

    if (presetBtn && presetTypeEl) {
        presetBtn.addEventListener('click', () => {
            callbacks.sceneManager && callbacks.sceneManager.add(presetTypeEl.value);
            render();
        });
    }

    if (applyMetaBtn) {
        applyMetaBtn.addEventListener('click', () => {
            callbacks.sceneManager && callbacks.sceneManager.updateSelected({
                markerDictionary: selectedDictionaryEl?.value || undefined,
                value: selectedValueEl?.value.trim(),
                pointsText: selectedPointsEl?.value.trim()
            });
            render();
        });
    }

    if (appendPointBtn) {
        appendPointBtn.addEventListener('click', () => {
            callbacks.sceneManager && callbacks.sceneManager.appendPoint();
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
