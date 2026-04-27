import { simSettings, saveGamepadSettings, type GamepadInputRef } from '../../state.js';
import { INVERTIBLE_CHANNELS, getChannelInversionIndex } from './constants.js';
import {
    buildRangesFromPositions,
    pickRepresentativePositions,
    rememberObservedInputValue,
    resetObservedInputStats
} from './observed-inputs.js';
import type { ChannelKey, PrimaryChannelKey } from './types.js';
import { CHANNEL_LABELS, SETTINGS_CHANGED_EVENT, STEPS } from './wizard-config.js';
import {
    detectPrimaryAxis,
    getAuxStepRcValue,
    getBestAuxCandidate,
    getUsedRefs,
    rememberSwitchTransition
} from './wizard-detection.js';
import { WizardPreviewController } from './wizard-preview.js';
import { buildSummaryHtml, formatRefLabel } from './wizard-summary.js';
import type {
    AuxDetectionResult,
    AxisMotionStats,
    WizardAuxChannelKey,
    WizardChannelState,
    WizardStep
} from './wizard-types.js';

let currentStepIdx = 0;
let isWizardActive = false;
let showingSummary = false;
let stepBaselineAxes: number[] = [];
let stepLastAxes: number[] = [];
let stepAxisStats: AxisMotionStats[] = [];
let stepObservedStats = resetObservedInputStats();
let stepLastSwitchValues = new Map<GamepadInputRef, number>();
let stepSwitchTransitions = new Map<GamepadInputRef, number>();
let detectedMapping: Partial<Record<ChannelKey, GamepadInputRef>> = {};
let auxResults: Partial<Record<WizardAuxChannelKey, AuxDetectionResult>> = {};
let wizardDraftInversion = createWizardDraftInversion();

const previewController = new WizardPreviewController({
    getCurrentStep,
    getDetectedRef,
    getStoredMappingRef,
    getChannelInversion
});

export function initWizard() {
    const btn = document.getElementById('gp-btn-wizard');
    const overlay = document.getElementById('gp-wizard-overlay');
    const closeBtn = document.getElementById('gp-wizard-close');
    const nextBtn = document.getElementById('gp-wizard-next') as HTMLButtonElement | null;
    const prevBtn = document.getElementById('gp-wizard-prev') as HTMLButtonElement | null;
    const invertCheckbox = document.getElementById('gp-wizard-invert') as HTMLInputElement | null;

    if (!btn || !overlay || !closeBtn || !nextBtn || !prevBtn || !invertCheckbox) return;

    btn.onclick = () => {
        overlay.style.display = 'flex';
        startWizard();
    };

    closeBtn.onclick = () => {
        overlay.style.display = 'none';
        stopWizard();
    };

    nextBtn.onclick = () => {
        if (showingSummary) {
            finishWizard();
            return;
        }

        if (!isCurrentStepResolved()) return;

        if (currentStepIdx < STEPS.length - 1) {
            currentStepIdx += 1;
            prepareCurrentStep();
            renderWizardState();
            return;
        }

        showingSummary = true;
        renderWizardState();
    };

    prevBtn.onclick = () => {
        if (showingSummary) {
            showingSummary = false;
            renderWizardState();
            return;
        }

        if (currentStepIdx === 0) return;
        currentStepIdx -= 1;
        prepareCurrentStep();
        renderWizardState();
    };

    invertCheckbox.onchange = () => {
        const channelState = getCurrentChannelState();
        const inversionIndex = channelState ? getChannelInversionIndex(channelState.channel) : -1;
        if (inversionIndex < 0) return;
        wizardDraftInversion[inversionIndex] = invertCheckbox.checked;
        renderWizardState();
    };

    window.addEventListener('resize', () => previewController.syncSize());
}

