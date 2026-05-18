import { openApiDocsCatalog } from '../api-docs/index.js';
import type { ScriptLanguage } from '../api-docs/sections.js';
import { setCurrentScriptLanguage } from '../../core/state.js';
import { resetSimulationState } from '../../app/simulation-controls.js';
import { logGuideEvent, summarizeGuideDiagnostics } from './guide-logging.js';
import { getGuideLessonState } from './lessons.js';
import { restoreMissionGuideScenePreview } from './scene-preview.js';
import {
    getActiveChapter,
    getActiveLesson,
    setActiveChapterId,
    setActiveLessonId,
    setActiveTab,
    setLessonBanner,
    setLessonSequence,
    getLessonSequence,
    getLessonWorkspaceState,
    setLessonChecked,
    isLessonGeneratedCodeVisible,
    isLessonSolutionVisible,
    setLessonGeneratedCodeVisible,
    setLessonSolutionVisible,
    setLessonWorkspaceState
} from './state.js';
import type { RenderMissionGuidePanel } from './types.js';
import { Blockly, extractMissionGuideSequence, initBlocklyDefinitions } from './blockly.js';
import { buildGuideToolbox } from './blockly-toolbox.js';
import { evaluateLesson } from './lesson-evaluation.js';
import {
    canLaunchLesson,
    launchLesson,
    renderUncheckedDiagnostics,
    renderUncheckedSummary,
    updateGeneratedCodePreview
} from './interactions-launch.js';

let workspace: Blockly.WorkspaceSvg | null = null;
let blocklyInitialized = false;
let pendingBlocklyInitTimeout: number | null = null;
let activeBlocklyInitToken = 0;
let workspaceResizeHandler: (() => void) | null = null;
const blocklyTheme = Blockly.Theme.defineTheme('pioneer-light-blockly', {
    name: 'pioneer-light-blockly',
    base: Blockly.Themes.Classic,
    componentStyles: {
        workspaceBackgroundColour: 'transparent',
        toolboxBackgroundColour: '#ffffff',
        toolboxForegroundColour: '#1a1a1a',
        flyoutBackgroundColour: '#f8f9fa',
        flyoutForegroundColour: '#1a1a1a',
        scrollbarColour: '#cbd5df',
        insertionMarkerColour: '#ff6b00',
        insertionMarkerOpacity: 0.28,
        markerColour: '#ff6b00',
        cursorColour: '#ff6b00'
    }
});

function resetGuideRuntimeView(): void {
    restoreMissionGuideScenePreview();
    resetSimulationState();
}

function getGuideContext(language: ScriptLanguage, lessonId: string, chapterId: string): Record<string, unknown> {
    return { language, lessonId, chapterId };
}

function hasSequenceChanged(previous: string[], next: string[]): boolean {
    if (previous.length !== next.length) return true;
    return previous.some((blockId, index) => blockId !== next[index]);
}

function shouldHandleWorkspaceMutation(event: Blockly.Events.Abstract | undefined): boolean {
    if (!event) return true;
    if (event.isUiEvent) return false;
    return event.type !== Blockly.Events.FINISHED_LOADING;
}

