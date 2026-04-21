import * as THREE from 'three';
import { log } from '../ui/logger.js';
import { pointerDownPos, isHittingGizmo, transformControl, controls, raycaster, mouse, camera, droneMeshes, selectedObject, renderer, focusOrbitControlsOnObject } from './scene-init.js';
import { currentDroneId, simState } from '../state.js';
import { envGroup } from '../environment.js';
import { handleDeselection, deselectObject, exitTransformMode } from './selection.js';
import { updateTransformModeDecorations } from './transform.js';
import {
    deleteSelectedObject,
    duplicateObject,
    resetDroneToOrigin,
    activateTransformMode,
    isTransformableObject,
    rememberSelectedObjectInitialTransform,
    getRotationStepDegrees,
    resetSelectedObjectToInitialTransform,
    rotateSelectedObjectByDegrees,
    setRotationStepDegrees
} from './object-manager.js';

const groundPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const CLICK_TRACE_PREFIX = '[3D-CLICK]';

function traceClick(message: string, level: 'info' | 'warn' = 'info') {
    const fullMessage = `${CLICK_TRACE_PREFIX} ${message}`;
    if (level === 'warn') console.warn(fullMessage);
    else console.debug(fullMessage);
    log(fullMessage, level);
}

function getRootSceneObject(object: THREE.Object3D) {
    let current: THREE.Object3D | null = object;
    while (current?.parent && current.parent !== (window as any).scene && current.parent !== envGroup) {
        current = current.parent;
    }
    return current || object;
}

function isGroundObject(object: THREE.Object3D | null | undefined) {
    let current: THREE.Object3D | null | undefined = object;
    while (current) {
        if (current.name === 'Ground' || current.userData?.type === 'ground') return true;
        current = current.parent;
    }
    return false;
}

function isDroneObject(object: THREE.Object3D | null | undefined) {
    if (!object) return false;
    for (const id in droneMeshes) {
        if (object === droneMeshes[id]) return true;
    }
    return false;
}

function getGroundPointFromPointer() {
    const point = new THREE.Vector3();
    return raycaster.ray.intersectPlane(groundPlane, point) ? point : null;
}

function createGroundPointLabel(text: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(12, 12, canvas.width - 24, canvas.height - 24, 18);
        ctx.fill();
        ctx.stroke();
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2.8, 0.7, 1);
    sprite.renderOrder = 9501;
    return { sprite, texture, material };
}

function showGroundPoint(point: THREE.Vector3) {
    const labelText = `X: ${point.x.toFixed(2)}  Y: ${point.y.toFixed(2)}  Z: ${point.z.toFixed(2)}`;
    log(`Координаты точки на земле: ${labelText}`, 'info');

    const markerGeom = new THREE.SphereGeometry(0.08, 20, 20);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.95 });
    const marker = new THREE.Mesh(markerGeom, markerMat);
    marker.position.copy(point);
    marker.renderOrder = 9500;
    (window as any).scene.add(marker);

    const { sprite, texture, material } = createGroundPointLabel(labelText);
    sprite.position.copy(point).add(new THREE.Vector3(0, 0, 0.45));
    (window as any).scene.add(sprite);

    const startedAt = performance.now();
    const visibleMs = 5000;
    const fadeMs = 700;

    const fade = window.setInterval(() => {
        const elapsed = performance.now() - startedAt;
        const fadeProgress = Math.max(0, Math.min(1, (elapsed - visibleMs) / fadeMs));
        const opacity = 0.95 * (1 - fadeProgress);

        if (elapsed >= visibleMs + fadeMs) {
            window.clearInterval(fade);
            marker.removeFromParent();
            sprite.removeFromParent();
            marker.geometry.dispose();
            markerMat.dispose();
            material.dispose();
            texture.dispose();
            return;
        }

        marker.scale.multiplyScalar(elapsed < visibleMs ? 1.01 : 1.03);
        markerMat.opacity = opacity;
        sprite.position.z += elapsed < visibleMs ? 0.0015 : 0.01;
        material.opacity = opacity;
    }, 40);
}

function getObjectDisplayName(obj: THREE.Object3D) {
    return obj.name || obj.userData?.type || obj.type || 'Объект';
}

