import { createEventBlock, createStatementBlock, createTimerBlock } from './lesson-builders.js';
import { compileLuaEvents, compileLuaLinear, compileLuaTimed, compilePython } from './lesson-compilers.js';
import {
    LUA_LED_SEQUENCE_EXAMPLE,
    LUA_LED_SINGLE_EXAMPLE,
    LUA_MISSION_EXAMPLE,
    LUA_PREFLIGHT_EXAMPLE,
    LUA_TAKEOFF_EXAMPLE,
    PYTHON_ARM_EXAMPLE,
    PYTHON_LED_SEQUENCE_EXAMPLE,
    PYTHON_LED_SINGLE_EXAMPLE,
    PYTHON_MISSION_EXAMPLE,
    PYTHON_TAKEOFF_EXAMPLE
} from './snippets.js';
import type { GuideLesson, GuideLessonState } from './types.js';
import { GUIDE_CHAPTER_IDS } from './curriculum.js';
import { apiFocus } from './lesson-state-helpers.js';

export function getLuaLedLessons(): GuideLesson[] {
    return [
        {
            id: 'lua-led-single',
            chapterId: GUIDE_CHAPTER_IDS.foundations,
            badge: 'Задание 1',
            title: 'Зажечь один светодиод',
            goal: 'Соберите минимальный Lua-сценарий: сначала создайте `Ledbar`, затем задайте красный цвет первому диоду.',
            summary: 'Учимся связывать инициализацию устройства и первый вызов `leds:set(...)`.',
            lessonIntro: 'В этом уроке вы знакомитесь с самой простой цепочкой управления периферией: сначала нужно создать объект светодиодной ленты, а потом вызвать метод, который меняет состояние конкретного диода.',
            expectedOutcome: 'Скрипт создает объект `Ledbar` и сразу окрашивает один светодиод в красный.',
            builderHint: 'Все паззлы физически совместимы, но логически правильная цепочка здесь короткая: только создание ленты и установка цвета.',
            apiFocus: [
                apiFocus('Ledbar.new(count)', 'Создает объект светодиодной ленты. Без него переменная `leds` не появится, и вы не сможете вызывать методы управления цветом.', 'local leds = Ledbar.new(4)'),
                apiFocus('leds:set(index, r, g, b)', 'Меняет цвет конкретного светодиода. В этом уроке нужен первый диод и красный цвет.', 'leds:set(0, 1, 0, 0)')
            ],
            targetBlockIds: ['lua_ledbar_new', 'lua_led_set'],
            blocks: [
                createStatementBlock('lua-ledbar', 'создать Ledbar', 'local leds = Ledbar.new(4)', 'Инициализирует светодиодную ленту, без этого дальнейшие обращения к `leds:set(...)` не имеют смысла.', 'setup', 'local leds = Ledbar.new(4)'),
                createStatementBlock('lua-led-red', 'задать красный цвет', 'leds:set(0, 1, 0, 0)', 'Правильный целевой блок задания: первый диод загорается красным.', 'action', 'leds:set(0, 1, 0, 0)'),
                createStatementBlock('lua-led-blue', 'задать синий цвет', 'leds:set(0, 0, 0, 1)', 'Рабочая команда API, но для этого задания она приводит к неверному результату.', 'action', 'leds:set(0, 0, 0, 1)'),
                createTimerBlock('lua-wait-led', 'подождать 0.5 c', 'Timer.callLater(0.5, ...)', 'Пауза полезна для анимации, но в этом стартовом задании она не нужна.', 0.5),
                createStatementBlock('lua-led-print', 'вывести сообщение', 'print("LED готов")', 'Сообщение допустимо технически, но не относится к учебной цели задания.', 'check', 'print("LED готов")')
            ],
            links: [
                { label: 'Ledbar.new', query: 'Ledbar.new' },
                { label: 'leds:set', query: 'leds:set Ledbar' }
            ],
            solutionCode: LUA_LED_SINGLE_EXAMPLE,
            actionLabel: 'Открыть LED API',
            actionQuery: 'Ledbar.new leds:set',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Цвет назначен до создания `Ledbar`',
                    reason: '`leds:set(...)` обращается к объекту, который еще не создан, поэтому логика сценария нарушается.',
                    fix: 'Поставьте блок `создать Ledbar` первым.'
                },
                {
                    kind: 'warning',
                    title: 'Выбран другой цвет',
                    reason: 'Команда рабочая, но задание требует именно красный индикатор как контрольный результат.',
                    fix: 'Замените дополнительный цвет на блок `задать красный цвет`.'
                },
                {
                    kind: 'warning',
                    title: 'Добавлена лишняя пауза',
                    reason: 'Пауза не ломает синтаксис, но делает задание сложнее без пользы и скрывает основную идею инициализации.',
                    fix: 'Оставьте только создание ленты и вызов `leds:set(...)`.'
                }
            ],
            missingBlockDiagnostics: {
                'lua-ledbar': {
                    kind: 'error',
                    title: 'Пропущено создание `Ledbar`',
                    reason: 'Без `Ledbar.new(...)` объект `leds` не существует, поэтому команды установки цвета не на что применить.',
                    fix: 'Добавьте блок `создать Ledbar` в начало последовательности.'
                },
                'lua-led-red': {
                    kind: 'error',
                    title: 'Целевой цвет не задан',
                    reason: 'Сценарий не содержит команды `leds:set(0, 1, 0, 0)`, поэтому красный светодиод не включится.',
                    fix: 'Добавьте блок `задать красный цвет` после инициализации ленты.'
                }
            },
            extraBlockDiagnostics: {
                'lua-led-blue': {
                    kind: 'warning',
                    title: 'Использован неверный цвет',
                    reason: 'Команда `leds:set(0, 0, 0, 1)` корректна, но приводит к синему индикатору вместо требуемого красного.',
                    fix: 'Удалите синий блок или замените его на `задать красный цвет`.'
                },
                'lua-wait-led': {
                    kind: 'warning',
                    title: 'Анимационная пауза здесь лишняя',
                    reason: 'В первом задании нет последовательности смены кадров, поэтому `Timer.callLater(...)` не нужен.',
                    fix: 'Уберите паузу и оставьте только инициализацию и одну установку цвета.'
                },
                'lua-led-print': {
                    kind: 'warning',
                    title: 'Сообщение не заменяет вызов API',
                    reason: '`print(...)` лишь выводит текст и не управляет светодиодами, поэтому цель задания не достигается.',
                    fix: 'Используйте его только дополнительно, а основную цепочку соберите из `Ledbar.new(...)` и `leds:set(...)`.'
                }
            },
            orderRules: [
                {
                    before: 'lua-ledbar',
                    after: 'lua-led-red',
                    title: 'Цвет вызывается раньше инициализации',
                    reason: 'Логика Pioneer API нарушена: сначала должен появиться объект `Ledbar`, а уже потом можно обращаться к `leds:set(...)`.',
                    fix: 'Переместите блок `создать Ledbar` выше блока установки цвета.'
                }
            ],
            compile: compileLuaLinear
        },
        {
            id: 'lua-led-sequence',
            chapterId: GUIDE_CHAPTER_IDS.foundations,
            badge: 'Задание 2',
            title: 'Световая анимация с таймерами',
            goal: 'Соберите анимацию из трех состояний: синий, затем зеленый, затем красный, разделяя шаги таймерами.',
            summary: 'Закрепляем идею, что в Lua-миссиях шаги должны быть разведены по времени.',
            lessonIntro: 'Теперь одного вызова `leds:set(...)` уже недостаточно. В этом уроке `Timer.callLater(...)` работает не как отдельная "пауза в линии", а как обертка: все блоки, которые вы кладете под него, попадают внутрь `function() ... end` и выполняются позже.',
            expectedOutcome: 'Скрипт последовательно вызывает `leds:set(...)`, а таймеры раздвигают смену кадров на 0.5 и 1.0 секунды.',
            builderHint: 'Собирайте так: первый `leds:set(...)` идет сразу, затем блок `Timer.callLater(0.5)`, а уже внутри него лежит следующий цвет. Если внутри нужен еще один отложенный шаг, вложите туда второй `Timer.callLater(...)`.',
            apiFocus: [
                apiFocus('Timer.callLater(seconds, callback)', 'Запускает отложенный callback. В Blockly это значит: блок таймера оборачивает следующие вложенные блоки в `function() ... end` и выполняет их позже.', 'Timer.callLater(0.5, function() ... end)'),
                apiFocus('leds:set(index, r, g, b)', 'Используется несколько раз подряд, но между вызовами должны быть временные интервалы.', 'leds:set(1, 0, 1, 0)')
            ],
            targetBlockIds: ['lua_ledbar_new', 'lua_led_set', 'lua_timer_calllater', 'lua_led_set', 'lua_timer_calllater', 'lua_led_set'],
            blocks: [
                createStatementBlock('lua2-ledbar', 'создать Ledbar', 'local leds = Ledbar.new(4)', 'Без инициализации анимацию выводить некуда.', 'setup', 'local leds = Ledbar.new(4)'),
                createStatementBlock('lua2-blue', 'показать синий', 'leds:set(0, 0, 0, 1)', 'Первый кадр анимации.', 'action', 'leds:set(0, 0, 0, 1)'),
                createTimerBlock('lua2-wait-a', 'подождать 0.5 c', 'Timer.callLater(0.5, ...)', 'Создает второй шаг по времени.', 0.5),
                createStatementBlock('lua2-green', 'показать зеленый', 'leds:set(1, 0, 1, 0)', 'Второй кадр после первой паузы.', 'action', 'leds:set(1, 0, 1, 0)'),
                createTimerBlock('lua2-wait-b', 'подождать еще 0.5 c', 'Timer.callLater(1.0, ...)', 'Сдвигает третий кадр на суммарную секунду.', 0.5),
                createStatementBlock('lua2-red', 'показать красный', 'leds:set(2, 1, 0, 0)', 'Третий кадр анимации.', 'action', 'leds:set(2, 1, 0, 0)'),
                createStatementBlock('lua2-white', 'показать белый', 'leds:set(0, 1, 1, 1)', 'Корректная LED-команда, но она не входит в эталонную анимацию.', 'action', 'leds:set(0, 1, 1, 1)'),
                createStatementBlock('lua2-print', 'вывести статус', 'print("animation step")', 'Полезно для отладки, но не заменяет паузы и цвета.', 'check', 'print("animation step")')
            ],
            links: [
                { label: 'Timer.callLater', query: 'Timer.callLater' },
                { label: 'leds:set', query: 'leds:set Ledbar' }
            ],
            solutionCode: LUA_LED_SEQUENCE_EXAMPLE,
            actionLabel: 'Открыть таймеры',
            actionQuery: 'Timer.callLater leds:set',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Кадры идут без пауз',
                    reason: 'Если поставить несколько `leds:set(...)` подряд, визуально останется только последнее состояние.',
                    fix: 'Разведите смену цветов блоками ожидания.'
                },
                {
                    kind: 'error',
                    title: 'Инициализация стоит не первой',
                    reason: 'Как и в первом задании, к `leds:set(...)` нельзя обращаться до `Ledbar.new(...)`.',
                    fix: 'Начните цепочку с блока `создать Ledbar`.'
                },
                {
                    kind: 'warning',
                    title: 'Построен другой сценарий цвета',
                    reason: 'Команда рабочая, но результат не совпадает с эталонной анимацией урока.',
                    fix: 'Вернитесь к цепочке синий -> пауза -> зеленый -> пауза -> красный.'
                }
            ],
            missingBlockDiagnostics: {
                'lua2-ledbar': {
                    kind: 'error',
                    title: 'Не создана светодиодная лента',
                    reason: 'Без `Ledbar.new(...)` остальные шаги анимации логически некуда применять.',
                    fix: 'Поставьте блок `создать Ledbar` первым.'
                },
                'lua2-blue': {
                    kind: 'error',
                    title: 'Не задан первый кадр',
                    reason: 'Анимация должна начинаться с синего состояния, иначе теряется исходная точка сценария.',
                    fix: 'Добавьте блок `показать синий` сразу после инициализации.'
                },
                'lua2-wait-a': {
                    kind: 'error',
                    title: 'Пропущена первая пауза',
                    reason: 'Переход к зеленому произойдет слишком быстро и сольется с предыдущим кадром.',
                    fix: 'Вставьте блок `подождать 0.5 c` между синим и зеленым.'
                },
                'lua2-green': {
                    kind: 'error',
                    title: 'Пропущен второй кадр',
                    reason: 'Без зеленого блока анимация не демонстрирует переход между цветами.',
                    fix: 'Добавьте блок `показать зеленый` после первой паузы.'
                },
                'lua2-wait-b': {
                    kind: 'error',
                    title: 'Пропущена вторая пауза',
                    reason: 'Красный кадр должен появиться позже зеленого, иначе они схлопнутся.',
                    fix: 'Добавьте блок `подождать еще 0.5 c` перед последним цветом.'
                },
                'lua2-red': {
                    kind: 'error',
                    title: 'Пропущен финальный кадр',
                    reason: 'Без красного шага анимация не завершается контрольным цветом.',
                    fix: 'Добавьте блок `показать красный` после второй паузы.'
                }
            },
            extraBlockDiagnostics: {
                'lua2-white': {
                    kind: 'warning',
                    title: 'Добавлен лишний цвет',
                    reason: 'Белый цвет является рабочим API-вызовом, но ломает учебную последовательность из трех заданных кадров.',
                    fix: 'Удалите белый блок, чтобы анимация осталась синий -> зеленый -> красный.'
                },
                'lua2-print': {
                    kind: 'warning',
                    title: 'Отладочный вывод не управляет временем',
                    reason: '`print(...)` не создает задержку и не меняет LED-состояние, поэтому не решает задачу анимации.',
                    fix: 'Используйте таймеры и вызовы `leds:set(...)`.'
                }
            },
            orderRules: [
                {
                    before: 'lua2-ledbar',
                    after: 'lua2-blue',
                    title: 'Первый цвет стоит до создания ленты',
                    reason: 'Блок `leds:set(...)` не должен выполняться раньше `Ledbar.new(...)`.',
                    fix: 'Переместите `создать Ledbar` в начало.'
                },
                {
                    before: 'lua2-blue',
                    after: 'lua2-wait-a',
                    title: 'После синего отсутствует временной разрыв',
                    reason: 'Первая пауза должна идти сразу за первым цветом, иначе логика анимации не читается.',
                    fix: 'Поставьте блок ожидания сразу после синего кадра.'
                },
                {
                    before: 'lua2-wait-a',
                    after: 'lua2-green',
                    title: 'Зеленый кадр не привязан к первой паузе',
                    reason: 'Зеленый цвет должен быть действием внутри первого отложенного шага, а не раньше него.',
                    fix: 'Переместите `показать зеленый` ниже первой паузы.'
                },
                {
                    before: 'lua2-green',
                    after: 'lua2-wait-b',
                    title: 'Вторая пауза стоит не на своем месте',
                    reason: 'Между зеленым и красным нужен еще один временной переход.',
                    fix: 'Разместите вторую паузу после зеленого блока.'
                },
                {
                    before: 'lua2-wait-b',
                    after: 'lua2-red',
                    title: 'Красный кадр выполняется слишком рано',
                    reason: 'Последний цвет должен сработать после суммарной секунды ожидания.',
                    fix: 'Поставьте красный блок после второй паузы.'
                }
            ],
            compile: compileLuaTimed
        },
    ];
}
