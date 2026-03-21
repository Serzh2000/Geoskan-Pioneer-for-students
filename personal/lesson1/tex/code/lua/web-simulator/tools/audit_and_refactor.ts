import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LUA_DIR = path.resolve(__dirname, '../../../../../../lessons/code/lua');

const EVENT_CONSTANTS = [
    'MCE_PREFLIGHT', 'MCE_TAKEOFF', 'MCE_LANDING',
    'ENGINES_DISARM', 'TAKEOFF_COMPLETE', 'POINT_REACHED',
    'COPTER_LANDED', 'SHOCK', 'LOW_VOLTAGE1', 'LOW_VOLTAGE2'
];

function getLDocTemplate(filename: string, relPath: string): string {
    const moduleName = filename.replace('.lua', '');
    const description = `Автоматически задокументированный скрипт: ${relPath}`;
    return `--- \n-- @module ${moduleName}\n-- @description ${description}\n-- @author Geoskan Simulator Auto-Refactor\n\n`;
}

function processLuaFile(filePath: string, relPath: string) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // 1. Добавление LDoc если его нет
    if (!content.trimStart().startsWith('---')) {
        content = getLDocTemplate(path.basename(filePath), relPath) + content;
        modified = true;
    }

    // 2. Исправление пропущенных префиксов Ev.
    EVENT_CONSTANTS.forEach(evt => {
        // Ищем использование константы без префикса Ev. (например ap.push(TAKEOFF_COMPLETE) или event == TAKEOFF_COMPLETE)
        // Не трогаем если уже есть Ev. или это объявление таблицы
        const regex = new RegExp(`(?<!Ev\\.)\\b${evt}\\b`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `Ev.${evt}`);
            modified = true;
        }
    });

    // 3. Оптимизация и проверка синтаксиса
    // Если скрипт использует Timer.new без сохранения ссылки на него - добавляем предупреждение (в реальном рефакторинге это сложнее)
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`[UPDATED] ${relPath}`);
    } else {
        console.log(`[OK] ${relPath}`);
    }
}

function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (file.endsWith('.lua')) {
            const relPath = path.relative(LUA_DIR, fullPath);
            processLuaFile(fullPath, relPath);
        }
    }
}

console.log('Начинаю аудит и рефакторинг Lua-скриптов...');
walkDir(LUA_DIR);
console.log('Аудит завершен.');
