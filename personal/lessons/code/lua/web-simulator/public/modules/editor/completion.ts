import { apiDocs, evConstants, pythonApiDocs } from '../api-docs.js';

export function setupCompletionProvider(monaco: any) {
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

    // Python completion: подсказываем методы Pioneer/Camera при вводе после точки.
    monaco.languages.registerCompletionItemProvider('python', {
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
            const normalized = textBeforeCursor.trim();

            const methodDocs = Object.entries(pythonApiDocs as Record<string, any>)
                .filter(([key]) => key.includes('.'))
                .map(([key, doc]: [string, any]) => {
                    const method = key.split('.').slice(-1)[0];
                    return { method, key, doc };
                });

            // Если курсор после точки (пример: "pioneer_mini.")
            if (normalized.endsWith('.')) {
                methodDocs.forEach(({ method, doc }) => {
                    suggestions.push({
                        label: method,
                        kind: (monaco.languages.CompletionItemKind as any)[doc.kind] || monaco.languages.CompletionItemKind.Method,
                        insertText: doc.insertText || method,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: { value: doc.desc || '' },
                        range: range
                    });
                });
            } else {
                // Предложим ключевые классы.
                ['Pioneer', 'Camera', 'VideoStream', 'time'].forEach((cls) => {
                    suggestions.push({
                        label: cls,
                        kind: monaco.languages.CompletionItemKind.Module,
                        insertText: cls,
                        documentation: 'Pioneer SDK',
                        range: range
                    });
                });

                // И чуть-чуть подсказок для конструктора/часто используемых функций.
                if (normalized.length === 0) {
                    suggestions.push({
                        label: 'pioneer',
                        kind: monaco.languages.CompletionItemKind.Variable,
                        insertText: 'pioneer',
                        documentation: 'Instance of Pioneer',
                        range: range
                    });
                }
            }

            return { suggestions: suggestions };
        },
        triggerCharacters: ['.']
    });
}
