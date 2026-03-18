
import { apiDocs, evConstants } from './api-docs.js';

let editorInstance;

export function initEditor() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        
        // 1. Enhanced Syntax Highlighting
        monaco.languages.setMonarchTokensProvider('lua', {
            tokenizer: {
                root: [
                    // Pioneer Modules
                    [/\b(ap|Sensors|Timer|Ledbar|camera|Gpio|Uart|Spi)\b/, "keyword.class"],
                    
                    // Pioneer Methods (generic matcher for simplicity, specific ones handled by autocomplete)
                    [/\b(push|goToLocalPoint|goToPoint|updateYaw|lpsPosition|lpsVelocity|accel|gyro|orientation|range|battery|tof|callLater|new|set|requestMakeShot|fromHSV)\b/, "function.call"],
                    
                    // Constants
                    [/\b(Ev)\.[A-Z_]+\b/, "constant"],
                    [/\b(Ev)\b/, "constant"],
                    
                    // Lua Keywords
                    [/\b(and|break|do|else|elseif|end|false|for|function|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/, "keyword"],
                    
                    // Comments
                    [/--\[\[[\s\S]*?(?:\]\]|$)/, 'comment'],
                    [/--.*$/, "comment"],
                    
                    // Strings
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
                    [/"([^"\\]|\\.)*"/, 'string'],
                    [/'([^'\\]|\\.)*$/, 'string.invalid'],
                    [/'([^'\\]|\\.)*'/, 'string'],
                    
                    // Numbers
                    [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
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
            provideHover: function(model, position) {
                const word = model.getWordAtPosition(position);
                if (!word) return;

                const line = model.getLineContent(position.lineNumber);
                
                // For Ev.MCE_LANDING, the word is 'MCE_LANDING', we need to check if 'Ev.' precedes it
                let fullWord = getFullWordAtPosition(line, position.column - 1);
                
                const doc = apiDocs[fullWord];
                if (doc) {
                    return {
                        range: new monaco.Range(position.lineNumber, line.indexOf(fullWord) + 1, position.lineNumber, line.indexOf(fullWord) + fullWord.length + 1),
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
            provideCompletionItems: function(model, position) {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                
                const suggestions = [];

                // API Methods suggestions
                for (const [key, doc] of Object.entries(apiDocs)) {
                    // Check if it's a module method (e.g. ap.push)
                    if (key.includes('.')) {
                        const [module, method] = key.split('.');
                        // Logic to suggest methods after dot
                        const lineContent = model.getLineContent(position.lineNumber);
                        const textBeforeCursor = lineContent.substring(0, position.column - 1);
                        
                        if (textBeforeCursor.trim().endsWith(module + '.')) {
                             suggestions.push({
                                label: method,
                                kind: monaco.languages.CompletionItemKind[doc.kind] || monaco.languages.CompletionItemKind.Method,
                                insertText: doc.insertText || method,
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: { value: doc.desc },
                                range: range
                            });
                        }
                    } else {
                        // Global functions or Modules
                        suggestions.push({
                            label: key,
                            kind: monaco.languages.CompletionItemKind[doc.kind] || monaco.languages.CompletionItemKind.Function,
                            insertText: doc.insertText || key,
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: { value: doc.desc },
                            range: range
                        });
                    }
                }

                // Suggest Modules if typing fresh
                const modules = ['ap', 'Sensors', 'Timer', 'Ledbar', 'camera', 'Gpio', 'Uart', 'Spi', 'Ev'];
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
                const lineContent = model.getLineContent(position.lineNumber);
                const textBeforeCursor = lineContent.substring(0, position.column - 1);
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
            suggest: {
                snippetsPreventQuickSuggestions: false
            }
        });
    });
}

function getFullWordAtPosition(line, index) {
    // Look backward
    let start = index;
    while (start > 0 && /[\w\.]/.test(line[start - 1])) start--;
    
    // Look forward
    let end = index;
    while (end < line.length && /[\w\.]/.test(line[end])) end++;
    
    return line.substring(start, end);
}

export function getEditorValue() {
    return editorInstance ? editorInstance.getValue() : '';
}

export function setEditorValue(val) {
    if (editorInstance) editorInstance.setValue(val);
}

export function layoutEditor() {
    if (editorInstance) editorInstance.layout();
}
