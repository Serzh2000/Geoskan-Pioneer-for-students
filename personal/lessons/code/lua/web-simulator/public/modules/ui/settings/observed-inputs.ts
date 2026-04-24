import type { GamepadInputRef } from '../../state.js';
import { MAX_PRESET_POSITIONS, MIN_POSITION_SAMPLES, POSITION_CLUSTER_THRESHOLD, clamp } from './constants.js';
import type { ObservedInputPosition, ObservedInputStats } from './types.js';

export function resetObservedInputStats() {
    return new Map<GamepadInputRef, ObservedInputStats>();
}

export function rememberObservedInputValue(
    observedInputStats: Map<GamepadInputRef, ObservedInputStats>,
    ref: GamepadInputRef,
    rcValue: number
): void {
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
}

export function getObservedPositions(
    observedInputStats: Map<GamepadInputRef, ObservedInputStats>,
    ref: GamepadInputRef
): ObservedInputPosition[] {
    const stats = observedInputStats.get(ref) ?? null;
    if (!stats) return [];

    const stable = stats.positions.filter((position) => position.samples >= MIN_POSITION_SAMPLES);
    const source = stable.length > 0 ? stable : stats.positions;

    return [...source]
        .sort((a, b) => b.samples - a.samples)
        .slice(0, MAX_PRESET_POSITIONS)
        .sort((a, b) => a.centerRc - b.centerRc);
}

export function buildRangesFromPositions(positions: ObservedInputPosition[]) {
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
}

export function findClosestRangeByCenter(
    ranges: Array<{ min: number; max: number; center?: number }>,
    center?: number
) {
    if (!ranges.length || center === undefined) return null;
    let best: { min: number; max: number; center?: number } | null = null;
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
}
