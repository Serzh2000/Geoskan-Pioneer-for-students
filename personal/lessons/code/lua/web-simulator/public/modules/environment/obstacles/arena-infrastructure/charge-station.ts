import { createStyledLandingPad } from '../pads.js';

export function createChargeStationMesh() {
    const pad = createStyledLandingPad('⚡', '#475569');
    pad.name = 'Станция заряда';
    pad.userData.type = 'Станция заряда';
    return pad;
}