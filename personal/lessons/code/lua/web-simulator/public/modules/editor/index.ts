/**
 * Модуль интеграции редактора кода Monaco Editor.
 * Настраивает окружение для написания Lua-скриптов, добавляет
 * автодополнение (IntelliSense) и hover-подсказки для специфичных
 * API-функций дрона Pioneer. Управляет получением и установкой кода в редакторе.
 */
import 'monaco-editor/min/vs/editor/editor.main.css';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import { setupSyntaxHighlighting } from './syntax.js';
import { setupHoverProvider } from './hover.js';
import { setupCompletionProvider } from './completion.js';
import { Blockly } from '../ui/mission-guide/blockly.js';
import { currentDroneId, currentScriptLanguage, ScriptLanguage } from '../core/state.js';
import {
    buildMainEditorToolbox,
    compileMainEditorWorkspace,
    ensureEditorBlocklyDefinitions
} from './blockly.js';
import {
    applyEditorLayoutState,
    computeExpandedSidebarWidth,
    resizeBlocklyCanvas,
    updateGeneratedCodePreview
} from './blockly-ui.js';

let editorInstance: any;
let pendingValue: string | null = null;
let pendingLanguage: ScriptLanguage | null = null;
let monacoRoot: HTMLElement | null = null;
let blocklyRoot: HTMLElement | null = null;
let blocklyCanvasHost: HTMLElement | null = null;
let blocklyCanvas: HTMLElement | null = null;
let blocklyPreview: HTMLElement | null = null;
let blocklyCodeOverlay: HTMLElement | null = null;
let blocklyCodeOverlayToggle: HTMLInputElement | null = null;
let blocklyWorkspace: Blockly.WorkspaceSvg | null = null;
let blocklyEnabled = false;
let blocklyGeneratedCodeVisible = false;
let blocklyResizeObserver: ResizeObserver | null = null;
let blocklyWindowResizeBound = false;
let previousSidebarWidthBeforeBlockly: string | null = null;
const blocklyWorkspaceXmlByKey = new Map<string, string>();
const textDraftByKey = new Map<string, string>();

const blocklyTheme = Blockly.Theme.defineTheme('pioneer-main-blockly', {
    name: 'pioneer-main-blockly',
    base: Blockly.Themes.Classic,
    fontStyle: {
        family: 'Inter, Segoe UI, sans-serif',
        weight: '600',
        size: 12
    },
    componentStyles: {
        workspaceBackgroundColour: '#0f172a',
        toolboxBackgroundColour: '#1e293b',
        toolboxForegroundColour: '#e2e8f0',
        flyoutBackgroundColour: '#111827',
        flyoutForegroundColour: '#e2e8f0',
        scrollbarColour: 'rgba(56, 189, 248, 0.34)',
        insertionMarkerColour: '#38bdf8',
        insertionMarkerOpacity: 0.32,
        markerColour: '#7dd3fc',
        cursorColour: '#38bdf8'
    }
});

export function initEditor() {
    try {
        (self as typeof globalThis & {
            MonacoEnvironment?: { getWorker: () => Worker };
        }).MonacoEnvironment = {
            getWorker() {
                return new editorWorker();
            }
        };

        createEditorShell();
        createEditor();
    } catch (err) {
        console.error('Monaco Editor load error:', err);
        createEditorShell();
        fallbackEditor();
    }
}

function getEditorStateKey(language: ScriptLanguage = currentScriptLanguage): string {
    return `${currentDroneId}:${language}`;
}

function createEditorShell() {
    const editorElement = document.getElementById('editor');
    if (!editorElement) return;

    editorElement.innerHTML = `
        <div id="monaco-editor-root" class="editor-mode-root"></div>
        <div id="blockly-editor-root" class="editor-mode-root editor-mode-root--hidden">
            <div class="blockly-editor-shell">
                <div id="blockly-editor-canvas-host" class="blockly-editor-canvas-host">
                    <div id="blockly-editor-canvas" class="blockly-editor-canvas"></div>
                    <div id="blockly-code-overlay" class="blockly-code-overlay" aria-hidden="true">
                        <div class="blockly-code-overlay__header">
                            <div class="blockly-code-overlay__title">Сгенерированный код</div>
                        </div>
                        <pre id="blockly-editor-code-preview" class="blockly-code-overlay__code"></pre>
                    </div>
                </div>
            </div>
        </div>
    `;

    monacoRoot = document.getElementById('monaco-editor-root');
    blocklyRoot = document.getElementById('blockly-editor-root');
    blocklyCanvasHost = document.getElementById('blockly-editor-canvas-host');
    blocklyCanvas = document.getElementById('blockly-editor-canvas');
    blocklyPreview = document.getElementById('blockly-editor-code-preview');
    blocklyCodeOverlay = document.getElementById('blockly-code-overlay');
    blocklyCodeOverlayToggle = document.getElementById('blockly-code-overlay-toggle') as HTMLInputElement | null;
    syncEditorModeVisibility();
}

