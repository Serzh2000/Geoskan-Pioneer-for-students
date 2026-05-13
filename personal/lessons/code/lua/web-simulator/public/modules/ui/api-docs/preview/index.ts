import * as THREE from 'three';
import { createDroneModel } from '../../../drone-model/index.js';
import { renderPreviewScenario } from './scenarios.js';
import { createBeaconMarker, createLine, createTargetMarker, disposeSceneResources } from './scene.js';
import type { ApiPreviewRenderContext, ApiPreviewScenario, ApiPreviewViewMode } from './types.js';

export type { ApiPreviewScenario } from './types.js';

export class ApiMethodPreview {
    private readonly stage: HTMLElement | null;
    private readonly statusEl: HTMLElement | null;
    private readonly hintEl: HTMLElement | null;
    private readonly phaseEl: HTMLElement | null;

    private renderer: THREE.WebGLRenderer | null = null;
    private scene: THREE.Scene | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private drone: THREE.Group | null = null;
    private rotors: THREE.Object3D[] = [];
    private targetMarker: THREE.Group | null = null;
    private startMarker: THREE.Group | null = null;
    private headingArrow: THREE.ArrowHelper | null = null;
    private floorGlow: THREE.Mesh | null = null;
    private pathLine: THREE.Line | null = null;
    private guideLine: THREE.Line | null = null;
    private animationFrameId = 0;
    private lastFrameTs = 0;
    private startTs = 0;
    private destroyed = false;
    private viewMode: ApiPreviewViewMode = 'angled';
    private readonly handleResize = () => this.syncSize();

    constructor(
        private readonly root: HTMLElement,
        private readonly scenario: ApiPreviewScenario
    ) {
        this.stage = root.querySelector('[data-api-preview-stage]');
        this.statusEl = root.querySelector('[data-api-preview-status]');
        this.hintEl = root.querySelector('[data-api-preview-hint]');
        this.phaseEl = root.querySelector('[data-api-preview-phase]');
        this.init();
    }

    destroy(): void {
        this.destroyed = true;
        window.cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('resize', this.handleResize);
        disposeSceneResources(this.scene);
        this.renderer?.dispose();
        this.root.querySelector('[data-api-preview-stage]')?.replaceChildren();
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.drone = null;
        this.rotors = [];
        this.targetMarker = null;
        this.startMarker = null;
        this.headingArrow = null;
        this.floorGlow = null;
        this.pathLine = null;
        this.guideLine = null;
    }

