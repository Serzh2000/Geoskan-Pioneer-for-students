
import { apiDocs, evConstants } from './api-docs.js';

let editorInstance: any;

declare let require: any;
declare let monaco: any;

export function initEditor() {
    // Check if monaco is already loaded
    if (typeof monaco !== 'undefined') {
        createEditor();
        return;
    }

    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
    
    // Add error handling for Monaco Editor load
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
        // Hook up fallback functions
        window.getEditorValueFallback = () => (document.getElementById('fallback-editor') as HTMLTextAreaElement).value;
        window.setEditorValueFallback = (val: string) => {
            const el = document.getElementById('fallback-editor') as HTMLTextAreaElement;
            if(el) el.value = val;
        };
    }
}

function createEditor() {
        // 1. Enhanced Syntax Highlighting
        monaco.languages.setMonarchTokensProvider('lua', {
            tokenizer: {
                root: [
                    // Pioneer Modules
                    [/\b(ap|Sensors|Timer|Ledbar|camera|Gpio|Uart|Spi|mailbox)\b/, "keyword.class"],
                    
                    // Pioneer Methods (generic matcher for simplicity, specific ones handled by autocomplete)
                    [/\b(push|goToLocalPoint|goToPoint|updateYaw|lpsPosition|lpsVelocity|lpsYaw|accel|gyro|orientation|range|battery|tof|altitude|rc|callLater|callAt|callAtGlobal|new|set|start|stop|read|write|reset|setFunction|bytesToRead|setBaudRate|exchange|connect|hasMessages|myHullNumber|receive|send|setHullNumber|requestMakeShot|checkRequestShot|requestRecordStart|requestRecordStop|checkRequestRecord|fromHSV|time|deltaTime|launchTime|sleep|boardNumber)\b/, "function.call"],
                    
                    // Constants
                    [/\b(Ev)\.[A-Z_]+\b/, "constant"],
                    [/\b(Ev)\b/, "constant"],
                    
                    // Lua Keywords
                    [/\b(and|break|do|else|elseif|end|false|for|function|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/, "keyword"],
                    
                    // Comments
                    [/--\[\[[\s\S]*?(?:\]\]|$)/, 'comment'],
                    [/--.*$/, "comment"],
                    
                    // Strings
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
                    [/"([^"\\]|\\.)*"/, 'string'],
                    [/'([^'\\]|\\.)*$/, 'string.invalid'],
                    [/'([^'\\]|\\.)*'/, 'string'],
                    
                    // Numbers
                    [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
                    [/\d+/, "number"]
                ]
            }
        });

        // 2. Custom Theme
        monaco.editor.defineTheme('pioneer-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'keyword.class', foreground: '4ec9b0', fontStyle: 'bold' }, // Pioneer Modules (Greenish Cyan)
                { token: 'function.call', foreground: 'dcdcaa' }, // Methods (Yellowish)
                { token: 'constant', foreground: '569cd6', fontStyle: 'bold' }, // Constants (Blue)
                { token: 'comment', foreground: '6a9955' }, // Comments (Green)
                { token: 'string', foreground: 'ce9178' }, // Strings (Orange)
                { token: 'number', foreground: 'b5cea8' }, // Numbers (Light Green)
                { token: 'keyword', foreground: 'c586c0' } // Keywords (Purple)
            ],
            colors: {
                'editor.background': '#1e1e1e',
                'editor.foreground': '#d4d4d4'
            }
        });

        // 3. Interactive Hover Provider (Tooltips)
        monaco.languages.registerHoverProvider('lua', {
            provideHover: function(model: any, position: any) {
                const word = model.getWordAtPosition(position);
                if (!word) return;

                const line = model.getLineContent(position.lineNumber);
                
                // For Ev.MCE_LANDING, the word is 'MCE_LANDING', we need to check if 'Ev.' precedes it
                const fullWord = getFullWordAtPosition(line, position.column - 1);
                
                const doc = (apiDocs as any)[fullWord];
                if (doc) {
                    return {
                        range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                        contents: [
                            { value: `**Pioneer API: ${fullWord}**` },
                            { value: `_${doc.desc}_` },
                            { value: `\`\`\`lua\n${doc.syntax}\n\`\`\`` },
                            { value: `**Параметры:** ${doc.params}` },
                            { value: `**Результат:** ${doc.returns}` },
                            { value: `**Пример:**\n\`\`\`lua\n${doc.example}\n\`\`\`` }
                        ]
                    };
                }
            }
        });

        // 4. Autocomplete (Intellisense)
        monaco.languages.registerCompletionItemProvider('lua', {
            provideCompletionItems: function(model: any, position: any) {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                
                const suggestions: any[] = [];
                const lineContent = model.getLineContent(position.lineNumber);
                const textBeforeCursor = lineContent.substring(0, position.column - 1);

                // API Methods suggestions
                for (const [key, doc] of Object.entries(apiDocs as any)) {
                    const docObj = doc as any;
                    // Check if it's a module method (e.g. ap.push)
                    if (key.includes('.')) {
                        const [module, method] = key.split('.');
                        // Logic to suggest methods after dot
                        
                        if (textBeforeCursor.trim().endsWith(module + '.')) {
                             suggestions.push({
                                label: method,
                                kind: (monaco.languages.CompletionItemKind as any)[docObj.kind] || monaco.languages.CompletionItemKind.Method,
                                insertText: docObj.insertText || method,
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: { value: docObj.desc },
                                range: range
                            });
                        }
                    } else {
                        // Global functions or Modules
                        suggestions.push({
                            label: key,
                            kind: (monaco.languages.CompletionItemKind as any)[docObj.kind] || monaco.languages.CompletionItemKind.Function,
                            insertText: docObj.insertText || key,
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: { value: docObj.desc },
                            range: range
                        });
                    }
                }

                // Suggest Modules if typing fresh
                const modules = ['ap', 'Sensors', 'Timer', 'Ledbar', 'camera', 'Gpio', 'Uart', 'Spi', 'mailbox', 'Ev'];
                modules.forEach(mod => {
                    suggestions.push({
                        label: mod,
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText: mod,
                        documentation: "Pioneer Module",
                        range: range
                    });
                });
                
                // Suggest Ev constants
                if (textBeforeCursor.trim().endsWith('Ev.')) {
                    evConstants.forEach(ev => {
                         suggestions.push({
                            label: ev,
                            kind: monaco.languages.CompletionItemKind.EnumMember,
                            insertText: ev,
                            documentation: "Event Constant",
                            range: range
                        });
                    });
                }

                return { suggestions: suggestions };
            },
            triggerCharacters: ['.']
        });

        // Create Editor
        editorInstance = monaco.editor.create(document.getElementById('editor'), {
            value: '-- Pioneer Lua Script\n\nap.push(Ev.MCE_TAKEOFF)\n\nTimer.callLater(3, function()\n    ap.push(Ev.MCE_LANDING)\nend)',
            language: 'lua',
            theme: 'pioneer-dark', // Use custom theme
            automaticLayout: true,
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            minimap: { enabled: false },
            scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
            fixedOverflowWidgets: true, // Fix for hover overflowing hidden containers!
            suggest: {
                snippetsPreventQuickSuggestions: false
            }
        });
}

function getFullWordAtPosition(line: string, index: number) {
    // Look backward
    let start = index;
    while (start > 0 && /[\w.]/.test(line[start - 1])) start--;
    
    // Look forward
    let end = index;
    while (end < line.length && /[\w.]/.test(line[end])) end++;
    
    return line.substring(start, end);
}

export function getEditorValue(): string {
    if (window.getEditorValueFallback) return window.getEditorValueFallback();
    return editorInstance ? editorInstance.getValue() : '';
}

export function setEditorValue(val: string) {
    if (window.setEditorValueFallback) return window.setEditorValueFallback(val);
    if (editorInstance) editorInstance.setValue(val);
}

export function layoutEditor() {
    if (editorInstance) editorInstance.layout();
}
