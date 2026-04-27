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
    const addFloorsWrapEl = document.getElementById('scene-add-floors-wrap') as HTMLLabelElement | null;
    const addFloorsEl = document.getElementById('scene-add-floors') as HTMLInputElement | null;
    const addBuildingSettingsEl = document.getElementById('scene-add-building-settings') as HTMLDivElement | null;
    const addBuildingFloorEl = document.getElementById('scene-add-building-floor') as HTMLInputElement | null;
    const addBuildingFaceEl = document.getElementById('scene-add-building-face') as HTMLSelectElement | null;
    const addBuildingWindowEl = document.getElementById('scene-add-building-window') as HTMLSelectElement | null;
    const addBuildingKindEl = document.getElementById('scene-add-building-kind') as HTMLSelectElement | null;
    const addBuildingIncidentsEl = document.getElementById('scene-add-building-incidents') as HTMLTextAreaElement | null;
    const addBuildingAppendBtn = document.getElementById('scene-add-building-append-btn');
    const addBuildingClearBtn = document.getElementById('scene-add-building-clear-btn');
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
    const selectedFloorsWrapEl = document.getElementById('scene-selected-floors-wrap') as HTMLLabelElement | null;
    const selectedFloorsEl = document.getElementById('scene-selected-floors') as HTMLInputElement | null;
    const selectedBuildingSettingsEl = document.getElementById('scene-selected-building-settings') as HTMLDivElement | null;
    const selectedBuildingFloorEl = document.getElementById('scene-selected-building-floor') as HTMLInputElement | null;
    const selectedBuildingFaceEl = document.getElementById('scene-selected-building-face') as HTMLSelectElement | null;
    const selectedBuildingWindowEl = document.getElementById('scene-selected-building-window') as HTMLSelectElement | null;
    const selectedBuildingKindEl = document.getElementById('scene-selected-building-kind') as HTMLSelectElement | null;
    const selectedBuildingIncidentsEl = document.getElementById('scene-selected-building-incidents') as HTMLTextAreaElement | null;
    const selectedBuildingAppendBtn = document.getElementById('scene-selected-building-append-btn');
    const selectedBuildingClearBtn = document.getElementById('scene-selected-building-clear-btn');
    const selectedPointsEl = document.getElementById('scene-selected-points') as HTMLTextAreaElement | null;
    const applyMetaBtn = document.getElementById('scene-apply-meta-btn');
    const appendPointBtn = document.getElementById('scene-append-point-btn');
    const visualEditBtn = document.getElementById('scene-visual-edit-btn');
    const deleteBtn = document.getElementById('scene-delete-btn');
    const groupBtn = document.getElementById('scene-group-btn');
    const ungroupBtn = document.getElementById('scene-ungroup-btn');
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
    const clampFloors = (value: string | undefined, fallback = 9) => clampInt(value, fallback, 5, 20);
    const clampWindowFloor = (value: string | undefined, maxFloor: number) => clampInt(value, 1, 1, maxFloor);

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
            || active === addFloorsEl
            || active === addBuildingFloorEl
            || active === addBuildingFaceEl
            || active === addBuildingWindowEl
            || active === addBuildingKindEl
            || active === addBuildingIncidentsEl
            || active === addPointsEl
            || active === addDictionaryEl
            || mapInputs.includes(active as HTMLInputElement | HTMLSelectElement)
            || active === selectedValueEl
            || active === selectedFloorsEl
            || active === selectedBuildingFloorEl
            || active === selectedBuildingFaceEl
            || active === selectedBuildingWindowEl
            || active === selectedBuildingKindEl
            || active === selectedBuildingIncidentsEl
            || active === selectedDictionaryEl
            || active === selectedPointsEl;
    };

    const isMarkerMapType = (type: string) => type === 'aruco-map' || type === 'apriltag-map';
    const isSingleMarkerType = (type: string) => type === 'aruco' || type === 'apriltag';
    const isBuildingType = (type: string) => type === 'building';
    const isValueInputType = (type: string) => isSingleMarkerType(type) || type === 'start-position' || type === 'building';
    const normalizeIncidentEntries = (value: string | undefined) => (value || '')
        .split(/\r?\n|;/)
        .map((entry) => entry.trim())
        .filter(Boolean);
    const serializeIncidentEntries = (entries: string[]) => entries.join('\n');
    const getIncidentKey = (entry: string) => {
        const match = entry.match(/^(\d+)\s*:\s*(front|back|перед|зад)\s*:\s*(\d+)/i);
        if (!match) return entry.trim().toLowerCase();
        const faceRaw = match[2].toLowerCase();
        const face = faceRaw === 'перед' ? 'front' : faceRaw === 'зад' ? 'back' : faceRaw;
        return `${match[1]}:${face}:${match[3]}`;
    };
    const syncIncidentValue = (targetEl: HTMLInputElement | null, sourceEl: HTMLTextAreaElement | null) => {
        if (!targetEl || !sourceEl) return;
        targetEl.value = serializeIncidentEntries(normalizeIncidentEntries(sourceEl.value));
    };
    const syncFloorLimit = (floorsEl: HTMLInputElement | null, floorEl: HTMLInputElement | null) => {
        if (!floorsEl || !floorEl) return;
        const maxFloor = clampFloors(floorsEl.value, 9);
        floorsEl.value = String(maxFloor);
        floorEl.max = String(maxFloor);
        floorEl.value = String(clampWindowFloor(floorEl.value, maxFloor));
    };
    const appendIncidentEntry = (
        incidentsEl: HTMLTextAreaElement | null,
        floorsEl: HTMLInputElement | null,
        floorEl: HTMLInputElement | null,
        faceEl: HTMLSelectElement | null,
        windowEl: HTMLSelectElement | null,
        kindEl: HTMLSelectElement | null,
        valueEl: HTMLInputElement | null
    ) => {
        if (!incidentsEl || !floorEl || !faceEl || !windowEl || !kindEl) return;
        const maxFloor = clampFloors(floorsEl?.value, 9);
        const floor = clampWindowFloor(floorEl.value, maxFloor);
        const face = faceEl.value === 'back' ? 'back' : 'front';
        const windowIndex = clampInt(windowEl.value, 1, 1, 3);
        const kind = kindEl.value === 'fire' || kindEl.value === 'thief' ? kindEl.value : 'smoke';
        floorEl.value = String(floor);
        const entry = `${floor}:${face}:${windowIndex}=${kind}`;
        const entries = normalizeIncidentEntries(incidentsEl.value).filter((item) => getIncidentKey(item) !== getIncidentKey(entry));
        entries.push(entry);
        incidentsEl.value = serializeIncidentEntries(entries);
        syncIncidentValue(valueEl, incidentsEl);
    };
    const clearIncidentEntries = (incidentsEl: HTMLTextAreaElement | null, valueEl: HTMLInputElement | null) => {
        if (!incidentsEl) return;
        incidentsEl.value = '';
        syncIncidentValue(valueEl, incidentsEl);
    };
    const setBuildingControlsVisible = (
        visible: boolean,
        floorsWrapEl: HTMLLabelElement | null,
        floorsEl: HTMLInputElement | null,
        settingsEl: HTMLDivElement | null
    ) => {
        if (floorsWrapEl) floorsWrapEl.style.display = visible ? 'flex' : 'none';
        if (floorsEl) floorsEl.disabled = !visible;
        if (settingsEl) settingsEl.classList.toggle('visible', visible);
    };
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
        const isBuilding = isBuildingType(type);
        const isMarker = isSingleMarker || isMarkerMap;
        const isPath = type === 'road' || type === 'rail';
        if (isMarker) fillDictionarySelect(addDictionaryEl, getMarkerMode(type), addDictionaryEl.value);
        addDictionaryEl.disabled = !isMarker;
        addDictionaryEl.style.display = isMarker ? 'block' : 'none';
        addValueEl.disabled = !(needsValueInput && !isBuilding);
        addValueEl.style.display = needsValueInput && !isBuilding ? 'block' : 'none';
        addPointsEl.disabled = !isPath;
        addValueEl.placeholder = isSingleMarker
            ? 'ID маркера'
            : type === 'building'
                ? 'Окна: 3:front:2=smoke; 5:back:1=fire; 7:front:3=thief'
            : type === 'start-position'
                ? 'Номер стартовой позиции'
                : 'Только для объектов с номером';
        addPointsEl.placeholder = isPath
            ? 'Каждая строка: X, Y, Z\n0, 0, 0\n6, 0, 0\n10, 4, 0'
            : 'Только для дорог и путей';
        setBuildingControlsVisible(isBuilding, addFloorsWrapEl, addFloorsEl, addBuildingSettingsEl);
        if (addMapSettingsEl) addMapSettingsEl.classList.toggle('visible', isMarkerMap);
        mapInputs.forEach((input) => {
            input.disabled = !isMarkerMap;
        });
        syncFloorLimit(addFloorsEl, addBuildingFloorEl);
        syncIncidentValue(addValueEl, addBuildingIncidentsEl);
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
            if (selectedFloorsEl) selectedFloorsEl.value = '9';
            if (selectedBuildingIncidentsEl) selectedBuildingIncidentsEl.value = '';
            if (selectedPointsEl) selectedPointsEl.value = '';
            if (visualEditBtn) {
                visualEditBtn.style.display = 'none';
                visualEditBtn.toggleAttribute('disabled', true);
            }
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
            if (selectedFloorsEl) selectedFloorsEl.value = String(clampFloors(String(selected.floors ?? 9), selected.floors ?? 9));
            if (selectedBuildingIncidentsEl) selectedBuildingIncidentsEl.value = selected.value || '';
            if (selectedPointsEl) selectedPointsEl.value = selected.pointsText || '';
        }
        lastSelectedId = selected.id;

        const isBuildingSelected = selected.sceneType === 'Многоэтажка';
        const isVisualEditing = callbacks.sceneManager?.isLinearEditingActive(selected.id) || false;
        const isAnyLinearEditing = callbacks.sceneManager?.isLinearEditingActive() || false;
        if (selectedDictionaryEl) {
            const isMarkerDictionaryEditable = !!selected.supportsMarkerDictionary;
            selectedDictionaryEl.disabled = !isMarkerDictionaryEditable;
            selectedDictionaryEl.style.display = isMarkerDictionaryEditable ? 'block' : 'none';
        }
        if (selectedValueEl) {
            selectedValueEl.disabled = !selected.supportsValue || isBuildingSelected;
            selectedValueEl.placeholder = !selected.supportsValue
                ? 'У выбранного объекта нет значения'
                : selected.sceneType === 'Многоэтажка'
                    ? 'Окна: 3:front:2=smoke; 5:back:1=fire'
                    : 'Значение маркера';
            selectedValueEl.style.display = selected.supportsValue && !isBuildingSelected ? 'block' : 'none';
        }
        setBuildingControlsVisible(isBuildingSelected, selectedFloorsWrapEl, selectedFloorsEl, selectedBuildingSettingsEl);
        syncFloorLimit(selectedFloorsEl, selectedBuildingFloorEl);
        syncIncidentValue(selectedValueEl, selectedBuildingIncidentsEl);
        if (selectedPointsEl) {
            selectedPointsEl.disabled = !selected.supportsPoints;
            selectedPointsEl.placeholder = selected.supportsPoints
                ? 'Каждая строка: X, Y, Z'
                : 'Маршрут можно редактировать только у дорог и рельс';
            selectedPointsEl.style.display = selected.supportsPoints ? 'block' : 'none';
        }
        if (appendPointBtn) appendPointBtn.toggleAttribute('disabled', !selected.supportsPoints);
        if (visualEditBtn) {
            visualEditBtn.style.display = selected.supportsPoints ? 'inline-flex' : 'none';
            visualEditBtn.textContent = isVisualEditing ? 'Готово' : 'Проложить';
            visualEditBtn.toggleAttribute('disabled', isAnyLinearEditing && !isVisualEditing);
            visualEditBtn.title = isVisualEditing
                ? 'Завершить визуальную прокладку'
                : 'Добавлять точки маршрута кликами по сцене';
        }
    };

    if (addTypeEl) {
        addTypeEl.addEventListener('change', updateAddControlsState);
        updateAddControlsState();
    }
    mapInputs.forEach((input) => {
        input.addEventListener('input', updateMapSummary);
        input.addEventListener('change', updateMapSummary);
    });
    addFloorsEl?.addEventListener('input', () => syncFloorLimit(addFloorsEl, addBuildingFloorEl));
    selectedFloorsEl?.addEventListener('input', () => syncFloorLimit(selectedFloorsEl, selectedBuildingFloorEl));
    addBuildingIncidentsEl?.addEventListener('input', () => syncIncidentValue(addValueEl, addBuildingIncidentsEl));
    selectedBuildingIncidentsEl?.addEventListener('input', () => syncIncidentValue(selectedValueEl, selectedBuildingIncidentsEl));

    if (addBuildingAppendBtn) {
        addBuildingAppendBtn.addEventListener('click', () => {
            appendIncidentEntry(
                addBuildingIncidentsEl,
                addFloorsEl,
                addBuildingFloorEl,
                addBuildingFaceEl,
                addBuildingWindowEl,
                addBuildingKindEl,
                addValueEl
            );
        });
    }

    if (addBuildingClearBtn) {
        addBuildingClearBtn.addEventListener('click', () => {
            clearIncidentEntries(addBuildingIncidentsEl, addValueEl);
        });
    }

    if (selectedBuildingAppendBtn) {
        selectedBuildingAppendBtn.addEventListener('click', () => {
            appendIncidentEntry(
                selectedBuildingIncidentsEl,
                selectedFloorsEl,
                selectedBuildingFloorEl,
                selectedBuildingFaceEl,
                selectedBuildingWindowEl,
                selectedBuildingKindEl,
                selectedValueEl
            );
        });
    }

    if (selectedBuildingClearBtn) {
        selectedBuildingClearBtn.addEventListener('click', () => {
            clearIncidentEntries(selectedBuildingIncidentsEl, selectedValueEl);
        });
    }

    if (addBtn && addTypeEl) {
        addBtn.addEventListener('click', () => {
            const type = addTypeEl.value;
            callbacks.sceneManager && callbacks.sceneManager.add(addTypeEl.value, {
                markerDictionary: (isSingleMarkerType(type) || isMarkerMapType(type)) ? addDictionaryEl?.value || undefined : undefined,
                value: isBuildingType(type)
                    ? addBuildingIncidentsEl?.value.trim() || undefined
                    : isValueInputType(type)
                        ? addValueEl?.value.trim() || undefined
                        : undefined,
                pointsText: addPointsEl?.value.trim() || undefined,
                floors: isBuildingType(type) ? clampFloors(addFloorsEl?.value, 9) : undefined,
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
            const selectedId = callbacks.sceneManager?.getSelectedId();
            const selectedObject = callbacks.sceneManager?.list().find((item) => item.id === selectedId);
            const isBuildingSelected = selectedObject?.sceneType === 'Многоэтажка';
            callbacks.sceneManager && callbacks.sceneManager.updateSelected({
                markerDictionary: selectedDictionaryEl?.value || undefined,
                value: isBuildingSelected ? selectedBuildingIncidentsEl?.value.trim() : selectedValueEl?.value.trim(),
                pointsText: selectedPointsEl?.value.trim(),
                floors: isBuildingSelected ? clampFloors(selectedFloorsEl?.value, selectedObject?.floors ?? 9) : undefined
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

    if (visualEditBtn) {
        visualEditBtn.addEventListener('click', () => {
            const selectedId = callbacks.sceneManager?.getSelectedId();
            if (!callbacks.sceneManager || !selectedId) return;
            if (callbacks.sceneManager.isLinearEditingActive(selectedId)) {
                callbacks.sceneManager.finishLinearEditing(true);
            } else {
                callbacks.sceneManager.startLinearEditing();
            }
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

    if (groupBtn) {
        groupBtn.addEventListener('click', () => {
            if ((window as any).groupObjects) {
                (window as any).groupObjects();
                render();
            }
        });
    }

    if (ungroupBtn) {
        ungroupBtn.addEventListener('click', () => {
            if ((window as any).ungroupObject) {
                (window as any).ungroupObject();
                render();
            }
        });
    }

    (window as any).updateSceneObjectClickCoords = (point: { x: number, y: number, z: number }) => {
        const coordsEl = document.getElementById('scene-click-coords');
        if (coordsEl) {
            coordsEl.textContent = `Клик: ${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}`;
            coordsEl.style.display = 'block';
        }
    };
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

    (window as any).updateSceneManager = render;
    window.setInterval(render, 250);
    render();
}
