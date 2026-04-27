export const TRACE_SAMPLE_INTERVAL = 0.05;
export const DRONE_COLLISION_RADIUS = 0.18;
export const COLLISION_SAMPLE_STEP = 0.08;
export const MANUAL_TAKEOFF_THROTTLE = 1200;
export const MANUAL_TAKEOFF_ALTITUDE = 0.8;

export const NON_COLLIDABLE_TYPES = new Set([
    'Ground',
    'ground',
    'Ворота',
    'Дорога',
    'Железнодорожные пути',
    'Площадка H',
    'Площадка ⚡',
    'Стартовая позиция',
    'Хелипорт',
    'Станция заряда',
    'Груз',
    'Грузик'
]);
