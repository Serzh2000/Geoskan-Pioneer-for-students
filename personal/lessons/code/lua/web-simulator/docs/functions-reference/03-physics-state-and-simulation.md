# Физика, состояние и симуляция

Основной цикл симуляции, события столкновений, физические материалы, захват грузов, MCE-события и служебные тестовые сценарии.

## Состав группы

- [`public/modules/mce-events.ts`](#public-modules-mce-events-ts)
- [`public/modules/physics.ts`](#public-modules-physics-ts)
- [`public/modules/physics/cargo-contact.ts`](#public-modules-physics-cargo-contact-ts)
- [`public/modules/physics/collisions.ts`](#public-modules-physics-collisions-ts)
- [`public/modules/physics/constants.ts`](#public-modules-physics-constants-ts)
- [`public/modules/physics/events.ts`](#public-modules-physics-events-ts)
- [`public/modules/physics/magnet-gripper.ts`](#public-modules-physics-magnet-gripper-ts)
- [`public/modules/physics/materials.ts`](#public-modules-physics-materials-ts)
- [`public/modules/tests.ts`](#public-modules-tests-ts)

## Файлы

<a id="public-modules-mce-events-ts"></a>
### `public/modules/mce-events.ts`

- Исходник: [открыть файл](../../public/modules/mce-events.ts)
- Кратко: Исходный модуль симулятора.
- Обнаружено функций/методов: 8
- Ключевые символы: `EventEmitter.emit`, `EventEmitter.if`, `EventEmitter.off`, `EventEmitter.on`, `pushCommand`, `runMCETests`, `testCb`, `triggerEvent`

<a id="public-modules-physics-ts"></a>
### `public/modules/physics.ts`

- Исходник: [открыть файл](../../public/modules/physics.ts)
- Кратко: Верхнеуровневый цикл физического обновления дронов.
- Обнаружено функций/методов: 1
- Ключевые символы: `updatePhysics`

<a id="public-modules-physics-cargo-contact-ts"></a>
### `public/modules/physics/cargo-contact.ts`

- Исходник: [открыть файл](../../public/modules/physics/cargo-contact.ts)
- Кратко: Низкоуровневая физика, столкновения и контактные расчеты.
- Обнаружено функций/методов: 3
- Ключевые символы: `applyGroundFriction`, `combineContactMaterials`, `simulateDetachedCargoStep`

<a id="public-modules-physics-collisions-ts"></a>
### `public/modules/physics/collisions.ts`

- Исходник: [открыть файл](../../public/modules/physics/collisions.ts)
- Кратко: Низкоуровневая физика, столкновения и контактные расчеты.
- Обнаружено функций/методов: 6
- Ключевые символы: `capsuleDistanceToPoint`, `gateHasCollision`, `intersectsExpandedBox`, `obstacleHasCollision`, `sampleSegmentPoints`, `shouldSkipCollisionForObject`

<a id="public-modules-physics-constants-ts"></a>
### `public/modules/physics/constants.ts`

- Исходник: [открыть файл](../../public/modules/physics/constants.ts)
- Кратко: Низкоуровневая физика, столкновения и контактные расчеты.
- Обнаружено функций/методов: 0

<a id="public-modules-physics-events-ts"></a>
### `public/modules/physics/events.ts`

- Исходник: [открыть файл](../../public/modules/physics/events.ts)
- Кратко: Низкоуровневая физика, столкновения и контактные расчеты.
- Обнаружено функций/методов: 4
- Ключевые символы: `applyCrashState`, `beginDisarmedFall`, `checkPhysicsEvents`, `shouldCrashOnGroundImpact`

<a id="public-modules-physics-magnet-gripper-ts"></a>
### `public/modules/physics/magnet-gripper.ts`

- Исходник: [открыть файл](../../public/modules/physics/magnet-gripper.ts)
- Кратко: Низкоуровневая физика, столкновения и контактные расчеты.
- Обнаружено функций/методов: 6
- Ключевые символы: `getCargoMassKg`, `getCargoVelocity`, `isCargoObject`, `setCargoVelocity`, `updateDetachedCargoPhysics`, `updateMagnetGripper`

<a id="public-modules-physics-materials-ts"></a>
### `public/modules/physics/materials.ts`

- Исходник: [открыть файл](../../public/modules/physics/materials.ts)
- Кратко: Низкоуровневая физика, столкновения и контактные расчеты.
- Обнаружено функций/методов: 1
- Ключевые символы: `resolvePhysicsMaterial`

<a id="public-modules-tests-ts"></a>
### `public/modules/tests.ts`

- Исходник: [открыть файл](../../public/modules/tests.ts)
- Кратко: Исходный модуль симулятора.
- Обнаружено функций/методов: 1
- Ключевые символы: `runIntegrationTests`

