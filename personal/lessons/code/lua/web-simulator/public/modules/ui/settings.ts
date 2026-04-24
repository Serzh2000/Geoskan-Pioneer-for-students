﻿/**
 * Модуль интерфейса настроек симулятора.
 * Инициализирует вкладку "Настройки", связывая чекбоксы и ползунки
 * с глобальным состоянием `simSettings`. Позволяет управлять отображением
 * трассера, гизмо трансформации, скоростью симуляции и USB-пультом.
 */
import { simSettings, drones, currentDroneId, matchesAuxRange, saveGamepadSettings, type GamepadInputRef } from '../state.js';
import { ALL_CHANNELS, CALIBRATION_DURATION_MS, PRIMARY_CHANNELS, axisRef, buttonRef, clamp, clampRc } from './settings/constants.js';
import { startAutoDetection, detectAutoInput, stopAutoDetection } from './settings/auto-detect.js';
import { bindGamepadSettingsControls, bindGeneralSettingsControls } from './settings/bindings.js';
import { initWizard } from './settings/wizard.js';
import { applyModeRangesFromObserved, getAuxRange, getModeObservedPositions, getObservedStats, setAuxRange } from './settings/channel-ranges.js';
import { beginCalibration as beginCalibrationValues, finishCalibration as finishCalibrationValues, normalizeCenteredAxis, normalizeThrottleAxis, resetCalibration as resetCalibrationValues, sampleCalibration } from './settings/calibration.js';
import { collectSettingsDomRefs } from './settings/dom.js';
import { applyPrimaryAxisMappingForCurrentMode, createAuxOptions, createAxisOptions, ensureMappingsForGamepad, findActiveGamepad as findActiveMappedGamepad, getDefaultChannelValue, getGamepadName, getMappingRef, isAllowedForChannel, readInputRcValue, setMappingRef } from './settings/mapping.js';
import { buildRangesFromPositions, getObservedPositions, rememberObservedInputValue, resetObservedInputStats } from './settings/observed-inputs.js';
import { renderAuxRangeEditors, renderCalibrationState, renderChannelDataState, renderChannelDefaults, renderChannelValue, renderMappingControlsState, renderModeMeta, setAutoStatus, syncSelectWithMapping, updateBar } from './settings/rendering.js';
import { createSettingsRuntimeState } from './settings/runtime-state.js';
import type { ActionAuxChannelKey, ChannelKey, PrimaryChannelKey } from './settings/types.js';

