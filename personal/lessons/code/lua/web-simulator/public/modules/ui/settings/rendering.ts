import { simSettings, type GamepadInputRef } from '../../core/state.js';
import { ACTION_AUX_CHANNELS, ALL_CHANNELS, CALIBRATION_DURATION_MS, PRIMARY_CHANNELS, clamp } from './constants.js';
import { buildRangesFromPositions, findClosestRangeByCenter, getObservedPositions } from './observed-inputs.js';
import type { SettingsDomRefs } from './dom.js';
import type { SettingsRuntimeState, AutoStatusMode } from './runtime-state.js';
import type { ActionAuxChannelKey, ChannelKey, ObservedInputPosition, ObservedInputStats, PrimaryChannelKey } from './types.js';
import type { AuxChannelRange } from '../../core/state.js';

export function renderChannelValue(dom: SettingsDomRefs, key: ChannelKey, value: number): void {
    const el = dom.valueEls[key];
    if (el) el.textContent = String(value);
}

export function renderAutoStatus(dom: SettingsDomRefs, state: SettingsRuntimeState): void {
    if (!dom.autoStatusEl) return;
    dom.autoStatusEl.textContent = state.autoStatusText;
    dom.autoStatusEl.classList.toggle('is-listening', state.autoStatusMode === 'listening');
    dom.autoStatusEl.classList.toggle('is-success', state.autoStatusMode === 'success');
}

export function renderAutoButtons(dom: SettingsDomRefs, state: SettingsRuntimeState, allowAssignment: boolean): void {
    for (const key of ALL_CHANNELS) {
        const button = dom.autoButtons[key];
        if (!button) continue;
        const listening = state.autoDetectState?.channel === key;
        button.textContent = listening ? 'ЖДУ' : 'AUTO';
        button.classList.toggle('is-listening', listening);
        button.disabled = !allowAssignment;
    }
}

export function setAutoStatus(
    dom: SettingsDomRefs,
    state: SettingsRuntimeState,
    mode: AutoStatusMode,
    text: string
): void {
    state.autoStatusMode = mode;
    state.autoStatusText = text;
    renderAutoStatus(dom, state);
    renderAutoButtons(dom, state, simSettings.gamepadConnected && state.activeGamepadHasChannelData);
}

export function getChannelLabel(key: ChannelKey): string {
    switch (key) {
        case 'roll':
            return 'Roll';
        case 'pitch':
            return 'Pitch';
        case 'throttle':
            return 'Throttle';
        case 'yaw':
            return 'Yaw';
        case 'mode':
            return 'Mode';
        case 'arm':
            return 'Arm';
        case 'magnet':
            return 'Magnet';
    }
}

export function syncSelectWithMapping(
    dom: SettingsDomRefs,
    key: ChannelKey,
    getMappingRef: (key: ChannelKey) => GamepadInputRef
): void {
    const select = dom.mappingSelects[key];
    if (!select) return;
    const mappedRef = getMappingRef(key);
    const hasOption = Array.from(select.options).some((option) => option.value === mappedRef);
    if (hasOption) {
        select.value = mappedRef;
    }
}

export function renderChannelDataState(dom: SettingsDomRefs, state: SettingsRuntimeState): void {
    if (!dom.channelDataStatusEl) return;

    if (!simSettings.gamepadConnected) {
        dom.channelDataStatusEl.textContent = 'Подключите пульт, чтобы получить значения его каналов и открыть назначение.';
        dom.channelDataStatusEl.classList.remove('is-ready');
        dom.channelDataStatusEl.classList.add('is-waiting');
        return;
    }

    if (!state.activeGamepadHasChannelData) {
        dom.channelDataStatusEl.textContent = 'Жду первые значения от текущего пульта. Назначение каналов и AUTO станут доступны сразу после получения данных.';
        dom.channelDataStatusEl.classList.remove('is-ready');
        dom.channelDataStatusEl.classList.add('is-waiting');
        return;
    }

    dom.channelDataStatusEl.textContent = 'Значения каналов получены. Можно назначать входы и подбирать диапазоны по живому сигналу.';
    dom.channelDataStatusEl.classList.remove('is-waiting');
    dom.channelDataStatusEl.classList.add('is-ready');
}

export function renderMappingControlsState(dom: SettingsDomRefs, state: SettingsRuntimeState): void {
    const allowAssignment = simSettings.gamepadConnected && state.activeGamepadHasChannelData;
    for (const key of ALL_CHANNELS) {
        const select = dom.mappingSelects[key];
        if (!select) continue;
        select.disabled = !allowAssignment || select.options.length === 0;
    }
    renderAutoButtons(dom, state, allowAssignment);
}

