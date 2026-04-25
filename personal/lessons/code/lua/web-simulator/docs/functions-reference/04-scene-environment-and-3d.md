# Сцена, окружение и 3D-объекты

Three.js-сцена, окружение, препятствия, модель дрона, визуальные эффекты, выбор и трансформация объектов.

## Состав группы

- [`public/modules/drone-model.ts`](#public-modules-drone-model-ts)
- [`public/modules/drone-model/camera-antenna.ts`](#public-modules-drone-model-camera-antenna-ts)
- [`public/modules/drone-model/frame.ts`](#public-modules-drone-model-frame-ts)
- [`public/modules/drone-model/leds.ts`](#public-modules-drone-model-leds-ts)
- [`public/modules/drone-model/motors.ts`](#public-modules-drone-model-motors-ts)
- [`public/modules/drone.ts`](#public-modules-drone-ts)
- [`public/modules/drone/crash-visuals.ts`](#public-modules-drone-crash-visuals-ts)
- [`public/modules/drone/scene-events.ts`](#public-modules-drone-scene-events-ts)
- [`public/modules/drone/trails.ts`](#public-modules-drone-trails-ts)
- [`public/modules/environment/ground.ts`](#public-modules-environment-ground-ts)
- [`public/modules/environment/lights.ts`](#public-modules-environment-lights-ts)
- [`public/modules/environment/obstacles.ts`](#public-modules-environment-obstacles-ts)
- [`public/modules/environment/obstacles/arena.ts`](#public-modules-environment-obstacles-arena-ts)
- [`public/modules/environment/obstacles/buildings.ts`](#public-modules-environment-obstacles-buildings-ts)
- [`public/modules/environment/obstacles/competition.ts`](#public-modules-environment-obstacles-competition-ts)
- [`public/modules/environment/obstacles/linear.ts`](#public-modules-environment-obstacles-linear-ts)
- [`public/modules/environment/obstacles/marker-dictionaries.ts`](#public-modules-environment-obstacles-marker-dictionaries-ts)
- [`public/modules/environment/obstacles/markers.ts`](#public-modules-environment-obstacles-markers-ts)
- [`public/modules/environment/obstacles/nature.ts`](#public-modules-environment-obstacles-nature-ts)
- [`public/modules/environment/obstacles/pads.ts`](#public-modules-environment-obstacles-pads-ts)
- [`public/modules/environment/obstacles/presets.ts`](#public-modules-environment-obstacles-presets-ts)
- [`public/modules/environment/obstacles/types.ts`](#public-modules-environment-obstacles-types-ts)
- [`public/modules/environment/obstacles/utils.ts`](#public-modules-environment-obstacles-utils-ts)
- [`public/modules/environment/truss-arena.ts`](#public-modules-environment-truss-arena-ts)
- [`public/modules/scene/DroneOrbitControls.ts`](#public-modules-scene-droneorbitcontrols-ts)
- [`public/modules/scene/input.ts`](#public-modules-scene-input-ts)
- [`public/modules/scene/object-catalog.ts`](#public-modules-scene-object-catalog-ts)
- [`public/modules/scene/object-manager.ts`](#public-modules-scene-object-manager-ts)
- [`public/modules/scene/object-transform.ts`](#public-modules-scene-object-transform-ts)
- [`public/modules/scene/scene-init.ts`](#public-modules-scene-scene-init-ts)
- [`public/modules/scene/selection.ts`](#public-modules-scene-selection-ts)
- [`public/modules/scene/transform.ts`](#public-modules-scene-transform-ts)

## Файлы

<a id="public-modules-drone-model-ts"></a>
### `public/modules/drone-model.ts`

- Исходник: [открыть файл](../../public/modules/drone-model.ts)
- Кратко: Исходный модуль симулятора.
- Обнаружено функций/методов: 3
- Ключевые символы: `animateRotors`, `createDroneModel`, `updateLEDs`

<a id="public-modules-drone-model-camera-antenna-ts"></a>
### `public/modules/drone-model/camera-antenna.ts`

- Исходник: [открыть файл](../../public/modules/drone-model/camera-antenna.ts)
- Кратко: Сборка визуальных компонентов модели дрона.
- Обнаружено функций/методов: 1
- Ключевые символы: `createCameraAndAntenna`

<a id="public-modules-drone-model-frame-ts"></a>
### `public/modules/drone-model/frame.ts`

- Исходник: [открыть файл](../../public/modules/drone-model/frame.ts)
- Кратко: Сборка визуальных компонентов модели дрона.
- Обнаружено функций/методов: 3
- Ключевые символы: `createFrame`, `createGuard`, `createLegs`

<a id="public-modules-drone-model-leds-ts"></a>
### `public/modules/drone-model/leds.ts`

- Исходник: [открыть файл](../../public/modules/drone-model/leds.ts)
- Кратко: Сборка визуальных компонентов модели дрона.
- Обнаружено функций/методов: 1
- Ключевые символы: `createLEDs`

<a id="public-modules-drone-model-motors-ts"></a>
### `public/modules/drone-model/motors.ts`

- Исходник: [открыть файл](../../public/modules/drone-model/motors.ts)
- Кратко: Сборка визуальных компонентов модели дрона.
- Обнаружено функций/методов: 1
- Ключевые символы: `createMotors`

<a id="public-modules-drone-ts"></a>
### `public/modules/drone.ts`

- Исходник: [открыть файл](../../public/modules/drone.ts)
- Кратко: Исходный модуль симулятора.
- Обнаружено функций/методов: 4
- Ключевые символы: `getObstacles`, `init3D`, `syncDrones`, `updateDrone3D`

<a id="public-modules-drone-crash-visuals-ts"></a>
### `public/modules/drone/crash-visuals.ts`

- Исходник: [открыть файл](../../public/modules/drone/crash-visuals.ts)
- Кратко: Визуальное поведение дрона и спецэффекты.
- Обнаружено функций/методов: 3
- Ключевые символы: `explodeDrone`, `resetDroneVisuals`, `updateDebrisVisuals`

<a id="public-modules-drone-scene-events-ts"></a>
### `public/modules/drone/scene-events.ts`

- Исходник: [открыть файл](../../public/modules/drone/scene-events.ts)
- Кратко: Визуальное поведение дрона и спецэффекты.
- Обнаружено функций/методов: 3
- Ключевые символы: `handleSceneKeyDown`, `isScenePointerEvent`, `registerScenePointerHandlers`

<a id="public-modules-drone-trails-ts"></a>
### `public/modules/drone/trails.ts`

- Исходник: [открыть файл](../../public/modules/drone/trails.ts)
- Кратко: Визуальное поведение дрона и спецэффекты.
- Обнаружено функций/методов: 8
- Ключевые символы: `disposeTrailForDrone`, `getTracerColorHex`, `getTracerPointSize`, `getTracerWidthPx`, `initTrailForDrone`, `shouldShowTracerLine`, `shouldShowTracerPoints`, `updateTrailForDrone`

<a id="public-modules-environment-ground-ts"></a>
### `public/modules/environment/ground.ts`

- Исходник: [открыть файл](../../public/modules/environment/ground.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 3
- Ключевые символы: `createAxesLabels`, `createGround`, `makeLabel`

<a id="public-modules-environment-lights-ts"></a>
### `public/modules/environment/lights.ts`

- Исходник: [открыть файл](../../public/modules/environment/lights.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 1
- Ключевые символы: `setupLights`

<a id="public-modules-environment-obstacles-ts"></a>
### `public/modules/environment/obstacles.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 1
- Ключевые символы: `createObstacles`

<a id="public-modules-environment-obstacles-arena-ts"></a>
### `public/modules/environment/obstacles/arena.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/arena.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 12
- Ключевые символы: `createArenaControlStationMesh`, `createArenaHeliportMesh`, `createArenaHillClusterMesh`, `createArenaSpaceMesh`, `createCargoMesh`, `createChargeStationMesh`, `createForestPatchMesh`, `createLightTowerMesh`, `createLocusBeaconMesh`, `createSettlementMesh`, `createStartPositionMesh`, `createVideoTowerMesh`

<a id="public-modules-environment-obstacles-buildings-ts"></a>
### `public/modules/environment/obstacles/buildings.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/buildings.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 13
- Ключевые символы: `addIncidentEffect`, `clampBuildingFloors`, `createApartmentBuildingMesh`, `createFireEffect`, `createSmokeEffect`, `createThiefEffect`, `getWindowSlots`, `parseIncidentKind`, `parseWindowIncidents`, `rebuildApartmentBuilding`, `summarizeWindowIncidents`, `updateApartmentBuildingIncidents`, `updateApartmentBuildingMetadata`

<a id="public-modules-environment-obstacles-competition-ts"></a>
### `public/modules/environment/obstacles/competition.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/competition.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 3
- Ключевые символы: `createFlagMesh`, `createGateMesh`, `createPylonMesh`

<a id="public-modules-environment-obstacles-linear-ts"></a>
### `public/modules/environment/obstacles/linear.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/linear.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 9
- Ключевые символы: `buildHorizontalPatch`, `buildOrientedBox`, `buildOrientedCylinder`, `createRailwayMesh`, `createRoadMesh`, `makePathCurve`, `rebuildLinearFeature`, `toPointList`, `updateLinearFeaturePoints`

<a id="public-modules-environment-obstacles-marker-dictionaries-ts"></a>
### `public/modules/environment/obstacles/marker-dictionaries.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/marker-dictionaries.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 0

<a id="public-modules-environment-obstacles-markers-ts"></a>
### `public/modules/environment/obstacles/markers.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/markers.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 30
- Ключевые символы: `addBoxSurfaceCandidates`, `applyMarkerMapMetadata`, `applyMarkerMetadata`, `bytesToBitMatrix`, `clampInt`, `clampNumber`, `clampValue`, `createAprilTagMarkerMapMesh`, `createAprilTagMarkerMesh`, `createArucoMarkerMapMesh`, `createArucoMarkerMesh`, `createMarkerMapMesh`, `createMarkerMesh`, `createMarkerTexture`, `getAnchorPosition`, `getDefaultDictionary`, `getDictionaryDefinition`, `getMarkerDictionaryOptions`, `getMarkerKindKey`, `getMarkerMatrix`, `isMarkerObject`, `makeCandidate`, `normalizeMarkerDictionaryId`, `normalizeMarkerMapOptions`, `normalizeMarkerValue`, `parseMarkerId`, `snapMarkerToSurface`, `updateMarkerMaterials`, `updateMarkerValue`, `wrapMarkerId`

<a id="public-modules-environment-obstacles-nature-ts"></a>
### `public/modules/environment/obstacles/nature.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/nature.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 4
- Ключевые символы: `createFirTreeMesh`, `createHillMesh`, `createParkPatch`, `createTreeMesh`

<a id="public-modules-environment-obstacles-pads-ts"></a>
### `public/modules/environment/obstacles/pads.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/pads.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 3
- Ключевые символы: `createLandingPad`, `createStyledLandingPad`, `createTransportMesh`

<a id="public-modules-environment-obstacles-presets-ts"></a>
### `public/modules/environment/obstacles/presets.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/presets.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 3
- Ключевые символы: `createGeoskanArenaPreset`, `createRaceTrackPreset`, `createResidentialPreset`

<a id="public-modules-environment-obstacles-types-ts"></a>
### `public/modules/environment/obstacles/types.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/types.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 0

<a id="public-modules-environment-obstacles-utils-ts"></a>
### `public/modules/environment/obstacles/utils.ts`

- Исходник: [открыть файл](../../public/modules/environment/obstacles/utils.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 3
- Ключевые символы: `applyShadows`, `clearGeneratedChildren`, `disposeObject3D`

<a id="public-modules-environment-truss-arena-ts"></a>
### `public/modules/environment/truss-arena.ts`

- Исходник: [открыть файл](../../public/modules/environment/truss-arena.ts)
- Кратко: Создание окружения, земли, света и препятствий.
- Обнаружено функций/методов: 3
- Ключевые символы: `createTruss`, `createTrussArena`, `createTrussArenaMesh`

<a id="public-modules-scene-droneorbitcontrols-ts"></a>
### `public/modules/scene/DroneOrbitControls.ts`

- Исходник: [открыть файл](../../public/modules/scene/DroneOrbitControls.ts)
- Кратко: Логика 3D-сцены, выбора объектов и трансформаций.
- Обнаружено функций/методов: 14
- Ключевые символы: `DroneOrbitControls.addEventListener`, `DroneOrbitControls.clampElevation`, `DroneOrbitControls.clampTargetToSceneBounds`, `DroneOrbitControls.dispatchEvent`, `DroneOrbitControls.if`, `DroneOrbitControls.isTransformInteractionActive`, `DroneOrbitControls.onPointerDown`, `DroneOrbitControls.onPointerMove`, `DroneOrbitControls.onPointerUp`, `DroneOrbitControls.onWheel`, `DroneOrbitControls.setTarget`, `DroneOrbitControls.syncSphericalFromCamera`, `DroneOrbitControls.syncTargetToPendingObjectIfInView`, `DroneOrbitControls.update`

<a id="public-modules-scene-input-ts"></a>
### `public/modules/scene/input.ts`

- Исходник: [открыть файл](../../public/modules/scene/input.ts)
- Кратко: Логика 3D-сцены, выбора объектов и трансформаций.
- Обнаружено функций/методов: 14
- Ключевые символы: `createGroundPointLabel`, `getGroundPointFromPointer`, `getObjectDisplayName`, `getRootSceneObject`, `handleSelection`, `hideTransformUiPreserveSelection`, `isDroneObject`, `isGroundObject`, `onPointerDown`, `onPointerUp`, `showGroundPoint`, `showTransformUi`, `traceClick`, `updateObjectSelectionVisuals`

<a id="public-modules-scene-object-catalog-ts"></a>
### `public/modules/scene/object-catalog.ts`

- Исходник: [открыть файл](../../public/modules/scene/object-catalog.ts)
- Кратко: Логика 3D-сцены, выбора объектов и трансформаций.
- Обнаружено функций/методов: 7
- Ключевые символы: `findSceneObjectById`, `formatPoints`, `getSceneTopLevelObjects`, `isTransformableObject`, `listSceneObjects`, `normalizePoints`, `parsePointsText`

<a id="public-modules-scene-object-manager-ts"></a>
### `public/modules/scene/object-manager.ts`

- Исходник: [открыть файл](../../public/modules/scene/object-manager.ts)
- Кратко: Логика 3D-сцены, выбора объектов и трансформаций.
- Обнаружено функций/методов: 12
- Ключевые символы: `addObject`, `appendPointToSelectedLinearObject`, `deleteSceneObjectById`, `deleteSelectedObject`, `duplicateObject`, `getSelectedSceneObjectId`, `groupObjects`, `resetDroneToOrigin`, `selectSceneObjectById`, `setSceneObjectTransformMode`, `ungroupObject`, `updateSelectedSceneObject`

<a id="public-modules-scene-object-transform-ts"></a>
### `public/modules/scene/object-transform.ts`

- Исходник: [открыть файл](../../public/modules/scene/object-transform.ts)
- Кратко: Логика 3D-сцены, выбора объектов и трансформаций.
- Обнаружено функций/методов: 8
- Ключевые символы: `activateTransformMode`, `clearSelectedObjectInitialTransform`, `getRotationStepDegrees`, `getRotationStepOptions`, `rememberSelectedObjectInitialTransform`, `resetSelectedObjectToInitialTransform`, `rotateSelectedObjectByDegrees`, `setRotationStepDegrees`

<a id="public-modules-scene-scene-init-ts"></a>
### `public/modules/scene/scene-init.ts`

- Исходник: [открыть файл](../../public/modules/scene/scene-init.ts)
- Кратко: Логика 3D-сцены, выбора объектов и трансформаций.
- Обнаружено функций/методов: 9
- Ключевые символы: `configureTransformHelperVisuals`, `focusOrbitControlsOnObject`, `initScene`, `onWindowResize`, `setIsHittingGizmo`, `setPointerDownPos`, `setSelectedObject`, `syncViewportDependentSceneVisuals`, `toggleMultiSelectObject`

<a id="public-modules-scene-selection-ts"></a>
### `public/modules/scene/selection.ts`

- Исходник: [открыть файл](../../public/modules/scene/selection.ts)
- Кратко: Логика 3D-сцены, выбора объектов и трансформаций.
- Обнаружено функций/методов: 3
- Ключевые символы: `deselectObject`, `exitTransformMode`, `handleDeselection`

<a id="public-modules-scene-transform-ts"></a>
### `public/modules/scene/transform.ts`

- Исходник: [открыть файл](../../public/modules/scene/transform.ts)
- Кратко: Логика 3D-сцены, выбора объектов и трансформаций.
- Обнаружено функций/методов: 8
- Ключевые символы: `createAxisLabel`, `getGuideLength`, `hideRotationGuide`, `setHelperRenderOrder`, `setupTransformControlListeners`, `showRotationGuide`, `syncRotationGuide`, `updateTransformModeDecorations`