function syncBlocklyEditorToggle() {
    const toggle = document.getElementById('blockly-editor-toggle') as HTMLInputElement | null;
    if (toggle) {
        toggle.checked = blocklyEnabled;
    }
}

function syncBlocklyCodeOverlayToggle() {
    if (!blocklyCodeOverlayToggle) return;
    blocklyCodeOverlayToggle.checked = blocklyEnabled && blocklyGeneratedCodeVisible;
    blocklyCodeOverlayToggle.disabled = !blocklyEnabled;
}

function fallbackEditor() {
    if (monacoRoot) {
        monacoRoot.innerHTML = '<div style="color:red; padding:20px;">Failed to load Monaco Editor. Please check your internet connection. Falling back to simple textarea.</div><textarea id="fallback-editor" style="width:100%; height:90%; background:#1e1e1e; color:#d4d4d4; font-family:monospace; padding:10px; border:none; resize:none;">-- Pioneer Lua Script\n\nap.push(Ev.MCE_TAKEOFF)</textarea>';
        (window as any).getEditorValueFallback = () => (document.getElementById('fallback-editor') as HTMLTextAreaElement).value;
        (window as any).setEditorValueFallback = (val: string) => {
            const el = document.getElementById('fallback-editor') as HTMLTextAreaElement;
            if(el) el.value = val;
        };
    }
}

function createEditor() {
    setupSyntaxHighlighting(monaco);
    setupHoverProvider(monaco);
    setupCompletionProvider(monaco);
    ensureEditorBlocklyDefinitions();

    const initialLanguage: ScriptLanguage = pendingLanguage || 'lua';
    const initialMonacoLang = initialLanguage === 'lua' ? 'lua' : 'python';
    const initialValue =
        pendingValue ||
        '-- Pioneer Lua Script\n\nap.push(Ev.MCE_TAKEOFF)\n\nTimer.callLater(3, function()\n    ap.push(Ev.MCE_LANDING)\nend)';

    if (!monacoRoot) {
        fallbackEditor();
        return;
    }

    editorInstance = monaco.editor.create(monacoRoot, {
        value: initialValue,
        language: initialMonacoLang,
        theme: 'pioneer-dark',
        automaticLayout: true,
        wordBasedSuggestions: 'off',
        fontSize: 14,
        fontFamily: "'Fira Code', monospace",
        minimap: { enabled: false },
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        fixedOverflowWidgets: true,
        suggest: {
            snippetsPreventQuickSuggestions: false
        }
    });

    pendingValue = null;
    pendingLanguage = null;
}

function getTextEditorValue(): string {
    if ((window as any).getEditorValueFallback) return (window as any).getEditorValueFallback();
    return editorInstance ? editorInstance.getValue() : '';
}

function setTextEditorValue(val: string) {
    if ((window as any).setEditorValueFallback) return (window as any).setEditorValueFallback(val);
    if (editorInstance) editorInstance.setValue(val);
    else pendingValue = val;
}

function saveBlocklyWorkspaceState(language: ScriptLanguage = currentScriptLanguage) {
    if (!blocklyWorkspace) return;
    const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(blocklyWorkspace));
    blocklyWorkspaceXmlByKey.set(getEditorStateKey(language), xml);
}

function updateBlocklyPreview(language: ScriptLanguage = currentScriptLanguage) {
    if (!blocklyPreview || !blocklyWorkspace) return;
    updateGeneratedCodePreview(blocklyPreview, compileMainEditorWorkspace(language, blocklyWorkspace));
}

