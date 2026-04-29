import * as THREE from 'three';
import { createTrussArenaMesh } from '../../truss-arena.js';
import { setCommonMeta, applyShadows } from '../utils.js';

export function createArenaSpaceMesh() {
    const group = setCommonMeta(new THREE.Group(), 'Арена с сеткой', { collidableRadius: 9.5 });
    const frame = createTrussArenaMesh(11, 4);
    group.add(frame);
    applyShadows(group);
    return group;
}