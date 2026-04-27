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

type PrimaryChannelState = {
    channel: PrimaryChannelKey;
    label: string;
    inverted: boolean;
};

const SETTINGS_CHANGED_EVENT = 'gamepadsettingschanged';

const STEPS: WizardStep[] = [
    { instruction: 'Подвигайте стик газа вверх и вниз', channel: 'throttle', type: 'primary', targetStick: 'L' },
    { instruction: 'Подвигайте стик рыскания влево и вправо', channel: 'yaw', type: 'primary', targetStick: 'L' },
    { instruction: 'Подвигайте стик тангажа вверх и вниз', channel: 'pitch', type: 'primary', targetStick: 'R' },
    { instruction: 'Подвигайте стик крена влево и вправо', channel: 'roll', type: 'primary', targetStick: 'R' },
    { instruction: 'Пощелкайте тумблер режима по всем положениям', channel: 'mode', type: 'aux', targetStick: 'both', minPositions: 3, preferThreePositions: true },
    { instruction: 'Пощелкайте тумблер взвода по всем положениям', channel: 'arm', type: 'aux', targetStick: 'both', minPositions: 2 },
    { instruction: 'Нажмите или пощелкайте канал магнита', channel: 'magnet', type: 'aux', targetStick: 'both', minPositions: 2 }
];

const CHANNEL_LABELS: Record<ChannelKey, string> = {
    roll: 'Крен',
    pitch: 'Тангаж',
    throttle: 'Газ',
    yaw: 'Рыскание',
    mode: 'Режим',
    arm: 'Взвод',
    magnet: 'Магнит'
};

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
let wizardDraftInversion = [...simSettings.gamepadInversion];

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
        const primaryState = getCurrentPrimaryChannelState();
        if (!primaryState) return;
        const inversionIndex = getPrimaryChannelInversionIndex(primaryState.channel);
        wizardDraftInversion[inversionIndex] = invertCheckbox.checked;
        renderWizardState();
    };
}