function isBlocklyWorkspaceEmpty(): boolean {
    if (!blocklyWorkspace) return true;
    return blocklyWorkspace.getTopBlocks(false).filter((block) => !block.isInsertionMarker()).length === 0;
}

function getSidebarPanelsElement(): HTMLElement | null {
    return document.querySelector('.sidebar-panels') as HTMLElement | null;
}

function expandEditorPanelForBlockly(): void {
    const panels = getSidebarPanelsElement();
    const activePanelId = document.querySelector('.sidebar-panel.active')?.id || null;
    if (!panels || activePanelId !== 'editor-panel' || panels.classList.contains('is-fullscreen')) return;

    const currentWidth = Number.parseInt(panels.style.width || '', 10) || Math.floor(panels.getBoundingClientRect().width);
    const nextWidth = computeExpandedSidebarWidth(window.innerWidth || currentWidth, currentWidth);

    if (!previousSidebarWidthBeforeBlockly) {
        previousSidebarWidthBeforeBlockly = panels.style.width || `${currentWidth}px`;
    }

    panels.style.width = `${nextWidth}px`;
    localStorage.setItem('sidebar-width', `${nextWidth}px`);
    window.dispatchEvent(new Event('resize'));
}

function restoreEditorPanelWidthAfterBlockly(): void {
    const panels = getSidebarPanelsElement();
    const activePanelId = document.querySelector('.sidebar-panel.active')?.id || null;
    if (!panels || activePanelId !== 'editor-panel' || !previousSidebarWidthBeforeBlockly) return;

    panels.style.width = previousSidebarWidthBeforeBlockly;
    localStorage.setItem('sidebar-width', previousSidebarWidthBeforeBlockly);
    previousSidebarWidthBeforeBlockly = null;
    window.dispatchEvent(new Event('resize'));
}

function resizeBlocklyWorkspaceViewport() {
    resizeBlocklyCanvas(blocklyCanvasHost, blocklyCanvas);
    if (blocklyWorkspace) {
        Blockly.svgResize(blocklyWorkspace);
    }
}

function ensureBlocklyResizeTracking() {
    if (typeof ResizeObserver !== 'undefined') {
        if (!blocklyResizeObserver) {
            blocklyResizeObserver = new ResizeObserver(() => {
                resizeBlocklyWorkspaceViewport();
            });
        }
        blocklyResizeObserver.disconnect();
        if (blocklyCanvasHost) {
            blocklyResizeObserver.observe(blocklyCanvasHost);
        }
        return;
    }

    if (!blocklyWindowResizeBound) {
        window.addEventListener('resize', resizeBlocklyWorkspaceViewport);
        blocklyWindowResizeBound = true;
    }
}

function loadBlocklyWorkspace(language: ScriptLanguage = currentScriptLanguage) {
    if (!blocklyWorkspace) return;

    const key = getEditorStateKey(language);
    const savedXml = blocklyWorkspaceXmlByKey.get(key);

    blocklyWorkspace.clear();

    if (savedXml) {
        try {
            const xml = Blockly.utils.xml.textToDom(savedXml);
            Blockly.Xml.domToWorkspace(xml, blocklyWorkspace);
        } catch (error) {
            console.error('[Editor] Failed to load Blockly workspace', error);
        }
    }

    if (savedXml) {
        saveBlocklyWorkspaceState(language);
    } else {
        blocklyWorkspaceXmlByKey.delete(key);
    }
    updateBlocklyPreview(language);
    resizeBlocklyWorkspaceViewport();
}

function ensureBlocklyWorkspace(language: ScriptLanguage = currentScriptLanguage) {
    if (!blocklyCanvas) return;
    if (!blocklyWorkspace) {
        blocklyWorkspace = Blockly.inject(blocklyCanvas, {
            toolbox: buildMainEditorToolbox(language),
            scrollbars: true,
            trashcan: true,
            theme: blocklyTheme,
            toolboxPosition: 'start'
        });

        blocklyWorkspace.addChangeListener(() => {
            saveBlocklyWorkspaceState(currentScriptLanguage);
            textDraftByKey.set(getEditorStateKey(currentScriptLanguage), compileMainEditorWorkspace(currentScriptLanguage, blocklyWorkspace!));
            updateBlocklyPreview(currentScriptLanguage);
        });
    } else {
        blocklyWorkspace.updateToolbox(buildMainEditorToolbox(language));
    }

    ensureBlocklyResizeTracking();
    resizeBlocklyWorkspaceViewport();
}

