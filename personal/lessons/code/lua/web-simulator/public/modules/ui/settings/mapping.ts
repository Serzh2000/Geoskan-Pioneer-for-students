import { simSettings, type GamepadInputRef } from '../../state.js';
import { AUXILIARY_CHANNELS, PRIMARY_CHANNELS, axisRef, buttonRef, clampRc, clamp } from './constants.js';
import type { ChannelKey, PrimaryChannelKey } from './types.js';

export function getDefaultChannelValue(key: ChannelKey): number {
    return key === 'throttle' || AUXILIARY_CHANNELS.includes(key as any) ? 1000 : 1500;
}

export function getMappingRef(key: ChannelKey): GamepadInputRef {
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
}

export function setMappingRef(key: ChannelKey, ref: GamepadInputRef): void {
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
}

export function hasInputRef(gp: Gamepad, ref: GamepadInputRef): boolean {
    const inputIndex = Number(ref.slice(1));
    return ref.startsWith('a') ? inputIndex < gp.axes.length : inputIndex < gp.buttons.length;
}

export function isAllowedForChannel(key: ChannelKey, ref: GamepadInputRef): boolean {
    if (PRIMARY_CHANNELS.includes(key as PrimaryChannelKey)) return ref.startsWith('a');
    return true;
}

export function getFallbackMapping(gp: Gamepad, key: ChannelKey): GamepadInputRef | null {
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
}

export function ensureMappingsForGamepad(gp: Gamepad, channels: ChannelKey[]): void {
    for (const key of channels) {
        const currentRef = getMappingRef(key);
        if (isAllowedForChannel(key, currentRef) && hasInputRef(gp, currentRef)) continue;
        const fallback = getFallbackMapping(gp, key);
        if (fallback) setMappingRef(key, fallback);
    }
}

export function readInputRcValue(
    gp: Gamepad,
    ref: GamepadInputRef,
    normalizeCenteredAxis: (rawValue: number, axisIndex: number) => number
): number {
    const inputIndex = Number(ref.slice(1));
    if (ref.startsWith('a')) {
        const rawValue = gp.axes[inputIndex] ?? 0;
        const normalized = normalizeCenteredAxis(rawValue, inputIndex);
        return clampRc(1500 + normalized * 500);
    }

    const buttonValue = clamp(gp.buttons[inputIndex]?.value ?? 0, 0, 1);
    return clampRc(1000 + buttonValue * 1000);
}

export function getConnectedGamepads(): Gamepad[] {
    if (typeof navigator.getGamepads !== 'function') return [];
    return Array.from(navigator.getGamepads()).filter((gp): gp is Gamepad => gp !== null);
}

export function findActiveGamepad(activeGamepadIndex: number | null, activeGamepadId: string | null): Gamepad | null {
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
}

export function getGamepadName(gp: Gamepad): string {
    const trimmed = gp.id.split('(')[0].trim();
    return trimmed || `Gamepad ${gp.index + 1}`;
}

export function createAxisOptions(gp: Gamepad): string {
    return gp.axes.map((_, index) => `<option value="${axisRef(index)}">A${index}: Axis ${index}</option>`).join('');
}

export function createAuxOptions(gp: Gamepad): string {
    const options: string[] = [];
    gp.axes.forEach((_, index) => options.push(`<option value="${axisRef(index)}">A${index}: Axis ${index}</option>`));
    gp.buttons.forEach((_, index) => options.push(`<option value="${buttonRef(index)}">B${index}: Button ${index}</option>`));
    return options.join('');
}
