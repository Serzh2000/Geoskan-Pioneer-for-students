
const logs = document.getElementById('logs');

export function log(msg: string, type: 'info' | 'error' | 'warn' | 'success' = 'info') {
    if (!logs) return;
    const div = document.createElement('div');
    div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    if (type === 'error') div.className = 'log-error';
    if (type === 'warn') div.className = 'log-warn';
    if (type === 'success') div.className = 'log-success';
    logs.appendChild(div);
    logs.scrollTop = logs.scrollHeight;
}

export function luaToStr(luaVal: any, L: any): string {
    if (luaVal === null || luaVal === undefined) {
        if (L) {
            const top = window.fengari.lua.lua_gettop(L);
            if (top > 0) {
                const s = window.fengari.lua.lua_tostring(L, -1);
                if (s) return window.fengari.to_jsstring(s);
            }
        }
        return "Unknown Lua Error (no message)";
    }
    try {
        const str = window.fengari.to_jsstring(luaVal);
        return str || "Empty Lua Error message";
    } catch (e) {
        return "Lua Error (type: " + typeof luaVal + "): " + String(luaVal);
    }
}
