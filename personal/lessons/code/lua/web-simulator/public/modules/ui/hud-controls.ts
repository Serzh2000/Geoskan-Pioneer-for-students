function applyHudVisibility(overlayId: string, buttonId: string, storageKey: string, visible: boolean) {
    const overlay = document.getElementById(overlayId);
    const button = document.getElementById(buttonId) as HTMLButtonElement | null;
    if (!overlay || !button) return;
    overlay.classList.toggle('is-hidden', !visible);
    button.classList.toggle('active', visible);
    button.setAttribute('aria-pressed', visible ? 'true' : 'false');
    localStorage.setItem(storageKey, visible ? '1' : '0');
}

function initHudToggle(overlayId: string, buttonId: string, storageKey: string) {
    const button = document.getElementById(buttonId) as HTMLButtonElement | null;
    if (!button) return;
    const initialVisible = localStorage.getItem(storageKey) !== '0';
    applyHudVisibility(overlayId, buttonId, storageKey, initialVisible);
    button.addEventListener('click', () => {
        const overlay = document.getElementById(overlayId);
        const visible = overlay ? overlay.classList.contains('is-hidden') : true;
        applyHudVisibility(overlayId, buttonId, storageKey, visible);
    });
}

export function initHudControls() {
    initHudToggle('telemetry-overlay', 'toggle-telemetry-btn', 'hud-telemetry-visible');
    initHudToggle('matrix-overlay', 'toggle-matrix-btn', 'hud-matrix-visible');
}
