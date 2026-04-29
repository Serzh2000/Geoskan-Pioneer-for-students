import * as THREE from 'three';
import { setCommonMeta, applyShadows } from '../utils.js';

const LIGHT_TOWER_BRIGHTNESS_LEVELS = [1, 0.5, 0] as const;

export function createLightTowerMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Световая мачта', { collidableRadius: 0.7 });

    const baseMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.6, metalness: 0.3 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.72, metalness: 0.28 });
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.6 });
    const lampGlassMaterials: THREE.MeshStandardMaterial[] = [];
    const lampBeams: THREE.SpotLight[] = [];

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.5), baseMat);
    base.position.set(0, 0, 0.35);
    group.add(base);

    const hitch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.12), darkMat);
    hitch.position.set(0, -0.67, 0.24);
    group.add(hitch);

    const towBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), darkMat);
    towBar.position.set(0, -1.0, 0.24);
    group.add(towBar);

    const footPadGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16);
    const armGeom = new THREE.BoxGeometry(0.4, 0.08, 0.08);
    const jackGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 12);
    [
        { x: -0.4, y: -0.4, dirX: -1 },
        { x: 0.4, y: -0.4, dirX: 1 },
        { x: -0.4, y: 0.4, dirX: -1 },
        { x: 0.4, y: 0.4, dirX: 1 }
    ].forEach(({ x, y, dirX }) => {
        const arm = new THREE.Mesh(armGeom, darkMat);
        arm.position.set(x + dirX * 0.2, y, 0.25);
        group.add(arm);

        const jack = new THREE.Mesh(jackGeom, mastMat);
        jack.rotation.x = Math.PI / 2;
        jack.position.set(x + dirX * 0.35, y, 0.15);
        group.add(jack);

        const foot = new THREE.Mesh(footPadGeom, darkMat);
        foot.rotation.x = Math.PI / 2;
        foot.position.set(x + dirX * 0.35, y, 0.02);
        group.add(foot);
    });

    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const wheelGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 16);
    [[-0.46, -0.2], [0.46, -0.2], [-0.46, 0.2], [0.46, 0.2]].forEach(([x, y]) => {
        const wheel = new THREE.Mesh(wheelGeom, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, y, 0.15);
        group.add(wheel);
    });

    const mast1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.5), mastMat);
    mast1.position.set(0, 0, 1.1);
    group.add(mast1);

    const mast2 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 1.5), mastMat);
    mast2.position.set(0, 0, 2.4);
    group.add(mast2);

    const mast3 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.2), mastMat);
    mast3.position.set(0, 0, 3.6);
    group.add(mast3);

    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.2), darkMat);
    bracket.position.set(0, 0, 4.1);
    group.add(bracket);

    const headBar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.1), darkMat);
    headBar.position.set(0, 0, 4.2);
    group.add(headBar);

    const lampGeom = new THREE.BoxGeometry(0.25, 0.1, 0.2);
    const glassGeom = new THREE.PlaneGeometry(0.23, 0.18);

    const lampOffsets = [-0.45, -0.15, 0.15, 0.45];
    lampOffsets.forEach((x, index) => {
        const lampPivot = new THREE.Group();
        lampPivot.position.set(x, -0.05, 4.2);
        lampPivot.rotation.x = Math.PI / 4;

        const lamp = new THREE.Mesh(lampGeom, darkMat);
        lampPivot.add(lamp);

        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            emissive: 0xfde68a,
            emissiveIntensity: 1,
            roughness: 0.14,
            metalness: 0.02,
            transparent: true,
            opacity: 0.96,
            side: THREE.DoubleSide
        });
        lampGlassMaterials.push(glassMaterial);

        const glass = new THREE.Mesh(glassGeom, glassMaterial);
        glass.position.set(0, -0.051, 0);
        glass.rotation.x = Math.PI / 2;
        lamp.add(glass);
        group.add(lampPivot);

        const beam = new THREE.SpotLight(0xfff1c1, 0, 15, Math.PI / 5.5, 0.45, 2);
        beam.position.set(x, -0.1, 4.15);
        beam.castShadow = index === 1 || index === 2;
        if (beam.castShadow) {
            beam.shadow.mapSize.set(512, 512);
            beam.shadow.bias = -0.00015;
            beam.shadow.radius = 4;
            beam.shadow.camera.near = 0.5;
            beam.shadow.camera.far = 15;
            beam.shadow.focus = 0.9;
        }

        const target = new THREE.Object3D();
        target.position.set(x, -4.0, 0);
        group.add(target);
        beam.target = target;
        group.add(beam);
        lampBeams.push(beam);
    });

    group.userData.brightness = 1;
    group.userData.setBrightness = (val: number) => {
        const brightness = THREE.MathUtils.clamp(val, 0, 1);
        group.userData.brightness = brightness;

        const beamIntensity = 24 * brightness;
        lampGlassMaterials.forEach((material) => {
            material.userData.originalEmissiveIntensity = brightness;
            material.emissiveIntensity = material.emissive.getHex() === 0x38bdf8
                ? Math.max(0.6, brightness)
                : brightness;
            material.opacity = 0.18 + brightness * 0.78;
        });

        lampBeams.forEach((beam) => {
            beam.intensity = beamIntensity;
            beam.visible = brightness > 0.001;
        });
    };
    group.userData.getContextMenuActions = () => ({
        title: 'Освещение мачты',
        actions: LIGHT_TOWER_BRIGHTNESS_LEVELS.map((level) => ({
            label: level === 1 ? 'Свет: 100%' : level === 0.5 ? 'Свет: 50%' : 'Свет: выкл',
            icon: level === 1 ? '💡' : level === 0.5 ? '◐' : '○',
            active: group.userData.brightness === level,
            action: () => group.userData.setBrightness(level)
        }))
    });
    group.userData.setBrightness(1);

    applyShadows(group);
    return group;
}
