import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
// Используем fengari-web, так как он уже установлен
import { fengari } from 'fengari-web';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LUA_DIR = path.resolve(__dirname, '../../../../../../lessons/code/lua');

let totalFiles = 0;
let passedFiles = 0;
let failedFiles = 0;

function runLuaTest(filePath: string, relPath: string) {
    totalFiles++;
    const content = fs.readFileSync(filePath, 'utf-8');
    
    try {
        // Инициализируем стейт Lua
        const L = fengari.lauxlib.luaL_newstate();
        fengari.lualib.luaL_openlibs(L);

        // Мокаем базовые API
        const mockCode = `
            ap = { push = function() end, goToLocalPoint = function() end, updateYaw = function() end }
            Timer = { callLater = function() end, new = function() return {start=function() end, stop=function() end} end }
            Ledbar = { new = function() return {set=function() end} end }
            Sensors = { rc = function() return 0 end, lpsPosition = function() return 0,0,0 end }
            Ev = { MCE_PREFLIGHT=1, MCE_TAKEOFF=2, MCE_LANDING=3, ENGINES_DISARM=4, TAKEOFF_COMPLETE=5, POINT_REACHED=6 }
        `;
        fengari.lauxlib.luaL_dostring(L, fengari.to_luastring(mockCode));

        // Проверяем компиляцию/запуск
        const loadStatus = fengari.lauxlib.luaL_loadstring(L, fengari.to_luastring(content));
        
        if (loadStatus !== fengari.lua.LUA_OK) {
            const error = fengari.lua.lua_tojsstring(L, -1);
            console.error(`[FAIL] ${relPath} - Ошибка синтаксиса: ${error}`);
            failedFiles++;
        } else {
            // Попробуем выполнить скрипт (собрать функции и переменные)
            const runStatus = fengari.lua.lua_pcall(L, 0, 0, 0);
            if (runStatus !== fengari.lua.LUA_OK) {
                const error = fengari.lua.lua_tojsstring(L, -1);
                console.warn(`[WARN] ${relPath} - Ошибка выполнения: ${error}`);
                passedFiles++; 
            } else {
                console.log(`[PASS] ${relPath}`);
                passedFiles++;
            }
        }
    } catch (e) {
        console.error(`[CRASH] ${relPath} - Ошибка Node.js: ${e}`);
        failedFiles++;
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
            runLuaTest(fullPath, relPath);
        }
    }
}

console.log('Начинаю запуск юнит-тестов Lua-скриптов...');
walkDir(LUA_DIR);
console.log('--- Результаты тестов ---');
console.log(`Всего файлов: ${totalFiles}`);
console.log(`Успешно скомпилировано (PASS/WARN): ${passedFiles} (${Math.round((passedFiles/totalFiles)*100)}%)`);
console.log(`Ошибок синтаксиса (FAIL): ${failedFiles}`);
