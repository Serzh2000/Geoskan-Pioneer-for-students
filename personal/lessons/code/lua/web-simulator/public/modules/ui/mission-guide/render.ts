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
    renderCheckSummary,
    renderDocLink,
    renderGuideSelectors,
    renderGuideTopTabs,
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
                <div class="guide-hero__progress">Решено страниц: ${solvedCount} / ${state.lessons.length}</div>
            </section>

            ${renderGuideTopTabs(language)}
            ${renderGuideSelectors(state, language)}

            ${activeTab === 'tutorial'
            ? renderTheoryView(state, language)
            : `
                <section class="guide-lesson-page">
                    <div class="guide-lesson-page__header">
                        <div>
                            <div class="guide-lesson-page__badge">${escapeHtml(lesson.badge)}</div>
                            <div class="guide-lesson-page__title">${escapeHtml(lesson.title)}</div>
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

                    <div class="guide-workbench-layout">
                        <div class="guide-workbench-layout__main">
                            <section class="guide-panel-card guide-panel-card--workspace">
                                <div class="guide-panel-card__top">
                                    <div>
                                        <div class="guide-panel-card__title">Практика: Blockly</div>
                                        <div class="guide-panel-card__text">Соберите логику слева, затем запустите и сразу проверьте поведение дрона в сцене справа.</div>
                                    </div>
                                    <div class="guide-panel-card__badge">Шаг 1</div>
                                </div>
                                <div class="guide-blockly-shell">
                                    <div id="blocklyDiv" class="guide-blockly-stage"></div>
                                </div>
                                <div class="guide-actions guide-actions--primary">
                                    <button type="button" class="guide-primary-action" data-guide-check="${escapeHtml(lesson.id)}">Проверить и запустить</button>
                                    <button type="button" class="guide-lesson__action" data-guide-reset="${escapeHtml(lesson.id)}">Очистить страницу</button>
                                </div>
                                ${renderRunBanner(language, lesson.id)}
                            </section>

                            <section class="guide-panel-card guide-panel-card--result">
                                <div class="guide-panel-card__top">
                                    <div>
                                        <div class="guide-panel-card__title">Результат проверки</div>
                                        <div class="guide-panel-card__text">Замечания остаются рядом с рабочей областью и не перекрывают Blockly.</div>
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
                        </div>

                        <div class="guide-workbench-layout__scene">
                            <section class="guide-panel-card guide-panel-card--scene">
                                <div class="guide-panel-card__top">
                                    <div>
                                        <div class="guide-panel-card__title">Живая сцена</div>
                                        <div class="guide-panel-card__text">Симуляция всегда остается в поле зрения, чтобы можно было сразу соотнести логику и поведение.</div>
                                    </div>
                                    <div class="guide-panel-card__badge">3D</div>
                                </div>
                                <div id="mission-guide-scene-preview-host" class="guide-scene-preview-host ${previewActive ? 'is-active' : ''}">
                                    ${previewActive ? '' : '<div class="guide-scene-preview__placeholder">Нажмите "Проверить и запустить", чтобы открыть live-просмотр симуляции в этом окне.</div>'}
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            `}
        </div>
    `;
}
