import { createStatementBlock } from './lesson-builders.js';
import { compilePython } from './lesson-compilers.js';
import { GUIDE_CHAPTER_IDS } from './curriculum.js';
import { apiFocus } from './lesson-state-helpers.js';
import type { GuideLesson } from './types.js';

export function getPythonExpandedLessons(): GuideLesson[] {
    return [
        {
            id: 'py-led-confirm',
            chapterId: GUIDE_CHAPTER_IDS.foundations,
            badge: 'Задание 3',
            title: 'Сигнал и текстовое подтверждение',
            goal: 'Соберите Python-сценарий, который включает зеленый LED и выводит сообщение о готовности сигнала.',
            summary: 'Урок учит подтверждать шаги миссии двумя способами: через видимую индикацию и через понятный лог в консоли.',
            lessonIntro: 'В Python линейный стиль особенно удобен для таких сценариев: вы просто читаете шаги сверху вниз и видите, что индикация и лог относятся к одному и тому же этапу.',
            expectedOutcome: 'Сценарий вызывает `pioneer.led_control(...)` для зеленого цвета и затем печатает сообщение о готовности.',
            builderHint: 'Сначала видимый эффект, затем текст. Такой порядок лучше читается и легче отлаживается.',
            apiFocus: [
                apiFocus('pioneer.led_control(r, g, b)', 'Меняет цвет подсветки дрона и дает мгновенный визуальный отклик.', 'pioneer.led_control(r=0, g=255, b=0)'),
                apiFocus('print(...)', 'Позволяет явно обозначить этап миссии в текстовом логе.', 'print("Сигнал готов")')
            ],
            targetBlockIds: ['py_led_control', 'py_print'],
            blocks: [
                createStatementBlock('py6-led', 'зеленый LED', 'pioneer.led_control(r=0, g=255, b=0)', 'Целевой световой сигнал.', 'action', 'pioneer.led_control(r=0, g=255, b=0)'),
                createStatementBlock('py6-print', 'сообщить о сигнале', 'print("Сигнал готов")', 'Подтверждает шаг текстом.', 'check', 'print("Сигнал готов")'),
                createStatementBlock('py6-sleep', 'пауза 0.5 c', 'time.sleep(0.5)', 'Пауза допустима, но для этого упражнения не обязательна.', 'wait', 'time.sleep(0.5)')
            ],
            links: [
                { label: 'Pioneer.led_control', query: 'Pioneer.led_control' },
                { label: 'print', query: 'python print' }
            ],
            solutionCode: `pioneer.led_control(r=0, g=255, b=0)
print("Сигнал готов")`,
            actionLabel: 'Открыть сигнализацию',
            actionQuery: 'Pioneer.led_control print',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Нет видимого подтверждения',
                    reason: 'Без `led_control(...)` пользователь не видит ключевой результат урока.',
                    fix: 'Добавьте блок управления LED перед `print(...)`.'
                }
            ],
            missingBlockDiagnostics: {
                py_led_control: {
                    kind: 'error',
                    title: 'Не добавлен LED-сигнал',
                    reason: 'Урок требует зеленую подсветку как основной наблюдаемый результат.',
                    fix: 'Добавьте `pioneer.led_control(...)` в начало.'
                },
                py_print: {
                    kind: 'warning',
                    title: 'Нет текстового подтверждения',
                    reason: 'Сигнал есть, но лог не показывает, что шаг осмысленно завершен.',
                    fix: 'Добавьте `print(...)` после LED-команды.'
                }
            },
            extraBlockDiagnostics: {
                py_time_sleep: {
                    kind: 'warning',
                    title: 'Лишняя пауза',
                    reason: 'Для одношагового подтверждения задержка не нужна и только растягивает выполнение.',
                    fix: 'Уберите `time.sleep(...)`, если он не нужен для наглядности.'
                }
            },
            orderRules: [
                {
                    before: 'py_led_control',
                    after: 'py_print',
                    title: 'Сообщение идет раньше сигнала',
                    reason: 'Лучше сначала показать наблюдаемый эффект, а затем подтвердить его текстом.',
                    fix: 'Переместите `print(...)` после `led_control(...)`.'
                }
            ],
            compile: compilePython
        },
        {
            id: 'py-led-delayed',
            chapterId: GUIDE_CHAPTER_IDS.foundations,
            badge: 'Задание 4',
            title: 'Отложенный световой отклик',
            goal: 'Соберите Python-цепочку, где после короткой паузы включается синий LED и печатается сообщение о срабатывании.',
            summary: 'Урок показывает базовую модель отложенной реакции в линейном Python-сценарии: `time.sleep(...)` между шагами.',
            lessonIntro: 'В отличие от Lua, где для задержки удобны callback-таймеры, в Python вы обычно явно вставляете `time.sleep(...)` в саму последовательность. Это делает логику очень читаемой: пауза просто находится между двумя действиями.',
            expectedOutcome: 'Сценарий делает паузу, затем включает синий LED и выводит сообщение о срабатывании.',
            builderHint: 'Порядок простой: сначала `time.sleep(...)`, затем LED, затем `print(...)`.',
            apiFocus: [
                apiFocus('time.sleep(seconds)', 'Явно откладывает следующий шаг и делает реакцию наблюдаемой.', 'time.sleep(1)'),
                apiFocus('pioneer.led_control(...)', 'Срабатывает уже после паузы и показывает отложенный отклик.', 'pioneer.led_control(r=0, g=0, b=255)')
            ],
            targetBlockIds: ['py_time_sleep', 'py_led_control', 'py_print'],
            blocks: [
                createStatementBlock('py7-wait', 'пауза 1 c', 'time.sleep(1)', 'Откладывает реакцию.', 'wait', 'time.sleep(1)'),
                createStatementBlock('py7-led', 'синий LED', 'pioneer.led_control(r=0, g=0, b=255)', 'Показывает результат после ожидания.', 'action', 'pioneer.led_control(r=0, g=0, b=255)'),
                createStatementBlock('py7-print', 'сообщить о срабатывании', 'print("Задержка завершена")', 'Подтверждает шаг логом.', 'check', 'print("Задержка завершена")')
            ],
            links: [
                { label: 'time.sleep', query: 'time.sleep' },
                { label: 'Pioneer.led_control', query: 'Pioneer.led_control' }
            ],
            solutionCode: `time.sleep(1)
pioneer.led_control(r=0, g=0, b=255)
print("Задержка завершена")`,
            actionLabel: 'Открыть паузу и отклик',
            actionQuery: 'time.sleep Pioneer.led_control',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Нет отложенного действия',
                    reason: 'Без `time.sleep(...)` урок теряет смысл реакции с задержкой.',
                    fix: 'Поставьте паузу перед LED-командой.'
                }
            ],
            missingBlockDiagnostics: {
                py_time_sleep: {
                    kind: 'error',
                    title: 'Не добавлена пауза',
                    reason: 'Реакция происходит мгновенно, а урок проверяет именно отложенный отклик.',
                    fix: 'Добавьте `time.sleep(...)` первым шагом.'
                },
                py_led_control: {
                    kind: 'error',
                    title: 'Нет LED-реакции после паузы',
                    reason: 'Сценарий ждет, но не показывает наблюдаемый результат.',
                    fix: 'Добавьте `pioneer.led_control(...)` после паузы.'
                },
                py_print: {
                    kind: 'warning',
                    title: 'Нет лог-подтверждения',
                    reason: 'Полезный визуальный эффект есть, но текстовое подтверждение не выведено.',
                    fix: 'Добавьте `print(...)` после LED-команды.'
                }
            },
            extraBlockDiagnostics: {},
            orderRules: [
                {
                    before: 'py_time_sleep',
                    after: 'py_led_control',
                    title: 'Синий сигнал включается до паузы',
                    reason: 'Урок специально учит откладывать наблюдаемый эффект, а не подтверждать его задним числом.',
                    fix: 'Переместите `time.sleep(...)` перед `led_control(...)`.'
                }
            ],
            compile: compilePython
        },
        {
            id: 'py-route',
            chapterId: GUIDE_CHAPTER_IDS.flight,
            badge: 'Задание 7',
            title: 'Полет к локальной точке',
            goal: 'Соберите базовую маршрутную цепочку: `arm()`, пауза, `takeoff()`, ожидание набора высоты и `go_to_local_point(...)`.',
            summary: 'Урок отделяет сам факт взлета от начала навигации и показывает, что маршрут тоже должен иметь свой осмысленный момент запуска.',
            lessonIntro: 'Даже в линейном Python-сценарии полезно мыслить этапами. Сначала дрон подготавливается, затем взлетает, затем получает время на набор высоты, и только после этого отправляется к точке.',
            expectedOutcome: 'Сценарий вызывает `arm()`, `takeoff()` и затем `go_to_local_point(...)` после пауз подготовки и набора высоты.',
            builderHint: 'Не пропускайте вторую паузу: она отделяет сам взлет от начала навигации.',
            apiFocus: [
                apiFocus('pioneer.go_to_local_point(x, y, z)', 'Отправляет дрон к локальной координате после взлета.', 'pioneer.go_to_local_point(x=1, y=0, z=1)'),
                apiFocus('time.sleep(3)', 'Дает дрону время закончить взлет и перейти к устойчивому полету.', 'time.sleep(3)')
            ],
            targetBlockIds: ['py_arm', 'py_time_sleep', 'py_takeoff', 'py_time_sleep', 'py_goto_local_point'],
            blocks: [
                createStatementBlock('py8-arm', 'arm()', 'pioneer.arm()', 'Подготовка к полету.', 'setup', 'pioneer.arm()'),
                createStatementBlock('py8-wait-start', 'пауза 1 c', 'time.sleep(1)', 'Разделяет arm и takeoff.', 'wait', 'time.sleep(1)'),
                createStatementBlock('py8-takeoff', 'takeoff()', 'pioneer.takeoff()', 'Взлет.', 'action', 'pioneer.takeoff()'),
                createStatementBlock('py8-wait-flight', 'подождать 3 c', 'time.sleep(3)', 'Дает набрать высоту.', 'wait', 'time.sleep(3)'),
                createStatementBlock('py8-goto', 'go_to_local_point()', 'pioneer.go_to_local_point(x=1, y=0, z=1)', 'Целевой маршрут.', 'action', 'pioneer.go_to_local_point(x=1, y=0, z=1)')
            ],
            links: [
                { label: 'Pioneer.go_to_local_point', query: 'Pioneer.go_to_local_point', previewKey: 'Pioneer.go_to_local_point' },
                { label: 'Pioneer.takeoff', query: 'Pioneer.takeoff', previewKey: 'Pioneer.takeoff' }
            ],
            solutionCode: `pioneer.arm()
time.sleep(1)
pioneer.takeoff()
time.sleep(3)
pioneer.go_to_local_point(x=1, y=0, z=1)`,
            actionLabel: 'Открыть маршрут',
            actionQuery: 'Pioneer.go_to_local_point Pioneer.takeoff',
            actionPreviewKey: 'Pioneer.go_to_local_point',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Маршрут отправлен слишком рано',
                    reason: 'Без подготовки и взлета команда `go_to_local_point(...)` не отражает корректный этап миссии.',
                    fix: 'Сначала соберите `arm()` и `takeoff()`, затем переходите к маршруту.'
                }
            ],
            missingBlockDiagnostics: {
                py_goto_local_point: {
                    kind: 'error',
                    title: 'Нет команды маршрута',
                    reason: 'Урок требует переход именно к локальной точке, а не только взлет.',
                    fix: 'Добавьте `go_to_local_point(...)` в конец цепочки.'
                }
            },
            extraBlockDiagnostics: {},
            orderRules: [
                {
                    before: 'py_time_sleep',
                    after: 'py_takeoff',
                    title: '`takeoff()` идет без разделяющей паузы',
                    reason: 'Первая пауза помогает явно отделить подготовку от взлета.',
                    fix: 'Поставьте `time.sleep(1)` между `arm()` и `takeoff()`.'
                }
            ],
            compile: compilePython
        },
        {
            id: 'py-point-wait',
            chapterId: GUIDE_CHAPTER_IDS.flight,
            badge: 'Задание 8',
            title: 'Дождаться достижения точки',
            goal: 'Расширьте маршрут: после `go_to_local_point(...)` дождитесь `point_reached()` и только затем выведите сообщение об успехе.',
            summary: 'Урок закрепляет ключевую мысль: отправка маршрута и завершение маршрута это разные вещи.',
            lessonIntro: 'В Python особенно легко написать слишком оптимистичный сценарий, где после команды маршрута сразу идет следующий шаг. Этот урок вводит обязательную проверку результата через `point_reached()`.',
            expectedOutcome: 'Сценарий долетает до точки, ждет завершения маршрута в цикле и только после этого печатает сообщение.',
            builderHint: 'Цикл ожидания должен стоять сразу после `go_to_local_point(...)`, иначе подтверждение маршрута станет преждевременным.',
            apiFocus: [
                apiFocus('pioneer.point_reached()', 'Сообщает, что дрон действительно достиг заданной координаты.', 'while not pioneer.point_reached():\n    time.sleep(0.05)'),
                apiFocus('print(...)', 'В этом уроке используется для подтверждения уже завершенного маршрута.', 'print("Точка достигнута")')
            ],
            targetBlockIds: ['py_arm', 'py_time_sleep', 'py_takeoff', 'py_time_sleep', 'py_goto_local_point', 'py_wait_point_reached', 'py_print'],
            blocks: [
                createStatementBlock('py9-arm', 'arm()', 'pioneer.arm()', 'Подготовка.', 'setup', 'pioneer.arm()'),
                createStatementBlock('py9-wait-start', 'пауза 1 c', 'time.sleep(1)', 'Разделяет arm и takeoff.', 'wait', 'time.sleep(1)'),
                createStatementBlock('py9-takeoff', 'takeoff()', 'pioneer.takeoff()', 'Взлет.', 'action', 'pioneer.takeoff()'),
                createStatementBlock('py9-wait-flight', 'подождать 3 c', 'time.sleep(3)', 'Дает набрать высоту.', 'wait', 'time.sleep(3)'),
                createStatementBlock('py9-goto', 'go_to_local_point()', 'pioneer.go_to_local_point(x=1, y=0, z=1)', 'Старт маршрута.', 'action', 'pioneer.go_to_local_point(x=1, y=0, z=1)'),
                createStatementBlock('py9-reached', 'ждать point_reached()', 'while not pioneer.point_reached():\n    time.sleep(0.05)', 'Ожидание фактического завершения.', 'wait', 'while not pioneer.point_reached():\n    time.sleep(0.05)'),
                createStatementBlock('py9-print', 'сообщить об успехе', 'print("Точка достигнута")', 'Текстовое подтверждение.', 'check', 'print("Точка достигнута")')
            ],
            links: [
                { label: 'Pioneer.point_reached', query: 'Pioneer.point_reached', previewKey: 'Pioneer.point_reached' },
                { label: 'Pioneer.go_to_local_point', query: 'Pioneer.go_to_local_point', previewKey: 'Pioneer.go_to_local_point' }
            ],
            solutionCode: `pioneer.arm()
time.sleep(1)
pioneer.takeoff()
time.sleep(3)
pioneer.go_to_local_point(x=1, y=0, z=1)
while not pioneer.point_reached():
    time.sleep(0.05)
print("Точка достигнута")`,
            actionLabel: 'Открыть ожидание точки',
            actionQuery: 'Pioneer.point_reached Pioneer.go_to_local_point',
            actionPreviewKey: 'Pioneer.point_reached',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Нет подтверждения завершения маршрута',
                    reason: 'Без цикла `point_reached()` сообщение об успехе появляется слишком рано.',
                    fix: 'Добавьте блок ожидания перед `print(...)`.'
                }
            ],
            missingBlockDiagnostics: {
                py_wait_point_reached: {
                    kind: 'error',
                    title: 'Нет ожидания `point_reached()`',
                    reason: 'Урок требует подтвердить завершение маршрута, а не просто отправить команду полета.',
                    fix: 'Добавьте блок `while not pioneer.point_reached(): ...`.'
                },
                py_print: {
                    kind: 'warning',
                    title: 'Нет сообщения о завершении',
                    reason: 'Маршрут завершен, но пользователь не получает явного подтверждения.',
                    fix: 'Добавьте `print("Точка достигнута")` в конец.'
                }
            },
            extraBlockDiagnostics: {},
            orderRules: [
                {
                    before: 'py_wait_point_reached',
                    after: 'py_print',
                    title: 'Сообщение выводится до подтверждения точки',
                    reason: 'Текст должен появляться только после завершения цикла ожидания.',
                    fix: 'Поставьте `print(...)` после `point_reached()`.'
                }
            ],
            compile: compilePython
        },
        {
            id: 'py-land',
            chapterId: GUIDE_CHAPTER_IDS.mission,
            badge: 'Задание 9',
            title: 'Посадка после маршрута',
            goal: 'Соберите полетную цепочку, где `land()` вызывается только после подтверждения `point_reached()`.',
            summary: 'Это предпоследний этап курса: безопасное завершение маршрута с явной проверкой результата перед посадкой.',
            lessonIntro: 'Посадка в учебной миссии должна быть финальным шагом, а не реакцией "по времени". Правильнее сначала убедиться, что точка достигнута, и только потом завершать полет.',
            expectedOutcome: 'Сценарий выполняет маршрут, ждет `point_reached()` и затем вызывает `pioneer.land()`.',
            builderHint: 'Если `land()` стоит выше блока ожидания точки, миссия завершится слишком рано.',
            apiFocus: [
                apiFocus('pioneer.land()', 'Завершает миссию после подтвержденного достижения цели.', 'pioneer.land()'),
                apiFocus('pioneer.point_reached()', 'Гарантирует, что маршрут действительно завершен к моменту посадки.', 'while not pioneer.point_reached():\n    time.sleep(0.05)')
            ],
            targetBlockIds: ['py_arm', 'py_time_sleep', 'py_takeoff', 'py_time_sleep', 'py_goto_local_point', 'py_wait_point_reached', 'py_land'],
            blocks: [
                createStatementBlock('py10-arm', 'arm()', 'pioneer.arm()', 'Подготовка.', 'setup', 'pioneer.arm()'),
                createStatementBlock('py10-wait-start', 'пауза 1 c', 'time.sleep(1)', 'Разделяет arm и takeoff.', 'wait', 'time.sleep(1)'),
                createStatementBlock('py10-takeoff', 'takeoff()', 'pioneer.takeoff()', 'Взлет.', 'action', 'pioneer.takeoff()'),
                createStatementBlock('py10-wait-flight', 'подождать 3 c', 'time.sleep(3)', 'Дает набрать высоту.', 'wait', 'time.sleep(3)'),
                createStatementBlock('py10-goto', 'go_to_local_point()', 'pioneer.go_to_local_point(x=1, y=0, z=1)', 'Маршрут.', 'action', 'pioneer.go_to_local_point(x=1, y=0, z=1)'),
                createStatementBlock('py10-reached', 'ждать point_reached()', 'while not pioneer.point_reached():\n    time.sleep(0.05)', 'Подтверждает достижение точки.', 'wait', 'while not pioneer.point_reached():\n    time.sleep(0.05)'),
                createStatementBlock('py10-land', 'land()', 'pioneer.land()', 'Безопасное завершение миссии.', 'action', 'pioneer.land()')
            ],
            links: [
                { label: 'Pioneer.land', query: 'Pioneer.land', previewKey: 'Pioneer.land' },
                { label: 'Pioneer.point_reached', query: 'Pioneer.point_reached', previewKey: 'Pioneer.point_reached' }
            ],
            solutionCode: `pioneer.arm()
time.sleep(1)
pioneer.takeoff()
time.sleep(3)
pioneer.go_to_local_point(x=1, y=0, z=1)
while not pioneer.point_reached():
    time.sleep(0.05)
pioneer.land()`,
            actionLabel: 'Открыть посадку',
            actionQuery: 'Pioneer.land Pioneer.point_reached',
            actionPreviewKey: 'Pioneer.land',
            errorCatalog: [
                {
                    kind: 'error',
                    title: 'Посадка идет без подтверждения точки',
                    reason: 'Если вызвать `land()` до `point_reached()`, миссия завершится раньше фактического конца маршрута.',
                    fix: 'Оставьте посадку только после блока ожидания точки.'
                }
            ],
            missingBlockDiagnostics: {
                py_land: {
                    kind: 'error',
                    title: 'Не добавлена посадка',
                    reason: 'Маршрут выполнен, но миссия не завершена безопасным финальным действием.',
                    fix: 'Добавьте `pioneer.land()` в конец цепочки.'
                }
            },
            extraBlockDiagnostics: {},
            orderRules: [
                {
                    before: 'py_wait_point_reached',
                    after: 'py_land',
                    title: 'Посадка вызывается до завершения маршрута',
                    reason: 'Блок `land()` должен следовать строго после подтверждения `point_reached()`.',
                    fix: 'Переместите `land()` ниже блока ожидания.'
                }
            ],
            compile: compilePython
        }
    ];
}
