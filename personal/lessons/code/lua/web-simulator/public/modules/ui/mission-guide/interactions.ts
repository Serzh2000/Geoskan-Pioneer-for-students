import { openApiDocsCatalog } from '../api-docs/index.js';
import type { ScriptLanguage } from '../api-docs/sections.js';
import { getGuideLessonState } from './lessons.js';
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
const blocklyTheme = Blockly.Theme.defineTheme('pioneer-dark-blockly', {
    name: 'pioneer-dark-blockly',
    base: Blockly.Themes.Classic,
    componentStyles: {
        workspaceBackgroundColour: '#0f172a',
        toolboxBackgroundColour: '#1e293b',
        flyoutBackgroundColour: '#1e293b'
    }
});

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

    const blocklyDiv = document.getElementById('blocklyDiv');
    console.log('blocklyDiv found:', !!blocklyDiv);
    if (blocklyDiv) {
        if (workspace) {
            try {
                workspace.dispose();
            } catch (e) {
                console.warn('Failed to dispose workspace', e);
            }
            workspace = null;
        }
        
        const toolboxXml = buildGuideToolbox(language, lesson.id);
        
        console.log('Injecting Blockly with toolbox:', toolboxXml);

        setTimeout(() => {
            console.log('blocklyDiv dimensions:', blocklyDiv.clientWidth, blocklyDiv.clientHeight);
            const activeWorkspace = Blockly.inject(blocklyDiv, {
                toolbox: toolboxXml,
                scrollbars: true,
                trashcan: true,
                theme: blocklyTheme,
                toolboxPosition: 'start'
            });
            workspace = activeWorkspace;
            console.log('Workspace injected:', !!workspace);

            // Resize Blockly workspace on window resize
            window.addEventListener('resize', () => Blockly.svgResize(activeWorkspace), false);
            Blockly.svgResize(activeWorkspace);

            // Load existing blocks from state
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

            updateGeneratedCodePreview(language, activeWorkspace);

            activeWorkspace.addChangeListener(() => {
                updateGeneratedCodePreview(language, activeWorkspace);

                const sequenceIds = extractMissionGuideSequence(activeWorkspace);
                setLessonSequence(language, lesson.id, sequenceIds);
                setLessonWorkspaceState(language, lesson.id, Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(activeWorkspace)));
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
    }

    container.querySelectorAll<HTMLElement>('[data-guide-query]').forEach((element) => {
        element.addEventListener('click', () => {
            const query = element.dataset.guideQuery || '';
            const previewKey = element.dataset.guidePreview || null;
            openApiDocsCatalog({ language, query, previewKey });
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-mode]').forEach((element) => {
        element.addEventListener('click', () => {
            const mode = element.dataset.guideMode;
            if (mode !== 'tutorial' && mode !== 'trainer') return;
            setActiveTab(language, mode);
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-chapter]').forEach((element) => {
        element.addEventListener('click', () => {
            const chapterId = element.dataset.guideChapter;
            if (!chapterId) return;
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
            if (selectedLesson) {
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
            setActiveChapterId(language, nextLesson.chapterId);
            setActiveLessonId(language, nextLesson.id);
            setActiveTab(language, 'trainer');
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-reset]').forEach((element) => {
        element.addEventListener('click', () => {
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
            if (workspace) {
                workspace.clear();
                let xml = '<xml>';
                // Construct a linear stack of blocks
                let blockStr = '';
                for (let i = lesson.targetBlockIds.length - 1; i >= 0; i--) {
                    const blockId = lesson.targetBlockIds[i];
                    if (blockStr === '') {
                        blockStr = `<block type="${blockId}"></block>`;
                    } else {
                        blockStr = `<block type="${blockId}"><next>${blockStr}</next></block>`;
                    }
                }
                xml += blockStr + '</xml>';
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
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-check]').forEach((element) => {
        element.addEventListener('click', () => {
            const sequenceIds = getLessonSequence(language, lesson.id);
            const evaluation = evaluateLesson(lesson, sequenceIds, getLessonWorkspaceState(language, lesson.id));
            setLessonChecked(language, lesson.id, true);

            if (evaluation.solved) {
                launchLesson(language, lesson, rerender, workspace, {
                    kind: 'info',
                    message: 'Сценарий запущен. Сверьте живую сцену с ожидаемым результатом.'
                });
                return;
            }

            if (canLaunchLesson(sequenceIds, evaluation.diagnostics)) {
                launchLesson(language, lesson, rerender, workspace, {
                    kind: 'warning',
                    message: 'Сценарий запущен, но решение не прошло учебную проверку. Живая сцена открыта, замечания показаны справа.'
                });
                return;
            }

            setLessonBanner(language, lesson.id, {
                kind: 'warning',
                message: 'Проверка завершена. В коде есть критичные замечания, поэтому сценарий не запускается. Исправьте их и проверьте еще раз.'
            });
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-toggle-code]').forEach((element) => {
        element.addEventListener('click', () => {
            setLessonGeneratedCodeVisible(language, lesson.id, !isLessonGeneratedCodeVisible(language, lesson.id));
            rerender(language);
        });
    });

    container.querySelectorAll<HTMLElement>('[data-guide-toggle-solution]').forEach((element) => {
        element.addEventListener('click', () => {
            setLessonSolutionVisible(language, lesson.id, !isLessonSolutionVisible(language, lesson.id));
            rerender(language);
        });
    });

}