function syncEditorModeVisibility() {
    applyEditorLayoutState({
        monacoRoot,
        blocklyRoot,
        codeOverlay: blocklyCodeOverlay,
        codeToggle: blocklyCodeOverlayToggle
    }, {
        blocklyEnabled,
        generatedCodeVisible: blocklyGeneratedCodeVisible
    });
}

export function getEditorValue(): string {
    if (blocklyEnabled && blocklyWorkspace) {
        return compileMainEditorWorkspace(currentScriptLanguage, blocklyWorkspace);
    }
    return getTextEditorValue();
}

export function setEditorValue(val: string) {
    const key = getEditorStateKey();
    textDraftByKey.set(key, val);

    if (blocklyEnabled) {
        ensureBlocklyWorkspace(currentScriptLanguage);
        loadBlocklyWorkspace(currentScriptLanguage);
        return;
    }

    setTextEditorValue(val);
}

export function setEditorLanguage(language: ScriptLanguage) {
    if (!(window as any).getEditorValueFallback) {
        if (!editorInstance) {
            pendingLanguage = language;
        } else {
            const model = editorInstance.getModel ? editorInstance.getModel() : null;
            if (model) {
                const langId = language === 'lua' ? 'lua' : 'python';
                monaco.editor.setModelLanguage(model, langId);
            }
        }
    }

    if (blocklyEnabled) {
        ensureBlocklyWorkspace(language);
        loadBlocklyWorkspace(language);
    }
}

export function setBlocklyEditorEnabled(enabled: boolean) {
    if (blocklyEnabled === enabled) return;

    if (!enabled) {
        saveBlocklyWorkspaceState(currentScriptLanguage);
        const key = getEditorStateKey(currentScriptLanguage);
        const previousText = textDraftByKey.get(key) || '';
        const generatedCode = blocklyWorkspace
            ? compileMainEditorWorkspace(currentScriptLanguage, blocklyWorkspace)
            : previousText;
        const nextText = isBlocklyWorkspaceEmpty() && !blocklyWorkspaceXmlByKey.has(key)
            ? previousText
            : generatedCode;
        textDraftByKey.set(key, nextText);
        blocklyGeneratedCodeVisible = false;
        blocklyEnabled = false;
        syncEditorModeVisibility();
        syncBlocklyEditorToggle();
        syncBlocklyCodeOverlayToggle();
        if (monacoRoot) {
            setTextEditorValue(nextText);
        }
        restoreEditorPanelWidthAfterBlockly();
        layoutEditor();
        return;
    }

    const currentText = getTextEditorValue();
    textDraftByKey.set(getEditorStateKey(currentScriptLanguage), currentText);
    blocklyGeneratedCodeVisible = false;
    blocklyEnabled = true;
    syncEditorModeVisibility();
    syncBlocklyEditorToggle();
    syncBlocklyCodeOverlayToggle();
    expandEditorPanelForBlockly();
    ensureBlocklyWorkspace(currentScriptLanguage);
    loadBlocklyWorkspace(currentScriptLanguage);
    layoutEditor();
}

export function isBlocklyEditorEnabled(): boolean {
    return blocklyEnabled;
}

export function initBlocklyEditorToggle() {
    const toggle = document.getElementById('blockly-editor-toggle') as HTMLInputElement | null;
    syncBlocklyEditorToggle();
    syncBlocklyCodeOverlayToggle();

    if (toggle) {
        toggle.addEventListener('change', () => {
            setBlocklyEditorEnabled(toggle.checked);
        });
    }

    if (blocklyCodeOverlayToggle) {
        blocklyCodeOverlayToggle.addEventListener('change', () => {
            if (!blocklyEnabled) {
                blocklyGeneratedCodeVisible = false;
                syncEditorModeVisibility();
                syncBlocklyCodeOverlayToggle();
                return;
            }
            blocklyGeneratedCodeVisible = Boolean(blocklyCodeOverlayToggle?.checked);
            syncEditorModeVisibility();
            syncBlocklyCodeOverlayToggle();
            resizeBlocklyWorkspaceViewport();
        });
    }
}

export function layoutEditor() {
    if (editorInstance) editorInstance.layout();
    resizeBlocklyWorkspaceViewport();
}
