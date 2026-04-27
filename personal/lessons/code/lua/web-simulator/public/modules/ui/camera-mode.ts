import { log } from '../shared/logging/logger.js';

export function initCameraModeUI() {
    (window as any).setCameraMode = function(mode: string) {
        (window as any).cameraMode = mode;
        const buttons = document.querySelectorAll('.camera-controls button') as NodeListOf<HTMLButtonElement>;
        buttons.forEach((btn) => {
            const onclick = btn.getAttribute('onclick') || '';
            if (onclick.includes(`'${mode}'`)) {
                btn.style.background = '#38bdf8';
                btn.style.color = '#0f172a';
            } else {
                btn.style.background = '';
                btn.style.color = '';
            }
        });
        log(`Режим камеры: ${mode.toUpperCase()}`, 'info');
    };

    (window as any).setCameraMode('free');
}
