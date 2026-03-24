/**
 * Модуль интерфейса настроек симулятора.
 * Инициализирует вкладку "Настройки", связывая чекбоксы и ползунки
 * с глобальным состоянием `simSettings`. Позволяет управлять отображением
 * трассера, гизмо трансформации и скоростью симуляции.
 */
import { simSettings } from '../state.js';

export function initSettingsUI() {
    const showTracerEl = document.getElementById('setting-show-tracer') as HTMLInputElement;
    const tracerColorEl = document.getElementById('setting-tracer-color') as HTMLInputElement;
    const tracerWidthEl = document.getElementById('setting-tracer-width') as HTMLInputElement;
    const tracerShapeEl = document.getElementById('setting-tracer-shape') as HTMLSelectElement;
    const showGizmoEl = document.getElementById('setting-show-gizmo') as HTMLInputElement;
    const simSpeedEl = document.getElementById('setting-sim-speed') as HTMLInputElement;
    const simSpeedVal = document.getElementById('sim-speed-val');

    if (showTracerEl) {
        showTracerEl.checked = simSettings.showTracer;
        showTracerEl.addEventListener('change', () => {
            simSettings.showTracer = showTracerEl.checked;
        });
    }

    if (tracerColorEl) {
        tracerColorEl.value = simSettings.tracerColor;
        tracerColorEl.addEventListener('input', () => {
            simSettings.tracerColor = tracerColorEl.value;
        });
    }

    if (tracerWidthEl) {
        tracerWidthEl.value = simSettings.tracerWidth.toString();
        tracerWidthEl.addEventListener('input', () => {
            simSettings.tracerWidth = parseFloat(tracerWidthEl.value);
        });
    }

    if (tracerShapeEl) {
        tracerShapeEl.value = simSettings.tracerShape;
        tracerShapeEl.addEventListener('change', () => {
            simSettings.tracerShape = tracerShapeEl.value;
        });
    }

    if (showGizmoEl) {
        showGizmoEl.checked = simSettings.showGizmo;
        showGizmoEl.addEventListener('change', () => {
            simSettings.showGizmo = showGizmoEl.checked;
        });
    }

    if (simSpeedEl && simSpeedVal) {
        simSpeedEl.value = simSettings.simSpeed.toString();
        simSpeedVal.textContent = simSettings.simSpeed.toFixed(1) + 'x';
        simSpeedEl.addEventListener('input', () => {
            simSettings.simSpeed = parseFloat(simSpeedEl.value);
            simSpeedVal.textContent = simSettings.simSpeed.toFixed(1) + 'x';
        });
    }
}
