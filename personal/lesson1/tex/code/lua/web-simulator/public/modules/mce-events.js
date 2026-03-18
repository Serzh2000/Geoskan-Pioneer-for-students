import { log } from './ui.js';

/**
 * @class EventEmitter
 * @description Простая реализация EventEmitter для событий автопилота
 */
export class EventEmitter {
    constructor() {
        /** @type {Object.<string, Array<Function>>} */
        this.listeners = {};
    }

    /**
     * @param {string} event 
     * @param {Function} callback 
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    /**
     * @param {string} event 
     * @param {Function} callback 
     */
    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    /**
     * @param {string} event 
     * @param {...any} args 
     */
    emit(event, ...args) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(...args));
    }
}

export const mceEmitter = new EventEmitter();

/**
 * @enum {number}
 * @description Команды MCE автопилота
 */
export const MCECommands = {
    MCE_PREFLIGHT: 1,
    MCE_TAKEOFF: 2,
    MCE_LANDING: 3,
    ENGINES_ARM: 4,
    ENGINES_DISARM: 5
};

/**
 * @enum {number}
 * @description События автопилота
 */
export const MCEEvents = {
    TAKEOFF_COMPLETE: 6,
    COPTER_LANDED: 7,
    LOW_VOLTAGE1: 13,
    LOW_VOLTAGE2: 14,
    POINT_REACHED: 10,
    ENGINES_STARTED: 11,
    POINT_DECELERATION: 12,
    SYNC_START: 15,
    SHOCK: 16,
    CONTROL_FAIL: 17,
    ENGINE_FAIL: 18
};

/**
 * @description Описание команд на русском языке
 * @type {Object.<number, string>}
 */
export const MCECommandDesc = {
    [MCECommands.MCE_PREFLIGHT]: 'Предполетная подготовка',
    [MCECommands.ENGINES_DISARM]: 'Отключение двигателей',
    [MCECommands.MCE_LANDING]: 'Посадка',
    [MCECommands.MCE_TAKEOFF]: 'Взлет',
    [MCECommands.ENGINES_ARM]: 'Взвод двигателей'
};

/**
 * @description Описание событий на русском языке
 * @type {Object.<number, string>}
 */
export const MCEEventDesc = {
    [MCECommands.MCE_PREFLIGHT]: 'Предполетная подготовка',
    [MCECommands.MCE_TAKEOFF]: 'Взлет',
    [MCECommands.MCE_LANDING]: 'Посадка',
    [MCECommands.ENGINES_ARM]: 'Взвод двигателей',
    [MCECommands.ENGINES_DISARM]: 'Отключение двигателей',
    [MCEEvents.ENGINES_STARTED]: 'Двигатели запущены',
    [MCEEvents.COPTER_LANDED]: 'Коптер приземлился',
    [MCEEvents.TAKEOFF_COMPLETE]: 'Взлет завершен',
    [MCEEvents.POINT_REACHED]: 'Точка достигнута',
    [MCEEvents.POINT_DECELERATION]: 'Торможение перед точкой',
    [MCEEvents.LOW_VOLTAGE1]: 'Низкое напряжение 1',
    [MCEEvents.LOW_VOLTAGE2]: 'Низкое напряжение 2',
    [MCEEvents.SYNC_START]: 'Синхронный старт',
    [MCEEvents.SHOCK]: 'Удар',
    [MCEEvents.CONTROL_FAIL]: 'Отказ управления',
    [MCEEvents.ENGINE_FAIL]: 'Отказ двигателя'
};

/**
 * @description Отправка команды MCE (возвращает Promise)
 * @param {number} cmdId ID команды из MCECommands
 * @returns {Promise<void>}
 */
export function pushCommand(cmdId) {
    return new Promise((resolve) => {
        const desc = MCECommandDesc[cmdId] || `Неизвестная команда (${cmdId})`;
        log(`Команда MCE: ${desc}`, 'info');
        
        // Симуляция асинхронного выполнения
        setTimeout(() => {
            resolve();
        }, 100);
    });
}

/**
 * @description Обработчик события автопилота, публикующий событие через EventEmitter
 * @param {number} eventId ID события из MCEEvents
 */
export function triggerEvent(eventId) {
    // Check both command and event descriptions
    const desc = MCEEventDesc[eventId] || MCECommandDesc[eventId] || `Неизвестное событие (${eventId})`;
    log(`Событие MCE: ${desc}`, 'info');
    mceEmitter.emit('autopilot_event', eventId, desc);
}

export function runMCETests() {
    console.log('--- RUNNING MCE TESTS ---');
    let testsPassed = true;
    
    // Test command descriptions
    if (MCECommandDesc[MCECommands.MCE_PREFLIGHT] !== 'Предполетная подготовка') {
        console.error('MCE Test Failed: MCE_PREFLIGHT description mismatch');
        testsPassed = false;
    }
    
    // Test event descriptions
    if (MCEEventDesc[MCEEvents.COPTER_LANDED] !== 'Коптер приземлился') {
        console.error('MCE Test Failed: COPTER_LANDED description mismatch');
        testsPassed = false;
    }
    
    // Test EventEmitter
    let emitted = false;
    const testCb = (id, desc) => { 
        if(id === MCEEvents.SHOCK && desc === 'Удар') emitted = true; 
    };
    mceEmitter.on('autopilot_event', testCb);
    triggerEvent(MCEEvents.SHOCK);
    if (!emitted) {
        console.error('MCE Test Failed: EventEmitter did not trigger callback');
        testsPassed = false;
    }
    mceEmitter.off('autopilot_event', testCb);
    
    // Test Promise return
    pushCommand(MCECommands.ENGINES_DISARM).then(() => {
        console.log('MCE Test: Promise resolved correctly.');
    }).catch(() => {
        console.error('MCE Test Failed: Promise rejected');
        testsPassed = false;
    });
    
    if (testsPassed) console.log('OK: All synchronous MCE tests passed.');
}
