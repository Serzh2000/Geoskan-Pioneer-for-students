import { apiDocs } from '../api-docs.js';

export function setupHoverProvider(monaco: any) {
    monaco.languages.registerHoverProvider('lua', {
        provideHover: function(model: any, position: any) {
            const word = model.getWordAtPosition(position);
            if (!word) return;

            const line = model.getLineContent(position.lineNumber);
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
}

function getFullWordAtPosition(line: string, index: number) {
    let start = index;
    while (start > 0 && /[\w.]/.test(line[start - 1])) start--;
    
    let end = index;
    while (end < line.length && /[\w.]/.test(line[end])) end++;
    
    return line.substring(start, end);
}