export function initSettingsUI() {
    const dom = collectSettingsDomRefs();
    const state = createSettingsRuntimeState();
    initWizard();

    const hasChannelData = (): boolean => simSettings.gamepadConnected && state.activeGamepadHasChannelData;
    const getObservedStatsForRef = (ref: GamepadInputRef) => getObservedStats(state.observedInputStats, ref);
    const getModePositions = () => getModeObservedPositions(state.observedInputStats, getMappingRef('mode'));
    const findCurrentActiveGamepad = (): Gamepad | null => findActiveMappedGamepad(state.activeGamepadIndex, state.activeGamepadId);
    const setAutoStatusState = (mode: 'idle' | 'listening' | 'success', text: string): void => {
        setAutoStatus(dom, state, mode, text);
    };
    const renderModeMetaState = (liveValue: number): void => {
        renderModeMeta(dom, state, liveValue, getModePositions);
    };
    const renderAuxRangeEditorsState = (): void => {
        renderAuxRangeEditors({
            dom,
            state,
            getMappingRef,
            getAuxRange,
            getDefaultChannelValue,
            getObservedStats: getObservedStatsForRef
        });
    };
    const renderChannelDefaultsState = (): void => {
        renderChannelDefaults({
            dom,
            state,
            getDefaultChannelValue,
            getModePositions,
            getMappingRef,
            getAuxRange,
            getObservedStats: getObservedStatsForRef
        });
    };
    const renderCalibrationStateView = (): void => {
        renderCalibrationState(dom, state);
    };
    const renderChannelDataStateView = (): void => {
        renderChannelDataState(dom, state);
    };
    const renderMappingControlsStateView = (): void => {
        renderMappingControlsState(dom, state);
    };
    const syncSelectWithMappingState = (key: ChannelKey): void => {
        syncSelectWithMapping(dom, key, getMappingRef);
    };

    let lastModePositionsCount = 0;

    const applyStickMode = (): void => {
        const gp = findCurrentActiveGamepad();
        if (!gp) return;
        applyPrimaryAxisMappingForCurrentMode(gp);
        initMappingSelects(gp);
        renderChannelDefaultsState();
    };

    const resetObservedState = (): void => {
        state.activeGamepadHasChannelData = false;
        state.observedInputStats = resetObservedInputStats();
        lastModePositionsCount = 0;
    };

    const sampleObservedInputs = (gp: Gamepad): void => {
        let sampled = false;

        for (let index = 0; index < gp.axes.length; index += 1) {
            const rawValue = gp.axes[index];
            if (!Number.isFinite(rawValue)) continue;
            rememberObservedInputValue(
                state.observedInputStats,
                axisRef(index),
                readInputRcValue(gp, axisRef(index), (value, axisIndex) => normalizeCenteredAxis(simSettings.gamepadCalibration, value, axisIndex))
            );
            sampled = true;
        }

        for (let index = 0; index < gp.buttons.length; index += 1) {
            rememberObservedInputValue(
                state.observedInputStats,
                buttonRef(index),
                readInputRcValue(gp, buttonRef(index), (value, axisIndex) => normalizeCenteredAxis(simSettings.gamepadCalibration, value, axisIndex))
            );
            sampled = true;
        }

        if (sampled) {
            state.activeGamepadHasChannelData = true;
        }
    };

    const resetCalibration = (): void => {
        resetCalibrationValues(simSettings.gamepadCalibration);
    };

    const beginCalibration = (gp: Gamepad): void => {
        state.isCalibrating = true;
        state.calibrationStartedAt = beginCalibrationValues(simSettings.gamepadCalibration, gp);
    };

    const finishCalibration = (): void => {
        state.isCalibrating = false;
        state.calibrationStartedAt = 0;
        finishCalibrationValues(simSettings.gamepadCalibration);
        applyModeRangesFromObserved(state.observedInputStats, getMappingRef('mode'));
        renderModeMetaState(Number(dom.valueEls.mode?.textContent ?? getDefaultChannelValue('mode')));
        renderAuxRangeEditorsState();
    };

    const updateCalibrationProgress = (gp: Gamepad): void => {
        if (!state.isCalibrating) return;

        sampleCalibration(simSettings.gamepadCalibration, gp);
        if (Date.now() - state.calibrationStartedAt >= CALIBRATION_DURATION_MS) {
            finishCalibration();
        }
        renderCalibrationStateView();
    };

    const selectAuxPreset = (key: ActionAuxChannelKey, selectedIndex: number): void => {
        const ranges = buildRangesFromPositions(getObservedPositions(state.observedInputStats, getMappingRef(key)));
        const selectedRange = ranges[selectedIndex];
        if (!selectedRange) return;
        setAuxRange(key, selectedRange);
        renderAuxRangeEditorsState();
        saveGamepadSettings();
    };

    const syncAuxRangeFromControls = (key: ActionAuxChannelKey, source: 'min' | 'max'): void => {
        const controls = dom.auxRangeControls[key];
        if (!controls.minSlider || !controls.maxSlider) return;

        let minValue = Number(controls.minSlider.value);
        let maxValue = Number(controls.maxSlider.value);

        // Bring the active slider to front
        if (source === 'min') {
            controls.minSlider.style.zIndex = '3';
            controls.maxSlider.style.zIndex = '2';
        } else {
            controls.maxSlider.style.zIndex = '3';
            controls.minSlider.style.zIndex = '2';
        }

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
        renderAuxRangeEditorsState();
        saveGamepadSettings();
    };

    const initMappingSelects = (gp: Gamepad): void => {
        ensureMappingsForGamepad(gp, ALL_CHANNELS);
        for (const key of ALL_CHANNELS) {
            const select = dom.mappingSelects[key];
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
                    syncSelectWithMappingState(key);
                    return;
                }
                const nextRef = select.value as GamepadInputRef;
                if (!isAllowedForChannel(key, nextRef)) return;
                setMappingRef(key, nextRef);
                if (key === 'mode') {
                    lastModePositionsCount = 0;
                    applyModeRangesFromObserved(state.observedInputStats, getMappingRef('mode'));
                    renderModeMetaState(Number(dom.valueEls.mode?.textContent ?? getDefaultChannelValue('mode')));
                }
                renderAuxRangeEditorsState();
                saveGamepadSettings();
            };
        }
        renderMappingControlsStateView();
    };

    const syncConnectionState = (gamepad: Gamepad | null): void => {
        const wasConnected = simSettings.gamepadConnected;
        const previousIndex = state.activeGamepadIndex;
        const previousId = state.activeGamepadId;
        simSettings.gamepadConnected = gamepad !== null;
        state.activeGamepadIndex = gamepad?.index ?? null;
        state.activeGamepadId = gamepad?.id ?? null;

        const controllerChanged = (gamepad?.index ?? null) !== previousIndex || (gamepad?.id ?? null) !== previousId;
        if (controllerChanged) {
            resetObservedState();
        }

        if (dom.gamepadStatusEl) {
            if (gamepad) {
                const axisChannels = gamepad.axes.length > 0 ? `CH1-CH${gamepad.axes.length}` : 'нет axis';
                const buttons = gamepad.buttons.length > 0 ? `BTN1-BTN${gamepad.buttons.length}` : 'без кнопок';
                dom.gamepadStatusEl.textContent = `Пульт: ${getGamepadName(gamepad)} | ${axisChannels} | ${buttons} | Stick Mode ${simSettings.gamepadStickMode}`;
                dom.gamepadStatusEl.style.color = '#4ade80';
            } else {
                dom.gamepadStatusEl.textContent = 'Пульт не подключен';
                dom.gamepadStatusEl.style.color = 'var(--text-muted)';
            }
        }

        if (dom.gamepadInfoEl) {
            dom.gamepadInfoEl.style.display = gamepad ? 'block' : 'none';
        }

        if (gamepad && (!wasConnected || controllerChanged)) {
            initMappingSelects(gamepad);
        }

        if (!gamepad && state.isCalibrating) {
            finishCalibration();
        }
        if (!gamepad && state.autoDetectState) {
            stopAutoDetection(state, setAutoStatusState, 'idle', 'Пульт отключён. AUTO-привязка остановлена.');
        }

        renderCalibrationStateView();
        renderChannelDataStateView();
        renderMappingControlsStateView();
        renderModeMetaState(Number(dom.valueEls.mode?.textContent ?? getDefaultChannelValue('mode')));
        renderAuxRangeEditorsState();
    };

    const readChannelValue = (gp: Gamepad, key: ChannelKey, inversionIndex?: number): number => {
        const inputRef = getMappingRef(key);
        const inputIndex = Number(inputRef.slice(1));
        const isAxis = inputRef.startsWith('a');
        const isInverted = inversionIndex !== undefined ? simSettings.gamepadInversion[inversionIndex] : false;

        if (isAxis) {
            const rawValue = gp.axes[inputIndex] ?? 0;
            if (key === 'throttle') {
                let normalized = normalizeThrottleAxis(simSettings.gamepadCalibration, rawValue, inputIndex);
                if (isInverted) normalized = 1 - normalized;
                return clampRc(1000 + normalized * 1000);
            }

            let normalized = normalizeCenteredAxis(simSettings.gamepadCalibration, rawValue, inputIndex);
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

        // Dynamic mode range detection
        const modeRef = getMappingRef('mode');
        const modePositions = getModePositions();
        if (modePositions.length !== lastModePositionsCount) {
            const oldCount = lastModePositionsCount;
            lastModePositionsCount = modePositions.length;
            if (lastModePositionsCount >= 2 && lastModePositionsCount > oldCount) {
                applyModeRangesFromObserved(state.observedInputStats, modeRef);
                renderAuxRangeEditorsState();
                saveGamepadSettings();
            }
        }

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

        updateBar(dom, 'roll', roll);
        updateBar(dom, 'pitch', pitch);
        updateBar(dom, 'throttle', throttle);
        updateBar(dom, 'yaw', yaw);

        renderChannelValue(dom, 'roll', roll);
        renderChannelValue(dom, 'pitch', pitch);
        renderChannelValue(dom, 'throttle', throttle);
        renderChannelValue(dom, 'yaw', yaw);
        renderChannelValue(dom, 'mode', mode);
        renderChannelValue(dom, 'arm', arm);
        renderChannelValue(dom, 'magnet', magnet);
        renderModeMetaState(mode);
        renderAuxRangeEditorsState();
        renderChannelDataStateView();
        renderMappingControlsStateView();

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
        renderAuxRangeEditorsState();
    };

    bindGeneralSettingsControls(dom);
    bindGamepadSettingsControls({
        dom,
        state,
        startAutoDetection: (channel) => startAutoDetection({
            state,
            channel,
            findActiveGamepad: findCurrentActiveGamepad,
            hasChannelData,
            setAutoStatus: setAutoStatusState
        }),
        findActiveGamepad: findCurrentActiveGamepad,
        beginCalibration,
        finishCalibration,
        resetCalibration,
        renderCalibrationState: renderCalibrationStateView,
        applyStickMode,
        syncAuxRangeFromControls,
        selectAuxPreset
    });

    window.addEventListener('gamepadsettingschanged', () => {
        lastModePositionsCount = 0;
        const gp = findCurrentActiveGamepad();
        if (gp) {
            initMappingSelects(gp);
            updateDroneChannels(gp);
        } else {
            renderChannelDefaultsState();
        }
        renderAuxRangeEditorsState();
        renderChannelDataStateView();
        renderMappingControlsStateView();
        renderModeMetaState(Number(dom.valueEls.mode?.textContent ?? getDefaultChannelValue('mode')));
    });

    window.addEventListener('gamepadconnected', () => {
        syncConnectionState(findCurrentActiveGamepad());
    });

    window.addEventListener('gamepaddisconnected', () => {
        syncConnectionState(findCurrentActiveGamepad());
    });

    const updateGamepadState = (): void => {
        const activeGamepad = findCurrentActiveGamepad();
        const connectionChanged =
            (activeGamepad?.index ?? null) !== state.activeGamepadIndex ||
            simSettings.gamepadConnected !== (activeGamepad !== null);

        if (connectionChanged) {
            syncConnectionState(activeGamepad);
        }

        if (activeGamepad) {
            detectAutoInput({
                state,
                gp: activeGamepad,
                setMappingRef,
                syncSelectWithMapping: syncSelectWithMappingState,
                setAutoStatus: setAutoStatusState
            });
            updateCalibrationProgress(activeGamepad);
            updateDroneChannels(activeGamepad);
        } else {
            resetDroneChannelsToSafeValues();
            renderChannelDefaultsState();
        }

        requestAnimationFrame(updateGamepadState);
    };

    resetCalibration();
    renderChannelDefaultsState();
    setAutoStatusState(state.autoStatusMode, state.autoStatusText);
    renderChannelDataStateView();
    renderMappingControlsStateView();
    renderCalibrationStateView();
    syncConnectionState(findCurrentActiveGamepad());
    updateGamepadState();
}
