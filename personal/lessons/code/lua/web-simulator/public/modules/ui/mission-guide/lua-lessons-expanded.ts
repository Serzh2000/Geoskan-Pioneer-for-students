import { createEventBlock, createStatementBlock, createTimerBlock } from './lesson-builders.js';
import { compileLuaEvents, compileLuaLinear, compileLuaTimed } from './lesson-compilers.js';
import { GUIDE_CHAPTER_IDS } from './curriculum.js';
import { apiFocus } from './lesson-state-helpers.js';
import type { GuideLesson } from './types.js';

export function getLuaExpandedLessons(): GuideLesson[] {
    return [
        {
            id: 'lua-led-confirm',
            chapterId: GUIDE_CHAPTER_IDS.foundations,
            badge: 'Задание 3',
            title: 'Световой сигнал с подтверждением',
            goal: 'Соберите короткий сценарий индикации: создайте `Ledbar(29)`, включите зеленый сигнал и выведите текстовое подтверждение.',
            summary: 'Урок связывает визуальную индикацию и простой лог, чтобы ученик видел и физический, и текстовый результат выполнения.',
            lessonIntro: 'Здесь вы тренируете полезную привычку: подтверждать важный шаг миссии сразу двумя каналами. Светодиод показывает состояние на модели дрона, а `print(...)` помогает отследить тот же этап в консоли симулятора.',
            expectedOutcome: 'Сценарий создает `Ledbar`, включает зеленый индикатор и выводит сообщение о готовности сигнала.',
            builderHint: 'Логика линейная: сначала инициализация периферии, затем управление цветом, затем текстовое подтверждение.',
            apiFocus: [
                apiFocus('Ledbar.new(count)', 'Создает объект светодиодной ленты, который нужен для дальнейшего управления цветом. Для этих уроков используем `Ledbar.new(29)`.', 'local leds = Ledbar.new(29)'),
                apiFocus('leds:set(index, r, g, b)', 'Меняет цвет светодиода и выступает визуальным индикатором состояния.', 'leds:set(0, 0, 1, 0)'),
                apiFocus('print(...)', 'Не управляет дроном напрямую, но полезен как журнал шага миссии.', 'print("Сигнал готов")')
            ],
            targetBlockIds: ['lua_ledbar_new', 'lua_led_set', 'lua_print', 'lua_callback_open', 'lua_callback_end'],
            blocks: [
                createStatementBlock('lua6-ledbar', 'создать Ledbar', 'local leds = Ledbar.new(29)', 'Готовит объект светодиодной ленты через `Ledbar.new(29)`.', 'setup', 'local leds = Ledbar.new(29)'),
                createStatementBlock('lua6-green', 'включить зеленый', 'leds:set(0, 0, 1, 0)', 'Целевой сигнал урока.', 'action', 'leds:set(0, 0, 1, 0)'),
                createStatementBlock('lua6-print', 'сообщить о сигнале', 'print("Сигнал готов")', 'Текстовое подтверждение выполнения.', 'check', 'print("Сигнал готов")'),
                createTimerBlock('lua6-wait', 'подождать 1 c', 'Timer.callLater(1.0, ...)', 'Таймер здесь не обязателен и только усложняет сценарий.', 1),
                createStatementBlock('lua_callback_open', 'открыть callback', 'function callback(event)', 'Открывает обязательную событийную функцию Lua-сценария.', 'setup', 'function callback(event)'),
                createStatementBlock('lua_callback_end', 'закрыть callback', 'end', 'Закрывает область function callback(event).', 'setup', 'end')
            ],
            links: [
                { label: 'Ledbar.new', query: 'Ledbar.new' },
                { label: 'leds:set', query: 'leds:set Ledbar' },
                { label: 'print', query: 'lua print' }
            ],
            solutionCode: `local leds = Ledbar.new(29)
leds:set(0, 0, 1, 0)
print("Сигнал готов")

function callback(event)
end`,
            actionLabel: 'Открыть индикацию и лог',
            actionQuery: 'Ledbar.new leds:set print',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Индикация вызвана без подготовки ленты',
                    reason: 'Если не создать `Ledbar`, последующие команды цвета не к чему применять.',
                    fix: 'Поставьте `Ledbar.new(...)` первым шагом.'
                }
            ],
            missingBlockDiagnostics: {
                lua_ledbar_new: {
                    kind: 'error',
                    title: 'Не создан объект `Ledbar`',
                    reason: 'Без инициализации ленты урок не показывает работу периферии.',
                    fix: 'Добавьте блок создания `Ledbar` в начало.'
                },
                lua_led_set: {
                    kind: 'error',
                    title: 'Нет светового подтверждения',
                    reason: 'Урок требует не только текст, но и видимый зеленый сигнал.',
                    fix: 'Добавьте блок `leds:set(...)` после создания ленты.'
                },
                lua_print: {
                    kind: 'warning',
                    title: 'Не выведено текстовое подтверждение',
                    reason: 'Свет загорается, но пользователь не видит сопутствующий лог выполнения.',
                    fix: 'Добавьте `print(...)` в конец цепочки.'
                },
                'lua_callback_open': {
                    kind: 'error',
                    title: 'Не открыт callback',
                    reason: 'В интерактивном учебнике `function callback(event)` должен быть отдельным открывающим блоком.',
                    fix: 'Добавьте блок `открыть callback` перед событийной логикой.'
                },
                'lua_callback_end': {
                    kind: 'error',
                    title: 'Не закрыт callback',
                    reason: 'Конструкция `function callback(event)` должна завершаться отдельным независимым блоком `end`.',
                    fix: 'Добавьте блок `закрыть callback` после содержимого callback.'
                }
            },
            extraBlockDiagnostics: {
                lua_timer_calllater: {
                    kind: 'warning',
                    title: 'Лишний таймер',
                    reason: 'В этом упражнении нет многошаговой анимации, поэтому задержка не нужна.',
                    fix: 'Уберите `Timer.callLater(...)` и оставьте прямую последовательность.'
                }
            },
            orderRules: [
                {
                    before: 'lua_ledbar_new',
                    after: 'lua_led_set',
                    title: 'Цвет задан раньше инициализации',
                    reason: 'Сначала нужно создать `Ledbar`, и только потом обращаться к `leds:set(...)`.',
                    fix: 'Переместите блок создания ленты выше блока цвета.'
                },
                {
                    before: 'lua_led_set',
                    after: 'lua_print',
                    title: 'Сообщение появляется раньше сигнала',
                    reason: 'Текст должен подтверждать уже выполненное LED-действие, а не предшествовать ему.',
                    fix: 'Поставьте `print(...)` после `leds:set(...)`.'
                }
            ],
            compile: compileLuaLinear
        },
        {
            id: 'lua-led-delayed',
            chapterId: GUIDE_CHAPTER_IDS.foundations,
            badge: 'Задание 4',
            title: 'Отложенный световой отклик',
            goal: 'Соберите сценарий, где после создания `Ledbar(29)` через таймер включается синий сигнал и печатается сообщение о срабатывании.',
            summary: 'Урок показывает, как использовать `Timer.callLater(...)` для реакции с задержкой, не блокируя основной поток сценария.',
            lessonIntro: 'Задание моделирует типичную ситуацию: действие должно произойти не сразу, а после паузы. В Lua это удобно оформлять через таймер с вложенным callback, в который и помещаются полезные действия.',
            expectedOutcome: 'Сценарий создает `Ledbar`, а затем через `Timer.callLater(...)` включает синий LED и выводит сообщение о срабатывании.',
            builderHint: 'В линейной части оставьте только создание `Ledbar`. Все остальные шаги должны жить внутри таймера.',
            apiFocus: [
                apiFocus('Timer.callLater(seconds, callback)', 'Позволяет отложить выполнение блока действий без блокировки всего сценария.', 'Timer.callLater(1.0, function() ... end)'),
                apiFocus('leds:set(...) и print(...)', 'В этом уроке оба действия должны быть вложены в callback таймера.', 'leds:set(1, 0, 0, 1)')
            ],
            targetBlockIds: ['lua_ledbar_new', 'lua_timer_calllater', 'lua_led_set', 'lua_print', 'lua_callback_open', 'lua_callback_end'],
            blocks: [
                createStatementBlock('lua7-ledbar', 'создать Ledbar', 'local leds = Ledbar.new(29)', 'Подготавливает периферию через `Ledbar.new(29)`.', 'setup', 'local leds = Ledbar.new(29)'),
                createTimerBlock('lua7-timer', 'сработать через 1 c', 'Timer.callLater(1.0, ...)', 'Контейнер для отложенных действий.', 1),
                createStatementBlock('lua7-blue', 'включить синий', 'leds:set(1, 0, 0, 1)', 'LED-индикация внутри callback.', 'action', 'leds:set(1, 0, 0, 1)'),
                createStatementBlock('lua7-print', 'сообщить о таймере', 'print("Таймер сработал")', 'Текстовое подтверждение события.', 'check', 'print("Таймер сработал")'),
                createStatementBlock('lua_callback_open', 'открыть callback', 'function callback(event)', 'Открывает обязательную событийную функцию Lua-сценария.', 'setup', 'function callback(event)'),
                createStatementBlock('lua_callback_end', 'закрыть callback', 'end', 'Закрывает область function callback(event).', 'setup', 'end')
            ],
            links: [
                { label: 'Timer.callLater', query: 'Timer.callLater' },
                { label: 'leds:set', query: 'leds:set Ledbar' }
            ],
            solutionCode: `local leds = Ledbar.new(29)

Timer.callLater(1.0, function()
    leds:set(1, 0, 0, 1)
    print("Таймер сработал")
end)

function callback(event)
end`,
            actionLabel: 'Открыть отложенные действия',
            actionQuery: 'Timer.callLater leds:set print',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Отложенное действие не собрано',
                    reason: 'Без `Timer.callLater(...)` урок теряет основной смысл и превращается в обычную линейную команду.',
                    fix: 'Оберните полезные действия в блок таймера.'
                }
            ],
            missingBlockDiagnostics: {
                lua_ledbar_new: {
                    kind: 'error',
                    title: 'Нет инициализации `Ledbar`',
                    reason: 'Даже отложенный callback должен работать с уже созданной лентой.',
                    fix: 'Добавьте `Ledbar.new(...)` в начало.'
                },
                lua_timer_calllater: {
                    kind: 'error',
                    title: 'Не добавлен таймер',
                    reason: 'Урок специально проверяет отложенное действие, а не мгновенный вызов.',
                    fix: 'Добавьте `Timer.callLater(...)` после создания ленты.'
                },
                lua_led_set: {
                    kind: 'error',
                    title: 'Нет светового действия внутри таймера',
                    reason: 'Callback есть, но он не показывает наблюдаемый результат.',
                    fix: 'Добавьте `leds:set(...)` внутрь таймера.'
                },
                lua_print: {
                    kind: 'warning',
                    title: 'Нет текстового подтверждения таймера',
                    reason: 'Сигнал появится, но лог не покажет, что callback действительно был вызван.',
                    fix: 'Добавьте `print(...)` после LED-команды.'
                },
                'lua_callback_open': {
                    kind: 'error',
                    title: 'Не открыт callback',
                    reason: 'В интерактивном учебнике `function callback(event)` должен быть отдельным открывающим блоком.',
                    fix: 'Добавьте блок `открыть callback` перед событийной логикой.'
                },
                'lua_callback_end': {
                    kind: 'error',
                    title: 'Не закрыт callback',
                    reason: 'Конструкция `function callback(event)` должна завершаться отдельным независимым блоком `end`.',
                    fix: 'Добавьте блок `закрыть callback` после содержимого callback.'
                }
            },
            extraBlockDiagnostics: {},
            orderRules: [
                {
                    before: 'lua_ledbar_new',
                    after: 'lua_timer_calllater',
                    title: 'Таймер идет раньше инициализации',
                    reason: 'Отложенный callback должен опираться на уже созданный объект `Ledbar`.',
                    fix: 'Поставьте создание ленты первым.'
                }
            ],
            compile: compileLuaTimed
        },
        {
            id: 'lua-route',
            chapterId: GUIDE_CHAPTER_IDS.flight,
            badge: 'Задание 7',
            title: 'Полет к точке после взлета',
            goal: 'Соберите FSM-цепочку, где `goToLocalPoint(...)` отправляется только после события `TAKEOFF_COMPLETE`.',
            summary: 'Задание выделяет навигационный переход как отдельную тему: маршрут запускается не сразу после взлета, а после подтверждения завершения набора высоты.',
            lessonIntro: 'В реальной логике миссии маршрут не должен начинаться в момент отправки взлета. Правильнее дождаться `TAKEOFF_COMPLETE`, и только затем переходить к команде полета в локальную точку.',
            expectedOutcome: 'Сценарий отправляет `PREFLIGHT`, по `ENGINES_STARTED` вызывает `TAKEOFF`, а по `TAKEOFF_COMPLETE` запускает `ap.goToLocalPoint(...)`.',
            builderHint: 'Следите за тем, чтобы `goToLocalPoint(...)` оказался в ветке `TAKEOFF_COMPLETE`, а не рядом с корневыми командами.',
            apiFocus: [
                apiFocus('Ev.TAKEOFF_COMPLETE', 'Это событие подтверждает, что взлет завершен и дрон может перейти к маршруту.', 'if event == Ev.TAKEOFF_COMPLETE then ... end'),
                apiFocus('ap.goToLocalPoint(x, y, z)', 'Запускает реальное перемещение дрона к локальной координате.', 'ap.goToLocalPoint(1, 0, 1)')
            ],
            targetBlockIds: ['lua_ap_push', 'lua_event_callback', 'lua_ap_push', 'lua_event_callback', 'lua_goto_local_point', 'lua_callback_open', 'lua_callback_end'],
            blocks: [
                createStatementBlock('lua8-preflight', 'PREFLIGHT', 'ap.push(Ev.MCE_PREFLIGHT)', 'Старт миссии.', 'setup', 'ap.push(Ev.MCE_PREFLIGHT)'),
                createEventBlock('lua8-engines', 'ждать ENGINES_STARTED', 'if event == Ev.ENGINES_STARTED', 'Открывает ветку взлета.', 'Ev.ENGINES_STARTED'),
                createStatementBlock('lua8-takeoff', 'TAKEOFF', 'ap.push(Ev.MCE_TAKEOFF)', 'Поднимает дрон.', 'action', 'ap.push(Ev.MCE_TAKEOFF)'),
                createEventBlock('lua8-complete', 'ждать TAKEOFF_COMPLETE', 'if event == Ev.TAKEOFF_COMPLETE', 'Только после него допустим маршрут.', 'Ev.TAKEOFF_COMPLETE'),
                createStatementBlock('lua8-goto', 'лететь к точке', 'ap.goToLocalPoint(1, 0, 1)', 'Целевой навигационный шаг.', 'action', 'ap.goToLocalPoint(1, 0, 1)'),
                createStatementBlock('lua8-print', 'сообщить о маршруте', 'print("Маршрут стартовал")', 'Допустимый лог, но не основной шаг.', 'check', 'print("Маршрут стартовал")'),
                createStatementBlock('lua_callback_open', 'открыть callback', 'function callback(event)', 'Открывает обязательную событийную функцию Lua-сценария.', 'setup', 'function callback(event)'),
                createStatementBlock('lua_callback_end', 'закрыть callback', 'end', 'Закрывает область function callback(event).', 'setup', 'end')
            ],
            links: [
                { label: 'Ev.TAKEOFF_COMPLETE', query: 'Ev.TAKEOFF_COMPLETE' },
                { label: 'ap.goToLocalPoint', query: 'ap.goToLocalPoint', previewKey: 'ap.goToLocalPoint' }
            ],
            solutionCode: `ap.push(Ev.MCE_PREFLIGHT)

function callback(event)
    if event == Ev.ENGINES_STARTED then
        ap.push(Ev.MCE_TAKEOFF)
    end

    if event == Ev.TAKEOFF_COMPLETE then
        ap.goToLocalPoint(1, 0, 1)
    end
end`,
            actionLabel: 'Открыть переход к точке',
            actionQuery: 'Ev.TAKEOFF_COMPLETE ap.goToLocalPoint',
            actionPreviewKey: 'ap.goToLocalPoint',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Маршрут отправляется без завершенного взлета',
                    reason: '`goToLocalPoint(...)` должен идти после `TAKEOFF_COMPLETE`, иначе дрон получает команду маршрута слишком рано.',
                    fix: 'Проверьте, что полет к точке находится в ветке `TAKEOFF_COMPLETE`.'
                }
            ],
            missingBlockDiagnostics: {
                lua_ap_push: {
                    kind: 'error',
                    title: 'Не хватает команд автопилота',
                    reason: 'Для урока нужны и старт подготовки, и команда взлета.',
                    fix: 'Добавьте блоки `PREFLIGHT` и `TAKEOFF`.'
                },
                lua_event_callback: {
                    kind: 'error',
                    title: 'Не хватает событийной ветки',
                    reason: 'Навигация должна быть привязана к событиям FSM, а не стоять в корне сценария.',
                    fix: 'Используйте ожидание `ENGINES_STARTED` и `TAKEOFF_COMPLETE`.'
                },
                lua_goto_local_point: {
                    kind: 'error',
                    title: 'Не добавлен переход к точке',
                    reason: 'Сценарий доходит до взлета, но не выполняет навигационную часть.',
                    fix: 'Добавьте `ap.goToLocalPoint(...)` в ветку `TAKEOFF_COMPLETE`.'
                },
                'lua_callback_open': {
                    kind: 'error',
                    title: 'Не открыт callback',
                    reason: 'В интерактивном учебнике `function callback(event)` должен быть отдельным открывающим блоком.',
                    fix: 'Добавьте блок `открыть callback` перед событийной логикой.'
                },
                'lua_callback_end': {
                    kind: 'error',
                    title: 'Не закрыт callback',
                    reason: 'Конструкция `function callback(event)` должна завершаться отдельным независимым блоком `end`.',
                    fix: 'Добавьте блок `закрыть callback` после содержимого callback.'
                }
            },
            extraBlockDiagnostics: {
                lua_print: {
                    kind: 'warning',
                    title: 'Оставлен только лог вместо маршрута',
                    reason: '`print(...)` полезен как сопровождение, но не заменяет вызов `ap.goToLocalPoint(...)`.',
                    fix: 'Соберите полноценный маршрут, а лог оставьте только дополнительно.'
                }
            },
            orderRules: [
                {
                    before: 'lua_ap_push',
                    after: 'lua_event_callback',
                    title: 'Событие поставлено раньше старта миссии',
                    reason: 'Сначала должны уйти корневые команды автопилота, а затем ветки ожидания событий.',
                    fix: 'Начните сценарий с `PREFLIGHT`.'
                }
            ],
            compile: compileLuaEvents
        },
        {
            id: 'lua-point-confirm',
            chapterId: GUIDE_CHAPTER_IDS.flight,
            badge: 'Задание 8',
            title: 'Подтвердить достижение точки',
            goal: 'Расширьте маршрут: после `POINT_REACHED` выведите сообщение о достижении цели.',
            summary: 'Урок концентрируется на подтверждении результата маршрута и показывает, что событие точки полезно само по себе, даже до посадки.',
            lessonIntro: 'Частая ошибка начинающих заключается в том, что команда маршрута считается завершенной сразу после отправки. На самом деле нужно дождаться отдельного сигнала `POINT_REACHED` и только после него считать задачу выполненной.',
            expectedOutcome: 'Сценарий выполняет подготовку, взлет, полет к точке и по событию `POINT_REACHED` печатает сообщение о достижении цели.',
            builderHint: 'Ветка `POINT_REACHED` должна идти после ветки `TAKEOFF_COMPLETE`, потому что без маршрута событие точки просто не появится.',
            apiFocus: [
                apiFocus('Ev.POINT_REACHED', 'Подтверждает, что маршрут действительно выполнен.', 'if event == Ev.POINT_REACHED then ... end'),
                apiFocus('print(...)', 'В этом уроке лог нужен как подтверждение достижения навигационной цели.', 'print("Точка достигнута")')
            ],
            targetBlockIds: ['lua_ap_push', 'lua_event_callback', 'lua_ap_push', 'lua_event_callback', 'lua_goto_local_point', 'lua_event_callback', 'lua_print', 'lua_callback_open', 'lua_callback_end'],
            blocks: [
                createStatementBlock('lua9-preflight', 'PREFLIGHT', 'ap.push(Ev.MCE_PREFLIGHT)', 'Старт миссии.', 'setup', 'ap.push(Ev.MCE_PREFLIGHT)'),
                createEventBlock('lua9-engines', 'ждать ENGINES_STARTED', 'if event == Ev.ENGINES_STARTED', 'Стартовая ветка FSM.', 'Ev.ENGINES_STARTED'),
                createStatementBlock('lua9-takeoff', 'TAKEOFF', 'ap.push(Ev.MCE_TAKEOFF)', 'Взлет.', 'action', 'ap.push(Ev.MCE_TAKEOFF)'),
                createEventBlock('lua9-complete', 'ждать TAKEOFF_COMPLETE', 'if event == Ev.TAKEOFF_COMPLETE', 'Открывает маршрут.', 'Ev.TAKEOFF_COMPLETE'),
                createStatementBlock('lua9-goto', 'лететь к точке', 'ap.goToLocalPoint(1, 0, 1)', 'Навигационный шаг.', 'action', 'ap.goToLocalPoint(1, 0, 1)'),
                createEventBlock('lua9-point', 'ждать POINT_REACHED', 'if event == Ev.POINT_REACHED', 'Подтверждает достижение маршрута.', 'Ev.POINT_REACHED'),
                createStatementBlock('lua9-print', 'сообщить о точке', 'print("Точка достигнута")', 'Целевое подтверждение урока.', 'check', 'print("Точка достигнута")'),
                createStatementBlock('lua_callback_open', 'открыть callback', 'function callback(event)', 'Открывает обязательную событийную функцию Lua-сценария.', 'setup', 'function callback(event)'),
                createStatementBlock('lua_callback_end', 'закрыть callback', 'end', 'Закрывает область function callback(event).', 'setup', 'end')
            ],
            links: [
                { label: 'Ev.POINT_REACHED', query: 'Ev.POINT_REACHED' },
                { label: 'ap.goToLocalPoint', query: 'ap.goToLocalPoint', previewKey: 'ap.goToLocalPoint' }
            ],
            solutionCode: `ap.push(Ev.MCE_PREFLIGHT)

function callback(event)
    if event == Ev.ENGINES_STARTED then
        ap.push(Ev.MCE_TAKEOFF)
    end

    if event == Ev.TAKEOFF_COMPLETE then
        ap.goToLocalPoint(1, 0, 1)
    end

    if event == Ev.POINT_REACHED then
        print("Точка достигнута")
    end
end`,
            actionLabel: 'Открыть контроль точки',
            actionQuery: 'Ev.POINT_REACHED ap.goToLocalPoint print',
            actionPreviewKey: 'ap.goToLocalPoint',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Результат маршрута не подтвержден',
                    reason: 'Без отдельной ветки `POINT_REACHED` миссия не показывает, что маршрут действительно завершен.',
                    fix: 'Добавьте обработку `Ev.POINT_REACHED` с подтверждающим действием.'
                }
            ],
            missingBlockDiagnostics: {
                lua_goto_local_point: {
                    kind: 'error',
                    title: 'Нет полета к точке',
                    reason: 'Без маршрута событие `POINT_REACHED` не имеет смысла.',
                    fix: 'Добавьте `goToLocalPoint(...)` после `TAKEOFF_COMPLETE`.'
                },
                lua_print: {
                    kind: 'error',
                    title: 'Нет сообщения о достижении точки',
                    reason: 'Событие маршрута не подтверждено видимым действием.',
                    fix: 'Добавьте `print("Точка достигнута")` в ветку `POINT_REACHED`.'
                },
                'lua_callback_open': {
                    kind: 'error',
                    title: 'Не открыт callback',
                    reason: 'В интерактивном учебнике `function callback(event)` должен быть отдельным открывающим блоком.',
                    fix: 'Добавьте блок `открыть callback` перед событийной логикой.'
                },
                'lua_callback_end': {
                    kind: 'error',
                    title: 'Не закрыт callback',
                    reason: 'Конструкция `function callback(event)` должна завершаться отдельным независимым блоком `end`.',
                    fix: 'Добавьте блок `закрыть callback` после содержимого callback.'
                }
            },
            extraBlockDiagnostics: {},
            orderRules: [],
            compile: compileLuaEvents
        },
        {
            id: 'lua-landing',
            chapterId: GUIDE_CHAPTER_IDS.mission,
            badge: 'Задание 9',
            title: 'Посадка после подтверждения точки',
            goal: 'Соберите миссию, в которой посадка вызывается только после события `POINT_REACHED`.',
            summary: 'Это предпоследний шаг полной миссии: ученик закрепляет, что завершение маршрута тоже должно быть событийным и подтвержденным.',
            lessonIntro: 'Правильная посадка начинается не просто "когда кажется, что дрон уже долетел", а после события, которое подтверждает достижение нужной координаты. Этот урок делает акцент именно на безопасном завершении сценария.',
            expectedOutcome: 'Сценарий выполняет подготовку, взлет, полет к точке и по `POINT_REACHED` отправляет `LANDING`.',
            builderHint: 'Если `LANDING` стоит в корне или рядом с `TAKEOFF`, это почти всегда означает логическую ошибку.',
            apiFocus: [
                apiFocus('Ev.MCE_LANDING', 'Завершает миссию и должен отправляться только после подтверждения конца маршрута.', 'ap.push(Ev.MCE_LANDING)'),
                apiFocus('Ev.POINT_REACHED', 'Сигнал, который разрешает завершить маршрут посадкой.', 'if event == Ev.POINT_REACHED then ... end')
            ],
            targetBlockIds: ['lua_ap_push', 'lua_event_callback', 'lua_ap_push', 'lua_event_callback', 'lua_goto_local_point', 'lua_event_callback', 'lua_ap_push', 'lua_callback_open', 'lua_callback_end'],
            blocks: [
                createStatementBlock('lua10-preflight', 'PREFLIGHT', 'ap.push(Ev.MCE_PREFLIGHT)', 'Старт подготовки.', 'setup', 'ap.push(Ev.MCE_PREFLIGHT)'),
                createEventBlock('lua10-engines', 'ждать ENGINES_STARTED', 'if event == Ev.ENGINES_STARTED', 'Ветка запуска двигателей.', 'Ev.ENGINES_STARTED'),
                createStatementBlock('lua10-takeoff', 'TAKEOFF', 'ap.push(Ev.MCE_TAKEOFF)', 'Взлет.', 'action', 'ap.push(Ev.MCE_TAKEOFF)'),
                createEventBlock('lua10-complete', 'ждать TAKEOFF_COMPLETE', 'if event == Ev.TAKEOFF_COMPLETE', 'Открывает маршрут.', 'Ev.TAKEOFF_COMPLETE'),
                createStatementBlock('lua10-goto', 'лететь к точке', 'ap.goToLocalPoint(1, 0, 1)', 'Перемещение к цели.', 'action', 'ap.goToLocalPoint(1, 0, 1)'),
                createEventBlock('lua10-point', 'ждать POINT_REACHED', 'if event == Ev.POINT_REACHED', 'Подтверждает завершение маршрута.', 'Ev.POINT_REACHED'),
                createStatementBlock('lua10-land', 'LANDING', 'ap.push(Ev.MCE_LANDING)', 'Безопасное завершение миссии.', 'action', 'ap.push(Ev.MCE_LANDING)'),
                createStatementBlock('lua_callback_open', 'открыть callback', 'function callback(event)', 'Открывает обязательную событийную функцию Lua-сценария.', 'setup', 'function callback(event)'),
                createStatementBlock('lua_callback_end', 'закрыть callback', 'end', 'Закрывает область function callback(event).', 'setup', 'end')
            ],
            links: [
                { label: 'Ev.MCE_LANDING', query: 'Ev.MCE_LANDING' },
                { label: 'Ev.POINT_REACHED', query: 'Ev.POINT_REACHED' }
            ],
            solutionCode: `ap.push(Ev.MCE_PREFLIGHT)

function callback(event)
    if event == Ev.ENGINES_STARTED then
        ap.push(Ev.MCE_TAKEOFF)
    end

    if event == Ev.TAKEOFF_COMPLETE then
        ap.goToLocalPoint(1, 0, 1)
    end

    if event == Ev.POINT_REACHED then
        ap.push(Ev.MCE_LANDING)
    end
end`,
            actionLabel: 'Открыть посадку',
            actionQuery: 'Ev.MCE_LANDING Ev.POINT_REACHED',
            actionPreviewKey: 'ap.push',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Посадка не привязана к событию точки',
                    reason: 'Если отправить `LANDING` раньше, миссия завершится преждевременно и потеряет навигационную логику.',
                    fix: 'Оставьте посадку только в обработчике `POINT_REACHED`.'
                }
            ],
            missingBlockDiagnostics: {
                lua_goto_local_point: {
                    kind: 'error',
                    title: 'Нет маршрута до посадки',
                    reason: 'Урок проверяет завершение именно после полета к точке, а не сразу после взлета.',
                    fix: 'Добавьте `goToLocalPoint(...)` перед обработкой `POINT_REACHED`.'
                },
                lua_ap_push: {
                    kind: 'error',
                    title: 'Не хватает обязательных команд',
                    reason: 'Для урока нужна не только подготовка, но и финальная команда посадки.',
                    fix: 'Соберите полный набор команд автопилота.'
                },
                'lua_callback_open': {
                    kind: 'error',
                    title: 'Не открыт callback',
                    reason: 'В интерактивном учебнике `function callback(event)` должен быть отдельным открывающим блоком.',
                    fix: 'Добавьте блок `открыть callback` перед событийной логикой.'
                },
                'lua_callback_end': {
                    kind: 'error',
                    title: 'Не закрыт callback',
                    reason: 'Конструкция `function callback(event)` должна завершаться отдельным независимым блоком `end`.',
                    fix: 'Добавьте блок `закрыть callback` после содержимого callback.'
                }
            },
            extraBlockDiagnostics: {},
            orderRules: [],
            compile: compileLuaEvents
        }
    ];
}
