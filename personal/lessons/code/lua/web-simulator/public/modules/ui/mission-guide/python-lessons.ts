import type { GuideLessonState } from './types.js';
import { getGuideChapters } from './curriculum.js';
import { getPythonLedLessons } from './python-lessons-led.js';
import { getPythonFlightLessons } from './python-lessons-flight.js';

export function getPythonLessonState(): GuideLessonState {
    const lessons = [...getPythonLedLessons(), ...getPythonFlightLessons()];

    return {
        activeLessonId: lessons[0].id,
        heroEyebrow: 'Python-практикум',
        heroTitle: 'Пошаговые уроки по Python SDK Pioneer',
        heroText: 'Каждый урок сначала объясняет нужные методы SDK, а затем предлагает собрать и проверить рабочую последовательность команд в симуляторе.',
        heroFlow: 'От LED-подсветки к полной полетной миссии',
        chapters: getGuideChapters('python'),
        lessons
    };
}
