import { createStyledLandingPad } from '../pads.js';

export function createStartPositionMesh(label = '1') {
    const safeLabel = (label || '1').trim().slice(0, 3) || '1';
    const pad = createStyledLandingPad(safeLabel, '#ef4444');
    pad.name = `Стартовая позиция ${safeLabel}`;
    pad.userData.type = 'Стартовая позиция';
    pad.userData.value = safeLabel;
    return pad;
}
