import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LUA_DIR = path.resolve(__dirname, '../../../../../../lessons/code/lua');

function processLuaFile(filePath: string, relPath: string) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // 1. Убираем LDoc шапку
    const lines = content.split('\n');
    if (lines[0].startsWith('---') && lines[1].startsWith('-- @module')) {
        lines.splice(0, 5); // Удаляем 5 строк шапки
        content = lines.join('\n');
        modified = true;
    }

    // 2. Откатываем префиксы Ev.
    const EVENT_CONSTANTS = [
        'MCE_PREFLIGHT', 'MCE_TAKEOFF', 'MCE_LANDING',
        'ENGINES_DISARM', 'TAKEOFF_COMPLETE', 'POINT_REACHED',
        'COPTER_LANDED', 'SHOCK', 'LOW_VOLTAGE1', 'LOW_VOLTAGE2'
    ];

    EVENT_CONSTANTS.forEach(evt => {
        // Ищем Ev.EVENT и меняем обратно на EVENT, но только если это не объявление таблицы
        const regex = new RegExp(`Ev\\.${evt}`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, evt);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`[RESTORED] ${relPath}`);
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

console.log('Откат изменений в Lua-скриптах...');
walkDir(LUA_DIR);
console.log('Откат завершен.');
