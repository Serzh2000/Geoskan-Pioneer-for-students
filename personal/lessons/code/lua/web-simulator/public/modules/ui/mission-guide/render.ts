import type { ScriptLanguage } from '../api-docs/sections.js';
import { evaluateLesson, getLessonCode } from './lesson-evaluation.js';
import { isMissionGuideScenePreviewActive } from './scene-preview.js';
import {
    getActiveTab,
    getActiveLesson,
    getLessonBanner,
    getLessonSequence,
    getLessonWorkspaceState,
    isLessonChecked,
    isLessonGeneratedCodeVisible,
    isLessonSolutionVisible
} from './state.js';
import type { GuideLessonState } from './types.js';
import {
    escapeHtml,
    renderApiFocusItem,
    renderChapterTabs,
    renderCheckSummary,
    renderDocLink,
    renderGuideTopTabs,
    renderPageTabs,
    renderResultHero,
    renderRunBanner,
    renderTargetRoute,
    renderDiagnosticCard,
    renderTheoryView,
    renderTrainerIntro
} from './render-support.js';

export function renderGuide(state: GuideLessonState, language: ScriptLanguage): string {
    const activeTab = getActiveTab(language);
    const lesson = getActiveLesson(state, language);
    const sequenceIds = getLessonSequence(language, lesson.id);
    const evaluation = evaluateLesson(lesson, sequenceIds, getLessonWorkspaceState(language, lesson.id));
    const hasChecked = isLessonChecked(language, lesson.id);
    const showSolution = isLessonSolutionVisible(language, lesson.id);
    const showGeneratedCode = isLessonGeneratedCodeVisible(language, lesson.id);
    const previewActive = isMissionGuideScenePreviewActive();
    const banner = getLessonBanner(language, lesson.id);
    const launchedWithWarnings = hasChecked && !evaluation.solved && banner?.kind === 'warning' && previewActive;
    const solvedCount = state.lessons
        .filter((item) => evaluateLesson(
            item,
            getLessonSequence(language, item.id),
            getLessonWorkspaceState(language, item.id)
        ).solved)
        .length;
    const codePreview = getLessonCode(lesson, sequenceIds);
    const currentIndex = state.lessons.findIndex((item) => item.id === lesson.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < state.lessons.length - 1;

    return `
        <div class="guide-modal-layout" data-guide-language="${language}">
            <section class="guide-hero">
                <div class="guide-hero__eyebrow">${escapeHtml(state.heroEyebrow)}</div>
                <div class="guide-hero__title">${escapeHtml(state.heroTitle)}</div>
                <div class="guide-hero__text">${escapeHtml(state.heroText)}</div>
                <div class="guide-hero__flow">${escapeHtml(state.heroFlow)}</div>
                <div class="guide-hero__progress">Решено страниц: ${solvedCount} / ${state.lessons.length}</div>
            </section>

            ${renderGuideTopTabs(language)}
            ${renderChapterTabs(state, language)}

            ${activeTab === 'tutorial'
            ? renderTheoryView(state, language)
            : `
                ${renderTrainerIntro(state, language)}
                ${renderPageTabs(state, language)}

                <section class="guide-lesson-page">
                    <div class="guide-lesson-page__header">
                        <div>
                            <div class="guide-lesson-page__badge">${escapeHtml(lesson.badge)}</div>
                            <div class="guide-lesson-page__title">${escapeHtml(lesson.title)}</div>
                            <div class="guide-lesson-page__summary">${escapeHtml(lesson.summary)}</div>
                        </div>
                        <div class="guide-lesson-page__nav">
                            <button type="button" class="guide-lesson__action" data-guide-nav="prev" ${hasPrev ? '' : 'disabled'}>Предыдущее</button>
                            <button type="button" class="guide-lesson__action" data-guide-nav="next" ${hasNext ? '' : 'disabled'}>Следующее</button>
                        </div>
                    </div>

                    <div class="guide-lesson-page__meta">
                        <div class="guide-lesson-page__meta-item">
                            <div class="guide-lesson-page__meta-label">Цель</div>
                            <div class="guide-lesson-page__goal">${escapeHtml(lesson.goal)}</div>
                        </div>
                        <div class="guide-lesson-page__meta-item">
                            <div class="guide-lesson-page__meta-label">Подсказка по сборке</div>
                            <div class="guide-lesson-page__goal">${escapeHtml(lesson.builderHint)}</div>
                        </div>
                        <div class="guide-lesson-page__meta-item guide-lesson-page__meta-item--wide">
                            <div class="guide-lesson-page__meta-label">Целевая логика</div>
                            ${renderTargetRoute(lesson)}
                        </div>
                    </div>

                    <section class="guide-panel-card guide-panel-card--lesson">
                        <div class="guide-panel-card__top">
                            <div>
                                <div class="guide-panel-card__title">Перед практикой</div>
                                <div class="guide-panel-card__text">${escapeHtml(lesson.lessonIntro)}</div>
                            </div>
                        </div>
                        <div class="guide-panel-card__text">API, которые понадобятся в этом задании:</div>
                        <div class="guide-api-grid">
                            ${lesson.apiFocus.map(renderApiFocusItem).join('')}
                        </div>
                    </section>

                    <div class="guide-workbench-layout">
                        <div class="guide-workbench-layout__main">
                            <section class="guide-panel-card">
                                <div class="guide-panel-card__top">
                                    <div>
                                        <div class="guide-panel-card__title">Соберите решение в Blockly</div>
                                        <div class="guide-panel-card__text">Используйте меню категорий слева, соберите цепочку в Blockly и запустите ее для мгновенной проверки на живой сцене.</div>
                                    </div>
                                    <div class="guide-panel-card__badge">Шаг 1</div>
                                </div>
                                <div id="blocklyDiv" style="height: 400px; width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);"></div>
                                <div class="guide-actions guide-actions--primary">
                                    <button type="button" class="guide-primary-action" data-guide-check="${escapeHtml(lesson.id)}">Проверить и запустить</button>
                                    <button type="button" class="guide-lesson__action" data-guide-reset="${escapeHtml(lesson.id)}">Очистить страницу</button>
                                </div>
                                <div class="guide-panel-note">Проверка сразу пытается перейти к запуску. Предупреждения не мешают живой сцене, но критичные ошибки все еще блокируют старт.</div>
                                ${renderRunBanner(language, lesson.id)}
                            </section>
                        </div>

                        <div class="guide-workbench-layout__scene">
                            <section class="guide-panel-card">
                                <div class="guide-panel-card__title">Живая сцена</div>
                                <div class="guide-panel-card__text">
                                    ${previewActive
                ? 'Сцену не нужно искать под модалкой: запуск и результат видны прямо здесь.'
                : 'После успешной проверки живая сцена появится в этом блоке автоматически, без закрытия руководства.'}
                                </div>
                                <div id="mission-guide-scene-preview-host" class="guide-scene-preview-host ${previewActive ? 'is-active' : ''}">
                                    ${previewActive ? '' : '<div class="guide-scene-preview__placeholder">Нажмите "Проверить и запустить", чтобы открыть live-просмотр симуляции в этом окне.</div>'}
                                </div>
                            </section>
                        </div>
                    </div>

                    <div class="guide-support-layout">
                        <section class="guide-panel-card guide-panel-card--result">
                            <div class="guide-panel-card__top">
                                <div>
                                    <div class="guide-panel-card__title">Результат проверки</div>
                                    <div class="guide-panel-card__text">Здесь сразу видно, прошла ли проверка. При ошибке ниже остаются конкретные замечания.</div>
                                </div>
                                <div class="guide-panel-card__badge">Шаг 2</div>
                            </div>
                            ${renderResultHero(hasChecked, evaluation.solved, evaluation.diagnostics.length, launchedWithWarnings)}
                            <div id="guide-check-summary">
                                ${renderCheckSummary(hasChecked, evaluation.solved, evaluation.diagnostics.length, launchedWithWarnings)}
                            </div>
                            <div class="guide-diagnostics" id="diagnostics-container">
                                ${hasChecked
                ? evaluation.diagnostics.map(renderDiagnosticCard).join('')
                : '<div class="guide-empty-state">Пока ничего не показываем, чтобы не подсказывать решение заранее.</div>'}
                            </div>
                        </section>

                        <section class="guide-panel-card">
                            <div class="guide-panel-card__top">
                                <div>
                                    <div class="guide-panel-card__title">Подсказки и ответ</div>
                                    <div class="guide-panel-card__text">Эти секции открываются только по желанию после проверки.</div>
                                </div>
                                <div class="guide-panel-card__badge">Шаг 3</div>
                            </div>
                            <div class="guide-actions">
                                <button
                                    type="button"
                                    class="guide-lesson__action"
                                    data-guide-toggle-code="${escapeHtml(lesson.id)}"
                                >
                                    ${showGeneratedCode ? 'Скрыть код из Blockly' : 'Показать код из Blockly'}
                                </button>
                                <button
                                    type="button"
                                    class="guide-lesson__action"
                                    data-guide-toggle-solution="${escapeHtml(lesson.id)}"
                                    ${hasChecked ? '' : 'disabled'}
                                >
                                    ${showSolution ? 'Скрыть эталон' : 'Показать эталон'}
                                </button>
                            </div>
                            ${hasChecked
                ? ''
                : '<div class="guide-panel-note">Сначала нажмите «Проверить и запустить». После этого сможете при желании открыть эталон.</div>'}
                            ${showGeneratedCode
                ? `
                                    <div class="guide-collapsible-section">
                                        <div class="guide-collapsible-section__title">Код, собранный из текущих блоков</div>
                                        <pre class="guide-lesson__code" id="blockly-generated-code">${escapeHtml(codePreview)}</pre>
                                    </div>
                                `
                : '<pre class="guide-lesson__code guide-lesson__code--hidden" id="blockly-generated-code"></pre>'}
                            ${showSolution && hasChecked
                ? `
                                    <div class="guide-collapsible-section">
                                        <div class="guide-collapsible-section__title">Эталонное решение</div>
                                        <pre class="guide-lesson__code">${escapeHtml(lesson.solutionCode)}</pre>
                                        <div class="guide-actions">
                                            <button type="button" class="guide-lesson__action" data-guide-fill="${escapeHtml(lesson.id)}">Подставить эталон в Blockly</button>
                                        </div>
                                    </div>
                                `
                : ''}
                        </section>

                        <section class="guide-panel-card">
                            <div class="guide-panel-card__top">
                                <div class="guide-panel-card__title">Открыть связанные методы API</div>
                                <button
                                    type="button"
                                    class="guide-lesson__action"
                                    data-guide-query="${escapeHtml(lesson.actionQuery)}"
                                    ${lesson.actionPreviewKey ? `data-guide-preview="${escapeHtml(lesson.actionPreviewKey)}"` : ''}
                                >
                                    ${escapeHtml(lesson.actionLabel)}
                                </button>
                            </div>
                            <div class="guide-methods">
                                ${lesson.links.map(renderDocLink).join('')}
                            </div>
                        </section>
                    </div>
                </section>
            `}
        </div>
    `;
}
