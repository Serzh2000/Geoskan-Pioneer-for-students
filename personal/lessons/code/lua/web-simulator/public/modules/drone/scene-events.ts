import { log } from '../ui/logger.js';
import { renderer, selectedObject, transformControl } from '../scene/scene-init.js';
import { onPointerDown, onPointerUp } from '../scene/input.js';
import { handleDeselection } from '../scene/selection.js';
import { activateTransformMode, deleteSelectedObject } from '../scene/object-manager.js';

let scenePointerDownCaptureHandler: ((event: PointerEvent) => void) | null = null;
let scenePointerUpCaptureHandler: ((event: PointerEvent) => void) | null = null;

function isScenePointerEvent(event: PointerEvent) {
    if (!renderer?.domElement) return false;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    return path.includes(renderer.domElement) || event.target === renderer.domElement;
}

export function registerScenePointerHandlers() {
    if (!renderer?.domElement) return;

    if (scenePointerDownCaptureHandler) {
        document.removeEventListener('pointerdown', scenePointerDownCaptureHandler, true);
    }
    if (scenePointerUpCaptureHandler) {
        document.removeEventListener('pointerup', scenePointerUpCaptureHandler, true);
    }

    scenePointerDownCaptureHandler = (event: PointerEvent) => {
        if (!isScenePointerEvent(event)) return;
        log(`[3D-CLICK] document capture pointerdown target=${(event.target as HTMLElement | null)?.tagName || 'unknown'}`, 'info');
        onPointerDown(event);
    };

    scenePointerUpCaptureHandler = (event: PointerEvent) => {
        if (!isScenePointerEvent(event)) return;
        log(`[3D-CLICK] document capture pointerup target=${(event.target as HTMLElement | null)?.tagName || 'unknown'}`, 'info');
        onPointerUp(event);
    };

    document.addEventListener('pointerdown', scenePointerDownCaptureHandler, true);
    document.addEventListener('pointerup', scenePointerUpCaptureHandler, true);
}

export function handleSceneKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target.closest && target.closest('.monaco-editor'))) return;

    if (event.key.toLowerCase() === 'escape') {
        if (transformControl?.object || selectedObject) handleDeselection();
        return;
    }

    if (!selectedObject) return;

    switch (event.key.toLowerCase()) {
        case 'delete':
        case 'backspace':
            deleteSelectedObject();
            break;
        case 't':
            activateTransformMode('translate', selectedObject);
            break;
        case 'r':
            activateTransformMode('rotate', selectedObject);
            break;
        case 's':
            activateTransformMode('scale', selectedObject);
            break;
    }
}
