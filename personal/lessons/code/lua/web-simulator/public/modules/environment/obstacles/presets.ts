import * as THREE from 'three';
import { setCommonMeta, applyShadows } from './utils.js';
import { createRoadMesh, createRailwayMesh } from './linear.js';
import { createGateMesh, createPylonMesh } from './competition.js';
import {
    createAprilTagMarkerMesh,
    createAprilTagMarkerMapMesh,
    createArucoMarkerMesh,
    createArucoMarkerMapMesh
} from './markers.js';
import { createApartmentBuildingMesh } from './buildings.js';
import { createFirTreeMesh, createParkPatch, createTreeMesh, createHillMesh } from './nature.js';
import { createStyledLandingPad } from './pads.js';
import {
    createArenaControlStationMesh,
    createArenaHeliportMesh,
    createArenaHillClusterMesh,
    createArenaSpaceMesh,
    createCargoMesh,
    createChargeStationMesh,
    createForestPatchMesh,
    createLightTowerMesh,
    createLocusBeaconMesh,
    createSettlementMesh,
    createStartPositionMesh,
    createVideoTowerMesh
} from './arena.js';

export function createRaceTrackPreset() {
    const group = setCommonMeta(new THREE.Group(), 'Пресет: гоночная трасса', {
        collidableRadius: 16,
        presetName: 'race-track'
    });

    const road = createRoadMesh({
        closed: true,
        points: [
            { x: 14, y: 0, z: 0 },
            { x: 10, y: 10, z: 0 },
            { x: 0, y: 14, z: 0 },
            { x: -12, y: 8, z: 0 },
            { x: -14, y: -4, z: 0 },
            { x: -4, y: -14, z: 0 },
            { x: 8, y: -12, z: 0 }
        ]
    });
    group.add(road);

    const gateStart = createGateMesh();
    gateStart.position.set(12, 0, 0);
    gateStart.rotation.z = Math.PI / 2;
    group.add(gateStart);

    const gateTurn = createGateMesh();
    gateTurn.position.set(-10, 8, 0);
    gateTurn.rotation.z = 0.35;
    group.add(gateTurn);

    for (let i = 0; i < 6; i++) {
        const pylon = createPylonMesh();
        pylon.position.set(-5 + i * 2, -2 + (i % 2 === 0 ? 1.2 : -1.2), 1);
        group.add(pylon);
    }

    const marker = createAprilTagMarkerMesh('42');
    marker.position.set(3, 12, 0);
    group.add(marker);

    const cargo = createCargoMesh();
    cargo.position.set(0, -9, 0);
    group.add(cargo);

    const start1 = createStartPositionMesh('1');
    start1.position.set(14, -2.8, 0.01);
    group.add(start1);

    const start2 = createStartPositionMesh('2');
    start2.position.set(14, 2.8, 0.01);
    group.add(start2);

    const cameraTower = createVideoTowerMesh();
    cameraTower.position.set(9, 13, 0);
    group.add(cameraTower);

    const lightTower = createLightTowerMesh();
    lightTower.position.set(-14, 12, 0);
    group.add(lightTower);

    applyShadows(group);
    return group;
}

export function createResidentialPreset() {
    const group = setCommonMeta(new THREE.Group(), 'Пресет: спальный район', {
        collidableRadius: 22,
        presetName: 'residential'
    });

    const roadMain = createRoadMesh({
        points: [
            { x: -18, y: -3, z: 0 },
            { x: -6, y: -3, z: 0 },
            { x: 8, y: -1, z: 0 },
            { x: 18, y: 2, z: 0 }
        ]
    });
    group.add(roadMain);

    const roadSide = createRoadMesh({
        points: [
            { x: -3, y: -14, z: 0 },
            { x: -1, y: -6, z: 0 },
            { x: 1, y: 4, z: 0 },
            { x: 4, y: 14, z: 0 }
        ]
    });
    roadSide.rotation.z = 0.12;
    group.add(roadSide);

    const rail = createRailwayMesh({
        points: [
            { x: -20, y: 12, z: 0 },
            { x: -8, y: 10, z: 0 },
            { x: 6, y: 8, z: 0 },
            { x: 18, y: 11, z: 0 }
        ]
    });
    group.add(rail);

    const buildingPositions = [
        [-12, -10, 8],
        [-9, 8, 10],
        [8, -9, 12],
        [12, 8, 9]
    ];
    buildingPositions.forEach(([x, y, floors]) => {
        const building = createApartmentBuildingMesh({ floors: floors as number });
        building.position.set(x as number, y as number, 0);
        building.rotation.z = (x as number) > 0 ? Math.PI * 0.5 : 0;
        group.add(building);
    });

    const park = createParkPatch(10, 8);
    park.position.set(0, 8, 0);
    group.add(park);

    const settlement = createSettlementMesh();
    settlement.position.set(-13, -8, 0);
    group.add(settlement);

    const forest = createForestPatchMesh();
    forest.position.set(11, -11, 0);
    group.add(forest);

    [
        [-3, 6, 0.9],
        [0, 7.5, 1],
        [2.8, 9, 0.85],
        [-1, 10.5, 1.1],
        [3.5, 5.6, 0.95]
    ].forEach(([x, y, scale]) => {
        const tree = createTreeMesh(scale as number);
        tree.position.set(x as number, y as number, 0);
        group.add(tree);
    });

    const aruco = createArucoMarkerMesh('7');
    aruco.position.set(-15, 4, 0);
    group.add(aruco);

    const april = createAprilTagMarkerMesh('18');
    april.position.set(15, -5, 0);
    group.add(april);

    const heliport = createArenaHeliportMesh();
    heliport.position.set(-1, -10, 0.01);
    group.add(heliport);

    const charge = createChargeStationMesh();
    charge.position.set(4, -9.5, 0.01);
    group.add(charge);

    const controlStation = createArenaControlStationMesh();
    controlStation.position.set(6.5, 12, 0);
    controlStation.rotation.z = -0.4;
    group.add(controlStation);

    applyShadows(group);
    return group;
}