function showTransformUi(obj: THREE.Object3D, preferredMode?: 'translate' | 'rotate' | 'scale') {
    if (!transformControl || !isTransformableObject(obj) || simState.running) return;
    const activeMode = preferredMode || (transformControl.object === obj ? transformControl.getMode() : 'translate');
    traceClick(`activate gizmo mode=${activeMode} for ${getObjectDisplayName(obj)}`);
    activateTransformMode(activeMode, obj);
    if (controls) controls.enabled = (window as any).cameraMode === 'free' && !(window as any).isTransforming;
    if ((window as any).showGizmoToolbar) {
        traceClick('showGizmoToolbar is available, rendering toolbar');
        (window as any).showGizmoToolbar(
            getObjectDisplayName(obj),
            transformControl?.getMode?.() || activeMode,
            getRotationStepDegrees(),
            (mode: string) => {
                const target = selectedObject || obj;
                if (!target || !target.parent) return;
                showTransformUi(target, mode as 'translate' | 'rotate' | 'scale');
            },
            (step: number) => {
                setRotationStepDegrees(step);
            },
            (axis: 'x' | 'y' | 'z', direction: 1 | -1) => {
                rotateSelectedObjectByDegrees(axis, direction * getRotationStepDegrees());
            },
            () => {
                resetSelectedObjectToInitialTransform();
            },
            () => handleDeselection()
        );
    }
}

function hideTransformUiPreserveSelection() {
    exitTransformMode();
    updateTransformModeDecorations(null);
    if (controls) controls.enabled = (window as any).cameraMode === 'free' && !(window as any).isTransforming;
}

export function onPointerDown(event: PointerEvent) {
    pointerDownPos.set(event.clientX, event.clientY);
    traceClick(`pointerdown button=${event.button} x=${event.clientX} y=${event.clientY}`);
    if (!transformControl) return;
    (window as any).isHittingGizmo = transformControl.dragging || (transformControl as any).axis !== null;
    traceClick(`pointerdown gizmo dragging=${transformControl.dragging} axis=${String((transformControl as any).axis)} hit=${String((window as any).isHittingGizmo)}`);
}

export function onPointerUp(event: PointerEvent) {
    traceClick(`pointerup button=${event.button} x=${event.clientX} y=${event.clientY} cameraMode=${String((window as any).cameraMode)}`);
    if (simState.running && (window as any).cameraMode === 'fpv') {
        traceClick('pointerup ignored: fpv mode while simulation is running', 'warn');
        return;
    }
    if (!renderer || !camera || !transformControl || !raycaster) {
        traceClick(`pointerup ignored: missing renderer=${String(!!renderer)} camera=${String(!!camera)} transformControl=${String(!!transformControl)} raycaster=${String(!!raycaster)}`, 'warn');
        return;
    }
    
    if ((window as any).isHittingGizmo || transformControl.dragging || (transformControl as any).axis !== null) {
        traceClick(`pointerup ignored: gizmo interaction hit=${String((window as any).isHittingGizmo)} dragging=${String(transformControl.dragging)} axis=${String((transformControl as any).axis)}`, 'warn');
        (window as any).isHittingGizmo = false;
        return;
    }

    const dist = pointerDownPos.distanceTo(new THREE.Vector2(event.clientX, event.clientY));
    traceClick(`pointerup delta=${dist.toFixed(2)}`);
    if (dist > 5) {
        traceClick(`pointerup ignored: pointer moved too far (${dist.toFixed(2)})`, 'warn');
        return;
    }

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    traceClick(`normalized pointer x=${mouse.x.toFixed(3)} y=${mouse.y.toFixed(3)} rect=${rect.width.toFixed(0)}x${rect.height.toFixed(0)}`);

    raycaster.setFromCamera(mouse, camera);
    
    const targets: THREE.Object3D[] = [];
    for (const id in droneMeshes) {
        if (droneMeshes[id]) targets.push(droneMeshes[id]);
    }
    if (envGroup) {
        for (const child of envGroup.children) {
            if (child.visible) targets.push(child);
        }
    }
    const ground = (window as any).scene ? (window as any).scene.getObjectByName('Ground') : null;
    if (ground) targets.push(ground);
    traceClick(`raycast targets=${targets.length} envChildren=${envGroup ? envGroup.children.length : 0} ground=${String(!!ground)}`);
    
    try {
        const intersects = raycaster.intersectObjects(targets, true);
        traceClick(`raycast intersects=${intersects.length}${intersects.length ? ` first=${intersects.slice(0, 4).map((hit) => `${hit.object.name || hit.object.type}:${hit.distance.toFixed(2)}`).join(', ')}` : ''}`);
        let groundPoint: THREE.Vector3 | null = null;

        if (intersects.length > 0) {
            for (const intersect of intersects) {
                const rootObject = getRootSceneObject(intersect.object);

                if (isGroundObject(intersect.object) || isGroundObject(rootObject)) {
                    traceClick(`ground intersect object=${intersect.object.name || intersect.object.type} point=${intersect.point.x.toFixed(2)},${intersect.point.y.toFixed(2)},${intersect.point.z.toFixed(2)}`);
                    if (!groundPoint) groundPoint = intersect.point.clone();
                    continue;
                }

                if (isDroneObject(rootObject) || isTransformableObject(rootObject)) {
                    traceClick(`selectable intersect object=${getObjectDisplayName(rootObject)} showMenu=true`);
                    handleSelection(rootObject, event.clientX, event.clientY, true);
                    return;
                }

                if (!groundPoint && Math.abs(intersect.point.z) <= 0.25) {
                    traceClick(`fallback near-ground point from ${intersect.object.name || intersect.object.type}`);
                    groundPoint = intersect.point.clone();
                }
            }
        }

        if (!groundPoint) {
            groundPoint = getGroundPointFromPointer();
            traceClick(groundPoint
                ? `plane intersection point=${groundPoint.x.toFixed(2)},${groundPoint.y.toFixed(2)},${groundPoint.z.toFixed(2)}`
                : 'plane intersection not found',
            groundPoint ? 'info' : 'warn');
        }
        if (groundPoint) {
            traceClick('show ground coordinates and deselect current object');
            showGroundPoint(groundPoint);
            handleDeselection();
            return;
        }
    } catch (e) {
        console.warn('[3D] Raycasting failed:', e);
        traceClick(`raycast failed: ${e instanceof Error ? e.message : String(e)}`, 'warn');
    }

    traceClick('nothing selected and no ground point found, deselecting', 'warn');
    handleDeselection();
}