    private init(): void {
        if (!this.stage) return;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.domElement.className = 'api-preview__canvas';
        this.stage.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 12);
        this.applyViewMode('angled');

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.85);
        const keyLight = new THREE.DirectionalLight(0xc4f1ff, 2.4);
        keyLight.position.set(1.4, -1.8, 2.5);
        const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.3);
        rimLight.position.set(-1.2, 1.35, 1.15);
        this.scene.add(ambientLight, keyLight, rimLight);

        this.drone = createDroneModel();
        this.drone.scale.setScalar(1.45);
        this.drone.position.z = 0.02;
        this.scene.add(this.drone);

        this.rotors = [0, 1, 2, 3]
            .map((index) => this.drone?.getObjectByName(`rotor_${index}`))
            .filter((rotor): rotor is THREE.Object3D => !!rotor);

        this.headingArrow = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0.15),
            0.34,
            0x38bdf8,
            0.11,
            0.06
        );
        this.headingArrow.visible = false;
        this.drone.add(this.headingArrow);

        this.floorGlow = new THREE.Mesh(
            new THREE.CircleGeometry(0.84, 64),
            new THREE.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: 0.3 })
        );
        this.floorGlow.position.z = -0.02;
        this.scene.add(this.floorGlow);

        const grid = new THREE.GridHelper(1.6, 8, 0x164e63, 0x0f172a);
        grid.rotation.x = Math.PI / 2;
        grid.position.z = -0.018;
        this.scene.add(grid);

        this.startMarker = createBeaconMarker(0xf59e0b, 0xfbbf24);
        this.startMarker.position.set(0, 0, 0);
        this.scene.add(this.startMarker);

        this.targetMarker = createTargetMarker();
        this.targetMarker.visible = false;
        this.scene.add(this.targetMarker);

        this.pathLine = createLine(0x38bdf8);
        this.pathLine.visible = false;
        this.scene.add(this.pathLine);

        this.guideLine = createLine(0xf59e0b);
        this.guideLine.visible = false;
        this.scene.add(this.guideLine);

        this.syncSize();
        window.addEventListener('resize', this.handleResize);
        this.animate();
    }

    private syncSize(): void {
        if (!this.stage || !this.renderer || !this.camera) return;

        const width = Math.max(220, this.stage.clientWidth);
        const height = Math.max(180, this.stage.clientHeight);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    private applyViewMode(mode: ApiPreviewViewMode): void {
        if (!this.camera) return;

        this.viewMode = mode;
        this.root.dataset.apiPreviewView = mode;
        this.camera.fov = mode === 'topdown' ? 16 : 30;

        if (mode === 'topdown') {
            this.camera.position.set(0, 0, 8.2);
            this.camera.up.set(0, 1, 0);
            this.camera.lookAt(0, 0, 0);
        } else {
            this.camera.position.set(0, -2.75, 1.18);
            this.camera.up.set(0, 0, 1);
            this.camera.lookAt(0, 0.02, 0.22);
        }

        this.camera.updateProjectionMatrix();
    }

    private animate = (): void => {
        if (this.destroyed || !this.renderer || !this.scene || !this.camera || !this.drone) return;

        const now = performance.now();
        if (!this.startTs) this.startTs = now;
        const dt = this.lastFrameTs ? Math.min((now - this.lastFrameTs) / 1000, 0.05) : 1 / 60;
        this.lastFrameTs = now;
        const elapsed = (now - this.startTs) / 1000;

        const status = renderPreviewScenario(this.getRenderContext(), this.scenario, elapsed, dt);
        if (this.statusEl) this.statusEl.textContent = status.title;
        if (this.hintEl) this.hintEl.textContent = status.detail;
        if (this.phaseEl) this.phaseEl.textContent = status.phase || status.title;

        this.syncSize();
        this.renderer.render(this.scene, this.camera);
        this.animationFrameId = window.requestAnimationFrame(this.animate);
    };

    private getRenderContext(): ApiPreviewRenderContext {
        return {
            drone: this.drone,
            targetMarker: this.targetMarker,
            startMarker: this.startMarker,
            headingArrow: this.headingArrow,
            floorGlow: this.floorGlow,
            pathLine: this.pathLine,
            guideLine: this.guideLine,
            resetScene: () => this.resetScene(),
            setViewMode: (mode) => this.applyViewMode(mode),
            setDronePose: (x, y, z, pitch, roll, yaw) => this.setDronePose(x, y, z, pitch, roll, yaw),
            spinRotors: (speed, dt) => this.spinRotors(speed, dt),
            updatePathLine: (points) => this.updatePathLine(points),
            updateGuideLine: (points, line) => this.updateGuideLine(points, line),
            clamp: (value) => this.clamp(value),
            easeInOut: (value) => this.easeInOut(value)
        };
    }

    private resetScene(): void {
        if (!this.drone || !this.targetMarker || !this.headingArrow || !this.floorGlow || !this.startMarker || !this.pathLine || !this.guideLine) return;

        this.drone.position.set(0, 0, 0.02);
        this.drone.rotation.order = 'ZYX';
        this.drone.rotation.set(0, 0, 0);
        this.drone.scale.setScalar(1.45);
        this.startMarker.visible = true;
        this.targetMarker.visible = false;
        this.targetMarker.position.set(0.52, 0.16, 0);
        this.targetMarker.scale.setScalar(1);
        this.applyViewMode('angled');
        this.headingArrow.visible = false;
        this.pathLine.visible = false;
        this.guideLine.visible = false;
        (this.floorGlow.material as THREE.MeshBasicMaterial).opacity = 0.3;
    }

    private setDronePose(x: number, y: number, z: number, pitch: number, roll: number, yaw: number): void {
        if (!this.drone) return;
        this.drone.position.set(x, y, z);
        this.drone.rotation.order = 'ZYX';
        this.drone.rotation.x = pitch;
        this.drone.rotation.y = roll;
        this.drone.rotation.z = yaw;
    }

    private spinRotors(speed: number, dt: number): void {
        for (const [index, rotor] of this.rotors.entries()) {
            const direction = index < 2 ? 1 : -1;
            rotor.rotation.z += speed * direction * dt * 5.5;
        }
    }

    private updatePathLine(points: THREE.Vector3[]): void {
        this.updateGuideLine(points, this.pathLine);
    }

    private updateGuideLine(points: THREE.Vector3[], line: THREE.Line | null = this.guideLine): void {
        if (!line) return;
        const geometry = line.geometry as THREE.BufferGeometry;
        geometry.setFromPoints(points);
        line.visible = true;
    }

    private clamp(value: number): number {
        return Math.min(1, Math.max(0, value));
    }

    private easeInOut(value: number): number {
        const t = this.clamp(value);
        return t * t * (3 - 2 * t);
    }
}
