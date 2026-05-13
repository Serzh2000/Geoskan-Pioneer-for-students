import { FSM_MISSION_EXAMPLE, TIMER_MISSION_EXAMPLE } from '../mission-guide/snippets.js';

export function renderLuaMissionGuide() {
    return `
        <div class="api-guide">
            <div class="api-guide__title">Как правильно строить миссию</div>
            <div class="api-guide__text">Не отправляйте <code>ap.push(Ev.MCE_PREFLIGHT)</code>, <code>ap.push(Ev.MCE_TAKEOFF)</code>, <code>ap.goToLocalPoint(...)</code> и <code>ap.push(Ev.MCE_LANDING)</code> подряд в одном тике. Между этапами должны быть либо задержки по времени, либо ожидание фактических событий автопилота.</div>
            <div class="api-guide__text"><strong>Что такое FSM:</strong> <code>FSM</code> = <code>Finite State Machine</code>, конечный автомат состояний дрона. Он определяет, из какого состояния в какое состояние разрешен переход.</div>
            <div class="api-guide__text"><strong>Правильная цепочка:</strong> IDLE -> PREFLIGHT -> TAKEOFF_PROCESS -> FLYING_HOVER -> FLYING_MOVING -> LANDING_PROCESS.</div>
            <div class="api-guide__text"><strong>Подход 1, через таймеры:</strong> используйте <code>Timer.callLater(...)</code>, когда нужно развести команды по времени. Это удобно для простых сценариев, но таймер сам по себе не проверяет, успел ли дрон реально завершить предыдущий этап.</div>
            <div class="api-guide__example-title">Пример для подхода 1</div>
            <div class="api-guide__code">${TIMER_MISSION_EXAMPLE}</div>
            <div class="api-guide__text"><strong>Подход 2, через события FSM:</strong> используйте <code>callback(event)</code> и реагируйте на <code>Ev.ENGINES_STARTED</code>, <code>Ev.TAKEOFF_COMPLETE</code>, <code>Ev.POINT_REACHED</code> и другие события. Такой вариант надежнее, потому что следующий шаг запускается после фактического перехода автомата.</div>
            <div class="api-guide__example-title">Пример для подхода 2</div>
            <div class="api-guide__code">${FSM_MISSION_EXAMPLE}</div>
            <div class="api-guide__text"><strong>Практика:</strong> таймеры подходят для пауз и отложенного старта этапа, а события <code>FSM</code> для шагов, зависящих от успешного завершения предыдущего состояния. Эти подходы можно комбинировать.</div>
        </div>
    `;
}
