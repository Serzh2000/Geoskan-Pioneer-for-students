import { simSettings, saveGamepadSettings, type AuxChannelRange, type GamepadInputRef } from '../../state.js';
import { normalizeCenteredAxis, normalizeThrottleAxis } from './calibration.js';
import { clampRc, axisRef, buttonRef } from './constants.js';
import { buildRangesFromPositions, getObservedPositions, pickRepresentativePositions, rememberObservedInputValue, resetObservedInputStats } from './observed-inputs.js';
import type { ChannelKey, ObservedInputPosition, PrimaryChannelKey } from './types.js';

type WizardStepType = 'primary' | 'aux';

interface WizardStep {
    instruction: string;
    channel: ChannelKey;
    type: WizardStepType;
    targetStick: 'L' | 'R' | 'both';
    minPositions?: number;
    preferThreePositions?: boolean;
}

type AxisMotionStats = {
    maxDelta: number;
    travel: number;
    activitySamples: number;
};

type AuxDetectionResult = {
    ref: GamepadInputRef;
    positions: ObservedInputPosition[];
    ranges: AuxChannelRange[];
    selectedRange: AuxChannelRange | null;
};

type AuxDetectionCandidate = AuxDetectionResult & {
    transitions: number;
    requiredTransitions: number;
    score: number;
    hasEnoughPositions: boolean;
    looksLikeSwitch: boolean;
    hasMiddlePosition: boolean;
};

const SETTINGS_CHANGED_EVENT = 'gamepadsettingschanged';

const STEPS: WizardStep[] = [
    { instruction: 'Подвигайте стик ГАЗА (Throttle) вверх и вниз', channel: 'throttle', type: 'primary', targetStick: 'L' },
    { instruction: 'Подвигайте стик ЯВА (Yaw) влево и вправо', channel: 'yaw', type: 'primary', targetStick: 'L' },
    { instruction: 'Подвигайте стик ТАНГАЖА (Pitch) вверх и вниз', channel: 'pitch', type: 'primary', targetStick: 'R' },
    { instruction: 'Подвигайте стик КРЕНА (Roll) влево и вправо', channel: 'roll', type: 'primary', targetStick: 'R' },
    { instruction: 'Пощелкайте тумблер РЕЖИМА (Mode) по всем положениям', channel: 'mode', type: 'aux', targetStick: 'both', minPositions: 3, preferThreePositions: true },
    { instruction: 'Пощелкайте тумблер ARM (Взвод) по всем положениям', channel: 'arm', type: 'aux', targetStick: 'both', minPositions: 2 },
    { instruction: 'Нажмите или пощелкайте канал МАГНИТА (Magnet)', channel: 'magnet', type: 'aux', targetStick: 'both', minPositions: 2 }
];

const CHANNEL_LABELS: Record<ChannelKey, string> = {
    roll: 'Roll',
    pitch: 'Pitch',
    throttle: 'Throttle',
    yaw: 'Yaw',
    mode: 'Mode',
    arm: 'Arm',
    magnet: 'Magnet'
};

const DETACHED_AXIS_REF = 'a999' as GamepadInputRef;
const DETACHED_BUTTON_REF = 'b999' as GamepadInputRef;
const DISABLED_RANGE = { min: 2000, max: 2000, center: 2000 } as AuxChannelRange;

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
let auxResults: Partial<Record<'mode' | 'arm' | 'magnet', AuxDetectionResult>> = {};

export function initWizard() {
    const btn = document.getElementById('gp-btn-wizard');
    const overlay = document.getElementById('gp-wizard-overlay');
    const closeBtn = document.getElementById('gp-wizard-close');
    const nextBtn = document.getElementById('gp-wizard-next') as HTMLButtonElement | null;
    const prevBtn = document.getElementById('gp-wizard-prev') as HTMLButtonElement | null;

    if (!btn || !overlay || !closeBtn || !nextBtn || !prevBtn) return;

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
}

