import { FSM_MISSION_EXAMPLE, TIMER_MISSION_EXAMPLE } from './snippets.js';

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
                            <div>Например: сначала запуск двигателей, через 2 секунды взлет, еще через 2 секунды полет к точке, потом посадка.</div>
                            <div>Минус подхода: таймер не проверяет сам, успел ли дрон реально перейти в нужное состояние к моменту срабатывания.</div>
                        </div>
                        <div class="mission-guide-example">
                            <div class="mission-guide-example__title">Пример для подхода 1</div>
                            <div class="mission-guide-code">${TIMER_MISSION_EXAMPLE}</div>
                        </div>
                        <div class="mission-guide-timeline" aria-label="Пример временной шкалы сценария с таймерами">
                            <div class="mission-guide-timeline__caption">Пример условной шкалы по секундам</div>
                            <div class="mission-guide-timeline__track">
                                <div class="mission-guide-timeline__event mission-guide-timeline__event--t0">
                                    <div class="mission-guide-timeline__dot"></div>
                                    <div class="mission-guide-timeline__time">0 c</div>
                                    <div class="mission-guide-timeline__label">Запуск двигателей</div>
                                    <div class="mission-guide-timeline__code"><code>PREFLIGHT</code></div>
                                </div>
                                <div class="mission-guide-timeline__event mission-guide-timeline__event--t2">
                                    <div class="mission-guide-timeline__dot"></div>
                                    <div class="mission-guide-timeline__time">2 c</div>
                                    <div class="mission-guide-timeline__label">Взлет</div>
                                    <div class="mission-guide-timeline__code"><code>TAKEOFF</code></div>
                                </div>
                                <div class="mission-guide-timeline__event mission-guide-timeline__event--t4">
                                    <div class="mission-guide-timeline__dot"></div>
                                    <div class="mission-guide-timeline__time">4 c</div>
                                    <div class="mission-guide-timeline__label">Полет к точке</div>
                                    <div class="mission-guide-timeline__code"><code>goToLocalPoint</code></div>
                                </div>
                                <div class="mission-guide-timeline__event mission-guide-timeline__event--t6">
                                    <div class="mission-guide-timeline__dot"></div>
                                    <div class="mission-guide-timeline__time">6 c</div>
                                    <div class="mission-guide-timeline__label">Посадка</div>
                                    <div class="mission-guide-timeline__code"><code>LANDING</code></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mission-guide-section">
                        <div class="mission-guide-section__title">Подход 2: через события FSM</div>
                        <div class="mission-guide-list">
                            <div><code>callback(event)</code> реагирует не на время, а на фактическое событие автомата: завершение взлета, достижение точки и так далее.</div>
                            <div>Это надежнее, потому что команда отправляется тогда, когда дрон действительно дошел до нужного состояния.</div>
                            <div>Типичная логика: после <code>Ev.ENGINES_STARTED</code> вызвать <code>TAKEOFF</code>, после <code>Ev.TAKEOFF_COMPLETE</code> вызвать <code>goToLocalPoint</code>, после <code>Ev.POINT_REACHED</code> отправить <code>LANDING</code>.</div>
                            <div>Именно такой подход лучше использовать там, где следующий шаг зависит от успешного завершения предыдущего.</div>
                        </div>
                        <div class="mission-guide-example">
                            <div class="mission-guide-example__title">Пример для подхода 2</div>
                            <div class="mission-guide-code">${FSM_MISSION_EXAMPLE}</div>
                        </div>
                        <div class="mission-guide-fsm" aria-label="Схема переходов по событиям FSM">
                            <div class="mission-guide-fsm__caption">Следующий шаг запускается после подтвержденного события, а не по таймеру</div>
                            <div class="mission-guide-fsm__flow">
                                <div class="mission-guide-fsm__step mission-guide-fsm__step--command">
                                    <div class="mission-guide-fsm__index">1</div>
                                    <div class="mission-guide-fsm__body">
                                        <div class="mission-guide-fsm__badge">Команда</div>
                                        <div class="mission-guide-fsm__title">Запуск двигателей</div>
                                        <div class="mission-guide-fsm__code"><code>PREFLIGHT</code></div>
                                        <div class="mission-guide-fsm__hint">Сначала отправляем первую команду.</div>
                                    </div>
                                </div>
                                <div class="mission-guide-fsm__step mission-guide-fsm__step--event">
                                    <div class="mission-guide-fsm__index">2</div>
                                    <div class="mission-guide-fsm__body">
                                        <div class="mission-guide-fsm__badge">Событие</div>
                                        <div class="mission-guide-fsm__title">Двигатели запущены</div>
                                        <div class="mission-guide-fsm__code"><code>Ev.ENGINES_STARTED</code></div>
                                        <div class="mission-guide-fsm__hint">Ждем подтверждение, что предполетная подготовка реально завершилась.</div>
                                    </div>
                                </div>
                                <div class="mission-guide-fsm__step mission-guide-fsm__step--command">
                                    <div class="mission-guide-fsm__index">3</div>
                                    <div class="mission-guide-fsm__body">
                                        <div class="mission-guide-fsm__badge">Команда</div>
                                        <div class="mission-guide-fsm__title">Взлет</div>
                                        <div class="mission-guide-fsm__code"><code>TAKEOFF</code></div>
                                        <div class="mission-guide-fsm__hint">Только после события отправляем следующий шаг.</div>
                                    </div>
                                </div>
                                <div class="mission-guide-fsm__step mission-guide-fsm__step--event">
                                    <div class="mission-guide-fsm__index">4</div>
                                    <div class="mission-guide-fsm__body">
                                        <div class="mission-guide-fsm__badge">Событие</div>
                                        <div class="mission-guide-fsm__title">Взлет завершен</div>
                                        <div class="mission-guide-fsm__code"><code>Ev.TAKEOFF_COMPLETE</code></div>
                                        <div class="mission-guide-fsm__hint">Снова ждем фактическое завершение этапа.</div>
                                    </div>
                                </div>
                                <div class="mission-guide-fsm__step mission-guide-fsm__step--command">
                                    <div class="mission-guide-fsm__index">5</div>
                                    <div class="mission-guide-fsm__body">
                                        <div class="mission-guide-fsm__badge">Команда</div>
                                        <div class="mission-guide-fsm__title">Полет к точке и далее посадка</div>
                                        <div class="mission-guide-fsm__code"><code>goToLocalPoint</code> -> <code>LANDING</code></div>
                                        <div class="mission-guide-fsm__hint">После подтвержденного события запускаем следующий этап миссии.</div>
                                    </div>
                                </div>
                            </div>
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
