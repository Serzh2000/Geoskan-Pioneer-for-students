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