import type { ScriptLanguage } from '../api-docs/sections.js';
import { evaluateLesson, getLessonCode } from './lesson-evaluation.js';
import { isMissionGuideScenePreviewActive } from './scene-preview.js';
import {
    getActiveLesson,
    getLessonBanner,
    getLessonSequence,
    getLessonWorkspaceState,
    isLessonChecked,
    isLessonGeneratedCodeVisible,
    isLessonSolutionVisible
} from './state.js';
import type {
    GuideApiFocusItem,
    GuideBlock,
    GuideDiagnostic,
    GuideLesson,
    GuideLessonState,
    GuideMethodLink
} from './types.js';

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getBlockMap(lesson: GuideLesson): Map<string, GuideBlock> {
    return new Map(lesson.blocks.map((block) => [block.id, block] as const));
}

function renderDocLink(link: GuideMethodLink): string {
    return `
        <button
            type="button"
            class="guide-method-chip"
            data-guide-query="${escapeHtml(link.query)}"
            ${link.previewKey ? `data-guide-preview="${escapeHtml(link.previewKey)}"` : ''}
        >
            ${escapeHtml(link.label)}
        </button>
    `;
}

function renderBlock(block: GuideBlock, origin: 'library' | 'workspace', index: number): string {
    return `
        <div
            class="guide-puzzle guide-puzzle--${block.style} guide-puzzle--${origin}"
            draggable="true"
            data-guide-block-id="${escapeHtml(block.id)}"
            data-guide-origin="${origin}"
            data-guide-index="${index}"
            title="${escapeHtml(block.explanation)}"
        >
            <div class="guide-puzzle__main">
                <div class="guide-puzzle__label">${escapeHtml(block.label)}</div>
                <div class="guide-puzzle__code">${escapeHtml(block.codeLabel)}</div>
            </div>
            <div class="guide-puzzle__tooltip" role="tooltip">${escapeHtml(block.explanation)}</div>
        </div>
    `;
}

function renderWorkspace(lesson: GuideLesson, sequenceIds: string[]): string {
    const blockMap = getBlockMap(lesson);
    const rows: string[] = [];
    const hint = sequenceIds.length
        ? 'Перетаскивайте блоки выше или ниже, чтобы менять логику вызовов Pioneer API.'
        : 'Перетащите первый паззл в рабочую область или кликните по блоку в библиотеке.';

    for (let index = 0; index <= sequenceIds.length; index += 1) {
        rows.push(`
            <div class="guide-drop-zone" data-guide-drop-index="${index}">
                <span>${index === sequenceIds.length ? 'Вставить в конец' : 'Вставить сюда'}</span>
            </div>
        `);

        const blockId = sequenceIds[index];
        if (!blockId) continue;
        const block = blockMap.get(blockId);
        if (!block) continue;
        rows.push(`
            <div class="guide-workspace-row">
                ${renderBlock(block, 'workspace', index)}
                <button type="button" class="guide-workspace__remove" data-guide-remove="${escapeHtml(block.id)}">Убрать</button>
            </div>
        `);
    }

    return `
        <div class="guide-workspace">
            <div class="guide-workspace__hint">${escapeHtml(hint)}</div>
            <div class="guide-workspace__stack">
                ${rows.join('')}
            </div>
        </div>
    `;
}

function renderLibrary(lesson: GuideLesson, sequenceIds: string[]): string {
    const used = new Set(sequenceIds);
    const available = lesson.blocks.filter((block) => !used.has(block.id));

    if (!available.length) {
        return '<div class="guide-library__empty">Все блоки из этого задания уже использованы в цепочке.</div>';
    }

    return `
        <div class="guide-library__grid">
            ${available.map((block) => renderBlock(block, 'library', -1)).join('')}
        </div>
    `;
}

export function renderDiagnosticCard(diagnostic: GuideDiagnostic): string {
    return `
        <article class="guide-diagnostic guide-diagnostic--${diagnostic.kind}">
            <div class="guide-diagnostic__title">${escapeHtml(diagnostic.title)}</div>
            <div class="guide-diagnostic__reason">${escapeHtml(diagnostic.reason)}</div>
            <div class="guide-diagnostic__fix"><strong>Как исправить:</strong> ${escapeHtml(diagnostic.fix)}</div>
        </article>
    `;
}

function renderTargetRoute(lesson: GuideLesson): string {
    const blockMap = getBlockMap(lesson);
    return `
        <div class="guide-target-route">
            ${lesson.targetBlockIds.map((blockId) => {
                const block = blockMap.get(blockId);
                return `<span class="guide-target-chip">${escapeHtml(block?.label || blockId)}</span>`;
            }).join('')}
        </div>
    `;
}

