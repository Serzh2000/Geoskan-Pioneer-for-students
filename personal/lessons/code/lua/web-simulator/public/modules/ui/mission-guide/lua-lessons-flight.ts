import type { GuideLesson } from './types.js';
import { getLuaCoreFlightLessons } from './lua-lessons-flight-core.js';
import { getLuaMissionLessons } from './lua-lessons-flight-mission.js';

export function getLuaFlightLessons(): GuideLesson[] {
    return [...getLuaCoreFlightLessons(), ...getLuaMissionLessons()];
}
