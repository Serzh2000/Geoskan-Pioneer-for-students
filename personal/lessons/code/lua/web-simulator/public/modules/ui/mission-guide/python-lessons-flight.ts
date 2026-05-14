import type { GuideLesson } from './types.js';
import { getPythonCoreFlightLessons } from './python-lessons-flight-core.js';
import { getPythonMissionLessons } from './python-lessons-flight-mission.js';

export function getPythonFlightLessons(): GuideLesson[] {
    return [...getPythonCoreFlightLessons(), ...getPythonMissionLessons()];
}
