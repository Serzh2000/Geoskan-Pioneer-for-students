/**
 * Модуль интерфейса настроек симулятора.
 * Инициализирует вкладку "Настройки", связывая чекбоксы и ползунки
 * с глобальным состоянием `simSettings`. Позволяет управлять отображением
 * трассера, гизмо трансформации, скоростью симуляции и USB-пультом.
 */
import { simSettings, drones, currentDroneId, matchesAuxRange, type AuxChannelRange, type GamepadInputRef } from '../state.js';

type PrimaryChannelKey = 'roll' | 'pitch' | 'throttle' | 'yaw';
type AuxiliaryChannelKey = 'mode' | 'arm' | 'magnet';
type ActionAuxChannelKey = 'arm' | 'magnet';
type ChannelKey = PrimaryChannelKey | AuxiliaryChannelKey;
type ObservedInputPosition = {
    centerRc: number;
    minRc: number;
    maxRc: number;
    samples: number;
};
type ObservedInputStats = {
    minRc: number;
    maxRc: number;
    lastRc: number;
    samples: number;
    positions: ObservedInputPosition[];
};

const PRIMARY_CHANNELS: PrimaryChannelKey[] = ['roll', 'pitch', 'throttle', 'yaw'];
const AUXILIARY_CHANNELS: AuxiliaryChannelKey[] = ['mode', 'arm', 'magnet'];
const ACTION_AUX_CHANNELS: ActionAuxChannelKey[] = ['arm', 'magnet'];
const ALL_CHANNELS: ChannelKey[] = [...PRIMARY_CHANNELS, ...AUXILIARY_CHANNELS];
const CENTER_DEADBAND = 0.03;
const THROTTLE_IDLE_DEADBAND = 0.02;
const CALIBRATION_DURATION_MS = 10000;
const AUTO_DETECT_AXIS_THRESHOLD = 0.35;
const AUTO_DETECT_AUX_AXIS_THRESHOLD = 0.55;
const AUTO_DETECT_BUTTON_THRESHOLD = 0.6;
const AUTO_DETECT_TIMEOUT_MS = 10000;
const AUTO_DETECT_INPUT_SETTLE_MS = 250;
const AUTO_DETECT_CONFIRM_MS = 120;
const POSITION_CLUSTER_THRESHOLD = 90;
const MIN_POSITION_SAMPLES = 6;
const MAX_PRESET_POSITIONS = 5;

const axisRef = (index: number): GamepadInputRef => `a${index}` as GamepadInputRef;
const buttonRef = (index: number): GamepadInputRef => `b${index}` as GamepadInputRef;
const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
const clampRc = (value: number): number => Math.round(clamp(value, 1000, 2000));

