import * as THREE from 'three';
import { simSettings, type GamepadInputRef } from '../../state.js';
import { createDroneModel } from '../../drone-model.js';
import { normalizeCenteredAxis, normalizeThrottleAxis } from './calibration.js';
import type { ChannelKey, PrimaryChannelKey } from './types.js';
import type { WizardStep } from './wizard-types.js';

type PreviewResolvers = {
    getCurrentStep: () => WizardStep;
    getDetectedRef: (channel: ChannelKey) => GamepadInputRef | null;
    getStoredMappingRef: (channel: ChannelKey) => GamepadInputRef | null;
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
        const liveRefForCurrentStep = this.resolvers.getDetectedRef(step.channel);
        const roll = step.channel === 'roll'
            ? this.getChannelPreviewValue(gp, 'roll', liveRefForCurrentStep)
            : 0;
        const pitch = step.channel === 'pitch'
            ? this.getChannelPreviewValue(gp, 'pitch', liveRefForCurrentStep)
            : 0;
        const yaw = step.channel === 'yaw'
            ? this.getChannelPreviewValue(gp, 'yaw', liveRefForCurrentStep)
            : 0;
        const throttle = step.channel === 'throttle'
            ? this.getThrottlePreviewValue(gp, liveRefForCurrentStep)
            : 0;

        this.drone.position.set(roll * 0.06, -pitch * 0.04, throttle * 0.32);
        this.drone.rotation.order = 'ZYX';
        this.drone.rotation.x = pitch * 0.4;
        this.drone.rotation.y = roll * 0.42;
        this.drone.rotation.z = yaw * 0.55;

        const rotorSpeed = 0.28 + throttle * 0.85;
        for (const [index, rotor] of this.rotors.entries()) {
            rotor.rotation.z += rotorSpeed * (index < 2 ? 1 : -1);
        }

        this.renderer.render(this.scene, this.camera);
        this.updateStickVisuals({ roll, pitch, yaw, throttle });
    }

    private getChannelPreviewValue(gp: Gamepad, channel: PrimaryChannelKey, liveOverride: GamepadInputRef | null): number {
        const ref = liveOverride ?? this.resolvers.getDetectedRef(channel);
        if (!ref) return 0;
        return this.getNormalizedRefValue(gp, ref, channel);
    }

    private getThrottlePreviewValue(gp: Gamepad, liveOverride: GamepadInputRef | null): number {
        const ref = liveOverride ?? this.resolvers.getDetectedRef('throttle');
        if (!ref) return 0;
        const value = this.getNormalizedRefValue(gp, ref, 'throttle');
        return Math.max(0, Math.min(1, (value + 1) / 2));
    }

    private getNormalizedRefValue(gp: Gamepad, ref: GamepadInputRef, channel: ChannelKey): number {
        const index = Number(ref.slice(1));
        const isInverted = this.resolvers.getChannelInversion(channel);
        if (ref.startsWith('b')) {
            const buttonValue = Math.max(0, Math.min(1, gp.buttons[index]?.value ?? 0));
            if (channel === 'throttle') {
                const normalizedThrottle = isInverted ? 1 - buttonValue : buttonValue;
                return normalizedThrottle * 2 - 1;
            }
            const centeredButton = buttonValue * 2 - 1;
            return isInverted ? -centeredButton : centeredButton;
        }

        const rawValue = gp.axes[index] ?? 0;
        if (channel === 'throttle') {
            const normalized = normalizeThrottleAxis(simSettings.gamepadCalibration, rawValue, index);
            const normalizedThrottle = isInverted ? 1 - normalized : normalized;
            return normalizedThrottle * 2 - 1;
        }

        const centered = normalizeCenteredAxis(simSettings.gamepadCalibration, rawValue, index);
        return isInverted ? -centered : centered;
    }

    private updateStickVisuals(values: { roll: number; pitch: number; yaw: number; throttle: number }): void {
        const leftStick = document.getElementById('gp-wizard-stick-left');
        const rightStick = document.getElementById('gp-wizard-stick-right');
        if (!leftStick || !rightStick) return;

        const leftX = values.yaw * 28;
        const leftY = (0.5 - values.throttle) * 56;
        const rightX = values.roll * 28;
        const rightY = -values.pitch * 28;

        leftStick.style.transform = `translate(${leftX}px, ${leftY}px)`;
        rightStick.style.transform = `translate(${rightX}px, ${rightY}px)`;
    }
}