function startWizard() {
    isWizardActive = true;
    showingSummary = false;
    currentStepIdx = 0;
    resetWizardBindings();
    detectedMapping = {};
    auxResults = {};
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

function resetWizardBindings() {
    simSettings.gamepadMapping.roll = DETACHED_AXIS_REF;
    simSettings.gamepadMapping.pitch = DETACHED_AXIS_REF;
    simSettings.gamepadMapping.throttle = DETACHED_BUTTON_REF;
    simSettings.gamepadMapping.yaw = DETACHED_AXIS_REF;
    simSettings.gamepadMapping.modeSwitch = DETACHED_BUTTON_REF;
    simSettings.gamepadMapping.armSwitch = DETACHED_BUTTON_REF;
    simSettings.gamepadMapping.magnetBtn = DETACHED_BUTTON_REF;

    simSettings.gamepadAuxRanges.arm = { ...DISABLED_RANGE };
    simSettings.gamepadAuxRanges.magnet = { ...DISABLED_RANGE };
    simSettings.gamepadModeRanges.loiter = { ...DISABLED_RANGE };
    simSettings.gamepadModeRanges.althold = { ...DISABLED_RANGE };
    simSettings.gamepadModeRanges.stabilize = { ...DISABLED_RANGE };
}

function getCurrentStep(): WizardStep {
    return STEPS[currentStepIdx];
}

function getFirstConnectedGamepad(): Gamepad | null {
    if (typeof navigator.getGamepads !== 'function') return null;
    const connected = Array.from(navigator.getGamepads()).filter((gp): gp is Gamepad => gp !== null);
    return connected[0] ?? null;
}

function getMappingRefForChannel(channel: ChannelKey): GamepadInputRef {
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

function getUsedRefs(exceptChannel?: ChannelKey): Set<GamepadInputRef> {
    const used = new Set<GamepadInputRef>();
    for (const [channel, ref] of Object.entries(detectedMapping) as Array<[ChannelKey, GamepadInputRef | undefined]>) {
        if (!ref || channel === exceptChannel) continue;
        used.add(ref);
    }
    return used;
}

function getDetectedRef(channel: ChannelKey): GamepadInputRef | null {
    return detectedMapping[channel] ?? null;
}

function getAuxCandidate(step: WizardStep, ref: GamepadInputRef): AuxDetectionCandidate | null {
    const positions = getObservedPositions(stepObservedStats, ref);
    const stablePositions = step.preferThreePositions && positions.length > 3
        ? pickRepresentativePositions(positions, 3)
        : positions;
    const ranges = buildRangesFromPositions(stablePositions);
    const stats = stepObservedStats.get(ref);
    if (!stats) return null;

    const minPositions = step.minPositions ?? 2;
    const span = stats.maxRc - stats.minRc;
    const transitions = stepSwitchTransitions.get(ref) ?? 0;
    const requiredTransitions = Math.max(1, minPositions - 1);
    const positionCount = stablePositions.length;
    const hasEnoughPositions = positionCount >= minPositions;
    const looksLikeSwitch = span >= 250 || ref.startsWith('b');
    const hasMiddlePosition = stablePositions.some((position) => Math.abs(position.centerRc - 1500) <= 150);
    const selectedRange = step.channel === 'mode'
        ? null
        : ranges[ranges.length - 1] ?? null;
    const score = transitions * 20000 + positionCount * 10000 + span * 10 + Math.min(stats.samples, 999);

    return {
        ref,
        positions: stablePositions,
        ranges,
        selectedRange,
        transitions,
        requiredTransitions,
        score,
        hasEnoughPositions,
        looksLikeSwitch,
        hasMiddlePosition
    };
}

function isBetterAuxCandidate(
    step: WizardStep,
    candidate: AuxDetectionCandidate,
    bestCandidate: AuxDetectionCandidate | null,
    requireResolved: boolean
): boolean {
    if (!bestCandidate) return true;

    if (!requireResolved) {
        if (candidate.hasEnoughPositions !== bestCandidate.hasEnoughPositions) {
            return candidate.hasEnoughPositions;
        }
        if (step.preferThreePositions && candidate.hasMiddlePosition !== bestCandidate.hasMiddlePosition) {
            return candidate.hasMiddlePosition;
        }
        if (candidate.positions.length !== bestCandidate.positions.length) {
            return candidate.positions.length > bestCandidate.positions.length;
        }
        if (step.preferThreePositions && candidate.ref.startsWith('a') !== bestCandidate.ref.startsWith('a')) {
            return candidate.ref.startsWith('a');
        }
        if (candidate.looksLikeSwitch !== bestCandidate.looksLikeSwitch) {
            return candidate.looksLikeSwitch;
        }
        if (candidate.transitions !== bestCandidate.transitions) {
            return candidate.transitions > bestCandidate.transitions;
        }
    }

    return candidate.score > bestCandidate.score;
}

function getBestAuxCandidate(step: WizardStep, requireResolved: boolean): AuxDetectionCandidate | null {
    const gp = getFirstConnectedGamepad();
    if (!gp) return null;

    const usedRefs = getUsedRefs(step.channel);
    let bestCandidate: AuxDetectionCandidate | null = null;

    const refs: GamepadInputRef[] = [
        ...gp.axes.map((_, index) => axisRef(index)),
        ...gp.buttons.map((_, index) => buttonRef(index))
    ];

    for (const ref of refs) {
        if (usedRefs.has(ref)) continue;

        const candidate = getAuxCandidate(step, ref);
        if (!candidate) continue;
        if (requireResolved && (!candidate.hasEnoughPositions || !candidate.looksLikeSwitch || candidate.transitions < candidate.requiredTransitions)) {
            continue;
        }

        if (isBetterAuxCandidate(step, candidate, bestCandidate, requireResolved)) {
            bestCandidate = candidate;
        }
    }

    return bestCandidate;
}

function isCurrentStepResolved(): boolean {
    return getDetectedRef(getCurrentStep().channel) !== null;
}

function renderWizardState() {
    const instruction = document.getElementById('gp-wizard-instruction');
    const status = document.getElementById('gp-wizard-status');
    const nextBtn = document.getElementById('gp-wizard-next') as HTMLButtonElement | null;
    const prevBtn = document.getElementById('gp-wizard-prev') as HTMLButtonElement | null;
    const stepContainer = document.getElementById('gp-wizard-step-container');
    const summaryContainer = document.getElementById('gp-wizard-summary');
    const summaryContent = document.getElementById('gp-wizard-summary-content');
    const stickLeft = document.getElementById('gp-wizard-stick-l');
    const stickRight = document.getElementById('gp-wizard-stick-r');

    if (!instruction || !status || !nextBtn || !prevBtn || !stepContainer || !summaryContainer || !summaryContent) return;

    if (showingSummary) {
        stepContainer.style.display = 'none';
        summaryContainer.style.display = 'block';
        summaryContent.innerHTML = buildSummaryHtml();
        instruction.textContent = 'Сводка по найденным каналам';
        status.textContent = 'Проверьте найденные каналы и нажмите "Применить".';
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        nextBtn.textContent = 'Применить';
        if (stickLeft) stickLeft.classList.remove('is-active');
        if (stickRight) stickRight.classList.remove('is-active');
        return;
    }

    stepContainer.style.display = 'block';
    summaryContainer.style.display = 'none';

    const step = getCurrentStep();
    const targetStick = getStepTargetStick(step);
    instruction.textContent = step.instruction;
    status.textContent = getStepStatusText(step);
    prevBtn.disabled = currentStepIdx === 0;
    nextBtn.disabled = !isCurrentStepResolved();
    nextBtn.textContent = currentStepIdx === STEPS.length - 1 ? 'Показать сводку' : 'Далее';

    if (stickLeft) stickLeft.classList.toggle('is-active', targetStick === 'L');
    if (stickRight) stickRight.classList.toggle('is-active', targetStick === 'R');
    if (targetStick === 'both') {
        if (stickLeft) stickLeft.classList.add('is-active');
        if (stickRight) stickRight.classList.add('is-active');
    }
}

function getStepTargetStick(step: WizardStep): 'L' | 'R' | 'both' {
    if (step.type === 'aux') return 'both';

    switch (simSettings.gamepadStickMode) {
        case 1:
            return step.channel === 'pitch' || step.channel === 'roll' ? 'R' : 'L';
        case 2:
            return step.channel === 'pitch' || step.channel === 'roll' ? 'R' : 'L';
        case 3:
            return step.channel === 'pitch' || step.channel === 'roll' ? 'L' : 'R';
        case 4:
            return step.channel === 'pitch' || step.channel === 'roll' ? 'L' : 'R';
        default:
            return step.targetStick;
    }
}

function getStepStatusText(step: WizardStep): string {
    const ref = getDetectedRef(step.channel);
    if (!ref) {
        if (step.type === 'aux') {
            const requiredPositions = step.minPositions ?? 2;
            const candidate = getBestAuxCandidate(step, false);
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

    const auxResult = auxResults[step.channel as 'mode' | 'arm' | 'magnet'];
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

        updateStickVisuals(gp);

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
        detectPrimaryAxis(gp, step.channel as PrimaryChannelKey);
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

function detectPrimaryAxis(gp: Gamepad, channel: PrimaryChannelKey) {
    const usedRefs = getUsedRefs(channel);
    let bestRef: GamepadInputRef | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMaxDelta = 0;

    for (let index = 0; index < gp.axes.length; index += 1) {
        const value = gp.axes[index] ?? 0;
        const baseline = stepBaselineAxes[index] ?? 0;
        const last = stepLastAxes[index] ?? baseline;
        const stats = stepAxisStats[index];
        const deltaFromBaseline = Math.abs(value - baseline);
        const deltaFromLast = Math.abs(value - last);

        stats.maxDelta = Math.max(stats.maxDelta, deltaFromBaseline);
        stats.travel += deltaFromLast;
        if (deltaFromBaseline >= 0.12) {
            stats.activitySamples += 1;
        }
        stepLastAxes[index] = value;

        const ref = axisRef(index);
        if (usedRefs.has(ref)) continue;

        const score = stats.maxDelta * 4 + stats.travel + stats.activitySamples * 0.04;
        if (score > bestScore) {
            bestScore = score;
            bestRef = ref;
            bestMaxDelta = stats.maxDelta;
        }
    }

    if (!bestRef || (bestMaxDelta < 0.35 && bestScore < 1.1)) return;
    detectedMapping[channel] = bestRef;
}

function detectAuxInput(gp: Gamepad, step: WizardStep) {
    for (let index = 0; index < gp.axes.length; index += 1) {
        const ref = axisRef(index);
        const rawValue = gp.axes[index] ?? 0;
        const normalized = normalizeCenteredAxis(simSettings.gamepadCalibration, rawValue, index);
        const rcValue = clampRc(1500 + normalized * 500);
        rememberObservedInputValue(stepObservedStats, ref, rcValue);
        rememberSwitchTransition(ref, rcValue);
    }

    for (let index = 0; index < gp.buttons.length; index += 1) {
        const ref = buttonRef(index);
        const buttonValue = Math.max(0, Math.min(1, gp.buttons[index]?.value ?? 0));
        const rcValue = clampRc(1000 + buttonValue * 1000);
        rememberObservedInputValue(stepObservedStats, ref, rcValue);
        rememberSwitchTransition(ref, rcValue);
    }

    const bestResult = getBestAuxCandidate(step, true);

    if (!bestResult) return;

    detectedMapping[step.channel] = bestResult.ref;
    auxResults[step.channel as 'mode' | 'arm' | 'magnet'] = bestResult;
}

function rememberSwitchTransition(ref: GamepadInputRef, rcValue: number) {
    const previousValue = stepLastSwitchValues.get(ref);
    if (previousValue === undefined) {
        stepLastSwitchValues.set(ref, rcValue);
        return;
    }

    if (Math.abs(previousValue - rcValue) >= 140) {
        stepSwitchTransitions.set(ref, (stepSwitchTransitions.get(ref) ?? 0) + 1);
        stepLastSwitchValues.set(ref, rcValue);
    }
}

function updateStickVisuals(gp: Gamepad) {
    const dotLeft = document.getElementById('gp-wizard-dot-l');
    const dotRight = document.getElementById('gp-wizard-dot-r');
    if (!dotLeft || !dotRight) return;

    const step = getCurrentStep();
    const liveRefForCurrentStep = getDetectedRef(step.channel);
    const leftX = getVisualChannelValue(gp, 'yaw', step.channel === 'yaw' ? liveRefForCurrentStep : null);
    const leftY = getVisualChannelValue(gp, 'throttle', step.channel === 'throttle' ? liveRefForCurrentStep : null);
    const rightX = getVisualChannelValue(gp, 'roll', step.channel === 'roll' ? liveRefForCurrentStep : null);
    const rightY = getVisualChannelValue(gp, 'pitch', step.channel === 'pitch' ? liveRefForCurrentStep : null);

    dotLeft.style.left = `${50 + leftX * 40}%`;
    dotLeft.style.top = `${50 + leftY * 40}%`;
    dotRight.style.left = `${50 + rightX * 40}%`;
    dotRight.style.top = `${50 + rightY * 40}%`;
}

function getVisualChannelValue(gp: Gamepad, channel: PrimaryChannelKey, liveOverride: GamepadInputRef | null): number {
    const ref = liveOverride ?? detectedMapping[channel] ?? null;
    if (!ref) return 0;
    return getNormalizedRefValue(gp, ref, channel);
}

function getNormalizedRefValue(gp: Gamepad, ref: GamepadInputRef, channel: ChannelKey): number {
    const index = Number(ref.slice(1));
    if (ref.startsWith('b')) {
        const buttonValue = Math.max(0, Math.min(1, gp.buttons[index]?.value ?? 0));
        if (channel === 'throttle') return 1 - buttonValue * 2;
        return buttonValue * 2 - 1;
    }

    const rawValue = gp.axes[index] ?? 0;
    if (channel === 'throttle') {
        const normalized = normalizeThrottleAxis(simSettings.gamepadCalibration, rawValue, index);
        return 1 - normalized * 2;
    }

    return normalizeCenteredAxis(simSettings.gamepadCalibration, rawValue, index);
}

function buildSummaryHtml(): string {
    const primaryRows = (['throttle', 'yaw', 'pitch', 'roll'] as PrimaryChannelKey[])
        .map((channel) => {
            const ref = detectedMapping[channel];
            const value = ref ? formatRefLabel(ref) : 'не найдено';
            return `<div class="gp-wizard-summary-row"><span>${CHANNEL_LABELS[channel]}</span><strong>${value}</strong></div>`;
        })
        .join('');

    const auxRows = (['mode', 'arm', 'magnet'] as Array<'mode' | 'arm' | 'magnet'>)
        .map((channel) => {
            const result = auxResults[channel];
            const refText = result ? formatRefLabel(result.ref) : 'не найдено';
            const positionsText = result?.positions.length
                ? result.positions.map((position) => position.centerRc).join(' / ')
                : 'нет зафиксированных положений';
            const rangeText = channel === 'mode'
                ? formatModeRanges()
                : formatAuxRange(result?.selectedRange ?? null);
            return `
                <div class="gp-wizard-summary-card">
                    <div class="gp-wizard-summary-card-title">${CHANNEL_LABELS[channel]}</div>
                    <div class="gp-wizard-summary-row"><span>Вход</span><strong>${refText}</strong></div>
                    <div class="gp-wizard-summary-row"><span>Положения</span><strong>${positionsText}</strong></div>
                    <div class="gp-wizard-summary-note">${rangeText}</div>
                </div>
            `;
        })
        .join('');

    return `
        <div class="gp-wizard-summary-grid">
            <div class="gp-wizard-summary-card">
                <div class="gp-wizard-summary-card-title">Основные каналы</div>
                ${primaryRows}
            </div>
            ${auxRows}
        </div>
    `;
}

function formatModeRanges(): string {
    const ranges = auxResults.mode?.ranges ?? [];
    const selected = ranges.length > 3 ? pickRepresentativePositions(auxResults.mode?.positions ?? [], 3) : auxResults.mode?.positions ?? [];
    const preparedRanges = buildRangesFromPositions(selected);
    if (preparedRanges.length < 2) {
        return 'Недостаточно данных для диапазонов Mode.';
    }

    const loiter = preparedRanges[0];
    const althold = preparedRanges[Math.min(1, preparedRanges.length - 1)];
    const stabilize = preparedRanges[Math.min(2, preparedRanges.length - 1)];
    return `LOITER ${formatAuxRange(loiter)} | ALTHOLD ${formatAuxRange(althold)} | STABILIZE ${formatAuxRange(stabilize)}`;
}

function formatAuxRange(range: AuxChannelRange | null): string {
    if (!range) return 'Диапазон не определен';
    return `${range.min}-${range.max}`;
}

function formatRefLabel(ref: GamepadInputRef): string {
    const index = Number(ref.slice(1));
    if (ref.startsWith('a')) {
        return `Axis ${index} / CH${index + 1}`;
    }
    return `Button ${index + 1}`;
}

function finishWizard() {
    for (const channel of ['roll', 'pitch', 'throttle', 'yaw', 'mode', 'arm', 'magnet'] as ChannelKey[]) {
        const ref = detectedMapping[channel];
        if (ref) {
            setMappingRefForChannel(channel, ref);
        }
    }

    applyAuxResults();
    saveGamepadSettings();
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGED_EVENT));

    const overlay = document.getElementById('gp-wizard-overlay');
    if (overlay) overlay.style.display = 'none';
    stopWizard();
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
