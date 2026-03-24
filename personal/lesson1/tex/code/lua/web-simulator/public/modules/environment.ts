/**
 * Модуль генерации объектов окружения (препятствий).
 * Экспортирует функции для настройки сцены и добавления объектов.
 */
import * as THREE from 'three';
import { setupLights } from './environment/lights.js';
import { createGround, createAxesLabels } from './environment/ground.js';
import { createGateMesh, createPylonMesh, createFlagMesh, createObstacles, createLandingPad } from './environment/obstacles.js';

export let envGroup: THREE.Group;

export function setupEnvironment(scene: THREE.Scene) {
    setupLights(scene);

    envGroup = new THREE.Group();
    scene.add(envGroup);

    createGround(scene, envGroup);
    createObstacles(envGroup);

    const axesHelper = new THREE.AxesHelper(2);
    axesHelper.position.z = 0.01;
    scene.add(axesHelper);

    createAxesLabels(scene);
}

export function addObjectToScene(type: string, camera: THREE.Camera) {
    if (!envGroup) return null;
    let obj: THREE.Object3D | undefined;
    if (type === 'gate') obj = createGateMesh();
    else if (type === 'pylon') obj = createPylonMesh();
    else if (type === 'flag') obj = createFlagMesh();
    
    if (obj) {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.multiplyScalar(5);
        const pos = camera.position.clone().add(dir);
        obj.position.set(pos.x, pos.y, 0); 
        envGroup.add(obj);
        return obj;
    }
    return null;
}

export { createLandingPad };