export function initSettingsUI() {
    const showTracerEl = document.getElementById('setting-show-tracer') as HTMLInputElement | null;
    const tracerColorEl = document.getElementById('setting-tracer-color') as HTMLInputElement | null;
    const tracerWidthEl = document.getElementById('setting-tracer-width') as HTMLInputElement | null;
    const tracerShapeEl = document.getElementById('setting-tracer-shape') as HTMLSelectElement | null;
    const showGizmoEl = document.getElementById('setting-show-gizmo') as HTMLInputElement | null;
    const simSpeedEl = document.getElementById('setting-sim-speed') as HTMLInputElement | null;
    const simSpeedVal = document.getElementById('sim-speed-val');
    const gamepadStatusEl = document.getElementById('gamepad-status');
    const gamepadInfoEl = document.getElementById('gamepad-info');
    const autoStatusEl = document.getElementById('gp-auto-status');
    const channelDataStatusEl = document.getElementById('gp-channel-data-status');
    const modeMetaEl = document.getElementById('gp-mode-meta');
    const gpBtnCalibrate = document.getElementById('gp-btn-calibrate') as HTMLButtonElement | null;
    const gpBtnResetCal = document.getElementById('gp-btn-reset-cal') as HTMLButtonElement | null;

    const mappingSelects: Record<ChannelKey, HTMLSelectElement | null> = {
        roll: document.getElementById('gp-map-roll') as HTMLSelectElement | null,
        pitch: document.getElementById('gp-map-pitch') as HTMLSelectElement | null,
        throttle: document.getElementById('gp-map-throttle') as HTMLSelectElement | null,
        yaw: document.getElementById('gp-map-yaw') as HTMLSelectElement | null,
        mode: document.getElementById('gp-map-mode') as HTMLSelectElement | null,
        arm: document.getElementById('gp-map-arm') as HTMLSelectElement | null,
        magnet: document.getElementById('gp-map-magnet') as HTMLSelectElement | null
    };

    const valueEls: Record<ChannelKey, HTMLElement | null> = {
        roll: document.getElementById('gp-val-roll'),
        pitch: document.getElementById('gp-val-pitch'),
        throttle: document.getElementById('gp-val-throttle'),
        yaw: document.getElementById('gp-val-yaw'),
        mode: document.getElementById('gp-val-mode'),
        arm: document.getElementById('gp-val-arm'),
        magnet: document.getElementById('gp-val-magnet')
    };

    const invCheckboxes: Record<PrimaryChannelKey, HTMLInputElement | null> = {
        roll: document.getElementById('gp-inv-roll') as HTMLInputElement | null,
        pitch: document.getElementById('gp-inv-pitch') as HTMLInputElement | null,
        throttle: document.getElementById('gp-inv-throttle') as HTMLInputElement | null,
        yaw: document.getElementById('gp-inv-yaw') as HTMLInputElement | null
    };

    const bars: Record<PrimaryChannelKey, HTMLElement | null> = {
        roll: document.getElementById('gp-bar-roll'),
        pitch: document.getElementById('gp-bar-pitch'),
        throttle: document.getElementById('gp-bar-throttle'),
        yaw: document.getElementById('gp-bar-yaw')
    };

    const autoButtons: Record<ChannelKey, HTMLButtonElement | null> = {
        roll: document.getElementById('gp-auto-roll') as HTMLButtonElement | null,
        pitch: document.getElementById('gp-auto-pitch') as HTMLButtonElement | null,
        throttle: document.getElementById('gp-auto-throttle') as HTMLButtonElement | null,
        yaw: document.getElementById('gp-auto-yaw') as HTMLButtonElement | null,
        mode: document.getElementById('gp-auto-mode') as HTMLButtonElement | null,
        arm: document.getElementById('gp-auto-arm') as HTMLButtonElement | null,
        magnet: document.getElementById('gp-auto-magnet') as HTMLButtonElement | null
    };

    const auxRangeControls: Record<ActionAuxChannelKey, {
        card: HTMLElement | null;
        presetSelect: HTMLSelectElement | null;
        minSlider: HTMLInputElement | null;
        maxSlider: HTMLInputElement | null;
        minValueEl: HTMLElement | null;
        maxValueEl: HTMLElement | null;
        liveValueEl: HTMLElement | null;
        metaEl: HTMLElement | null;
        fillEl: HTMLElement | null;
        markerEl: HTMLElement | null;
    }> = {
        arm: {
            card: document.getElementById('gp-range-arm-card'),
            presetSelect: document.getElementById('gp-range-arm-preset') as HTMLSelectElement | null,
            minSlider: document.getElementById('gp-range-arm-min') as HTMLInputElement | null,
            maxSlider: document.getElementById('gp-range-arm-max') as HTMLInputElement | null,
            minValueEl: document.getElementById('gp-range-arm-min-val'),
            maxValueEl: document.getElementById('gp-range-arm-max-val'),
            liveValueEl: document.getElementById('gp-range-arm-live'),
            metaEl: document.getElementById('gp-range-arm-meta'),
            fillEl: document.getElementById('gp-range-fill-arm'),
            markerEl: document.getElementById('gp-range-marker-arm')
        },
        magnet: {
            card: document.getElementById('gp-range-magnet-card'),
            presetSelect: document.getElementById('gp-range-magnet-preset') as HTMLSelectElement | null,
            minSlider: document.getElementById('gp-range-magnet-min') as HTMLInputElement | null,
            maxSlider: document.getElementById('gp-range-magnet-max') as HTMLInputElement | null,
            minValueEl: document.getElementById('gp-range-magnet-min-val'),
            maxValueEl: document.getElementById('gp-range-magnet-max-val'),
            liveValueEl: document.getElementById('gp-range-magnet-live'),
            metaEl: document.getElementById('gp-range-magnet-meta'),
            fillEl: document.getElementById('gp-range-fill-magnet'),
            markerEl: document.getElementById('gp-range-marker-magnet')
        }
    };

    let isCalibrating = false;
    let calibrationStartedAt = 0;
    let activeGamepadIndex: number | null = null;
    let activeGamepadId: string | null = null;
    let activeGamepadHasChannelData = false;
    let observedInputStats = new Map<GamepadInputRef, ObservedInputStats>();
    let autoStatusMode: 'idle' | 'listening' | 'success' = 'idle';
    let autoStatusText = 'Нажмите AUTO и подвигайте нужный стик или тумблер.';
    let autoDetectState: {
        channel: ChannelKey;
        startedAt: number;
        ignoreUntil: number;
        baselineAxes: number[];
        baselineButtons: number[];
        candidateRef: GamepadInputRef | null;
        candidateSince: number;
    } | null = null;

    const getDefaultChannelValue = (key: ChannelKey): number => key === 'throttle' || AUXILIARY_CHANNELS.includes(key as AuxiliaryChannelKey) ? 1000 : 1500;
    const getAuxRange = (key: ActionAuxChannelKey): AuxChannelRange => simSettings.gamepadAuxRanges[key];
    const setAuxRange = (key: ActionAuxChannelKey, range: AuxChannelRange): void => {
        simSettings.gamepadAuxRanges[key] = range;
    };
    const setModeRange = (key: 'loiter' | 'althold' | 'stabilize', range: AuxChannelRange): void => {
        simSettings.gamepadModeRanges[key] = range;
    };
    const getInputLabel = (ref: GamepadInputRef): string => ref.toUpperCase();
    const hasChannelData = (): boolean => simSettings.gamepadConnected && activeGamepadHasChannelData;
    const toRangePercent = (value: number): number => clamp(((value - 1000) / 1000) * 100, 0, 100);
    const getObservedStats = (ref: GamepadInputRef): ObservedInputStats | null => observedInputStats.get(ref) ?? null;

    const resetObservedInputStats = (): void => {
        activeGamepadHasChannelData = false;
        observedInputStats = new Map<GamepadInputRef, ObservedInputStats>();
    };

    const getMappingRef = (key: ChannelKey): GamepadInputRef => {
        switch (key) {
            case 'roll':
                return simSettings.gamepadMapping.roll;
            case 'pitch':
                return simSettings.gamepadMapping.pitch;
            case 'throttle':
                return simSettings.gamepadMapping.throttle;
            case 'yaw':
                return simSettings.gamepadMapping.yaw;
            case 'mode':
                return simSettings.gamepadMapping.modeSwitch;
            case 'arm':
                return simSettings.gamepadMapping.armSwitch;
            case 'magnet':
                return simSettings.gamepadMapping.magnetBtn;
        }
    };

    const setMappingRef = (key: ChannelKey, ref: GamepadInputRef): void => {
        switch (key) {
            case 'roll':
                simSettings.gamepadMapping.roll = ref;
                break;
            case 'pitch':
                simSettings.gamepadMapping.pitch = ref;
                break;
            case 'throttle':
                simSettings.gamepadMapping.throttle = ref;
                break;
            case 'yaw':
                simSettings.gamepadMapping.yaw = ref;
                break;
            case 'mode':
                simSettings.gamepadMapping.modeSwitch = ref;
                break;
            case 'arm':
                simSettings.gamepadMapping.armSwitch = ref;
                break;
            case 'magnet':
                simSettings.gamepadMapping.magnetBtn = ref;
                break;
        }
    };

    const hasInputRef = (gp: Gamepad, ref: GamepadInputRef): boolean => {
        const inputIndex = Number(ref.slice(1));
        return ref.startsWith('a') ? inputIndex < gp.axes.length : inputIndex < gp.buttons.length;
    };

    const isAllowedForChannel = (key: ChannelKey, ref: GamepadInputRef): boolean => {
        if (PRIMARY_CHANNELS.includes(key as PrimaryChannelKey)) return ref.startsWith('a');
        return true;
    };

    const getFallbackMapping = (gp: Gamepad, key: ChannelKey): GamepadInputRef | null => {
        switch (key) {
            case 'roll':
                return gp.axes.length > 0 ? axisRef(0) : null;
            case 'pitch':
                return gp.axes.length > 1 ? axisRef(1) : gp.axes.length > 0 ? axisRef(0) : null;
            case 'throttle':
                return gp.axes.length > 2 ? axisRef(2) : gp.axes.length > 0 ? axisRef(gp.axes.length - 1) : null;
            case 'yaw':
                return gp.axes.length > 3 ? axisRef(3) : gp.axes.length > 0 ? axisRef(Math.min(1, gp.axes.length - 1)) : null;
            case 'mode':
                if (gp.buttons.length > 4) return buttonRef(4);
                if (gp.buttons.length > 0) return buttonRef(0);
                if (gp.axes.length > 4) return axisRef(4);
                return gp.axes.length > 0 ? axisRef(0) : null;
            case 'arm':
                if (gp.buttons.length > 5) return buttonRef(5);
                if (gp.buttons.length > 1) return buttonRef(1);
                if (gp.axes.length > 5) return axisRef(5);
                return gp.axes.length > 0 ? axisRef(0) : null;
            case 'magnet':
                if (gp.buttons.length > 6) return buttonRef(6);
                if (gp.buttons.length > 2) return buttonRef(2);
                if (gp.axes.length > 6) return axisRef(6);
                return gp.axes.length > 0 ? axisRef(0) : null;
        }
    };

    const ensureMappingsForGamepad = (gp: Gamepad): void => {
        for (const key of ALL_CHANNELS) {
            const currentRef = getMappingRef(key);
            if (isAllowedForChannel(key, currentRef) && hasInputRef(gp, currentRef)) continue;
            const fallback = getFallbackMapping(gp, key);
            if (fallback) setMappingRef(key, fallback);
        }
    };

    const readInputRcValue = (gp: Gamepad, ref: GamepadInputRef): number => {
        const inputIndex = Number(ref.slice(1));
        if (ref.startsWith('a')) {
            const rawValue = gp.axes[inputIndex] ?? 0;
            const normalized = normalizeCenteredAxis(rawValue, inputIndex);
            return clampRc(1500 + normalized * 500);
        }

        const buttonValue = clamp(gp.buttons[inputIndex]?.value ?? 0, 0, 1);
        return clampRc(1000 + buttonValue * 1000);
    };

    const rememberObservedInputValue = (ref: GamepadInputRef, rcValue: number): void => {
        const current = observedInputStats.get(ref);
        if (!current) {
            observedInputStats.set(ref, {
                minRc: rcValue,
                maxRc: rcValue,
                lastRc: rcValue,
                samples: 1,
                positions: [{
                    centerRc: rcValue,
                    minRc: rcValue,
                    maxRc: rcValue,
                    samples: 1
                }]
            });
            return;
        }

        current.minRc = Math.min(current.minRc, rcValue);
        current.maxRc = Math.max(current.maxRc, rcValue);
        current.lastRc = rcValue;
        current.samples += 1;

        let bestMatch: ObservedInputPosition | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (const position of current.positions) {
            const distance = Math.abs(position.centerRc - rcValue);
            if (distance <= POSITION_CLUSTER_THRESHOLD && distance < bestDistance) {
                bestMatch = position;
                bestDistance = distance;
            }
        }

        if (!bestMatch) {
            current.positions.push({
                centerRc: rcValue,
                minRc: rcValue,
                maxRc: rcValue,
                samples: 1
            });
            return;
        }

        bestMatch.centerRc = Math.round((bestMatch.centerRc * bestMatch.samples + rcValue) / (bestMatch.samples + 1));
        bestMatch.minRc = Math.min(bestMatch.minRc, rcValue);
        bestMatch.maxRc = Math.max(bestMatch.maxRc, rcValue);
        bestMatch.samples += 1;
    };

    const getObservedPositions = (ref: GamepadInputRef): ObservedInputPosition[] => {
        const stats = getObservedStats(ref);
        if (!stats) return [];

        const stable = stats.positions.filter((position) => position.samples >= MIN_POSITION_SAMPLES);
        const source = stable.length > 0 ? stable : stats.positions;

        return [...source]
            .sort((a, b) => b.samples - a.samples)
            .slice(0, MAX_PRESET_POSITIONS)
            .sort((a, b) => a.centerRc - b.centerRc);
    };

    const buildRangesFromPositions = (positions: ObservedInputPosition[]): AuxChannelRange[] => {
        if (positions.length === 0) return [];
        return positions.map((position, index) => {
            const prev = positions[index - 1];
            const next = positions[index + 1];
            const min = prev
                ? Math.round((prev.centerRc + position.centerRc) / 2)
                : Math.max(1000, position.minRc - Math.max(20, Math.round((position.maxRc - position.minRc) / 2)));
            const max = next
                ? Math.round((position.centerRc + next.centerRc) / 2)
                : Math.min(2000, position.maxRc + Math.max(20, Math.round((position.maxRc - position.minRc) / 2)));
            return {
                min: clamp(min, 1000, 2000),
                max: clamp(max, 1000, 2000),
                center: position.centerRc
            };
        });
    };

    const findClosestRangeByCenter = (ranges: AuxChannelRange[], center?: number): AuxChannelRange | null => {
        if (!ranges.length || center === undefined) return null;
        let best: AuxChannelRange | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (const range of ranges) {
            const target = range.center ?? Math.round((range.min + range.max) / 2);
            const distance = Math.abs(target - center);
            if (distance < bestDistance) {
                bestDistance = distance;
                best = range;
            }
        }
        return best;
    };

    const getModeObservedPositions = (): ObservedInputPosition[] => {
        const positions = getObservedPositions(getMappingRef('mode'));
        if (positions.length <= 3) return positions;
        const middleIndex = Math.floor((positions.length - 1) / 2);
        return [positions[0], positions[middleIndex], positions[positions.length - 1]];
    };

    const applyModeRangesFromObserved = (): void => {
        const positions = getModeObservedPositions();
        const ranges = buildRangesFromPositions(positions);
        if (ranges.length < 2) return;

        setModeRange('loiter', ranges[0]);
        if (ranges.length >= 3) {
            setModeRange('althold', ranges[1]);
            setModeRange('stabilize', ranges[2]);
            return;
        }

        const midpoint = Math.round((ranges[0].max + ranges[1].min) / 2);
        setModeRange('althold', {
            min: clamp(midpoint - 25, 1000, 2000),
            max: clamp(midpoint + 25, 1000, 2000),
            center: midpoint
        });
        setModeRange('stabilize', ranges[1]);
    };

    const renderModeMeta = (liveValue: number): void => {
        if (!modeMetaEl) return;
        if (!simSettings.gamepadConnected) {
            modeMetaEl.textContent = 'Пульт не подключен.';
            return;
        }
        if (!activeGamepadHasChannelData) {
            modeMetaEl.textContent = 'Жду значения канала режима.';
            return;
        }

        const positions = getModeObservedPositions();
        if (positions.length === 0) {
            modeMetaEl.textContent = 'Во время калибровки переключите все положения тумблера режима.';
            return;
        }

        const labels = ['LOW', 'MID', 'HIGH'];
        const description = positions
            .map((position, index) => `${labels[index] ?? `P${index + 1}`}: ${position.centerRc}`)
            .join(' | ');
        modeMetaEl.textContent = `Обнаружено положений: ${positions.length}. ${description}. LIVE ${liveValue}.`;
    };

    const renderAuxRangePresetOptions = (key: ActionAuxChannelKey): void => {
        const controls = auxRangeControls[key];
        if (!controls.presetSelect) return;

        if (!hasChannelData()) {
            controls.presetSelect.innerHTML = '<option value="">Нет сигнала</option>';
            controls.presetSelect.disabled = true;
            return;
        }

        const ranges = buildRangesFromPositions(getObservedPositions(getMappingRef(key)));
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
        const currentIndex = current ? ranges.indexOf(current) : 0;
        controls.presetSelect.value = String(Math.max(0, currentIndex));
        controls.presetSelect.disabled = false;
    };

    const sampleObservedInputs = (gp: Gamepad): void => {
        let sampled = false;

        for (let index = 0; index < gp.axes.length; index += 1) {
            const rawValue = gp.axes[index];
            if (!Number.isFinite(rawValue)) continue;
            rememberObservedInputValue(axisRef(index), readInputRcValue(gp, axisRef(index)));
            sampled = true;
        }

        for (let index = 0; index < gp.buttons.length; index += 1) {
            rememberObservedInputValue(buttonRef(index), readInputRcValue(gp, buttonRef(index)));
            sampled = true;
        }

        if (sampled) {
            activeGamepadHasChannelData = true;
        }
    };

    const renderChannelValue = (key: ChannelKey, value: number): void => {
        const el = valueEls[key];
        if (el) el.textContent = String(value);
    };

    const renderAutoStatus = (): void => {
        if (!autoStatusEl) return;
        autoStatusEl.textContent = autoStatusText;
        autoStatusEl.classList.toggle('is-listening', autoStatusMode === 'listening');
        autoStatusEl.classList.toggle('is-success', autoStatusMode === 'success');
    };

    const renderAutoButtons = (): void => {
        const allowAssignment = hasChannelData();
        for (const key of ALL_CHANNELS) {
            const button = autoButtons[key];
            if (!button) continue;
            const listening = autoDetectState?.channel === key;
            button.textContent = listening ? 'ЖДУ' : 'AUTO';
            button.classList.toggle('is-listening', listening);
            button.disabled = !allowAssignment;
        }
    };

    const setAutoStatus = (mode: 'idle' | 'listening' | 'success', text: string): void => {
        autoStatusMode = mode;
        autoStatusText = text;
        renderAutoStatus();
        renderAutoButtons();
    };

    const getChannelLabel = (key: ChannelKey): string => {
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
    };

    const syncSelectWithMapping = (key: ChannelKey): void => {
        const select = mappingSelects[key];
        if (!select) return;
        const mappedRef = getMappingRef(key);
        const hasOption = Array.from(select.options).some((option) => option.value === mappedRef);
        if (hasOption) {
            select.value = mappedRef;
        }
    };

    const renderChannelDataState = (): void => {
        if (!channelDataStatusEl) return;

        if (!simSettings.gamepadConnected) {
            channelDataStatusEl.textContent = 'Подключите пульт, чтобы получить значения его каналов и открыть назначение.';
            channelDataStatusEl.classList.remove('is-ready');
            channelDataStatusEl.classList.add('is-waiting');
            return;
        }

        if (!activeGamepadHasChannelData) {
            channelDataStatusEl.textContent = 'Жду первые значения от текущего пульта. Назначение каналов и AUTO станут доступны сразу после получения данных.';
            channelDataStatusEl.classList.remove('is-ready');
            channelDataStatusEl.classList.add('is-waiting');
            return;
        }

        channelDataStatusEl.textContent = 'Значения каналов получены. Можно назначать входы и подбирать диапазоны по живому сигналу.';
        channelDataStatusEl.classList.remove('is-waiting');
        channelDataStatusEl.classList.add('is-ready');
    };

    const renderMappingControlsState = (): void => {
        const allowAssignment = hasChannelData();
        for (const key of ALL_CHANNELS) {
            const select = mappingSelects[key];
            if (!select) continue;
            select.disabled = !allowAssignment || select.options.length === 0;
        }
        renderAutoButtons();
    };

    const renderAuxRangeEditor = (key: ActionAuxChannelKey, liveValue: number): void => {
        const controls = auxRangeControls[key];
        const range = getAuxRange(key);
        const mappedRef = getMappingRef(key);
        const stats = getObservedStats(mappedRef);
        const isReady = hasChannelData() && Boolean(stats);
        const minValue = Math.min(range.min, range.max);
        const maxValue = Math.max(range.min, range.max);

        if (controls.card) {
            controls.card.classList.toggle('is-disabled', !isReady);
        }
        renderAuxRangePresetOptions(key);
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
            controls.fillEl.style.left = `${toRangePercent(minValue)}%`;
            controls.fillEl.style.width = `${Math.max(0, toRangePercent(maxValue) - toRangePercent(minValue))}%`;
        }
        if (controls.markerEl) {
            controls.markerEl.style.left = `${toRangePercent(liveValue)}%`;
        }
        if (controls.metaEl) {
            if (!simSettings.gamepadConnected) {
                controls.metaEl.textContent = 'Пульт не подключен.';
            } else if (!activeGamepadHasChannelData) {
                controls.metaEl.textContent = 'Нет данных текущего пульта. Жду первый пакет значений.';
            } else if (!stats) {
                controls.metaEl.textContent = `Для ${getInputLabel(mappedRef)} ещё нет наблюдаемых значений.`;
            } else {
                controls.metaEl.textContent = `Источник ${getInputLabel(mappedRef)}. Замеченный диапазон ${stats.minRc}-${stats.maxRc}, положений ${getObservedPositions(mappedRef).length}, сейчас ${stats.lastRc}.`;
            }
        }
    };

    const renderAuxRangeEditors = (): void => {
        for (const key of ACTION_AUX_CHANNELS) {
            renderAuxRangeEditor(key, Number(valueEls[key]?.textContent ?? getDefaultChannelValue(key)));
        }
    };

    const syncAuxRangeFromControls = (key: ActionAuxChannelKey, source: 'min' | 'max'): void => {
        const controls = auxRangeControls[key];
        if (!controls.minSlider || !controls.maxSlider) return;

        let minValue = Number(controls.minSlider.value);
        let maxValue = Number(controls.maxSlider.value);

        if (minValue > maxValue) {
            if (source === 'min') {
                maxValue = minValue;
                controls.maxSlider.value = String(maxValue);
            } else {
                minValue = maxValue;
                controls.minSlider.value = String(minValue);
            }
        }

        setAuxRange(key, {
            min: minValue,
            max: maxValue,
            center: Math.round((minValue + maxValue) / 2)
        });
        renderAuxRangeEditor(key, Number(valueEls[key]?.textContent ?? getDefaultChannelValue(key)));
    };

    const initAuxRangeControls = (): void => {
        for (const key of ACTION_AUX_CHANNELS) {
            const controls = auxRangeControls[key];
            if (controls.presetSelect) {
                controls.presetSelect.onchange = () => {
                    const selectedIndex = Number(controls.presetSelect?.value ?? '-1');
                    const ranges = buildRangesFromPositions(getObservedPositions(getMappingRef(key)));
                    const selectedRange = ranges[selectedIndex];
                    if (!selectedRange) return;
                    setAuxRange(key, selectedRange);
                    renderAuxRangeEditor(key, Number(valueEls[key]?.textContent ?? getDefaultChannelValue(key)));
                };
            }
            if (controls.minSlider) {
                controls.minSlider.oninput = () => {
                    syncAuxRangeFromControls(key, 'min');
                };
            }
            if (controls.maxSlider) {
                controls.maxSlider.oninput = () => {
                    syncAuxRangeFromControls(key, 'max');
                };
            }
        }
        renderAuxRangeEditors();
    };

    const updateBar = (key: PrimaryChannelKey, value: number): void => {
        const bar = bars[key];
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
    };

    const renderChannelDefaults = (): void => {
        for (const key of ALL_CHANNELS) {
            const value = getDefaultChannelValue(key);
            renderChannelValue(key, value);
            if (PRIMARY_CHANNELS.includes(key as PrimaryChannelKey)) {
                updateBar(key as PrimaryChannelKey, value);
            }
        }
        renderModeMeta(getDefaultChannelValue('mode'));
        renderAuxRangeEditors();
    };

    const resetCalibration = (): void => {
        simSettings.gamepadCalibration.min.fill(-1);
        simSettings.gamepadCalibration.max.fill(1);
        simSettings.gamepadCalibration.center.fill(0);
        simSettings.gamepadCalibration.isCalibrated = false;
    };

    const beginCalibration = (gp: Gamepad): void => {
        isCalibrating = true;
        calibrationStartedAt = Date.now();
        simSettings.gamepadCalibration.min.fill(Number.POSITIVE_INFINITY);
        simSettings.gamepadCalibration.max.fill(Number.NEGATIVE_INFINITY);
        simSettings.gamepadCalibration.center.fill(0);
        const axisCount = Math.min(simSettings.gamepadCalibration.center.length, gp.axes.length);
        for (let i = 0; i < axisCount; i += 1) {
            const axisValue = Number.isFinite(gp.axes[i]) ? gp.axes[i] : 0;
            simSettings.gamepadCalibration.center[i] = axisValue;
            simSettings.gamepadCalibration.min[i] = axisValue;
            simSettings.gamepadCalibration.max[i] = axisValue;
        }
        simSettings.gamepadCalibration.isCalibrated = false;
    };

    const finishCalibration = (): void => {
        isCalibrating = false;
        calibrationStartedAt = 0;
        let calibratedAxes = 0;
        for (let i = 0; i < simSettings.gamepadCalibration.min.length; i += 1) {
            const min = simSettings.gamepadCalibration.min[i];
            const max = simSettings.gamepadCalibration.max[i];
            const center = simSettings.gamepadCalibration.center[i];
            if (!Number.isFinite(min) || !Number.isFinite(max) || max - min < 0.05) {
                simSettings.gamepadCalibration.min[i] = -1;
                simSettings.gamepadCalibration.max[i] = 1;
                simSettings.gamepadCalibration.center[i] = Number.isFinite(center) ? clamp(center, -1, 1) : 0;
                continue;
            }
            simSettings.gamepadCalibration.min[i] = clamp(min, -1, 1);
            simSettings.gamepadCalibration.max[i] = clamp(max, -1, 1);
            simSettings.gamepadCalibration.center[i] = clamp(center, simSettings.gamepadCalibration.min[i], simSettings.gamepadCalibration.max[i]);
            calibratedAxes += 1;
        }
        simSettings.gamepadCalibration.isCalibrated = calibratedAxes > 0;
        applyModeRangesFromObserved();
        renderModeMeta(Number(valueEls.mode?.textContent ?? getDefaultChannelValue('mode')));
        renderAuxRangeEditors();
    };

    const sampleCalibration = (gp: Gamepad): void => {
        const axisCount = Math.min(simSettings.gamepadCalibration.min.length, gp.axes.length);
        for (let i = 0; i < axisCount; i += 1) {
            const axisValue = gp.axes[i];
            if (!Number.isFinite(axisValue)) continue;
            simSettings.gamepadCalibration.min[i] = Math.min(simSettings.gamepadCalibration.min[i], axisValue);
            simSettings.gamepadCalibration.max[i] = Math.max(simSettings.gamepadCalibration.max[i], axisValue);
        }
    };

    const renderCalibrationState = (): void => {
        if (gpBtnCalibrate) {
            const remainingSeconds = isCalibrating
                ? Math.max(1, Math.ceil((CALIBRATION_DURATION_MS - (Date.now() - calibrationStartedAt)) / 1000))
                : 0;
            gpBtnCalibrate.textContent = isCalibrating ? `КАЛ. ${remainingSeconds}с` : 'КАЛИБРОВКА';
            gpBtnCalibrate.style.color = isCalibrating ? '#f87171' : '';
            gpBtnCalibrate.disabled = !simSettings.gamepadConnected;
        }
        if (gpBtnResetCal) {
            gpBtnResetCal.disabled = isCalibrating || !simSettings.gamepadCalibration.isCalibrated;
        }
    };

    const stopAutoDetection = (mode: 'idle' | 'success', text?: string): void => {
        autoDetectState = null;
        setAutoStatus(mode, text ?? 'Нажмите AUTO и подвигайте нужный стик или тумблер.');
    };

    const startAutoDetection = (channel: ChannelKey): void => {
        const gp = findActiveGamepad();
        if (!gp) {
            stopAutoDetection('idle', 'Подключите пульт, чтобы использовать AUTO-привязку.');
            return;
        }
        if (!hasChannelData()) {
            stopAutoDetection('idle', 'Сначала дождитесь получения значений каналов от текущего пульта.');
            return;
        }
        if (autoDetectState?.channel === channel) {
            stopAutoDetection('idle');
            return;
        }

        autoDetectState = {
            channel,
            startedAt: Date.now(),
            ignoreUntil: Date.now() + AUTO_DETECT_INPUT_SETTLE_MS,
            baselineAxes: [...gp.axes],
            baselineButtons: gp.buttons.map((button) => button.value),
            candidateRef: null,
            candidateSince: 0
        };
        setAutoStatus('listening', `AUTO для ${getChannelLabel(channel)}: подвигайте нужный стик или переключите тумблер.`);
    };

    const detectAutoInput = (gp: Gamepad): void => {
        const state = autoDetectState;
        if (!state) return;

        const now = Date.now();
        if (now - state.startedAt > AUTO_DETECT_TIMEOUT_MS) {
            stopAutoDetection('idle', 'AUTO не нашёл активность. Нажмите кнопку ещё раз и двигайте только нужный канал.');
            return;
        }
        if (now < state.ignoreUntil) return;

        const { channel, baselineAxes, baselineButtons } = state;
        let detectedRef: GamepadInputRef | null = null;
        let detectedStrength = 0;

        if (PRIMARY_CHANNELS.includes(channel as PrimaryChannelKey)) {
            for (let index = 0; index < gp.axes.length; index += 1) {
                const baseline = baselineAxes[index] ?? 0;
                const axisValue = gp.axes[index] ?? 0;
                const delta = Math.abs(axisValue - baseline);
                if (delta >= AUTO_DETECT_AXIS_THRESHOLD && delta > detectedStrength) {
                    detectedStrength = delta;
                    detectedRef = axisRef(index);
                }
            }
        } else {
            for (let index = 0; index < gp.buttons.length; index += 1) {
                const baseline = baselineButtons[index] ?? 0;
                const buttonValue = gp.buttons[index]?.value ?? 0;
                const delta = Math.abs(buttonValue - baseline);
                if (delta >= AUTO_DETECT_BUTTON_THRESHOLD) {
                    const strength = delta + Math.max(buttonValue, baseline);
                    if (strength > detectedStrength) {
                        detectedStrength = strength;
                        detectedRef = buttonRef(index);
                    }
                }
            }

            if (!detectedRef) {
                for (let index = 0; index < gp.axes.length; index += 1) {
                    const baseline = baselineAxes[index] ?? 0;
                    const axisValue = gp.axes[index] ?? 0;
                    const delta = Math.abs(axisValue - baseline);
                    if (delta >= AUTO_DETECT_AUX_AXIS_THRESHOLD && delta > detectedStrength) {
                        detectedStrength = delta;
                        detectedRef = axisRef(index);
                    }
                }
            }
        }

        if (!detectedRef) {
            state.candidateRef = null;
            state.candidateSince = 0;
            return;
        }

        if (state.candidateRef !== detectedRef) {
            state.candidateRef = detectedRef;
            state.candidateSince = now;
            return;
        }

        if (now - state.candidateSince < AUTO_DETECT_CONFIRM_MS) return;

        setMappingRef(channel, detectedRef);
        syncSelectWithMapping(channel);
        stopAutoDetection('success', `${getChannelLabel(channel)} автоматически назначен на ${detectedRef.toUpperCase()}.`);
    };

    const updateCalibrationProgress = (gp: Gamepad): void => {
        if (!isCalibrating) return;

        sampleCalibration(gp);
        if (Date.now() - calibrationStartedAt >= CALIBRATION_DURATION_MS) {
            finishCalibration();
        }
        renderCalibrationState();
    };

    const normalizeCenteredAxis = (rawValue: number, axisIndex: number): number => {
        if (!simSettings.gamepadCalibration.isCalibrated) {
            const unclamped = clamp(rawValue, -1, 1);
            return Math.abs(unclamped) < CENTER_DEADBAND ? 0 : unclamped;
        }

        const min = simSettings.gamepadCalibration.min[axisIndex];
        const max = simSettings.gamepadCalibration.max[axisIndex];
        let center = simSettings.gamepadCalibration.center[axisIndex];

        if (!Number.isFinite(min) || !Number.isFinite(max) || max - min < 0.05) {
            const fallback = clamp(rawValue, -1, 1);
            return Math.abs(fallback) < CENTER_DEADBAND ? 0 : fallback;
        }

        if (!(center > min && center < max)) {
            center = (min + max) / 2;
        }

        const denominator = rawValue >= center ? max - center : center - min;
        if (denominator < 0.0001) return 0;

        const normalized = clamp((rawValue - center) / denominator, -1, 1);
        return Math.abs(normalized) < CENTER_DEADBAND ? 0 : normalized;
    };

    const normalizeThrottleAxis = (rawValue: number, axisIndex: number): number => {
        if (!simSettings.gamepadCalibration.isCalibrated) {
            const fallback = clamp((clamp(rawValue, -1, 1) + 1) / 2, 0, 1);
            if (fallback < THROTTLE_IDLE_DEADBAND) return 0;
            if (fallback > 1 - THROTTLE_IDLE_DEADBAND) return 1;
            return fallback;
        }

        const min = simSettings.gamepadCalibration.min[axisIndex];
        const max = simSettings.gamepadCalibration.max[axisIndex];
        if (!Number.isFinite(min) || !Number.isFinite(max) || max - min < 0.05) {
            return clamp((clamp(rawValue, -1, 1) + 1) / 2, 0, 1);
        }

        const normalized = clamp((rawValue - min) / (max - min), 0, 1);
        if (normalized < THROTTLE_IDLE_DEADBAND) return 0;
        if (normalized > 1 - THROTTLE_IDLE_DEADBAND) return 1;
        return normalized;
    };

    const getConnectedGamepads = (): Gamepad[] => {
        if (typeof navigator.getGamepads !== 'function') return [];
        return Array.from(navigator.getGamepads()).filter((gp): gp is Gamepad => gp !== null);
    };

    const findActiveGamepad = (): Gamepad | null => {
        const connected = getConnectedGamepads();
        if (connected.length === 0) return null;
        if (activeGamepadIndex !== null) {
            const byIndex = connected.find((gp) => gp.index === activeGamepadIndex);
            if (byIndex) return byIndex;
        }
        if (activeGamepadId) {
            const byId = connected.find((gp) => gp.id === activeGamepadId);
            if (byId) return byId;
        }
        return connected[0];
    };

    const getGamepadName = (gp: Gamepad): string => {
        const trimmed = gp.id.split('(')[0].trim();
        return trimmed || `Gamepad ${gp.index + 1}`;
    };

    const createAxisOptions = (gp: Gamepad): string => {
        return gp.axes.map((_, index) => `<option value="${axisRef(index)}">A${index}: Axis ${index}</option>`).join('');
    };

    const createAuxOptions = (gp: Gamepad): string => {
        const options: string[] = [];
        gp.axes.forEach((_, index) => options.push(`<option value="${axisRef(index)}">A${index}: Axis ${index}</option>`));
        gp.buttons.forEach((_, index) => options.push(`<option value="${buttonRef(index)}">B${index}: Button ${index}</option>`));
        return options.join('');
    };

    const initMappingSelects = (gp: Gamepad): void => {
        ensureMappingsForGamepad(gp);
        for (const key of ALL_CHANNELS) {
            const select = mappingSelects[key];
            if (!select) continue;
            select.innerHTML = PRIMARY_CHANNELS.includes(key as PrimaryChannelKey) ? createAxisOptions(gp) : createAuxOptions(gp);
            const mappedRef = getMappingRef(key);
            const hasOption = Array.from(select.options).some((option) => option.value === mappedRef);
            const nextValue = hasOption ? mappedRef : select.options[0]?.value ?? '';
            if (nextValue) {
                select.value = nextValue;
                setMappingRef(key, nextValue as GamepadInputRef);
            }
            select.onchange = () => {
                if (!hasChannelData()) {
                    syncSelectWithMapping(key);
                    return;
                }
                const nextRef = select.value as GamepadInputRef;
                if (!isAllowedForChannel(key, nextRef)) return;
                setMappingRef(key, nextRef);
                if (key === 'mode') {
                    applyModeRangesFromObserved();
                    renderModeMeta(Number(valueEls.mode?.textContent ?? getDefaultChannelValue('mode')));
                }
                renderAuxRangeEditors();
            };
        }
        renderMappingControlsState();
    };

    const syncConnectionState = (gamepad: Gamepad | null): void => {
        const wasConnected = simSettings.gamepadConnected;
        const previousIndex = activeGamepadIndex;
        const previousId = activeGamepadId;
        simSettings.gamepadConnected = gamepad !== null;
        activeGamepadIndex = gamepad?.index ?? null;
        activeGamepadId = gamepad?.id ?? null;

        const controllerChanged = (gamepad?.index ?? null) !== previousIndex || (gamepad?.id ?? null) !== previousId;
        if (controllerChanged) {
            resetObservedInputStats();
        }

        if (gamepadStatusEl) {
            if (gamepad) {
                gamepadStatusEl.textContent = `Пульт: ${getGamepadName(gamepad)} | Axes ${gamepad.axes.length} | Btn ${gamepad.buttons.length}`;
                gamepadStatusEl.style.color = '#4ade80';
            } else {
                gamepadStatusEl.textContent = 'Пульт не подключен';
                gamepadStatusEl.style.color = 'var(--text-muted)';
            }
        }

        if (gamepadInfoEl) {
            gamepadInfoEl.style.display = gamepad ? 'block' : 'none';
        }

        if (gamepad && (!wasConnected || controllerChanged)) {
            initMappingSelects(gamepad);
        }

        if (!gamepad && isCalibrating) {
            finishCalibration();
        }
        if (!gamepad && autoDetectState) {
            stopAutoDetection('idle', 'Пульт отключён. AUTO-привязка остановлена.');
        }

        renderCalibrationState();
        renderChannelDataState();
        renderMappingControlsState();
        renderModeMeta(Number(valueEls.mode?.textContent ?? getDefaultChannelValue('mode')));
        renderAuxRangeEditors();
    };

    const readChannelValue = (gp: Gamepad, key: ChannelKey, inversionIndex?: number): number => {
        const inputRef = getMappingRef(key);
        const inputIndex = Number(inputRef.slice(1));
        const isAxis = inputRef.startsWith('a');
        const isInverted = inversionIndex !== undefined ? simSettings.gamepadInversion[inversionIndex] : false;

        if (isAxis) {
            const rawValue = gp.axes[inputIndex] ?? 0;
            if (key === 'throttle') {
                let normalized = normalizeThrottleAxis(rawValue, inputIndex);
                if (isInverted) normalized = 1 - normalized;
                return clampRc(1000 + normalized * 1000);
            }

            let normalized = normalizeCenteredAxis(rawValue, inputIndex);
            if (isInverted) normalized = -normalized;
            return clampRc(1500 + normalized * 500);
        }

        const buttonValue = clamp(gp.buttons[inputIndex]?.value ?? 0, 0, 1);
        if (key === 'throttle') {
            return clampRc(1000 + (isInverted ? 1 - buttonValue : buttonValue) * 1000);
        }

        if (PRIMARY_CHANNELS.includes(key as PrimaryChannelKey)) {
            const normalized = (isInverted ? 1 - buttonValue : buttonValue) * 2 - 1;
            return clampRc(1500 + normalized * 500);
        }

        return clampRc(1000 + buttonValue * 1000);
    };

    const updateDroneChannels = (gp: Gamepad): void => {
        const drone = drones[currentDroneId];
        if (!drone) return;

        sampleObservedInputs(gp);

        const roll = readChannelValue(gp, 'roll', 0);
        const pitch = readChannelValue(gp, 'pitch', 1);
        const throttle = readChannelValue(gp, 'throttle', 2);
        const yaw = readChannelValue(gp, 'yaw', 3);
        const mode = readChannelValue(gp, 'mode');
        const arm = readChannelValue(gp, 'arm');
        const magnet = readChannelValue(gp, 'magnet');

        drone.rcChannels[0] = roll;
        drone.rcChannels[1] = pitch;
        drone.rcChannels[2] = throttle;
        drone.rcChannels[3] = yaw;
        drone.rcChannels[4] = mode;
        drone.rcChannels[5] = arm;
        drone.rcChannels[6] = magnet;

        updateBar('roll', roll);
        updateBar('pitch', pitch);
        updateBar('throttle', throttle);
        updateBar('yaw', yaw);

        renderChannelValue('roll', roll);
        renderChannelValue('pitch', pitch);
        renderChannelValue('throttle', throttle);
        renderChannelValue('yaw', yaw);
        renderChannelValue('mode', mode);
        renderChannelValue('arm', arm);
        renderChannelValue('magnet', magnet);
        renderModeMeta(mode);
        renderAuxRangeEditor('arm', arm);
        renderAuxRangeEditor('magnet', magnet);
        renderChannelDataState();
        renderMappingControlsState();

        const magnetActive = matchesAuxRange(magnet, simSettings.gamepadAuxRanges.magnet);
        if (magnetActive && !drone.magnetGripper.active) {
            drone.magnetGripper.active = true;
        } else if (!magnetActive && drone.magnetGripper.active) {
            drone.magnetGripper.active = false;
        }
    };

    const resetDroneChannelsToSafeValues = (): void => {
        const drone = drones[currentDroneId];
        if (!drone) return;
        drone.rcChannels[0] = 1500;
        drone.rcChannels[1] = 1500;
        drone.rcChannels[2] = 1000;
        drone.rcChannels[3] = 1500;
        drone.rcChannels[4] = 1000;
        drone.rcChannels[5] = 1000;
        drone.rcChannels[6] = 1000;
        drone.magnetGripper.active = false;
        renderAuxRangeEditors();
    };

    if (showTracerEl) {
        showTracerEl.checked = simSettings.showTracer;
        showTracerEl.addEventListener('change', () => {
            simSettings.showTracer = showTracerEl.checked;
        });
    }

    if (tracerColorEl) {
        tracerColorEl.value = simSettings.tracerColor;
        tracerColorEl.addEventListener('input', () => {
            simSettings.tracerColor = tracerColorEl.value;
        });
    }

    if (tracerWidthEl) {
        tracerWidthEl.value = simSettings.tracerWidth.toString();
        tracerWidthEl.addEventListener('input', () => {
            simSettings.tracerWidth = parseFloat(tracerWidthEl.value);
        });
    }

    if (tracerShapeEl) {
        tracerShapeEl.value = simSettings.tracerShape;
        tracerShapeEl.addEventListener('change', () => {
            simSettings.tracerShape = tracerShapeEl.value;
        });
    }

    if (showGizmoEl) {
        showGizmoEl.checked = simSettings.showGizmo;
        showGizmoEl.addEventListener('change', () => {
            simSettings.showGizmo = showGizmoEl.checked;
        });
    }

    if (simSpeedEl && simSpeedVal) {
        simSpeedEl.value = simSettings.simSpeed.toString();
        simSpeedVal.textContent = `${simSettings.simSpeed.toFixed(1)}x`;
        simSpeedEl.addEventListener('input', () => {
            simSettings.simSpeed = parseFloat(simSpeedEl.value);
            simSpeedVal.textContent = `${simSettings.simSpeed.toFixed(1)}x`;
        });
    }

    for (const [index, key] of PRIMARY_CHANNELS.entries()) {
        const checkbox = invCheckboxes[key];
        if (!checkbox) continue;
        checkbox.checked = simSettings.gamepadInversion[index];
        checkbox.onchange = () => {
            simSettings.gamepadInversion[index] = checkbox.checked;
        };
    }

    for (const key of ALL_CHANNELS) {
        const button = autoButtons[key];
        if (!button) continue;
        button.onclick = () => {
            startAutoDetection(key);
        };
    }

    if (gpBtnCalibrate) {
        gpBtnCalibrate.onclick = () => {
            const gp = findActiveGamepad();
            if (!gp) return;
            if (isCalibrating) {
                finishCalibration();
            } else {
                beginCalibration(gp);
            }
            renderCalibrationState();
        };
    }

    if (gpBtnResetCal) {
        gpBtnResetCal.onclick = () => {
            isCalibrating = false;
            calibrationStartedAt = 0;
            resetCalibration();
            renderCalibrationState();
        };
    }

    window.addEventListener('gamepadconnected', () => {
        syncConnectionState(findActiveGamepad());
    });

    window.addEventListener('gamepaddisconnected', () => {
        syncConnectionState(findActiveGamepad());
    });

    const updateGamepadState = (): void => {
        const activeGamepad = findActiveGamepad();
        const connectionChanged =
            (activeGamepad?.index ?? null) !== activeGamepadIndex ||
            simSettings.gamepadConnected !== (activeGamepad !== null);

        if (connectionChanged) {
            syncConnectionState(activeGamepad);
        }

        if (activeGamepad) {
            detectAutoInput(activeGamepad);
            updateCalibrationProgress(activeGamepad);
            updateDroneChannels(activeGamepad);
        } else {
            resetDroneChannelsToSafeValues();
            renderChannelDefaults();
        }

        requestAnimationFrame(updateGamepadState);
    };

    resetCalibration();
    initAuxRangeControls();
    renderChannelDefaults();
    renderAutoStatus();
    renderChannelDataState();
    renderMappingControlsState();
    syncConnectionState(findActiveGamepad());
    updateGamepadState();
}
