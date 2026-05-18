import type { ScriptLanguage } from '../api-docs/sections.js';
import { evaluateLesson, getLessonCode } from './lesson-evaluation.js';
import { isMissionGuideScenePreviewActive } from './scene-preview.js';
import {
    getActiveChapter,
    getActiveLesson,
    getActiveTab,
    getLessonBanner,
    getLessonsForChapter,
    getLessonSequence,
    getLessonWorkspaceState,
    isLessonChecked,
    isLessonGeneratedCodeVisible,
    isLessonSolutionVisible
} from './state.js';
import type {
    GuideApiFocusItem,
    GuideBlock,
    GuideChapter,
    GuideDiagnostic,
    GuideLesson,
    GuideLessonState,
    GuideMethodLink,
    GuideTabId
} from './types.js';

export function escapeHtml(value: string): string {
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

export function renderDocLink(link: GuideMethodLink): string {
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
    const diagnosticKindLabel = diagnostic.kind === 'error'
        ? 'Ошибка'
        : diagnostic.kind === 'warning'
            ? 'Замечание'
            : diagnostic.kind === 'success'
                ? 'Успех'
                : 'Подсказка';

    return `
        <article class="guide-diagnostic guide-diagnostic--${diagnostic.kind}">
            <div class="guide-diagnostic__head">
                <div class="guide-diagnostic__badge">${diagnosticKindLabel}</div>
                <div class="guide-diagnostic__title">${escapeHtml(diagnostic.title)}</div>
            </div>
            <div class="guide-diagnostic__reason">${escapeHtml(diagnostic.reason)}</div>
            <div class="guide-diagnostic__fix"><strong>Как исправить:</strong> ${escapeHtml(diagnostic.fix)}</div>
        </article>
    `;
}

export function renderTargetRoute(lesson: GuideLesson): string {
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

export function renderApiFocusItem(item: GuideApiFocusItem): string {
    return `
        <article class="guide-api-card">
            <div class="guide-api-card__title">${escapeHtml(item.title)}</div>
            <div class="guide-api-card__summary">${escapeHtml(item.summary)}</div>
            ${item.example ? `<pre class="guide-api-card__example">${escapeHtml(item.example)}</pre>` : ''}
        </article>
    `;
}

export function renderGuideTopTabs(language: ScriptLanguage): string {
    const activeTab = getActiveTab(language);
    return `
        <div class="guide-top-tabs" role="tablist" aria-label="Режим работы">
            <button
                type="button"
                class="guide-top-tab ${activeTab === 'tutorial' ? 'is-active' : ''}"
                data-guide-mode="tutorial"
            >
                Учебник
            </button>
            <button
                type="button"
                class="guide-top-tab ${activeTab === 'trainer' ? 'is-active' : ''}"
                data-guide-mode="trainer"
            >
                Тренажер
            </button>
        </div>
    `;
}

export function renderGuideSelectors(state: GuideLessonState, language: ScriptLanguage): string {
    const activeChapter = getActiveChapter(state, language);
    const activeLesson = getActiveLesson(state, language);
    const activeTab = getActiveTab(language);
    const chapterLessons = getLessonsForChapter(state, activeChapter.id);

    return `
        <section class="guide-selector-bar">
            <label class="guide-selector-field">
                <span class="guide-selector-field__label">Язык</span>
                <select class="guide-selector" data-guide-language-select aria-label="Выбор языка практикума">
                    <option value="lua" ${language === 'lua' ? 'selected' : ''}>Lua</option>
                    <option value="python" ${language === 'python' ? 'selected' : ''}>Python</option>
                </select>
            </label>
            <label class="guide-selector-field">
                <span class="guide-selector-field__label">Тема</span>
                <select class="guide-selector" data-guide-chapter-select aria-label="Выбор темы">
                    ${state.chapters.map((chapter, index) => `
                        <option value="${escapeHtml(chapter.id)}" ${chapter.id === activeChapter.id ? 'selected' : ''}>
                            ${index + 1}. ${escapeHtml(chapter.title)}
                        </option>
                    `).join('')}
                </select>
            </label>
            <label class="guide-selector-field">
                <span class="guide-selector-field__label">Задание</span>
                <select class="guide-selector" data-guide-lesson-select aria-label="Выбор задания">
                    ${chapterLessons.map((lesson, index) => `
                        <option value="${escapeHtml(lesson.id)}" ${lesson.id === activeLesson.id ? 'selected' : ''}>
                            ${index + 1}. ${escapeHtml(lesson.title)}
                        </option>
                    `).join('')}
                </select>
            </label>
        </section>
    `;
}

export function renderTheoryView(state: GuideLessonState, language: ScriptLanguage): string {
    const activeChapter = getActiveChapter(state, language);
    const chapterLessons = getLessonsForChapter(state, activeChapter.id);
    const solvedCount = chapterLessons.filter((lesson) => evaluateLesson(
        lesson,
        getLessonSequence(language, lesson.id),
        getLessonWorkspaceState(language, lesson.id)
    ).solved).length;

    const practiceLessonId = chapterLessons[0]?.id || activeChapter.primaryLessonId;

    return `
        <section class="guide-theory-page">
            <div class="guide-theory-page__hero">
                <div class="guide-lesson-page__badge">${escapeHtml(activeChapter.badge)}</div>
                <div class="guide-theory-page__title">${escapeHtml(activeChapter.title)}</div>
            </div>

            <div class="guide-theory-page__meta">
                <div class="guide-lesson-page__meta-item">
                    <div class="guide-lesson-page__meta-label">О чем глава</div>
                    <div class="guide-lesson-page__goal">${escapeHtml(activeChapter.theoryIntro)}</div>
                </div>
                <div class="guide-lesson-page__meta-item">
                    <div class="guide-lesson-page__meta-label">Практика главы</div>
                    <div class="guide-lesson-page__goal">Доступно заданий: ${chapterLessons.length}. Уже решено: ${solvedCount}.</div>
                </div>
            </div>

            <div class="guide-theory-sections">
                ${activeChapter.theorySections.map((section) => `
                    <article class="guide-theory-card">
                        <div class="guide-panel-card__title">${escapeHtml(section.title)}</div>
                        <div class="guide-theory-card__content">
                            ${section.paragraphs.slice(0, 1).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
                            ${section.bullets?.length
            ? `
                                <ul class="guide-theory-card__list">
                                    ${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                                </ul>
                            `
            : ''}
                            ${section.takeaway
            ? `<div class="guide-panel-note"><strong>Вывод:</strong> ${escapeHtml(section.takeaway)}</div>`
            : ''}
                        </div>
                    </article>
                `).join('')}
            </div>

            <section class="guide-panel-card">
                <div class="guide-panel-card__top">
                    <div>
                        <div class="guide-panel-card__title">${escapeHtml(activeChapter.practiceHeading)}</div>
                        <div class="guide-panel-card__text">${escapeHtml(activeChapter.practiceIntro)}</div>
                    </div>
                </div>
                <div class="guide-practice-grid">
                    ${chapterLessons.map((lesson) => `
                        <article class="guide-practice-card">
                            <div class="guide-practice-card__difficulty">${escapeHtml(lesson.badge)}</div>
                            <div class="guide-practice-card__title">${escapeHtml(lesson.title)}</div>
                            <div class="guide-panel-card__text">${escapeHtml(lesson.summary)}</div>
                        </article>
                    `).join('')}
                </div>
                <div class="guide-actions">
                    <button
                        type="button"
                        class="guide-primary-action"
                        data-guide-go-practice="${escapeHtml(activeChapter.id)}"
                        data-guide-lesson="${escapeHtml(practiceLessonId)}"
                    >
                        Перейти к практике
                    </button>
                </div>
            </section>
        </section>
    `;
}

export function renderTrainerIntro(state: GuideLessonState, language: ScriptLanguage): string {
    return '';
}

export function renderPageTabs(state: GuideLessonState, language: ScriptLanguage): string {
    const activeChapter = getActiveChapter(state, language);
    const chapterLessons = getLessonsForChapter(state, activeChapter.id);
    const activeLesson = getActiveLesson(state, language);
    return `
        <div class="guide-page-tabs">
            ${chapterLessons.map((lesson, index) => {
                const evaluation = evaluateLesson(
                    lesson,
                    getLessonSequence(language, lesson.id),
                    getLessonWorkspaceState(language, lesson.id)
                );
                const isActive = activeLesson.id === lesson.id;
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

export function renderRunBanner(language: ScriptLanguage, lessonId: string): string {
    const banner = getLessonBanner(language, lessonId);
    if (!banner) return '';

    return `
        <div class="guide-run-banner guide-run-banner--${banner.kind}">
            ${escapeHtml(banner.message)}
        </div>
    `;
}

export function renderCheckSummary(hasChecked: boolean, solved: boolean, diagnosticsCount: number, launchedWithWarnings: boolean): string {
    if (!hasChecked) {
        return `
            <div class="guide-check-status guide-check-status--info">
                Соберите цепочку и нажмите «Проверить и запустить».
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
            Запуск не выполнен: рабочая область пуста или из нее не собрана исполнимая цепочка. Добавьте хотя бы одну команду и попробуйте снова.
        </div>
    `;
}

export function renderResultHero(hasChecked: boolean, solved: boolean, diagnosticsCount: number, launchedWithWarnings: boolean): string {
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
            <div class="guide-result-hero__text">Живая сцена не запущена только потому, что в рабочей области пока нет исполнимой цепочки. Учебные замечания сами по себе запуск больше не блокируют.</div>
        </div>
    `;
}

