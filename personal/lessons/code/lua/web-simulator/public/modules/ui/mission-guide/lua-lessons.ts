import type { GuideLessonState } from './types.js';
import { getLuaLedLessons } from './lua-lessons-led.js';
import { getLuaFlightLessons } from './lua-lessons-flight.js';

export function getLuaLessonState(): GuideLessonState {
    const lessons = [...getLuaLedLessons(), ...getLuaFlightLessons()];

    return {
        activeLessonId: lessons[0].id,
        heroEyebrow: 'Lua-практикум',
        heroTitle: 'Пошаговые уроки по Lua API Pioneer',
        heroText: 'Каждый урок сочетает краткий разбор методов Pioneer API, сборку сценария в Blockly и мгновенную проверку результата в симуляторе.',
        heroFlow: 'От LED-команд к полной миссии автопилота',
        lessons
    };
}
