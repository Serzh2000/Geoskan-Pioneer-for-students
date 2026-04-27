import * as THREE from 'three';
import type { GamepadInputRef } from '../../core/state.js';
import { createDroneModel } from '../../drone-model/index.js';
import { getPrimaryChannelStickSlot, readRefNormalizedValue } from './channel-values.js';
import type { ChannelKey, PrimaryChannelKey } from './types.js';
import type { WizardStep } from './wizard-types.js';

type PreviewResolvers = {
    getCurrentStep: () => WizardStep;
    getDetectedRef: (channel: ChannelKey) => GamepadInputRef | null;
    getPreviewRef: (channel: ChannelKey) => GamepadInputRef | null;
    getChannelInversion: (channel: ChannelKey) => boolean;
};

export class WizardPreviewController {
    private renderer: THREE.WebGLRenderer | null = null;
    private scene: THREE.Scene | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private drone: THREE.Group | null = null;
    private rotors: THREE.Object3D[] = [];

    constructor(private readonly resolvers: PreviewResolvers) {}

    ensureScene(): void {
        const viewport = document.getElementById('gp-wizard-drone-viewport');
        if (!viewport || this.renderer) {
            this.syncSize();
            return;
        }

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.domElement.className = 'gp-wizard-drone-canvas';
        viewport.replaceChildren(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 10);
        this.camera.position.set(0, -1.95, 0.7);
        this.camera.lookAt(0, 0.02, 0.16);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
        const keyLight = new THREE.DirectionalLight(0xc4f1ff, 2.6);
        keyLight.position.set(1.4, -1.8, 2.4);
        const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.4);
        rimLight.position.set(-1.3, 1.4, 1.1);
        this.scene.add(ambientLight, keyLight, rimLight);

        this.drone = createDroneModel();
        this.drone.scale.setScalar(1.95);
        this.drone.position.z = 0.02;
        this.scene.add(this.drone);
        this.rotors = [0, 1, 2, 3]
            .map((index) => this.drone?.getObjectByName(`rotor_${index}`))
            .filter((rotor): rotor is THREE.Object3D => !!rotor);

        const floor = new THREE.Mesh(
            new THREE.CircleGeometry(0.58, 48),
            new THREE.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: 0.32 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.z = -0.02;
        this.scene.add(floor);

        this.syncSize();
        this.renderer.render(this.scene, this.camera);
    }

    syncSize(): void {
        const viewport = document.getElementById('gp-wizard-drone-viewport');
        if (!viewport || !this.renderer || !this.camera) return;
        const width = Math.max(180, viewport.clientWidth);
        const height = Math.max(180, viewport.clientHeight);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    update(gp: Gamepad): void {
        this.ensureScene();
        if (!this.renderer || !this.scene || !this.camera || !this.drone) return;

        const step = this.resolvers.getCurrentStep();
        const activeRefForCurrentStep = this.resolvers.getPreviewRef(step.channel);
        const roll = step.channel === 'roll'
            ? this.getCenteredPreviewValue(gp, 'roll', activeRefForCurrentStep)
            : 0;
        const pitch = step.channel === 'pitch'
            ? this.getCenteredPreviewValue(gp, 'pitch', activeRefForCurrentStep)
            : 0;
        const yaw = step.channel === 'yaw'
            ? this.getCenteredPreviewValue(gp, 'yaw', activeRefForCurrentStep)
            : 0;
        const throttle = step.channel === 'throttle'
            ? this.getThrottlePreviewValue(gp, activeRefForCurrentStep)
            : 0;

        this.drone.position.set(roll * 0.06, -pitch * 0.04, throttle * 0.32);
        this.drone.rotation.order = 'ZYX';
        this.drone.rotation.x = pitch * 0.4;
        this.drone.rotation.y = roll * 0.42;
        this.drone.rotation.z = -yaw * 0.55;

        const rotorSpeed = 0.28 + throttle * 0.85;
        for (const [index, rotor] of this.rotors.entries()) {
            rotor.rotation.z += rotorSpeed * (index < 2 ? 1 : -1);
        }

        this.renderer.render(this.scene, this.camera);
        this.updateStickVisuals(step, activeRefForCurrentStep, { roll, pitch, yaw, throttle });
    }

    private getCenteredPreviewValue(gp: Gamepad, channel: PrimaryChannelKey, liveOverride: GamepadInputRef | null): number {
        const ref = liveOverride ?? this.resolvers.getPreviewRef(channel);
        if (!ref) return 0;
        return readRefNormalizedValue(gp, ref, channel, this.resolvers.getChannelInversion(channel));
    }

    private getThrottlePreviewValue(gp: Gamepad, liveOverride: GamepadInputRef | null): number {
        const ref = liveOverride ?? this.resolvers.getPreviewRef('throttle');
        if (!ref) return 0;
        return readRefNormalizedValue(gp, ref, 'throttle', this.resolvers.getChannelInversion('throttle'));
    }

    private updateStickVisuals(
        step: WizardStep,
        liveRefForCurrentStep: GamepadInputRef | null,
        values: { roll: number; pitch: number; yaw: number; throttle: number }
    ): void {
        const leftStick = document.getElementById('gp-wizard-stick-left');
        const rightStick = document.getElementById('gp-wizard-stick-right');
        if (!leftStick || !rightStick) return;

        const slot = step.type === 'primary'
            ? getPrimaryChannelStickSlot(step.channel as PrimaryChannelKey, liveRefForCurrentStep)
            : null;
        const primaryChannel = step.type === 'primary' ? step.channel : null;
        let leftX = 0;
        let leftY = 0;
        let rightX = 0;
        let rightY = 0;

        switch (slot) {
            case 'left-x':
                leftX = primaryChannel === 'yaw' || primaryChannel === 'roll' ? values[primaryChannel] : 0;
                break;
            case 'left-y':
                leftY = primaryChannel === 'throttle'
                    ? (0.5 - values.throttle) * 56
                    : primaryChannel === 'pitch' ? -values.pitch * 28 : 0;
                break;
            case 'right-x':
                rightX = primaryChannel === 'yaw' || primaryChannel === 'roll' ? values[primaryChannel] : 0;
                break;
            case 'right-y':
                rightY = primaryChannel === 'throttle'
                    ? (0.5 - values.throttle) * 56
                    : primaryChannel === 'pitch' ? -values.pitch * 28 : 0;
                break;
        }

        leftStick.style.transform = `translate(${leftX * 28}px, ${leftY}px)`;
        rightStick.style.transform = `translate(${rightX * 28}px, ${rightY}px)`;
    }
}
