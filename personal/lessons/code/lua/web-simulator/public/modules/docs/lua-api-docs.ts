import type { ApiDoc } from './api-docs-types.js';

export const luaApiDocs: Record<string, ApiDoc> = {
    // Autopilot
    'ap.push': {
        desc: 'Р”РѕР±Р°РІР»СЏРµС‚ РєРѕРјР°РЅРґСѓ РІ РѕС‡РµСЂРµРґСЊ Р°РІС‚РѕРїРёР»РѕС‚Р°.',
        syntax: 'ap.push(event)',
        params: 'event (С‡РёСЃР»Рѕ РёР»Рё РєРѕРЅСЃС‚Р°РЅС‚Р° Ev.*)',
        returns: 'nil',
        example: 'ap.push(Ev.MCE_TAKEOFF)',
        kind: 'Method',
        insertText: 'push(${1:event})'
    },
    'ap.goToLocalPoint': {
        desc: 'РџРѕР»РµС‚ РІ С‚РѕС‡РєСѓ РІ Р»РѕРєР°Р»СЊРЅРѕР№ СЃРёСЃС‚РµРјРµ РєРѕРѕСЂРґРёРЅР°С‚ (РјРµС‚СЂС‹).',
        syntax: 'ap.goToLocalPoint(x, y, z, [time])',
        params: 'x, y, z (С‡РёСЃР»Р°), time (СЃРµРєСѓРЅРґС‹, РѕРїС†РёРѕРЅР°Р»СЊРЅРѕ)',
        returns: 'nil',
        example: 'ap.goToLocalPoint(1.5, 0, 1.0, 5)',
        kind: 'Method',
        insertText: 'goToLocalPoint(${1:x}, ${2:y}, ${3:z}, ${4:time})'
    },
    'ap.goToPoint': {
        desc: 'РџРѕР»РµС‚ РІ РіР»РѕР±Р°Р»СЊРЅС‹Рµ РєРѕРѕСЂРґРёРЅР°С‚С‹ (GPS).',
        syntax: 'ap.goToPoint(lat, lon, alt)',
        params: 'lat (С€РёСЂРѕС‚Р° * 10^7), lon (РґРѕР»РіРѕС‚Р° * 10^7), alt (РјРµС‚СЂС‹)',
        returns: 'nil',
        example: 'ap.goToPoint(600859810, 304206500, 50)',
        kind: 'Method',
        insertText: 'goToPoint(${1:lat}, ${2:lon}, ${3:alt})'
    },
    'ap.updateYaw': {
        desc: 'РЈСЃС‚Р°РЅРѕРІРєР° СѓРіР»Р° СЂС‹СЃРєР°РЅРёСЏ (РєСѓСЂСЃР°).',
        syntax: 'ap.updateYaw(angle)',
        params: 'angle (СЂР°РґРёР°РЅС‹)',
        returns: 'nil',
        example: 'ap.updateYaw(Math.PI / 2)',
        kind: 'Method',
        insertText: 'updateYaw(${1:angle})'
    },

    // Timer
    'Timer.callLater': {
        desc: 'Р’С‹РїРѕР»РЅРµРЅРёРµ С„СѓРЅРєС†РёРё С‡РµСЂРµР· Р·Р°РґРµСЂР¶РєСѓ.',
        syntax: 'Timer.callLater(delay, func)',
        params: 'delay (СЃРµРєСѓРЅРґС‹), func (С„СѓРЅРєС†РёСЏ)',
        returns: 'nil',
        example: 'Timer.callLater(2, function() print("Done") end)',
        kind: 'Method',
        insertText: 'callLater(${1:delay}, function()\n\t${2}\nend)'
    },
    'Timer.new': {
        desc: 'РЎРѕР·РґР°РЅРёРµ С†РёРєР»РёС‡РµСЃРєРѕРіРѕ С‚Р°Р№РјРµСЂР°.',
        syntax: 'Timer.new(period, func)',
        params: 'period (СЃРµРєСѓРЅРґС‹), func (С„СѓРЅРєС†РёСЏ)',
        returns: 'Timer object',
        example: 'local t = Timer.new(1, function() ... end)',
        kind: 'Method',
        insertText: 'new(${1:period}, function()\n\t${2}\nend)'
    },
    'Timer.start': { desc: 'Р—Р°РїСѓСЃРє С‚Р°Р№РјРµСЂР°.', syntax: 'timer:start()', kind: 'Method', insertText: 'start()' },
    'Timer.stop': { desc: 'РћСЃС‚Р°РЅРѕРІРєР° С‚Р°Р№РјРµСЂР°.', syntax: 'timer:stop()', kind: 'Method', insertText: 'stop()' },
    'Timer.callAt': { desc: 'Р’С‹Р·РѕРІ С„СѓРЅРєС†РёРё РІ РѕРїСЂРµРґРµР»РµРЅРЅРѕРµ Р»РѕРєР°Р»СЊРЅРѕРµ РІСЂРµРјСЏ.', syntax: 'Timer.callAt(time, func)', kind: 'Method', insertText: 'callAt(${1:time}, function()\n\t${2}\nend)' },
    'Timer.callAtGlobal': { desc: 'Р’С‹Р·РѕРІ С„СѓРЅРєС†РёРё РІ РіР»РѕР±Р°Р»СЊРЅРѕРµ РІСЂРµРјСЏ.', syntax: 'Timer.callAtGlobal(time, func)', kind: 'Method', insertText: 'callAtGlobal(${1:time}, function()\n\t${2}\nend)' },

    // Ledbar
    'Ledbar.new': {
        desc: 'РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ СЃРІРµС‚РѕРґРёРѕРґРЅРѕР№ Р»РµРЅС‚С‹.',
        syntax: 'Ledbar.new(count)',
        params: 'count (С‡РёСЃР»Рѕ СЃРІРµС‚РѕРґРёРѕРґРѕРІ)',
        returns: 'Ledbar object',
        example: 'local leds = Ledbar.new(4)',
        kind: 'Method',
        insertText: 'new(${1:count})'
    },
    'Ledbar.fromHSV': {
        desc: 'РљРѕРЅРІРµСЂС‚Р°С†РёСЏ HSV РІ RGB.',
        syntax: 'Ledbar.fromHSV(h, s, v)',
        params: 'h (0-360), s (0-100), v (0-100)',
        returns: 'r, g, b (0-1)',
        example: 'local r,g,b = Ledbar.fromHSV(120, 100, 100)',
        kind: 'Method',
        insertText: 'fromHSV(${1:h}, ${2:s}, ${3:v})'
    },
    'Ledbar:set': {
        desc: 'РЈСЃС‚Р°РЅРѕРІРєР° С†РІРµС‚Р° СЃРІРµС‚РѕРґРёРѕРґР°.',
        syntax: 'leds:set(index, r, g, b, [w])',
        params: 'index (0..N-1), r,g,b (0-1), w (0-1, РѕРїС†.)',
        returns: 'nil',
        example: 'leds:set(0, 1, 0, 0)',
        kind: 'Method',
        insertText: 'set(${1:index}, ${2:r}, ${3:g}, ${4:b})'
    },

    // Sensors
    'Sensors.lpsPosition': {
        desc: 'РџРѕР»СѓС‡РµРЅРёРµ С‚РµРєСѓС‰РёС… РєРѕРѕСЂРґРёРЅР°С‚.',
        syntax: 'Sensors.lpsPosition()',
        params: 'none',
        returns: 'x, y, z (РјРµС‚СЂС‹)',
        example: 'local x, y, z = Sensors.lpsPosition()',
        kind: 'Method',
        insertText: 'lpsPosition()'
    },
    'Sensors.lpsVelocity': {
        desc: 'РџРѕР»СѓС‡РµРЅРёРµ С‚РµРєСѓС‰РµР№ СЃРєРѕСЂРѕСЃС‚Рё.',
        syntax: 'Sensors.lpsVelocity()',
        params: 'none',
        returns: 'vx, vy, vz (Рј/СЃ)',
        example: 'local vx, vy, vz = Sensors.lpsVelocity()',
        kind: 'Method',
        insertText: 'lpsVelocity()'
    },
    'Sensors.lpsYaw': { desc: 'РЈРіРѕР» СЂС‹СЃРєР°РЅРёСЏ РІ Р»РѕРєР°Р»СЊРЅРѕР№ СЃРёСЃС‚РµРјРµ РєРѕРѕСЂРґРёРЅР°С‚.', syntax: 'Sensors.lpsYaw()', returns: 'yaw (СЂР°РґРёР°РЅС‹)', kind: 'Method', insertText: 'lpsYaw()' },
    'Sensors.orientation': {
        desc: 'РџРѕР»СѓС‡РµРЅРёРµ СѓРіР»РѕРІ РѕСЂРёРµРЅС‚Р°С†РёРё (Р­Р№Р»РµСЂ).',
        syntax: 'Sensors.orientation()',
        params: 'none',
        returns: 'roll, pitch, yaw (СЂР°РґРёР°РЅС‹)',
        example: 'local r, p, y = Sensors.orientation()',
        kind: 'Method',
        insertText: 'orientation()'
    },
    'Sensors.altitude': { desc: 'Р’С‹СЃРѕС‚Р° РїРѕ Р±Р°СЂРѕРјРµС‚СЂСѓ.', syntax: 'Sensors.altitude()', returns: 'alt (РјРµС‚СЂС‹)', kind: 'Method', insertText: 'altitude()' },
    'Sensors.accel': { desc: 'РЈСЃРєРѕСЂРµРЅРёРµ РїРѕ РѕСЃСЏРј.', syntax: 'Sensors.accel()', returns: 'ax, ay, az (Рј/СЃВІ)', kind: 'Method', insertText: 'accel()' },
    'Sensors.gyro': { desc: 'РЈРіР»РѕРІР°СЏ СЃРєРѕСЂРѕСЃС‚СЊ.', syntax: 'Sensors.gyro()', returns: 'gx, gy, gz (СЂР°Рґ/СЃ)', kind: 'Method', insertText: 'gyro()' },
    'Sensors.rc': { desc: 'Р—РЅР°С‡РµРЅРёСЏ РєР°РЅР°Р»РѕРІ РїСѓР»СЊС‚Р° Р РЈ.', syntax: 'Sensors.rc()', returns: 'ch1, ch2, ch3, ch4, ...', kind: 'Method', insertText: 'rc()' },
    'Sensors.battery': {
        desc: 'РќР°РїСЂСЏР¶РµРЅРёРµ Р±Р°С‚Р°СЂРµРё.',
        syntax: 'Sensors.battery()',
        params: 'none',
        returns: 'voltage (РІРѕР»СЊС‚С‹)',
        example: 'local v = Sensors.battery()',
        kind: 'Method',
        insertText: 'battery()'
    },
    'Sensors.range': {
        desc: 'Р’С‹СЃРѕС‚Р° РїРѕ РґР°Р»СЊРЅРѕРјРµСЂСѓ (Р»Р°Р·РµСЂ/СѓР»СЊС‚СЂР°Р·РІСѓРє).',
        syntax: 'Sensors.range()',
        params: 'none',
        returns: 'dist (РјРµС‚СЂС‹)',
        example: 'local d = Sensors.range()',
        kind: 'Method',
        insertText: 'range()'
    },
    'Sensors.tof': {
        desc: 'Р”Р°РЅРЅС‹Рµ СЃ TOF-СЃРµРЅСЃРѕСЂР°.',
        syntax: 'Sensors.tof()',
        params: 'none',
        returns: 'dist (РјРј)',
        example: 'local d = Sensors.tof()',
        kind: 'Method',
        insertText: 'tof()'
    },

    // Camera
    'camera.requestMakeShot': {
        desc: 'Р—Р°РїСЂРѕСЃ РЅР° СЃРѕР·РґР°РЅРёРµ СЃРЅРёРјРєР°.',
        syntax: 'camera.requestMakeShot()',
        params: 'none',
        returns: 'nil',
        example: 'camera.requestMakeShot()',
        kind: 'Method',
        insertText: 'requestMakeShot()'
    },
    'camera.checkRequestShot': {
        desc: 'РџСЂРѕРІРµСЂРєР° СЃС‚Р°С‚СѓСЃР° Р·Р°РїСЂРѕСЃР° РЅР° СЃРЅРёРјРѕРє.',
        syntax: 'camera.checkRequestShot()',
        params: 'none',
        returns: '1 (РіРѕС‚РѕРІ) РёР»Рё 0 (РІ РїСЂРѕС†РµСЃСЃРµ)',
        example: 'if camera.checkRequestShot() == 1 then print("Р“РѕС‚РѕРІРѕ") end',
        kind: 'Method',
        insertText: 'checkRequestShot()'
    },
    'camera.requestRecordStart': {
        desc: 'Р—Р°РїСЂРѕСЃ РЅР° СЃС‚Р°СЂС‚ Р·Р°РїРёСЃРё РІРёРґРµРѕ.',
        syntax: 'camera.requestRecordStart()',
        params: 'none',
        returns: 'nil',
        example: 'camera.requestRecordStart()',
        kind: 'Method',
        insertText: 'requestRecordStart()'
    },
    'camera.requestRecordStop': {
        desc: 'Р—Р°РїСЂРѕСЃ РЅР° РѕСЃС‚Р°РЅРѕРІРєСѓ Р·Р°РїРёСЃРё РІРёРґРµРѕ.',
        syntax: 'camera.requestRecordStop()',
        params: 'none',
        returns: 'nil',
        example: 'camera.requestRecordStop()',
        kind: 'Method',
        insertText: 'requestRecordStop()'
    },
    'camera.checkRequestRecord': {
        desc: 'РџСЂРѕРІРµСЂРєР° СЃС‚Р°С‚СѓСЃР° Р·Р°РїРёСЃРё РІРёРґРµРѕ.',
        syntax: 'camera.checkRequestRecord()',
        params: 'none',
        returns: '1 (Р·Р°РїРёСЃСЊ РёРґРµС‚) РёР»Рё 0',
        example: 'if camera.checkRequestRecord() == 1 then print("РџРёС€РµРј...") end',
        kind: 'Method',
        insertText: 'checkRequestRecord()'
    },
    
    // Globals
    'time': {
        desc: 'Р’СЂРµРјСЏ СЃ РјРѕРјРµРЅС‚Р° РІРєР»СЋС‡РµРЅРёСЏ РєРѕРїС‚РµСЂР°.',
        syntax: 'time()',
        params: 'none',
        returns: 'seconds (С‡РёСЃР»Рѕ)',
        example: 'local t = time()',
        kind: 'Function',
        insertText: 'time()'
    },
    'launchTime': { desc: 'Р’СЂРµРјСЏ СЃ РјРѕРјРµРЅС‚Р° РІР·Р»РµС‚Р° РєРѕРїС‚РµСЂР°.', syntax: 'launchTime()', returns: 'seconds', kind: 'Function', insertText: 'launchTime()' },
    'deltaTime': {
        desc: 'Р’СЂРµРјСЏ, РїСЂРѕС€РµРґС€РµРµ СЃ РїСЂРµРґС‹РґСѓС‰РµРіРѕ РєР°РґСЂР°.',
        syntax: 'deltaTime()',
        params: 'none',
        returns: 'seconds (С‡РёСЃР»Рѕ)',
        example: 'local dt = deltaTime()',
        kind: 'Function',
        insertText: 'deltaTime()'
    },
    'sleep': {
        desc: 'Р‘Р»РѕРєРёСЂСѓСЋС‰Р°СЏ РїР°СѓР·Р° (РЅРµ СЂРµРєРѕРјРµРЅРґСѓРµС‚СЃСЏ).',
        syntax: 'sleep(seconds)',
        params: 'seconds (С‡РёСЃР»Рѕ)',
        returns: 'nil',
        example: 'sleep(1.5)',
        kind: 'Function',
        insertText: 'sleep(${1:seconds})'
    },
    'boardNumber': { desc: 'РќРѕРјРµСЂ РїР»Р°С‚С‹ (РєРѕРїС‚РµСЂР°).', syntax: 'boardNumber()', returns: 'number', kind: 'Function', insertText: 'boardNumber()' },
    
    // Peripherals
    'Gpio.new': { desc: 'РЎРѕР·РґР°РЅРёРµ GPIO.', kind: 'Method', insertText: 'new(${1:port}, ${2:pin}, ${3:mode})' },
    'Gpio.read': { desc: 'Р§С‚РµРЅРёРµ Р·РЅР°С‡РµРЅРёСЏ РїРёРЅР°.', kind: 'Method', insertText: 'read()' },
    'Gpio.set': { desc: 'РЈСЃС‚Р°РЅРѕРІРєР° РїРёРЅР° РІ 1.', kind: 'Method', insertText: 'set()' },
    'Gpio.reset': { desc: 'РЈСЃС‚Р°РЅРѕРІРєР° РїРёРЅР° РІ 0.', kind: 'Method', insertText: 'reset()' },
    'Gpio.write': { desc: 'Р—Р°РїРёСЃСЊ Р·РЅР°С‡РµРЅРёСЏ РЅР° РїРёРЅ.', syntax: 'gpio:write(val)', kind: 'Method', insertText: 'write(${1:val})' },
    'Gpio.setFunction': { desc: 'РЈСЃС‚Р°РЅРѕРІРєР° Р°Р»СЊС‚РµСЂРЅР°С‚РёРІРЅРѕР№ С„СѓРЅРєС†РёРё РїРёРЅР°.', kind: 'Method', insertText: 'setFunction(${1:func})' },
    
    'Uart.new': { desc: 'РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ UART.', kind: 'Method', insertText: 'new(${1:num}, ${2:rate})' },
    'Uart.read': { desc: 'Р§С‚РµРЅРёРµ РёР· UART.', syntax: 'uart:read(bytes)', kind: 'Method', insertText: 'read(${1:bytes})' },
    'Uart.write': { desc: 'Р—Р°РїРёСЃСЊ РІ UART.', syntax: 'uart:write(data)', kind: 'Method', insertText: 'write(${1:data})' },
    'Uart.bytesToRead': { desc: 'РљРѕР»РёС‡РµСЃС‚РІРѕ Р±Р°Р№С‚ РІ Р±СѓС„РµСЂРµ UART.', kind: 'Method', insertText: 'bytesToRead()' },
    'Uart.setBaudRate': { desc: 'РР·РјРµРЅРµРЅРёРµ СЃРєРѕСЂРѕСЃС‚Рё UART.', kind: 'Method', insertText: 'setBaudRate(${1:rate})' },
    
    'Spi.new':  { desc: 'РЎРѕР·РґР°РЅРёРµ SPI.',  kind: 'Method', insertText: 'new(${1:num}, ${2:rate})' },
    'Spi.read': { desc: 'Р§С‚РµРЅРёРµ РёР· SPI.', syntax: 'spi:read(count)', kind: 'Method', insertText: 'read(${1:count})' },
    'Spi.write': { desc: 'Р—Р°РїРёСЃСЊ РІ SPI.', syntax: 'spi:write(data)', kind: 'Method', insertText: 'write(${1:data})' },
    'Spi.exchange': { desc: 'Р”РІСѓСЃС‚РѕСЂРѕРЅРЅРёР№ РѕР±РјРµРЅ РїРѕ SPI.', syntax: 'spi:exchange(data)', kind: 'Method', insertText: 'exchange(${1:data})' },
    
    // Mailbox
    'mailbox.connect': { desc: 'РџРѕРґРєР»СЋС‡РµРЅРёРµ Рє РїРѕС‡С‚РѕРІРѕРјСѓ СЏС‰РёРєСѓ.', syntax: 'mailbox.connect(server)', kind: 'Method', insertText: 'connect(${1:server})' },
    'mailbox.hasMessages': { desc: 'РџСЂРѕРІРµСЂРєР° РЅР°Р»РёС‡РёСЏ СЃРѕРѕР±С‰РµРЅРёР№.', syntax: 'mailbox.hasMessages()', kind: 'Method', insertText: 'hasMessages()' },
    'mailbox.myHullNumber': { desc: 'РџРѕР»СѓС‡РµРЅРёРµ Р±РѕСЂС‚РѕРІРѕРіРѕ РЅРѕРјРµСЂР° РёР· mailbox.', syntax: 'mailbox.myHullNumber()', kind: 'Method', insertText: 'myHullNumber()' },
    'mailbox.receive': { desc: 'РџРѕР»СѓС‡РµРЅРёРµ СЃРѕРѕР±С‰РµРЅРёСЏ.', syntax: 'mailbox.receive([wait])', kind: 'Method', insertText: 'receive()' },
    'mailbox.send': { desc: 'РћС‚РїСЂР°РІРєР° СЃРѕРѕР±С‰РµРЅРёСЏ.', syntax: 'mailbox.send(to, data)', kind: 'Method', insertText: 'send(${1:to}, ${2:data})' },
    'mailbox.setHullNumber': { desc: 'РЈСЃС‚Р°РЅРѕРІРєР° Р±РѕСЂС‚РѕРІРѕРіРѕ РЅРѕРјРµСЂР° РІ mailbox.', syntax: 'mailbox.setHullNumber(num)', kind: 'Method', insertText: 'setHullNumber(${1:num})' },
    
    // Ev Constants Descriptions (Tooltips)
    'Ev.MCE_PREFLIGHT': { desc: 'РџСЂРµРґРїРѕР»РµС‚РЅР°СЏ РїРѕРґРіРѕС‚РѕРІРєР°. Р—Р°РїСѓСЃС‚РёС‚СЊ РґРІРёРіР°С‚РµР»Рё Рё РїСЂРѕРІРµСЃС‚Рё РїРѕРґРіРѕС‚РѕРІРєСѓ', syntax: 'Ev.MCE_PREFLIGHT', params: '-', returns: 'С‡РёСЃР»Рѕ (ID СЃРѕР±С‹С‚РёСЏ)', example: 'ap.push(Ev.MCE_PREFLIGHT)' },
    'Ev.MCE_TAKEOFF': { desc: 'РћС‚РїСЂР°РІРёС‚СЊ РЅР° РІР·Р»РµС‚', syntax: 'Ev.MCE_TAKEOFF', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'ap.push(Ev.MCE_TAKEOFF)' },
    'Ev.MCE_LANDING': { desc: 'РћС‚РїСЂР°РІРёС‚СЊ РЅР° РїРѕСЃР°РґРєСѓ', syntax: 'Ev.MCE_LANDING', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'ap.push(Ev.MCE_LANDING)' },
    'Ev.ENGINES_ARM': { desc: 'Р—Р°РІРµСЃС‚Рё РґРІРёРіР°С‚РµР»Рё', syntax: 'Ev.ENGINES_ARM', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'ap.push(Ev.ENGINES_ARM)' },
    'Ev.ENGINES_DISARM': { desc: 'РћС‚РєР»СЋС‡РёС‚СЊ РґРІРёРіР°С‚РµР»Рё', syntax: 'Ev.ENGINES_DISARM', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'ap.push(Ev.ENGINES_DISARM)' },
    'Ev.TAKEOFF_COMPLETE': { desc: 'Р’Р·Р»РµС‚ Р·Р°РІРµСЂС€РµРЅ', syntax: 'Ev.TAKEOFF_COMPLETE', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.TAKEOFF_COMPLETE then ...' },
    'Ev.COPTER_LANDED': { desc: 'РљРѕРїС‚РµСЂ РїСЂРёР·РµРјР»РёР»СЃСЏ', syntax: 'Ev.COPTER_LANDED', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.COPTER_LANDED then ...' },
    'Ev.LOW_VOLTAGE1': { desc: 'РќРёР·РєРѕРµ РЅР°РїСЂСЏР¶РµРЅРёРµ 1 (РїСЂРµРґСѓРїСЂРµР¶РґРµРЅРёРµ)', syntax: 'Ev.LOW_VOLTAGE1', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.LOW_VOLTAGE1 then ...' },
    'Ev.LOW_VOLTAGE2': { desc: 'РќРёР·РєРѕРµ РЅР°РїСЂСЏР¶РµРЅРёРµ 2 (РєСЂРёС‚РёС‡РµСЃРєРѕРµ)', syntax: 'Ev.LOW_VOLTAGE2', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.LOW_VOLTAGE2 then ...' },
    'Ev.POINT_REACHED': { desc: 'РўРѕС‡РєР° РґРѕСЃС‚РёРіРЅСѓС‚Р°', syntax: 'Ev.POINT_REACHED', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.POINT_REACHED then ...' },
    'Ev.ENGINES_STARTED': { desc: 'Р”РІРёРіР°С‚РµР»Рё Р·Р°РїСѓС‰РµРЅС‹', syntax: 'Ev.ENGINES_STARTED', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.ENGINES_STARTED then ...' },
    'Ev.POINT_DECELERATION': { desc: 'РўРѕСЂРјРѕР¶РµРЅРёРµ РїРµСЂРµРґ С‚РѕС‡РєРѕР№', syntax: 'Ev.POINT_DECELERATION', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.POINT_DECELERATION then ...' },
    'Ev.SYNC_START': { desc: 'РЎРёРЅС…СЂРѕРЅРЅС‹Р№ СЃС‚Р°СЂС‚', syntax: 'Ev.SYNC_START', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.SYNC_START then ...' },
    'Ev.SHOCK': { desc: 'РЈРґР°СЂ', syntax: 'Ev.SHOCK', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.SHOCK then ...' },
    'Ev.CONTROL_FAIL': { desc: 'РћС‚РєР°Р· СѓРїСЂР°РІР»РµРЅРёСЏ', syntax: 'Ev.CONTROL_FAIL', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.CONTROL_FAIL then ...' },
    'Ev.ENGINE_FAIL': { desc: 'РћС‚РєР°Р· РґРІРёРіР°С‚РµР»СЏ', syntax: 'Ev.ENGINE_FAIL', params: '-', returns: 'С‡РёСЃР»Рѕ', example: 'if event == Ev.ENGINE_FAIL then ...' },
};