function renderApiFocusItem(item: GuideApiFocusItem): string {
    return `
        <article class="guide-api-card">
            <div class="guide-api-card__title">${escapeHtml(item.title)}</div>
            <div class="guide-api-card__summary">${escapeHtml(item.summary)}</div>
            ${item.example ? `<pre class="guide-api-card__example">${escapeHtml(item.example)}</pre>` : ''}
        </article>
    `;
}

function renderPageTabs(state: GuideLessonState, language: ScriptLanguage): string {
    return `
        <div class="guide-page-tabs">
            ${state.lessons.map((lesson, index) => {
                const evaluation = evaluateLesson(
                    lesson,
                    getLessonSequence(language, lesson.id),
                    getLessonWorkspaceState(language, lesson.id)
                );
                const isActive = getActiveLesson(state, language).id === lesson.id;
                return `
                    <button
                        type="button"
                        class="guide-page-tab ${isActive ? 'is-active' : ''} ${evaluation.solved ? 'is-solved' : ''}"
                        data-guide-lesson="${escapeHtml(lesson.id)}"
                    >
                        <span class="guide-page-tab__step">${index + 1}</span>
                        <span class="guide-page-tab__text">${escapeHtml(lesson.title)}</span>
                    </button>
                `;
            }).join('')}
        </div>
    `;
}

function renderRunBanner(language: ScriptLanguage, lessonId: string): string {
    const banner = getLessonBanner(language, lessonId);
    if (!banner) return '';

    return `
        <div class="guide-run-banner guide-run-banner--${banner.kind}">
            ${escapeHtml(banner.message)}
        </div>
    `;
}

function renderCheckSummary(hasChecked: boolean, solved: boolean, diagnosticsCount: number, launchedWithWarnings: boolean): string {
    if (!hasChecked) {
        return `
            <div class="guide-check-status guide-check-status--info">
                Нажмите «Проверить и запустить», когда закончите сборку. Если код исполнимый, сценарий стартует сразу. Если в логике останутся замечания, они появятся здесь.
            </div>
        `;
    }

    if (solved) {
        return `
            <div class="guide-check-status guide-check-status--success">
                Решение прошло проверку. Сценарий уже запущен, результат виден в живой сцене.
            </div>
        `;
    }

    if (launchedWithWarnings) {
        return `
            <div class="guide-check-status guide-check-status--warning">
                Найдено замечаний: ${diagnosticsCount}. Сценарий уже запущен, но решение учебно неверное и требует исправлений.
            </div>
        `;
    }

    return `
        <div class="guide-check-status guide-check-status--warning">
            Найдено замечаний: ${diagnosticsCount}. Исправьте критичные ошибки и нажмите «Проверить и запустить» еще раз.
        </div>
    `;
}

function renderResultHero(hasChecked: boolean, solved: boolean, diagnosticsCount: number, launchedWithWarnings: boolean): string {
    if (!hasChecked) {
        return `
            <div class="guide-result-hero guide-result-hero--idle">
                <div class="guide-result-hero__label">Статус</div>
                <div class="guide-result-hero__title">Пока не проверено</div>
                <div class="guide-result-hero__text">Соберите цепочку и нажмите «Проверить и запустить». После этого здесь сразу будет видно, справились вы или нет.</div>
            </div>
        `;
    }

    if (solved) {
        return `
            <div class="guide-result-hero guide-result-hero--success">
                <div class="guide-result-hero__label">Статус</div>
                <div class="guide-result-hero__title">Решение принято</div>
                <div class="guide-result-hero__text">Проверка пройдена, сценарий уже запущен. Смотрите живую сцену справа.</div>
            </div>
        `;
    }

    if (launchedWithWarnings) {
        return `
            <div class="guide-result-hero guide-result-hero--warning">
                <div class="guide-result-hero__label">Статус</div>
                <div class="guide-result-hero__title">Запущено с замечаниями</div>
                <div class="guide-result-hero__text">Сценарий исполнимый, поэтому живая сцена уже открыта. Но решение не совпадает с целью задания.</div>
            </div>
        `;
    }

    return `
        <div class="guide-result-hero guide-result-hero--warning">
            <div class="guide-result-hero__label">Статус</div>
            <div class="guide-result-hero__title">Нужно исправить</div>
            <div class="guide-result-hero__text">Найдено замечаний: ${diagnosticsCount}. В коде есть критичные ошибки, поэтому запуск пока заблокирован.</div>
        </div>
    `;
}

