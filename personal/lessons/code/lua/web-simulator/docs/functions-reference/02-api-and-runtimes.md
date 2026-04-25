# API-запросы и рантаймы

Интеграции Lua/Python, публикация OpenAPI, клиентские и серверные точки взаимодействия с внешними сценариями и API.

## Состав группы

- [`openapi.yaml`](#openapi-yaml)
- [`public/modules/lua/autopilot.ts`](#public-modules-lua-autopilot-ts)
- [`public/modules/lua/hardware.ts`](#public-modules-lua-hardware-ts)
- [`public/modules/lua/index.ts`](#public-modules-lua-index-ts)
- [`public/modules/lua/leds.ts`](#public-modules-lua-leds-ts)
- [`public/modules/lua/runner.ts`](#public-modules-lua-runner-ts)
- [`public/modules/lua/sensors.ts`](#public-modules-lua-sensors-ts)
- [`public/modules/lua/timers.ts`](#public-modules-lua-timers-ts)
- [`public/modules/python/index.ts`](#public-modules-python-index-ts)
- [`public/modules/python/runtime.ts`](#public-modules-python-runtime-ts)
- [`public/modules/ui/api-docs-ui.ts`](#public-modules-ui-api-docs-ui-ts)

## Файлы

<a id="openapi-yaml"></a>
### `openapi.yaml`

- Исходник: [открыть файл](../../openapi.yaml)
- Кратко: Контракт API и источник схемы для Swagger/OpenAPI.
- Обнаружено функций/методов: 0

<a id="public-modules-lua-autopilot-ts"></a>
### `public/modules/lua/autopilot.ts`

- Исходник: [открыть файл](../../public/modules/lua/autopilot.ts)
- Кратко: Модуль Lua-моста и исполнения Lua-логики.
- Обнаружено функций/методов: 5
- Ключевые символы: `ap_goToLocalPoint`, `ap_goToPoint`, `ap_push`, `ap_updateYaw`, `setLocalFrameOrigin`

<a id="public-modules-lua-hardware-ts"></a>
### `public/modules/lua/hardware.ts`

- Исходник: [открыть файл](../../public/modules/lua/hardware.ts)
- Кратко: Модуль Lua-моста и исполнения Lua-логики.
- Обнаружено функций/методов: 7
- Ключевые символы: `camera_checkRequestShot`, `camera_requestMakeShot`, `camera_requestRecordStart`, `camera_requestRecordStop`, `gpio_new`, `spi_new`, `uart_new`

<a id="public-modules-lua-index-ts"></a>
### `public/modules/lua/index.ts`

- Исходник: [открыть файл](../../public/modules/lua/index.ts)
- Кратко: Модуль Lua-моста и исполнения Lua-логики.
- Обнаружено функций/методов: 6
- Ключевые символы: `callback`, `runLuaScript`, `setupLuaBridgeForDrone`, `stopLuaScript`, `triggerLuaCallback`, `updateTimers`

<a id="public-modules-lua-leds-ts"></a>
### `public/modules/lua/leds.ts`

- Исходник: [открыть файл](../../public/modules/lua/leds.ts)
- Кратко: Модуль Lua-моста и исполнения Lua-логики.
- Обнаружено функций/методов: 3
- Ключевые символы: `js_init_leds`, `js_ledbar_set`, `ledbar_fromHSV`

<a id="public-modules-lua-runner-ts"></a>
### `public/modules/lua/runner.ts`

- Исходник: [открыть файл](../../public/modules/lua/runner.ts)
- Кратко: Модуль Lua-моста и исполнения Lua-логики.
- Обнаружено функций/методов: 1
- Ключевые символы: `runCoroutine`

<a id="public-modules-lua-sensors-ts"></a>
### `public/modules/lua/sensors.ts`

- Исходник: [открыть файл](../../public/modules/lua/sensors.ts)
- Кратко: Модуль Lua-моста и исполнения Lua-логики.
- Обнаружено функций/методов: 8
- Ключевые символы: `sensors_accel`, `sensors_battery`, `sensors_gyro`, `sensors_orientation`, `sensors_pos`, `sensors_range`, `sensors_tof`, `sensors_vel`

<a id="public-modules-lua-timers-ts"></a>
### `public/modules/lua/timers.ts`

- Исходник: [открыть файл](../../public/modules/lua/timers.ts)
- Кратко: Модуль Lua-моста и исполнения Lua-логики.
- Обнаружено функций/методов: 5
- Ключевые символы: `js_sleep`, `sys_deltaTime`, `sys_time`, `timer_callLater`, `timer_new`

<a id="public-modules-python-index-ts"></a>
### `public/modules/python/index.ts`

- Исходник: [открыть файл](../../public/modules/python/index.ts)
- Кратко: Модуль Python/Pyodide-интеграции.
- Обнаружено функций/методов: 0

<a id="public-modules-python-runtime-ts"></a>
### `public/modules/python/runtime.ts`

- Исходник: [открыть файл](../../public/modules/python/runtime.ts)
- Кратко: Модуль Python/Pyodide-интеграции.
- Обнаружено функций/методов: 8
- Ключевые символы: `ensurePyodide`, `getDroneOrDefault`, `initPythonRuntime`, `installJsRuntimeAPI`, `installPioneerSdkModule`, `loadScript`, `runPythonScript`, `stopPythonScript`

<a id="public-modules-ui-api-docs-ui-ts"></a>
### `public/modules/ui/api-docs-ui.ts`

- Исходник: [открыть файл](../../public/modules/ui/api-docs-ui.ts)
- Кратко: Пользовательский интерфейс и рабочие панели симулятора.
- Обнаружено функций/методов: 1
- Ключевые символы: `renderApiDocs`

