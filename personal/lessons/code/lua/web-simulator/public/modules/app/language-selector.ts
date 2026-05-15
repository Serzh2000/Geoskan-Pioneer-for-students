import { currentDroneId, currentScriptLanguage, drones, setCurrentScriptLanguage, type ScriptLanguage } from '../core/state.js';
import { renderMissionGuidePanel } from '../ui/mission-guide/panel.js';
import { renderApiDocs } from '../ui/api-docs/index.js';
import { log } from '../shared/logging/logger.js';
import { getEditorValue, setEditorLanguage, setEditorValue } from '../editor/index.js';

export function initScriptLanguageSelector(): void {
    const langSelect = document.getElementById('script-language-select') as HTMLSelectElement | null;
    if (!langSelect) return;

    langSelect.value = currentScriptLanguage;
    const drone = drones[currentDroneId];
    if (drone) {
        setEditorLanguage(currentScriptLanguage);
        const initialCode = currentScriptLanguage === 'lua' ? drone.script : drone.pythonScript;
        setEditorValue(initialCode);
        renderApiDocs(currentScriptLanguage);
        renderMissionGuidePanel(currentScriptLanguage);
    }

    langSelect.addEventListener('change', () => {
        const lang = langSelect.value as ScriptLanguage;
        const selectedDrone = drones[currentDroneId];
        if (!selectedDrone) return;

        const currentCode = getEditorValue();
        if (currentScriptLanguage === 'lua') {
            selectedDrone.script = currentCode;
        } else {
            selectedDrone.pythonScript = currentCode;
        }

        setCurrentScriptLanguage(lang);
        setEditorLanguage(lang);
        const code = lang === 'lua' ? selectedDrone.script : selectedDrone.pythonScript;
        setEditorValue(code);
        renderApiDocs(lang);
        renderMissionGuidePanel(lang);
        log(`Язык скрипта: ${lang.toUpperCase()}`, 'info');
    });
}