function startWizard() {
    isWizardActive = true;
    showingSummary = false;
    currentStepIdx = 0;
    detectedMapping = {};
    auxResults = {};
    wizardDraftInversion = createWizardDraftInversion();
    previewController.ensureScene();
    prepareCurrentStep();
    renderWizardState();
    requestAnimationFrame(wizardLoop);
}

function stopWizard() {
    isWizardActive = false;
    showingSummary = false;
}

function prepareCurrentStep() {
    stepBaselineAxes = [];
    stepLastAxes = [];
    stepAxisStats = [];
    stepObservedStats = resetObservedInputStats();
    stepLastSwitchValues = new Map<GamepadInputRef, number>();
    stepSwitchTransitions = new Map<GamepadInputRef, number>();
}

function getCurrentStep(): WizardStep {
    return STEPS[currentStepIdx];
}

function getFirstConnectedGamepad(): Gamepad | null {
    if (typeof navigator.getGamepads !== 'function') return null;
    const connected = Array.from(navigator.getGamepads()).filter((gp): gp is Gamepad => gp !== null);
    return connected[0] ?? null;
}

function createWizardDraftInversion(): boolean[] {
    return INVERTIBLE_CHANNELS.map((_, index) => !!simSettings.gamepadInversion[index]);
}

function setMappingRefForChannel(channel: ChannelKey, ref: GamepadInputRef) {
    switch (channel) {
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
}

function getDetectedRef(channel: ChannelKey): GamepadInputRef | null {
    return detectedMapping[channel] ?? null;
}

function isCurrentStepResolved(): boolean {
    return getDetectedRef(getCurrentStep().channel) !== null;
}

function getChannelInversion(channel: ChannelKey): boolean {
    const inversionIndex = getChannelInversionIndex(channel);
    return inversionIndex >= 0 ? !!wizardDraftInversion[inversionIndex] : false;
}

function getCurrentChannelState(): WizardChannelState | null {
    const step = getCurrentStep();
    return {
        channel: step.channel,
        label: CHANNEL_LABELS[step.channel],
        inverted: getChannelInversion(step.channel),
        type: step.type
    };
}

function renderWizardState() {
    const instruction = document.getElementById('gp-wizard-instruction');
    const status = document.getElementById('gp-wizard-status');
    const nextBtn = document.getElementById('gp-wizard-next') as HTMLButtonElement | null;
    const prevBtn = document.getElementById('gp-wizard-prev') as HTMLButtonElement | null;
    const stepContainer = document.getElementById('gp-wizard-step-container');
    const summaryContainer = document.getElementById('gp-wizard-summary');
    const summaryContent = document.getElementById('gp-wizard-summary-content');
    const axisLabel = document.getElementById('gp-wizard-axis-label');
    const axisHint = document.getElementById('gp-wizard-axis-hint');
    const primaryControls = document.getElementById('gp-wizard-primary-controls');
    const invertCheckbox = document.getElementById('gp-wizard-invert') as HTMLInputElement | null;
    const leftStickCard = document.getElementById('gp-wizard-stick-card-left');
    const rightStickCard = document.getElementById('gp-wizard-stick-card-right');

    if (!instruction || !status || !nextBtn || !prevBtn || !stepContainer || !summaryContainer || !summaryContent || !axisLabel || !axisHint || !primaryControls || !invertCheckbox || !leftStickCard || !rightStickCard) return;

    if (showingSummary) {
        stepContainer.style.display = 'none';
        summaryContainer.style.display = 'block';
        summaryContent.innerHTML = buildSummaryHtml({
            detectedMapping,
            auxResults,
            getChannelInversion
        });
        instruction.textContent = 'Сводка по найденным каналам';
        status.textContent = 'Проверьте найденные каналы и нажмите "Применить".';
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        nextBtn.textContent = 'Применить';
        axisLabel.textContent = 'Проверка каналов';
        axisHint.textContent = 'Итоговые инверсии и сопоставления будут сохранены и сразу применены к управлению.';
        primaryControls.hidden = true;
        leftStickCard.classList.remove('is-active');
        rightStickCard.classList.remove('is-active');
        return;
    }

    stepContainer.style.display = 'block';
    summaryContainer.style.display = 'none';

    const step = getCurrentStep();
    const channelState = getCurrentChannelState();
    instruction.textContent = step.instruction;
    status.textContent = getStepStatusText(step);
    prevBtn.disabled = currentStepIdx === 0;
    nextBtn.disabled = !isCurrentStepResolved();
    nextBtn.textContent = currentStepIdx === STEPS.length - 1 ? 'Показать сводку' : 'Далее';
    axisLabel.textContent = CHANNEL_LABELS[step.channel];
    axisHint.textContent = step.type === 'primary'
        ? `Если ${CHANNEL_LABELS[step.channel].toLowerCase()} на модели и на стиках движется наоборот, включите инверсию канала.`
        : `Если положения канала ${CHANNEL_LABELS[step.channel].toLowerCase()} идут в обратном порядке, включите инверсию до перехода дальше.`;
    primaryControls.hidden = false;
    invertCheckbox.checked = channelState?.inverted ?? false;
    leftStickCard.classList.toggle('is-active', step.targetStick === 'L' || step.targetStick === 'both');
    rightStickCard.classList.toggle('is-active', step.targetStick === 'R' || step.targetStick === 'both');
}

function getStepStatusText(step: WizardStep): string {
    const ref = getDetectedRef(step.channel);
    if (!ref) {
        if (step.type === 'aux') {
            const requiredPositions = step.minPositions ?? 2;
            const candidate = getBestAuxCandidate({
                gp: getFirstConnectedGamepad(),
                step,
                requireResolved: false,
                detectedMapping,
                stepObservedStats,
                stepSwitchTransitions
            });
            if (!candidate) {
                return `Ожидание переключений... Нужно зафиксировать минимум ${requiredPositions} положения.`;
            }
            const positionsText = candidate.positions.length > 0
                ? candidate.positions.map((position) => position.centerRc).join(' / ')
                : 'нет данных';
            if (step.preferThreePositions && !candidate.hasMiddlePosition) {
                return `Ожидание переключений... Пока видны только крайние положения ${positionsText}. Нужно среднее положение около 1500.`;
            }
            return `Ожидание переключений... Зафиксировано положений ${candidate.positions.length}/${requiredPositions}, переключений ${candidate.transitions}/${candidate.requiredTransitions}. Кандидат: ${formatRefLabel(candidate.ref)}. Положения: ${positionsText}.`;
        }
        return 'Ожидание движения...';
    }

    if (step.type === 'primary') {
        return `Обнаружено: ${formatRefLabel(ref)}. Можно переходить дальше.`;
    }

    const auxResult = auxResults[step.channel as WizardAuxChannelKey];
    const positionsText = auxResult?.positions.map((position) => position.centerRc).join(' / ') ?? 'нет данных';
    return `Обнаружено: ${formatRefLabel(ref)}. Положения: ${positionsText}.`;
}

function wizardLoop() {
    if (!isWizardActive) return;

    const gp = getFirstConnectedGamepad();
    if (gp) {
        if (stepBaselineAxes.length !== gp.axes.length) {
            stepBaselineAxes = gp.axes.map((value) => value ?? 0);
            stepLastAxes = gp.axes.map((value) => value ?? 0);
            stepAxisStats = gp.axes.map(() => ({
                maxDelta: 0,
                travel: 0,
                activitySamples: 0
            }));
        }

        previewController.update(gp);

        if (!showingSummary) {
            sampleCurrentStep(gp);
            renderWizardState();
        }
    }

    requestAnimationFrame(wizardLoop);
}

function sampleCurrentStep(gp: Gamepad) {
    const step = getCurrentStep();
    if (step.type === 'primary') {
        detectPrimaryInput(gp, step.channel as PrimaryChannelKey);
        if (currentStepIdx === STEPS.length - 1 && isCurrentStepResolved()) {
            showingSummary = true;
        }
        return;
    }

    detectAuxInput(gp, step);
    if (currentStepIdx === STEPS.length - 1 && isCurrentStepResolved()) {
        showingSummary = true;
    }
}

function detectPrimaryInput(gp: Gamepad, channel: PrimaryChannelKey) {
    const bestRef = detectPrimaryAxis({
        gp,
        stepBaselineAxes,
        stepLastAxes,
        stepAxisStats,
        usedRefs: getUsedRefs(detectedMapping, channel)
    });
    if (bestRef) {
        detectedMapping[channel] = bestRef;
    }
}

function detectAuxInput(gp: Gamepad, step: WizardStep) {
    const channel = step.channel as WizardAuxChannelKey;
    const isInverted = getChannelInversion(channel);

    for (let index = 0; index < gp.axes.length; index += 1) {
        const ref = `a${index}` as GamepadInputRef;
        const rcValue = getAuxStepRcValue(gp, ref, channel, isInverted);
        rememberObservedInputValue(stepObservedStats, ref, rcValue);
        rememberSwitchTransition(stepLastSwitchValues, stepSwitchTransitions, ref, rcValue);
    }

    for (let index = 0; index < gp.buttons.length; index += 1) {
        const ref = `b${index}` as GamepadInputRef;
        const rcValue = getAuxStepRcValue(gp, ref, channel, isInverted);
        rememberObservedInputValue(stepObservedStats, ref, rcValue);
        rememberSwitchTransition(stepLastSwitchValues, stepSwitchTransitions, ref, rcValue);
    }

    const bestResult = getBestAuxCandidate({
        gp,
        step,
        requireResolved: true,
        detectedMapping,
        stepObservedStats,
        stepSwitchTransitions
    });
    if (!bestResult) return;

    detectedMapping[channel] = bestResult.ref;
    auxResults[channel] = bestResult;
}

function finishWizard() {
    for (const channel of ['roll', 'pitch', 'throttle', 'yaw', 'mode', 'arm', 'magnet'] as ChannelKey[]) {
        const ref = detectedMapping[channel];
        if (ref) {
            setMappingRefForChannel(channel, ref);
        }
    }

    applyChannelInversion();
    applyAuxResults();
    saveGamepadSettings();
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGED_EVENT));

    const overlay = document.getElementById('gp-wizard-overlay');
    if (overlay) overlay.style.display = 'none';
    stopWizard();
}

