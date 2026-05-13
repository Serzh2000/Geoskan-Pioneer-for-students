export function initMissionGuideModal() {
    let overlay = document.getElementById('mission-guide-overlay') as HTMLDivElement | null;
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'mission-guide-overlay';
        overlay.className = 'modal-overlay mission-guide-overlay';
        overlay.style.display = 'none';
        overlay.innerHTML = `
            <div class="modal-content mission-guide-modal" role="dialog" aria-modal="true" aria-labelledby="mission-guide-title">
                <div class="modal-header">
                    <span id="mission-guide-title" class="modal-title">Как правильно писать миссии</span>
                    <button type="button" id="mission-guide-close" class="modal-close-btn" aria-label="Закрыть">✕</button>
                </div>
                <div class="mission-guide-body">
                    <div class="mission-guide-callout">
                        Не отправляйте <code>ap.push(Ev.MCE_PREFLIGHT)</code>, <code>ap.push(Ev.MCE_TAKEOFF)</code>,
                        <code>ap.goToLocalPoint(...)</code> и <code>ap.push(Ev.MCE_LANDING)</code> подряд в одном тике.
                        В реальном API и в симуляторе команды должны идти по состояниям конечного автомата.
                    </div>
                    <div class="mission-guide-section">
                        <div class="mission-guide-section__title">Что такое FSM</div>
                        <div class="mission-guide-list">
                            <div><code>FSM</code> = <code>Finite State Machine</code>, то есть конечный автомат состояний дрона.</div>
                            <div>У дрона есть состояния: ожидание, предполетная подготовка, взлет, зависание, полет к точке, посадка.</div>
                            <div>Каждая следующая команда допустима только после правильного перехода в нужное состояние.</div>
                            <div>Поэтому нельзя просить посадку или полет к точке раньше, чем дрон реально завершил предыдущий этап.</div>
                        </div>
                    </div>
                    <div class="mission-guide-section">
                        <div class="mission-guide-section__title">Правильная цепочка FSM</div>
                        <div class="mission-guide-flow">
                            IDLE -> PREFLIGHT -> TAKEOFF_PROCESS -> FLYING_HOVER -> FLYING_MOVING -> LANDING_PROCESS -> IDLE
                        </div>
                    </div>
                    <div class="mission-guide-section">
                        <div class="mission-guide-section__title">Подход 1: через таймеры</div>
                        <div class="mission-guide-list">
                            <div><code>Timer.callLater(...)</code> ставит следующую команду с задержкой, чтобы она ушла в другой момент времени, а не в тот же тик.</div>
                            <div>Такой подход удобен для простых сценариев, когда вы заранее знаете, сколько примерно длится этап.</div>
                            <div>Например: сначала <code>PREFLIGHT</code>, через 1 секунду <code>TAKEOFF</code>, еще позже дополнительные действия.</div>
                            <div>Минус подхода: таймер не проверяет сам, успел ли дрон реально перейти в нужное состояние к моменту срабатывания.</div>
                        </div>
                    </div>
                    <div class="mission-guide-section">
                        <div class="mission-guide-section__title">Подход 2: через события FSM</div>
                        <div class="mission-guide-list">
                            <div><code>callback(event)</code> реагирует не на время, а на фактическое событие автомата: завершение взлета, достижение точки и так далее.</div>
                            <div>Это надежнее, потому что команда отправляется тогда, когда дрон действительно дошел до нужного состояния.</div>
                            <div>Типичная логика: после <code>Ev.TAKEOFF_COMPLETE</code> вызвать <code>goToLocalPoint</code>, после <code>Ev.POINT_REACHED</code> отправить <code>LANDING</code>.</div>
                            <div>Именно такой подход лучше использовать там, где следующий шаг зависит от успешного завершения предыдущего.</div>
                        </div>
                    </div>
                    <div class="mission-guide-section">
                        <div class="mission-guide-section__title">Когда что использовать</div>
                        <div class="mission-guide-list">
                            <div>Таймеры подходят для разнесения команд во времени и для простых пауз между этапами.</div>
                            <div>События <code>FSM</code> подходят для переходов, которые должны происходить строго после завершения конкретного состояния.</div>
                            <div>На практике эти подходы можно комбинировать: таймер запускает этап, а <code>callback(event)</code> подтверждает, что этап завершен.</div>
                        </div>
                    </div>
                    <div class="mission-guide-section">
                        <div class="mission-guide-section__title">Рабочий пример</div>
                        <div class="mission-guide-code">ap.push(Ev.MCE_PREFLIGHT)
Timer.callLater(1, function()
    ap.push(Ev.MCE_TAKEOFF)
end)

function callback(event)
    if event == Ev.TAKEOFF_COMPLETE then
        ap.goToLocalPoint(1, 1, 1)
    end

    if event == Ev.POINT_REACHED then
        ap.push(Ev.MCE_LANDING)
    end
end</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const hide = () => {
        if (!overlay) return;
        overlay.style.display = 'none';
    };

    const show = () => {
        if (!overlay) return;
        overlay.style.display = 'flex';
    };

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            hide();
        }
    });

    overlay.querySelector('#mission-guide-close')?.addEventListener('click', hide);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && overlay?.style.display !== 'none') {
            hide();
        }
    });

    (window as any).openMissionGuideModal = show;
    (window as any).closeMissionGuideModal = hide;
}