function startWizard() {
    isWizardActive = true;
    showingSummary = false;
    currentStepIdx = 0;
    detectedMapping = {};
    auxResults = {};
    wizardDraftInversion = [...simSettings.gamepadInversion];
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

function getPrimaryChannelInversionIndex(channel: PrimaryChannelKey): number {
    switch (channel) {
        case 'roll':
            return 0;
        case 'pitch':
            return 1;
        case 'throttle':
            return 2;
        case 'yaw':
            return 3;
    }
}

function getCurrentPrimaryChannelState(): PrimaryChannelState | null {
    const step = getCurrentStep();
    if (step.type !== 'primary') return null;
    return {
        channel: step.channel as PrimaryChannelKey,
        label: CHANNEL_LABELS[step.channel],
        inverted: wizardDraftInversion[getPrimaryChannelInversionIndex(step.channel as PrimaryChannelKey)] ?? false
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

    if (!instruction || !status || !nextBtn || !prevBtn || !stepContainer || !summaryContainer || !summaryContent || !axisLabel || !axisHint || !primaryControls || !invertCheckbox) return;

    if (showingSummary) {
        stepContainer.style.display = 'none';
        summaryContainer.style.display = 'block';
        summaryContent.innerHTML = buildSummaryHtml();
        instruction.textContent = 'Сводка по найденным каналам';
        status.textContent = 'Проверьте найденные каналы и нажмите "Применить".';
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        nextBtn.textContent = 'Применить';
        axisLabel.textContent = 'Проверка каналов';
        axisHint.textContent = 'Итоговые инверсии и сопоставления будут сохранены и сразу применены к управлению.';
        primaryControls.hidden = true;
        return;
    }

    stepContainer.style.display = 'block';
    summaryContainer.style.display = 'none';

    const step = getCurrentStep();
    const primaryState = getCurrentPrimaryChannelState();
    instruction.textContent = step.instruction;
    status.textContent = getStepStatusText(step);
    prevBtn.disabled = currentStepIdx === 0;
    nextBtn.disabled = !isCurrentStepResolved();
    nextBtn.textContent = currentStepIdx === STEPS.length - 1 ? 'Показать сводку' : 'Далее';
    axisLabel.textContent = CHANNEL_LABELS[step.channel];
    axisHint.textContent = primaryState
        ? `Если ${CHANNEL_LABELS[step.channel].toLowerCase()} на экране работает наоборот, включите инверсию канала.`
        : 'Для вспомогательных каналов проверьте положения тумблера и диапазоны в итоговой сводке.';
    primaryControls.hidden = !primaryState;
    invertCheckbox.checked = primaryState?.inverted ?? false;
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

        updateDroneVisuals(gp);

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

function updateDroneVisuals(gp: Gamepad) {
    const drone = document.getElementById('gp-wizard-drone');
    const shadow = document.getElementById('gp-wizard-drone-shadow');
    if (!drone || !shadow) return;

    const step = getCurrentStep();
    const liveRefForCurrentStep = getDetectedRef(step.channel);
    const roll = getChannelPreviewValue(gp, 'roll', step.channel === 'roll' ? liveRefForCurrentStep : null);
    const pitch = getChannelPreviewValue(gp, 'pitch', step.channel === 'pitch' ? liveRefForCurrentStep : null);
    const yaw = getChannelPreviewValue(gp, 'yaw', step.channel === 'yaw' ? liveRefForCurrentStep : null);
    const throttle = getThrottlePreviewValue(gp, step.channel === 'throttle' ? liveRefForCurrentStep : null);

    const horizontalOffset = roll * 18;
    const verticalOffset = -throttle * 78 + pitch * 16;
    const yawAngle = yaw * 38;
    const pitchAngle = pitch * -24;
    const rollAngle = roll * 24;
    const shadowScale = 1 - throttle * 0.28;
    const shadowOpacity = 0.66 - throttle * 0.24;

    drone.style.transform = `translate3d(calc(-50% + ${horizontalOffset}px), ${verticalOffset}px, 0) rotateZ(${yawAngle}deg) rotateX(${pitchAngle}deg) rotateY(${rollAngle}deg)`;
    shadow.style.transform = `translateX(calc(-50% + ${horizontalOffset * 0.6}px)) scale(${shadowScale})`;
    shadow.style.opacity = `${Math.max(0.18, shadowOpacity)}`;
}

function getChannelPreviewValue(gp: Gamepad, channel: PrimaryChannelKey, liveOverride: GamepadInputRef | null): number {
    const ref = liveOverride ?? detectedMapping[channel] ?? null;
    if (!ref) return 0;
    return getNormalizedRefValue(gp, ref, channel);
}

function getThrottlePreviewValue(gp: Gamepad, liveOverride: GamepadInputRef | null): number {
    const ref = liveOverride ?? detectedMapping.throttle ?? null;
    if (!ref) return 0;
    const value = getNormalizedRefValue(gp, ref, 'throttle');
    return Math.max(0, Math.min(1, (value + 1) / 2));
}

function getNormalizedRefValue(gp: Gamepad, ref: GamepadInputRef, channel: ChannelKey): number {
    const index = Number(ref.slice(1));
    const primaryChannel = channel === 'mode' || channel === 'arm' || channel === 'magnet' ? null : channel;
    const isInverted = primaryChannel
        ? wizardDraftInversion[getPrimaryChannelInversionIndex(primaryChannel)] ?? false
        : false;
    if (ref.startsWith('b')) {
        const buttonValue = Math.max(0, Math.min(1, gp.buttons[index]?.value ?? 0));
        if (channel === 'throttle') {
            const normalizedThrottle = isInverted ? 1 - buttonValue : buttonValue;
            return normalizedThrottle * 2 - 1;
        }
        const centeredButton = buttonValue * 2 - 1;
        return isInverted ? -centeredButton : centeredButton;
    }

    const rawValue = gp.axes[index] ?? 0;
    if (channel === 'throttle') {
        const normalized = normalizeThrottleAxis(simSettings.gamepadCalibration, rawValue, index);
        const normalizedThrottle = isInverted ? 1 - normalized : normalized;
        return normalizedThrottle * 2 - 1;
    }

    const centered = normalizeCenteredAxis(simSettings.gamepadCalibration, rawValue, index);
    return isInverted ? -centered : centered;
}

function buildSummaryHtml(): string {
    const primaryRows = (['throttle', 'yaw', 'pitch', 'roll'] as PrimaryChannelKey[])
        .map((channel) => {
            const ref = detectedMapping[channel];
            const value = ref ? formatRefLabel(ref) : 'не найдено';
            const inversionIndex = getPrimaryChannelInversionIndex(channel);
            const inversionLabel = wizardDraftInversion[inversionIndex] ? 'Инверсия включена' : 'Инверсия выключена';
            return `
                <div class="gp-wizard-summary-row"><span>${CHANNEL_LABELS[channel]}</span><strong>${value}</strong></div>
                <div class="gp-wizard-summary-row"><span>Направление</span><strong class="gp-wizard-summary-badge">${inversionLabel}</strong></div>
            `;
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
    return `Loiter ${formatAuxRange(loiter)} | AltHold ${formatAuxRange(althold)} | Stabilize ${formatAuxRange(stabilize)}`;
}

function formatAuxRange(range: AuxChannelRange | null): string {
    if (!range) return 'Диапазон не определен';
    return `${range.min}-${range.max}`;
}

function formatRefLabel(ref: GamepadInputRef): string {
    const index = Number(ref.slice(1));
    if (ref.startsWith('a')) {
        return `Ось ${index} / CH${index + 1}`;
    }
    return `Кнопка ${index + 1}`;
}

function finishWizard() {
    for (const channel of ['roll', 'pitch', 'throttle', 'yaw', 'mode', 'arm', 'magnet'] as ChannelKey[]) {
        const ref = detectedMapping[channel];
        if (ref) {
            setMappingRefForChannel(channel, ref);
        }
    }

    applyPrimaryInversion();
    applyAuxResults();
    saveGamepadSettings();
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGED_EVENT));

    const overlay = document.getElementById('gp-wizard-overlay');
    if (overlay) overlay.style.display = 'none';
    stopWizard();
}

function applyPrimaryInversion() {
    for (const channel of ['roll', 'pitch', 'throttle', 'yaw'] as PrimaryChannelKey[]) {
        const inversionIndex = getPrimaryChannelInversionIndex(channel);
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