function buildTargetWorkspaceXml(lessonId: string, targetBlockIds: string[]): string {
    if (lessonId === 'lua-led-sequence') {
        return `
            <xml>
                <block type="lua_ledbar_new">
                    <field name="COUNT">29</field>
                    <next>
                        <block type="lua_timer_calllater">
                            <field name="DELAY">1</field>
                            <statement name="CALLBACK">
                                <block type="lua_led_set">
                                    <field name="INDEX">0</field>
                                    <field name="R">0</field>
                                    <field name="G">0</field>
                                    <field name="B">1</field>
                                </block>
                            </statement>
                            <next>
                                <block type="lua_timer_calllater">
                                    <field name="DELAY">2</field>
                                    <statement name="CALLBACK">
                                        <block type="lua_led_set">
                                            <field name="INDEX">0</field>
                                            <field name="R">0</field>
                                            <field name="G">1</field>
                                            <field name="B">0</field>
                                        </block>
                                    </statement>
                                    <next>
                                        <block type="lua_timer_calllater">
                                            <field name="DELAY">3</field>
                                            <statement name="CALLBACK">
                                                <block type="lua_led_set">
                                                    <field name="INDEX">0</field>
                                                    <field name="R">1</field>
                                                    <field name="G">0</field>
                                                    <field name="B">0</field>
                                                </block>
                                            </statement>
                                        </block>
                                    </next>
                                </block>
                            </next>
                        </block>
                    </next>
                </block>
            </xml>
        `;
    }

    let xml = '<xml>';
    let blockStr = '';
    for (let i = targetBlockIds.length - 1; i >= 0; i--) {
        const blockId = targetBlockIds[i];
        if (blockStr === '') {
            blockStr = `<block type="${blockId}"></block>`;
        } else {
            blockStr = `<block type="${blockId}"><next>${blockStr}</next></block>`;
        }
    }
    xml += blockStr + '</xml>';
    return xml;
}