function applyChannelInversion() {
    for (const channel of INVERTIBLE_CHANNELS) {
        const inversionIndex = getChannelInversionIndex(channel);
        if (inversionIndex < 0) continue;
        simSettings.gamepadInversion[inversionIndex] = wizardDraftInversion[inversionIndex] ?? false;
    }
}

function applyAuxResults() {
    const modeResult = auxResults.mode;
    if (modeResult) {
        const positions = modeResult.positions.length > 3
            ? pickRepresentativePositions(modeResult.positions, 3)
            : modeResult.positions;
        const ranges = buildRangesFromPositions(positions);
        if (ranges.length >= 2) {
            simSettings.gamepadModeRanges.loiter = ranges[0];
            simSettings.gamepadModeRanges.althold = ranges[Math.min(1, ranges.length - 1)];
            simSettings.gamepadModeRanges.stabilize = ranges[Math.min(2, ranges.length - 1)];
        }
    }

    if (auxResults.arm?.selectedRange) {
        simSettings.gamepadAuxRanges.arm = auxResults.arm.selectedRange;
    }

    if (auxResults.magnet?.selectedRange) {
        simSettings.gamepadAuxRanges.magnet = auxResults.magnet.selectedRange;
    }
}

function getStoredMappingRef(channel: ChannelKey): GamepadInputRef | null {
    switch (channel) {
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
}

