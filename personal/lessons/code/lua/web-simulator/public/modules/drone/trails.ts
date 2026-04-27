import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { MAX_PATH_POINTS, pathPoints, simSettings } from '../core/state.js';
import { scene, droneTrails, is3DActive } from '../scene/scene-init.js';
import { log } from '../shared/logging/logger.js';

function getTracerColorHex() {
    const color = new THREE.Color(simSettings.tracerColor || '#38bdf8');
    return color.getHex();
}

function getTracerWidthPx() {
    return Math.max(1, Number(simSettings.tracerWidth) || 1);
}

function getTracerPointSize() {
    return Math.max(0.08, getTracerWidthPx() * 0.08);
}

function shouldShowTracerLine() {
    return simSettings.tracerShape === 'line' || simSettings.tracerShape === 'both';
}

function shouldShowTracerPoints() {
    return simSettings.tracerShape === 'points' || simSettings.tracerShape === 'both';
}

export function initTrailForDrone(id: string) {
    const lineGeometry = new LineGeometry();
    log(`[3D-INIT] Инициализация трейла для ${id}`, 'info');

    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_PATH_POINTS * 3);
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setDrawRange(0, 0);

    const colorHex = getTracerColorHex();
    const tracerWidth = getTracerWidthPx();

    const pathMat = new LineMaterial({
        color: colorHex,
        linewidth: tracerWidth,
        transparent: true,
        opacity: 0.9,
        depthTest: false,
        depthWrite: false
    });
    const path = new Line2(lineGeometry, pathMat);
    path.frustumCulled = false;
    path.renderOrder = 9000;
    path.visible = false;

    const particleMat = new THREE.PointsMaterial({
        color: colorHex,
        size: getTracerPointSize(),
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
    });
    const particles = new THREE.Points(pointsGeometry, particleMat);
    particles.frustumCulled = false;
    particles.visible = false;
    particles.renderOrder = 8999;

    scene.add(path);
    scene.add(particles);

    droneTrails[id] = { path, particles, lineGeometry, pointsGeometry };
    log(`[3D-INIT] Трейл для ${id} готов`, 'info');
}

export function disposeTrailForDrone(id: string) {
    if (!droneTrails[id]) return;
    scene.remove(droneTrails[id].path);
    scene.remove(droneTrails[id].particles);
    droneTrails[id].lineGeometry.dispose();
    droneTrails[id].pointsGeometry.dispose();
    (droneTrails[id].path.material as LineMaterial).dispose();
    (droneTrails[id].particles.material as THREE.PointsMaterial).dispose();
    delete droneTrails[id];
}

export function updateTrailForDrone(id: string) {
    if (!is3DActive || !droneTrails[id]) return;

    const pts = pathPoints[id] || [];
    const trail = droneTrails[id];

    if (simSettings.showTracer && pts.length > 1) {
        const pointPositions = trail.pointsGeometry.attributes.position.array as Float32Array;
        const linePositions = new Float32Array(pts.length * 3);
        for (let i = 0; i < pts.length; i++) {
            pointPositions[i * 3] = pts[i].x;
            pointPositions[i * 3 + 1] = pts[i].y;
            pointPositions[i * 3 + 2] = pts[i].z;

            linePositions[i * 3] = pts[i].x;
            linePositions[i * 3 + 1] = pts[i].y;
            linePositions[i * 3 + 2] = pts[i].z;
        }
        trail.pointsGeometry.setDrawRange(0, pts.length);
        trail.pointsGeometry.attributes.position.needsUpdate = true;
        trail.lineGeometry.setPositions(linePositions);
        trail.lineGeometry.computeBoundingSphere();

        const pathMat = trail.path.material as LineMaterial;
        const particleMat = trail.particles.material as THREE.PointsMaterial;

        const colorHex = getTracerColorHex();
        const tracerWidth = getTracerWidthPx();
        pathMat.color.setHex(colorHex);
        pathMat.linewidth = tracerWidth;
        particleMat.color.setHex(colorHex);
        particleMat.size = getTracerPointSize();

        trail.path.visible = shouldShowTracerLine();
        trail.particles.visible = shouldShowTracerPoints();

        if (linePositions.length >= 6) {
            trail.path.computeLineDistances();
        }
        trail.path.updateMatrixWorld(true);
        return;
    }

    trail.path.visible = false;
    trail.particles.visible = false;
}
