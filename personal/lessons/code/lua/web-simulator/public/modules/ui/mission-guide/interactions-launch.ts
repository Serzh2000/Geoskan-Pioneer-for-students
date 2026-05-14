import { setCurrentScriptLanguage } from '../../core/state.js';
import { setEditorLanguage, setEditorValue } from '../../editor/index.js';
import { restartAndRunSimulation } from '../../app/simulation-controls.js';
import { openApiDocsCatalog, renderApiDocs } from '../api-docs/index.js';
import type { ScriptLanguage } from '../api-docs/sections.js';
import { getGuideLessonState } from './lessons.js';
import { setMissionGuideScenePreviewActive } from './scene-preview.js';
import {
    getActiveLesson,
    setActiveLessonId,
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
import type { GuideLesson, RenderMissionGuidePanel } from './types.js';
import { Blockly, compileMissionGuideWorkspace, extractMissionGuideSequence, initBlocklyDefinitions } from './blockly.js';
import { evaluateLesson } from './lesson-evaluation.js';

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

export function updateGeneratedCodePreview(language: ScriptLanguage, activeWorkspace: Blockly.WorkspaceSvg): void {
    const codePreview = document.getElementById('blockly-generated-code');
    if (!codePreview) return;

    const code = compileMissionGuideWorkspace(language, activeWorkspace);
    codePreview.textContent = code || '-- Пусто --';
}

export function renderUncheckedSummary(): string {
    return `
        <div class="guide-check-status guide-check-status--info">
            Цепочка изменилась. Нажмите «Проверить и запустить», чтобы заново проверить решение.
        </div>
    `;
}

export function renderUncheckedDiagnostics(): string {
    return '<div class="guide-empty-state">После изменений старая проверка скрыта. Запустите новую проверку, когда закончите правки.</div>';
}

export function canLaunchLesson(sequenceIds: string[], diagnostics: Array<{ kind: string }>): boolean {
    return sequenceIds.length > 0 && !diagnostics.some((diagnostic) => diagnostic.kind === 'error');
}

export function launchLesson(
    language: ScriptLanguage,
    lesson: GuideLesson,
    rerender: RenderMissionGuidePanel,
    activeWorkspace: Blockly.WorkspaceSvg | null,
    banner: { kind: 'info' | 'warning'; message: string }
): void {
    if (!activeWorkspace) return;
    const code = compileMissionGuideWorkspace(language, activeWorkspace);

    const languageSelect = document.getElementById('script-language-select') as HTMLSelectElement | null;

    setCurrentScriptLanguage(language);
    if (languageSelect) languageSelect.value = language;
    setEditorLanguage(language);
    setEditorValue(code);
    renderApiDocs(language);

    setLessonBanner(language, lesson.id, banner);

    setMissionGuideScenePreviewActive(true);
    rerender(language);
    restartAndRunSimulation();
}

