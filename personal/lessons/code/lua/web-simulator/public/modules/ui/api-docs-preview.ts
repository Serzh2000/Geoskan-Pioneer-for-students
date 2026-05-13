import * as THREE from 'three';
import { createDroneModel } from '../drone-model/index.js';

export type ApiPreviewScenario =
    | 'arm'
    | 'disarm'
    | 'takeoff'
    | 'land'
    | 'goto'
    | 'goto-body'
    | 'yaw'
    | 'manual'
    | 'fsm'
    | 'point-reached'
    | 'state';

type PreviewStatus = {
    title: string;
    detail: string;
    phase?: string;
};

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

        if (this.scene) {
            this.scene.traverse((object) => {
                const mesh = object as THREE.Mesh;
                if (mesh.geometry) {
                    mesh.geometry.dispose();
                }
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((material) => material.dispose());
                } else {
                    mesh.material?.dispose?.();
                }
            });
        }

        this.renderer?.dispose();
        this.root.querySelector('[data-api-preview-stage]')?.replaceChildren();
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.drone = null;
        this.rotors = [];
        this.targetMarker = null;
        this.headingArrow = null;
        this.floorGlow = null;
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
        this.camera.position.set(0, -2.75, 1.18);
        this.camera.lookAt(0, 0.02, 0.22);

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
        this.floorGlow.rotation.x = -Math.PI / 2;
        this.floorGlow.position.z = -0.02;
        this.scene.add(this.floorGlow);

        const grid = new THREE.GridHelper(1.6, 8, 0x164e63, 0x0f172a);
        grid.rotation.x = Math.PI / 2;
        grid.position.z = -0.018;
        this.scene.add(grid);

        this.startMarker = this.createBeaconMarker(0xf59e0b, 0xfbbf24);
        this.startMarker.position.set(0, 0, 0);
        this.scene.add(this.startMarker);

        this.targetMarker = this.createTargetMarker();
        this.targetMarker.visible = false;
        this.scene.add(this.targetMarker);

        this.pathLine = this.createLine(0x38bdf8);
        this.pathLine.visible = false;
        this.scene.add(this.pathLine);

        this.guideLine = this.createLine(0xf59e0b);
        this.guideLine.visible = false;
        this.scene.add(this.guideLine);

        this.syncSize();
        window.addEventListener('resize', this.handleResize);
        this.animate();
    }

    private createTargetMarker(): THREE.Group {
        return this.createBeaconMarker(0x38bdf8, 0xf8fafc);
    }

    private createBeaconMarker(baseColor: number, capColor: number): THREE.Group {
        const group = new THREE.Group();
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.11, 0.012, 12, 48),
            new THREE.MeshStandardMaterial({
                color: baseColor,
                emissive: 0x0ea5e9,
                emissiveIntensity: 0.65,
                metalness: 0.2,
                roughness: 0.35
            })
        );
        ring.rotation.x = Math.PI / 2;
        ring.name = 'target-ring';

        const pillar = new THREE.Mesh(
            new THREE.CylinderGeometry(0.018, 0.018, 0.24, 18),
            new THREE.MeshStandardMaterial({
                color: baseColor,
                emissive: 0x0ea5e9,
                emissiveIntensity: 0.45
            })
        );
        pillar.position.z = 0.12;

        const cap = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 18, 18),
            new THREE.MeshStandardMaterial({
                color: capColor,
                emissive: 0x38bdf8,
                emissiveIntensity: 0.55
            })
        );
        cap.position.z = 0.24;

        group.add(ring, pillar, cap);
        return group;
    }

    private createLine(color: number): THREE.Line {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(),
            new THREE.Vector3()
        ]);
        const material = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.9
        });
        return new THREE.Line(geometry, material);
    }

    private syncSize(): void {
        if (!this.stage || !this.renderer || !this.camera) return;

        const width = Math.max(220, this.stage.clientWidth);
        const height = Math.max(180, this.stage.clientHeight);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    private animate = (): void => {
        if (this.destroyed || !this.renderer || !this.scene || !this.camera || !this.drone) return;

        const now = performance.now();
        if (!this.startTs) this.startTs = now;
        const dt = this.lastFrameTs ? Math.min((now - this.lastFrameTs) / 1000, 0.05) : 1 / 60;
        this.lastFrameTs = now;
        const elapsed = (now - this.startTs) / 1000;

        const status = this.renderScenario(elapsed, dt);
        if (this.statusEl) this.statusEl.textContent = status.title;
        if (this.hintEl) this.hintEl.textContent = status.detail;
        if (this.phaseEl) this.phaseEl.textContent = status.phase || status.title;

        this.syncSize();
        this.renderer.render(this.scene, this.camera);
        this.animationFrameId = window.requestAnimationFrame(this.animate);
    };

    private renderScenario(elapsed: number, dt: number): PreviewStatus {
        this.resetScene();

        switch (this.scenario) {
            case 'arm':
                return this.renderArmScenario(elapsed, dt);
            case 'disarm':
                return this.renderDisarmScenario(elapsed, dt);
            case 'takeoff':
                return this.renderTakeoffScenario(elapsed, dt);
            case 'land':
                return this.renderLandScenario(elapsed, dt);
            case 'goto':
                return this.renderGoToScenario(elapsed, dt, false);
            case 'goto-body':
                return this.renderGoToScenario(elapsed, dt, true);
            case 'yaw':
                return this.renderYawScenario(elapsed, dt);
            case 'manual':
                return this.renderManualScenario(elapsed, dt);
            case 'point-reached':
                return this.renderPointReachedScenario(elapsed, dt);
            case 'state':
                return this.renderFsmScenario(elapsed, dt, true);
            case 'fsm':
            default:
                return this.renderFsmScenario(elapsed, dt, false);
        }
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
        this.headingArrow.visible = false;
        this.pathLine.visible = false;
        this.guideLine.visible = false;
        (this.floorGlow.material as THREE.MeshBasicMaterial).opacity = 0.3;
    }

    private renderArmScenario(elapsed: number, dt: number): PreviewStatus {
        const phase = (elapsed % 4) / 4;
        const rotorSpeed = this.easeInOut(phase) * 18;
        const vibration = rotorSpeed > 1 ? Math.sin(elapsed * 22) * 0.004 : 0;
        this.setDronePose(vibration, -vibration, 0.02, 0.02, -0.02, 0);
        this.spinRotors(rotorSpeed, dt);

        return {
            title: 'Arm: моторы раскручиваются',
            detail: 'Команда переводит автопилот в состояние готовности: винты выходят на обороты, но дрон еще не отрывается от земли.',
            phase: 'Подготовка: запуск моторов'
        };
    }

    private renderDisarmScenario(elapsed: number, dt: number): PreviewStatus {
        const phase = 1 - this.easeInOut((elapsed % 4) / 4);
        const rotorSpeed = Math.max(0, phase * 18);
        const vibration = rotorSpeed > 1 ? Math.sin(elapsed * 20) * 0.003 : 0;
        this.setDronePose(vibration, vibration, 0.02, 0.01, -0.01, 0);
        this.spinRotors(rotorSpeed, dt);

        return {
            title: 'Disarm: моторы останавливаются',
            detail: 'Команда завершает активное состояние автопилота и сбрасывает тягу до нуля, когда посадка уже выполнена.',
            phase: 'Завершение: остановка моторов'
        };
    }

    private renderTakeoffScenario(elapsed: number, dt: number): PreviewStatus {
        const cycle = (elapsed % 5) / 5;
        const lift = this.easeInOut(this.clamp((cycle - 0.12) / 0.5));
        const altitude = 0.02 + lift * 0.42;
        const pitch = lift > 0.15 ? -0.06 : 0;
        this.setDronePose(0, 0, altitude, pitch, 0, 0);
        this.spinRotors(9 + lift * 18, dt);
        this.updateGuideLine([
            new THREE.Vector3(0, 0, 0.02),
            new THREE.Vector3(0, 0, 0.46)
        ], this.guideLine);

        return {
            title: lift < 0.08 ? 'Takeoff: старт процедуры взлета' : 'Takeoff: набор высоты',
            detail: 'Во время взлета автопилот увеличивает тягу, отрывает дрон от земли и выводит его в стабильное зависание.',
            phase: lift < 0.08 ? 'Фаза: старт с площадки' : 'Фаза: подъем вверх'
        };
    }

    private renderLandScenario(elapsed: number, dt: number): PreviewStatus {
        const cycle = (elapsed % 5) / 5;
        const descent = 1 - this.easeInOut(this.clamp((cycle - 0.12) / 0.54));
        const altitude = 0.02 + descent * 0.42;
        this.setDronePose(0, 0, altitude, 0.04, 0, 0);
        this.spinRotors(7 + descent * 16, dt);
        this.updateGuideLine([
            new THREE.Vector3(0, 0, 0.46),
            new THREE.Vector3(0, 0, 0.02)
        ], this.guideLine);

        return {
            title: descent > 0.2 ? 'Land: снижение к площадке' : 'Land: завершение посадки',
            detail: 'Посадка уменьшает высоту плавно, удерживая аппарат устойчивым вплоть до касания поверхности.',
            phase: descent > 0.2 ? 'Фаза: снижение вниз' : 'Фаза: касание площадки'
        };
    }

    private renderGoToScenario(elapsed: number, dt: number, bodyFixed: boolean): PreviewStatus {
        if (!this.targetMarker) {
            return { title: 'Полет к точке', detail: 'Маркер цели недоступен.' };
        }

        const target = bodyFixed ? new THREE.Vector3(0.42, -0.18, 0) : new THREE.Vector3(0.55, 0.18, 0);
        const phase = (elapsed % 6) / 6;
        const moveProgress = this.easeInOut(this.clamp((phase - 0.14) / 0.58));
        const hoverZ = 0.36;
        const position = new THREE.Vector3(target.x * moveProgress, target.y * moveProgress, hoverZ);
        const yaw = bodyFixed ? 0.42 : 0.18;
        const pitch = -0.18 * Math.cos(moveProgress * Math.PI);
        const roll = 0.1 * Math.sin(moveProgress * Math.PI * (bodyFixed ? -1 : 1));

        this.targetMarker.visible = true;
        this.targetMarker.position.copy(target);
        this.setDronePose(position.x, position.y, position.z, pitch, roll, yaw);
        this.spinRotors(22, dt);
        if (this.headingArrow) this.headingArrow.visible = true;
        this.updatePathLine([
            new THREE.Vector3(0, 0, 0.02),
            new THREE.Vector3(0, 0, hoverZ),
            new THREE.Vector3(target.x * 0.45, target.y * 0.45, hoverZ),
            new THREE.Vector3(target.x, target.y, hoverZ)
        ]);

        return {
            title: bodyFixed ? 'Полет в body-fixed точку' : 'Полет в локальную точку',
            detail: bodyFixed
                ? 'Цель задается в системе координат самого дрона: направление полета зависит от текущего курса аппарата.'
                : 'Автопилот держит высоту, наклоняет корпус в сторону цели и переводит дрон к указанной локальной точке.',
            phase: moveProgress < 0.2 ? 'Фаза: выход на высоту' : moveProgress < 0.95 ? 'Фаза: движение к цели' : 'Фаза: выход в точку'
        };
    }

    private renderYawScenario(elapsed: number, dt: number): PreviewStatus {
        const yaw = Math.sin(elapsed * 1.15) * 1.05;
        const altitude = 0.34 + Math.sin(elapsed * 1.15 + 0.6) * 0.015;
        this.setDronePose(0, 0, altitude, 0, 0, yaw);
        this.spinRotors(20, dt);
        if (this.headingArrow) this.headingArrow.visible = true;
        this.updateGuideLine([
            new THREE.Vector3(0, 0, altitude),
            new THREE.Vector3(Math.cos(yaw) * 0.32, Math.sin(yaw) * 0.12, altitude)
        ], this.guideLine);

        return {
            title: 'Изменение yaw: разворот по курсу',
            detail: 'Метод меняет ориентацию вокруг вертикальной оси: дрон остается в воздухе и поворачивает нос в новый азимут.',
            phase: 'Фаза: поворот вокруг оси Z'
        };
    }

    private renderManualScenario(elapsed: number, dt: number): PreviewStatus {
        const x = Math.sin(elapsed * 1.1) * 0.24;
        const y = Math.sin(elapsed * 0.55) * 0.18;
        const z = 0.32 + Math.sin(elapsed * 1.8) * 0.05;
        const pitch = Math.cos(elapsed * 1.1) * -0.18;
        const roll = Math.cos(elapsed * 0.55) * 0.16;
        const yaw = Math.sin(elapsed * 0.72) * 0.5;
        this.setDronePose(x, y, z, pitch, roll, yaw);
        this.spinRotors(21, dt);
        if (this.headingArrow) this.headingArrow.visible = true;
        this.updatePathLine([
            new THREE.Vector3(-0.22, -0.12, 0.28),
            new THREE.Vector3(0.22, -0.12, 0.38),
            new THREE.Vector3(0.22, 0.12, 0.3),
            new THREE.Vector3(-0.22, 0.12, 0.36)
        ]);

        return {
            title: 'Manual speed: непрерывное управление скоростью',
            detail: 'Команда задает скорости по осям и требует постоянной отправки, поэтому траектория получается плавной и непрерывной.',
            phase: 'Фаза: непрерывное управление скоростью'
        };
    }

    private renderPointReachedScenario(elapsed: number, dt: number): PreviewStatus {
        if (!this.targetMarker) {
            return { title: 'Точка достигнута', detail: 'Маркер цели недоступен.' };
        }

        const target = new THREE.Vector3(0.5, 0.14, 0);
        const phase = (elapsed % 6) / 6;
        const moveProgress = this.easeInOut(this.clamp((phase - 0.1) / 0.46));
        const reached = phase > 0.62;
        const x = target.x * moveProgress;
        const y = target.y * moveProgress;
        this.targetMarker.visible = true;
        this.targetMarker.position.copy(target);
        this.targetMarker.scale.setScalar(reached ? 1 + Math.sin(elapsed * 10) * 0.1 : 1);
        this.setDronePose(x, y, 0.34, -0.08, 0.04, 0.16);
        this.spinRotors(20, dt);
        this.updatePathLine([
            new THREE.Vector3(0, 0, 0.34),
            new THREE.Vector3(target.x, target.y, 0.34)
        ]);

        return {
            title: reached ? 'POINT_REACHED: цель достигнута' : 'Подлет к целевой точке',
            detail: reached
                ? 'Когда автопилот фиксирует достижение цели, можно безопасно запускать следующий этап миссии, например посадку.'
                : 'Событие `point_reached()` становится истинным после того, как дрон реально завершил перелет к заданной позиции.',
            phase: reached ? 'Фаза: цель достигнута' : 'Фаза: приближение к цели'
        };
    }

    private renderFsmScenario(elapsed: number, dt: number, compact: boolean): PreviewStatus {
        const cycle = elapsed % 8.2;
        let title = 'FSM: ожидание команды';
        let detail = 'Конечный автомат разрешает только те команды, которые соответствуют текущему состоянию дрона.';
        let altitude = 0.02;
        let x = 0;
        let y = 0;
        let pitch = 0;
        let roll = 0;
        let yaw = 0;
        let rotorSpeed = 0;
        let phase = 'Фаза: ожидание команды';

        if (cycle < 1.3) {
            title = 'IDLE: дрон на земле';
            phase = 'Фаза: IDLE';
        } else if (cycle < 2.6) {
            title = 'PREFLIGHT: предполетная подготовка';
            detail = 'На этом этапе автопилот раскручивает моторы и готовит аппарат к взлету.';
            rotorSpeed = 11;
            phase = 'Фаза: PREFLIGHT';
        } else if (cycle < 4) {
            const lift = this.easeInOut((cycle - 2.6) / 1.4);
            title = 'TAKEOFF_PROCESS: набор высоты';
            detail = 'После разрешенной команды взлета автомат переводит дрон из земли в устойчивое зависание.';
            altitude = 0.02 + lift * 0.35;
            pitch = -0.05;
            rotorSpeed = 15 + lift * 8;
            phase = 'Фаза: TAKEOFF_PROCESS';
            this.updateGuideLine([
                new THREE.Vector3(0, 0, 0.02),
                new THREE.Vector3(0, 0, 0.38)
            ], this.guideLine);
        } else if (cycle < 5.4) {
            title = compact ? 'FLYING_HOVER: состояние автопилота' : 'FLYING_HOVER: зависание';
            detail = 'В воздухе уже можно переходить к командам движения или разворота.';
            altitude = 0.37;
            rotorSpeed = 21;
            phase = 'Фаза: FLYING_HOVER';
        } else if (cycle < 7) {
            const travel = this.easeInOut((cycle - 5.4) / 1.6);
            title = 'FLYING_MOVING: полет к точке';
            detail = 'Именно здесь команды полета к точке допустимы и соответствуют состоянию конечного автомата.';
            altitude = 0.37;
            x = 0.45 * travel;
            y = 0.16 * travel;
            pitch = -0.16;
            roll = 0.08;
            yaw = 0.18;
            rotorSpeed = 22;
            if (this.targetMarker) {
                this.targetMarker.visible = true;
                this.targetMarker.position.set(0.45, 0.16, 0);
            }
            this.updatePathLine([
                new THREE.Vector3(0, 0, 0.37),
                new THREE.Vector3(0.45, 0.16, 0.37)
            ]);
            phase = 'Фаза: FLYING_MOVING';
        } else {
            const landProgress = this.easeInOut((cycle - 7) / 1.2);
            title = 'LANDING_PROCESS: снижение и посадка';
            detail = 'Только после воздушных состояний команда посадки считается корректным переходом автомата.';
            altitude = 0.37 - landProgress * 0.35;
            pitch = 0.04;
            rotorSpeed = 18 - landProgress * 10;
            phase = 'Фаза: LANDING_PROCESS';
            this.updateGuideLine([
                new THREE.Vector3(0.45, 0.16, 0.37),
                new THREE.Vector3(0.45, 0.16, 0.02)
            ], this.guideLine);
        }

        this.setDronePose(x, y, altitude, pitch, roll, yaw);
        this.spinRotors(rotorSpeed, dt);
        return { title, detail, phase };
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

    private updateGuideLine(points: THREE.Vector3[], line: THREE.Line | null): void {
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