export function renderModeMeta(
    dom: SettingsDomRefs,
    state: SettingsRuntimeState,
    liveValue: number,
    getModePositions: () => ObservedInputPosition[]
): void {
    if (!dom.modeMetaEl) return;
    if (!simSettings.gamepadConnected) {
        dom.modeMetaEl.textContent = 'Пульт не подключен.';
        return;
    }
    if (!state.activeGamepadHasChannelData) {
        dom.modeMetaEl.textContent = 'Жду значения канала режима.';
        return;
    }

    const positions = getModePositions();
    if (positions.length === 0) {
        dom.modeMetaEl.textContent = 'Во время калибровки переключите все положения тумблера режима.';
        return;
    }

    const labels = ['LOW', 'MID', 'HIGH'];
    const description = positions
        .map((position, index) => `${labels[index] ?? `P${index + 1}`}: ${position.centerRc}`)
        .join(' | ');
    dom.modeMetaEl.textContent = `Обнаружено положений: ${positions.length}. ${description}. LIVE ${liveValue}.`;
}

export function renderAuxRangePresetOptions(params: {
    dom: SettingsDomRefs;
    state: SettingsRuntimeState;
    key: ActionAuxChannelKey;
    getMappingRef: (key: ChannelKey) => GamepadInputRef;
    getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange;
}): void {
    const { dom, state, key, getMappingRef, getAuxRange } = params;
    const controls = dom.auxRangeControls[key];
    if (!controls.presetSelect) return;

    if (!simSettings.gamepadConnected || !state.activeGamepadHasChannelData) {
        controls.presetSelect.innerHTML = '<option value="">Нет сигнала</option>';
        controls.presetSelect.disabled = true;
        return;
    }

    const ranges = buildRangesFromPositions(getObservedPositions(state.observedInputStats, getMappingRef(key)));
    if (ranges.length === 0) {
        controls.presetSelect.innerHTML = '<option value="">Нет положений</option>';
        controls.presetSelect.disabled = true;
        return;
    }

    controls.presetSelect.innerHTML = ranges
        .map((range, index) => {
            const center = range.center ?? Math.round((range.min + range.max) / 2);
            return `<option value="${index}">Положение ${index + 1} (${center})</option>`;
        })
        .join('');

    const current = findClosestRangeByCenter(ranges, getAuxRange(key).center);
    const currentIndex = current
        ? ranges.findIndex((range) => range.min === current.min && range.max === current.max && range.center === current.center)
        : 0;
    controls.presetSelect.value = String(Math.max(0, currentIndex));
    controls.presetSelect.disabled = false;
}

export function renderAuxRangeEditor(params: {
    dom: SettingsDomRefs;
    state: SettingsRuntimeState;
    key: ActionAuxChannelKey;
    liveValue: number;
    getMappingRef: (key: ChannelKey) => GamepadInputRef;
    getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange;
    getDefaultChannelValue: (key: ChannelKey) => number;
    getObservedStats: (ref: GamepadInputRef) => ObservedInputStats | null;
}): void {
    const { dom, state, key, liveValue, getMappingRef, getAuxRange, getObservedStats } = params;
    const controls = dom.auxRangeControls[key];
    const range = getAuxRange(key);
    const mappedRef = getMappingRef(key);
    const stats = getObservedStats(mappedRef);
    const isReady = simSettings.gamepadConnected && state.activeGamepadHasChannelData && Boolean(stats);
    const minValue = Math.min(range.min, range.max);
    const maxValue = Math.max(range.min, range.max);

    if (controls.card) {
        controls.card.classList.toggle('is-disabled', !isReady);
    }
    renderAuxRangePresetOptions({ dom, state, key, getMappingRef, getAuxRange });
    if (controls.minSlider) {
        controls.minSlider.value = String(minValue);
        controls.minSlider.disabled = !isReady;
    }
    if (controls.maxSlider) {
        controls.maxSlider.value = String(maxValue);
        controls.maxSlider.disabled = !isReady;
    }
    if (controls.minValueEl) controls.minValueEl.textContent = String(minValue);
    if (controls.maxValueEl) controls.maxValueEl.textContent = String(maxValue);
    if (controls.liveValueEl) controls.liveValueEl.textContent = `LIVE ${liveValue}`;
    if (controls.fillEl) {
        const minPercent = toRangeVisualPercent(minValue);
        const maxPercent = toRangeVisualPercent(maxValue);
        controls.fillEl.style.left = `${minPercent}%`;
        controls.fillEl.style.width = `${Math.max(0, maxPercent - minPercent)}%`;
    }
    if (controls.markerEl) {
        controls.markerEl.style.left = `${toRangeVisualPercent(liveValue)}%`;
    }
    if (controls.metaEl) {
        if (!simSettings.gamepadConnected) {
            controls.metaEl.textContent = 'Пульт не подключен.';
        } else if (!state.activeGamepadHasChannelData) {
            controls.metaEl.textContent = 'Нет данных текущего пульта. Жду первый пакет значений.';
        } else if (!stats) {
            controls.metaEl.textContent = `Для ${mappedRef.toUpperCase()} ещё нет наблюдаемых значений.`;
        } else {
            controls.metaEl.textContent = `Источник ${mappedRef.toUpperCase()}. Замеченный диапазон ${stats.minRc}-${stats.maxRc}, положений ${getObservedPositions(state.observedInputStats, mappedRef).length}, сейчас ${stats.lastRc}.`;
        }
    }
}