export function createGeoskanArenaPreset() {
    const group = setCommonMeta(new THREE.Group(), 'Пресет: Геоскан Арена', {
        collidableRadius: 18,
        presetName: 'geoskan-arena'
    });

    const arena = createArenaSpaceMesh();
    group.add(arena);

    const startPositions = [
        [-6, -6, '1'],
        [-2, -6, '2'],
        [2, -6, '3'],
        [6, -6, '4']
    ] as const;
    startPositions.forEach(([x, y, label]) => {
        const pad = createStartPositionMesh(label);
        pad.position.set(x, y, 0.01);
        group.add(pad);
    });

    const chargeLeft = createChargeStationMesh();
    chargeLeft.position.set(-4, 4, 0.01);
    group.add(chargeLeft);

    const chargeRight = createChargeStationMesh();
    chargeRight.position.set(4, 4, 0.01);
    group.add(chargeRight);

    const heliLeft = createArenaHeliportMesh();
    heliLeft.position.set(-6, 0, 0.01);
    group.add(heliLeft);

    const heliRight = createArenaHeliportMesh();
    heliRight.position.set(6, 0, 0.01);
    group.add(heliRight);

    const hillCluster = createArenaHillClusterMesh();
    hillCluster.position.set(-0.6, 0.4, 0);
    group.add(hillCluster);

    const settlement = createSettlementMesh();
    settlement.position.set(0, 7.8, 0);
    group.add(settlement);

    const forestLeft = createForestPatchMesh();
    forestLeft.position.set(-7.2, 6.2, 0);
    group.add(forestLeft);

    const forestRight = createForestPatchMesh();
    forestRight.position.set(7.4, 6.1, 0);
    group.add(forestRight);

    const controlStation = createArenaControlStationMesh();
    controlStation.position.set(0, -8.6, 0);
    group.add(controlStation);

    const cameraTower = createVideoTowerMesh();
    cameraTower.position.set(-8.5, -8.5, 0);
    group.add(cameraTower);

    const lightTowerLeft = createLightTowerMesh();
    lightTowerLeft.position.set(-8.2, 8.2, 0);
    group.add(lightTowerLeft);

    const lightTowerRight = createLightTowerMesh();
    lightTowerRight.position.set(8.2, 8.2, 0);
    group.add(lightTowerRight);

    const locusA = createLocusBeaconMesh();
    locusA.position.set(-8.1, -0.2, 0);
    group.add(locusA);

    const locusB = createLocusBeaconMesh();
    locusB.position.set(8.1, -0.2, 0);
    group.add(locusB);

    const cargoPoints = [
        [-2.8, 2.2],
        [0.2, 2.6],
        [2.8, 2.1]
    ] as const;
    cargoPoints.forEach(([x, y]) => {
        const cargo = createCargoMesh();
        cargo.position.set(x, y, 0);
        group.add(cargo);
    });

    const arucoMap = createArucoMarkerMapMesh('DICT_6X6_250', {
        rows: 2,
        columns: 3,
        startId: 10,
        markerSize: 0.8,
        gapX: 0.15,
        gapY: 0.15,
        startCorner: 'top-left',
        traversal: 'row-major'
    });
    arucoMap.position.set(-6.4, 8.2, 0.01);
    group.add(arucoMap);

    const aprilMap = createAprilTagMarkerMapMesh('DICT_APRILTAG_36h11', {
        rows: 2,
        columns: 2,
        startId: 20,
        markerSize: 0.8,
        gapX: 0.18,
        gapY: 0.18,
        startCorner: 'top-left',
        traversal: 'row-major'
    });
    aprilMap.position.set(6.4, 8.2, 0.01);
    group.add(aprilMap);

    applyShadows(group);
    return group;
}
