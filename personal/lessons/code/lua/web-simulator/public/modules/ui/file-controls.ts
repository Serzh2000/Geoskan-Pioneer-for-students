import type { UICallbacks } from './index.js';

export function initFileControls(callbacks: UICallbacks) {
    const fileSelector = document.getElementById('file-selector') as HTMLSelectElement | null;
    if (fileSelector) {
        fetch('/api/files')
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((files) => {
                fileSelector.innerHTML = '<option value="">Выберите файл...</option>';
                if (Array.isArray(files)) {
                    files.forEach((f: string) => {
                        const opt = document.createElement('option');
                        opt.value = f;
                        opt.textContent = f;
                        fileSelector.appendChild(opt);
                    });
                }
            })
            .catch((err) => {
                console.error('Failed to load file list:', err);
                fileSelector.innerHTML = '<option value="">Ошибка загрузки (API недоступно)</option>';
            });

        fileSelector.addEventListener('change', async (e: Event) => {
            const target = e.target as HTMLSelectElement;
            const path = target.value;
            if (!path || path.includes('Загрузка')) return;
            callbacks.onFileSelect(path);
        });
    }

    const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
    if (fileInput) {
        fileInput.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                if (evt.target?.result) {
                    callbacks.onLocalFileLoad(file.name, evt.target.result as string);
                }
            };
            reader.readAsText(file);
        });
    }
}