export function renderAuxRangeEditors(params: {
    dom: SettingsDomRefs;
    state: SettingsRuntimeState;
    getMappingRef: (key: ChannelKey) => GamepadInputRef;
    getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange;
    getDefaultChannelValue: (key: ChannelKey) => number;
    getObservedStats: (ref: GamepadInputRef) => ObservedInputStats | null;
}): void {
    const { dom, getDefaultChannelValue } = params;
    for (const key of ACTION_AUX_CHANNELS) {
        renderAuxRangeEditor({
            ...params,
            key,
            liveValue: Number(dom.valueEls[key]?.textContent ?? getDefaultChannelValue(key))
        });
    }
}

export function updateBar(dom: SettingsDomRefs, key: PrimaryChannelKey, value: number): void {
    const bar = dom.bars[key];
    if (!bar) return;
    if (key === 'throttle') {
        const percent = clamp((value - 1000) / 10, 0, 100);
        bar.style.left = '0%';
        bar.style.width = `${percent}%`;
        return;
    }
    const centered = clamp((value - 1500) / 10, -50, 50);
    if (centered >= 0) {
        bar.style.left = '50%';
        bar.style.width = `${centered}%`;
    } else {
        bar.style.left = `${50 + centered}%`;
        bar.style.width = `${Math.abs(centered)}%`;
    }
}

export function renderChannelDefaults(params: {
    dom: SettingsDomRefs;
    state: SettingsRuntimeState;
    getDefaultChannelValue: (key: ChannelKey) => number;
    getModePositions: () => ObservedInputPosition[];
    getMappingRef: (key: ChannelKey) => GamepadInputRef;
    getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange;
    getObservedStats: (ref: GamepadInputRef) => ObservedInputStats | null;
}): void {
    const { dom, getDefaultChannelValue, getModePositions } = params;
    for (const key of ALL_CHANNELS) {
        const value = getDefaultChannelValue(key);
        renderChannelValue(dom, key, value);
        if (PRIMARY_CHANNELS.includes(key as PrimaryChannelKey)) {
            updateBar(dom, key as PrimaryChannelKey, value);
        }
    }
    renderModeMeta(dom, params.state, getDefaultChannelValue('mode'), getModePositions);
    renderAuxRangeEditors({
        dom: params.dom,
        state: params.state,
        getMappingRef: params.getMappingRef,
        getAuxRange: params.getAuxRange,
        getDefaultChannelValue: params.getDefaultChannelValue,
        getObservedStats: params.getObservedStats
    });
}

export function renderCalibrationState(dom: SettingsDomRefs, state: SettingsRuntimeState): void {
    if (dom.gpBtnCalibrate) {
        const remainingSeconds = state.isCalibrating
            ? Math.max(1, Math.ceil((CALIBRATION_DURATION_MS - (Date.now() - state.calibrationStartedAt)) / 1000))
            : 0;
        dom.gpBtnCalibrate.textContent = state.isCalibrating ? `КАЛ. ${remainingSeconds}с` : 'КАЛИБРОВКА';
        dom.gpBtnCalibrate.style.color = state.isCalibrating ? '#f87171' : '';
        dom.gpBtnCalibrate.disabled = !simSettings.gamepadConnected;
    }
    if (dom.gpBtnResetCal) {
        dom.gpBtnResetCal.disabled = state.isCalibrating || !simSettings.gamepadCalibration.isCalibrated;
    }
}

const toRangePercent = (value: number): number => clamp(((value - 1000) / 1000) * 100, 0, 100);
const RANGE_EDGE_PADDING_PERCENT = 3;
const toRangeVisualPercent = (value: number): number => {
    const normalizedPercent = toRangePercent(value) / 100;
    return clamp(
        RANGE_EDGE_PADDING_PERCENT + normalizedPercent * (100 - RANGE_EDGE_PADDING_PERCENT * 2),
        RANGE_EDGE_PADDING_PERCENT,
        100 - RANGE_EDGE_PADDING_PERCENT
    );
};
