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

function validateLuaLedSequenceWorkspace(workspaceXml: string | null | undefined): GuideDiagnostic[] {
    if (!workspaceXml || typeof DOMParser === 'undefined') return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(workspaceXml, 'text/xml');
    const xmlRoot = doc.documentElement;
    if (!xmlRoot || xmlRoot.localName !== 'xml') return [];

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
    const blue = getNextBlock(ledbar);
    const firstTimer = getNextBlock(blue);
    const green = getStatementBlock(firstTimer, 'CALLBACK');
    const secondTimer = getNextBlock(green);
    const red = getStatementBlock(secondTimer, 'CALLBACK');

    const matchesStructure =
        ledbar.getAttribute('type') === 'lua_ledbar_new' &&
        blue?.getAttribute('type') === 'lua_led_set' &&
        firstTimer?.getAttribute('type') === 'lua_timer_calllater' &&
        green?.getAttribute('type') === 'lua_led_set' &&
        secondTimer?.getAttribute('type') === 'lua_timer_calllater' &&
        red?.getAttribute('type') === 'lua_led_set';

    if (matchesStructure) return [];

    return [{
        kind: 'error',
        title: 'Таймеры собраны параллельно, а не последовательно',
        reason: 'Зеленый шаг должен быть внутри первого `Timer.callLater(...)`, а красный шаг внутри второго таймера, вложенного в зеленую ветку. Иначе оба таймера с одинаковой задержкой сработают одновременно.',
        fix: 'Вложите второй `Timer.callLater(...)` внутрь callback первого таймера, чтобы получить 0.5 c и затем 1.0 c.'
    }];
}

function getStructureDiagnostics(lesson: GuideLesson, workspaceXml: string | null | undefined): GuideDiagnostic[] {
    if (lesson.id === 'lua-led-sequence') {
        return validateLuaLedSequenceWorkspace(workspaceXml);
    }

    return [];
}

export function evaluateLesson(lesson: GuideLesson, sequenceIds: string[], workspaceXml?: string | null): GuideEvaluation {
    const diagnostics: GuideDiagnostic[] = [];
    const targetSet = new Set(lesson.targetBlockIds);
    const positions = new Map(sequenceIds.map((blockId, index) => [blockId, index] as const));

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

    diagnostics.push(...getStructureDiagnostics(lesson, workspaceXml));

    const complete = lesson.targetBlockIds.every((blockId) => positions.has(blockId));
    const solved = complete
        && sequenceIds.length === lesson.targetBlockIds.length
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
