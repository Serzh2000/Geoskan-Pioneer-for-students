/**
 * Модуль рендеринга справочника API.
 * Генерирует HTML-разметку для отображения доступных Lua-функций,
 * событий и глобальных переменных, группируя их по категориям,
 * и встраивает во вкладку "Справочник API" в интерфейсе.
 */
import { apiDocs } from '../api-docs.js';
import { pythonApiDocs } from '../api-docs.js';

export function renderApiDocs(language: 'lua' | 'python' = 'lua') {
    const container = document.getElementById('api-docs');
    if (!container) return;

    const docs = language === 'python' ? pythonApiDocs : apiDocs;

    let html = '';
    
    // Group APIs by prefix
    const groups: Record<string, any[]> = {};
    for (const [name, doc] of Object.entries(docs)) {
        const prefix = name.includes('.') ? name.split('.')[0] : (name.startsWith('Ev.') ? 'Events' : 'Globals');
        let groupName = '';
        if (language === 'lua') {
            groupName = name.startsWith('Ev.')
                ? 'События (Ev.*)'
                : (prefix === 'Globals' ? 'Глобальные функции' : `Объект ${prefix}`);
        } else {
            groupName = prefix === 'Pioneer' ? 'Класс Pioneer' : (prefix === 'Camera' ? 'Класс Camera' : `Объект ${prefix}`);
        }
        
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push({ name, ...doc });
    }

    for (const [groupName, entries] of Object.entries(groups)) {
        html += `<div class="api-category-title">${groupName}</div>`;
        for (const entry of entries) {
            html += `
                <div class="api-entry">
                    <div class="api-header">
                        <span class="api-name">${entry.name}</span>
                        <span class="api-kind">${entry.kind || 'Method'}</span>
                    </div>
                    <div class="api-desc">${entry.desc}</div>
                    <div class="api-details">
                        ${entry.syntax ? `<div class="api-details-row"><span class="api-details-label">Синтаксис:</span><span class="api-details-value">${entry.syntax}</span></div>` : ''}
                        ${entry.params ? `<div class="api-details-row"><span class="api-details-label">Аргументы:</span><span class="api-details-value">${entry.params}</span></div>` : ''}
                        ${entry.returns ? `<div class="api-details-row"><span class="api-details-label">Возвращает:</span><span class="api-details-value">${entry.returns}</span></div>` : ''}
                    </div>
                    ${entry.example ? `<div class="api-example">${entry.example}</div>` : ''}
                </div>
            `;
        }
    }
    
    container.innerHTML = html;
}