export function handleSelection(obj: THREE.Object3D, x: number, y: number, showMenu = false, focusCamera = true) {
    const isSameObject = selectedObject === obj;
    traceClick(`handleSelection object=${getObjectDisplayName(obj)} same=${String(isSameObject)} showMenu=${String(showMenu)}`);
    if (selectedObject && !isSameObject) deselectObject();
    if (!isSameObject) rememberSelectedObjectInitialTransform(obj);

    (window as any).setSelectedObject(obj);
    
    const emissiveColor = new THREE.Color(0x38bdf8);
    obj.traverse((node: any) => {
        if (node.isMesh && node.material) {
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach((mat: any) => {
                if (mat.emissive) {
                    if (mat.userData.originalEmissive === undefined) {
                        mat.userData.originalEmissive = mat.emissive.getHex();
                    }
                    mat.emissive.copy(emissiveColor);
                    mat.emissiveIntensity = 0.6;
                }
            });
        }
    });

    if ((window as any).selectionHelper) {
        (window as any).selectionHelper.setFromObject(obj);
        (window as any).selectionHelper.visible = true;
    }

    if (focusCamera) {
        focusOrbitControlsOnObject(obj);
    }

    const transformable = isDroneObject(obj) || isTransformableObject(obj);
    if (showMenu) {
        hideTransformUiPreserveSelection();
    } else if (transformable && !simState.running) {
        showTransformUi(obj);
    } else if ((window as any).hideGizmoToolbar) {
        traceClick(`gizmo toolbar hidden transformable=${String(transformable)} simRunning=${String(simState.running)}`);
        (window as any).hideGizmoToolbar();
    }

    if (showMenu && (window as any).showContextMenu) {
        const isDrone = isDroneObject(obj);
        traceClick(`showContextMenu for ${getObjectDisplayName(obj)} at x=${x} y=${y} isDrone=${String(isDrone)}`);

        (window as any).showContextMenu(x, y, 
            (mode: string) => {
                const target = selectedObject;
                if (!target || !target.parent) return;
                showTransformUi(target, mode as 'translate' | 'rotate' | 'scale');
            },
            () => deleteSelectedObject(),
            () => duplicateObject(),
            isDrone ? () => resetDroneToOrigin() : undefined
        );
    } else if (showMenu) {
        traceClick('showMenu requested but window.showContextMenu is unavailable', 'warn');
    }
}
