export function initSimulationNotice() {
    const sceneContainer = document.querySelector('.scene-container') as HTMLElement | null;
    if (!sceneContainer) return;

    let notice = document.getElementById('simulation-notice') as HTMLDivElement | null;
    if (!notice) {
        notice = document.createElement('div');
        notice.id = 'simulation-notice';
        notice.className = 'simulation-notice';
        notice.innerHTML = `
            <div class="simulation-notice__title">Предупреждение по таймингам</div>
            <div class="simulation-notice__message"></div>
            <button type="button" class="simulation-notice__close" aria-label="Скрыть">Понятно</button>
        `;
        sceneContainer.appendChild(notice);
    }

    const messageEl = notice.querySelector('.simulation-notice__message') as HTMLDivElement | null;
    const closeBtn = notice.querySelector('.simulation-notice__close') as HTMLButtonElement | null;
    let hideTimer = 0;

    const hideNotice = () => {
        notice?.classList.remove('visible');
    };

    closeBtn?.addEventListener('click', hideNotice);
    (window as any).showSimulationNotice = (message: string, level: 'warn' | 'info' = 'warn') => {
        if (!notice || !messageEl) return;
        window.clearTimeout(hideTimer);
        notice.dataset.level = level;
        messageEl.textContent = message;
        notice.classList.add('visible');
        hideTimer = window.setTimeout(hideNotice, 6500);
    };
}
