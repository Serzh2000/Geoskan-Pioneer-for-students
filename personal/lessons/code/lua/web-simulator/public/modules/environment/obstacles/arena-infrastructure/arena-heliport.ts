import { createStyledLandingPad } from '../pads.js';

export function createArenaHeliportMesh() {
    const pad = createStyledLandingPad('H', '#2563eb');
    pad.name = 'Хелипорт';
    pad.userData.type = 'Хелипорт';
    return pad;
}