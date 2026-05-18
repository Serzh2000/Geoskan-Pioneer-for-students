import { log } from '../shared/logging/logger.js';

export function registerGlobalErrorHandler(): void {
    window.onerror = function(message, source, lineno, colno, error) {
        const errorMsg = `[Global Error] ${message} at ${source}:${lineno}:${colno}`;
        console.error(errorMsg, error);
        log(errorMsg, 'error');
        return false;
    };
}