export function attachGuideInteractions(
    container: HTMLElement,
    language: ScriptLanguage,
    rerender: RenderMissionGuidePanel
): void {
    if (!blocklyInitialized) {
        initBlocklyDefinitions();
        blocklyInitialized = true;
    }
    const state = getGuideLessonState(language);
    const lesson = getActiveLesson(state, language);
    const activeChapter = getActiveChapter(state, language);
    logGuideEvent('interactions_attached', getGuideContext(language, lesson.id, activeChapter.id));

    if (pendingBlocklyInitTimeout !== null) {
        window.clearTimeout(pendingBlocklyInitTimeout);
        pendingBlocklyInitTimeout = null;
    }

    const blocklyDiv = document.getElementById('blocklyDiv');
    if (blocklyDiv) {
        const toolboxXml = buildGuideToolbox(language, lesson.id);
        const initToken = ++activeBlocklyInitToken;

        pendingBlocklyInitTimeout = window.setTimeout(() => {
            pendingBlocklyInitTimeout = null;
            if (initToken !== activeBlocklyInitToken) return;

            const currentBlocklyDiv = document.getElementById('blocklyDiv');
            if (!(currentBlocklyDiv instanceof HTMLElement) || !currentBlocklyDiv.isConnected) return;

            if (workspaceResizeHandler) {
                window.removeEventListener('resize', workspaceResizeHandler);
                workspaceResizeHandler = null;
            }
            if (workspace) {
                try {
                    workspace.dispose();
                } catch (e) {
                    console.warn('Failed to dispose workspace', e);
                }
                workspace = null;
            }

            const activeWorkspace = Blockly.inject(currentBlocklyDiv, {
                toolbox: toolboxXml,
                scrollbars: true,
                trashcan: true,
                theme: blocklyTheme,
                toolboxPosition: 'start',
                grid: {
                    spacing: 24,
                    length: 1,
                    colour: '#d7dde5',
                    snap: false
                }
            });
            workspace = activeWorkspace;

            workspaceResizeHandler = () => Blockly.svgResize(activeWorkspace);
            window.addEventListener('resize', workspaceResizeHandler, false);
            Blockly.svgResize(activeWorkspace);

            const savedWorkspaceXml = getLessonWorkspaceState(language, lesson.id);
            const savedSequence = getLessonSequence(language, lesson.id);
            if (savedWorkspaceXml) {
                try {
                    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(savedWorkspaceXml), activeWorkspace);
                } catch (e) {}
            } else if (savedSequence && savedSequence.length > 0) {
                let xml = '<xml>';
                let blockStr = '';
                for (let i = savedSequence.length - 1; i >= 0; i--) {
                    const blockId = savedSequence[i];
                    if (blockStr === '') {
                        blockStr = `<block type="${blockId}"></block>`;
                    } else {
                        blockStr = `<block type="${blockId}"><next>${blockStr}</next></block>`;
                    }
                }
                xml += blockStr + '</xml>';
                try {
                    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xml), activeWorkspace);
                } catch (e) {}
            }

            logGuideEvent('workspace_ready', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                restoredFromXml: Boolean(savedWorkspaceXml),
                restoredFromSequence: !savedWorkspaceXml && savedSequence.length > 0,
                sequenceLength: savedSequence.length
            });

            updateGeneratedCodePreview(language, activeWorkspace);

            activeWorkspace.addChangeListener((event: Blockly.Events.Abstract) => {
                if (!shouldHandleWorkspaceMutation(event)) return;

                updateGeneratedCodePreview(language, activeWorkspace);

                const sequenceIds = extractMissionGuideSequence(activeWorkspace);
                const workspaceXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(activeWorkspace));
                const previousSequence = getLessonSequence(language, lesson.id);
                const previousWorkspaceXml = getLessonWorkspaceState(language, lesson.id);
                const contentChanged = hasSequenceChanged(previousSequence, sequenceIds) || previousWorkspaceXml !== workspaceXml;

                setLessonSequence(language, lesson.id, sequenceIds);
                setLessonWorkspaceState(language, lesson.id, workspaceXml);

                if (!contentChanged) return;

                logGuideEvent('workspace_changed', {
                    ...getGuideContext(language, lesson.id, activeChapter.id),
                    eventType: event.type,
                    sequenceLength: sequenceIds.length,
                    sequence: sequenceIds,
                    xmlLength: workspaceXml.length
                });

                setLessonChecked(language, lesson.id, false);
                setLessonBanner(language, lesson.id, null);

                const checkSummary = document.getElementById('guide-check-summary');
                if (checkSummary) {
                    checkSummary.innerHTML = renderUncheckedSummary();
                }

                const diagnosticsContainer = document.getElementById('diagnostics-container');
                if (diagnosticsContainer) {
                    diagnosticsContainer.innerHTML = renderUncheckedDiagnostics();
                }

                container.querySelectorAll<HTMLButtonElement>('[data-guide-toggle-solution]').forEach((button) => {
                    button.disabled = true;
                });
            });
        }, 10);
    } else {
        activeBlocklyInitToken += 1;
        if (workspaceResizeHandler) {
            window.removeEventListener('resize', workspaceResizeHandler);
            workspaceResizeHandler = null;
        }
        if (workspace) {
            try {
                workspace.dispose();
            } catch (e) {
                console.warn('Failed to dispose workspace', e);
            }
            workspace = null;
        }
    }

    container.querySelectorAll<HTMLElement>('[data-guide-query]').forEach((element) => {
        element.addEventListener('click', () => {
            const query = element.dataset.guideQuery || '';
            const previewKey = element.dataset.guidePreview || null;
            logGuideEvent('docs_open', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                query,
                previewKey
            });
            openApiDocsCatalog({ language, query, previewKey });
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-mode]').forEach((element) => {
        element.addEventListener('click', () => {
            const mode = element.dataset.guideMode;
            if (mode !== 'tutorial' && mode !== 'trainer') return;
            logGuideEvent('tab_change', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                nextTab: mode
            });
            resetGuideRuntimeView();
            setActiveTab(language, mode);
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLSelectElement>('[data-guide-language-select]').forEach((element) => {
        element.addEventListener('change', () => {
            const nextLanguage = element.value as ScriptLanguage;
            if (nextLanguage !== 'lua' && nextLanguage !== 'python') return;
            logGuideEvent('language_change', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                nextLanguage
            });
            resetGuideRuntimeView();
            setCurrentScriptLanguage(nextLanguage);
            const appLanguageSelect = document.getElementById('script-language-select') as HTMLSelectElement | null;
            if (appLanguageSelect) {
                appLanguageSelect.value = nextLanguage;
            }
            rerender(nextLanguage);
        });
    });

    container.querySelectorAll<HTMLSelectElement>('[data-guide-chapter-select]').forEach((element) => {
        element.addEventListener('change', () => {
            const chapterId = element.value;
            if (!chapterId) return;
            logGuideEvent('chapter_change', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                nextChapterId: chapterId
            });
            resetGuideRuntimeView();
            setActiveChapterId(language, chapterId);
            const chapterLessons = state.lessons.filter((item) => item.chapterId === chapterId);
            if (chapterLessons.length > 0) {
                setActiveLessonId(language, chapterLessons[0].id);
            }
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLSelectElement>('[data-guide-lesson-select]').forEach((element) => {
        element.addEventListener('change', () => {
            const lessonId = element.value;
            if (!lessonId) return;
            const selectedLesson = state.lessons.find((item) => item.id === lessonId);
            if (!selectedLesson) return;
            logGuideEvent('lesson_change', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                nextLessonId: lessonId,
                nextChapterId: selectedLesson.chapterId
            });
            resetGuideRuntimeView();
            setActiveChapterId(language, selectedLesson.chapterId);
            setActiveLessonId(language, lessonId);
            setActiveTab(language, 'trainer');
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-chapter]').forEach((element) => {
        element.addEventListener('click', () => {
            const chapterId = element.dataset.guideChapter;
            if (!chapterId) return;
            logGuideEvent('chapter_card_open', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                nextChapterId: chapterId
            });
            resetGuideRuntimeView();
            setActiveChapterId(language, chapterId);
            const nextChapter = state.chapters.find((chapter) => chapter.id === chapterId);
            if (nextChapter) {
                setActiveLessonId(language, nextChapter.primaryLessonId);
            }
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-go-practice]').forEach((element) => {
        element.addEventListener('click', () => {
            const chapterId = element.dataset.guideGoPractice;
            const lessonId = element.dataset.guideLesson;
            if (!chapterId || !lessonId) return;
            logGuideEvent('practice_open', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                nextChapterId: chapterId,
                nextLessonId: lessonId
            });
            resetGuideRuntimeView();
            setActiveChapterId(language, chapterId);
            setActiveLessonId(language, lessonId);
            setActiveTab(language, 'trainer');
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-lesson]').forEach((element) => {
        element.addEventListener('click', () => {
            const lessonId = element.dataset.guideLesson;
            if (!lessonId) return;
            const selectedLesson = state.lessons.find((item) => item.id === lessonId);
            logGuideEvent('lesson_card_open', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                nextLessonId: lessonId,
                nextChapterId: selectedLesson?.chapterId
            });
            if (selectedLesson) {
                resetGuideRuntimeView();
                setActiveChapterId(language, selectedLesson.chapterId);
            }
            setActiveLessonId(language, lessonId);
            setActiveTab(language, 'trainer');
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-nav]').forEach((element) => {
        element.addEventListener('click', () => {
            const currentIndex = state.lessons.findIndex((item) => item.id === lesson.id);
            if (currentIndex < 0) return;
            const direction = element.dataset.guideNav;
            const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
            const nextLesson = state.lessons[nextIndex];
            if (!nextLesson) return;
            logGuideEvent('lesson_nav', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                direction,
                nextLessonId: nextLesson.id,
                nextChapterId: nextLesson.chapterId
            });
            resetGuideRuntimeView();
            setActiveChapterId(language, nextLesson.chapterId);
            setActiveLessonId(language, nextLesson.id);
            setActiveTab(language, 'trainer');
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-reset]').forEach((element) => {
        element.addEventListener('click', () => {
            logGuideEvent('workspace_reset', getGuideContext(language, lesson.id, activeChapter.id), 'warn');
            resetGuideRuntimeView();
            if (workspace) {
                workspace.clear();
            }
            setLessonWorkspaceState(language, lesson.id, null);
            setLessonChecked(language, lesson.id, false);
            setLessonBanner(language, lesson.id, null);
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-fill]').forEach((element) => {
        element.addEventListener('click', () => {
            logGuideEvent('solution_fill_requested', getGuideContext(language, lesson.id, activeChapter.id));
            if (workspace) {
                workspace.clear();
                const xml = buildTargetWorkspaceXml(lesson.id, lesson.targetBlockIds);
                try {
                    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xml), workspace);
                } catch (e) {
                    console.error("Failed to load target workspace", e);
                }
            }
            setLessonChecked(language, lesson.id, true);
            setLessonBanner(language, lesson.id, {
                kind: 'info',
                message: 'В рабочую область подставлена эталонная последовательность.'
            });
            logGuideEvent('solution_fill_applied', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                targetSequence: lesson.targetBlockIds
            }, 'success');
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-check]').forEach((element) => {
        element.addEventListener('click', () => {
            const sequenceIds = getLessonSequence(language, lesson.id);
            const workspaceXml = getLessonWorkspaceState(language, lesson.id);
            logGuideEvent('check_clicked', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                sequenceLength: sequenceIds.length,
                sequence: sequenceIds,
                workspaceXmlLength: workspaceXml?.length || 0
            });
            const evaluation = evaluateLesson(lesson, sequenceIds, workspaceXml);
            logGuideEvent('check_evaluated', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                solved: evaluation.solved,
                complete: evaluation.complete,
                diagnosticsCount: evaluation.diagnostics.length,
                diagnostics: summarizeGuideDiagnostics(evaluation.diagnostics)
            }, evaluation.solved ? 'success' : evaluation.diagnostics.some((diagnostic) => diagnostic.kind === 'error') ? 'warn' : 'info');
            setLessonChecked(language, lesson.id, true);

            if (evaluation.solved) {
                logGuideEvent('check_decision_launch_solved', getGuideContext(language, lesson.id, activeChapter.id), 'success');
                launchLesson(language, lesson, rerender, workspace, {
                    kind: 'info',
                    message: 'Сценарий запущен. Сверьте живую сцену с ожидаемым результатом.'
                });
                return;
            }

            if (canLaunchLesson(sequenceIds, evaluation.diagnostics)) {
                logGuideEvent('check_decision_launch_with_warnings', {
                    ...getGuideContext(language, lesson.id, activeChapter.id),
                    diagnostics: summarizeGuideDiagnostics(evaluation.diagnostics)
                }, 'warn');
                launchLesson(language, lesson, rerender, workspace, {
                    kind: 'warning',
                    message: 'Сценарий запущен, но решение не прошло учебную проверку. Живая сцена открыта, замечания показаны справа.'
                });
                return;
            }

            logGuideEvent('check_decision_block_launch', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                diagnostics: summarizeGuideDiagnostics(evaluation.diagnostics)
            }, 'warn');
            resetGuideRuntimeView();
            setLessonBanner(language, lesson.id, {
                kind: 'warning',
                message: 'Проверка завершена, но запуск отменен: рабочая область пока пуста. Добавьте хотя бы одну команду и нажмите «Проверить и запустить» еще раз.'
            });
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-toggle-code]').forEach((element) => {
        element.addEventListener('click', () => {
            logGuideEvent('toggle_generated_code', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                nextVisible: !isLessonGeneratedCodeVisible(language, lesson.id)
            });
            setLessonGeneratedCodeVisible(language, lesson.id, !isLessonGeneratedCodeVisible(language, lesson.id));
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-toggle-solution]').forEach((element) => {
        element.addEventListener('click', () => {
            logGuideEvent('toggle_solution', {
                ...getGuideContext(language, lesson.id, activeChapter.id),
                nextVisible: !isLessonSolutionVisible(language, lesson.id)
            });
            setLessonSolutionVisible(language, lesson.id, !isLessonSolutionVisible(language, lesson.id));
            rerender(language);
        });
    });

}
