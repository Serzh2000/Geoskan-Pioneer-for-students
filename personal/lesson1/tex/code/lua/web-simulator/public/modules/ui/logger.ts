export function log(msg: string, type: 'info'|'error'|'warn'|'success' = 'info') {
    const logs = document.getElementById('logs');
    if (logs) {
        const time = new Date().toLocaleTimeString('ru-RU', { hour12: false });
        
        // Удаляем префиксы для чистоты дизайна
        let cleanMsg = msg;
        if (msg.startsWith('AP:')) cleanMsg = msg.replace('AP:', '');
        else if (msg.startsWith('[3D]')) cleanMsg = msg.replace('[3D]', '');
        else if (msg.startsWith('[3DDBG]')) cleanMsg = msg.replace('[3DDBG]', '');
        else if (msg.startsWith('[Lua AP]')) cleanMsg = msg.replace('[Lua AP]', '');
        else if (msg.startsWith('[Lua Timer]')) cleanMsg = msg.replace('[Lua Timer]', '');
        else if (msg.startsWith('[Lua]')) cleanMsg = msg.replace('[Lua]', '');
        else if (msg.startsWith('[Physics]')) cleanMsg = msg.replace('[Physics]', '');
        
        const line = document.createElement('div');
        line.className = `log-line log-${type}`;
        line.innerHTML = `<span class="log-time">[${time}]</span> ${cleanMsg}`;
        logs.appendChild(line);
        logs.scrollTop = logs.scrollHeight;
    }
}