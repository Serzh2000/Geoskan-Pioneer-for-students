import type { ApiDoc } from './api-docs-types.js';

export const pythonApiDocs: Record<string, ApiDoc> = {
    'Pioneer.arm': {
        desc: 'Р—Р°РїСѓСЃРє РјРѕС‚РѕСЂРѕРІ РєРІР°РґСЂРѕРєРѕРїС‚РµСЂР°.',
        syntax: 'pioneer.arm() -> bool',
        params: 'none',
        returns: 'bool',
        example: 'pioneer.arm()',
        kind: 'Method',
        insertText: 'arm()'
    },
    'Pioneer.disarm': {
        desc: 'РћС‚РєР»СЋС‡РµРЅРёРµ РјРѕС‚РѕСЂРѕРІ РєРІР°РґСЂРѕРєРѕРїС‚РµСЂР°.',
        syntax: 'pioneer.disarm() -> bool',
        params: 'none',
        returns: 'bool',
        example: 'pioneer.disarm()',
        kind: 'Method',
        insertText: 'disarm()'
    },
    'Pioneer.takeoff': {
        desc: 'РљРѕРјР°РЅРґР° РІР·Р»С‘С‚Р° РЅР° РІС‹СЃРѕС‚Сѓ takeoffAlt (РїР°СЂР°РјРµС‚СЂ Р°РІС‚РѕРїРёР»РѕС‚Р°).',
        syntax: 'pioneer.takeoff() -> bool',
        params: 'none',
        returns: 'bool',
        example: 'pioneer.takeoff()',
        kind: 'Method',
        insertText: 'takeoff()'
    },
    'Pioneer.land': {
        desc: 'РљРѕРјР°РЅРґР° РїРѕСЃР°РґРєРё.',
        syntax: 'pioneer.land() -> bool',
        params: 'none',
        returns: 'bool',
        example: 'pioneer.land()',
        kind: 'Method',
        insertText: 'land()'
    },
    'Pioneer.close_connection': {
        desc: 'Р—Р°РєСЂС‹С‚СЊ MAVLink СЃРѕРµРґРёРЅРµРЅРёРµ (РІ СЃРёРјСѓР»СЏС‚РѕСЂРµ РјРѕР¶РµС‚ Р±С‹С‚СЊ Р·Р°РіР»СѓС€РєРѕР№).',
        syntax: 'pioneer.close_connection()',
        params: 'none',
        returns: 'nil',
        example: 'pioneer.close_connection()',
        kind: 'Method',
        insertText: 'close_connection()'
    },
    'Pioneer.go_to_local_point': {
        desc: 'РџРѕР»С‘С‚ РІ С‚РѕС‡РєСѓ РІ Р»РѕРєР°Р»СЊРЅРѕР№ СЃРёСЃС‚РµРјРµ РєРѕРѕСЂРґРёРЅР°С‚ (РјРµС‚СЂС‹).',
        syntax: 'pioneer.go_to_local_point(x=None, y=None, z=None, yaw=None) -> bool',
        params: 'x,y,z (Рј), yaw (СЂР°РґРёР°РЅС‹, РѕРїС†РёРѕРЅР°Р»СЊРЅРѕ)',
        returns: 'bool',
        example: 'pioneer.go_to_local_point(x=1, y=1, z=1, yaw=0)',
        kind: 'Method',
        insertText: 'go_to_local_point(x=${1:x}, y=${2:y}, z=${3:z}, yaw=${4:yaw})'
    },
    'Pioneer.go_to_local_point_body_fixed': {
        desc: 'РџРѕР»С‘С‚ РІ С‚РѕС‡РєСѓ РІ СЃРёСЃС‚РµРјРµ РєРѕРѕСЂРґРёРЅР°С‚ РґСЂРѕРЅР° (body-fixed).',
        syntax: 'pioneer.go_to_local_point_body_fixed(x, y, z, yaw) -> bool',
        params: 'x,y,z (Рј), yaw (СЂР°РґРёР°РЅС‹)',
        returns: 'bool',
        example: 'pioneer.go_to_local_point_body_fixed(x=0, y=0, z=1, yaw=0)',
        kind: 'Method',
        insertText: 'go_to_local_point_body_fixed(x=${1:x}, y=${2:y}, z=${3:z}, yaw=${4:yaw})'
    },
    'Pioneer.point_reached': {
        desc: 'Р›Р°С‚С‡-С„Р»Р°Рі РґРѕСЃС‚РёР¶РµРЅРёСЏ РЅРѕРІРѕР№ С‚РѕС‡РєРё (СЃР±СЂР°СЃС‹РІР°РµС‚СЃСЏ РїРѕСЃР»Рµ РІС‹Р·РѕРІР°).',
        syntax: 'pioneer.point_reached() -> bool',
        params: 'none',
        returns: 'bool',
        example: 'if pioneer.point_reached():\n    print("reached")',
        kind: 'Method',
        insertText: 'point_reached()'
    },
    'Pioneer.set_manual_speed': {
        desc: 'РџРѕР»С‘С‚ СЃ Р·Р°РґР°РЅРЅРѕР№ СЃРєРѕСЂРѕСЃС‚СЊСЋ. РљРѕРјР°РЅРґСѓ РЅСѓР¶РЅРѕ РѕС‚РїСЂР°РІР»СЏС‚СЊ РїРѕСЃС‚РѕСЏРЅРЅРѕ.',
        syntax: 'pioneer.set_manual_speed(vx, vy, vz, yaw_rate) -> bool',
        params: 'vx,vy,vz (Рј/СЃ), yaw_rate (СЂР°Рґ/СЃ)',
        returns: 'bool',
        example: 'pioneer.set_manual_speed(vx=0, vy=1, vz=0, yaw_rate=0)',
        kind: 'Method',
        insertText: 'set_manual_speed(vx=${1:vx}, vy=${2:vy}, vz=${3:vz}, yaw_rate=${4:yaw_rate})'
    },
    'Pioneer.get_local_position_lps': {
        desc: 'РўРµРєСѓС‰РёРµ РєРѕРѕСЂРґРёРЅР°С‚С‹ РІ Р»РѕРєР°Р»СЊРЅРѕР№ СЃРёСЃС‚РµРјРµ (LPS).',
        syntax: 'pioneer.get_local_position_lps(get_last_received=True) -> list|None',
        params: 'get_last_received (bool)',
        returns: '[x, y, z] РёР»Рё None',
        example: 'pos = pioneer.get_local_position_lps()',
        kind: 'Method',
        insertText: 'get_local_position_lps(get_last_received=${1:True})'
    },
    'Pioneer.get_dist_sensor_data': {
        desc: 'Р”Р°РЅРЅС‹Рµ РґР°Р»СЊРЅРѕРјРµСЂР° (TOF/Rangefinder).',
        syntax: 'pioneer.get_dist_sensor_data(get_last_received=True) -> float|None',
        params: 'get_last_received (bool)',
        returns: 'meters РёР»Рё None',
        example: 'd = pioneer.get_dist_sensor_data()',
        kind: 'Method',
        insertText: 'get_dist_sensor_data(get_last_received=${1:True})'
    },
    'Pioneer.get_battery_status': {
        desc: 'РЎС‚Р°С‚СѓСЃ Р±Р°С‚Р°СЂРµРё (РЅР°РїСЂСЏР¶РµРЅРёРµ).',
        syntax: 'pioneer.get_battery_status(get_last_received=True) -> float|None',
        params: 'get_last_received (bool)',
        returns: 'voltage РёР»Рё None',
        example: 'v = pioneer.get_battery_status()',
        kind: 'Method',
        insertText: 'get_battery_status(get_last_received=${1:True})'
    },
    'Pioneer.get_autopilot_state': {
        desc: 'РўРµРєСѓС‰РµРµ СЃРѕСЃС‚РѕСЏРЅРёРµ Р°РІС‚РѕРїРёР»РѕС‚Р°.',
        syntax: 'pioneer.get_autopilot_state() -> str',
        params: 'none',
        returns: 'str',
        example: 'print(pioneer.get_autopilot_state())',
        kind: 'Method',
        insertText: 'get_autopilot_state()'
    },
    'Pioneer.led_control': {
        desc: 'РЈРїСЂР°РІР»РµРЅРёРµ RGB СЃРІРµС‚РѕРґРёРѕРґР°РјРё.',
        syntax: 'pioneer.led_control(r=0, g=0, b=0) -> bool',
        params: 'r,g,b (0..255)',
        returns: 'bool',
        example: 'pioneer.led_control(r=255, g=0, b=0)',
        kind: 'Method',
        insertText: 'led_control(r=${1:r}, g=${2:g}, b=${3:b})'
    },
    'Pioneer.send_rc_channels': {
        desc: 'РРјРёС‚Р°С†РёСЏ РїСЂРёС‘РјР° Р·РЅР°С‡РµРЅРёР№ РїРѕ РєР°РЅР°Р»Р°Рј РїСѓР»СЊС‚Р°.',
        syntax: 'pioneer.send_rc_channels(channel_1..channel_8) -> bool',
        params: 'channel_1..channel_8 (int)',
        returns: 'bool',
        example: 'pioneer.send_rc_channels(channel_1=1500, channel_2=1500, channel_3=1500, channel_4=1500)',
        kind: 'Method',
        insertText: 'send_rc_channels(channel_1=${1:1500}, channel_2=${2:1500}, channel_3=${3:1500}, channel_4=${4:1500})'
    },

    // Camera
    'Camera.get_frame': {
        desc: 'РџРѕР»СѓС‡РёС‚СЊ РєР°РґСЂ (РєР°Рє РјР°СЃСЃРёРІ Р±Р°Р№С‚РѕРІ).',
        syntax: 'camera.get_frame() -> bytes|None',
        params: 'none',
        returns: 'bytes РёР»Рё None',
        example: 'frame = camera.get_frame()',
        kind: 'Method',
        insertText: 'get_frame()'
    },
    'Camera.get_cv_frame': {
        desc: 'РџРѕР»СѓС‡РёС‚СЊ РїСЂРµРґРІР°СЂРёС‚РµР»СЊРЅРѕ РґРµРєРѕРґРёСЂРѕРІР°РЅРЅС‹Р№ OpenCV-РєР°РґСЂ.',
        syntax: 'camera.get_cv_frame() -> frame',
        params: 'none',
        returns: 'frame',
        example: 'img = camera.get_cv_frame()',
        kind: 'Method',
        insertText: 'get_cv_frame()'
    },
    'Camera.connect': {
        desc: 'Connect camera to the nearest video tower in simulator range.',
        syntax: 'camera.connect() -> bool',
        params: 'none',
        returns: 'bool',
        example: 'camera.connect()',
        kind: 'Method',
        insertText: 'connect()'
    },
    'Camera.disconnect': {
        desc: 'Disconnect camera from the current video tower.',
        syntax: 'camera.disconnect() -> bool',
        params: 'none',
        returns: 'bool',
        example: 'camera.disconnect()',
        kind: 'Method',
        insertText: 'disconnect()'
    },
    'Camera.connected': {
        desc: 'Check whether camera is currently connected to a video tower.',
        syntax: 'camera.connected() -> bool',
        params: 'none',
        returns: 'bool',
        example: 'camera.connected()',
        kind: 'Method',
        insertText: 'connected()'
    }
};
