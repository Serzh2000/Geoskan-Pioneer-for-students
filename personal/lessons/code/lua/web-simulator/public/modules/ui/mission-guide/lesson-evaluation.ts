import type { GuideDiagnostic, GuideEvaluation, GuideLesson } from './types.js';

function uniqueDiagnostics(diagnostics: GuideDiagnostic[]): GuideDiagnostic[] {
    const seen = new Set<string>();
    return diagnostics.filter((diagnostic) => {
        const key = `${diagnostic.kind}:${diagnostic.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function solvedDiagnostic(outcome: string): GuideDiagnostic {
    return {
        kind: 'success',
        title: 'Последовательность собрана верно',
        reason: outcome,
        fix: 'Можно запускать сценарий: код уже собирается в настоящий пример Pioneer API.'
    };
}

function getDirectChildByTagName(element: Element, tagName: string): Element | null {
    return Array.from(element.children).find((child) => child.localName === tagName) || null;
}

function getDirectBlockChild(element: Element, wrapperTag: string): Element | null {
    const wrapper = getDirectChildByTagName(element, wrapperTag);
    if (!wrapper) return null;
    return Array.from(wrapper.children).find((child) => child.localName === 'block') || null;
}

function getNextBlock(element: Element | null): Element | null {
    if (!element) return null;
    return getDirectBlockChild(element, 'next');
}

function getStatementBlock(element: Element | null, name: string): Element | null {
    if (!element) return null;
    const statement = Array.from(element.children).find((child) => child.localName === 'statement' && child.getAttribute('name') === name);
    if (!statement) return null;
    return Array.from(statement.children).find((child) => child.localName === 'block') || null;
}

function getFieldValue(element: Element | null, fieldName: string): string | null {
    if (!element) return null;
    const field = Array.from(element.children).find((child) => child.localName === 'field' && child.getAttribute('name') === fieldName);
    return field?.textContent ?? null;
}

function hasBlockType(element: Element | null, blockType: string): boolean {
    return element?.getAttribute('type') === blockType;
}

function hasFieldValue(element: Element | null, fieldName: string, expected: string): boolean {
    return getFieldValue(element, fieldName) === expected;
}

function hasNumericFieldValue(element: Element | null, fieldName: string, expected: number): boolean {
    const actual = getFieldValue(element, fieldName);
    if (actual == null) return false;
    return Number(actual) === expected;
}

function matchesLedSet(element: Element | null, index: string, r: string, g: string, b: string): boolean {
    return hasBlockType(element, 'lua_led_set')
        && hasFieldValue(element, 'INDEX', index)
        && hasFieldValue(element, 'R', r)
        && hasFieldValue(element, 'G', g)
        && hasFieldValue(element, 'B', b);
}

function matchesTimerDelay(element: Element | null, delay: string): boolean {
    return hasBlockType(element, 'lua_timer_calllater') && hasNumericFieldValue(element, 'DELAY', Number(delay));
}

function parseWorkspaceXml(workspaceXml: string | null | undefined): Element | null {
    if (!workspaceXml || typeof DOMParser === 'undefined') return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(workspaceXml, 'text/xml');
    const xmlRoot = doc.documentElement;
    if (!xmlRoot || xmlRoot.localName !== 'xml') return null;
    return xmlRoot;
}

function findFirstBlockByType(root: Element | null, blockType: string): Element | null {
    if (!root) return null;
    if (root.localName === 'block' && root.getAttribute('type') === blockType) {
        return root;
    }
    for (const child of Array.from(root.children)) {
        const match = findFirstBlockByType(child, blockType);
        if (match) return match;
    }
    return null;
}

function matchesLuaLedSequenceWorkspace(workspaceXml: string | null | undefined): boolean {
    const xmlRoot = parseWorkspaceXml(workspaceXml);
    if (!xmlRoot) return false;

    const topBlocks = Array.from(xmlRoot.children).filter((child) => child.localName === 'block');
    if (topBlocks.length !== 1) return false;

    const ledbar = topBlocks[0];
    const firstTimer = getNextBlock(ledbar);
    const blue = getStatementBlock(firstTimer, 'CALLBACK');
    const secondTimer = getNextBlock(firstTimer);
    const green = getStatementBlock(secondTimer, 'CALLBACK');
    const thirdTimer = getNextBlock(secondTimer);
    const red = getStatementBlock(thirdTimer, 'CALLBACK');

    return hasBlockType(ledbar, 'lua_ledbar_new')
        && hasFieldValue(ledbar, 'COUNT', '29')
        && matchesTimerDelay(firstTimer, '1')
        && matchesLedSet(blue, '0', '0', '0', '1')
        && matchesTimerDelay(secondTimer, '2')
        && matchesLedSet(green, '0', '0', '1', '0')
        && matchesTimerDelay(thirdTimer, '3')
        && matchesLedSet(red, '0', '1', '0', '0')
        && !getNextBlock(thirdTimer)
        && !getNextBlock(blue)
        && !getNextBlock(green)
        && !getNextBlock(red);
}

function validateLuaLedSequenceWorkspace(workspaceXml: string | null | undefined): GuideDiagnostic[] {
    const xmlRoot = parseWorkspaceXml(workspaceXml);
    if (!xmlRoot) return [];

    const topBlocks = Array.from(xmlRoot.children).filter((child) => child.localName === 'block');
    if (topBlocks.length !== 1) {
        return [{
            kind: 'error',
            title: 'Анимация разбита на несколько независимых веток',
            reason: 'Для этого урока цепочка должна быть одной последовательностью. Иначе таймеры начинают работать параллельно и кадры накладываются.',
            fix: 'Соберите все шаги в одну ветку: синий -> таймер -> зеленый -> таймер -> красный.'
        }];
    }

    const ledbar = topBlocks[0];
    const firstTimer = getNextBlock(ledbar);
    const blue = getStatementBlock(firstTimer, 'CALLBACK');
    const secondTimer = getNextBlock(firstTimer);
    const green = getStatementBlock(secondTimer, 'CALLBACK');
    const thirdTimer = getNextBlock(secondTimer);
    const red = getStatementBlock(thirdTimer, 'CALLBACK');

    if (hasBlockType(getNextBlock(blue), 'lua_timer_calllater')
        || hasBlockType(getNextBlock(green), 'lua_timer_calllater')
        || hasBlockType(getNextBlock(red), 'lua_timer_calllater')) {
        return [{
            kind: 'error',
            title: 'Таймер вложен не в ту ветку',
            reason: 'В этом уроке внутри `callback` таймера должен лежать только `leds:set(...)`. Следующий таймер идет после предыдущего в основной цепочке.',
            fix: 'Соберите три таймера друг за другом, а цветовые блоки оставьте внутри их `callback`.'
        }];
    }

    if (matchesLuaLedSequenceWorkspace(workspaceXml)) return [];

    if (!hasBlockType(ledbar, 'lua_ledbar_new')) {
        return [{
            kind: 'error',
            title: 'Анимация должна начинаться с `Ledbar`',
            reason: 'Сначала нужно создать ленту, и только затем задавать цвета и таймеры.',
            fix: 'Поставьте `Ledbar.new(29)` в начало единственной ветки.'
        }];
    }

    if (!matchesTimerDelay(firstTimer, '1')) {
        return [{
            kind: 'error',
            title: 'Первая задержка указана неверно',
            reason: 'Первый `Timer.callLater(...)` должен срабатывать через `1` секунду после старта.',
            fix: 'Установите у первого таймера значение `1`.'
        }];
    }

    if (!matchesLedSet(blue, '0', '0', '0', '1')) {
        return [{
            kind: 'error',
            title: 'Синий кадр собран неверно',
            reason: 'Внутри первого таймера должен стоять синий кадр `leds:set(0, 0, 0, 1)`.',
            fix: 'Поместите внутрь первого `callback` синий цвет для диода `0`.'
        }];
    }

    if (!matchesTimerDelay(secondTimer, '2')) {
        return [{
            kind: 'error',
            title: 'Вторая задержка указана неверно',
            reason: 'Второй `Timer.callLater(...)` должен срабатывать через `2` секунды от начала работы.',
            fix: 'Установите у второго таймера значение `2`.'
        }];
    }

    if (!matchesLedSet(green, '0', '0', '1', '0')) {
        return [{
            kind: 'error',
            title: 'Зеленый кадр собран неверно',
            reason: 'Внутри второго таймера должен стоять зеленый кадр `leds:set(0, 0, 1, 0)`.',
            fix: 'Поместите внутрь второго `callback` зеленый цвет для диода `0`.'
        }];
    }

    if (!matchesTimerDelay(thirdTimer, '3')) {
        return [{
            kind: 'error',
            title: 'Третья задержка указана неверно',
            reason: 'Третий `Timer.callLater(...)` должен срабатывать через `3` секунды от начала работы.',
            fix: 'Установите у третьего таймера значение `3`.'
        }];
    }

    if (!matchesLedSet(red, '0', '1', '0', '0')) {
        return [{
            kind: 'error',
            title: 'Красный кадр собран неверно',
            reason: 'Внутри третьего таймера должен стоять красный кадр `leds:set(0, 1, 0, 0)`.',
            fix: 'Поместите внутрь третьего `callback` красный цвет для диода `0`.'
        }];
    }

    return [{
        kind: 'error',
        title: 'Нарушена структура анимации',
        reason: 'Для этого урока нужна одна ветка с тремя таймерами подряд: `1`, `2`, `3` секунды от старта. Внутри каждого `callback` лежит только свой цвет.',
        fix: 'Соберите схему `Ledbar(29) -> timer(1){ blue } -> timer(2){ green } -> timer(3){ red }`.'
    }];
}

function getStructureDiagnostics(lesson: GuideLesson, workspaceXml: string | null | undefined): GuideDiagnostic[] {
    if (lesson.id === 'lua-led-sequence') {
        return validateLuaLedSequenceWorkspace(workspaceXml);
    }

    return [];
}

function getCallbackDiagnostics(sequenceIds: string[], lesson: GuideLesson): GuideDiagnostic[] {
    if (!lesson.targetBlockIds.includes('lua_callback_open') && !lesson.targetBlockIds.includes('lua_callback_end')) {
        return [];
    }

    const diagnostics: GuideDiagnostic[] = [];
    const callbackOpenCount = sequenceIds.filter((blockId) => blockId === 'lua_callback_open').length;
    const callbackEndCount = sequenceIds.filter((blockId) => blockId === 'lua_callback_end').length;

    if (callbackOpenCount > 1) {
        diagnostics.push({
            kind: 'error',
            title: 'Callback открыт несколько раз',
            reason: 'В одном учебном Lua-сценарии нужен один контейнер `function callback(event)`, а не несколько независимых открывающих блоков.',
            fix: 'Оставьте один блок `function callback(event)` и удалите лишние открытия.'
        });
    }

    if (callbackEndCount > 1) {
        diagnostics.push({
            kind: 'error',
            title: 'Callback закрыт несколько раз',
            reason: 'Отдельный блок `end` должен завершать ровно один контейнер `function callback(event)`.',
            fix: 'Оставьте одно закрытие `end`, относящееся к callback.'
        });
    }

    let callbackDepth = 0;
    let hasEventOutsideCallback = false;
    let hasCloseWithoutOpen = false;

    sequenceIds.forEach((blockId) => {
        if (blockId === 'lua_callback_open') {
            callbackDepth += 1;
            return;
        }

        if (blockId === 'lua_callback_end') {
            if (callbackDepth === 0) {
                hasCloseWithoutOpen = true;
                return;
            }
            callbackDepth -= 1;
            return;
        }

        if (blockId === 'lua_event_callback' && callbackDepth === 0) {
            hasEventOutsideCallback = true;
        }
    });

    if (hasCloseWithoutOpen) {
        diagnostics.push({
            kind: 'error',
            title: 'Закрывающий `end` стоит без открытия callback',
            reason: 'Блок `end` для callback не может существовать сам по себе: перед ним должен быть явный блок `function callback(event)`.',
            fix: 'Поставьте `function callback(event)` раньше этого `end` или удалите лишнее закрытие.'
        });
    }

    if (hasEventOutsideCallback) {
        diagnostics.push({
            kind: 'error',
            title: 'Событийная ветка вынесена из callback',
            reason: 'Ветви `if event == ... then` должны находиться между отдельными блоками `function callback(event)` и `end`.',
            fix: 'Поместите все событийные блоки внутрь области callback.'
        });
    }

    return diagnostics;
}

export function evaluateLesson(lesson: GuideLesson, sequenceIds: string[], workspaceXml?: string | null): GuideEvaluation {
    if (lesson.id === 'lua-led-sequence') {
        const diagnostics = validateLuaLedSequenceWorkspace(workspaceXml);
        const solved = diagnostics.length === 0;
        return {
            solved,
            complete: solved,
            diagnostics: uniqueDiagnostics(solved ? [solvedDiagnostic(lesson.expectedOutcome)] : diagnostics)
        };
    }

    const diagnostics: GuideDiagnostic[] = [];
    const targetSet = new Set(lesson.targetBlockIds);
    const positions = new Map(sequenceIds.map((blockId, index) => [blockId, index] as const));
    const hasAcceptedLedSequenceStructure = lesson.id === 'lua-led-sequence' && matchesLuaLedSequenceWorkspace(workspaceXml);
    const callbackOpenIndex = positions.get('lua_callback_open');
    const callbackEndIndex = positions.get('lua_callback_end');

    if (!sequenceIds.length) {
        diagnostics.push({
            kind: 'info',
            title: 'Рабочая область пока пустая',
            reason: 'Перетащите паззл-блоки в центральную цепочку. Проверка обновляется сразу после каждого шага.',
            fix: `Начните с блока "${lesson.blocks.find((block) => block.id === lesson.targetBlockIds[0])?.label || 'первого шага'}".`
        });
        return {
            solved: false,
            complete: false,
            diagnostics
        };
    }

    for (const blockId of lesson.targetBlockIds) {
        if (positions.has(blockId)) continue;
        const diagnostic = lesson.missingBlockDiagnostics[blockId];
        if (diagnostic) diagnostics.push(diagnostic);
    }

    if (lesson.targetBlockIds.includes('lua_ledbar_new')) {
        const xmlRoot = parseWorkspaceXml(workspaceXml);
        const ledbarBlock = findFirstBlockByType(xmlRoot, 'lua_ledbar_new');
        if (ledbarBlock && !hasNumericFieldValue(ledbarBlock, 'COUNT', 29)) {
            diagnostics.push({
                kind: 'error',
                title: 'Указано неверное количество светодиодов',
                reason: 'Для Lua-уроков с `Ledbar` нужно использовать `Ledbar.new(29)`, иначе поведение светодиодов может отличаться от реального Pioneer.',
                fix: 'Откройте блок создания ленты и установите значение `29`.'
            });
        }
    }

    for (const blockId of sequenceIds) {
        if (targetSet.has(blockId)) continue;
        const diagnostic = lesson.extraBlockDiagnostics?.[blockId];
        if (diagnostic) {
            diagnostics.push(diagnostic);
            continue;
        }

        const block = lesson.blocks.find((item) => item.id === blockId);
        diagnostics.push({
            kind: 'warning',
            title: 'Добавлен лишний блок',
            reason: `Блок "${block?.label || blockId}" использует рабочую команду, но не относится к цели текущего задания.`,
            fix: 'Уберите его из цепочки или перенесите в задание, где этот шаг действительно нужен.'
        });
    }

    for (const rule of lesson.orderRules || []) {
        const beforeIndex = positions.get(rule.before);
        const afterIndex = positions.get(rule.after);
        if (beforeIndex == null || afterIndex == null) continue;
        if (beforeIndex < afterIndex) continue;
        diagnostics.push({
            kind: 'error',
            title: rule.title,
            reason: rule.reason,
            fix: rule.fix
        });
    }

    if (callbackOpenIndex != null && callbackEndIndex != null && callbackOpenIndex >= callbackEndIndex) {
        diagnostics.push({
            kind: 'error',
            title: 'Нарушены границы callback',
            reason: 'Открывающий блок `function callback(event)` должен стоять раньше закрывающего блока `end`.',
            fix: 'Переместите `function callback(event)` выше и завершите область отдельным блоком `end`.'
        });
    }

    diagnostics.push(...getCallbackDiagnostics(sequenceIds, lesson));

    diagnostics.push(...getStructureDiagnostics(lesson, workspaceXml));

    const complete = hasAcceptedLedSequenceStructure || lesson.targetBlockIds.every((blockId) => positions.has(blockId));
    const solved = complete
        && (hasAcceptedLedSequenceStructure || sequenceIds.length === lesson.targetBlockIds.length)
        && !diagnostics.some((diagnostic) => diagnostic.kind === 'error' || diagnostic.kind === 'warning');

    const finalDiagnostics = uniqueDiagnostics(
        solved ? [solvedDiagnostic(lesson.expectedOutcome)] : diagnostics
    );

    return {
        solved,
        complete,
        diagnostics: finalDiagnostics
    };
}

export function getLessonCode(lesson: GuideLesson, sequenceIds: string[]): string {
    const code = lesson.compile(sequenceIds, lesson.blocks);
    return code || lesson.solutionCode;
}
