# Утилиты, тесты и инструменты

Вспомогательные функции общего назначения, автоматические тесты и инженерные скрипты для генерации или обслуживания проекта.

## Состав группы

- [`Описание методов API — документация Pioneer February update 2026.html`](#api-pioneer-february-update-2026-html)
- [`jest.config.js`](#jest-config-js)
- [`package-lock.json`](#package-lock-json)
- [`public/index.html`](#public-index-html)
- [`public/modules/editor/completion.ts`](#public-modules-editor-completion-ts)
- [`public/modules/editor/hover.ts`](#public-modules-editor-hover-ts)
- [`public/modules/editor/syntax.ts`](#public-modules-editor-syntax-ts)
- [`public/modules/utils.ts`](#public-modules-utils-ts)
- [`Python.html`](#python-html)
- [`tests/cargo-contact.test.ts`](#tests-cargo-contact-test-ts)
- [`tests/paths.test.ts`](#tests-paths-test-ts)
- [`tests/state.test.ts`](#tests-state-test-ts)
- [`tools/audit_and_refactor.ts`](#tools-audit-and-refactor-ts)
- [`tools/generate_functions_reference_index.mjs`](#tools-generate-functions-reference-index-mjs)
- [`tools/generate_marker_dictionaries.mjs`](#tools-generate-marker-dictionaries-mjs)
- [`tools/revert_lua.ts`](#tools-revert-lua-ts)
- [`tools/run_tests.ts`](#tools-run-tests-ts)

## Файлы

<a id="api-pioneer-february-update-2026-html"></a>
### `Описание методов API — документация Pioneer February update 2026.html`

- Исходник: [открыть файл](../../Описание методов API — документация Pioneer February update 2026.html)
- Кратко: Файл проекта.
- Обнаружено функций/методов: 0

<a id="jest-config-js"></a>
### `jest.config.js`

- Исходник: [открыть файл](../../jest.config.js)
- Кратко: Файл проекта.
- Обнаружено функций/методов: 0

<a id="package-lock-json"></a>
### `package-lock.json`

- Исходник: [открыть файл](../../package-lock.json)
- Кратко: Файл проекта.
- Обнаружено функций/методов: 0

<a id="public-index-html"></a>
### `public/index.html`

- Исходник: [открыть файл](../../public/index.html)
- Кратко: Клиентский файл приложения.
- Обнаружено функций/методов: 0

<a id="public-modules-editor-completion-ts"></a>
### `public/modules/editor/completion.ts`

- Исходник: [открыть файл](../../public/modules/editor/completion.ts)
- Кратко: Исходный модуль симулятора.
- Обнаружено функций/методов: 1
- Ключевые символы: `setupCompletionProvider`

<a id="public-modules-editor-hover-ts"></a>
### `public/modules/editor/hover.ts`

- Исходник: [открыть файл](../../public/modules/editor/hover.ts)
- Кратко: Исходный модуль симулятора.
- Обнаружено функций/методов: 2
- Ключевые символы: `getFullWordAtPosition`, `setupHoverProvider`

<a id="public-modules-editor-syntax-ts"></a>
### `public/modules/editor/syntax.ts`

- Исходник: [открыть файл](../../public/modules/editor/syntax.ts)
- Кратко: Исходный модуль симулятора.
- Обнаружено функций/методов: 1
- Ключевые символы: `setupSyntaxHighlighting`

<a id="public-modules-utils-ts"></a>
### `public/modules/utils.ts`

- Исходник: [открыть файл](../../public/modules/utils.ts)
- Кратко: Исходный модуль симулятора.
- Обнаружено функций/методов: 2
- Ключевые символы: `log`, `luaToStr`

<a id="python-html"></a>
### `Python.html`

- Исходник: [открыть файл](../../Python.html)
- Кратко: Файл проекта.
- Обнаружено функций/методов: 0

<a id="tests-cargo-contact-test-ts"></a>
### `tests/cargo-contact.test.ts`

- Исходник: [открыть файл](../../tests/cargo-contact.test.ts)
- Кратко: Автоматические тесты и тестовые помощники.
- Обнаружено функций/методов: 1
- Ключевые символы: `runUntilGroundContact`

<a id="tests-paths-test-ts"></a>
### `tests/paths.test.ts`

- Исходник: [открыть файл](../../tests/paths.test.ts)
- Кратко: Автоматические тесты и тестовые помощники.
- Обнаружено функций/методов: 0

<a id="tests-state-test-ts"></a>
### `tests/state.test.ts`

- Исходник: [открыть файл](../../tests/state.test.ts)
- Кратко: Автоматические тесты и тестовые помощники.
- Обнаружено функций/методов: 0

<a id="tools-audit-and-refactor-ts"></a>
### `tools/audit_and_refactor.ts`

- Исходник: [открыть файл](../../tools/audit_and_refactor.ts)
- Кратко: Инженерный скрипт для генерации данных или обслуживания кода.
- Обнаружено функций/методов: 3
- Ключевые символы: `getLDocTemplate`, `processLuaFile`, `walkDir`

<a id="tools-generate-functions-reference-index-mjs"></a>
### `tools/generate_functions_reference_index.mjs`

- Исходник: [открыть файл](../../tools/generate_functions_reference_index.mjs)
- Кратко: Инженерный скрипт для генерации данных или обслуживания кода.
- Обнаружено функций/методов: 12
- Ключевые символы: `classifyFile`, `ensureDir`, `extractFunctions`, `isMatch`, `relativeLink`, `relativeToRoot`, `renderGroupFile`, `renderRootIndex`, `slugFromPath`, `summaryForFile`, `toPosix`, `walk`

<a id="tools-generate-marker-dictionaries-mjs"></a>
### `tools/generate_marker_dictionaries.mjs`

- Исходник: [открыть файл](../../tools/generate_marker_dictionaries.mjs)
- Кратко: Инженерный скрипт для генерации данных или обслуживания кода.
- Обнаружено функций/методов: 5
- Ключевые символы: `chunk`, `formatDataBlock`, `loadSources`, `main`, `parseSourceArrays`

<a id="tools-revert-lua-ts"></a>
### `tools/revert_lua.ts`

- Исходник: [открыть файл](../../tools/revert_lua.ts)
- Кратко: Инженерный скрипт для генерации данных или обслуживания кода.
- Обнаружено функций/методов: 2
- Ключевые символы: `processLuaFile`, `walkDir`

<a id="tools-run-tests-ts"></a>
### `tools/run_tests.ts`

- Исходник: [открыть файл](../../tools/run_tests.ts)
- Кратко: Инженерный скрипт для генерации данных или обслуживания кода.
- Обнаружено функций/методов: 2
- Ключевые символы: `runLuaTest`, `walkDir`

