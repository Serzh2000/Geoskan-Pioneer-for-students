
/**
 * Модуль интеграции редактора кода Monaco Editor.
 * Настраивает окружение для написания Lua-скриптов, добавляет
 * автодополнение (IntelliSense) и hover-подсказки для специфичных
 * API-функций дрона Pioneer. Управляет получением и установкой кода в редакторе.
 */
import { setupSyntaxHighlighting } from './syntax.js';
import { setupHoverProvider } from './hover.js';
import { setupCompletionProvider } from './completion.js';
import { ScriptLanguage } from '../core/state.js';

let editorInstance: any;
let pendingValue: string | null = null;
let pendingLanguage: ScriptLanguage | null = null;

declare let require: any;
declare let monaco: any;

export function initEditor() {
    if (typeof monaco !== 'undefined') {
        createEditor();
        return;
    }

    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
    
    require.onError = function(err: any) {
        console.error('Monaco Editor load error:', err);
        fallbackEditor();
    };

    require(['vs/editor/editor.main'], function() {
        createEditor();
    });
}

function fallbackEditor() {
    const ed = document.getElementById('editor');
    if (ed) {
        ed.innerHTML = '<div style="color:red; padding:20px;">Failed to load Monaco Editor. Please check your internet connection. Falling back to simple textarea.</div><textarea id="fallback-editor" style="width:100%; height:90%; background:#1e1e1e; color:#d4d4d4; font-family:monospace; padding:10px; border:none; resize:none;">-- Pioneer Lua Script\n\nap.push(Ev.MCE_TAKEOFF)</textarea>';
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

    const initialLanguage: ScriptLanguage = pendingLanguage || 'lua';
    const initialMonacoLang = initialLanguage === 'lua' ? 'lua' : 'python';
    const initialValue =
        pendingValue ||
        '-- Pioneer Lua Script\n\nap.push(Ev.MCE_TAKEOFF)\n\nTimer.callLater(3, function()\n    ap.push(Ev.MCE_LANDING)\nend)';

    editorInstance = monaco.editor.create(document.getElementById('editor'), {
        value: initialValue,
        language: initialMonacoLang,
        theme: 'pioneer-dark',
        automaticLayout: true,
        wordBasedSuggestions: false,
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

export function getEditorValue(): string {
    if ((window as any).getEditorValueFallback) return (window as any).getEditorValueFallback();
    return editorInstance ? editorInstance.getValue() : '';
}

export function setEditorValue(val: string) {
    if ((window as any).setEditorValueFallback) return (window as any).setEditorValueFallback(val);
    if (editorInstance) editorInstance.setValue(val);
    else pendingValue = val;
}

export function setEditorLanguage(language: ScriptLanguage) {
    if ((window as any).getEditorValueFallback) return;
    if (!editorInstance || !monaco) {
        pendingLanguage = language;
        return;
    }
    const model = editorInstance.getModel ? editorInstance.getModel() : null;
    if (!model) return;
    const langId = language === 'lua' ? 'lua' : 'python';
    monaco.editor.setModelLanguage(model, langId);
}

export function layoutEditor() {
    if (editorInstance) editorInstance.layout();
}
