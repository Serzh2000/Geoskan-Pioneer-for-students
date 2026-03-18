
export const apiDocs = {
    // Autopilot
    'ap.push': {
        desc: 'Добавляет команду в очередь автопилота.',
        syntax: 'ap.push(event)',
        params: 'event (число или константа Ev.*)',
        returns: 'nil',
        example: 'ap.push(Ev.MCE_TAKEOFF)',
        kind: 'Method',
        insertText: 'push(${1:event})'
    },
    'ap.goToLocalPoint': {
        desc: 'Полет в точку в локальной системе координат (метры).',
        syntax: 'ap.goToLocalPoint(x, y, z, [time])',
        params: 'x, y, z (числа), time (секунды, опционально)',
        returns: 'nil',
        example: 'ap.goToLocalPoint(1.5, 0, 1.0, 5)',
        kind: 'Method',
        insertText: 'goToLocalPoint(${1:x}, ${2:y}, ${3:z}, ${4:time})'
    },
    'ap.goToPoint': {
        desc: 'Полет в глобальные координаты (GPS).',
        syntax: 'ap.goToPoint(lat, lon, alt)',
        params: 'lat (широта * 10^7), lon (долгота * 10^7), alt (метры)',
        returns: 'nil',
        example: 'ap.goToPoint(600859810, 304206500, 50)',
        kind: 'Method',
        insertText: 'goToPoint(${1:lat}, ${2:lon}, ${3:alt})'
    },
    'ap.updateYaw': {
        desc: 'Установка угла рыскания (курса).',
        syntax: 'ap.updateYaw(angle)',
        params: 'angle (радианы)',
        returns: 'nil',
        example: 'ap.updateYaw(Math.PI / 2)',
        kind: 'Method',
        insertText: 'updateYaw(${1:angle})'
    },

    // Timer
    'Timer.callLater': {
        desc: 'Выполнение функции через задержку.',
        syntax: 'Timer.callLater(delay, func)',
        params: 'delay (секунды), func (функция)',
        returns: 'nil',
        example: 'Timer.callLater(2, function() print("Done") end)',
        kind: 'Method',
        insertText: 'callLater(${1:delay}, function()\n\t${2}\nend)'
    },
    'Timer.new': {
        desc: 'Создание циклического таймера.',
        syntax: 'Timer.new(period, func)',
        params: 'period (секунды), func (функция)',
        returns: 'Timer object',
        example: 'local t = Timer.new(1, function() ... end)',
        kind: 'Method',
        insertText: 'new(${1:period}, function()\n\t${2}\nend)'
    },

    // Ledbar
    'Ledbar.new': {
        desc: 'Инициализация светодиодной ленты.',
        syntax: 'Ledbar.new(count)',
        params: 'count (число светодиодов)',
        returns: 'Ledbar object',
        example: 'local leds = Ledbar.new(4)',
        kind: 'Method',
        insertText: 'new(${1:count})'
    },
    'Ledbar.fromHSV': {
        desc: 'Конвертация HSV в RGB.',
        syntax: 'Ledbar.fromHSV(h, s, v)',
        params: 'h (0-360), s (0-100), v (0-100)',
        returns: 'r, g, b (0-1)',
        example: 'local r,g,b = Ledbar.fromHSV(120, 100, 100)',
        kind: 'Method',
        insertText: 'fromHSV(${1:h}, ${2:s}, ${3:v})'
    },
    'Ledbar:set': {
        desc: 'Установка цвета светодиода.',
        syntax: 'leds:set(index, r, g, b, [w])',
        params: 'index (0..N-1), r,g,b (0-1), w (0-1, опц.)',
        returns: 'nil',
        example: 'leds:set(0, 1, 0, 0)',
        kind: 'Method',
        insertText: 'set(${1:index}, ${2:r}, ${3:g}, ${4:b})'
    },

    // Sensors
    'Sensors.lpsPosition': {
        desc: 'Получение текущих координат.',
        syntax: 'Sensors.lpsPosition()',
        params: 'none',
        returns: 'x, y, z (метры)',
        example: 'local x, y, z = Sensors.lpsPosition()',
        kind: 'Method',
        insertText: 'lpsPosition()'
    },
    'Sensors.lpsVelocity': {
        desc: 'Получение текущей скорости.',
        syntax: 'Sensors.lpsVelocity()',
        params: 'none',
        returns: 'vx, vy, vz (м/с)',
        example: 'local vx, vy, vz = Sensors.lpsVelocity()',
        kind: 'Method',
        insertText: 'lpsVelocity()'
    },
    'Sensors.orientation': {
        desc: 'Получение углов ориентации (Эйлер).',
        syntax: 'Sensors.orientation()',
        params: 'none',
        returns: 'roll, pitch, yaw (радианы)',
        example: 'local r, p, y = Sensors.orientation()',
        kind: 'Method',
        insertText: 'orientation()'
    },
    'Sensors.battery': {
        desc: 'Напряжение батареи.',
        syntax: 'Sensors.battery()',
        params: 'none',
        returns: 'voltage (вольты)',
        example: 'local v = Sensors.battery()',
        kind: 'Method',
        insertText: 'battery()'
    },
    'Sensors.range': {
        desc: 'Высота по дальномеру (лазер/ультразвук).',
        syntax: 'Sensors.range()',
        params: 'none',
        returns: 'dist (метры)',
        example: 'local d = Sensors.range()',
        kind: 'Method',
        insertText: 'range()'
    },
    'Sensors.tof': {
        desc: 'Данные с TOF-сенсора.',
        syntax: 'Sensors.tof()',
        params: 'none',
        returns: 'dist (мм)',
        example: 'local d = Sensors.tof()',
        kind: 'Method',
        insertText: 'tof()'
    },

    // Camera
    'camera.requestMakeShot': {
        desc: 'Запрос на создание снимка.',
        syntax: 'camera.requestMakeShot()',
        params: 'none',
        returns: 'nil',
        example: 'camera.requestMakeShot()',
        kind: 'Method',
        insertText: 'requestMakeShot()'
    },
    'camera.requestRecordStart': {
        desc: 'Запрос на старт записи видео.',
        syntax: 'camera.requestRecordStart()',
        params: 'none',
        returns: 'nil',
        example: 'camera.requestRecordStart()',
        kind: 'Method',
        insertText: 'requestRecordStart()'
    },
    'camera.requestRecordStop': {
        desc: 'Запрос на остановку записи видео.',
        syntax: 'camera.requestRecordStop()',
        params: 'none',
        returns: 'nil',
        example: 'camera.requestRecordStop()',
        kind: 'Method',
        insertText: 'requestRecordStop()'
    },
    
    // Globals
    'time': {
        desc: 'Время с момента включения коптера.',
        syntax: 'time()',
        params: 'none',
        returns: 'seconds (число)',
        example: 'local t = time()',
        kind: 'Function',
        insertText: 'time()'
    },
    'deltaTime': {
        desc: 'Время, прошедшее с предыдущего кадра.',
        syntax: 'deltaTime()',
        params: 'none',
        returns: 'seconds (число)',
        example: 'local dt = deltaTime()',
        kind: 'Function',
        insertText: 'deltaTime()'
    },
    'sleep': {
        desc: 'Блокирующая пауза (не рекомендуется).',
        syntax: 'sleep(seconds)',
        params: 'seconds (число)',
        returns: 'nil',
        example: 'sleep(1.5)',
        kind: 'Function',
        insertText: 'sleep(${1:seconds})'
    },
    
    // Peripherals
    'Gpio.new': { desc: 'Создание GPIO.', kind: 'Method', insertText: 'new(${1:port}, ${2:pin}, ${3:mode})' },
    'Spi.new':  { desc: 'Создание SPI.',  kind: 'Method', insertText: 'new(${1:num}, ${2:rate})' },
    
    // Ev Constants Descriptions (Tooltips)
    'Ev.MCE_PREFLIGHT': { desc: 'Предполетная подготовка. Запустить двигатели и провести подготовку', syntax: 'Ev.MCE_PREFLIGHT', params: '-', returns: 'число (ID события)', example: 'ap.push(Ev.MCE_PREFLIGHT)' },
    'Ev.MCE_TAKEOFF': { desc: 'Отправить на взлет', syntax: 'Ev.MCE_TAKEOFF', params: '-', returns: 'число', example: 'ap.push(Ev.MCE_TAKEOFF)' },
    'Ev.MCE_LANDING': { desc: 'Отправить на посадку', syntax: 'Ev.MCE_LANDING', params: '-', returns: 'число', example: 'ap.push(Ev.MCE_LANDING)' },
    'Ev.ENGINES_ARM': { desc: 'Завести двигатели', syntax: 'Ev.ENGINES_ARM', params: '-', returns: 'число', example: 'ap.push(Ev.ENGINES_ARM)' },
    'Ev.ENGINES_DISARM': { desc: 'Отключить двигатели', syntax: 'Ev.ENGINES_DISARM', params: '-', returns: 'число', example: 'ap.push(Ev.ENGINES_DISARM)' },
    'Ev.TAKEOFF_COMPLETE': { desc: 'Взлет завершен', syntax: 'Ev.TAKEOFF_COMPLETE', params: '-', returns: 'число', example: 'if event == Ev.TAKEOFF_COMPLETE then ...' },
    'Ev.COPTER_LANDED': { desc: 'Коптер приземлился', syntax: 'Ev.COPTER_LANDED', params: '-', returns: 'число', example: 'if event == Ev.COPTER_LANDED then ...' },
    'Ev.LOW_VOLTAGE1': { desc: 'Низкое напряжение 1 (предупреждение)', syntax: 'Ev.LOW_VOLTAGE1', params: '-', returns: 'число', example: 'if event == Ev.LOW_VOLTAGE1 then ...' },
    'Ev.LOW_VOLTAGE2': { desc: 'Низкое напряжение 2 (критическое)', syntax: 'Ev.LOW_VOLTAGE2', params: '-', returns: 'число', example: 'if event == Ev.LOW_VOLTAGE2 then ...' },
    'Ev.POINT_REACHED': { desc: 'Точка достигнута', syntax: 'Ev.POINT_REACHED', params: '-', returns: 'число', example: 'if event == Ev.POINT_REACHED then ...' },
    'Ev.ENGINES_STARTED': { desc: 'Двигатели запущены', syntax: 'Ev.ENGINES_STARTED', params: '-', returns: 'число', example: 'if event == Ev.ENGINES_STARTED then ...' },
    'Ev.POINT_DECELERATION': { desc: 'Торможение перед точкой', syntax: 'Ev.POINT_DECELERATION', params: '-', returns: 'число', example: 'if event == Ev.POINT_DECELERATION then ...' },
    'Ev.SYNC_START': { desc: 'Синхронный старт', syntax: 'Ev.SYNC_START', params: '-', returns: 'число', example: 'if event == Ev.SYNC_START then ...' },
    'Ev.SHOCK': { desc: 'Удар', syntax: 'Ev.SHOCK', params: '-', returns: 'число', example: 'if event == Ev.SHOCK then ...' },
    'Ev.CONTROL_FAIL': { desc: 'Отказ управления', syntax: 'Ev.CONTROL_FAIL', params: '-', returns: 'число', example: 'if event == Ev.CONTROL_FAIL then ...' },
    'Ev.ENGINE_FAIL': { desc: 'Отказ двигателя', syntax: 'Ev.ENGINE_FAIL', params: '-', returns: 'число', example: 'if event == Ev.ENGINE_FAIL then ...' },
};

export const evConstants = [
    'MCE_PREFLIGHT', 
    'MCE_TAKEOFF', 
    'MCE_LANDING', 
    'ENGINES_ARM', 
    'ENGINES_DISARM',
    'TAKEOFF_COMPLETE', 
    'COPTER_LANDED', 
    'LOW_VOLTAGE', 
    'STATE_CHANGED', 
    'POINT_REACHED',
    'SHOCK',
    'BUTTON_PRESS',
    'RADIO_CONTROL',
    'WIFI_CONTROL',
    'AHRS_ERROR',
    'MAG_ERROR'
];
