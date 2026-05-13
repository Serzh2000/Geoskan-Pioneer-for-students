import { log } from '../shared/logging/logger.js';
import type { ScriptLanguage } from '../core/state.js';

export function scriptHasVisibleDelay(language: ScriptLanguage, code: string) {
    const normalized = (code || '').toLowerCase();
    if (language === 'python') {
        return /\b(time|asyncio)\.sleep\s*\(/.test(normalized) || /\bawait\s+asyncio\.sleep\s*\(/.test(normalized);
    }
    return /\bsleep\s*\(/.test(normalized) || /\btimer\.(calllater|new)\s*\(/.test(normalized);
}

export function warnAboutInstantExecution(language: ScriptLanguage) {
    const isPython = language === 'python';
    const message = isPython
        ? 'Сценарий выполняет команды почти мгновенно. Для реального полета и симулятора нужно делать паузы между arm/takeoff/go_to_local_point/land.'
        : 'Сценарий отправляет команды мгновенно без Timer.callLater. Для FSM дрона это неверно: взлет, переход в воздух, полет к точке и посадка должны происходить в разные моменты времени.';

    log(message, 'warn');

    if (!(window as any).showSimulationNotice) return;

    const detailsHtml = isPython
        ? `
            <div class="simulation-notice__list">
                <div>Как правильно: добавляйте <code>time.sleep(...)</code> между этапами миссии.</div>
                <div>Цепочка: arm - takeoff - полет к точке - landing.</div>
            </div>
        `
        : `
            <div class="simulation-notice__list">
                <div><strong>Правильная цепочка FSM:</strong> IDLE -> PREFLIGHT -> TAKEOFF -> TAKEOFF_COMPLETE -> goToLocalPoint -> POINT_REACHED -> LANDING.</div>
                <div><strong>Используйте:</strong> <code>Timer.callLater(...)</code> и/или <code>callback(event)</code>.</div>
            </div>
            <button type="button" class="simulation-notice__action" data-simulation-action="open-mission-guide">Открыть инструкцию</button>
            <div class="simulation-notice__code">ap.push(Ev.MCE_PREFLIGHT)
Timer.callLater(2, function()
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
        `;

    (window as any).showSimulationNotice({
        title: isPython ? 'Предупреждение по таймингам' : 'Ошибка сценария: мгновенные команды',
        message,
        detailsHtml,
        level: 'warn'
    });
}
