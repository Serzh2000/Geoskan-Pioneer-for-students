# Web Simulator Function Reference

## Scope

- This catalog covers project-owned source code in `public`, `tests`, `tools`, and `server.ts`.
- Vendor assets, generated resources, and third-party dependencies are intentionally excluded.
- The catalog includes named functions, arrow functions assigned to variables, and class methods. Anonymous inline callbacks are omitted.
- Each entry includes a signature, parameter list, return value description, purpose, implementation/business logic notes, and a usage example.

## Module Index

- `public/global.d.ts`: 25 functions/methods
- `public/main.ts`: 8 functions/methods
- `public/modules/camera.ts`: 2 functions/methods
- `public/modules/drone-model.ts`: 3 functions/methods
- `public/modules/drone-model/camera-antenna.ts`: 1 functions/methods
- `public/modules/drone-model/frame.ts`: 3 functions/methods
- `public/modules/drone-model/leds.ts`: 1 functions/methods
- `public/modules/drone-model/motors.ts`: 1 functions/methods
- `public/modules/drone.ts`: 4 functions/methods
- `public/modules/drone/crash-visuals.ts`: 3 functions/methods
- `public/modules/drone/scene-events.ts`: 3 functions/methods
- `public/modules/drone/trails.ts`: 8 functions/methods
- `public/modules/editor.ts`: 7 functions/methods
- `public/modules/editor/completion.ts`: 1 functions/methods
- `public/modules/editor/hover.ts`: 2 functions/methods
- `public/modules/editor/syntax.ts`: 1 functions/methods
- `public/modules/environment.ts`: 4 functions/methods
- `public/modules/environment/ground.ts`: 3 functions/methods
- `public/modules/environment/lights.ts`: 1 functions/methods
- `public/modules/environment/obstacles.ts`: 1 functions/methods
- `public/modules/environment/obstacles/arena.ts`: 12 functions/methods
- `public/modules/environment/obstacles/buildings.ts`: 13 functions/methods
- `public/modules/environment/obstacles/competition.ts`: 3 functions/methods
- `public/modules/environment/obstacles/linear.ts`: 9 functions/methods
- `public/modules/environment/obstacles/markers.ts`: 30 functions/methods
- `public/modules/environment/obstacles/nature.ts`: 4 functions/methods
- `public/modules/environment/obstacles/pads.ts`: 3 functions/methods
- `public/modules/environment/obstacles/presets.ts`: 3 functions/methods
- `public/modules/environment/obstacles/utils.ts`: 4 functions/methods
- `public/modules/environment/truss-arena.ts`: 3 functions/methods
- `public/modules/lua/autopilot.ts`: 5 functions/methods
- `public/modules/lua/hardware.ts`: 7 functions/methods
- `public/modules/lua/index.ts`: 5 functions/methods
- `public/modules/lua/leds.ts`: 3 functions/methods
- `public/modules/lua/runner.ts`: 1 functions/methods
- `public/modules/lua/sensors.ts`: 8 functions/methods
- `public/modules/lua/timers.ts`: 5 functions/methods
- `public/modules/mce-events.ts`: 7 functions/methods
- `public/modules/physics.ts`: 1 functions/methods
- `public/modules/physics/cargo-contact.ts`: 3 functions/methods
- `public/modules/physics/collisions.ts`: 6 functions/methods
- `public/modules/physics/events.ts`: 4 functions/methods
- `public/modules/physics/magnet-gripper.ts`: 6 functions/methods
- `public/modules/physics/materials.ts`: 1 functions/methods
- `public/modules/python/runtime.ts`: 8 functions/methods
- `public/modules/scene/DroneOrbitControls.ts`: 13 functions/methods
- `public/modules/scene/input.ts`: 14 functions/methods
- `public/modules/scene/object-catalog.ts`: 7 functions/methods
- `public/modules/scene/object-manager.ts`: 12 functions/methods
- `public/modules/scene/object-transform.ts`: 8 functions/methods
- `public/modules/scene/scene-init.ts`: 9 functions/methods
- `public/modules/scene/selection.ts`: 3 functions/methods
- `public/modules/scene/transform.ts`: 8 functions/methods
- `public/modules/state.ts`: 10 functions/methods
- `public/modules/tests.ts`: 1 functions/methods
- `public/modules/ui/api-docs-ui.ts`: 1 functions/methods
- `public/modules/ui/camera-mode.ts`: 1 functions/methods
- `public/modules/ui/context-menu.ts`: 11 functions/methods
- `public/modules/ui/drone-manager.ts`: 2 functions/methods
- `public/modules/ui/file-controls.ts`: 1 functions/methods
- `public/modules/ui/hud-controls.ts`: 3 functions/methods
- `public/modules/ui/index.ts`: 3 functions/methods
- `public/modules/ui/led-matrix.ts`: 1 functions/methods
- `public/modules/ui/logger.ts`: 1 functions/methods
- `public/modules/ui/scene-manager.ts`: 25 functions/methods
- `public/modules/ui/settings.ts`: 28 functions/methods
- `public/modules/ui/settings/auto-detect.ts`: 4 functions/methods
- `public/modules/ui/settings/bindings.ts`: 2 functions/methods
- `public/modules/ui/settings/calibration.ts`: 6 functions/methods
- `public/modules/ui/settings/channel-ranges.ts`: 6 functions/methods
- `public/modules/ui/settings/constants.ts`: 4 functions/methods
- `public/modules/ui/settings/dom.ts`: 1 functions/methods
- `public/modules/ui/settings/mapping.ts`: 20 functions/methods
- `public/modules/ui/settings/observed-inputs.ts`: 7 functions/methods
- `public/modules/ui/settings/rendering.ts`: 17 functions/methods
- `public/modules/ui/settings/runtime-state.ts`: 1 functions/methods
- `public/modules/ui/settings/wizard.ts`: 32 functions/methods
- `public/modules/ui/sidebar.ts`: 4 functions/methods
- `public/modules/ui/simulation-notice.ts`: 2 functions/methods
- `public/modules/ui/stats.ts`: 1 functions/methods
- `public/modules/utils.ts`: 2 functions/methods
- `tests/cargo-contact.test.ts`: 1 functions/methods
- `tools/audit_and_refactor.ts`: 3 functions/methods
- `tools/generate_marker_dictionaries.mjs`: 5 functions/methods
- `tools/revert_lua.ts`: 2 functions/methods
- `tools/run_tests.ts`: 2 functions/methods

## Module `public/global.d.ts`

Client-side application code that wires page bootstrap and module initialization together.

### `OrbitControls.addEventListener`

- Full name: `OrbitControls.addEventListener`
- Location: `public/global.d.ts:41`
- Return type: `void`

**Signature**

```ts
addEventListener(type: string, listener: (event: any) => void): void;
```

**Parameters**

- `type: string`: message, state, or category discriminator.
- `listener: (event: any) => void`: input argument of type `(event: any) => void`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `OrbitControls.addEventListener` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `addEventListener` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
addEventListener(/* type */, /* listener */);
```

### `OrbitControls.dispatchEvent`

- Full name: `OrbitControls.dispatchEvent`
- Location: `public/global.d.ts:44`
- Return type: `void`

**Signature**

```ts
dispatchEvent(event: { type: string; target: any }): void;
```

**Parameters**

- `event: { type: string; target: any }`: input argument of type `{ type: string; target: any }`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `OrbitControls.dispatchEvent` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `dispatchEvent` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
dispatchEvent(/* event */);
```

### `OrbitControls.dispose`

- Full name: `OrbitControls.dispose`
- Location: `public/global.d.ts:38`
- Return type: `void`

**Signature**

```ts
dispose(): void;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `OrbitControls.dispose` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `dispose` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
dispose();
```

### `OrbitControls.getAzimuthalAngle`

- Full name: `OrbitControls.getAzimuthalAngle`
- Location: `public/global.d.ts:40`
- Return type: `number`

**Signature**

```ts
getAzimuthalAngle(): number;
```

**Parameters**

- No input parameters.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `OrbitControls.getAzimuthalAngle` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `getAzimuthalAngle` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getAzimuthalAngle();
```

### `OrbitControls.getPolarAngle`

- Full name: `OrbitControls.getPolarAngle`
- Location: `public/global.d.ts:39`
- Return type: `number`

**Signature**

```ts
getPolarAngle(): number;
```

**Parameters**

- No input parameters.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `OrbitControls.getPolarAngle` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `getPolarAngle` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getPolarAngle();
```

### `OrbitControls.hasEventListener`

- Full name: `OrbitControls.hasEventListener`
- Location: `public/global.d.ts:42`
- Return type: `boolean`

**Signature**

```ts
hasEventListener(type: string, listener: (event: any) => void): boolean;
```

**Parameters**

- `type: string`: message, state, or category discriminator.
- `listener: (event: any) => void`: input argument of type `(event: any) => void`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks for `OrbitControls.hasEventListener` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `hasEventListener` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
hasEventListener(/* type */, /* listener */);
```

### `OrbitControls.removeEventListener`

- Full name: `OrbitControls.removeEventListener`
- Location: `public/global.d.ts:43`
- Return type: `void`

**Signature**

```ts
removeEventListener(type: string, listener: (event: any) => void): void;
```

**Parameters**

- `type: string`: message, state, or category discriminator.
- `listener: (event: any) => void`: input argument of type `(event: any) => void`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `OrbitControls.removeEventListener` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `removeEventListener` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
removeEventListener(/* type */, /* listener */);
```

### `OrbitControls.reset`

- Full name: `OrbitControls.reset`
- Location: `public/global.d.ts:37`
- Return type: `void`

**Signature**

```ts
reset(): void;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `OrbitControls.reset` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `reset` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
reset();
```

### `OrbitControls.saveState`

- Full name: `OrbitControls.saveState`
- Location: `public/global.d.ts:36`
- Return type: `void`

**Signature**

```ts
saveState(): void;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `OrbitControls.saveState` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `saveState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
saveState();
```

### `OrbitControls.update`

- Full name: `OrbitControls.update`
- Location: `public/global.d.ts:35`
- Return type: `boolean`

**Signature**

```ts
update(): boolean;
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Updates `OrbitControls.update` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `update` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
update();
```

### `TransformControls.addEventListener`

- Full name: `TransformControls.addEventListener`
- Location: `public/global.d.ts:80`
- Return type: `void`

**Signature**

```ts
addEventListener(type: string, listener: (event: any) => void): void;
```

**Parameters**

- `type: string`: message, state, or category discriminator.
- `listener: (event: any) => void`: input argument of type `(event: any) => void`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `TransformControls.addEventListener` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `addEventListener` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
addEventListener(/* type */, /* listener */);
```

### `TransformControls.attach`

- Full name: `TransformControls.attach`
- Location: `public/global.d.ts:69`
- Return type: `this`

**Signature**

```ts
attach(object: Object3D): this;
```

**Parameters**

- `object: Object3D`: input argument of type `Object3D`.

**Return Value**

- Value of type `this` consumed by downstream logic.

**Purpose**

- Performs `TransformControls.attach` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `attach` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
attach(/* object */);
```

### `TransformControls.detach`

- Full name: `TransformControls.detach`
- Location: `public/global.d.ts:70`
- Return type: `this`

**Signature**

```ts
detach(): this;
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `this` consumed by downstream logic.

**Purpose**

- Performs `TransformControls.detach` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `detach` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
detach();
```

### `TransformControls.dispatchEvent`

- Full name: `TransformControls.dispatchEvent`
- Location: `public/global.d.ts:83`
- Return type: `void`

**Signature**

```ts
dispatchEvent(event: { type: string; target: any }): void;
```

**Parameters**

- `event: { type: string; target: any }`: input argument of type `{ type: string; target: any }`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `TransformControls.dispatchEvent` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `dispatchEvent` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
dispatchEvent(/* event */);
```

### `TransformControls.dispose`

- Full name: `TransformControls.dispose`
- Location: `public/global.d.ts:79`
- Return type: `void`

**Signature**

```ts
dispose(): void;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `TransformControls.dispose` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `dispose` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
dispose();
```

### `TransformControls.getMode`

- Full name: `TransformControls.getMode`
- Location: `public/global.d.ts:71`
- Return type: `'translate' | 'rotate' | 'scale'`

**Signature**

```ts
getMode(): 'translate' | 'rotate' | 'scale';
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `'translate' | 'rotate' | 'scale'` consumed by downstream logic.

**Purpose**

- Returns `TransformControls.getMode` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `getMode` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getMode();
```

### `TransformControls.hasEventListener`

- Full name: `TransformControls.hasEventListener`
- Location: `public/global.d.ts:81`
- Return type: `boolean`

**Signature**

```ts
hasEventListener(type: string, listener: (event: any) => void): boolean;
```

**Parameters**

- `type: string`: message, state, or category discriminator.
- `listener: (event: any) => void`: input argument of type `(event: any) => void`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks for `TransformControls.hasEventListener` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `hasEventListener` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
hasEventListener(/* type */, /* listener */);
```

### `TransformControls.removeEventListener`

- Full name: `TransformControls.removeEventListener`
- Location: `public/global.d.ts:82`
- Return type: `void`

**Signature**

```ts
removeEventListener(type: string, listener: (event: any) => void): void;
```

**Parameters**

- `type: string`: message, state, or category discriminator.
- `listener: (event: any) => void`: input argument of type `(event: any) => void`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `TransformControls.removeEventListener` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `removeEventListener` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
removeEventListener(/* type */, /* listener */);
```

### `TransformControls.reset`

- Full name: `TransformControls.reset`
- Location: `public/global.d.ts:78`
- Return type: `void`

**Signature**

```ts
reset(): void;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `TransformControls.reset` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `reset` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
reset();
```

### `TransformControls.setMode`

- Full name: `TransformControls.setMode`
- Location: `public/global.d.ts:72`
- Return type: `void`

**Signature**

```ts
setMode(mode: 'translate' | 'rotate' | 'scale'): void;
```

**Parameters**

- `mode: 'translate' | 'rotate' | 'scale'`: input argument of type `'translate' | 'rotate' | 'scale'`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `TransformControls.setMode` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `setMode` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setMode(/* mode */);
```

### `TransformControls.setRotationSnap`

- Full name: `TransformControls.setRotationSnap`
- Location: `public/global.d.ts:74`
- Return type: `void`

**Signature**

```ts
setRotationSnap(rotationSnap: number | null): void;
```

**Parameters**

- `rotationSnap: number | null`: input argument of type `number | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `TransformControls.setRotationSnap` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `setRotationSnap` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setRotationSnap(/* rotationSnap */);
```

### `TransformControls.setScaleSnap`

- Full name: `TransformControls.setScaleSnap`
- Location: `public/global.d.ts:75`
- Return type: `void`

**Signature**

```ts
setScaleSnap(scaleSnap: number | null): void;
```

**Parameters**

- `scaleSnap: number | null`: input argument of type `number | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `TransformControls.setScaleSnap` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `setScaleSnap` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setScaleSnap(/* scaleSnap */);
```

### `TransformControls.setSize`

- Full name: `TransformControls.setSize`
- Location: `public/global.d.ts:76`
- Return type: `void`

**Signature**

```ts
setSize(size: number): void;
```

**Parameters**

- `size: number`: input argument of type `number`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `TransformControls.setSize` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `setSize` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setSize(/* size */);
```

### `TransformControls.setSpace`

- Full name: `TransformControls.setSpace`
- Location: `public/global.d.ts:77`
- Return type: `void`

**Signature**

```ts
setSpace(space: 'world' | 'local'): void;
```

**Parameters**

- `space: 'world' | 'local'`: input argument of type `'world' | 'local'`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `TransformControls.setSpace` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `setSpace` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setSpace(/* space */);
```

### `TransformControls.setTranslationSnap`

- Full name: `TransformControls.setTranslationSnap`
- Location: `public/global.d.ts:73`
- Return type: `void`

**Signature**

```ts
setTranslationSnap(translationSnap: number | null): void;
```

**Parameters**

- `translationSnap: number | null`: input argument of type `number | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `TransformControls.setTranslationSnap` in the project runtime. It encapsulates one well-defined step of the module contract in `public/global.d.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/global.d.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `setTranslationSnap` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setTranslationSnap(/* translationSnap */);
```

## Module `public/main.ts`

Client-side application code that wires page bootstrap and module initialization together.

### `animate`

- Full name: `animate`
- Location: `public/main.ts:282`
- Return type: `void`

**Signature**

```ts
function animate(time: number) { animationFrameId = requestAnimationFrame(animate); if (!lastTime) lastTime = time; let dt = (time - lastTime) / 1000; if (dt > 0.1) dt = 0.1; // Cap dt lastTime = time; 
```

**Parameters**

- `time: number`: input argument of type `number`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `animate` in the project runtime. It encapsulates one well-defined step of the module contract in `public/main.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/main.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `animate` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
animate(/* time */);
```

### `init`

- Full name: `init`
- Location: `public/main.ts:61`
- Return type: `void`

**Signature**

```ts
function init() { log('Инициализация системы...', 'info'); // Initialize UI with callbacks initUI({ onRun: startSimulation, onStop: stopSimulation, onRestart: resetSimulation,
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `init` in the project runtime. It encapsulates one well-defined step of the module contract in `public/main.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/main.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `init` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
init();
```

### `loadFileContent`

- Full name: `loadFileContent`
- Location: `public/main.ts:271`
- Return type: `Promise<void>`

**Signature**

```ts
async function loadFileContent(path: string) { try { const res = await fetch(`/api/file-content?path=${encodeURIComponent(path)}`); const data = await res.json(); setEditorValue(data.content); log(`Файл загружен: ${path}`, 'success'); } catch (e) { log('Ошибка загрузки файла', 'error');
```

**Parameters**

- `path: string`: input argument of type `string`.

**Return Value**

- Promise resolved when the asynchronous workflow completes.

**Purpose**

- Performs `loadFileContent` in the project runtime. It encapsulates one well-defined step of the module contract in `public/main.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/main.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `loadFileContent` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
loadFileContent(/* path */);
```

### `resetSimulation`

- Full name: `resetSimulation`
- Location: `public/main.ts:251`
- Return type: `void`

**Signature**

```ts
function resetSimulation() { stopSimulation(); for (const id in drones) { resetState(id); // СБРОС должен мгновенно вернуть дрон в начало координат (0,0,0) // resetState() сбрасывает "управляющую/физическую" часть, но не позу. const drone = drones[id];
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `resetSimulation` in the project runtime. It encapsulates one well-defined step of the module contract in `public/main.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/main.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `resetSimulation` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetSimulation();
```

### `scriptHasVisibleDelay`

- Full name: `scriptHasVisibleDelay`
- Location: `public/main.ts:36`
- Return type: `boolean`

**Signature**

```ts
function scriptHasVisibleDelay(language: ScriptLanguage, code: string) { const normalized = (code || '').toLowerCase(); if (language === 'python') { return /\b(time|asyncio)\.sleep\s*\(/.test(normalized) || /\bawait\s+asyncio\.sleep\s*\(/.test(normalized); } return /\bsleep\s*\(/.test(normalized) || /\btimer\.(calllater|new)\s*\(/.test(normalized); }
```

**Parameters**

- `language: ScriptLanguage`: selected runtime language identifier.
- `code: string`: source code text that will be executed.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `scriptHasVisibleDelay` in the project runtime. It encapsulates one well-defined step of the module contract in `public/main.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/main.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `scriptHasVisibleDelay` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
scriptHasVisibleDelay(/* language */, '// script body');
```

### `startSimulation`

- Full name: `startSimulation`
- Location: `public/main.ts:133`
- Return type: `void`

**Signature**

```ts
function startSimulation() { log(`[DEBUG] startSimulation called. currentDroneId: ${currentDroneId}`, 'info'); // Run all drones let anyStarted = false; // First save current editor code to the currently selected drone if (drones[currentDroneId]) {
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Starts `startSimulation` in the project runtime. It encapsulates one well-defined step of the module contract in `public/main.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/main.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `startSimulation` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
startSimulation();
```

### `stopSimulation`

- Full name: `stopSimulation`
- Location: `public/main.ts:238`
- Return type: `void`

**Signature**

```ts
function stopSimulation() { for (const id in drones) { const drone = drones[id]; if (drone.running) { stopLuaScript(id); stopPythonScript(id); drone.running = false; drone.status = 'ОСТАНОВЛЕН';
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Stops or finalizes `stopSimulation` in the project runtime. It encapsulates one well-defined step of the module contract in `public/main.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/main.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `stopSimulation` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
stopSimulation();
```

### `warnAboutInstantExecution`

- Full name: `warnAboutInstantExecution`
- Location: `public/main.ts:44`
- Return type: `void`

**Signature**

```ts
function warnAboutInstantExecution(language: ScriptLanguage) { const sleepSyntax = language === 'python' ? '`time.sleep()`' : '`sleep()`'; const message = `В скрипте нет пауз ${sleepSyntax}: команды уйдут почти мгновенно, а анимация может выглядеть слишком быстрой. Добавьте задержки между arm/takeoff/goto/land.`; log(message, 'warn'); if ((window as any).showSimulationNotice) { (window as any).showSimulationNotice(message, 'warn'); } }
```

**Parameters**

- `language: ScriptLanguage`: selected runtime language identifier.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `warnAboutInstantExecution` in the project runtime. It encapsulates one well-defined step of the module contract in `public/main.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/main.ts`. Client-side application code that wires page bootstrap and module initialization together. In practice, it isolates the implementation details of `warnAboutInstantExecution` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
warnAboutInstantExecution(/* language */);
```

## Module `public/modules/camera.ts`

Core simulator module. Contains shared runtime logic, state management, or foundational services.

### `syncOrbitControlsFromCamera`

- Full name: `syncOrbitControlsFromCamera`
- Location: `public/modules/camera.ts:4`
- Return type: `void`

**Signature**

```ts
function syncOrbitControlsFromCamera(camera: THREE.PerspectiveCamera, controls: any) { if (!controls) return; const offset = new THREE.Vector3().subVectors(camera.position, controls.target); controls.radius = offset.length() || 10; controls.elevation = Math.asin(Math.max(-1, Math.min(1, offset.z / controls.radius))); controls.azimuth = Math.atan2(offset.y, offset.x); }
```

**Parameters**

- `camera: THREE.PerspectiveCamera`: input argument of type `THREE.PerspectiveCamera`.
- `controls: any`: input argument of type `any`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `syncOrbitControlsFromCamera` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/camera.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/camera.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `syncOrbitControlsFromCamera` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncOrbitControlsFromCamera(/* camera */, /* controls */);
```

### `updateCamera`

- Full name: `updateCamera`
- Location: `public/modules/camera.ts:12`
- Return type: `void`

**Signature**

```ts
export function updateCamera(camera: THREE.PerspectiveCamera, droneMesh: THREE.Object3D | null, controls: any, mode: string) { if (!camera) return; const overlay = document.getElementById('fpv-overlay'); if (controls) { const isTransforming = (window as any).isTransforming || false; controls.enabled = (mode === 'free' && !isTransforming);
```

**Parameters**

- `camera: THREE.PerspectiveCamera`: input argument of type `THREE.PerspectiveCamera`.
- `droneMesh: THREE.Object3D | null`: input argument of type `THREE.Object3D | null`.
- `controls: any`: input argument of type `any`.
- `mode: string`: input argument of type `string`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateCamera` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/camera.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/camera.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `updateCamera` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateCamera(/* camera */, /* droneMesh */, /* controls */, /* mode */);
```

## Module `public/modules/drone-model.ts`

Core simulator module. Contains shared runtime logic, state management, or foundational services.

### `animateRotors`

- Full name: `animateRotors`
- Location: `public/modules/drone-model.ts:85`
- Return type: `void`

**Signature**

```ts
export function animateRotors(droneMesh: THREE.Object3D, dt: number, droneState: any) { const isArmed = droneState.status !== 'ГОТОВ' && droneState.status !== 'IDLE' && droneState.status !== 'ПРИЗЕМЛЕН' && droneState.status !== 'ОСТАНОВЛЕН' && droneState.status !== 'ЗАПУСК' && droneState.status !== 'ОШИБКА' && droneState.status !== 'CRASHED';
```

**Parameters**

- `droneMesh: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `dt: number`: simulation time step in seconds.
- `droneState: any`: input argument of type `any`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `animateRotors` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone-model.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone-model.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `animateRotors` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
animateRotors(/* droneMesh */, 0.016, /* droneState */);
```

### `createDroneModel`

- Full name: `createDroneModel`
- Location: `public/modules/drone-model.ts:11`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createDroneModel() { const droneGroup = new THREE.Group(); // Materials const carbonMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4, metalness: 0.3 }); const pcbMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.6 }); const plasticMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }); const motorMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.8 });
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createDroneModel` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone-model.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone-model.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `createDroneModel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createDroneModel();
```

### `updateLEDs`

- Full name: `updateLEDs`
- Location: `public/modules/drone-model.ts:44`
- Return type: `void`

**Signature**

```ts
export function updateLEDs(droneMesh: THREE.Object3D, droneState: any) { if (!droneState.leds || droneState.leds.length === 0) return; // Update Base LEDs (0-3) for (let i = 0; i < 4; i++) { const led = droneState.leds[i] || {r:0, g:0, b:0, w:0}; const ledMesh = droneMesh.getObjectByName(`base_led_${i}`) as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial> | undefined; 
```

**Parameters**

- `droneMesh: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `droneState: any`: input argument of type `any`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateLEDs` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone-model.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone-model.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `updateLEDs` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateLEDs(/* droneMesh */, /* droneState */);
```

## Module `public/modules/drone-model/camera-antenna.ts`

Drone model construction module. Builds reusable visual pieces of the drone mesh.

### `createCameraAndAntenna`

- Full name: `createCameraAndAntenna`
- Location: `public/modules/drone-model/camera-antenna.ts:3`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createCameraAndAntenna() { const group = new THREE.Group(); // Camera Module (Front - now pointing along Y) const camGroup = new THREE.Group(); // Move to front along Y camGroup.position.set(0, 0.07, 0.02); 
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createCameraAndAntenna` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone-model/camera-antenna.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone-model/camera-antenna.ts`. Drone model construction module. Builds reusable visual pieces of the drone mesh. In practice, it isolates the implementation details of `createCameraAndAntenna` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createCameraAndAntenna();
```

## Module `public/modules/drone-model/frame.ts`

Drone model construction module. Builds reusable visual pieces of the drone mesh.

### `createFrame`

- Full name: `createFrame`
- Location: `public/modules/drone-model/frame.ts:3`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createFrame(carbonMat: THREE.Material, pcbMat: THREE.Material, plasticMat: THREE.Material) { const frameGroup = new THREE.Group(); // Frame Plates const plateGeom = new THREE.BoxGeometry(0.14, 0.14, 0.002); const bottomPlate = new THREE.Mesh(plateGeom, carbonMat); bottomPlate.position.z = -0.015; bottomPlate.castShadow = true;
```

**Parameters**

- `carbonMat: THREE.Material`: input argument of type `THREE.Material`.
- `pcbMat: THREE.Material`: input argument of type `THREE.Material`.
- `plasticMat: THREE.Material`: input argument of type `THREE.Material`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createFrame` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone-model/frame.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone-model/frame.ts`. Drone model construction module. Builds reusable visual pieces of the drone mesh. In practice, it isolates the implementation details of `createFrame` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createFrame(/* carbonMat */, /* pcbMat */, /* plasticMat */);
```

### `createGuard`

- Full name: `createGuard`
- Location: `public/modules/drone-model/frame.ts:129`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
function createGuard() { const guardGroup = new THREE.Group(); const guardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, roughness: 0, metalness: 0.2,
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createGuard` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone-model/frame.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone-model/frame.ts`. Drone model construction module. Builds reusable visual pieces of the drone mesh. In practice, it isolates the implementation details of `createGuard` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createGuard();
```

### `createLegs`

- Full name: `createLegs`
- Location: `public/modules/drone-model/frame.ts:102`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
function createLegs(mat: THREE.Material) { const legGroup = new THREE.Group(); // Blade-like leg geometry const legGeom = new THREE.BoxGeometry(0.12, 0.015, 0.002); const offsets = [ [0.05, 0.05], [0.05, -0.05], [-0.05, 0.05], [-0.05, -0.05]
```

**Parameters**

- `mat: THREE.Material`: input argument of type `THREE.Material`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createLegs` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone-model/frame.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone-model/frame.ts`. Drone model construction module. Builds reusable visual pieces of the drone mesh. In practice, it isolates the implementation details of `createLegs` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createLegs(/* mat */);
```

## Module `public/modules/drone-model/leds.ts`

Drone model construction module. Builds reusable visual pieces of the drone mesh.

### `createLEDs`

- Full name: `createLEDs`
- Location: `public/modules/drone-model/leds.ts:3`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createLEDs() { const ledGroup = new THREE.Group(); // 4 Base LEDs (under the motors or on the arms, let's put them on the arms) const baseLedOffsets = [ [0.04, 0.04], // FR [0.04, -0.04], // BR [-0.04, -0.04], // BL
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createLEDs` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone-model/leds.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone-model/leds.ts`. Drone model construction module. Builds reusable visual pieces of the drone mesh. In practice, it isolates the implementation details of `createLEDs` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createLEDs();
```

## Module `public/modules/drone-model/motors.ts`

Drone model construction module. Builds reusable visual pieces of the drone mesh.

### `createMotors`

- Full name: `createMotors`
- Location: `public/modules/drone-model/motors.ts:3`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createMotors(motorMat: THREE.Material, hubMat: THREE.Material, propMatCW: THREE.Material, propMatCCW: THREE.Material) { const motorsGroup = new THREE.Group(); const motorGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.02, 16); const armLen = 0.16; const motorOffsets = [ [armLen, -armLen], // FR [-armLen, armLen], // BL
```

**Parameters**

- `motorMat: THREE.Material`: input argument of type `THREE.Material`.
- `hubMat: THREE.Material`: input argument of type `THREE.Material`.
- `propMatCW: THREE.Material`: input argument of type `THREE.Material`.
- `propMatCCW: THREE.Material`: input argument of type `THREE.Material`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createMotors` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone-model/motors.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone-model/motors.ts`. Drone model construction module. Builds reusable visual pieces of the drone mesh. In practice, it isolates the implementation details of `createMotors` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createMotors(/* motorMat */, /* hubMat */, /* propMatCW */, /* propMatCCW */);
```

## Module `public/modules/drone.ts`

Core simulator module. Contains shared runtime logic, state management, or foundational services.

### `getObstacles`

- Full name: `getObstacles`
- Location: `public/modules/drone.ts:104`
- Return type: `Object3D<Object3DEventMap>[]`

**Signature**

```ts
export function getObstacles() { return envGroup ? envGroup.children : []; }
```

**Parameters**

- No input parameters.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Returns `getObstacles` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `getObstacles` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getObstacles();
```

### `init3D`

- Full name: `init3D`
- Location: `public/modules/drone.ts:58`
- Return type: `void`

**Signature**

```ts
export function init3D(container: HTMLElement) { try { initScene(container); setupTransformControlListeners(); transformControl.addEventListener('mouseDown', () => setIsHittingGizmo(true)); transformControl.addEventListener('mouseUp', () => setIsHittingGizmo(false)); 
```

**Parameters**

- `container: HTMLElement`: input argument of type `HTMLElement`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `init3D` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `init3D` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
init3D(/* container */);
```

### `syncDrones`

- Full name: `syncDrones`
- Location: `public/modules/drone.ts:85`
- Return type: `void`

**Signature**

```ts
export function syncDrones() { for (const id in drones) { if (!droneMeshes[id]) { const mesh = createDroneModel(); mesh.up.set(0, 0, 1); scene.add(mesh); droneMeshes[id] = mesh; initTrailForDrone(id);
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `syncDrones` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `syncDrones` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncDrones();
```

### `updateDrone3D`

- Full name: `updateDrone3D`
- Location: `public/modules/drone.ts:108`
- Return type: `void`

**Signature**

```ts
export function updateDrone3D(dt: number) { if (!is3DActive || !renderer || !camera) return; const cameraMode = (window as any).cameraMode || 'drone'; if (simState.running && transformControl && transformControl.object) { log(`[3DDBG] updateDrone3D detach while running target=${(transformControl.object as any).name || 'unknown'}`, 'info'); transformControl.detach(); if (transformHelper) transformHelper.visible = false;
```

**Parameters**

- `dt: number`: simulation time step in seconds.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateDrone3D` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `updateDrone3D` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateDrone3D(0.016);
```

## Module `public/modules/drone/crash-visuals.ts`

Drone visual behavior module. Handles trails, scene events, and crash/debris visuals.

### `explodeDrone`

- Full name: `explodeDrone`
- Location: `public/modules/drone/crash-visuals.ts:5`
- Return type: `void`

**Signature**

```ts
export function explodeDrone(id: string, mesh: THREE.Object3D) { if (explodedDrones.has(id)) return; explodedDrones.add(id); console.log(`[Visuals] Exploding drone ${id}`); const partsToExplode: THREE.Object3D[] = []; try { const mainComponents = [
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.
- `mesh: THREE.Object3D`: Three.js object or mesh operated on by the function.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `explodeDrone` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/crash-visuals.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/crash-visuals.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `explodeDrone` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
explodeDrone('drone_1', /* ... */);
```

### `resetDroneVisuals`

- Full name: `resetDroneVisuals`
- Location: `public/modules/drone/crash-visuals.ts:69`
- Return type: `void`

**Signature**

```ts
export function resetDroneVisuals(id: string, mesh: THREE.Object3D) { if (!explodedDrones.has(id)) return; explodedDrones.delete(id); const parts = [...mesh.children]; parts.forEach((part) => { if (!part.userData.originalParent) return; part.userData.originalParent.add(part);
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.
- `mesh: THREE.Object3D`: Three.js object or mesh operated on by the function.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `resetDroneVisuals` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/crash-visuals.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/crash-visuals.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `resetDroneVisuals` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetDroneVisuals('drone_1', /* ... */);
```

### `updateDebrisVisuals`

- Full name: `updateDebrisVisuals`
- Location: `public/modules/drone/crash-visuals.ts:90`
- Return type: `void`

**Signature**

```ts
export function updateDebrisVisuals(mesh: THREE.Object3D, dt: number) { try { mesh.children.forEach((part) => { if (!part.userData.vel) return; const vel = part.userData.vel as THREE.Vector3; const rotVel = part.userData.rotVel as THREE.Vector3; // Если объект уже "лежит" на земле, ничего не делаем
```

**Parameters**

- `mesh: THREE.Object3D`: Three.js object or mesh operated on by the function.
- `dt: number`: simulation time step in seconds.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateDebrisVisuals` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/crash-visuals.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/crash-visuals.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `updateDebrisVisuals` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateDebrisVisuals(/* ... */, 0.016);
```

## Module `public/modules/drone/scene-events.ts`

Drone visual behavior module. Handles trails, scene events, and crash/debris visuals.

### `handleSceneKeyDown`

- Full name: `handleSceneKeyDown`
- Location: `public/modules/drone/scene-events.ts:42`
- Return type: `void`

**Signature**

```ts
export function handleSceneKeyDown(event: KeyboardEvent) { const target = event.target as HTMLElement; if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target.closest && target.closest('.monaco-editor'))) return; if (event.key.toLowerCase() === 'escape') { if (transformControl?.object || selectedObject) handleDeselection(); return; }
```

**Parameters**

- `event: KeyboardEvent`: input argument of type `KeyboardEvent`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `handleSceneKeyDown` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/scene-events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/scene-events.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `handleSceneKeyDown` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
handleSceneKeyDown(/* event */);
```

### `isScenePointerEvent`

- Full name: `isScenePointerEvent`
- Location: `public/modules/drone/scene-events.ts:10`
- Return type: `boolean`

**Signature**

```ts
function isScenePointerEvent(event: PointerEvent) { if (!renderer?.domElement) return false; const path = typeof event.composedPath === 'function' ? event.composedPath() : []; return path.includes(renderer.domElement) || event.target === renderer.domElement; }
```

**Parameters**

- `event: PointerEvent`: input argument of type `PointerEvent`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isScenePointerEvent` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/scene-events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/scene-events.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `isScenePointerEvent` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isScenePointerEvent(/* event */);
```

### `registerScenePointerHandlers`

- Full name: `registerScenePointerHandlers`
- Location: `public/modules/drone/scene-events.ts:16`
- Return type: `void`

**Signature**

```ts
export function registerScenePointerHandlers() { if (!renderer?.domElement) return; if (scenePointerDownCaptureHandler) { document.removeEventListener('pointerdown', scenePointerDownCaptureHandler, true); } if (scenePointerUpCaptureHandler) { document.removeEventListener('pointerup', scenePointerUpCaptureHandler, true);
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `registerScenePointerHandlers` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/scene-events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/scene-events.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `registerScenePointerHandlers` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
registerScenePointerHandlers();
```

## Module `public/modules/drone/trails.ts`

Drone visual behavior module. Handles trails, scene events, and crash/debris visuals.

### `disposeTrailForDrone`

- Full name: `disposeTrailForDrone`
- Location: `public/modules/drone/trails.ts:75`
- Return type: `void`

**Signature**

```ts
export function disposeTrailForDrone(id: string) { if (!droneTrails[id]) return; scene.remove(droneTrails[id].path); scene.remove(droneTrails[id].particles); droneTrails[id].lineGeometry.dispose(); droneTrails[id].pointsGeometry.dispose(); (droneTrails[id].path.material as LineMaterial).dispose(); (droneTrails[id].particles.material as THREE.PointsMaterial).dispose();
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `disposeTrailForDrone` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/trails.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/trails.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `disposeTrailForDrone` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
disposeTrailForDrone('drone_1');
```

### `getTracerColorHex`

- Full name: `getTracerColorHex`
- Location: `public/modules/drone/trails.ts:9`
- Return type: `number`

**Signature**

```ts
function getTracerColorHex() { const color = new THREE.Color(simSettings.tracerColor || '#38bdf8'); return color.getHex(); }
```

**Parameters**

- No input parameters.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `getTracerColorHex` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/trails.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/trails.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `getTracerColorHex` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getTracerColorHex();
```

### `getTracerPointSize`

- Full name: `getTracerPointSize`
- Location: `public/modules/drone/trails.ts:18`
- Return type: `number`

**Signature**

```ts
function getTracerPointSize() { return Math.max(0.08, getTracerWidthPx() * 0.08); }
```

**Parameters**

- No input parameters.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `getTracerPointSize` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/trails.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/trails.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `getTracerPointSize` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getTracerPointSize();
```

### `getTracerWidthPx`

- Full name: `getTracerWidthPx`
- Location: `public/modules/drone/trails.ts:14`
- Return type: `number`

**Signature**

```ts
function getTracerWidthPx() { return Math.max(1, Number(simSettings.tracerWidth) || 1); }
```

**Parameters**

- No input parameters.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `getTracerWidthPx` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/trails.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/trails.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `getTracerWidthPx` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getTracerWidthPx();
```

### `initTrailForDrone`

- Full name: `initTrailForDrone`
- Location: `public/modules/drone/trails.ts:30`
- Return type: `void`

**Signature**

```ts
export function initTrailForDrone(id: string) { const lineGeometry = new LineGeometry(); log(`[3D-INIT] Инициализация трейла для ${id}`, 'info'); const pointsGeometry = new THREE.BufferGeometry(); const positions = new Float32Array(MAX_PATH_POINTS * 3); pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); pointsGeometry.setDrawRange(0, 0);
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initTrailForDrone` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/trails.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/trails.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `initTrailForDrone` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initTrailForDrone('drone_1');
```

### `shouldShowTracerLine`

- Full name: `shouldShowTracerLine`
- Location: `public/modules/drone/trails.ts:22`
- Return type: `boolean`

**Signature**

```ts
function shouldShowTracerLine() { return simSettings.tracerShape === 'line' || simSettings.tracerShape === 'both'; }
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `shouldShowTracerLine` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/trails.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/trails.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `shouldShowTracerLine` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
shouldShowTracerLine();
```

### `shouldShowTracerPoints`

- Full name: `shouldShowTracerPoints`
- Location: `public/modules/drone/trails.ts:26`
- Return type: `boolean`

**Signature**

```ts
function shouldShowTracerPoints() { return simSettings.tracerShape === 'points' || simSettings.tracerShape === 'both'; }
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `shouldShowTracerPoints` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/trails.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/trails.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `shouldShowTracerPoints` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
shouldShowTracerPoints();
```

### `updateTrailForDrone`

- Full name: `updateTrailForDrone`
- Location: `public/modules/drone/trails.ts:86`
- Return type: `void`

**Signature**

```ts
export function updateTrailForDrone(id: string) { if (!is3DActive || !droneTrails[id]) return; const pts = pathPoints[id] || []; const trail = droneTrails[id]; if (simSettings.showTracer && pts.length > 1) { const pointPositions = trail.pointsGeometry.attributes.position.array as Float32Array;
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateTrailForDrone` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/drone/trails.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/drone/trails.ts`. Drone visual behavior module. Handles trails, scene events, and crash/debris visuals. In practice, it isolates the implementation details of `updateTrailForDrone` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateTrailForDrone('drone_1');
```

## Module `public/modules/editor.ts`

Core simulator module. Contains shared runtime logic, state management, or foundational services.

### `createEditor`

- Full name: `createEditor`
- Location: `public/modules/editor.ts:50`
- Return type: `void`

**Signature**

```ts
function createEditor() { setupSyntaxHighlighting(monaco); setupHoverProvider(monaco); setupCompletionProvider(monaco); const initialLanguage: ScriptLanguage = pendingLanguage || 'lua'; const initialMonacoLang = initialLanguage === 'lua' ? 'lua' : 'python'; const initialValue =
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Creates `createEditor` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `createEditor` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createEditor();
```

### `fallbackEditor`

- Full name: `fallbackEditor`
- Location: `public/modules/editor.ts:38`
- Return type: `void`

**Signature**

```ts
function fallbackEditor() { const ed = document.getElementById('editor'); if (ed) { ed.innerHTML = '<div style="color:red; padding:20px;">Failed to load Monaco Editor. Please check your internet connection. Falling back to simple textarea.</div><textarea id="fallback-editor" style="width:100%; height:90%; background:#1e1e1e; color:#d4d4d4; font-family:monospace; padding:10px; border:none; resize:none;">-- Pioneer Lua Script\n\nap.push(Ev.MCE_TAKEOFF)</textarea>'; (window as any).getEditorValueFallback = () => (document.getElementById('fallback-editor') as HTMLTextAreaElement).value; (window as any).setEditorValueFallback = (val: string) => { const el = document.getElementById('fallback-editor') as HTMLTextAreaElement; if(el) el.value = val;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `fallbackEditor` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `fallbackEditor` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
fallbackEditor();
```

### `getEditorValue`

- Full name: `getEditorValue`
- Location: `public/modules/editor.ts:80`
- Return type: `string`

**Signature**

```ts
export function getEditorValue(): string { if ((window as any).getEditorValueFallback) return (window as any).getEditorValueFallback(); return editorInstance ? editorInstance.getValue() : ''; }
```

**Parameters**

- No input parameters.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Returns `getEditorValue` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `getEditorValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getEditorValue();
```

### `initEditor`

- Full name: `initEditor`
- Location: `public/modules/editor.ts:20`
- Return type: `void`

**Signature**

```ts
export function initEditor() { if (typeof monaco !== 'undefined') { createEditor(); return; } require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }}); 
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initEditor` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `initEditor` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initEditor();
```

### `layoutEditor`

- Full name: `layoutEditor`
- Location: `public/modules/editor.ts:103`
- Return type: `void`

**Signature**

```ts
export function layoutEditor() { if (editorInstance) editorInstance.layout(); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `layoutEditor` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `layoutEditor` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
layoutEditor();
```

### `setEditorLanguage`

- Full name: `setEditorLanguage`
- Location: `public/modules/editor.ts:91`
- Return type: `void`

**Signature**

```ts
export function setEditorLanguage(language: ScriptLanguage) { if ((window as any).getEditorValueFallback) return; if (!editorInstance || !monaco) { pendingLanguage = language; return; } const model = editorInstance.getModel ? editorInstance.getModel() : null; if (!model) return;
```

**Parameters**

- `language: ScriptLanguage`: selected runtime language identifier.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setEditorLanguage` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `setEditorLanguage` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setEditorLanguage(/* language */);
```

### `setEditorValue`

- Full name: `setEditorValue`
- Location: `public/modules/editor.ts:85`
- Return type: `any`

**Signature**

```ts
export function setEditorValue(val: string) { if ((window as any).setEditorValueFallback) return (window as any).setEditorValueFallback(val); if (editorInstance) editorInstance.setValue(val); else pendingValue = val; }
```

**Parameters**

- `val: string`: input argument of type `string`.

**Return Value**

- Loosely typed result; callers must interpret it based on the surrounding runtime contract.

**Purpose**

- Sets `setEditorValue` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `setEditorValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setEditorValue(/* val */);
```

## Module `public/modules/editor/completion.ts`

Monaco editor support module. Provides completion, hover information, and syntax configuration.

### `setupCompletionProvider`

- Full name: `setupCompletionProvider`
- Location: `public/modules/editor/completion.ts:3`
- Return type: `void`

**Signature**

```ts
export function setupCompletionProvider(monaco: any) { monaco.languages.registerCompletionItemProvider('lua', { provideCompletionItems: function(model: any, position: any) { const word = model.getWordUntilPosition(position); const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn,
```

**Parameters**

- `monaco: any`: input argument of type `any`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setupCompletionProvider` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor/completion.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor/completion.ts`. Monaco editor support module. Provides completion, hover information, and syntax configuration. In practice, it isolates the implementation details of `setupCompletionProvider` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setupCompletionProvider(/* monaco */);
```

## Module `public/modules/editor/hover.ts`

Monaco editor support module. Provides completion, hover information, and syntax configuration.

### `getFullWordAtPosition`

- Full name: `getFullWordAtPosition`
- Location: `public/modules/editor/hover.ts:68`
- Return type: `string`

**Signature**

```ts
function getFullWordAtPosition(line: string, index: number) { let start = index; while (start > 0 && /[\w.]/.test(line[start - 1])) start--; let end = index; while (end < line.length && /[\w.]/.test(line[end])) end++; return line.substring(start, end);
```

**Parameters**

- `line: string`: input argument of type `string`.
- `index: number`: input argument of type `number`.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Returns `getFullWordAtPosition` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor/hover.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor/hover.ts`. Monaco editor support module. Provides completion, hover information, and syntax configuration. In practice, it isolates the implementation details of `getFullWordAtPosition` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getFullWordAtPosition(/* line */, /* index */);
```

### `setupHoverProvider`

- Full name: `setupHoverProvider`
- Location: `public/modules/editor/hover.ts:3`
- Return type: `void`

**Signature**

```ts
export function setupHoverProvider(monaco: any) { monaco.languages.registerHoverProvider('lua', { provideHover: function(model: any, position: any) { const word = model.getWordAtPosition(position); if (!word) return; const line = model.getLineContent(position.lineNumber); const fullWord = getFullWordAtPosition(line, position.column - 1);
```

**Parameters**

- `monaco: any`: input argument of type `any`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setupHoverProvider` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor/hover.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor/hover.ts`. Monaco editor support module. Provides completion, hover information, and syntax configuration. In practice, it isolates the implementation details of `setupHoverProvider` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setupHoverProvider(/* monaco */);
```

## Module `public/modules/editor/syntax.ts`

Monaco editor support module. Provides completion, hover information, and syntax configuration.

### `setupSyntaxHighlighting`

- Full name: `setupSyntaxHighlighting`
- Location: `public/modules/editor/syntax.ts:1`
- Return type: `void`

**Signature**

```ts
export function setupSyntaxHighlighting(monaco: any) { monaco.languages.setMonarchTokensProvider('lua', { tokenizer: { root: [ // Pioneer Modules [/\b(ap|Sensors|Timer|Ledbar|camera|Gpio|Uart|Spi|mailbox)\b/, "keyword.class"], // Pioneer Methods (generic matcher for simplicity, specific ones handled by autocomplete)
```

**Parameters**

- `monaco: any`: input argument of type `any`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setupSyntaxHighlighting` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/editor/syntax.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/editor/syntax.ts`. Monaco editor support module. Provides completion, hover information, and syntax configuration. In practice, it isolates the implementation details of `setupSyntaxHighlighting` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setupSyntaxHighlighting(/* monaco */);
```

## Module `public/modules/environment.ts`

Core simulator module. Contains shared runtime logic, state management, or foundational services.

### `addObjectToScene`

- Full name: `addObjectToScene`
- Location: `public/modules/environment.ts:66`
- Return type: `Object3D<Object3DEventMap>`

**Signature**

```ts
export function addObjectToScene(type: string, camera?: THREE.Camera | null, options: SceneObjectOptions = {}) { if (!envGroup) return null; let obj: THREE.Object3D | undefined; if (type === 'gate') obj = createGateMesh(); else if (type === 'pylon') obj = createPylonMesh(); else if (type === 'flag') obj = createFlagMesh(); else if (type === 'building') obj = createApartmentBuildingMesh(options); else if (type === 'aruco') obj = createArucoMarkerMesh(options.value || '0', options.markerDictionary);
```

**Parameters**

- `type: string`: message, state, or category discriminator.
- `camera?: THREE.Camera | null`: input argument of type `THREE.Camera | null`.
- `options?: SceneObjectOptions`: input argument of type `SceneObjectOptions`.

**Return Value**

- Value of type `Object3D<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Performs `addObjectToScene` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/environment.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `addObjectToScene` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
addObjectToScene(/* type */, /* camera */, /* options */);
```

### `setupEnvironment`

- Full name: `setupEnvironment`
- Location: `public/modules/environment.ts:50`
- Return type: `void`

**Signature**

```ts
export function setupEnvironment(scene: THREE.Scene) { setupLights(scene); envGroup = new THREE.Group(); scene.add(envGroup); createGround(scene, envGroup); createObstacles(envGroup);
```

**Parameters**

- `scene: THREE.Scene`: Three.js scene instance used as the target container.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setupEnvironment` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/environment.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `setupEnvironment` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setupEnvironment(/* ... */);
```

### `updateSceneObjectPoints`

- Full name: `updateSceneObjectPoints`
- Location: `public/modules/environment.ts:129`
- Return type: `boolean`

**Signature**

```ts
export function updateSceneObjectPoints(object: THREE.Object3D, points: ScenePathPoint[]) { return updateLinearFeaturePoints(object, points); }
```

**Parameters**

- `object: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `points: ScenePathPoint[]`: input argument of type `ScenePathPoint[]`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Updates `updateSceneObjectPoints` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/environment.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `updateSceneObjectPoints` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateSceneObjectPoints(/* object */, /* points */);
```

### `updateSceneObjectValue`

- Full name: `updateSceneObjectValue`
- Location: `public/modules/environment.ts:116`
- Return type: `boolean`

**Signature**

```ts
export function updateSceneObjectValue( object: THREE.Object3D, params: { value?: string; markerDictionary?: string; floors?: number } ) { if (object.userData?.type === 'Многоэтажка') { return updateApartmentBuildingMetadata(object, { value: params.value, floors: params.floors
```

**Parameters**

- `object: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `params: { value?: string; markerDictionary?: string; floors?: number }`: aggregated call parameters object.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Updates `updateSceneObjectValue` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/environment.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `updateSceneObjectValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateSceneObjectValue(/* object */, /* ... */);
```

## Module `public/modules/environment/ground.ts`

Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements.

### `createAxesLabels`

- Full name: `createAxesLabels`
- Location: `public/modules/environment/ground.ts:155`
- Return type: `void`

**Signature**

```ts
export function createAxesLabels(scene: THREE.Scene) { const makeLabel = (text: string, pos: THREE.Vector3, color: string) => { const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64; const ctx = canvas.getContext('2d'); if (ctx) { ctx.fillStyle = color; ctx.font = 'bold 48px monospace';
```

**Parameters**

- `scene: THREE.Scene`: Three.js scene instance used as the target container.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Creates `createAxesLabels` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/ground.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/ground.ts`. Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements. In practice, it isolates the implementation details of `createAxesLabels` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createAxesLabels(/* ... */);
```

### `createAxesLabels.makeLabel`

- Full name: `createAxesLabels.makeLabel`
- Location: `public/modules/environment/ground.ts:156`
- Return type: `void`

**Signature**

```ts
(text: string, pos: THREE.Vector3, color: string) => { const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64; const ctx = canvas.getContext('2d'); if (ctx) { ctx.fillStyle = color; ctx.font = 'bold 48px monospace'; ctx.textAlign = 'center';
```

**Parameters**

- `text: string`: input argument of type `string`.
- `pos: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `color: string`: input argument of type `string`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `createAxesLabels.makeLabel` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/ground.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/ground.ts`. Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements. In practice, it isolates the implementation details of `makeLabel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
makeLabel(/* text */, /* pos */, /* color */);
```

### `createGround`

- Full name: `createGround`
- Location: `public/modules/environment/ground.ts:5`
- Return type: `void`

**Signature**

```ts
export function createGround(scene: THREE.Scene, envGroup: THREE.Group) { const groundSize = 200; const groundGeom = new THREE.PlaneGeometry(groundSize, groundSize); const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 1024; const ctx = canvas.getContext('2d'); if (ctx) {
```

**Parameters**

- `scene: THREE.Scene`: Three.js scene instance used as the target container.
- `envGroup: THREE.Group`: scene group that owns generated environment meshes.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Creates `createGround` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/ground.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/ground.ts`. Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements. In practice, it isolates the implementation details of `createGround` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createGround(/* ... */, /* envGroup */);
```

## Module `public/modules/environment/lights.ts`

Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements.

### `setupLights`

- Full name: `setupLights`
- Location: `public/modules/environment/lights.ts:3`
- Return type: `void`

**Signature**

```ts
export function setupLights(scene: THREE.Scene) { const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); scene.add(ambientLight); // Main top-down light for clean shadows const mainLight = new THREE.DirectionalLight(0xffffff, 1.2); mainLight.position.set(10, 20, 15); mainLight.castShadow = true;
```

**Parameters**

- `scene: THREE.Scene`: Three.js scene instance used as the target container.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setupLights` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/lights.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/lights.ts`. Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements. In practice, it isolates the implementation details of `setupLights` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setupLights(/* ... */);
```

## Module `public/modules/environment/obstacles.ts`

Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements.

### `createObstacles`

- Full name: `createObstacles`
- Location: `public/modules/environment/obstacles.ts:16`
- Return type: `void`

**Signature**

```ts
export function createObstacles(_envGroup: Group) { // По умолчанию оставляем вокруг площадки больше свободного пространства. }
```

**Parameters**

- `_envGroup: Group`: input argument of type `Group`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Creates `createObstacles` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles.ts`. Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements. In practice, it isolates the implementation details of `createObstacles` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createObstacles(/* _envGroup */);
```

## Module `public/modules/environment/obstacles/arena.ts`

Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers.

### `createArenaControlStationMesh`

- Full name: `createArenaControlStationMesh`
- Location: `public/modules/environment/obstacles/arena.ts:156`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createArenaControlStationMesh() { const group = setCommonMeta(new THREE.Group(), 'Пульт полигона', { collidableRadius: 0.8 }); const deskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.82, metalness: 0.12 }); const screenMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x38bdf8, emissiveIntensity: 0.25 }); const desk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.65, 0.78), deskMat); desk.position.z = 0.39; group.add(desk);
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createArenaControlStationMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createArenaControlStationMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createArenaControlStationMesh();
```

### `createArenaHeliportMesh`

- Full name: `createArenaHeliportMesh`
- Location: `public/modules/environment/obstacles/arena.ts:25`
- Return type: `Mesh<PlaneGeometry, MeshStandardMaterial, Object3DEventMap>`

**Signature**

```ts
export function createArenaHeliportMesh() { const pad = createStyledLandingPad('H', '#2563eb'); pad.name = 'Хелипорт'; pad.userData.type = 'Хелипорт'; return pad; }
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Mesh<PlaneGeometry, MeshStandardMaterial, Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createArenaHeliportMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createArenaHeliportMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createArenaHeliportMesh();
```

### `createArenaHillClusterMesh`

- Full name: `createArenaHillClusterMesh`
- Location: `public/modules/environment/obstacles/arena.ts:255`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createArenaHillClusterMesh() { const group = setCommonMeta(new THREE.Group(), 'Группа холмов', { collidableRadius: 3.2 }); const positions = [ [-1.1, -0.2, 0.85], [0.75, -0.35, 1], [0.1, 1, 0.72] ]; positions.forEach(([x, y, scale]) => {
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createArenaHillClusterMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createArenaHillClusterMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createArenaHillClusterMesh();
```

### `createArenaSpaceMesh`

- Full name: `createArenaSpaceMesh`
- Location: `public/modules/environment/obstacles/arena.ts:8`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createArenaSpaceMesh() { const group = setCommonMeta(new THREE.Group(), 'Арена с сеткой', { collidableRadius: 9.5 }); const frame = createTrussArenaMesh(11, 4); group.add(frame); applyShadows(group); return group; }
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createArenaSpaceMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createArenaSpaceMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createArenaSpaceMesh();
```

### `createCargoMesh`

- Full name: `createCargoMesh`
- Location: `public/modules/environment/obstacles/arena.ts:39`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createCargoMesh() { const group = setCommonMeta(new THREE.Group(), 'Грузик', { collidableRadius: 0.22 }); group.userData.massKg = DEFAULT_CARGO_MASS_KG; group.userData.physicsMaterial = { ...DEFAULT_CARGO_PHYSICS_MATERIAL }; const crate = new THREE.Mesh( new THREE.BoxGeometry(0.35, 0.35, 0.28), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.92 }) );
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createCargoMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createCargoMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createCargoMesh();
```

### `createChargeStationMesh`

- Full name: `createChargeStationMesh`
- Location: `public/modules/environment/obstacles/arena.ts:32`
- Return type: `Mesh<PlaneGeometry, MeshStandardMaterial, Object3DEventMap>`

**Signature**

```ts
export function createChargeStationMesh() { const pad = createStyledLandingPad('⚡', '#475569'); pad.name = 'Станция заряда'; pad.userData.type = 'Станция заряда'; return pad; }
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Mesh<PlaneGeometry, MeshStandardMaterial, Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createChargeStationMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createChargeStationMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createChargeStationMesh();
```

### `createForestPatchMesh`

- Full name: `createForestPatchMesh`
- Location: `public/modules/environment/obstacles/arena.ts:233`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createForestPatchMesh() { const group = setCommonMeta(new THREE.Group(), 'Лесной массив', { collidableRadius: 1.9 }); const layout = [ [-0.9, -0.4, 0.95], [-0.2, -0.7, 1.05], [0.8, -0.5, 0.9], [-0.7, 0.5, 1.1], [0.1, 0.3, 1],
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createForestPatchMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createForestPatchMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createForestPatchMesh();
```

### `createLightTowerMesh`

- Full name: `createLightTowerMesh`
- Location: `public/modules/environment/obstacles/arena.ts:98`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createLightTowerMesh() { const group = setCommonMeta(new THREE.Group(), 'Световая мачта', { collidableRadius: 0.5 }); const darkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.72, metalness: 0.28 }); const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 3.8, 12), darkMat); mast.rotation.x = Math.PI / 2; mast.position.z = 1.9; group.add(mast);
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createLightTowerMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createLightTowerMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createLightTowerMesh();
```

### `createLocusBeaconMesh`

- Full name: `createLocusBeaconMesh`
- Location: `public/modules/environment/obstacles/arena.ts:70`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createLocusBeaconMesh() { const group = setCommonMeta(new THREE.Group(), 'Локус-маяк', { collidableRadius: 0.4 }); const mastMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.65, metalness: 0.35 }); const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.4, 12), mastMat); mast.rotation.x = Math.PI / 2; mast.position.z = 1.2; group.add(mast);
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createLocusBeaconMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createLocusBeaconMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createLocusBeaconMesh();
```

### `createSettlementMesh`

- Full name: `createSettlementMesh`
- Location: `public/modules/environment/obstacles/arena.ts:177`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createSettlementMesh() { const group = setCommonMeta(new THREE.Group(), 'Макет поселения', { collidableRadius: 2.4 }); const houseColors = [0xf1f5f9, 0xfde68a, 0xfca5a5, 0xbfdbfe]; const footprint = [ [-1.1, -0.6, 0.9], [0, -0.5, 1.1], [1.1, -0.4, 0.8], [-0.6, 0.7, 1.2],
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createSettlementMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createSettlementMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createSettlementMesh();
```

### `createStartPositionMesh`

- Full name: `createStartPositionMesh`
- Location: `public/modules/environment/obstacles/arena.ts:16`
- Return type: `Mesh<PlaneGeometry, MeshStandardMaterial, Object3DEventMap>`

**Signature**

```ts
export function createStartPositionMesh(label = '1') { const safeLabel = (label || '1').trim().slice(0, 3) || '1'; const pad = createStyledLandingPad(safeLabel, '#ef4444'); pad.name = `Стартовая позиция ${safeLabel}`; pad.userData.type = 'Стартовая позиция'; pad.userData.value = safeLabel; return pad; }
```

**Parameters**

- `label?: string`: input argument of type `string`.

**Return Value**

- Value of type `Mesh<PlaneGeometry, MeshStandardMaterial, Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createStartPositionMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createStartPositionMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createStartPositionMesh(/* label */);
```

### `createVideoTowerMesh`

- Full name: `createVideoTowerMesh`
- Location: `public/modules/environment/obstacles/arena.ts:124`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createVideoTowerMesh() { const group = setCommonMeta(new THREE.Group(), 'Видеомачта', { collidableRadius: 0.45 }); const mat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.72, metalness: 0.25 }); const tripodOffsets = [ [-0.18, -0.14], [0.18, -0.14], [0, 0.18]
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createVideoTowerMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/arena.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createVideoTowerMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createVideoTowerMesh();
```

## Module `public/modules/environment/obstacles/buildings.ts`

Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers.

### `addIncidentEffect`

- Full name: `addIncidentEffect`
- Location: `public/modules/environment/obstacles/buildings.ts:284`
- Return type: `void`

**Signature**

```ts
function addIncidentEffect(group: THREE.Group, slot: BuildingWindowSlot, incident: BuildingWindowIncident) { const effect = incident.kind === 'smoke' ? createSmokeEffect(slot) : incident.kind === 'fire' ? createFireEffect(slot) : createThiefEffect(slot); group.add(effect); }
```

**Parameters**

- `group: THREE.Group`: input argument of type `THREE.Group`.
- `slot: BuildingWindowSlot`: input argument of type `BuildingWindowSlot`.
- `incident: BuildingWindowIncident`: input argument of type `BuildingWindowIncident`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `addIncidentEffect` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `addIncidentEffect` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
addIncidentEffect(/* group */, /* slot */, 'drone_1');
```

### `clampBuildingFloors`

- Full name: `clampBuildingFloors`
- Location: `public/modules/environment/obstacles/buildings.ts:25`
- Return type: `number`

**Signature**

```ts
function clampBuildingFloors(value: unknown) { return Math.max(5, Math.min(20, Number(value) || 9)); }
```

**Parameters**

- `value: unknown`: numeric value being displayed, normalized, or transformed.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `clampBuildingFloors` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `clampBuildingFloors` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampBuildingFloors(0);
```

### `createApartmentBuildingMesh`

- Full name: `createApartmentBuildingMesh`
- Location: `public/modules/environment/obstacles/buildings.ts:366`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createApartmentBuildingMesh(options: SceneObjectOptions = {}) { const colors = [0xe5e7eb, 0xef4444, 0x2563eb, 0x10b981, 0xf59e0b]; const bodyColor = colors[Math.floor(Math.random() * colors.length)]; const group = setCommonMeta(new THREE.Group(), 'Многоэтажка', { floors: clampBuildingFloors(options.floors ?? 9), collidableRadius: 2.6, supportsValue: true,
```

**Parameters**

- `options?: SceneObjectOptions`: input argument of type `SceneObjectOptions`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createApartmentBuildingMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createApartmentBuildingMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createApartmentBuildingMesh(/* options */);
```

### `createFireEffect`

- Full name: `createFireEffect`
- Location: `public/modules/environment/obstacles/buildings.ts:155`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
function createFireEffect(slot: BuildingWindowSlot) { const group = new THREE.Group(); const burnMark = new THREE.Mesh( new THREE.BoxGeometry(0.65, 0.04, 0.3), new THREE.MeshStandardMaterial({ color: 0x110c08, emissive: 0x221108,
```

**Parameters**

- `slot: BuildingWindowSlot`: input argument of type `BuildingWindowSlot`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createFireEffect` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createFireEffect` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createFireEffect(/* slot */);
```

### `createSmokeEffect`

- Full name: `createSmokeEffect`
- Location: `public/modules/environment/obstacles/buildings.ts:103`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
function createSmokeEffect(slot: BuildingWindowSlot) { const group = new THREE.Group(); const sootPlate = new THREE.Mesh( new THREE.BoxGeometry(0.7, 0.025, 0.24), new THREE.MeshStandardMaterial({ color: 0x0a0a0f, transparent: true, opacity: 0.85,
```

**Parameters**

- `slot: BuildingWindowSlot`: input argument of type `BuildingWindowSlot`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createSmokeEffect` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createSmokeEffect` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createSmokeEffect(/* slot */);
```

### `createThiefEffect`

- Full name: `createThiefEffect`
- Location: `public/modules/environment/obstacles/buildings.ts:231`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
function createThiefEffect(slot: BuildingWindowSlot) { const group = new THREE.Group(); const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a0f, roughness: 0.9 }); const clothesMaterial = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }); // Упрощенная, но более цельная фигура вора const thief = new THREE.Group(); thief.position.copy(slot.position).add(new THREE.Vector3(0, 0.35 * slot.outward, 0.1));
```

**Parameters**

- `slot: BuildingWindowSlot`: input argument of type `BuildingWindowSlot`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createThiefEffect` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createThiefEffect` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createThiefEffect(/* slot */);
```

### `getWindowSlots`

- Full name: `getWindowSlots`
- Location: `public/modules/environment/obstacles/buildings.ts:65`
- Return type: `BuildingWindowSlot[]`

**Signature**

```ts
function getWindowSlots(floors: number, depth: number, floorHeight: number) { const slots: BuildingWindowSlot[] = []; for (let floor = 0; floor < floors; floor++) { const z = 0.65 + floor * floorHeight + 0.45; for (let i = -1; i <= 1; i++) { const x = i * 1.3; slots.push({ floor: floor + 1,
```

**Parameters**

- `floors: number`: input argument of type `number`.
- `depth: number`: input argument of type `number`.
- `floorHeight: number`: input argument of type `number`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Returns `getWindowSlots` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `getWindowSlots` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getWindowSlots(/* floors */, /* depth */, 0);
```

### `parseIncidentKind`

- Full name: `parseIncidentKind`
- Location: `public/modules/environment/obstacles/buildings.ts:29`
- Return type: `WindowIncidentKind | null`

**Signature**

```ts
function parseIncidentKind(value: string): WindowIncidentKind | null { const normalized = value.trim().toLowerCase(); if (normalized === 'smoke' || normalized === 'дым') return 'smoke'; if (normalized === 'fire' || normalized === 'пожар') return 'fire'; if (normalized === 'thief' || normalized === 'вор') return 'thief'; return null; }
```

**Parameters**

- `value: string`: numeric value being displayed, normalized, or transformed.

**Return Value**

- Value of type `WindowIncidentKind | null` consumed by downstream logic.

**Purpose**

- Performs `parseIncidentKind` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `parseIncidentKind` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
parseIncidentKind(0);
```

### `parseWindowIncidents`

- Full name: `parseWindowIncidents`
- Location: `public/modules/environment/obstacles/buildings.ts:37`
- Return type: `BuildingWindowIncident[]`

**Signature**

```ts
function parseWindowIncidents(rawValue: unknown, floors: number): BuildingWindowIncident[] { if (typeof rawValue !== 'string' || !rawValue.trim()) return []; const incidents: BuildingWindowIncident[] = []; const entries = rawValue .split(/\r?\n|;/) .map((entry) => entry.trim()) .filter(Boolean);
```

**Parameters**

- `rawValue: unknown`: input argument of type `unknown`.
- `floors: number`: input argument of type `number`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Performs `parseWindowIncidents` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `parseWindowIncidents` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
parseWindowIncidents(/* rawValue */, /* floors */);
```

### `rebuildApartmentBuilding`

- Full name: `rebuildApartmentBuilding`
- Location: `public/modules/environment/obstacles/buildings.ts:293`
- Return type: `void`

**Signature**

```ts
function rebuildApartmentBuilding(group: THREE.Group) { clearGeneratedChildren(group); const floors = clampBuildingFloors(group.userData.floors); group.userData.floors = floors; const bodyColor = Number(group.userData.bodyColor) || 0xe5e7eb; const windowIncidents = parseWindowIncidents(group.userData.value, floors); group.userData.windowIncidentsSummaryLines = summarizeWindowIncidents(windowIncidents);
```

**Parameters**

- `group: THREE.Group`: input argument of type `THREE.Group`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `rebuildApartmentBuilding` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `rebuildApartmentBuilding` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
rebuildApartmentBuilding(/* group */);
```

### `summarizeWindowIncidents`

- Full name: `summarizeWindowIncidents`
- Location: `public/modules/environment/obstacles/buildings.ts:90`
- Return type: `string[]`

**Signature**

```ts
function summarizeWindowIncidents(incidents: BuildingWindowIncident[]) { if (!incidents.length) return []; return incidents.map((incident) => { const kindLabel = incident.kind === 'smoke' ? 'дым' : incident.kind === 'fire' ? 'пожар' : 'вор';
```

**Parameters**

- `incidents: BuildingWindowIncident[]`: input argument of type `BuildingWindowIncident[]`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Performs `summarizeWindowIncidents` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `summarizeWindowIncidents` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
summarizeWindowIncidents('drone_1');
```

### `updateApartmentBuildingIncidents`

- Full name: `updateApartmentBuildingIncidents`
- Location: `public/modules/environment/obstacles/buildings.ts:382`
- Return type: `boolean`

**Signature**

```ts
export function updateApartmentBuildingIncidents(object: THREE.Object3D, value: string | undefined) { const group = object as THREE.Group; if (group.userData?.type !== 'Многоэтажка') return false; group.userData.value = value || ''; rebuildApartmentBuilding(group); return true; }
```

**Parameters**

- `object: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `value: string | undefined`: numeric value being displayed, normalized, or transformed.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Updates `updateApartmentBuildingIncidents` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `updateApartmentBuildingIncidents` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateApartmentBuildingIncidents(/* object */, 0);
```

### `updateApartmentBuildingMetadata`

- Full name: `updateApartmentBuildingMetadata`
- Location: `public/modules/environment/obstacles/buildings.ts:390`
- Return type: `boolean`

**Signature**

```ts
export function updateApartmentBuildingMetadata( object: THREE.Object3D, params: { value?: string; floors?: number } ) { const group = object as THREE.Group; if (group.userData?.type !== 'Многоэтажка') return false; if (params.value !== undefined) group.userData.value = params.value || ''; if (params.floors !== undefined) group.userData.floors = clampBuildingFloors(params.floors);
```

**Parameters**

- `object: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `params: { value?: string; floors?: number }`: aggregated call parameters object.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Updates `updateApartmentBuildingMetadata` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/buildings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/buildings.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `updateApartmentBuildingMetadata` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateApartmentBuildingMetadata(/* object */, /* ... */);
```

## Module `public/modules/environment/obstacles/competition.ts`

Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers.

### `createFlagMesh`

- Full name: `createFlagMesh`
- Location: `public/modules/environment/obstacles/competition.ts:48`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createFlagMesh() { const group = setCommonMeta(new THREE.Group(), 'Флаг', { collidableRadius: 0.45 }); const pole = new THREE.Mesh( new THREE.CylinderGeometry(0.02, 0.02, 2), new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 }) ); pole.rotation.x = Math.PI / 2;
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createFlagMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/competition.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/competition.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createFlagMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createFlagMesh();
```

### `createGateMesh`

- Full name: `createGateMesh`
- Location: `public/modules/environment/obstacles/competition.ts:4`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createGateMesh() { const group = setCommonMeta(new THREE.Group(), 'Ворота', { collidableRadius: 0.95 }); const mat = new THREE.MeshStandardMaterial({ color: 0xff8800, roughness: 0.7, emissive: 0xff4400, emissiveIntensity: 0.1 }); const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.5 }); const legGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.92); const leg1 = new THREE.Mesh(legGeom, mat);
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createGateMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/competition.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/competition.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createGateMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createGateMesh();
```

### `createPylonMesh`

- Full name: `createPylonMesh`
- Location: `public/modules/environment/obstacles/competition.ts:37`
- Return type: `Mesh<ConeGeometry, MeshStandardMaterial, Object3DEventMap>`

**Signature**

```ts
export function createPylonMesh() { const pylonGeom = new THREE.ConeGeometry(0.3, 2, 8); const pylonMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.8 }); const pylon = setCommonMeta(new THREE.Mesh(pylonGeom, pylonMat), 'Пилон', { collidableRadius: 0.4 }); pylon.rotation.x = Math.PI / 2; pylon.position.z = 1; pylon.castShadow = true; pylon.receiveShadow = true;
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Mesh<ConeGeometry, MeshStandardMaterial, Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createPylonMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/competition.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/competition.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createPylonMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createPylonMesh();
```

## Module `public/modules/environment/obstacles/linear.ts`

Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers.

### `buildHorizontalPatch`

- Full name: `buildHorizontalPatch`
- Location: `public/modules/environment/obstacles/linear.ts:44`
- Return type: `Mesh<CylinderGeometry, Material, Object3DEventMap>`

**Signature**

```ts
function buildHorizontalPatch(radius: number, thickness: number, material: THREE.Material, point: THREE.Vector3) { const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, thickness, 24), material); mesh.rotation.x = Math.PI / 2; mesh.position.set(point.x, point.y, point.z + thickness * 0.5); return mesh; }
```

**Parameters**

- `radius: number`: input argument of type `number`.
- `thickness: number`: input argument of type `number`.
- `material: THREE.Material`: input argument of type `THREE.Material`.
- `point: THREE.Vector3`: input argument of type `THREE.Vector3`.

**Return Value**

- Value of type `Mesh<CylinderGeometry, Material, Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `buildHorizontalPatch` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/linear.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/linear.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `buildHorizontalPatch` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
buildHorizontalPatch(/* radius */, /* thickness */, /* material */, /* point */);
```

### `buildOrientedBox`

- Full name: `buildOrientedBox`
- Location: `public/modules/environment/obstacles/linear.ts:25`
- Return type: `Mesh<BoxGeometry, Material, Object3DEventMap>`

**Signature**

```ts
function buildOrientedBox(length: number, width: number, height: number, material: THREE.Material, start: THREE.Vector3, end: THREE.Vector3) { const mesh = new THREE.Mesh(new THREE.BoxGeometry(length, width, height), material); const mid = start.clone().add(end).multiplyScalar(0.5); const dir = end.clone().sub(start); mesh.position.copy(mid); mesh.position.z += height * 0.5; mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir.normalize()); return mesh;
```

**Parameters**

- `length: number`: input argument of type `number`.
- `width: number`: input argument of type `number`.
- `height: number`: input argument of type `number`.
- `material: THREE.Material`: input argument of type `THREE.Material`.
- `start: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `end: THREE.Vector3`: input argument of type `THREE.Vector3`.

**Return Value**

- Value of type `Mesh<BoxGeometry, Material, Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `buildOrientedBox` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/linear.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/linear.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `buildOrientedBox` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
buildOrientedBox(/* length */, 'drone_1', 0, /* material */, /* start */, /* end */);
```

### `buildOrientedCylinder`

- Full name: `buildOrientedCylinder`
- Location: `public/modules/environment/obstacles/linear.ts:35`
- Return type: `Mesh<CylinderGeometry, Material, Object3DEventMap>`

**Signature**

```ts
function buildOrientedCylinder(radius: number, length: number, material: THREE.Material, start: THREE.Vector3, end: THREE.Vector3) { const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 10), material); const mid = start.clone().add(end).multiplyScalar(0.5); const dir = end.clone().sub(start).normalize(); mesh.position.copy(mid); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); return mesh; }
```

**Parameters**

- `radius: number`: input argument of type `number`.
- `length: number`: input argument of type `number`.
- `material: THREE.Material`: input argument of type `THREE.Material`.
- `start: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `end: THREE.Vector3`: input argument of type `THREE.Vector3`.

**Return Value**

- Value of type `Mesh<CylinderGeometry, Material, Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `buildOrientedCylinder` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/linear.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/linear.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `buildOrientedCylinder` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
buildOrientedCylinder(/* radius */, /* length */, /* material */, /* start */, /* end */);
```

### `createRailwayMesh`

- Full name: `createRailwayMesh`
- Location: `public/modules/environment/obstacles/linear.ts:161`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createRailwayMesh(options: SceneObjectOptions = {}) { const group = setCommonMeta(new THREE.Group(), 'Железнодорожные пути', { supportsPoints: true, points: toPointList(options.points), closed: !!options.closed, featureKind: 'rail', collidableRadius: 1.35 });
```

**Parameters**

- `options?: SceneObjectOptions`: input argument of type `SceneObjectOptions`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createRailwayMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/linear.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/linear.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createRailwayMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createRailwayMesh(/* options */);
```

### `createRoadMesh`

- Full name: `createRoadMesh`
- Location: `public/modules/environment/obstacles/linear.ts:149`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createRoadMesh(options: SceneObjectOptions = {}) { const group = setCommonMeta(new THREE.Group(), 'Дорога', { supportsPoints: true, points: toPointList(options.points), closed: !!options.closed, featureKind: 'road', collidableRadius: 1.75 });
```

**Parameters**

- `options?: SceneObjectOptions`: input argument of type `SceneObjectOptions`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createRoadMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/linear.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/linear.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createRoadMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createRoadMesh(/* options */);
```

### `makePathCurve`

- Full name: `makePathCurve`
- Location: `public/modules/environment/obstacles/linear.ts:16`
- Return type: `CatmullRomCurve3`

**Signature**

```ts
function makePathCurve(points: ScenePathPoint[], closed = false) { return new THREE.CatmullRomCurve3( points.map((point) => new THREE.Vector3(point.x, point.y, point.z)), closed, 'catmullrom', 0.12 ); }
```

**Parameters**

- `points: ScenePathPoint[]`: input argument of type `ScenePathPoint[]`.
- `closed?: boolean`: input argument of type `boolean`.

**Return Value**

- Value of type `CatmullRomCurve3` consumed by downstream logic.

**Purpose**

- Performs `makePathCurve` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/linear.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/linear.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `makePathCurve` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
makePathCurve(/* points */, /* closed */);
```

### `rebuildLinearFeature`

- Full name: `rebuildLinearFeature`
- Location: `public/modules/environment/obstacles/linear.ts:51`
- Return type: `void`

**Signature**

```ts
export function rebuildLinearFeature(group: THREE.Group) { clearGeneratedChildren(group); const featureKind = group.userData.featureKind === 'rail' ? 'rail' : 'road'; const points = toPointList(group.userData.points); const closed = !!group.userData.closed; const curve = makePathCurve(points, closed); const segmentCount = closed ? Math.max(points.length * 18, 60) : Math.max((points.length - 1) * 18, 32);
```

**Parameters**

- `group: THREE.Group`: input argument of type `THREE.Group`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `rebuildLinearFeature` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/linear.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/linear.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `rebuildLinearFeature` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
rebuildLinearFeature(/* group */);
```

### `toPointList`

- Full name: `toPointList`
- Location: `public/modules/environment/obstacles/linear.ts:5`
- Return type: `{ x: number; y: number; z: number; }[]`

**Signature**

```ts
function toPointList(points?: ScenePathPoint[]) { if (points && points.length >= 2) { return points.map((point) => ({ x: point.x, y: point.y, z: point.z ?? 0 })); } return [ { x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 }, { x: 9, y: 3, z: 0 }
```

**Parameters**

- `points?: ScenePathPoint[]`: input argument of type `ScenePathPoint[]`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Performs `toPointList` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/linear.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/linear.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `toPointList` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
toPointList(/* points */);
```

### `updateLinearFeaturePoints`

- Full name: `updateLinearFeaturePoints`
- Location: `public/modules/environment/obstacles/linear.ts:173`
- Return type: `boolean`

**Signature**

```ts
export function updateLinearFeaturePoints(object: THREE.Object3D, points: ScenePathPoint[]) { const group = object as THREE.Group; if (!group.userData.supportsPoints) return false; group.userData.points = toPointList(points); rebuildLinearFeature(group); return true; }
```

**Parameters**

- `object: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `points: ScenePathPoint[]`: input argument of type `ScenePathPoint[]`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Updates `updateLinearFeaturePoints` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/linear.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/linear.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `updateLinearFeaturePoints` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateLinearFeaturePoints(/* object */, /* points */);
```

## Module `public/modules/environment/obstacles/markers.ts`

Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers.

### `addBoxSurfaceCandidates`

- Full name: `addBoxSurfaceCandidates`
- Location: `public/modules/environment/obstacles/markers.ts:470`
- Return type: `void`

**Signature**

```ts
function addBoxSurfaceCandidates( candidates: MarkerSurfaceCandidate[], position: THREE.Vector3, box: THREE.Box3 ) { const size = new THREE.Vector3(); box.getSize(size); if (size.lengthSq() < 0.0001) return;
```

**Parameters**

- `candidates: MarkerSurfaceCandidate[]`: input argument of type `MarkerSurfaceCandidate[]`.
- `position: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `box: THREE.Box3`: input argument of type `THREE.Box3`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `addBoxSurfaceCandidates` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `addBoxSurfaceCandidates` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
addBoxSurfaceCandidates('drone_1', /* position */, /* box */);
```

### `applyMarkerMapMetadata`

- Full name: `applyMarkerMapMetadata`
- Location: `public/modules/environment/obstacles/markers.ts:312`
- Return type: `void`

**Signature**

```ts
function applyMarkerMapMetadata( group: THREE.Group, kind: MarkerKind, dictionaryId: MarkerDictionaryId, options: NormalizedMarkerMapOptions ) { const definition = MARKER_DICTIONARIES[dictionaryId]; const count = options.rows * options.columns;
```

**Parameters**

- `group: THREE.Group`: input argument of type `THREE.Group`.
- `kind: MarkerKind`: input argument of type `MarkerKind`.
- `dictionaryId: MarkerDictionaryId`: input argument of type `MarkerDictionaryId`.
- `options: NormalizedMarkerMapOptions`: input argument of type `NormalizedMarkerMapOptions`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Applies `applyMarkerMapMetadata` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `applyMarkerMapMetadata` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
applyMarkerMapMetadata(/* group */, /* kind */, 'drone_1', /* options */);
```

### `applyMarkerMetadata`

- Full name: `applyMarkerMetadata`
- Location: `public/modules/environment/obstacles/markers.ts:223`
- Return type: `void`

**Signature**

```ts
function applyMarkerMetadata(group: THREE.Group, kind: MarkerKind, dictionaryId: MarkerDictionaryId, value: string) { const definition = MARKER_DICTIONARIES[dictionaryId]; const normalizedValue = normalizeMarkerValue(kind, dictionaryId, value); group.userData.value = normalizedValue; group.userData.markerDictionary = dictionaryId; group.userData.markerDictionaryLabel = definition.label; group.userData.markerKind = kind; group.userData.supportsMarkerDictionary = true;
```

**Parameters**

- `group: THREE.Group`: input argument of type `THREE.Group`.
- `kind: MarkerKind`: input argument of type `MarkerKind`.
- `dictionaryId: MarkerDictionaryId`: input argument of type `MarkerDictionaryId`.
- `value: string`: numeric value being displayed, normalized, or transformed.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Applies `applyMarkerMetadata` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `applyMarkerMetadata` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
applyMarkerMetadata(/* group */, /* kind */, 'drone_1', 0);
```

### `bytesToBitMatrix`

- Full name: `bytesToBitMatrix`
- Location: `public/modules/environment/obstacles/markers.ts:150`
- Return type: `number[][]`

**Signature**

```ts
function bytesToBitMatrix(bytes: number[], markerSize: number) { const matrix = Array.from({ length: markerSize }, () => Array<number>(markerSize).fill(0)); const totalBits = markerSize * markerSize; let bitIndex = 0; for (const byte of bytes) { for (let mask = 1 << 7; mask !== 0 && bitIndex < totalBits; mask >>= 1) { const row = Math.floor(bitIndex / markerSize); const column = bitIndex % markerSize;
```

**Parameters**

- `bytes: number[]`: input argument of type `number[]`.
- `markerSize: number`: input argument of type `number`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Performs `bytesToBitMatrix` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `bytesToBitMatrix` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
bytesToBitMatrix(/* bytes */, /* markerSize */);
```

### `clampInt`

- Full name: `clampInt`
- Location: `public/modules/environment/obstacles/markers.ts:101`
- Return type: `number`

**Signature**

```ts
function clampInt(value: unknown, fallback: number, min: number, max: number) { const parsed = Number.parseInt(String(value ?? ''), 10); if (!Number.isFinite(parsed)) return fallback; return Math.min(Math.max(parsed, min), max); }
```

**Parameters**

- `value: unknown`: numeric value being displayed, normalized, or transformed.
- `fallback: number`: input argument of type `number`.
- `min: number`: input argument of type `number`.
- `max: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `clampInt` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `clampInt` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampInt(0, /* fallback */, /* min */, /* max */);
```

### `clampNumber`

- Full name: `clampNumber`
- Location: `public/modules/environment/obstacles/markers.ts:107`
- Return type: `number`

**Signature**

```ts
function clampNumber(value: unknown, fallback: number, min: number, max: number) { const parsed = Number(value); if (!Number.isFinite(parsed)) return fallback; return Math.min(Math.max(parsed, min), max); }
```

**Parameters**

- `value: unknown`: numeric value being displayed, normalized, or transformed.
- `fallback: number`: input argument of type `number`.
- `min: number`: input argument of type `number`.
- `max: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `clampNumber` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `clampNumber` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampNumber(0, /* fallback */, /* min */, /* max */);
```

### `clampValue`

- Full name: `clampValue`
- Location: `public/modules/environment/obstacles/markers.ts:457`
- Return type: `number`

**Signature**

```ts
function clampValue(value: number, min: number, max: number) { if (min > max) return (min + max) / 2; return Math.min(Math.max(value, min), max); }
```

**Parameters**

- `value: number`: numeric value being displayed, normalized, or transformed.
- `min: number`: input argument of type `number`.
- `max: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `clampValue` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `clampValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampValue(0, /* min */, /* max */);
```

### `createAprilTagMarkerMapMesh`

- Full name: `createAprilTagMarkerMapMesh`
- Location: `public/modules/environment/obstacles/markers.ts:412`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createAprilTagMarkerMapMesh(dictionaryId?: string, options?: MarkerMapOptions) { return createMarkerMapMesh('AprilTag', dictionaryId, options); }
```

**Parameters**

- `dictionaryId?: string`: input argument of type `string`.
- `options?: MarkerMapOptions`: input argument of type `MarkerMapOptions`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createAprilTagMarkerMapMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createAprilTagMarkerMapMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createAprilTagMarkerMapMesh('drone_1', /* options */);
```

### `createAprilTagMarkerMesh`

- Full name: `createAprilTagMarkerMesh`
- Location: `public/modules/environment/obstacles/markers.ts:281`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createAprilTagMarkerMesh(value = '0', dictionaryId?: string) { return createMarkerMesh('AprilTag', value, dictionaryId); }
```

**Parameters**

- `value?: string`: numeric value being displayed, normalized, or transformed.
- `dictionaryId?: string`: input argument of type `string`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createAprilTagMarkerMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createAprilTagMarkerMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createAprilTagMarkerMesh(0, 'drone_1');
```

### `createArucoMarkerMapMesh`

- Full name: `createArucoMarkerMapMesh`
- Location: `public/modules/environment/obstacles/markers.ts:408`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createArucoMarkerMapMesh(dictionaryId?: string, options?: MarkerMapOptions) { return createMarkerMapMesh('ArUco', dictionaryId, options); }
```

**Parameters**

- `dictionaryId?: string`: input argument of type `string`.
- `options?: MarkerMapOptions`: input argument of type `MarkerMapOptions`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createArucoMarkerMapMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createArucoMarkerMapMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createArucoMarkerMapMesh('drone_1', /* options */);
```

### `createArucoMarkerMesh`

- Full name: `createArucoMarkerMesh`
- Location: `public/modules/environment/obstacles/markers.ts:277`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createArucoMarkerMesh(value = '0', dictionaryId?: string) { return createMarkerMesh('ArUco', value, dictionaryId); }
```

**Parameters**

- `value?: string`: numeric value being displayed, normalized, or transformed.
- `dictionaryId?: string`: input argument of type `string`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createArucoMarkerMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createArucoMarkerMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createArucoMarkerMesh(0, 'drone_1');
```

### `createMarkerMapMesh`

- Full name: `createMarkerMapMesh`
- Location: `public/modules/environment/obstacles/markers.ts:356`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
function createMarkerMapMesh(kind: MarkerKind, dictionaryId?: string, options?: MarkerMapOptions) { const { dictionaryId: normalizedDictionaryId } = getDictionaryDefinition(kind, dictionaryId); const normalizedOptions = normalizeMarkerMapOptions(options); const title = kind === 'AprilTag' ? 'AprilTag карта' : 'ArUco карта'; const group = setCommonMeta(new THREE.Group(), title, { isMarkerMap: true, supportsValue: false, supportsMarkerDictionary: false
```

**Parameters**

- `kind: MarkerKind`: input argument of type `MarkerKind`.
- `dictionaryId?: string`: input argument of type `string`.
- `options?: MarkerMapOptions`: input argument of type `MarkerMapOptions`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createMarkerMapMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createMarkerMapMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createMarkerMapMesh(/* kind */, 'drone_1', /* options */);
```

### `createMarkerMesh`

- Full name: `createMarkerMesh`
- Location: `public/modules/environment/obstacles/markers.ts:235`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
function createMarkerMesh(kind: MarkerKind, value = '0', dictionaryId?: string) { const { dictionaryId: normalizedDictionaryId } = getDictionaryDefinition(kind, dictionaryId); const group = setCommonMeta(new THREE.Group(), kind === 'ArUco' ? 'ArUco маркер' : 'AprilTag маркер', { supportsValue: true, supportsMarkerDictionary: true, value, collidableRadius: 0.42, markerKind: kind
```

**Parameters**

- `kind: MarkerKind`: input argument of type `MarkerKind`.
- `value?: string`: numeric value being displayed, normalized, or transformed.
- `dictionaryId?: string`: input argument of type `string`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createMarkerMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createMarkerMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createMarkerMesh(/* kind */, 0, 'drone_1');
```

### `createMarkerTexture`

- Full name: `createMarkerTexture`
- Location: `public/modules/environment/obstacles/markers.ts:175`
- Return type: `CanvasTexture<HTMLCanvasElement>`

**Signature**

```ts
function createMarkerTexture(kind: MarkerKind, dictionaryId: MarkerDictionaryId, value: string) { const canvas = document.createElement('canvas'); canvas.width = MARKER_CANVAS_SIZE; canvas.height = MARKER_CANVAS_SIZE; const ctx = canvas.getContext('2d'); if (!ctx) return new THREE.CanvasTexture(canvas); const { matrix, definition } = getMarkerMatrix(kind, dictionaryId, value);
```

**Parameters**

- `kind: MarkerKind`: input argument of type `MarkerKind`.
- `dictionaryId: MarkerDictionaryId`: input argument of type `MarkerDictionaryId`.
- `value: string`: numeric value being displayed, normalized, or transformed.

**Return Value**

- Value of type `CanvasTexture<HTMLCanvasElement>` consumed by downstream logic.

**Purpose**

- Creates `createMarkerTexture` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createMarkerTexture` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createMarkerTexture(/* kind */, 'drone_1', 0);
```

### `getAnchorPosition`

- Full name: `getAnchorPosition`
- Location: `public/modules/environment/obstacles/markers.ts:285`
- Return type: `Vector2`

**Signature**

```ts
function getAnchorPosition( options: NormalizedMarkerMapOptions, startCell: { row: number; column: number } ) { const width = (options.columns - 1) * (options.markerSize + options.gapX); const height = (options.rows - 1) * (options.markerSize + options.gapY); switch (options.anchor) {
```

**Parameters**

- `options: NormalizedMarkerMapOptions`: input argument of type `NormalizedMarkerMapOptions`.
- `startCell: { row: number; column: number }`: input argument of type `{ row: number; column: number }`.

**Return Value**

- Value of type `Vector2` consumed by downstream logic.

**Purpose**

- Returns `getAnchorPosition` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `getAnchorPosition` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getAnchorPosition(/* options */, /* startCell */);
```

### `getDefaultDictionary`

- Full name: `getDefaultDictionary`
- Location: `public/modules/environment/obstacles/markers.ts:70`
- Return type: `MarkerDictionaryId`

**Signature**

```ts
function getDefaultDictionary(kind: MarkerKind): MarkerDictionaryId { return (kind === 'AprilTag' ? DEFAULT_APRILTAG_DICTIONARY : DEFAULT_ARUCO_DICTIONARY) as MarkerDictionaryId; }
```

**Parameters**

- `kind: MarkerKind`: input argument of type `MarkerKind`.

**Return Value**

- Value of type `MarkerDictionaryId` consumed by downstream logic.

**Purpose**

- Returns `getDefaultDictionary` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `getDefaultDictionary` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getDefaultDictionary(/* kind */);
```

### `getDictionaryDefinition`

- Full name: `getDictionaryDefinition`
- Location: `public/modules/environment/obstacles/markers.ts:86`
- Return type: `{ dictionaryId: "DICT_ARUCO_ORIGINAL" | "DICT_4X4_50" | "DICT_4X4_100" | "DICT_4X4_250" | "DICT_4X4_1000" | "DICT_5X5_50" | "DICT_5X5_100" | "DICT_5X5_250" | "DICT_5X5_1000" | ... 11 more ... | "DICT_APRILTAG_36h11"; definition: { ...; } | ... 19 more ... | { ...; }; }`

**Signature**

```ts
function getDictionaryDefinition(kind: MarkerKind, dictionaryId?: string) { const normalizedId = normalizeMarkerDictionaryId(kind, dictionaryId); return { dictionaryId: normalizedId, definition: MARKER_DICTIONARIES[normalizedId] }; }
```

**Parameters**

- `kind: MarkerKind`: input argument of type `MarkerKind`.
- `dictionaryId?: string`: input argument of type `string`.

**Return Value**

- Structured object with computed fields or configuration data.

**Purpose**

- Returns `getDictionaryDefinition` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `getDictionaryDefinition` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getDictionaryDefinition(/* kind */, 'drone_1');
```

### `getMarkerDictionaryOptions`

- Full name: `getMarkerDictionaryOptions`
- Location: `public/modules/environment/obstacles/markers.ts:74`
- Return type: `({ readonly id: "DICT_ARUCO_ORIGINAL"; readonly label: "DICT_ARUCO_ORIGINAL"; } | { readonly id: "DICT_4X4_50"; readonly label: "DICT_4X4_50"; } | { readonly id: "DICT_4X4_100"; readonly label: "DICT_4X4_100"; } | ... 17 more ... | { ...; })[]`

**Signature**

```ts
export function getMarkerDictionaryOptions(kind: 'aruco' | 'apriltag') { return [...MARKER_DICTIONARY_OPTIONS[kind]]; }
```

**Parameters**

- `kind: 'aruco' | 'apriltag'`: input argument of type `'aruco' | 'apriltag'`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Returns `getMarkerDictionaryOptions` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `getMarkerDictionaryOptions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getMarkerDictionaryOptions(/* kind */);
```

### `getMarkerKindKey`

- Full name: `getMarkerKindKey`
- Location: `public/modules/environment/obstacles/markers.ts:66`
- Return type: `"apriltag" | "aruco"`

**Signature**

```ts
function getMarkerKindKey(kind: MarkerKind) { return kind === 'AprilTag' ? 'apriltag' : 'aruco'; }
```

**Parameters**

- `kind: MarkerKind`: input argument of type `MarkerKind`.

**Return Value**

- Value of type `"apriltag" | "aruco"` consumed by downstream logic.

**Purpose**

- Returns `getMarkerKindKey` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `getMarkerKindKey` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getMarkerKindKey(/* kind */);
```

### `getMarkerMatrix`

- Full name: `getMarkerMatrix`
- Location: `public/modules/environment/obstacles/markers.ts:165`
- Return type: `{ markerId: number; matrix: number[][]; definition: { readonly kind: "aruco"; readonly markerSize: 5; readonly markerCount: 1024; readonly label: "DICT_ARUCO_ORIGINAL"; readonly firstRotationBytes: [...]; } | ... 19 more ... | { ...; }; }`

**Signature**

```ts
function getMarkerMatrix(kind: MarkerKind, dictionaryId: MarkerDictionaryId, value: string) { const definition = MARKER_DICTIONARIES[dictionaryId]; const markerId = parseMarkerId(normalizeMarkerValue(kind, dictionaryId, value)); return { markerId, matrix: bytesToBitMatrix(definition.firstRotationBytes[markerId], definition.markerSize), definition };
```

**Parameters**

- `kind: MarkerKind`: input argument of type `MarkerKind`.
- `dictionaryId: MarkerDictionaryId`: input argument of type `MarkerDictionaryId`.
- `value: string`: numeric value being displayed, normalized, or transformed.

**Return Value**

- Structured object with computed fields or configuration data.

**Purpose**

- Returns `getMarkerMatrix` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `getMarkerMatrix` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getMarkerMatrix(/* kind */, 'drone_1', 0);
```

### `isMarkerObject`

- Full name: `isMarkerObject`
- Location: `public/modules/environment/obstacles/markers.ts:416`
- Return type: `boolean`

**Signature**

```ts
export function isMarkerObject(object: THREE.Object3D) { return object.userData?.markerKind === 'ArUco' || object.userData?.markerKind === 'AprilTag'; }
```

**Parameters**

- `object: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isMarkerObject` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `isMarkerObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isMarkerObject(/* object */);
```

### `makeCandidate`

- Full name: `makeCandidate`
- Location: `public/modules/environment/obstacles/markers.ts:462`
- Return type: `MarkerSurfaceCandidate`

**Signature**

```ts
function makeCandidate(position: THREE.Vector3, anchor: THREE.Vector3, normal: THREE.Vector3): MarkerSurfaceCandidate { return { anchor, normal, score: position.distanceToSquared(anchor) }; }
```

**Parameters**

- `position: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `anchor: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `normal: THREE.Vector3`: input argument of type `THREE.Vector3`.

**Return Value**

- Value of type `MarkerSurfaceCandidate` consumed by downstream logic.

**Purpose**

- Performs `makeCandidate` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `makeCandidate` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
makeCandidate(/* position */, /* anchor */, /* normal */);
```

### `normalizeMarkerDictionaryId`

- Full name: `normalizeMarkerDictionaryId`
- Location: `public/modules/environment/obstacles/markers.ts:78`
- Return type: `MarkerDictionaryId`

**Signature**

```ts
export function normalizeMarkerDictionaryId(kind: MarkerKind, dictionaryId?: string): MarkerDictionaryId { if (dictionaryId && dictionaryId in MARKER_DICTIONARIES) { const normalized = dictionaryId as MarkerDictionaryId; if (MARKER_DICTIONARIES[normalized].kind === getMarkerKindKey(kind)) return normalized; } return getDefaultDictionary(kind); }
```

**Parameters**

- `kind: MarkerKind`: input argument of type `MarkerKind`.
- `dictionaryId?: string`: input argument of type `string`.

**Return Value**

- Value of type `MarkerDictionaryId` consumed by downstream logic.

**Purpose**

- Normalizes `normalizeMarkerDictionaryId` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `normalizeMarkerDictionaryId` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
normalizeMarkerDictionaryId(/* kind */, 'drone_1');
```

### `normalizeMarkerMapOptions`

- Full name: `normalizeMarkerMapOptions`
- Location: `public/modules/environment/obstacles/markers.ts:119`
- Return type: `NormalizedMarkerMapOptions`

**Signature**

```ts
function normalizeMarkerMapOptions(options: MarkerMapOptions | undefined): NormalizedMarkerMapOptions { const traversal = options?.traversal === 'column-major' ? 'column-major' : DEFAULT_MARKER_MAP_OPTIONS.traversal; const startCorner = ( options?.startCorner === 'top-right' || options?.startCorner === 'bottom-left' || options?.startCorner === 'bottom-right' ) ? options.startCorner : DEFAULT_MARKER_MAP_OPTIONS.startCorner; const anchor = (
```

**Parameters**

- `options: MarkerMapOptions | undefined`: input argument of type `MarkerMapOptions | undefined`.

**Return Value**

- Value of type `NormalizedMarkerMapOptions` consumed by downstream logic.

**Purpose**

- Normalizes `normalizeMarkerMapOptions` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `normalizeMarkerMapOptions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
normalizeMarkerMapOptions(/* options */);
```

### `normalizeMarkerValue`

- Full name: `normalizeMarkerValue`
- Location: `public/modules/environment/obstacles/markers.ts:94`
- Return type: `string`

**Signature**

```ts
function normalizeMarkerValue(kind: MarkerKind, dictionaryId: MarkerDictionaryId, value: string) { const definition = MARKER_DICTIONARIES[dictionaryId]; const parsed = parseMarkerId(value); const clamped = Math.min(parsed, definition.markerCount - 1); return String(clamped); }
```

**Parameters**

- `kind: MarkerKind`: input argument of type `MarkerKind`.
- `dictionaryId: MarkerDictionaryId`: input argument of type `MarkerDictionaryId`.
- `value: string`: numeric value being displayed, normalized, or transformed.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Normalizes `normalizeMarkerValue` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `normalizeMarkerValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
normalizeMarkerValue(/* kind */, 'drone_1', 0);
```

### `parseMarkerId`

- Full name: `parseMarkerId`
- Location: `public/modules/environment/obstacles/markers.ts:61`
- Return type: `number`

**Signature**

```ts
function parseMarkerId(value: string) { const parsed = Number.parseInt(value || '0', 10); return Number.isFinite(parsed) ? Math.max(0, parsed) : 0; }
```

**Parameters**

- `value: string`: numeric value being displayed, normalized, or transformed.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `parseMarkerId` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `parseMarkerId` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
parseMarkerId(0);
```

### `snapMarkerToSurface`

- Full name: `snapMarkerToSurface`
- Location: `public/modules/environment/obstacles/markers.ts:492`
- Return type: `boolean`

**Signature**

```ts
export function snapMarkerToSurface(object: THREE.Object3D, surfaceObjects: THREE.Object3D[] = []) { if (!isMarkerObject(object)) return false; const marker = object as THREE.Group; const currentPosition = marker.position.clone(); const candidates: MarkerSurfaceCandidate[] = [ makeCandidate(currentPosition, new THREE.Vector3(currentPosition.x, currentPosition.y, 0), new THREE.Vector3(0, 0, 1)) ];
```

**Parameters**

- `object: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `surfaceObjects?: THREE.Object3D[]`: input argument of type `THREE.Object3D[]`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `snapMarkerToSurface` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `snapMarkerToSurface` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
snapMarkerToSurface(/* object */, /* surfaceObjects */);
```

### `updateMarkerMaterials`

- Full name: `updateMarkerMaterials`
- Location: `public/modules/environment/obstacles/markers.ts:420`
- Return type: `void`

**Signature**

```ts
function updateMarkerMaterials(sheet: THREE.Mesh, kind: MarkerKind, dictionaryId: MarkerDictionaryId, value: string) { if (!Array.isArray(sheet.material)) return; const texturedMaterials = sheet.material.filter( (material, index) => (index === 4 || index === 5) && material instanceof THREE.MeshStandardMaterial ) as THREE.MeshStandardMaterial[]; const mapsToDispose = new Set<THREE.Texture>(); texturedMaterials.forEach((material) => { if (material.map) mapsToDispose.add(material.map);
```

**Parameters**

- `sheet: THREE.Mesh`: input argument of type `THREE.Mesh`.
- `kind: MarkerKind`: input argument of type `MarkerKind`.
- `dictionaryId: MarkerDictionaryId`: input argument of type `MarkerDictionaryId`.
- `value: string`: numeric value being displayed, normalized, or transformed.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateMarkerMaterials` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `updateMarkerMaterials` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateMarkerMaterials(/* sheet */, /* kind */, 'drone_1', 0);
```

### `updateMarkerValue`

- Full name: `updateMarkerValue`
- Location: `public/modules/environment/obstacles/markers.ts:438`
- Return type: `boolean`

**Signature**

```ts
export function updateMarkerValue( object: THREE.Object3D, params: { value?: string; dictionaryId?: string } ) { const group = object as THREE.Group; if (!group.userData.supportsValue || !isMarkerObject(group)) return false; const kind = group.userData.markerKind === 'AprilTag' ? 'AprilTag' : 'ArUco';
```

**Parameters**

- `object: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `params: { value?: string; dictionaryId?: string }`: aggregated call parameters object.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Updates `updateMarkerValue` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `updateMarkerValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateMarkerValue(/* object */, /* ... */);
```

### `wrapMarkerId`

- Full name: `wrapMarkerId`
- Location: `public/modules/environment/obstacles/markers.ts:113`
- Return type: `number`

**Signature**

```ts
function wrapMarkerId(markerId: number, dictionaryId: MarkerDictionaryId) { const count = MARKER_DICTIONARIES[dictionaryId].markerCount; if (count <= 0) return 0; return ((markerId % count) + count) % count; }
```

**Parameters**

- `markerId: number`: input argument of type `number`.
- `dictionaryId: MarkerDictionaryId`: input argument of type `MarkerDictionaryId`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `wrapMarkerId` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/markers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/markers.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `wrapMarkerId` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
wrapMarkerId('drone_1', 'drone_1');
```

## Module `public/modules/environment/obstacles/nature.ts`

Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers.

### `createFirTreeMesh`

- Full name: `createFirTreeMesh`
- Location: `public/modules/environment/obstacles/nature.ts:14`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createFirTreeMesh() { const group = new THREE.Group(); const trunk = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.07, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0x5b4636 }) ); trunk.position.z = 0.2; trunk.rotation.x = Math.PI / 2;
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createFirTreeMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/nature.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/nature.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createFirTreeMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createFirTreeMesh();
```

### `createHillMesh`

- Full name: `createHillMesh`
- Location: `public/modules/environment/obstacles/nature.ts:4`
- Return type: `Mesh<ConeGeometry, MeshStandardMaterial, Object3DEventMap>`

**Signature**

```ts
export function createHillMesh() { const geom = new THREE.ConeGeometry(2, 2.5, 12); const mat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.9 }); const hill = setCommonMeta(new THREE.Mesh(geom, mat), 'Холм', { collidableRadius: 1.5 }); hill.rotation.x = Math.PI / 2; hill.position.z = 1.25; applyShadows(hill); return hill;
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Mesh<ConeGeometry, MeshStandardMaterial, Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createHillMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/nature.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/nature.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createHillMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createHillMesh();
```

### `createParkPatch`

- Full name: `createParkPatch`
- Location: `public/modules/environment/obstacles/nature.ts:60`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createParkPatch(width: number, depth: number) { const group = new THREE.Group(); const patch = new THREE.Mesh( new THREE.BoxGeometry(width, depth, 0.05), new THREE.MeshStandardMaterial({ color: 0x9ad17b, roughness: 0.98 }) ); patch.position.z = 0.025; group.add(patch);
```

**Parameters**

- `width: number`: input argument of type `number`.
- `depth: number`: input argument of type `number`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createParkPatch` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/nature.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/nature.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createParkPatch` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createParkPatch('drone_1', /* depth */);
```

### `createTreeMesh`

- Full name: `createTreeMesh`
- Location: `public/modules/environment/obstacles/nature.ts:38`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createTreeMesh(scale = 1) { const group = new THREE.Group(); const trunk = new THREE.Mesh( new THREE.CylinderGeometry(0.08 * scale, 0.1 * scale, 0.9 * scale, 10), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.95 }) ); trunk.position.z = 0.45 * scale; trunk.rotation.x = Math.PI / 2;
```

**Parameters**

- `scale?: number`: input argument of type `number`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createTreeMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/nature.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/nature.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createTreeMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createTreeMesh(/* scale */);
```

## Module `public/modules/environment/obstacles/pads.ts`

Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers.

### `createLandingPad`

- Full name: `createLandingPad`
- Location: `public/modules/environment/obstacles/pads.ts:37`
- Return type: `Mesh<CircleGeometry, MeshBasicMaterial, Object3DEventMap>`

**Signature**

```ts
export function createLandingPad(scene: THREE.Scene, pos: THREE.Vector3) { const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128; const ctx = canvas.getContext('2d'); if (ctx) { ctx.fillStyle = '#22c55e';
```

**Parameters**

- `scene: THREE.Scene`: Three.js scene instance used as the target container.
- `pos: THREE.Vector3`: input argument of type `THREE.Vector3`.

**Return Value**

- Value of type `Mesh<CircleGeometry, MeshBasicMaterial, Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createLandingPad` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/pads.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/pads.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createLandingPad` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createLandingPad(/* ... */, /* pos */);
```

### `createStyledLandingPad`

- Full name: `createStyledLandingPad`
- Location: `public/modules/environment/obstacles/pads.ts:4`
- Return type: `Mesh<PlaneGeometry, MeshStandardMaterial, Object3DEventMap>`

**Signature**

```ts
export function createStyledLandingPad(text: string, bgColor = '#2563eb', textColor = '#ffffff') { const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256; const ctx = canvas.getContext('2d'); if (ctx) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, 256, 256); ctx.strokeStyle = textColor;
```

**Parameters**

- `text: string`: input argument of type `string`.
- `bgColor?: string`: input argument of type `string`.
- `textColor?: string`: input argument of type `string`.

**Return Value**

- Value of type `Mesh<PlaneGeometry, MeshStandardMaterial, Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createStyledLandingPad` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/pads.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/pads.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createStyledLandingPad` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createStyledLandingPad(/* text */, /* bgColor */, /* textColor */);
```

### `createTransportMesh`

- Full name: `createTransportMesh`
- Location: `public/modules/environment/obstacles/pads.ts:69`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createTransportMesh() { const group = setCommonMeta(new THREE.Group(), 'Транспорт', { collidableRadius: 0.5 }); const body = new THREE.Mesh( new THREE.BoxGeometry(0.8, 0.4, 0.3), new THREE.MeshStandardMaterial({ color: 0x334155 }) ); body.position.z = 0.2; group.add(body);
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createTransportMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/pads.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/pads.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createTransportMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createTransportMesh();
```

## Module `public/modules/environment/obstacles/presets.ts`

Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers.

### `createGeoskanArenaPreset`

- Full name: `createGeoskanArenaPreset`
- Location: `public/modules/environment/obstacles/presets.ts:201`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createGeoskanArenaPreset() { const group = setCommonMeta(new THREE.Group(), 'Пресет: Геоскан Арена', { collidableRadius: 18, presetName: 'geoskan-arena' }); const arena = createArenaSpaceMesh(); group.add(arena);
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createGeoskanArenaPreset` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/presets.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/presets.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createGeoskanArenaPreset` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createGeoskanArenaPreset();
```

### `createRaceTrackPreset`

- Full name: `createRaceTrackPreset`
- Location: `public/modules/environment/obstacles/presets.ts:29`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createRaceTrackPreset() { const group = setCommonMeta(new THREE.Group(), 'Пресет: гоночная трасса', { collidableRadius: 16, presetName: 'race-track' }); const road = createRoadMesh({ closed: true,
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createRaceTrackPreset` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/presets.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/presets.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createRaceTrackPreset` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createRaceTrackPreset();
```

### `createResidentialPreset`

- Full name: `createResidentialPreset`
- Location: `public/modules/environment/obstacles/presets.ts:101`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createResidentialPreset() { const group = setCommonMeta(new THREE.Group(), 'Пресет: спальный район', { collidableRadius: 22, presetName: 'residential' }); const roadMain = createRoadMesh({ points: [
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createResidentialPreset` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/presets.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/presets.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `createResidentialPreset` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createResidentialPreset();
```

## Module `public/modules/environment/obstacles/utils.ts`

Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers.

### `applyShadows`

- Full name: `applyShadows`
- Location: `public/modules/environment/obstacles/utils.ts:16`
- Return type: `void`

**Signature**

```ts
export function applyShadows(root: THREE.Object3D) { root.traverse((node: any) => { if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; // Thin or procedurally composed scene props sometimes pop out during camera motion // because their bounds are too aggressive for frustum culling. node.frustumCulled = false;
```

**Parameters**

- `root: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Applies `applyShadows` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/utils.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/utils.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `applyShadows` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
applyShadows(/* root */);
```

### `clearGeneratedChildren`

- Full name: `clearGeneratedChildren`
- Location: `public/modules/environment/obstacles/utils.ts:41`
- Return type: `void`

**Signature**

```ts
export function clearGeneratedChildren(group: THREE.Group) { for (let i = group.children.length - 1; i >= 0; i--) { const child = group.children[i]; group.remove(child); disposeObject3D(child); } }
```

**Parameters**

- `group: THREE.Group`: input argument of type `THREE.Group`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `clearGeneratedChildren` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/utils.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/utils.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `clearGeneratedChildren` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clearGeneratedChildren(/* group */);
```

### `disposeObject3D`

- Full name: `disposeObject3D`
- Location: `public/modules/environment/obstacles/utils.ts:28`
- Return type: `void`

**Signature**

```ts
export function disposeObject3D(root: THREE.Object3D) { root.traverse((child: any) => { if (child.isMesh) { if (child.geometry) child.geometry.dispose(); if (Array.isArray(child.material)) { child.material.forEach((mat: THREE.Material) => mat.dispose()); } else if (child.material) { child.material.dispose();
```

**Parameters**

- `root: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `disposeObject3D` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/utils.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/utils.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `disposeObject3D` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
disposeObject3D(/* root */);
```

### `setCommonMeta`

- Full name: `setCommonMeta`
- Location: `public/modules/environment/obstacles/utils.ts:3`
- Return type: `T`

**Signature**

```ts
export function setCommonMeta<T extends THREE.Object3D>(obj: T, type: string, extra: Record<string, unknown> = {}) { obj.name = type; obj.userData = { ...obj.userData, draggable: true, type, label: type, collidableRadius: 0.75,
```

**Parameters**

- `obj: T`: input argument of type `T`.
- `type: string`: message, state, or category discriminator.
- `extra?: Record<string, unknown>`: input argument of type `Record<string, unknown>`.

**Return Value**

- Value of type `T` consumed by downstream logic.

**Purpose**

- Sets `setCommonMeta` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/obstacles/utils.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/obstacles/utils.ts`. Environment obstacle factory module. Returns prebuilt Three.js meshes or groups used by the scene/object managers. In practice, it isolates the implementation details of `setCommonMeta` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setCommonMeta(/* obj */, /* type */, /* extra */);
```

## Module `public/modules/environment/truss-arena.ts`

Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements.

### `createTrussArena`

- Full name: `createTrussArena`
- Location: `public/modules/environment/truss-arena.ts:55`
- Return type: `void`

**Signature**

```ts
export function createTrussArena(group: THREE.Group) { group.add(createTrussArenaMesh()); }
```

**Parameters**

- `group: THREE.Group`: input argument of type `THREE.Group`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Creates `createTrussArena` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/truss-arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/truss-arena.ts`. Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements. In practice, it isolates the implementation details of `createTrussArena` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createTrussArena(/* group */);
```

### `createTrussArenaMesh`

- Full name: `createTrussArenaMesh`
- Location: `public/modules/environment/truss-arena.ts:3`
- Return type: `Group<Object3DEventMap>`

**Signature**

```ts
export function createTrussArenaMesh(size = 18, height = 5) { const group = new THREE.Group(); const trussRadius = 0.05; const trussMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 }); const createTruss = (p1: THREE.Vector3, p2: THREE.Vector3) => { const dist = p1.distanceTo(p2); const geom = new THREE.CylinderGeometry(trussRadius, trussRadius, dist, 8);
```

**Parameters**

- `size?: number`: input argument of type `number`.
- `height?: number`: input argument of type `number`.

**Return Value**

- Value of type `Group<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createTrussArenaMesh` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/truss-arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/truss-arena.ts`. Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements. In practice, it isolates the implementation details of `createTrussArenaMesh` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createTrussArenaMesh(/* size */, 0);
```

### `createTrussArenaMesh.createTruss`

- Full name: `createTrussArenaMesh.createTruss`
- Location: `public/modules/environment/truss-arena.ts:8`
- Return type: `void`

**Signature**

```ts
(p1: THREE.Vector3, p2: THREE.Vector3) => { const dist = p1.distanceTo(p2); const geom = new THREE.CylinderGeometry(trussRadius, trussRadius, dist, 8); const truss = new THREE.Mesh(geom, trussMat); truss.position.copy(p1).lerp(p2, 0.5); truss.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize()); group.add(truss); }
```

**Parameters**

- `p1: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `p2: THREE.Vector3`: input argument of type `THREE.Vector3`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Creates `createTrussArenaMesh.createTruss` in environment setup. It encapsulates one well-defined step of the module contract in `public/modules/environment/truss-arena.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/environment/truss-arena.ts`. Environment setup module. Creates ground, lighting, obstacle presets, and other static scene elements. In practice, it isolates the implementation details of `createTruss` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createTruss(/* p1 */, /* p2 */);
```

## Module `public/modules/lua/autopilot.ts`

Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch.

### `ap_goToLocalPoint`

- Full name: `ap_goToLocalPoint`
- Location: `public/modules/lua/autopilot.ts:34`
- Return type: `number`

**Signature**

```ts
function(L: any) { if (window.fengari.lua.lua_gettop(L) < 3) return 0; const x = window.fengari.lua.lua_tonumber(L, 1); const y = window.fengari.lua.lua_tonumber(L, 2); const z = window.fengari.lua.lua_tonumber(L, 3); const time = (window.fengari.lua.lua_gettop(L) >= 4) ? window.fengari.lua.lua_tonumber(L, 4) : 0; const simState = getDroneFromLua(L);
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `ap_goToLocalPoint` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/autopilot.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/autopilot.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `ap_goToLocalPoint` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
ap_goToLocalPoint(/* L */);
```

### `ap_goToPoint`

- Full name: `ap_goToPoint`
- Location: `public/modules/lua/autopilot.ts:22`
- Return type: `number`

**Signature**

```ts
function(L: any) { if (window.fengari.lua.lua_gettop(L) < 3) return 0; const lat = window.fengari.lua.lua_tonumber(L, 1); const lon = window.fengari.lua.lua_tonumber(L, 2); const alt = window.fengari.lua.lua_tonumber(L, 3); const simState = getDroneFromLua(L); simState.target_pos = { x: (lon - 304206500) * 0.01, y: (lat - 600859810) * 0.01, z: alt }; simState.status = 'ПОЛЕТ_GPS';
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `ap_goToPoint` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/autopilot.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/autopilot.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `ap_goToPoint` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
ap_goToPoint(/* L */);
```

### `ap_push`

- Full name: `ap_push`
- Location: `public/modules/lua/autopilot.ts:12`
- Return type: `number`

**Signature**

```ts
function(L: any) { if (window.fengari.lua.lua_gettop(L) < 1) return 0; const event = window.fengari.lua.lua_tointeger(L, 1); const simState = getDroneFromLua(L); simState.command_queue.push(event); pushCommand(event); log(`[Lua AP] ap.push(${event}) - Команда добавлена в очередь`, 'info'); return 0;
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `ap_push` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/autopilot.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/autopilot.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `ap_push` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
ap_push(/* L */);
```

### `ap_updateYaw`

- Full name: `ap_updateYaw`
- Location: `public/modules/lua/autopilot.ts:82`
- Return type: `number`

**Signature**

```ts
function(L: any) { if (window.fengari.lua.lua_gettop(L) < 1) return 0; const yaw = window.fengari.lua.lua_tonumber(L, 1); const simState = getDroneFromLua(L); simState.target_yaw = yaw; log(`[Lua AP] ap.updateYaw(${yaw.toFixed(2)} рад)`, 'info'); return 0; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `ap_updateYaw` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/autopilot.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/autopilot.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `ap_updateYaw` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
ap_updateYaw(/* L */);
```

### `setLocalFrameOrigin`

- Full name: `setLocalFrameOrigin`
- Location: `public/modules/lua/autopilot.ts:7`
- Return type: `void`

**Signature**

```ts
export function setLocalFrameOrigin(x: number, y: number, z: number) { localFrameOrigin = { x, y, z }; log(`AP: Локальная система координат установлена в (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`, 'info'); }
```

**Parameters**

- `x: number`: input argument of type `number`.
- `y: number`: input argument of type `number`.
- `z: number`: input argument of type `number`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setLocalFrameOrigin` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/autopilot.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/autopilot.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `setLocalFrameOrigin` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setLocalFrameOrigin(/* x */, /* y */, /* z */);
```

## Module `public/modules/lua/hardware.ts`

Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch.

### `camera_checkRequestShot`

- Full name: `camera_checkRequestShot`
- Location: `public/modules/lua/hardware.ts:16`
- Return type: `number`

**Signature**

```ts
function(L: any) { window.fengari.lua.lua_pushinteger(L, 0); return 1; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `camera_checkRequestShot` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/hardware.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/hardware.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `camera_checkRequestShot` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
camera_checkRequestShot(/* L */);
```

### `camera_requestMakeShot`

- Full name: `camera_requestMakeShot`
- Location: `public/modules/lua/hardware.ts:5`
- Return type: `number`

**Signature**

```ts
function(L: any) { log('Camera: Запрос снимка', 'info'); if (window.scene && window.droneMesh) { const flash = new THREE.PointLight(0xffffff, 2, 10); flash.position.copy(window.droneMesh.position).add(new THREE.Vector3(0, 0, 0.2)); window.scene.add(flash); setTimeout(() => window.scene.remove(flash), 100); }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `camera_requestMakeShot` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/hardware.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/hardware.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `camera_requestMakeShot` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
camera_requestMakeShot(/* L */);
```

### `camera_requestRecordStart`

- Full name: `camera_requestRecordStart`
- Location: `public/modules/lua/hardware.ts:21`
- Return type: `number`

**Signature**

```ts
function(L: any) { log('Camera: Старт записи видео', 'info'); return 0; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `camera_requestRecordStart` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/hardware.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/hardware.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `camera_requestRecordStart` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
camera_requestRecordStart(/* L */);
```

### `camera_requestRecordStop`

- Full name: `camera_requestRecordStop`
- Location: `public/modules/lua/hardware.ts:26`
- Return type: `number`

**Signature**

```ts
function(L: any) { log('Camera: Стоп записи видео', 'info'); return 0; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `camera_requestRecordStop` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/hardware.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/hardware.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `camera_requestRecordStop` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
camera_requestRecordStop(/* L */);
```

### `gpio_new`

- Full name: `gpio_new`
- Location: `public/modules/lua/hardware.ts:31`
- Return type: `number`

**Signature**

```ts
function(L: any) { window.fengari.lua.lua_newtable(L); const methods = ['read', 'set', 'reset', 'write', 'setFunction']; methods.forEach(m => { window.fengari.lua.lua_pushcfunction(L, (L: any) => { log(`GPIO: ${m} called`, 'info'); if (m === 'read') window.fengari.lua.lua_pushboolean(L, false); return m === 'read' ? 1 : 0;
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `gpio_new` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/hardware.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/hardware.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `gpio_new` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
gpio_new(/* L */);
```

### `spi_new`

- Full name: `spi_new`
- Location: `public/modules/lua/hardware.ts:59`
- Return type: `number`

**Signature**

```ts
function(L: any) { window.fengari.lua.lua_newtable(L); const methods = ['read', 'write', 'exchange']; methods.forEach(m => { window.fengari.lua.lua_pushcfunction(L, (L: any) => { log(`SPI: ${m} called`, 'info'); if (m === 'read') window.fengari.lua.lua_pushstring(L, ""); if (m === 'exchange') window.fengari.lua.lua_pushstring(L, "");
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `spi_new` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/hardware.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/hardware.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `spi_new` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
spi_new(/* L */);
```

### `uart_new`

- Full name: `uart_new`
- Location: `public/modules/lua/hardware.ts:45`
- Return type: `number`

**Signature**

```ts
function(L: any) { window.fengari.lua.lua_newtable(L); const methods = ['read', 'write', 'bytesToRead', 'setBaudRate']; methods.forEach(m => { window.fengari.lua.lua_pushcfunction(L, (L: any) => { if (m === 'read') window.fengari.lua.lua_pushstring(L, ""); if (m === 'bytesToRead') window.fengari.lua.lua_pushinteger(L, 0); return (m === 'read' || m === 'bytesToRead') ? 1 : 0;
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `uart_new` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/hardware.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/hardware.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `uart_new` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
uart_new(/* L */);
```

## Module `public/modules/lua/index.ts`

Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch.

### `runLuaScript`

- Full name: `runLuaScript`
- Location: `public/modules/lua/index.ts:130`
- Return type: `void`

**Signature**

```ts
export function runLuaScript(id: string, scriptContent: string) { const drone = drones[id]; if (!drone) return; if (drone.luaState) { try { window.fengari.lua.lua_close(drone.luaState); } catch (e) {
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.
- `scriptContent: string`: source code text that will be executed.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `runLuaScript` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/index.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/index.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `runLuaScript` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
runLuaScript('drone_1', '// script body');
```

### `setupLuaBridgeForDrone`

- Full name: `setupLuaBridgeForDrone`
- Location: `public/modules/lua/index.ts:12`
- Return type: `any`

**Signature**

```ts
export function setupLuaBridgeForDrone(id: string) { const L = window.fengari.L; const lua = window.fengari.lua; const lauxlib = window.fengari.lauxlib; const lualib = window.fengari.lualib; const setupScript = ` Ev = { 
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.

**Return Value**

- Loosely typed result; callers must interpret it based on the surrounding runtime contract.

**Purpose**

- Sets `setupLuaBridgeForDrone` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/index.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/index.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `setupLuaBridgeForDrone` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setupLuaBridgeForDrone('drone_1');
```

### `stopLuaScript`

- Full name: `stopLuaScript`
- Location: `public/modules/lua/index.ts:171`
- Return type: `void`

**Signature**

```ts
export function stopLuaScript(id: string) { const drone = drones[id]; if (drone && drone.luaState) { window.fengari.lua.lua_close(drone.luaState); drone.luaState = null; } }
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Stops or finalizes `stopLuaScript` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/index.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/index.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `stopLuaScript` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
stopLuaScript('drone_1');
```

### `triggerLuaCallback`

- Full name: `triggerLuaCallback`
- Location: `public/modules/lua/index.ts:216`
- Return type: `void`

**Signature**

```ts
export function triggerLuaCallback(id: string, eventId: number) { const drone = drones[id]; if (!drone || !drone.luaState) return; const L = drone.luaState; // console.log(`[Lua Debug] Triggering callback ${eventId} for drone ${id}`); window.fengari.lua.lua_getglobal(L, window.fengari.to_luastring("callback"));
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.
- `eventId: number`: numeric event/callback identifier.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `triggerLuaCallback` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/index.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/index.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `triggerLuaCallback` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
triggerLuaCallback('drone_1', 'drone_1');
```

### `updateTimers`

- Full name: `updateTimers`
- Location: `public/modules/lua/index.ts:179`
- Return type: `void`

**Signature**

```ts
export function updateTimers() { const lua = window.fengari.lua; const lauxlib = window.fengari.lauxlib; for (const id in drones) { const drone = drones[id]; if (!drone.running || !drone.luaState) continue; const L = drone.luaState;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateTimers` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/index.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/index.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `updateTimers` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateTimers();
```

## Module `public/modules/lua/leds.ts`

Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch.

### `js_init_leds`

- Full name: `js_init_leds`
- Location: `public/modules/lua/leds.ts:30`
- Return type: `number`

**Signature**

```ts
function(L: any) { const count = window.fengari.lua.lua_tointeger(L, 1); const simState = getDroneFromLua(L); simState.leds = Array.from({ length: count }, () => ({r: 0, g: 0, b: 0, w: 0})); return 0; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `js_init_leds` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/leds.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/leds.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `js_init_leds` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
js_init_leds(/* L */);
```

### `js_ledbar_set`

- Full name: `js_ledbar_set`
- Location: `public/modules/lua/leds.ts:37`
- Return type: `number`

**Signature**

```ts
function(L: any) { if (window.fengari.lua.lua_gettop(L) < 4) return 0; const index = window.fengari.lua.lua_tointeger(L, 1); const r = window.fengari.lua.lua_tonumber(L, 2); const g = window.fengari.lua.lua_tonumber(L, 3); const b = window.fengari.lua.lua_tonumber(L, 4); const simState = getDroneFromLua(L);
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `js_ledbar_set` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/leds.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/leds.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `js_ledbar_set` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
js_ledbar_set(/* L */);
```

### `ledbar_fromHSV`

- Full name: `ledbar_fromHSV`
- Location: `public/modules/lua/leds.ts:3`
- Return type: `number`

**Signature**

```ts
function(L: any) { const h = window.fengari.lua.lua_tonumber(L, 1); const s = window.fengari.lua.lua_tonumber(L, 2); const v = window.fengari.lua.lua_tonumber(L, 3); let r, g, b; const i = Math.floor(h * 6); const f = h * 6 - i;
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `ledbar_fromHSV` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/leds.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/leds.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `ledbar_fromHSV` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
ledbar_fromHSV(/* L */);
```

## Module `public/modules/lua/runner.ts`

Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch.

### `runCoroutine`

- Full name: `runCoroutine`
- Location: `public/modules/lua/runner.ts:5`
- Return type: `void`

**Signature**

```ts
export function runCoroutine(L: any, T: any, nresults: any, id: string) { const drone = drones[id]; if (!drone || !drone.running || !drone.luaState) return; const lua = window.fengari.lua; let status; try { status = lua.lua_resume(T, L, nresults);
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.
- `T: any`: input argument of type `any`.
- `nresults: any`: input argument of type `any`.
- `id: string`: string identifier of a drone or target entity.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `runCoroutine` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/runner.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/runner.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `runCoroutine` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
runCoroutine(/* L */, /* T */, /* nresults */, 'drone_1');
```

## Module `public/modules/lua/sensors.ts`

Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch.

### `sensors_accel`

- Full name: `sensors_accel`
- Location: `public/modules/lua/sensors.ts:19`
- Return type: `number`

**Signature**

```ts
function(L: any) { const simState = getDroneFromLua(L); window.fengari.lua.lua_pushnumber(L, simState.accel.x); window.fengari.lua.lua_pushnumber(L, simState.accel.y); window.fengari.lua.lua_pushnumber(L, simState.accel.z); return 3; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `sensors_accel` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/sensors.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/sensors.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `sensors_accel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sensors_accel(/* L */);
```

### `sensors_battery`

- Full name: `sensors_battery`
- Location: `public/modules/lua/sensors.ts:49`
- Return type: `number`

**Signature**

```ts
function(L: any) { const simState = getDroneFromLua(L); window.fengari.lua.lua_pushnumber(L, simState.battery); return 1; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `sensors_battery` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/sensors.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/sensors.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `sensors_battery` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sensors_battery(/* L */);
```

### `sensors_gyro`

- Full name: `sensors_gyro`
- Location: `public/modules/lua/sensors.ts:27`
- Return type: `number`

**Signature**

```ts
function(L: any) { const simState = getDroneFromLua(L); window.fengari.lua.lua_pushnumber(L, simState.gyro.x); window.fengari.lua.lua_pushnumber(L, simState.gyro.y); window.fengari.lua.lua_pushnumber(L, simState.gyro.z); return 3; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `sensors_gyro` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/sensors.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/sensors.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `sensors_gyro` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sensors_gyro(/* L */);
```

### `sensors_orientation`

- Full name: `sensors_orientation`
- Location: `public/modules/lua/sensors.ts:35`
- Return type: `number`

**Signature**

```ts
function(L: any) { const simState = getDroneFromLua(L); window.fengari.lua.lua_pushnumber(L, simState.orientation.roll); window.fengari.lua.lua_pushnumber(L, simState.orientation.pitch); window.fengari.lua.lua_pushnumber(L, simState.orientation.yaw); return 3; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `sensors_orientation` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/sensors.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/sensors.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `sensors_orientation` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sensors_orientation(/* L */);
```

### `sensors_pos`

- Full name: `sensors_pos`
- Location: `public/modules/lua/sensors.ts:3`
- Return type: `number`

**Signature**

```ts
function(L: any) { const simState = getDroneFromLua(L); window.fengari.lua.lua_pushnumber(L, simState.pos.x); window.fengari.lua.lua_pushnumber(L, simState.pos.y); window.fengari.lua.lua_pushnumber(L, simState.pos.z); return 3; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `sensors_pos` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/sensors.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/sensors.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `sensors_pos` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sensors_pos(/* L */);
```

### `sensors_range`

- Full name: `sensors_range`
- Location: `public/modules/lua/sensors.ts:43`
- Return type: `number`

**Signature**

```ts
function(L: any) { const simState = getDroneFromLua(L); window.fengari.lua.lua_pushnumber(L, simState.pos.z); return 1; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `sensors_range` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/sensors.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/sensors.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `sensors_range` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sensors_range(/* L */);
```

### `sensors_tof`

- Full name: `sensors_tof`
- Location: `public/modules/lua/sensors.ts:55`
- Return type: `number`

**Signature**

```ts
function(L: any) { const simState = getDroneFromLua(L); window.fengari.lua.lua_pushnumber(L, simState.pos.z * 1000); return 1; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `sensors_tof` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/sensors.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/sensors.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `sensors_tof` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sensors_tof(/* L */);
```

### `sensors_vel`

- Full name: `sensors_vel`
- Location: `public/modules/lua/sensors.ts:11`
- Return type: `number`

**Signature**

```ts
function(L: any) { const simState = getDroneFromLua(L); window.fengari.lua.lua_pushnumber(L, simState.vel.x); window.fengari.lua.lua_pushnumber(L, simState.vel.y); window.fengari.lua.lua_pushnumber(L, simState.vel.z); return 3; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `sensors_vel` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/sensors.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/sensors.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `sensors_vel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sensors_vel(/* L */);
```

## Module `public/modules/lua/timers.ts`

Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch.

### `js_sleep`

- Full name: `js_sleep`
- Location: `public/modules/lua/timers.ts:78`
- Return type: `any`

**Signature**

```ts
function(L: any) { const delay = window.fengari.lua.lua_tonumber(L, 1); window.fengari.lua.lua_pushnumber(L, delay); return window.fengari.lua.lua_yield(L, 1); }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Loosely typed result; callers must interpret it based on the surrounding runtime contract.

**Purpose**

- Performs `js_sleep` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/timers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/timers.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `js_sleep` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
js_sleep(/* L */);
```

### `sys_deltaTime`

- Full name: `sys_deltaTime`
- Location: `public/modules/lua/timers.ts:73`
- Return type: `number`

**Signature**

```ts
function(L: any) { window.fengari.lua.lua_pushnumber(L, 0.05); return 1; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `sys_deltaTime` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/timers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/timers.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `sys_deltaTime` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sys_deltaTime(/* L */);
```

### `sys_time`

- Full name: `sys_time`
- Location: `public/modules/lua/timers.ts:67`
- Return type: `number`

**Signature**

```ts
function(L: any) { const simState = getDroneFromLua(L); window.fengari.lua.lua_pushnumber(L, simState.current_time); return 1; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `sys_time` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/timers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/timers.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `sys_time` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sys_time(/* L */);
```

### `timer_callLater`

- Full name: `timer_callLater`
- Location: `public/modules/lua/timers.ts:4`
- Return type: `number`

**Signature**

```ts
function(L: any) { if (window.fengari.lua.lua_gettop(L) < 2) return 0; const delay = window.fengari.lua.lua_tonumber(L, 1); window.fengari.lua.lua_pushvalue(L, 2); const func_ref = window.fengari.lauxlib.luaL_ref(L, window.fengari.lua.LUA_REGISTRYINDEX); const simState = getDroneFromLua(L); simState.timers.push({
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `timer_callLater` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/timers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/timers.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `timer_callLater` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
timer_callLater(/* L */);
```

### `timer_new`

- Full name: `timer_new`
- Location: `public/modules/lua/timers.ts:21`
- Return type: `0 | 1`

**Signature**

```ts
function(L: any) { if (window.fengari.lua.lua_gettop(L) < 2) return 0; const period = window.fengari.lua.lua_tonumber(L, 1); window.fengari.lua.lua_pushvalue(L, 2); const func_ref = window.fengari.lauxlib.luaL_ref(L, window.fengari.lua.LUA_REGISTRYINDEX); const simState = getDroneFromLua(L); const timer_obj = {
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Value of type `0 | 1` consumed by downstream logic.

**Purpose**

- Performs `timer_new` in the Lua runtime. It encapsulates one well-defined step of the module contract in `public/modules/lua/timers.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/lua/timers.ts`. Lua integration module. Builds the JS-Lua bridge, executes scripts, handles timers, sensors, hardware APIs, and callback dispatch. In practice, it isolates the implementation details of `timer_new` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
timer_new(/* L */);
```

## Module `public/modules/mce-events.ts`

Core simulator module. Contains shared runtime logic, state management, or foundational services.

### `EventEmitter.emit`

- Full name: `EventEmitter.emit`
- Location: `public/modules/mce-events.ts:22`
- Return type: `void`

**Signature**

```ts
emit(event: string, ...args: any[]) { if (!this.listeners[event]) return; this.listeners[event].forEach(cb => cb(...args)); }
```

**Parameters**

- `event: string`: input argument of type `string`.
- `args: any[]`: input argument of type `any[]`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `EventEmitter.emit` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/mce-events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/mce-events.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `emit` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
emit(/* event */, /* args */);
```

### `EventEmitter.off`

- Full name: `EventEmitter.off`
- Location: `public/modules/mce-events.ts:17`
- Return type: `void`

**Signature**

```ts
off(event: string, callback: (...args: any[]) => void) { if (!this.listeners[event]) return; this.listeners[event] = this.listeners[event].filter(cb => cb !== callback); }
```

**Parameters**

- `event: string`: input argument of type `string`.
- `callback: (...args: any[]) => void`: input argument of type `(...args: any[]) => void`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `EventEmitter.off` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/mce-events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/mce-events.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `off` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
off(/* event */, /* callback */);
```

### `EventEmitter.on`

- Full name: `EventEmitter.on`
- Location: `public/modules/mce-events.ts:10`
- Return type: `void`

**Signature**

```ts
on(event: string, callback: (...args: any[]) => void) { if (!this.listeners[event]) { this.listeners[event] = []; } this.listeners[event].push(callback); }
```

**Parameters**

- `event: string`: input argument of type `string`.
- `callback: (...args: any[]) => void`: input argument of type `(...args: any[]) => void`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `EventEmitter.on` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/mce-events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/mce-events.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `on` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
on(/* event */, /* callback */);
```

### `pushCommand`

- Full name: `pushCommand`
- Location: `public/modules/mce-events.ts:87`
- Return type: `Promise<void>`

**Signature**

```ts
export function pushCommand(cmdId: number): Promise<void> { return new Promise((resolve) => { const desc = MCECommandDesc[cmdId] || `Неизвестная команда (${cmdId})`; log(`Команда MCE: ${desc}`, 'info'); setTimeout(() => { resolve(); }, 100);
```

**Parameters**

- `cmdId: number`: input argument of type `number`.

**Return Value**

- Promise resolved when the asynchronous workflow completes.

**Purpose**

- Performs `pushCommand` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/mce-events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/mce-events.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `pushCommand` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
pushCommand('drone_1');
```

### `runMCETests`

- Full name: `runMCETests`
- Location: `public/modules/mce-events.ts:105`
- Return type: `void`

**Signature**

```ts
export function runMCETests() { console.log('--- RUNNING MCE TESTS ---'); let testsPassed = true; // Test command descriptions if (MCECommandDesc[MCECommands.MCE_PREFLIGHT] !== 'Предполетная подготовка') { console.error('MCE Test Failed: MCE_PREFLIGHT description mismatch'); testsPassed = false;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `runMCETests` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/mce-events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/mce-events.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `runMCETests` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
runMCETests();
```

### `runMCETests.testCb`

- Full name: `runMCETests.testCb`
- Location: `public/modules/mce-events.ts:123`
- Return type: `void`

**Signature**

```ts
(id: number, desc: string) => { if(id === MCEEvents.SHOCK && desc === 'Удар') emitted = true; }
```

**Parameters**

- `id: number`: string identifier of a drone or target entity.
- `desc: string`: input argument of type `string`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `runMCETests.testCb` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/mce-events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/mce-events.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `testCb` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
testCb('drone_1', /* desc */);
```

### `triggerEvent`

- Full name: `triggerEvent`
- Location: `public/modules/mce-events.ts:98`
- Return type: `void`

**Signature**

```ts
export function triggerEvent(eventId: number) { // Check both command and event descriptions const desc = MCEEventDesc[eventId] || MCECommandDesc[eventId] || `Неизвестное событие (${eventId})`; log(`Событие MCE: ${desc}`, 'info'); mceEmitter.emit('autopilot_event', eventId, desc); }
```

**Parameters**

- `eventId: number`: numeric event/callback identifier.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `triggerEvent` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/mce-events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/mce-events.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `triggerEvent` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
triggerEvent('drone_1');
```

## Module `public/modules/physics.ts`

Top-level drone physics update loop. Combines controls, autopilot state, free fall, collisions, and status transitions.

### `updatePhysics`

- Full name: `updatePhysics`
- Location: `public/modules/physics.ts:25`
- Return type: `void`

**Signature**

```ts
export function updatePhysics(dt: number) { updateTimers(); updateDetachedCargoPhysics(dt, getObstacles); const STABILIZE_MAX_TILT = 0.75; const STABILIZE_LATERAL_ACCEL = 18.0; const ALTHOLD_MAX_TILT = 0.65; const ALTHOLD_LATERAL_ACCEL = 14.0;
```

**Parameters**

- `dt: number`: simulation time step in seconds.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updatePhysics` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/physics.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics.ts`. Top-level drone physics update loop. Combines controls, autopilot state, free fall, collisions, and status transitions. In practice, it isolates the implementation details of `updatePhysics` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updatePhysics(0.016);
```

## Module `public/modules/physics/cargo-contact.ts`

Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior.

### `applyGroundFriction`

- Full name: `applyGroundFriction`
- Location: `public/modules/physics/cargo-contact.ts:55`
- Return type: `boolean`

**Signature**

```ts
function applyGroundFriction( velocity: CargoVelocity, cargoMassKg: number, dt: number, impactSpeed: number, staticFriction: number, dynamicFriction: number ) {
```

**Parameters**

- `velocity: CargoVelocity`: input argument of type `CargoVelocity`.
- `cargoMassKg: number`: input argument of type `number`.
- `dt: number`: simulation time step in seconds.
- `impactSpeed: number`: input argument of type `number`.
- `staticFriction: number`: input argument of type `number`.
- `dynamicFriction: number`: input argument of type `number`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Applies `applyGroundFriction` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/cargo-contact.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/cargo-contact.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `applyGroundFriction` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
applyGroundFriction(/* velocity */, /* cargoMassKg */, 0.016, 0, /* staticFriction */, /* dynamicFriction */);
```

### `combineContactMaterials`

- Full name: `combineContactMaterials`
- Location: `public/modules/physics/cargo-contact.ts:42`
- Return type: `{ staticFriction: number; dynamicFriction: number; restitution: number; }`

**Signature**

```ts
function combineContactMaterials( cargoMaterial: Partial<PhysicsMaterial> | null | undefined, groundMaterial: Partial<PhysicsMaterial> | null | undefined ) { const cargo = resolvePhysicsMaterial(cargoMaterial, DEFAULT_CARGO_PHYSICS_MATERIAL); const ground = resolvePhysicsMaterial(groundMaterial, GROUND_PHYSICS_MATERIAL); return { staticFriction: Math.sqrt(cargo.staticFriction * ground.staticFriction),
```

**Parameters**

- `cargoMaterial: Partial<PhysicsMaterial> | null | undefined`: input argument of type `Partial<PhysicsMaterial> | null | undefined`.
- `groundMaterial: Partial<PhysicsMaterial> | null | undefined`: input argument of type `Partial<PhysicsMaterial> | null | undefined`.

**Return Value**

- Structured object with computed fields or configuration data.

**Purpose**

- Performs `combineContactMaterials` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/cargo-contact.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/cargo-contact.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `combineContactMaterials` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
combineContactMaterials(/* cargoMaterial */, /* groundMaterial */);
```

### `simulateDetachedCargoStep`

- Full name: `simulateDetachedCargoStep`
- Location: `public/modules/physics/cargo-contact.ts:97`
- Return type: `CargoStepState`

**Signature**

```ts
export function simulateDetachedCargoStep({ position, velocity, dt, airDrag = 0, cargoMassKg = DEFAULT_CARGO_MASS_KG, cargoMaterial, groundMaterial
```

**Parameters**

- `{
    position,
    velocity,
    dt,
    airDrag = 0,
    cargoMassKg = DEFAULT_CARGO_MASS_KG,
    cargoMaterial,
    groundMaterial
}: SimulateDetachedCargoStepArgs`: input argument of type `SimulateDetachedCargoStepArgs`.

**Return Value**

- Value of type `CargoStepState` consumed by downstream logic.

**Purpose**

- Performs `simulateDetachedCargoStep` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/cargo-contact.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/cargo-contact.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `simulateDetachedCargoStep` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
simulateDetachedCargoStep(/* {
    position,
    velocity,
    dt,
    airDrag = 0,
    cargoMassKg = DEFAULT_CARGO_MASS_KG,
    cargoMaterial,
    groundMaterial
} */);
```

## Module `public/modules/physics/collisions.ts`

Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior.

### `capsuleDistanceToPoint`

- Full name: `capsuleDistanceToPoint`
- Location: `public/modules/physics/collisions.ts:28`
- Return type: `number`

**Signature**

```ts
function capsuleDistanceToPoint(point: THREE.Vector3, start: THREE.Vector3, end: THREE.Vector3) { const segment = end.clone().sub(start); const lengthSq = segment.lengthSq(); if (lengthSq < 1e-6) return point.distanceTo(start); const t = THREE.MathUtils.clamp(point.clone().sub(start).dot(segment) / lengthSq, 0, 1); return point.distanceTo(start.clone().add(segment.multiplyScalar(t))); }
```

**Parameters**

- `point: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `start: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `end: THREE.Vector3`: input argument of type `THREE.Vector3`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `capsuleDistanceToPoint` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/collisions.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/collisions.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `capsuleDistanceToPoint` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
capsuleDistanceToPoint(/* point */, /* start */, /* end */);
```

### `gateHasCollision`

- Full name: `gateHasCollision`
- Location: `public/modules/physics/collisions.ts:36`
- Return type: `boolean`

**Signature**

```ts
function gateHasCollision(gate: THREE.Object3D, samples: THREE.Vector3[]) { const localSamples = samples.map((sample) => gate.worldToLocal(sample.clone())); for (const local of localSamples) { const leftLegDistance = capsuleDistanceToPoint( local, new THREE.Vector3(0, -1.13, 0.46), new THREE.Vector3(0, -0.21, 0.46) );
```

**Parameters**

- `gate: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `samples: THREE.Vector3[]`: input argument of type `THREE.Vector3[]`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `gateHasCollision` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/collisions.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/collisions.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `gateHasCollision` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
gateHasCollision(/* gate */, /* samples */);
```

### `intersectsExpandedBox`

- Full name: `intersectsExpandedBox`
- Location: `public/modules/physics/collisions.ts:23`
- Return type: `boolean`

**Signature**

```ts
function intersectsExpandedBox(box: THREE.Box3, samples: THREE.Vector3[]) { const expanded = box.clone().expandByScalar(DRONE_COLLISION_RADIUS); return samples.some((sample) => expanded.containsPoint(sample)); }
```

**Parameters**

- `box: THREE.Box3`: input argument of type `THREE.Box3`.
- `samples: THREE.Vector3[]`: input argument of type `THREE.Vector3[]`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `intersectsExpandedBox` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/collisions.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/collisions.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `intersectsExpandedBox` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
intersectsExpandedBox(/* box */, /* samples */);
```

### `obstacleHasCollision`

- Full name: `obstacleHasCollision`
- Location: `public/modules/physics/collisions.ts:62`
- Return type: `boolean`

**Signature**

```ts
export function obstacleHasCollision(obj: THREE.Object3D, samples: THREE.Vector3[]) { if (shouldSkipCollisionForObject(obj)) return false; if (obj.userData?.type === 'Ворота') { return gateHasCollision(obj, samples); } let hit = false; obj.updateWorldMatrix(true, true);
```

**Parameters**

- `obj: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `samples: THREE.Vector3[]`: input argument of type `THREE.Vector3[]`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `obstacleHasCollision` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/collisions.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/collisions.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `obstacleHasCollision` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
obstacleHasCollision(/* obj */, /* samples */);
```

### `sampleSegmentPoints`

- Full name: `sampleSegmentPoints`
- Location: `public/modules/physics/collisions.ts:13`
- Return type: `Vector3[]`

**Signature**

```ts
export function sampleSegmentPoints(start: THREE.Vector3, end: THREE.Vector3) { const distance = start.distanceTo(end); const steps = Math.max(1, Math.ceil(distance / COLLISION_SAMPLE_STEP)); const samples: THREE.Vector3[] = []; for (let i = 0; i <= steps; i++) { samples.push(start.clone().lerp(end, i / steps)); } return samples;
```

**Parameters**

- `start: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `end: THREE.Vector3`: input argument of type `THREE.Vector3`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Performs `sampleSegmentPoints` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/collisions.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/collisions.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `sampleSegmentPoints` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sampleSegmentPoints(/* start */, /* end */);
```

### `shouldSkipCollisionForObject`

- Full name: `shouldSkipCollisionForObject`
- Location: `public/modules/physics/collisions.ts:8`
- Return type: `boolean`

**Signature**

```ts
function shouldSkipCollisionForObject(obj: THREE.Object3D) { const type = String(obj.userData?.type || obj.name || ''); return NON_COLLIDABLE_TYPES.has(type); }
```

**Parameters**

- `obj: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `shouldSkipCollisionForObject` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/collisions.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/collisions.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `shouldSkipCollisionForObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
shouldSkipCollisionForObject(/* obj */);
```

## Module `public/modules/physics/events.ts`

Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior.

### `applyCrashState`

- Full name: `applyCrashState`
- Location: `public/modules/physics/events.ts:36`
- Return type: `void`

**Signature**

```ts
function applyCrashState(simState: DroneState, id: string, reason: string) { if (simState.status === 'CRASHED') return; const bounceX = -0.7; const bounceY = -0.7; const minBounce = 1.5; simState.vel.x = (Math.abs(simState.vel.x) < 0.5) ? (Math.random() - 0.5) * minBounce : simState.vel.x * bounceX;
```

**Parameters**

- `simState: DroneState`: current drone state object being inspected or mutated.
- `id: string`: string identifier of a drone or target entity.
- `reason: string`: human-readable explanation for a state change or event.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Applies `applyCrashState` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/events.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `applyCrashState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
applyCrashState(/* ... */, 'drone_1', 'manual trigger');
```

### `beginDisarmedFall`

- Full name: `beginDisarmedFall`
- Location: `public/modules/physics/events.ts:13`
- Return type: `void`

**Signature**

```ts
export function beginDisarmedFall(simState: DroneState, id: string, reason: string) { if (simState.status === 'CRASHED' || simState.status === 'DISARMED_FALL') return; simState.status = 'DISARMED_FALL'; simState.running = false; simState.pendingLocalPoint = false; simState.pointReachedFlag = false; simState.command_queue = [];
```

**Parameters**

- `simState: DroneState`: current drone state object being inspected or mutated.
- `id: string`: string identifier of a drone or target entity.
- `reason: string`: human-readable explanation for a state change or event.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Starts `beginDisarmedFall` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/events.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `beginDisarmedFall` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
beginDisarmedFall(/* ... */, 'drone_1', 'manual trigger');
```

### `checkPhysicsEvents`

- Full name: `checkPhysicsEvents`
- Location: `public/modules/physics/events.ts:65`
- Return type: `void`

**Signature**

```ts
export function checkPhysicsEvents(simState: DroneState, prevPos: { x: number; y: number; z: number }) { if ( simState.status === 'CRASHED' || simState.status === 'IDLE' || simState.status === 'ГОТОВ' || simState.status === 'ВЗВЕДЕН' || simState.status === 'ПРИЗЕМЛЕН' ) {
```

**Parameters**

- `simState: DroneState`: current drone state object being inspected or mutated.
- `prevPos: { x: number; y: number; z: number }`: previous object position before the current simulation step.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `checkPhysicsEvents` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/events.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `checkPhysicsEvents` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
checkPhysicsEvents(/* ... */, /* prevPos */);
```

### `shouldCrashOnGroundImpact`

- Full name: `shouldCrashOnGroundImpact`
- Location: `public/modules/physics/events.ts:27`
- Return type: `boolean`

**Signature**

```ts
export function shouldCrashOnGroundImpact(fallHeight: number, verticalSpeed: number, totalSpeed: number) { if (fallHeight < GROUND_IMPACT_MIN_HEIGHT) return false; return ( verticalSpeed >= GROUND_IMPACT_VERTICAL_SPEED_THRESHOLD || totalSpeed >= GROUND_IMPACT_TOTAL_SPEED_THRESHOLD ); }
```

**Parameters**

- `fallHeight: number`: height above ground before impact.
- `verticalSpeed: number`: speed input used to evaluate impact severity.
- `totalSpeed: number`: speed input used to evaluate impact severity.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `shouldCrashOnGroundImpact` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/events.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/events.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `shouldCrashOnGroundImpact` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
shouldCrashOnGroundImpact(0, 0, 0);
```

## Module `public/modules/physics/magnet-gripper.ts`

Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior.

### `getCargoMassKg`

- Full name: `getCargoMassKg`
- Location: `public/modules/physics/magnet-gripper.ts:31`
- Return type: `number`

**Signature**

```ts
function getCargoMassKg(obj: THREE.Object3D) { const massKg = obj.userData?.massKg; return typeof massKg === 'number' && massKg > 0 ? massKg : DEFAULT_CARGO_MASS_KG; }
```

**Parameters**

- `obj: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `getCargoMassKg` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/magnet-gripper.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/magnet-gripper.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `getCargoMassKg` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getCargoMassKg(/* obj */);
```

### `getCargoVelocity`

- Full name: `getCargoVelocity`
- Location: `public/modules/physics/magnet-gripper.ts:18`
- Return type: `CargoVelocity`

**Signature**

```ts
function getCargoVelocity(obj: THREE.Object3D): CargoVelocity { const vel = obj.userData?.physicsVelocity as Partial<CargoVelocity> | undefined; return { x: typeof vel?.x === 'number' ? vel.x : 0, y: typeof vel?.y === 'number' ? vel.y : 0, z: typeof vel?.z === 'number' ? vel.z : 0 }; }
```

**Parameters**

- `obj: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- Value of type `CargoVelocity` consumed by downstream logic.

**Purpose**

- Returns `getCargoVelocity` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/magnet-gripper.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/magnet-gripper.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `getCargoVelocity` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getCargoVelocity(/* obj */);
```

### `isCargoObject`

- Full name: `isCargoObject`
- Location: `public/modules/physics/magnet-gripper.ts:14`
- Return type: `boolean`

**Signature**

```ts
function isCargoObject(obj: THREE.Object3D) { return CARGO_TYPES.has(obj.userData?.type); }
```

**Parameters**

- `obj: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isCargoObject` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/magnet-gripper.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/magnet-gripper.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `isCargoObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isCargoObject(/* obj */);
```

### `setCargoVelocity`

- Full name: `setCargoVelocity`
- Location: `public/modules/physics/magnet-gripper.ts:27`
- Return type: `void`

**Signature**

```ts
function setCargoVelocity(obj: THREE.Object3D, velocity: CargoVelocity) { obj.userData.physicsVelocity = velocity; }
```

**Parameters**

- `obj: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `velocity: CargoVelocity`: input argument of type `CargoVelocity`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setCargoVelocity` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/magnet-gripper.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/magnet-gripper.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `setCargoVelocity` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setCargoVelocity(/* obj */, /* velocity */);
```

### `updateDetachedCargoPhysics`

- Full name: `updateDetachedCargoPhysics`
- Location: `public/modules/physics/magnet-gripper.ts:36`
- Return type: `void`

**Signature**

```ts
export function updateDetachedCargoPhysics(dt: number, getObstacles: () => THREE.Object3D[]) { const obstacles = getObstacles(); for (const obj of obstacles) { if (!isCargoObject(obj) || obj.userData?.attachedToDrone) continue; const velocity = getCargoVelocity(obj); const isMoving = Math.abs(velocity.x) > 0.001 || Math.abs(velocity.y) > 0.001 || Math.abs(velocity.z) > 0.001; const isAboveGround = obj.position.z > 0;
```

**Parameters**

- `dt: number`: simulation time step in seconds.
- `getObstacles: () => THREE.Object3D[]`: input argument of type `() => THREE.Object3D[]`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateDetachedCargoPhysics` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/magnet-gripper.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/magnet-gripper.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `updateDetachedCargoPhysics` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateDetachedCargoPhysics(0.016, /* getObstacles */);
```

### `updateMagnetGripper`

- Full name: `updateMagnetGripper`
- Location: `public/modules/physics/magnet-gripper.ts:61`
- Return type: `void`

**Signature**

```ts
export function updateMagnetGripper( drone: DroneState, getObstacles: () => THREE.Object3D[] ) { if (!drone.magnetGripper.active) { if (drone.magnetGripper.attachedObjectId) { const obj = getObstacles().find((item) => item.uuid === drone.magnetGripper.attachedObjectId); if (obj) {
```

**Parameters**

- `drone: DroneState`: current drone state object being inspected or mutated.
- `getObstacles: () => THREE.Object3D[]`: input argument of type `() => THREE.Object3D[]`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateMagnetGripper` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/magnet-gripper.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/magnet-gripper.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `updateMagnetGripper` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateMagnetGripper(/* drone */, /* getObstacles */);
```

## Module `public/modules/physics/materials.ts`

Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior.

### `resolvePhysicsMaterial`

- Full name: `resolvePhysicsMaterial`
- Location: `public/modules/physics/materials.ts:21`
- Return type: `PhysicsMaterial`

**Signature**

```ts
export function resolvePhysicsMaterial( material: Partial<PhysicsMaterial> | null | undefined, fallback: PhysicsMaterial ): PhysicsMaterial { return { staticFriction: typeof material?.staticFriction === 'number' ? material.staticFriction : fallback.staticFriction, dynamicFriction: typeof material?.dynamicFriction === 'number' ? material.dynamicFriction : fallback.dynamicFriction, restitution: typeof material?.restitution === 'number' ? material.restitution : fallback.restitution
```

**Parameters**

- `material: Partial<PhysicsMaterial> | null | undefined`: input argument of type `Partial<PhysicsMaterial> | null | undefined`.
- `fallback: PhysicsMaterial`: input argument of type `PhysicsMaterial`.

**Return Value**

- Value of type `PhysicsMaterial` consumed by downstream logic.

**Purpose**

- Performs `resolvePhysicsMaterial` in the physics layer. It encapsulates one well-defined step of the module contract in `public/modules/physics/materials.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/physics/materials.ts`. Physics subsystem. Covers collision detection, cargo contact resolution, material properties, free-fall transitions, and magnet gripper behavior. In practice, it isolates the implementation details of `resolvePhysicsMaterial` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resolvePhysicsMaterial(/* material */, /* fallback */);
```

## Module `public/modules/python/runtime.ts`

Python integration module powered by Pyodide. Initializes the runtime, exposes JS APIs to Python, and runs per-drone Python scripts.

### `ensurePyodide`

- Full name: `ensurePyodide`
- Location: `public/modules/python/runtime.ts:27`
- Return type: `Promise<any>`

**Signature**

```ts
async function ensurePyodide(): Promise<any> { if (pyodideInstance) return pyodideInstance; if (pyodideLoadPromise) return pyodideLoadPromise; pyodideLoadPromise = (async () => { log('[Python] Загрузка рантайма (Pyodide)...', 'info'); // Загружаем Pyodide с CDN. // Важно: в нашем проекте нет статического bundling для WASM, поэтому используем script tag.
```

**Parameters**

- No input parameters.

**Return Value**

- Promise resolved when the asynchronous workflow completes.

**Purpose**

- Performs `ensurePyodide` in the Python runtime. It encapsulates one well-defined step of the module contract in `public/modules/python/runtime.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/python/runtime.ts`. Python integration module powered by Pyodide. Initializes the runtime, exposes JS APIs to Python, and runs per-drone Python scripts. In practice, it isolates the implementation details of `ensurePyodide` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
ensurePyodide();
```

### `getDroneOrDefault`

- Full name: `getDroneOrDefault`
- Location: `public/modules/python/runtime.ts:57`
- Return type: `DroneState`

**Signature**

```ts
function getDroneOrDefault(id: string) { return drones[id] || drones[currentDroneId]; }
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.

**Return Value**

- Value of type `DroneState` consumed by downstream logic.

**Purpose**

- Returns `getDroneOrDefault` in the Python runtime. It encapsulates one well-defined step of the module contract in `public/modules/python/runtime.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/python/runtime.ts`. Python integration module powered by Pyodide. Initializes the runtime, exposes JS APIs to Python, and runs per-drone Python scripts. In practice, it isolates the implementation details of `getDroneOrDefault` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getDroneOrDefault('drone_1');
```

### `initPythonRuntime`

- Full name: `initPythonRuntime`
- Location: `public/modules/python/runtime.ts:359`
- Return type: `Promise<void>`

**Signature**

```ts
export async function initPythonRuntime(): Promise<void> { await ensurePyodide(); }
```

**Parameters**

- No input parameters.

**Return Value**

- Promise resolved when the asynchronous workflow completes.

**Purpose**

- Initializes `initPythonRuntime` in the Python runtime. It encapsulates one well-defined step of the module contract in `public/modules/python/runtime.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/python/runtime.ts`. Python integration module powered by Pyodide. Initializes the runtime, exposes JS APIs to Python, and runs per-drone Python scripts. In practice, it isolates the implementation details of `initPythonRuntime` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initPythonRuntime();
```

### `installJsRuntimeAPI`

- Full name: `installJsRuntimeAPI`
- Location: `public/modules/python/runtime.ts:61`
- Return type: `void`

**Signature**

```ts
function installJsRuntimeAPI() { const w = window as any; w.py_is_cancelled = (id: string) => Boolean(cancelledRuns[id]); w.pioneer_arm = (id: string) => { if (w.py_is_cancelled(id)) throw new Error('PYTHON_CANCELLED'); const d = getDroneOrDefault(id);
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `installJsRuntimeAPI` in the Python runtime. It encapsulates one well-defined step of the module contract in `public/modules/python/runtime.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/python/runtime.ts`. Python integration module powered by Pyodide. Initializes the runtime, exposes JS APIs to Python, and runs per-drone Python scripts. In practice, it isolates the implementation details of `installJsRuntimeAPI` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
installJsRuntimeAPI();
```

### `installPioneerSdkModule`

- Full name: `installPioneerSdkModule`
- Location: `public/modules/python/runtime.ts:262`
- Return type: `Promise<void>`

**Signature**

```ts
async function installPioneerSdkModule(pyodide: any) { if ((window as any).__pioneer_sdk_installed) return; installJsRuntimeAPI(); const prelude = ` import sys, types import js 
```

**Parameters**

- `pyodide: any`: input argument of type `any`.

**Return Value**

- Promise resolved when the asynchronous workflow completes.

**Purpose**

- Performs `installPioneerSdkModule` in the Python runtime. It encapsulates one well-defined step of the module contract in `public/modules/python/runtime.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/python/runtime.ts`. Python integration module powered by Pyodide. Initializes the runtime, exposes JS APIs to Python, and runs per-drone Python scripts. In practice, it isolates the implementation details of `installPioneerSdkModule` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
installPioneerSdkModule('drone_1');
```

### `loadScript`

- Full name: `loadScript`
- Location: `public/modules/python/runtime.ts:16`
- Return type: `Promise<void>`

**Signature**

```ts
function loadScript(src: string): Promise<void> { return new Promise((resolve, reject) => { const el = document.createElement('script'); el.src = src; el.async = true; el.onload = () => resolve(); el.onerror = (e) => reject(e); document.head.appendChild(el);
```

**Parameters**

- `src: string`: input argument of type `string`.

**Return Value**

- Promise resolved when the asynchronous workflow completes.

**Purpose**

- Performs `loadScript` in the Python runtime. It encapsulates one well-defined step of the module contract in `public/modules/python/runtime.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/python/runtime.ts`. Python integration module powered by Pyodide. Initializes the runtime, exposes JS APIs to Python, and runs per-drone Python scripts. In practice, it isolates the implementation details of `loadScript` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
loadScript(/* src */);
```

### `runPythonScript`

- Full name: `runPythonScript`
- Location: `public/modules/python/runtime.ts:363`
- Return type: `Promise<void>`

**Signature**

```ts
export async function runPythonScript(droneId: string, code: string): Promise<void> { const pyodide = await ensurePyodide(); if (!drones[droneId]) return; cancelledRuns[droneId] = false; lastManualSpeedUpdateMs[droneId] = 0; localOriginByDrone[droneId] = { x: drones[droneId].pos.x, y: drones[droneId].pos.y, z: drones[droneId].pos.z }; 
```

**Parameters**

- `droneId: string`: string identifier of a drone or target entity.
- `code: string`: source code text that will be executed.

**Return Value**

- Promise resolved when the asynchronous workflow completes.

**Purpose**

- Performs `runPythonScript` in the Python runtime. It encapsulates one well-defined step of the module contract in `public/modules/python/runtime.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/python/runtime.ts`. Python integration module powered by Pyodide. Initializes the runtime, exposes JS APIs to Python, and runs per-drone Python scripts. In practice, it isolates the implementation details of `runPythonScript` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
runPythonScript('drone_1', '// script body');
```

### `stopPythonScript`

- Full name: `stopPythonScript`
- Location: `public/modules/python/runtime.ts:420`
- Return type: `void`

**Signature**

```ts
export function stopPythonScript(droneId: string): void { cancelledRuns[droneId] = true; const d = drones[droneId]; if (d) { d.running = false; d.status = 'ОСТАНОВЛЕН'; d.pendingLocalPoint = false; d.pointReachedFlag = false;
```

**Parameters**

- `droneId: string`: string identifier of a drone or target entity.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Stops or finalizes `stopPythonScript` in the Python runtime. It encapsulates one well-defined step of the module contract in `public/modules/python/runtime.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/python/runtime.ts`. Python integration module powered by Pyodide. Initializes the runtime, exposes JS APIs to Python, and runs per-drone Python scripts. In practice, it isolates the implementation details of `stopPythonScript` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
stopPythonScript('drone_1');
```

## Module `public/modules/scene/DroneOrbitControls.ts`

3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor.

### `DroneOrbitControls.addEventListener`

- Full name: `DroneOrbitControls.addEventListener`
- Location: `public/modules/scene/DroneOrbitControls.ts:118`
- Return type: `void`

**Signature**

```ts
addEventListener(type: string, listener: Function) { if (!this.listeners[type]) this.listeners[type] = []; this.listeners[type].push(listener); }
```

**Parameters**

- `type: string`: message, state, or category discriminator.
- `listener: Function`: input argument of type `Function`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `DroneOrbitControls.addEventListener` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `addEventListener` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
addEventListener(/* type */, /* listener */);
```

### `DroneOrbitControls.clampElevation`

- Full name: `DroneOrbitControls.clampElevation`
- Location: `public/modules/scene/DroneOrbitControls.ts:34`
- Return type: `void`

**Signature**

```ts
private clampElevation() { const maxElevation = (Math.PI / 2) - 0.01; const minElevation = 0.01; this.elevation = Math.max(minElevation, Math.min(maxElevation, this.elevation)); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `DroneOrbitControls.clampElevation` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `clampElevation` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampElevation();
```

### `DroneOrbitControls.clampTargetToSceneBounds`

- Full name: `DroneOrbitControls.clampTargetToSceneBounds`
- Location: `public/modules/scene/DroneOrbitControls.ts:28`
- Return type: `void`

**Signature**

```ts
private clampTargetToSceneBounds() { // Ограничиваем высоту таргета, чтобы он не улетал в небо при панорамировании. // Для симулятора дрона 2 метра - достаточный предел для точки фокуса. this.target.z = Math.max(0, Math.min(2.0, this.target.z)); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `DroneOrbitControls.clampTargetToSceneBounds` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `clampTargetToSceneBounds` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampTargetToSceneBounds();
```

### `DroneOrbitControls.dispatchEvent`

- Full name: `DroneOrbitControls.dispatchEvent`
- Location: `public/modules/scene/DroneOrbitControls.ts:123`
- Return type: `void`

**Signature**

```ts
dispatchEvent(type: string) { if (this.listeners[type]) { for (const cb of this.listeners[type]) cb(); } }
```

**Parameters**

- `type: string`: message, state, or category discriminator.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `DroneOrbitControls.dispatchEvent` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `dispatchEvent` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
dispatchEvent(/* type */);
```

### `DroneOrbitControls.isTransformInteractionActive`

- Full name: `DroneOrbitControls.isTransformInteractionActive`
- Location: `public/modules/scene/DroneOrbitControls.ts:40`
- Return type: `boolean`

**Signature**

```ts
private isTransformInteractionActive() { const transformControl = (window as any).transformControl; return Boolean( (window as any).isTransforming || (window as any).isHittingGizmo || transformControl?.dragging || transformControl?.axis !== null );
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `DroneOrbitControls.isTransformInteractionActive` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `isTransformInteractionActive` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isTransformInteractionActive();
```

### `DroneOrbitControls.onPointerDown`

- Full name: `DroneOrbitControls.onPointerDown`
- Location: `public/modules/scene/DroneOrbitControls.ts:129`
- Return type: `void`

**Signature**

```ts
onPointerDown(e: PointerEvent) { if (!this.enabled || this.isTransformInteractionActive()) return; this.isDragging = true; this.mouseButton = e.button; this.previousMouse = { x: e.clientX, y: e.clientY }; this.domElement.setPointerCapture(e.pointerId); }
```

**Parameters**

- `e: PointerEvent`: input argument of type `PointerEvent`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `DroneOrbitControls.onPointerDown` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `onPointerDown` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
onPointerDown(/* e */);
```

### `DroneOrbitControls.onPointerMove`

- Full name: `DroneOrbitControls.onPointerMove`
- Location: `public/modules/scene/DroneOrbitControls.ts:137`
- Return type: `void`

**Signature**

```ts
onPointerMove(e: PointerEvent) { if (!this.enabled || !this.isDragging || this.isTransformInteractionActive()) return; const deltaX = e.clientX - this.previousMouse.x; const deltaY = e.clientY - this.previousMouse.y; this.previousMouse = { x: e.clientX, y: e.clientY }; if (this.mouseButton === 0) { // ЛКМ: Вращение
```

**Parameters**

- `e: PointerEvent`: input argument of type `PointerEvent`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `DroneOrbitControls.onPointerMove` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `onPointerMove` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
onPointerMove(/* e */);
```

### `DroneOrbitControls.onPointerUp`

- Full name: `DroneOrbitControls.onPointerUp`
- Location: `public/modules/scene/DroneOrbitControls.ts:170`
- Return type: `void`

**Signature**

```ts
onPointerUp(e: PointerEvent) { this.isDragging = false; this.mouseButton = -1; this.domElement.releasePointerCapture(e.pointerId); }
```

**Parameters**

- `e: PointerEvent`: input argument of type `PointerEvent`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `DroneOrbitControls.onPointerUp` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `onPointerUp` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
onPointerUp(/* e */);
```

### `DroneOrbitControls.onWheel`

- Full name: `DroneOrbitControls.onWheel`
- Location: `public/modules/scene/DroneOrbitControls.ts:176`
- Return type: `void`

**Signature**

```ts
onWheel(e: WheelEvent) { if (!this.enabled || this.isTransformInteractionActive()) return; e.preventDefault(); // Убрана автоматическая перепривязка зума к объекту (syncTargetToPendingObjectIfInView), // так как это приводило к скачкам радиуса при панорамировании. // Увеличен базовый шаг экспоненциального зума (0.85 вместо 0.95), 
```

**Parameters**

- `e: WheelEvent`: input argument of type `WheelEvent`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `DroneOrbitControls.onWheel` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `onWheel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
onWheel(/* e */);
```

### `DroneOrbitControls.setTarget`

- Full name: `DroneOrbitControls.setTarget`
- Location: `public/modules/scene/DroneOrbitControls.ts:86`
- Return type: `void`

**Signature**

```ts
setTarget(target: THREE.Vector3, preserveCameraPosition = false, applyViewChange = true) { this.target.copy(target); this.clampTargetToSceneBounds(); if (preserveCameraPosition) { this.syncSphericalFromCamera(); } if (applyViewChange) { this.update();
```

**Parameters**

- `target: THREE.Vector3`: input argument of type `THREE.Vector3`.
- `preserveCameraPosition?: boolean`: input argument of type `boolean`.
- `applyViewChange?: boolean`: input argument of type `boolean`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `DroneOrbitControls.setTarget` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `setTarget` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setTarget(/* target */, /* preserveCameraPosition */, /* applyViewChange */);
```

### `DroneOrbitControls.syncSphericalFromCamera`

- Full name: `DroneOrbitControls.syncSphericalFromCamera`
- Location: `public/modules/scene/DroneOrbitControls.ts:50`
- Return type: `void`

**Signature**

```ts
private syncSphericalFromCamera() { const offset = new THREE.Vector3().subVectors(this.camera.position, this.target); const radius = offset.length(); this.radius = Math.max(this.minRadius, radius); const planarRadius = Math.hypot(offset.x, offset.y); this.elevation = Math.atan2(offset.z, planarRadius); this.clampElevation(); this.azimuth = Math.atan2(offset.y, offset.x);
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `DroneOrbitControls.syncSphericalFromCamera` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `syncSphericalFromCamera` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncSphericalFromCamera();
```

### `DroneOrbitControls.syncTargetToPendingObjectIfInView`

- Full name: `DroneOrbitControls.syncTargetToPendingObjectIfInView`
- Location: `public/modules/scene/DroneOrbitControls.ts:60`
- Return type: `void`

**Signature**

```ts
private syncTargetToPendingObjectIfInView() { const pendingObject = (window as any).pendingOrbitRetargetObject as THREE.Object3D | null | undefined; if (!pendingObject) return; pendingObject.updateWorldMatrix(true, true); this.pendingObjectBounds.setFromObject(pendingObject); if (this.pendingObjectBounds.isEmpty()) { pendingObject.getWorldPosition(this.pendingObjectCenter);
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `DroneOrbitControls.syncTargetToPendingObjectIfInView` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `syncTargetToPendingObjectIfInView` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncTargetToPendingObjectIfInView();
```

### `DroneOrbitControls.update`

- Full name: `DroneOrbitControls.update`
- Location: `public/modules/scene/DroneOrbitControls.ts:197`
- Return type: `void`

**Signature**

```ts
update() { // Радиус - это расстояние, он не должен становиться отрицательным. this.radius = Math.max(this.minRadius, this.radius); this.clampTargetToSceneBounds(); this.clampElevation(); // Вычисляем новую позицию камеры (сферические координаты относительно оси Z) const x = this.radius * Math.cos(this.elevation) * Math.cos(this.azimuth);
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `DroneOrbitControls.update` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/DroneOrbitControls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/DroneOrbitControls.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `update` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
update();
```

## Module `public/modules/scene/input.ts`

3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor.

### `createGroundPointLabel`

- Full name: `createGroundPointLabel`
- Location: `public/modules/scene/input.ts:79`
- Return type: `{ sprite: Sprite<Object3DEventMap>; texture: CanvasTexture<HTMLCanvasElement>; material: SpriteMaterial; }`

**Signature**

```ts
function createGroundPointLabel(text: string) { const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128; const ctx = canvas.getContext('2d'); if (ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
```

**Parameters**

- `text: string`: input argument of type `string`.

**Return Value**

- Structured object with computed fields or configuration data.

**Purpose**

- Creates `createGroundPointLabel` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `createGroundPointLabel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createGroundPointLabel(/* text */);
```

### `getGroundPointFromPointer`

- Full name: `getGroundPointFromPointer`
- Location: `public/modules/scene/input.ts:74`
- Return type: `Vector3`

**Signature**

```ts
function getGroundPointFromPointer() { const point = new THREE.Vector3(); return raycaster.ray.intersectPlane(groundPlane, point) ? point : null; }
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Vector3` consumed by downstream logic.

**Purpose**

- Returns `getGroundPointFromPointer` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `getGroundPointFromPointer` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getGroundPointFromPointer();
```

### `getObjectDisplayName`

- Full name: `getObjectDisplayName`
- Location: `public/modules/scene/input.ts:156`
- Return type: `any`

**Signature**

```ts
function getObjectDisplayName(obj: THREE.Object3D) { return obj.name || obj.userData?.type || obj.type || 'Объект'; }
```

**Parameters**

- `obj: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- Loosely typed result; callers must interpret it based on the surrounding runtime contract.

**Purpose**

- Returns `getObjectDisplayName` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `getObjectDisplayName` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getObjectDisplayName(/* obj */);
```

### `getRootSceneObject`

- Full name: `getRootSceneObject`
- Location: `public/modules/scene/input.ts:49`
- Return type: `Object3D<Object3DEventMap>`

**Signature**

```ts
function getRootSceneObject(object: THREE.Object3D) { let current: THREE.Object3D | null = object; while (current?.parent && current.parent !== (window as any).scene && current.parent !== envGroup) { current = current.parent; } return current || object; }
```

**Parameters**

- `object: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- Value of type `Object3D<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Returns `getRootSceneObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `getRootSceneObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getRootSceneObject(/* object */);
```

### `handleSelection`

- Full name: `handleSelection`
- Location: `public/modules/scene/input.ts:351`
- Return type: `void`

**Signature**

```ts
export function handleSelection(obj: THREE.Object3D | null, x: number, y: number, showMenu = false, focusCamera = false, clickPoint?: THREE.Vector3) { const isSameObject = selectedObject === obj; traceClick(`handleSelection object=${obj ? getObjectDisplayName(obj) : 'null'} same=${String(isSameObject)} showMenu=${String(showMenu)}`); if (selectedObject && !isSameObject) deselectObject(); if (obj && !isSameObject) rememberSelectedObjectInitialTransform(obj); (window as any).setSelectedObject(obj);
```

**Parameters**

- `obj: THREE.Object3D | null`: input argument of type `THREE.Object3D | null`.
- `x: number`: input argument of type `number`.
- `y: number`: input argument of type `number`.
- `showMenu?: boolean`: input argument of type `boolean`.
- `focusCamera?: boolean`: input argument of type `boolean`.
- `clickPoint?: THREE.Vector3`: input argument of type `THREE.Vector3`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `handleSelection` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `handleSelection` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
handleSelection(/* obj */, /* x */, /* y */, /* showMenu */, /* focusCamera */, /* clickPoint */);
```

### `hideTransformUiPreserveSelection`

- Full name: `hideTransformUiPreserveSelection`
- Location: `public/modules/scene/input.ts:191`
- Return type: `void`

**Signature**

```ts
function hideTransformUiPreserveSelection() { exitTransformMode(); updateTransformModeDecorations(null); if (controls) controls.enabled = (window as any).cameraMode === 'free' && !(window as any).isTransforming; }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `hideTransformUiPreserveSelection` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `hideTransformUiPreserveSelection` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
hideTransformUiPreserveSelection();
```

### `isDroneObject`

- Full name: `isDroneObject`
- Location: `public/modules/scene/input.ts:66`
- Return type: `boolean`

**Signature**

```ts
function isDroneObject(object: THREE.Object3D | null | undefined) { if (!object) return false; for (const id in droneMeshes) { if (object === droneMeshes[id]) return true; } return false; }
```

**Parameters**

- `object: THREE.Object3D | null | undefined`: input argument of type `THREE.Object3D | null | undefined`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isDroneObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `isDroneObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isDroneObject(/* object */);
```

### `isGroundObject`

- Full name: `isGroundObject`
- Location: `public/modules/scene/input.ts:57`
- Return type: `boolean`

**Signature**

```ts
function isGroundObject(object: THREE.Object3D | null | undefined) { let current: THREE.Object3D | null | undefined = object; while (current) { if (current.name === 'Ground' || current.userData?.type === 'ground') return true; current = current.parent; } return false; }
```

**Parameters**

- `object: THREE.Object3D | null | undefined`: input argument of type `THREE.Object3D | null | undefined`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isGroundObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `isGroundObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isGroundObject(/* object */);
```

### `onPointerDown`

- Full name: `onPointerDown`
- Location: `public/modules/scene/input.ts:197`
- Return type: `void`

**Signature**

```ts
export function onPointerDown(event: PointerEvent) { pointerDownPos.set(event.clientX, event.clientY); traceClick(`pointerdown button=${event.button} x=${event.clientX} y=${event.clientY}`); if (!transformControl) return; (window as any).isHittingGizmo = transformControl.dragging || (transformControl as any).axis !== null; traceClick(`pointerdown gizmo dragging=${transformControl.dragging} axis=${String((transformControl as any).axis)} hit=${String((window as any).isHittingGizmo)}`); }
```

**Parameters**

- `event: PointerEvent`: input argument of type `PointerEvent`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `onPointerDown` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `onPointerDown` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
onPointerDown(/* event */);
```

### `onPointerUp`

- Full name: `onPointerUp`
- Location: `public/modules/scene/input.ts:205`
- Return type: `void`

**Signature**

```ts
export function onPointerUp(event: PointerEvent) { traceClick(`pointerup button=${event.button} x=${event.clientX} y=${event.clientY} cameraMode=${String((window as any).cameraMode)}`); if (simState.running && (window as any).cameraMode === 'fpv') { traceClick('pointerup ignored: fpv mode while simulation is running', 'warn'); return; } if (!renderer || !camera || !transformControl || !raycaster) { traceClick(`pointerup ignored: missing renderer=${String(!!renderer)} camera=${String(!!camera)} transformControl=${String(!!transformControl)} raycaster=${String(!!raycaster)}`, 'warn');
```

**Parameters**

- `event: PointerEvent`: input argument of type `PointerEvent`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `onPointerUp` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `onPointerUp` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
onPointerUp(/* event */);
```

### `showGroundPoint`

- Full name: `showGroundPoint`
- Location: `public/modules/scene/input.ts:114`
- Return type: `void`

**Signature**

```ts
function showGroundPoint(point: THREE.Vector3) { const labelText = `X: ${point.x.toFixed(2)} Y: ${point.y.toFixed(2)} Z: ${point.z.toFixed(2)}`; log(`Координаты точки на земле: ${labelText}`, 'info'); const markerGeom = new THREE.SphereGeometry(0.08, 20, 20); const markerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.95 }); const marker = new THREE.Mesh(markerGeom, markerMat); marker.position.copy(point);
```

**Parameters**

- `point: THREE.Vector3`: input argument of type `THREE.Vector3`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `showGroundPoint` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `showGroundPoint` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
showGroundPoint(/* point */);
```

### `showTransformUi`

- Full name: `showTransformUi`
- Location: `public/modules/scene/input.ts:160`
- Return type: `void`

**Signature**

```ts
function showTransformUi(obj: THREE.Object3D, preferredMode?: 'translate' | 'rotate' | 'scale') { if (!transformControl || !isTransformableObject(obj) || simState.running) return; const activeMode = preferredMode || (transformControl.object === obj ? transformControl.getMode() : 'translate'); traceClick(`activate gizmo mode=${activeMode} for ${getObjectDisplayName(obj)}`); activateTransformMode(activeMode, obj); if (controls) controls.enabled = (window as any).cameraMode === 'free' && !(window as any).isTransforming; if ((window as any).showGizmoToolbar) { traceClick('showGizmoToolbar is available, rendering toolbar');
```

**Parameters**

- `obj: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `preferredMode?: 'translate' | 'rotate' | 'scale'`: input argument of type `'translate' | 'rotate' | 'scale'`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `showTransformUi` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `showTransformUi` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
showTransformUi(/* obj */, /* preferredMode */);
```

### `traceClick`

- Full name: `traceClick`
- Location: `public/modules/scene/input.ts:42`
- Return type: `void`

**Signature**

```ts
function traceClick(message: string, level: 'info' | 'warn' = 'info') { const fullMessage = `${CLICK_TRACE_PREFIX} ${message}`; if (level === 'warn') console.warn(fullMessage); else console.debug(fullMessage); log(fullMessage, level); }
```

**Parameters**

- `message: string`: input argument of type `string`.
- `level?: 'info' | 'warn'`: input argument of type `'info' | 'warn'`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `traceClick` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `traceClick` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
traceClick(/* message */, /* level */);
```

### `updateObjectSelectionVisuals`

- Full name: `updateObjectSelectionVisuals`
- Location: `public/modules/scene/input.ts:323`
- Return type: `void`

**Signature**

```ts
export function updateObjectSelectionVisuals(obj: THREE.Object3D, selected: boolean) { const emissiveColor = new THREE.Color(0x38bdf8); obj.traverse((node: any) => { if (node.isMesh && node.material) { const materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach((mat: any) => { if (mat.emissive) { if (mat.userData.originalEmissive === undefined) {
```

**Parameters**

- `obj: THREE.Object3D`: input argument of type `THREE.Object3D`.
- `selected: boolean`: input argument of type `boolean`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateObjectSelectionVisuals` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/input.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/input.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `updateObjectSelectionVisuals` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateObjectSelectionVisuals(/* obj */, /* selected */);
```

## Module `public/modules/scene/object-catalog.ts`

3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor.

### `findSceneObjectById`

- Full name: `findSceneObjectById`
- Location: `public/modules/scene/object-catalog.ts:52`
- Return type: `Object3D<Object3DEventMap>`

**Signature**

```ts
export function findSceneObjectById(id: string) { return getSceneTopLevelObjects().find((obj) => obj.uuid === id) || null; }
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.

**Return Value**

- Value of type `Object3D<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Finds and returns `findSceneObjectById` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-catalog.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-catalog.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `findSceneObjectById` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
findSceneObjectById('drone_1');
```

### `formatPoints`

- Full name: `formatPoints`
- Location: `public/modules/scene/object-catalog.ts:6`
- Return type: `string`

**Signature**

```ts
export function formatPoints(points: ScenePathPoint[]) { return points.map((point) => `${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}`).join('\n'); }
```

**Parameters**

- `points: ScenePathPoint[]`: input argument of type `ScenePathPoint[]`.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Performs `formatPoints` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-catalog.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-catalog.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `formatPoints` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
formatPoints(/* points */);
```

### `getSceneTopLevelObjects`

- Full name: `getSceneTopLevelObjects`
- Location: `public/modules/scene/object-catalog.ts:43`
- Return type: `Object3D<Object3DEventMap>[]`

**Signature**

```ts
export function getSceneTopLevelObjects() { const objects: THREE.Object3D[] = []; for (const id in droneMeshes) { if (droneMeshes[id]) objects.push(droneMeshes[id]); } if (envGroup) objects.push(...envGroup.children); return objects; }
```

**Parameters**

- No input parameters.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Returns `getSceneTopLevelObjects` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-catalog.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-catalog.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `getSceneTopLevelObjects` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getSceneTopLevelObjects();
```

### `isTransformableObject`

- Full name: `isTransformableObject`
- Location: `public/modules/scene/object-catalog.ts:56`
- Return type: `boolean`

**Signature**

```ts
export function isTransformableObject(target: THREE.Object3D | null | undefined) { if (!target || !target.parent) return false; if (target.name === 'Ground' || target.userData?.type === 'ground') return false; for (const id in droneMeshes) { if (target === droneMeshes[id]) return true; } 
```

**Parameters**

- `target: THREE.Object3D | null | undefined`: input argument of type `THREE.Object3D | null | undefined`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isTransformableObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-catalog.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-catalog.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `isTransformableObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isTransformableObject(/* target */);
```

### `listSceneObjects`

- Full name: `listSceneObjects`
- Location: `public/modules/scene/object-catalog.ts:68`
- Return type: `any[]`

**Signature**

```ts
export function listSceneObjects(): any[] { const selectedId = selectedObject ? selectedObject.uuid : ''; return getSceneTopLevelObjects().map((obj) => { let isDrone = false; for (const id in droneMeshes) { if (obj === droneMeshes[id]) isDrone = true; } const metaLines: string[] = [];
```

**Parameters**

- No input parameters.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Performs `listSceneObjects` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-catalog.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-catalog.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `listSceneObjects` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
listSceneObjects();
```

### `normalizePoints`

- Full name: `normalizePoints`
- Location: `public/modules/scene/object-catalog.ts:10`
- Return type: `ScenePathPoint[]`

**Signature**

```ts
export function normalizePoints(points: unknown): ScenePathPoint[] { if (!Array.isArray(points)) return []; return points .map((point: any) => ({ x: Number(point?.x), y: Number(point?.y), z: Number(point?.z ?? 0) }))
```

**Parameters**

- `points: unknown`: input argument of type `unknown`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Normalizes `normalizePoints` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-catalog.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-catalog.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `normalizePoints` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
normalizePoints(/* points */);
```

### `parsePointsText`

- Full name: `parsePointsText`
- Location: `public/modules/scene/object-catalog.ts:21`
- Return type: `{ x: number; y: number; z: number; }[]`

**Signature**

```ts
export function parsePointsText(pointsText: string) { const points = pointsText .split(/\r?\n/) .map((line) => line.trim()) .filter(Boolean) .map((line) => { const values = line .split(/[;, ]+/)
```

**Parameters**

- `pointsText: string`: input argument of type `string`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Performs `parsePointsText` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-catalog.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-catalog.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `parsePointsText` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
parsePointsText(/* pointsText */);
```

## Module `public/modules/scene/object-manager.ts`

3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor.

### `addObject`

- Full name: `addObject`
- Location: `public/modules/scene/object-manager.ts:214`
- Return type: `void`

**Signature**

```ts
export function addObject( type: string, options: { value?: string; markerDictionary?: string; pointsText?: string; floors?: number; markerMap?: MarkerMapOptions } = {} ) { const parsedPoints = options.pointsText ? parsePointsText(options.pointsText) : []; const objectOptions: SceneObjectOptions = { value: options.value, markerDictionary: options.markerDictionary,
```

**Parameters**

- `type: string`: message, state, or category discriminator.
- `options?: { value?: string; markerDictionary?: string; pointsText?: string; floors?: number; markerMap?: MarkerMapOptions }`: input argument of type `{ value?: string; markerDictionary?: string; pointsText?: string; floors?: number; markerMap?: MarkerMapOptions }`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `addObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `addObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
addObject(/* type */, /* options */);
```

### `appendPointToSelectedLinearObject`

- Full name: `appendPointToSelectedLinearObject`
- Location: `public/modules/scene/object-manager.ts:269`
- Return type: `boolean`

**Signature**

```ts
export function appendPointToSelectedLinearObject() { if (!selectedObject || !selectedObject.userData?.supportsPoints) return false; const points = normalizePoints(selectedObject.userData?.points); if (points.length < 2) return false; const last = points[points.length - 1]; const prev = points[points.length - 2];
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `appendPointToSelectedLinearObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `appendPointToSelectedLinearObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
appendPointToSelectedLinearObject();
```

### `deleteSceneObjectById`

- Full name: `deleteSceneObjectById`
- Location: `public/modules/scene/object-manager.ts:129`
- Return type: `boolean`

**Signature**

```ts
export function deleteSceneObjectById(id: string) { const obj = findSceneObjectById(id); let isDrone = false; for (const droneId in droneMeshes) { if (obj === droneMeshes[droneId]) isDrone = true; } if (!obj || isDrone) return false; handleSelection(obj, window.innerWidth / 2, window.innerHeight / 2, false);
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `deleteSceneObjectById` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `deleteSceneObjectById` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
deleteSceneObjectById('drone_1');
```

### `deleteSelectedObject`

- Full name: `deleteSelectedObject`
- Location: `public/modules/scene/object-manager.ts:169`
- Return type: `void`

**Signature**

```ts
export function deleteSelectedObject() { let isDrone = false; for (const id in droneMeshes) { if (selectedObject === droneMeshes[id]) isDrone = true; } if (selectedObject && !isDrone) { const obj = selectedObject;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `deleteSelectedObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `deleteSelectedObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
deleteSelectedObject();
```

### `duplicateObject`

- Full name: `duplicateObject`
- Location: `public/modules/scene/object-manager.ts:196`
- Return type: `void`

**Signature**

```ts
export function duplicateObject() { let isDrone = false; for (const id in droneMeshes) { if (selectedObject === droneMeshes[id]) isDrone = true; } if (selectedObject && !isDrone) { const clone = selectedObject.clone();
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `duplicateObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `duplicateObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
duplicateObject();
```

### `getSelectedSceneObjectId`

- Full name: `getSelectedSceneObjectId`
- Location: `public/modules/scene/object-manager.ts:109`
- Return type: `string`

**Signature**

```ts
export function getSelectedSceneObjectId() { return selectedObject ? selectedObject.uuid : null; }
```

**Parameters**

- No input parameters.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Returns `getSelectedSceneObjectId` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `getSelectedSceneObjectId` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getSelectedSceneObjectId();
```

### `groupObjects`

- Full name: `groupObjects`
- Location: `public/modules/scene/object-manager.ts:13`
- Return type: `boolean`

**Signature**

```ts
export function groupObjects() { if (multiSelectedObjects.length < 2) { log('Для группировки нужно выбрать хотя бы два объекта (Ctrl+Click)', 'warn'); return false; } const group = new THREE.Group(); group.name = `Группа (${multiSelectedObjects.length})`;
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `groupObjects` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `groupObjects` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
groupObjects();
```

### `resetDroneToOrigin`

- Full name: `resetDroneToOrigin`
- Location: `public/modules/scene/object-manager.ts:141`
- Return type: `boolean`

**Signature**

```ts
export function resetDroneToOrigin() { const currentDrone = droneMeshes[currentDroneId]; if (!currentDrone) return false; const droneState = drones[currentDroneId]; if (simState.running) { log('Нельзя вернуть дрон в начало во время выполнения скрипта', 'warn'); return false;
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Resets `resetDroneToOrigin` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `resetDroneToOrigin` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetDroneToOrigin();
```

### `selectSceneObjectById`

- Full name: `selectSceneObjectById`
- Location: `public/modules/scene/object-manager.ts:113`
- Return type: `boolean`

**Signature**

```ts
export function selectSceneObjectById(id: string) { const obj = findSceneObjectById(id); if (!obj) return false; handleSelection(obj, window.innerWidth / 2, window.innerHeight / 2, false); return true; }
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `selectSceneObjectById` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `selectSceneObjectById` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
selectSceneObjectById('drone_1');
```

### `setSceneObjectTransformMode`

- Full name: `setSceneObjectTransformMode`
- Location: `public/modules/scene/object-manager.ts:120`
- Return type: `boolean`

**Signature**

```ts
export function setSceneObjectTransformMode(mode: TransformMode, id?: string) { const target = id ? findSceneObjectById(id) : selectedObject; if (!target) return false; if (!selectedObject || selectedObject.uuid !== target.uuid) { handleSelection(target, window.innerWidth / 2, window.innerHeight / 2, false); } return activateTransformMode(mode, target); }
```

**Parameters**

- `mode: TransformMode`: input argument of type `TransformMode`.
- `id?: string`: string identifier of a drone or target entity.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Sets `setSceneObjectTransformMode` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `setSceneObjectTransformMode` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setSceneObjectTransformMode(/* mode */, 'drone_1');
```

### `ungroupObject`

- Full name: `ungroupObject`
- Location: `public/modules/scene/object-manager.ts:58`
- Return type: `boolean`

**Signature**

```ts
export function ungroupObject(targetGroup?: THREE.Object3D) { const group = targetGroup || selectedObject; if (!group || group.userData.type !== 'group') { log('Выбранный объект не является группой', 'warn'); return false; } const children = [...group.children];
```

**Parameters**

- `targetGroup?: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `ungroupObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `ungroupObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
ungroupObject(/* targetGroup */);
```

### `updateSelectedSceneObject`

- Full name: `updateSelectedSceneObject`
- Location: `public/modules/scene/object-manager.ts:236`
- Return type: `boolean`

**Signature**

```ts
export function updateSelectedSceneObject(params: { value?: string; markerDictionary?: string; pointsText?: string; floors?: number }) { if (!selectedObject || selectedObject.userData?.draggable === false) return false; let updated = false; if ((params.value !== undefined || params.markerDictionary !== undefined) && selectedObject.userData?.supportsValue) { updated = updateSceneObjectValue(selectedObject, { value: params.value, markerDictionary: params.markerDictionary,
```

**Parameters**

- `params: { value?: string; markerDictionary?: string; pointsText?: string; floors?: number }`: aggregated call parameters object.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Updates `updateSelectedSceneObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-manager.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `updateSelectedSceneObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateSelectedSceneObject(/* ... */);
```

## Module `public/modules/scene/object-transform.ts`

3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor.

### `activateTransformMode`

- Full name: `activateTransformMode`
- Location: `public/modules/scene/object-transform.ts:77`
- Return type: `boolean`

**Signature**

```ts
export function activateTransformMode(mode: TransformMode, target: THREE.Object3D) { if (!transformControl || !target || !target.parent || simState.running) return false; if (!isTransformableObject(target)) return false; transformControl.attach(target); transformControl.setMode(mode); transformControl.enabled = true; transformControl.size = mode === 'rotate' ? 1.3 : 1.15;
```

**Parameters**

- `mode: TransformMode`: input argument of type `TransformMode`.
- `target: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `activateTransformMode` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `activateTransformMode` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
activateTransformMode(/* mode */, /* target */);
```

### `clearSelectedObjectInitialTransform`

- Full name: `clearSelectedObjectInitialTransform`
- Location: `public/modules/scene/object-transform.ts:48`
- Return type: `void`

**Signature**

```ts
export function clearSelectedObjectInitialTransform(target?: THREE.Object3D | null) { if (target && initialTransformTarget && target !== initialTransformTarget) return; initialTransformTarget = null; initialTransformSnapshot = null; }
```

**Parameters**

- `target?: THREE.Object3D | null`: input argument of type `THREE.Object3D | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `clearSelectedObjectInitialTransform` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `clearSelectedObjectInitialTransform` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clearSelectedObjectInitialTransform(/* target */);
```

### `getRotationStepDegrees`

- Full name: `getRotationStepDegrees`
- Location: `public/modules/scene/object-transform.ts:23`
- Return type: `number`

**Signature**

```ts
export function getRotationStepDegrees() { return rotationStepDegrees; }
```

**Parameters**

- No input parameters.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `getRotationStepDegrees` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `getRotationStepDegrees` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getRotationStepDegrees();
```

### `getRotationStepOptions`

- Full name: `getRotationStepOptions`
- Location: `public/modules/scene/object-transform.ts:19`
- Return type: `(5 | 15 | 45)[]`

**Signature**

```ts
export function getRotationStepOptions() { return [...ROTATION_STEP_OPTIONS]; }
```

**Parameters**

- No input parameters.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Returns `getRotationStepOptions` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `getRotationStepOptions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getRotationStepOptions();
```

### `rememberSelectedObjectInitialTransform`

- Full name: `rememberSelectedObjectInitialTransform`
- Location: `public/modules/scene/object-transform.ts:39`
- Return type: `void`

**Signature**

```ts
export function rememberSelectedObjectInitialTransform(target: THREE.Object3D) { initialTransformTarget = target; initialTransformSnapshot = { position: target.position.clone(), quaternion: target.quaternion.clone(), scale: target.scale.clone() }; }
```

**Parameters**

- `target: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `rememberSelectedObjectInitialTransform` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `rememberSelectedObjectInitialTransform` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
rememberSelectedObjectInitialTransform(/* target */);
```

### `resetSelectedObjectToInitialTransform`

- Full name: `resetSelectedObjectToInitialTransform`
- Location: `public/modules/scene/object-transform.ts:64`
- Return type: `boolean`

**Signature**

```ts
export function resetSelectedObjectToInitialTransform() { if (!selectedObject || !transformControl || !isTransformableObject(selectedObject) || simState.running) return false; if (!initialTransformTarget || !initialTransformSnapshot || selectedObject !== initialTransformTarget) return false; selectedObject.position.copy(initialTransformSnapshot.position); selectedObject.quaternion.copy(initialTransformSnapshot.quaternion); selectedObject.scale.copy(initialTransformSnapshot.scale); selectedObject.updateMatrixWorld(true);
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Resets `resetSelectedObjectToInitialTransform` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `resetSelectedObjectToInitialTransform` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetSelectedObjectToInitialTransform();
```

### `rotateSelectedObjectByDegrees`

- Full name: `rotateSelectedObjectByDegrees`
- Location: `public/modules/scene/object-transform.ts:54`
- Return type: `boolean`

**Signature**

```ts
export function rotateSelectedObjectByDegrees(axis: RotationAxis, deltaDegrees: number) { if (!selectedObject || !transformControl || !isTransformableObject(selectedObject) || simState.running) return false; const radians = THREE.MathUtils.degToRad(deltaDegrees); selectedObject.rotation[axis] += radians; selectedObject.updateMatrixWorld(true); transformControl.dispatchEvent({ type: 'change', target: transformControl }); updateTransformModeDecorations(transformControl.getMode(), selectedObject); return true;
```

**Parameters**

- `axis: RotationAxis`: input argument of type `RotationAxis`.
- `deltaDegrees: number`: input argument of type `number`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `rotateSelectedObjectByDegrees` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `rotateSelectedObjectByDegrees` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
rotateSelectedObjectByDegrees(/* axis */, /* deltaDegrees */);
```

### `setRotationStepDegrees`

- Full name: `setRotationStepDegrees`
- Location: `public/modules/scene/object-transform.ts:27`
- Return type: `number`

**Signature**

```ts
export function setRotationStepDegrees(step: number) { const normalized = ROTATION_STEP_OPTIONS.includes(step as typeof ROTATION_STEP_OPTIONS[number]) ? step : 15; rotationStepDegrees = normalized; if (transformControl?.getMode() === 'rotate') { transformControl.setRotationSnap(THREE.MathUtils.degToRad(rotationStepDegrees)); } if ((window as any).setTransformToolbarRotationStep) { (window as any).setTransformToolbarRotationStep(rotationStepDegrees);
```

**Parameters**

- `step: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Sets `setRotationStepDegrees` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/object-transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/object-transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `setRotationStepDegrees` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setRotationStepDegrees(/* step */);
```

## Module `public/modules/scene/scene-init.ts`

3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor.

### `configureTransformHelperVisuals`

- Full name: `configureTransformHelperVisuals`
- Location: `public/modules/scene/scene-init.ts:100`
- Return type: `void`

**Signature**

```ts
function configureTransformHelperVisuals(helper: THREE.Object3D) { helper.renderOrder = 10000; helper.frustumCulled = false; helper.traverse((node: any) => { node.renderOrder = 10000; node.frustumCulled = false; const materials = Array.isArray(node.material) ? node.material : node.material ? [node.material] : []; materials.forEach((material: THREE.Material & { depthTest?: boolean; depthWrite?: boolean; toneMapped?: boolean }) => {
```

**Parameters**

- `helper: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `configureTransformHelperVisuals` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/scene-init.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/scene-init.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `configureTransformHelperVisuals` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
configureTransformHelperVisuals(/* helper */);
```

### `focusOrbitControlsOnObject`

- Full name: `focusOrbitControlsOnObject`
- Location: `public/modules/scene/scene-init.ts:85`
- Return type: `void`

**Signature**

```ts
export function focusOrbitControlsOnObject(obj: THREE.Object3D | null, applyViewChange = true) { if (!controls || !obj) return; obj.updateWorldMatrix(true, true); orbitTargetBounds.setFromObject(obj); if (orbitTargetBounds.isEmpty()) { obj.getWorldPosition(orbitTargetCenter);
```

**Parameters**

- `obj: THREE.Object3D | null`: input argument of type `THREE.Object3D | null`.
- `applyViewChange?: boolean`: input argument of type `boolean`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `focusOrbitControlsOnObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/scene-init.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/scene-init.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `focusOrbitControlsOnObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
focusOrbitControlsOnObject(/* obj */, /* applyViewChange */);
```

### `initScene`

- Full name: `initScene`
- Location: `public/modules/scene/scene-init.ts:124`
- Return type: `void`

**Signature**

```ts
export function initScene(container: HTMLElement) { canvasContainer = container; canvasResizeObserver?.disconnect(); scene = new THREE.Scene(); scene.background = new THREE.Color(0x0f172a); scene.fog = new THREE.FogExp2(0x0f172a, 0.015); 
```

**Parameters**

- `container: HTMLElement`: input argument of type `HTMLElement`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initScene` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/scene-init.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/scene-init.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `initScene` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initScene(/* container */);
```

### `onWindowResize`

- Full name: `onWindowResize`
- Location: `public/modules/scene/scene-init.ts:207`
- Return type: `void`

**Signature**

```ts
export function onWindowResize() { if (!canvasContainer || !camera || !renderer) return; const width = Math.max(1, canvasContainer.clientWidth); const height = Math.max(1, canvasContainer.clientHeight); camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); syncViewportDependentSceneVisuals();
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `onWindowResize` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/scene-init.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/scene-init.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `onWindowResize` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
onWindowResize();
```

### `setIsHittingGizmo`

- Full name: `setIsHittingGizmo`
- Location: `public/modules/scene/scene-init.ts:81`
- Return type: `void`

**Signature**

```ts
export function setIsHittingGizmo(val: boolean) { isHittingGizmo = val; }
```

**Parameters**

- `val: boolean`: input argument of type `boolean`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setIsHittingGizmo` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/scene-init.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/scene-init.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `setIsHittingGizmo` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setIsHittingGizmo(/* val */);
```

### `setPointerDownPos`

- Full name: `setPointerDownPos`
- Location: `public/modules/scene/scene-init.ts:77`
- Return type: `void`

**Signature**

```ts
export function setPointerDownPos(x: number, y: number) { pointerDownPos.set(x, y); }
```

**Parameters**

- `x: number`: input argument of type `number`.
- `y: number`: input argument of type `number`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setPointerDownPos` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/scene-init.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/scene-init.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `setPointerDownPos` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setPointerDownPos(/* x */, /* y */);
```

### `setSelectedObject`

- Full name: `setSelectedObject`
- Location: `public/modules/scene/scene-init.ts:41`
- Return type: `void`

**Signature**

```ts
export function setSelectedObject(obj: THREE.Object3D | null) { selectedObject = obj; (window as any).selectedObject = obj; (window as any).pendingOrbitRetargetObject = null; if (obj) { if (!multiSelectedObjects.includes(obj)) { multiSelectedObjects = [obj];
```

**Parameters**

- `obj: THREE.Object3D | null`: input argument of type `THREE.Object3D | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setSelectedObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/scene-init.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/scene-init.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `setSelectedObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setSelectedObject(/* obj */);
```

### `syncViewportDependentSceneVisuals`

- Full name: `syncViewportDependentSceneVisuals`
- Location: `public/modules/scene/scene-init.ts:115`
- Return type: `void`

**Signature**

```ts
export function syncViewportDependentSceneVisuals() { if (!renderer) return; const size = renderer.getSize(new THREE.Vector2()); for (const trail of Object.values(droneTrails)) { const material = trail.path.material as LineMaterial; material.resolution.set(size.x, size.y); } }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `syncViewportDependentSceneVisuals` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/scene-init.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/scene-init.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `syncViewportDependentSceneVisuals` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncViewportDependentSceneVisuals();
```

### `toggleMultiSelectObject`

- Full name: `toggleMultiSelectObject`
- Location: `public/modules/scene/scene-init.ts:56`
- Return type: `void`

**Signature**

```ts
export function toggleMultiSelectObject(obj: THREE.Object3D) { const index = multiSelectedObjects.indexOf(obj); if (index === -1) { multiSelectedObjects.push(obj); } else { multiSelectedObjects.splice(index, 1); } 
```

**Parameters**

- `obj: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `toggleMultiSelectObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/scene-init.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/scene-init.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `toggleMultiSelectObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
toggleMultiSelectObject(/* obj */);
```

## Module `public/modules/scene/selection.ts`

3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor.

### `deselectObject`

- Full name: `deselectObject`
- Location: `public/modules/scene/selection.ts:24`
- Return type: `void`

**Signature**

```ts
export function deselectObject() { if (!selectedObject) return; const objectToClear = selectedObject; selectedObject.traverse((node: any) => { if (node.isMesh && node.material) { const materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach((mat: any) => {
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `deselectObject` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/selection.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/selection.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `deselectObject` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
deselectObject();
```

### `exitTransformMode`

- Full name: `exitTransformMode`
- Location: `public/modules/scene/selection.ts:7`
- Return type: `void`

**Signature**

```ts
export function exitTransformMode() { if (transformControl) { transformControl.detach(); transformControl.visible = false; } if (transformHelper) transformHelper.visible = false; updateTransformModeDecorations(null); if ((window as any).hideGizmoToolbar) (window as any).hideGizmoToolbar();
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `exitTransformMode` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/selection.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/selection.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `exitTransformMode` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
exitTransformMode();
```

### `handleDeselection`

- Full name: `handleDeselection`
- Location: `public/modules/scene/selection.ts:18`
- Return type: `void`

**Signature**

```ts
export function handleDeselection() { if (selectedObject) deselectObject(); exitTransformMode(); if ((window as any).hideContextMenu) (window as any).hideContextMenu(); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `handleDeselection` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/selection.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/selection.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `handleDeselection` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
handleDeselection();
```

## Module `public/modules/scene/transform.ts`

3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor.

### `createAxisLabel`

- Full name: `createAxisLabel`
- Location: `public/modules/scene/transform.ts:10`
- Return type: `Sprite<Object3DEventMap>`

**Signature**

```ts
function createAxisLabel(text: string, color: string) { const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128; const ctx = canvas.getContext('2d'); if (ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.beginPath();
```

**Parameters**

- `text: string`: input argument of type `string`.
- `color: string`: input argument of type `string`.

**Return Value**

- Value of type `Sprite<Object3DEventMap>` consumed by downstream logic.

**Purpose**

- Creates `createAxisLabel` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `createAxisLabel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createAxisLabel(/* text */, /* color */);
```

### `getGuideLength`

- Full name: `getGuideLength`
- Location: `public/modules/scene/transform.ts:57`
- Return type: `number`

**Signature**

```ts
function getGuideLength(target: THREE.Object3D) { const box = new THREE.Box3().setFromObject(target); const size = new THREE.Vector3(); box.getSize(size); const maxDimension = Math.max(size.x, size.y, size.z); return THREE.MathUtils.clamp(maxDimension * 0.75 || 1.8, 1.4, 4.5); }
```

**Parameters**

- `target: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `getGuideLength` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `getGuideLength` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getGuideLength(/* target */);
```

### `hideRotationGuide`

- Full name: `hideRotationGuide`
- Location: `public/modules/scene/transform.ts:65`
- Return type: `void`

**Signature**

```ts
function hideRotationGuide() { if (rotationGuide) { rotationGuide.removeFromParent(); rotationGuide.traverse((node: any) => { if (node.material) { const materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach((material: THREE.Material) => material.dispose()); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `hideRotationGuide` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `hideRotationGuide` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
hideRotationGuide();
```

### `setHelperRenderOrder`

- Full name: `setHelperRenderOrder`
- Location: `public/modules/scene/transform.ts:45`
- Return type: `void`

**Signature**

```ts
function setHelperRenderOrder(object: THREE.Object3D) { object.renderOrder = 10020; object.traverse((node: any) => { node.renderOrder = 10020; const materials = Array.isArray(node.material) ? node.material : node.material ? [node.material] : []; materials.forEach((material: THREE.Material & { depthTest?: boolean; depthWrite?: boolean }) => { material.depthTest = false; material.depthWrite = false;
```

**Parameters**

- `object: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setHelperRenderOrder` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `setHelperRenderOrder` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setHelperRenderOrder(/* object */);
```

### `setupTransformControlListeners`

- Full name: `setupTransformControlListeners`
- Location: `public/modules/scene/transform.ts:127`
- Return type: `void`

**Signature**

```ts
export function setupTransformControlListeners() { transformControl.addEventListener('change', () => { if ((window as any).selectionHelper) (window as any).selectionHelper.update(); syncRotationGuide(); if (selectedObject) { let selectedDroneId: string | null = null; for (const id in droneMeshes) {
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setupTransformControlListeners` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `setupTransformControlListeners` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setupTransformControlListeners();
```

### `showRotationGuide`

- Full name: `showRotationGuide`
- Location: `public/modules/scene/transform.ts:87`
- Return type: `void`

**Signature**

```ts
function showRotationGuide(target: THREE.Object3D) { hideRotationGuide(); const parent = target.parent; if (!parent) return; const guide = new THREE.Group(); guide.name = '__rotation_guide__';
```

**Parameters**

- `target: THREE.Object3D`: input argument of type `THREE.Object3D`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `showRotationGuide` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `showRotationGuide` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
showRotationGuide(/* target */);
```

### `syncRotationGuide`

- Full name: `syncRotationGuide`
- Location: `public/modules/scene/transform.ts:80`
- Return type: `void`

**Signature**

```ts
function syncRotationGuide() { if (!rotationGuide || !rotationGuideHost) return; rotationGuide.position.copy(rotationGuideHost.position); rotationGuide.quaternion.copy(rotationGuideHost.quaternion); rotationGuide.updateMatrixWorld(true); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `syncRotationGuide` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `syncRotationGuide` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncRotationGuide();
```

### `updateTransformModeDecorations`

- Full name: `updateTransformModeDecorations`
- Location: `public/modules/scene/transform.ts:119`
- Return type: `void`

**Signature**

```ts
export function updateTransformModeDecorations(mode: 'translate' | 'rotate' | 'scale' | null, target?: THREE.Object3D | null) { if (mode === 'rotate' && target) { showRotationGuide(target); return; } hideRotationGuide(); }
```

**Parameters**

- `mode: 'translate' | 'rotate' | 'scale' | null`: input argument of type `'translate' | 'rotate' | 'scale' | null`.
- `target?: THREE.Object3D | null`: input argument of type `THREE.Object3D | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateTransformModeDecorations` in the 3D scene layer. It encapsulates one well-defined step of the module contract in `public/modules/scene/transform.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/scene/transform.ts`. 3D scene management module. Covers selection, transforms, object catalog logic, scene initialization, and user input in the editor. In practice, it isolates the implementation details of `updateTransformModeDecorations` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateTransformModeDecorations(/* mode */, /* target */);
```

## Module `public/modules/state.ts`

Core simulator module. Contains shared runtime logic, state management, or foundational services.

### `createDroneState`

- Full name: `createDroneState`
- Location: `public/modules/state.ts:155`
- Return type: `DroneState`

**Signature**

```ts
export function createDroneState(id: string, name: string, x: number = 0, y: number = 0, z: number = 0): DroneState { const drone: DroneState = { id, name, running: false, current_time: 0, pos: { x, y, z }, vel: { x: 0, y: 0, z: 0 }, accel: { x: 0, y: 0, z: 9.81 },
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.
- `name: string`: input argument of type `string`.
- `x?: number`: input argument of type `number`.
- `y?: number`: input argument of type `number`.
- `z?: number`: input argument of type `number`.

**Return Value**

- Value of type `DroneState` consumed by downstream logic.

**Purpose**

- Creates `createDroneState` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/state.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `createDroneState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createDroneState('drone_1', /* name */, /* x */, /* y */, /* z */);
```

### `getDroneFromLua`

- Full name: `getDroneFromLua`
- Location: `public/modules/state.ts:247`
- Return type: `DroneState`

**Signature**

```ts
export function getDroneFromLua(L: any): DroneState { window.fengari.lua.lua_getglobal(L, window.fengari.to_luastring("__DRONE_ID__")); const idStr = window.fengari.lua.lua_tostring(L, -1); const id = idStr ? window.fengari.to_jsstring(idStr) : currentDroneId; window.fengari.lua.lua_pop(L, 1); return drones[id] || drones[currentDroneId]; }
```

**Parameters**

- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- Value of type `DroneState` consumed by downstream logic.

**Purpose**

- Returns `getDroneFromLua` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/state.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `getDroneFromLua` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getDroneFromLua(/* L */);
```

### `isDroneArmed`

- Full name: `isDroneArmed`
- Location: `public/modules/state.ts:224`
- Return type: `boolean`

**Signature**

```ts
export function isDroneArmed(drone: DroneState): boolean { return !DISARMED_STATUSES.has(drone.status); }
```

**Parameters**

- `drone: DroneState`: current drone state object being inspected or mutated.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isDroneArmed` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/state.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `isDroneArmed` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isDroneArmed(/* drone */);
```

### `loadGamepadSettings`

- Full name: `loadGamepadSettings`
- Location: `public/modules/state.ts:130`
- Return type: `void`

**Signature**

```ts
export function loadGamepadSettings() { try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { const data = JSON.parse(saved); if (data.mapping) Object.assign(simSettings.gamepadMapping, data.mapping); if (data.inversion) simSettings.gamepadInversion = data.inversion; if (data.auxRanges) Object.assign(simSettings.gamepadAuxRanges, data.auxRanges);
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `loadGamepadSettings` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/state.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `loadGamepadSettings` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
loadGamepadSettings();
```

### `matchesAuxRange`

- Full name: `matchesAuxRange`
- Location: `public/modules/state.ts:149`
- Return type: `boolean`

**Signature**

```ts
export function matchesAuxRange(value: number, range: AuxChannelRange): boolean { const min = Math.max(1000, Math.min(range.min, range.max)); const max = Math.min(2000, Math.max(range.min, range.max)); return value >= min && value <= max; }
```

**Parameters**

- `value: number`: numeric value being displayed, normalized, or transformed.
- `range: AuxChannelRange`: input argument of type `AuxChannelRange`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Performs `matchesAuxRange` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/state.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `matchesAuxRange` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
matchesAuxRange(0, /* range */);
```

### `resetRuntimeStatePreservePose`

- Full name: `resetRuntimeStatePreservePose`
- Location: `public/modules/state.ts:228`
- Return type: `void`

**Signature**

```ts
export function resetRuntimeStatePreservePose(id: string = currentDroneId) { const drone = drones[id]; if (!drone) return; const posePos = { x: drone.pos.x, y: drone.pos.y, z: drone.pos.z }; const poseOrientation = { roll: drone.orientation.roll, pitch: drone.orientation.pitch, yaw: drone.orientation.yaw
```

**Parameters**

- `id?: string`: string identifier of a drone or target entity.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `resetRuntimeStatePreservePose` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/state.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `resetRuntimeStatePreservePose` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetRuntimeStatePreservePose('drone_1');
```

### `resetState`

- Full name: `resetState`
- Location: `public/modules/state.ts:255`
- Return type: `void`

**Signature**

```ts
export function resetState(id: string = currentDroneId) { const drone = drones[id]; if (!drone) return; drone.running = false; drone.current_time = 0; drone.vel = { x: 0, y: 0, z: 0 }; drone.accel = { x: 0, y: 0, z: 9.81 }; drone.gyro = { x: 0, y: 0, z: 0 };
```

**Parameters**

- `id?: string`: string identifier of a drone or target entity.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `resetState` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/state.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `resetState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetState('drone_1');
```

### `saveGamepadSettings`

- Full name: `saveGamepadSettings`
- Location: `public/modules/state.ts:119`
- Return type: `void`

**Signature**

```ts
export function saveGamepadSettings() { const data = { mapping: simSettings.gamepadMapping, inversion: simSettings.gamepadInversion, auxRanges: simSettings.gamepadAuxRanges, modeRanges: simSettings.gamepadModeRanges, stickMode: simSettings.gamepadStickMode };
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `saveGamepadSettings` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/state.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `saveGamepadSettings` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
saveGamepadSettings();
```

### `setCurrentDrone`

- Full name: `setCurrentDrone`
- Location: `public/modules/state.ts:206`
- Return type: `void`

**Signature**

```ts
export function setCurrentDrone(id: string) { if (drones[id]) currentDroneId = id; }
```

**Parameters**

- `id: string`: string identifier of a drone or target entity.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setCurrentDrone` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/state.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `setCurrentDrone` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setCurrentDrone('drone_1');
```

### `setCurrentScriptLanguage`

- Full name: `setCurrentScriptLanguage`
- Location: `public/modules/state.ts:76`
- Return type: `void`

**Signature**

```ts
export function setCurrentScriptLanguage(language: ScriptLanguage) { currentScriptLanguage = language; }
```

**Parameters**

- `language: ScriptLanguage`: selected runtime language identifier.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setCurrentScriptLanguage` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/state.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `setCurrentScriptLanguage` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setCurrentScriptLanguage(/* language */);
```

## Module `public/modules/tests.ts`

Core simulator module. Contains shared runtime logic, state management, or foundational services.

### `runIntegrationTests`

- Full name: `runIntegrationTests`
- Location: `public/modules/tests.ts:5`
- Return type: `void`

**Signature**

```ts
export function runIntegrationTests(droneMesh: any, camera: any, controls: any) { log('Starting Integration Tests...', 'info'); // Test 1: Check Scene Objects if (!droneMesh) { log('Test Failed: Drone mesh not found', 'error'); } else { log('Test Passed: Drone mesh exists', 'success');
```

**Parameters**

- `droneMesh: any`: input argument of type `any`.
- `camera: any`: input argument of type `any`.
- `controls: any`: input argument of type `any`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `runIntegrationTests` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/tests.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/tests.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `runIntegrationTests` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
runIntegrationTests(/* droneMesh */, /* camera */, /* controls */);
```

## Module `public/modules/ui/api-docs-ui.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `renderApiDocs`

- Full name: `renderApiDocs`
- Location: `public/modules/ui/api-docs-ui.ts:10`
- Return type: `void`

**Signature**

```ts
export function renderApiDocs(language: 'lua' | 'python' = 'lua') { const container = document.getElementById('api-docs'); if (!container) return; const docs = language === 'python' ? pythonApiDocs : apiDocs; let html = ''; 
```

**Parameters**

- `language?: 'lua' | 'python'`: selected runtime language identifier.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderApiDocs` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/api-docs-ui.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/api-docs-ui.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `renderApiDocs` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderApiDocs(/* language */);
```

## Module `public/modules/ui/camera-mode.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `initCameraModeUI`

- Full name: `initCameraModeUI`
- Location: `public/modules/ui/camera-mode.ts:3`
- Return type: `void`

**Signature**

```ts
export function initCameraModeUI() { (window as any).setCameraMode = function(mode: string) { (window as any).cameraMode = mode; const buttons = document.querySelectorAll('.camera-controls button') as NodeListOf<HTMLButtonElement>; buttons.forEach((btn) => { const onclick = btn.getAttribute('onclick') || ''; if (onclick.includes(`'${mode}'`)) { btn.style.background = '#38bdf8';
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initCameraModeUI` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/camera-mode.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/camera-mode.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initCameraModeUI` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initCameraModeUI();
```

## Module `public/modules/ui/context-menu.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `initContextMenu`

- Full name: `initContextMenu`
- Location: `public/modules/ui/context-menu.ts:39`
- Return type: `void`

**Signature**

```ts
export function initContextMenu() { const prevMenu = document.getElementById('object-context-menu'); if (prevMenu) prevMenu.remove(); const prevToolPanel = document.getElementById('transform-toolbar'); if (prevToolPanel) prevToolPanel.remove(); const prevStyle = document.getElementById('ctx-menu-style'); if (prevStyle) prevStyle.remove(); 
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initContextMenu` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initContextMenu` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initContextMenu();
```

### `initContextMenu.addButton`

- Full name: `initContextMenu.addButton`
- Location: `public/modules/ui/context-menu.ts:255`
- Return type: `HTMLButtonElement`

**Signature**

```ts
(label: string, icon: string, action: () => void, className = '') => { const button = document.createElement('button'); button.type = 'button'; button.className = `ctx-btn ${className}`.trim(); button.innerHTML = `<span>${icon}</span><span>${label}</span>`; const run = (e: Event) => { e.preventDefault(); e.stopPropagation();
```

**Parameters**

- `label: string`: input argument of type `string`.
- `icon: string`: input argument of type `string`.
- `action: () => void`: input argument of type `() => void`.
- `className?: string`: input argument of type `string`.

**Return Value**

- Value of type `HTMLButtonElement` consumed by downstream logic.

**Purpose**

- Performs `initContextMenu.addButton` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `addButton` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
addButton(/* label */, /* icon */, /* action */, /* className */);
```

### `initContextMenu.addButton.run`

- Full name: `initContextMenu.addButton.run`
- Location: `public/modules/ui/context-menu.ts:260`
- Return type: `void`

**Signature**

```ts
(e: Event) => { e.preventDefault(); e.stopPropagation(); hide(); action(); }
```

**Parameters**

- `e: Event`: input argument of type `Event`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initContextMenu.addButton.run` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `run` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
run(/* e */);
```

### `initContextMenu.hide`

- Full name: `initContextMenu.hide`
- Location: `public/modules/ui/context-menu.ts:291`
- Return type: `void`

**Signature**

```ts
() => { menu.classList.remove('visible'); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initContextMenu.hide` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `hide` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
hide();
```

### `initContextMenu.hideToolbar`

- Full name: `initContextMenu.hideToolbar`
- Location: `public/modules/ui/context-menu.ts:307`
- Return type: `void`

**Signature**

```ts
() => { toolbar.classList.remove('visible'); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initContextMenu.hideToolbar` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `hideToolbar` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
hideToolbar();
```

### `initContextMenu.renderButtons`

- Full name: `initContextMenu.renderButtons`
- Location: `public/modules/ui/context-menu.ts:274`
- Return type: `void`

**Signature**

```ts
() => { menu.innerHTML = ''; menu.appendChild(header); addButton('Переместить', '📍', () => callbacks.onTransform('translate')); addButton('Наклонить', '🔄', () => callbacks.onTransform('rotate')); addButton('Масштаб', '📏', () => callbacks.onTransform('scale')); addButton('Дублировать', '📋', () => callbacks.onDuplicate()); if (callbacks.onShowCoords) {
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `initContextMenu.renderButtons` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `renderButtons` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderButtons();
```

### `initContextMenu.renderToolbar`

- Full name: `initContextMenu.renderToolbar`
- Location: `public/modules/ui/context-menu.ts:319`
- Return type: `void`

**Signature**

```ts
() => { toolbarTitle.textContent = toolPanelCallbacks.title || 'Инструменты объекта'; toolbarActions.innerHTML = ''; const addToolbarButton = (label: string, mode: string | null, action: () => void, extraClass = '') => { const button = document.createElement('button'); button.type = 'button'; button.className = `transform-btn ${extraClass}`.trim();
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `initContextMenu.renderToolbar` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `renderToolbar` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderToolbar();
```

### `initContextMenu.renderToolbar.addToolbarButton`

- Full name: `initContextMenu.renderToolbar.addToolbarButton`
- Location: `public/modules/ui/context-menu.ts:323`
- Return type: `HTMLButtonElement`

**Signature**

```ts
(label: string, mode: string | null, action: () => void, extraClass = '') => { const button = document.createElement('button'); button.type = 'button'; button.className = `transform-btn ${extraClass}`.trim(); button.textContent = label; if (mode) button.dataset.transformMode = mode; button.addEventListener('click', (event) => { event.preventDefault();
```

**Parameters**

- `label: string`: input argument of type `string`.
- `mode: string | null`: input argument of type `string | null`.
- `action: () => void`: input argument of type `() => void`.
- `extraClass?: string`: input argument of type `string`.

**Return Value**

- Value of type `HTMLButtonElement` consumed by downstream logic.

**Purpose**

- Performs `initContextMenu.renderToolbar.addToolbarButton` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `addToolbarButton` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
addToolbarButton(/* label */, /* mode */, /* action */, /* extraClass */);
```

### `initContextMenu.setRotationStep`

- Full name: `initContextMenu.setRotationStep`
- Location: `public/modules/ui/context-menu.ts:311`
- Return type: `void`

**Signature**

```ts
(step: number) => { toolPanelCallbacks.rotationStepDeg = step; const buttons = toolbar.querySelectorAll<HTMLButtonElement>('[data-rotation-step]'); buttons.forEach((button) => { button.classList.toggle('active', Number(button.dataset.rotationStep) === step); }); }
```

**Parameters**

- `step: number`: input argument of type `number`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `initContextMenu.setRotationStep` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `setRotationStep` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setRotationStep(/* step */);
```

### `initContextMenu.setToolbarMode`

- Full name: `initContextMenu.setToolbarMode`
- Location: `public/modules/ui/context-menu.ts:295`
- Return type: `void`

**Signature**

```ts
(mode?: string | null) => { toolPanelCallbacks.activeMode = mode || null; const buttons = toolbar.querySelectorAll<HTMLButtonElement>('[data-transform-mode]'); buttons.forEach((button) => { button.classList.toggle('active', button.dataset.transformMode === toolPanelCallbacks.activeMode); }); const rotateSections = toolbar.querySelectorAll<HTMLElement>('[data-rotate-only]'); rotateSections.forEach((section) => {
```

**Parameters**

- `mode?: string | null`: input argument of type `string | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `initContextMenu.setToolbarMode` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `setToolbarMode` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setToolbarMode(/* mode */);
```

### `initContextMenu.show`

- Full name: `initContextMenu.show`
- Location: `public/modules/ui/context-menu.ts:420`
- Return type: `void`

**Signature**

```ts
(x: number, y: number) => { renderButtons(); menu.style.left = `${Math.max(0, x)}px`; menu.style.top = `${Math.max(0, y)}px`; menu.classList.add('visible'); const rect = menu.getBoundingClientRect(); if (rect.right > window.innerWidth) { menu.style.left = `${Math.max(0, window.innerWidth - rect.width - 6)}px`;
```

**Parameters**

- `x: number`: input argument of type `number`.
- `y: number`: input argument of type `number`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initContextMenu.show` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/context-menu.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/context-menu.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `show` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
show(/* x */, /* y */);
```

## Module `public/modules/ui/drone-manager.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `initDroneManager`

- Full name: `initDroneManager`
- Location: `public/modules/ui/drone-manager.ts:12`
- Return type: `void`

**Signature**

```ts
export function initDroneManager(onSceneUpdate?: () => void) { const list = document.getElementById('drone-list') as HTMLSelectElement; const addBtn = document.getElementById('add-drone-btn') as HTMLButtonElement; const delBtn = document.getElementById('del-drone-btn') as HTMLButtonElement; function updateList() { list.innerHTML = ''; for (const id in drones) {
```

**Parameters**

- `onSceneUpdate?: () => void`: input argument of type `() => void`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initDroneManager` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/drone-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/drone-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initDroneManager` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initDroneManager(/* onSceneUpdate */);
```

### `initDroneManager.updateList`

- Full name: `initDroneManager.updateList`
- Location: `public/modules/ui/drone-manager.ts:17`
- Return type: `void`

**Signature**

```ts
function updateList() { list.innerHTML = ''; for (const id in drones) { const opt = document.createElement('option'); opt.value = id; opt.textContent = drones[id].name; if (id === currentDroneId) opt.selected = true; list.appendChild(opt);
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `initDroneManager.updateList` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/drone-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/drone-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `updateList` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateList();
```

## Module `public/modules/ui/file-controls.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `initFileControls`

- Full name: `initFileControls`
- Location: `public/modules/ui/file-controls.ts:3`
- Return type: `void`

**Signature**

```ts
export function initFileControls(callbacks: UICallbacks) { const fileSelector = document.getElementById('file-selector') as HTMLSelectElement | null; if (fileSelector) { fetch('/api/files') .then((res) => { if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`); return res.json(); })
```

**Parameters**

- `callbacks: UICallbacks`: input argument of type `UICallbacks`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initFileControls` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/file-controls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/file-controls.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initFileControls` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initFileControls(/* callbacks */);
```

## Module `public/modules/ui/hud-controls.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `applyHudVisibility`

- Full name: `applyHudVisibility`
- Location: `public/modules/ui/hud-controls.ts:1`
- Return type: `void`

**Signature**

```ts
function applyHudVisibility(overlayId: string, buttonId: string, storageKey: string, visible: boolean) { const overlay = document.getElementById(overlayId); const button = document.getElementById(buttonId) as HTMLButtonElement | null; if (!overlay || !button) return; overlay.classList.toggle('is-hidden', !visible); button.classList.toggle('active', visible); button.setAttribute('aria-pressed', visible ? 'true' : 'false'); localStorage.setItem(storageKey, visible ? '1' : '0');
```

**Parameters**

- `overlayId: string`: input argument of type `string`.
- `buttonId: string`: input argument of type `string`.
- `storageKey: string`: input argument of type `string`.
- `visible: boolean`: input argument of type `boolean`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Applies `applyHudVisibility` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/hud-controls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/hud-controls.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `applyHudVisibility` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
applyHudVisibility('drone_1', 'drone_1', /* storageKey */, /* visible */);
```

### `initHudControls`

- Full name: `initHudControls`
- Location: `public/modules/ui/hud-controls.ts:23`
- Return type: `void`

**Signature**

```ts
export function initHudControls() { initHudToggle('telemetry-overlay', 'toggle-telemetry-btn', 'hud-telemetry-visible'); initHudToggle('matrix-overlay', 'toggle-matrix-btn', 'hud-matrix-visible'); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initHudControls` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/hud-controls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/hud-controls.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initHudControls` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initHudControls();
```

### `initHudToggle`

- Full name: `initHudToggle`
- Location: `public/modules/ui/hud-controls.ts:11`
- Return type: `void`

**Signature**

```ts
function initHudToggle(overlayId: string, buttonId: string, storageKey: string) { const button = document.getElementById(buttonId) as HTMLButtonElement | null; if (!button) return; const initialVisible = localStorage.getItem(storageKey) !== '0'; applyHudVisibility(overlayId, buttonId, storageKey, initialVisible); button.addEventListener('click', () => { const overlay = document.getElementById(overlayId); const visible = overlay ? overlay.classList.contains('is-hidden') : true;
```

**Parameters**

- `overlayId: string`: input argument of type `string`.
- `buttonId: string`: input argument of type `string`.
- `storageKey: string`: input argument of type `string`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initHudToggle` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/hud-controls.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/hud-controls.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initHudToggle` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initHudToggle('drone_1', 'drone_1', /* storageKey */);
```

## Module `public/modules/ui/index.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `initUI`

- Full name: `initUI`
- Location: `public/modules/ui/index.ts:65`
- Return type: `void`

**Signature**

```ts
export function initUI(callbacks: UICallbacks) { initContextMenu(); initSceneManager(callbacks); initDroneManager(callbacks.onSceneUpdate); renderApiDocs(); initLEDMatrixUI(); initSettingsUI(); initSimulationNotice();
```

**Parameters**

- `callbacks: UICallbacks`: input argument of type `UICallbacks`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initUI` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/index.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/index.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initUI` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initUI(/* callbacks */);
```

### `initUI.updateObjectList`

- Full name: `initUI.updateObjectList`
- Location: `public/modules/ui/index.ts:76`
- Return type: `void`

**Signature**

```ts
(objects: any[], selectedId: string | null, onSelect: (id: string) => void) => { const objList = document.getElementById('scene-object-list'); if (objList) { objList.innerHTML = ''; objects.forEach(obj => { const item = document.createElement('div'); item.className = 'scene-object-item' + (selectedId === obj.id ? ' selected' : ''); 
```

**Parameters**

- `objects: any[]`: input argument of type `any[]`.
- `selectedId: string | null`: input argument of type `string | null`.
- `onSelect: (id: string) => void`: input argument of type `(id: string) => void`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `initUI.updateObjectList` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/index.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/index.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `updateObjectList` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateObjectList(/* objects */, 'drone_1', /* onSelect */);
```

### `updateSceneObjectDetails`

- Full name: `updateSceneObjectDetails`
- Location: `public/modules/ui/index.ts:112`
- Return type: `void`

**Signature**

```ts
export function updateSceneObjectDetails(obj: any | null) { const detailsEl = document.getElementById('scene-object-details'); const valInput = document.getElementById('scene-selected-value') as HTMLInputElement; const ptsInput = document.getElementById('scene-selected-points') as HTMLTextAreaElement; const appendBtn = document.getElementById('scene-append-point-btn') as HTMLButtonElement; if (!obj) { if (detailsEl) detailsEl.innerHTML = 'Выберите объект в списке';
```

**Parameters**

- `obj: any | null`: input argument of type `any | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateSceneObjectDetails` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/index.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/index.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `updateSceneObjectDetails` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateSceneObjectDetails(/* obj */);
```

## Module `public/modules/ui/led-matrix.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `initLEDMatrixUI`

- Full name: `initLEDMatrixUI`
- Location: `public/modules/ui/led-matrix.ts:7`
- Return type: `void`

**Signature**

```ts
export function initLEDMatrixUI() { const grid = document.getElementById('led-matrix-grid'); if (!grid) return; grid.innerHTML = ''; for (let i = 0; i < 25; i++) { const pixel = document.createElement('div'); pixel.className = 'led-pixel'; pixel.id = `led-pixel-${i + 4}`; // offset by 4 for base LEDs
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initLEDMatrixUI` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/led-matrix.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/led-matrix.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initLEDMatrixUI` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initLEDMatrixUI();
```

## Module `public/modules/ui/logger.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `log`

- Full name: `log`
- Location: `public/modules/ui/logger.ts:1`
- Return type: `void`

**Signature**

```ts
export function log(msg: string, type: 'info'|'error'|'warn'|'success' = 'info') { const logs = document.getElementById('logs'); if (logs) { const time = new Date().toLocaleTimeString('ru-RU', { hour12: false }); // Удаляем префиксы для чистоты дизайна let cleanMsg = msg; if (msg.startsWith('AP:')) cleanMsg = msg.replace('AP:', '');
```

**Parameters**

- `msg: string`: input argument of type `string`.
- `type?: 'info'|'error'|'warn'|'success'`: message, state, or category discriminator.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `log` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/logger.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/logger.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `log` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
log(/* msg */, /* type */);
```

## Module `public/modules/ui/scene-manager.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `initSceneManager`

- Full name: `initSceneManager`
- Location: `public/modules/ui/scene-manager.ts:9`
- Return type: `void`

**Signature**

```ts
export function initSceneManager(callbacks: UICallbacks) { if (!callbacks.sceneManager) return; const listEl = document.getElementById('scene-object-list'); const detailsEl = document.getElementById('scene-object-details'); const addTypeEl = document.getElementById('scene-add-type') as HTMLSelectElement | null; const addDictionaryEl = document.getElementById('scene-add-dictionary') as HTMLSelectElement | null; const addValueEl = document.getElementById('scene-add-value') as HTMLInputElement | null;
```

**Parameters**

- `callbacks: UICallbacks`: input argument of type `UICallbacks`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initSceneManager` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initSceneManager` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initSceneManager(/* callbacks */);
```

### `initSceneManager.appendIncidentEntry`

- Full name: `initSceneManager.appendIncidentEntry`
- Location: `public/modules/ui/scene-manager.ts:164`
- Return type: `void`

**Signature**

```ts
( incidentsEl: HTMLTextAreaElement | null, floorsEl: HTMLInputElement | null, floorEl: HTMLInputElement | null, faceEl: HTMLSelectElement | null, windowEl: HTMLSelectElement | null, kindEl: HTMLSelectElement | null, valueEl: HTMLInputElement | null
```

**Parameters**

- `incidentsEl: HTMLTextAreaElement | null`: input argument of type `HTMLTextAreaElement | null`.
- `floorsEl: HTMLInputElement | null`: input argument of type `HTMLInputElement | null`.
- `floorEl: HTMLInputElement | null`: input argument of type `HTMLInputElement | null`.
- `faceEl: HTMLSelectElement | null`: input argument of type `HTMLSelectElement | null`.
- `windowEl: HTMLSelectElement | null`: input argument of type `HTMLSelectElement | null`.
- `kindEl: HTMLSelectElement | null`: input argument of type `HTMLSelectElement | null`.
- `valueEl: HTMLInputElement | null`: input argument of type `HTMLInputElement | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initSceneManager.appendIncidentEntry` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `appendIncidentEntry` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
appendIncidentEntry('drone_1', /* floorsEl */, /* floorEl */, /* faceEl */, /* windowEl */, /* kindEl */, /* valueEl */);
```

### `initSceneManager.clampFloors`

- Full name: `initSceneManager.clampFloors`
- Location: `public/modules/ui/scene-manager.ts:97`
- Return type: `number`

**Signature**

```ts
(value: string | undefined, fallback = 9) => clampInt(value, fallback, 5, 20)
```

**Parameters**

- `value: string | undefined`: numeric value being displayed, normalized, or transformed.
- `fallback?: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `initSceneManager.clampFloors` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `clampFloors` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampFloors(0, /* fallback */);
```

### `initSceneManager.clampInt`

- Full name: `initSceneManager.clampInt`
- Location: `public/modules/ui/scene-manager.ts:87`
- Return type: `number`

**Signature**

```ts
(value: string | undefined, fallback: number, min: number, max: number) => { const parsed = Number.parseInt(value || '', 10); if (!Number.isFinite(parsed)) return fallback; return Math.min(Math.max(parsed, min), max); }
```

**Parameters**

- `value: string | undefined`: numeric value being displayed, normalized, or transformed.
- `fallback: number`: input argument of type `number`.
- `min: number`: input argument of type `number`.
- `max: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `initSceneManager.clampInt` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `clampInt` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampInt(0, /* fallback */, /* min */, /* max */);
```

### `initSceneManager.clampNumber`

- Full name: `initSceneManager.clampNumber`
- Location: `public/modules/ui/scene-manager.ts:92`
- Return type: `number`

**Signature**

```ts
(value: string | undefined, fallback: number, min: number, max: number) => { const parsed = Number(value); if (!Number.isFinite(parsed)) return fallback; return Math.min(Math.max(parsed, min), max); }
```

**Parameters**

- `value: string | undefined`: numeric value being displayed, normalized, or transformed.
- `fallback: number`: input argument of type `number`.
- `min: number`: input argument of type `number`.
- `max: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `initSceneManager.clampNumber` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `clampNumber` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampNumber(0, /* fallback */, /* min */, /* max */);
```

### `initSceneManager.clampWindowFloor`

- Full name: `initSceneManager.clampWindowFloor`
- Location: `public/modules/ui/scene-manager.ts:98`
- Return type: `number`

**Signature**

```ts
(value: string | undefined, maxFloor: number) => clampInt(value, 1, 1, maxFloor)
```

**Parameters**

- `value: string | undefined`: numeric value being displayed, normalized, or transformed.
- `maxFloor: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `initSceneManager.clampWindowFloor` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `clampWindowFloor` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampWindowFloor(0, /* maxFloor */);
```

### `initSceneManager.clearIncidentEntries`

- Full name: `initSceneManager.clearIncidentEntries`
- Location: `public/modules/ui/scene-manager.ts:186`
- Return type: `void`

**Signature**

```ts
(incidentsEl: HTMLTextAreaElement | null, valueEl: HTMLInputElement | null) => { if (!incidentsEl) return; incidentsEl.value = ''; syncIncidentValue(valueEl, incidentsEl); }
```

**Parameters**

- `incidentsEl: HTMLTextAreaElement | null`: input argument of type `HTMLTextAreaElement | null`.
- `valueEl: HTMLInputElement | null`: input argument of type `HTMLInputElement | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initSceneManager.clearIncidentEntries` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `clearIncidentEntries` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clearIncidentEntries('drone_1', /* valueEl */);
```

### `initSceneManager.fillDictionarySelect`

- Full name: `initSceneManager.fillDictionarySelect`
- Location: `public/modules/ui/scene-manager.ts:100`
- Return type: `void`

**Signature**

```ts
(selectEl: HTMLSelectElement | null, mode: 'aruco' | 'apriltag', value?: string) => { if (!selectEl) return; const options = MARKER_DICTIONARY_OPTIONS[mode]; selectEl.innerHTML = ''; for (const option of options) { const opt = document.createElement('option'); opt.value = option.id; opt.textContent = option.label;
```

**Parameters**

- `selectEl: HTMLSelectElement | null`: input argument of type `HTMLSelectElement | null`.
- `mode: 'aruco' | 'apriltag'`: input argument of type `'aruco' | 'apriltag'`.
- `value?: string`: numeric value being displayed, normalized, or transformed.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initSceneManager.fillDictionarySelect` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `fillDictionarySelect` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
fillDictionarySelect(/* selectEl */, /* mode */, 0);
```

### `initSceneManager.format`

- Full name: `initSceneManager.format`
- Location: `public/modules/ui/scene-manager.ts:70`
- Return type: `string`

**Signature**

```ts
(v: number) => Number.isFinite(v) ? v.toFixed(2) : 'NaN'
```

**Parameters**

- `v: number`: input argument of type `number`.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Performs `initSceneManager.format` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `format` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
format(/* v */);
```

### `initSceneManager.getIncidentKey`

- Full name: `initSceneManager.getIncidentKey`
- Location: `public/modules/ui/scene-manager.ts:146`
- Return type: `string`

**Signature**

```ts
(entry: string) => { const match = entry.match(/^(\d+)\s*:\s*(front|back|перед|зад)\s*:\s*(\d+)/i); if (!match) return entry.trim().toLowerCase(); const faceRaw = match[2].toLowerCase(); const face = faceRaw === 'перед' ? 'front' : faceRaw === 'зад' ? 'back' : faceRaw; return `${match[1]}:${face}:${match[3]}`; }
```

**Parameters**

- `entry: string`: input argument of type `string`.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Returns `initSceneManager.getIncidentKey` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `getIncidentKey` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getIncidentKey(/* entry */);
```

### `initSceneManager.getMarkerMode`

- Full name: `initSceneManager.getMarkerMode`
- Location: `public/modules/ui/scene-manager.ts:71`
- Return type: `"apriltag" | "aruco"`

**Signature**

```ts
(type: string | undefined | null) => (type || '').toLowerCase().includes('april') ? 'apriltag' : 'aruco'
```

**Parameters**

- `type: string | undefined | null`: message, state, or category discriminator.

**Return Value**

- Value of type `"apriltag" | "aruco"` consumed by downstream logic.

**Purpose**

- Returns `initSceneManager.getMarkerMode` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `getMarkerMode` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getMarkerMode(/* type */);
```

### `initSceneManager.isBuildingType`

- Full name: `initSceneManager.isBuildingType`
- Location: `public/modules/ui/scene-manager.ts:139`
- Return type: `boolean`

**Signature**

```ts
(type: string) => type === 'building'
```

**Parameters**

- `type: string`: message, state, or category discriminator.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `initSceneManager.isBuildingType` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `isBuildingType` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isBuildingType(/* type */);
```

### `initSceneManager.isEditorFocused`

- Full name: `initSceneManager.isEditorFocused`
- Location: `public/modules/ui/scene-manager.ts:114`
- Return type: `boolean`

**Signature**

```ts
() => { const active = document.activeElement; return active === addValueEl || active === addFloorsEl || active === addBuildingFloorEl || active === addBuildingFaceEl || active === addBuildingWindowEl || active === addBuildingKindEl
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `initSceneManager.isEditorFocused` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `isEditorFocused` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isEditorFocused();
```

### `initSceneManager.isMarkerMapType`

- Full name: `initSceneManager.isMarkerMapType`
- Location: `public/modules/ui/scene-manager.ts:137`
- Return type: `boolean`

**Signature**

```ts
(type: string) => type === 'aruco-map' || type === 'apriltag-map'
```

**Parameters**

- `type: string`: message, state, or category discriminator.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `initSceneManager.isMarkerMapType` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `isMarkerMapType` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isMarkerMapType(/* type */);
```

### `initSceneManager.isSingleMarkerType`

- Full name: `initSceneManager.isSingleMarkerType`
- Location: `public/modules/ui/scene-manager.ts:138`
- Return type: `boolean`

**Signature**

```ts
(type: string) => type === 'aruco' || type === 'apriltag'
```

**Parameters**

- `type: string`: message, state, or category discriminator.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `initSceneManager.isSingleMarkerType` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `isSingleMarkerType` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isSingleMarkerType(/* type */);
```

### `initSceneManager.isValueInputType`

- Full name: `initSceneManager.isValueInputType`
- Location: `public/modules/ui/scene-manager.ts:140`
- Return type: `boolean`

**Signature**

```ts
(type: string) => isSingleMarkerType(type) || type === 'start-position' || type === 'building'
```

**Parameters**

- `type: string`: message, state, or category discriminator.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `initSceneManager.isValueInputType` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `isValueInputType` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isValueInputType(/* type */);
```

### `initSceneManager.normalizeIncidentEntries`

- Full name: `initSceneManager.normalizeIncidentEntries`
- Location: `public/modules/ui/scene-manager.ts:141`
- Return type: `string[]`

**Signature**

```ts
(value: string | undefined) => (value || '') .split(/\r?\n|;/) .map((entry) => entry.trim()) .filter(Boolean)
```

**Parameters**

- `value: string | undefined`: numeric value being displayed, normalized, or transformed.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Normalizes `initSceneManager.normalizeIncidentEntries` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `normalizeIncidentEntries` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
normalizeIncidentEntries(0);
```

### `initSceneManager.readAddMarkerMapOptions`

- Full name: `initSceneManager.readAddMarkerMapOptions`
- Location: `public/modules/ui/scene-manager.ts:201`
- Return type: `MarkerMapOptions`

**Signature**

```ts
(): MarkerMapOptions => ({ rows: clampInt(addMapRowsEl?.value, 5, 1, 20), columns: clampInt(addMapColumnsEl?.value, 5, 1, 20), startId: clampInt(addMapStartIdEl?.value, 0, 0, 100000), idStep: clampInt(addMapIdStepEl?.value, 1, 1, 1000), markerSize: clampNumber(addMapMarkerSizeEl?.value, 1.05, 0.2, 5), rotationDeg: clampNumber(addMapRotationEl?.value, 0, -180, 180), gapX: clampNumber(addMapGapXEl?.value, 0.2, 0, 10),
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `MarkerMapOptions` consumed by downstream logic.

**Purpose**

- Reads `initSceneManager.readAddMarkerMapOptions` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `readAddMarkerMapOptions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
readAddMarkerMapOptions();
```

### `initSceneManager.render`

- Full name: `initSceneManager.render`
- Location: `public/modules/ui/scene-manager.ts:280`
- Return type: `void`

**Signature**

```ts
() => { if (!listEl || !detailsEl || !callbacks.sceneManager) return; const objects = callbacks.sceneManager.list(); const selectedId = callbacks.sceneManager.getSelectedId(); listEl.innerHTML = ''; for (const obj of objects) { const row = document.createElement('button');
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `initSceneManager.render` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `render` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
render();
```

### `initSceneManager.serializeIncidentEntries`

- Full name: `initSceneManager.serializeIncidentEntries`
- Location: `public/modules/ui/scene-manager.ts:145`
- Return type: `string`

**Signature**

```ts
(entries: string[]) => entries.join('\n')
```

**Parameters**

- `entries: string[]`: input argument of type `string[]`.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Performs `initSceneManager.serializeIncidentEntries` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `serializeIncidentEntries` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
serializeIncidentEntries(/* entries */);
```

### `initSceneManager.setBuildingControlsVisible`

- Full name: `initSceneManager.setBuildingControlsVisible`
- Location: `public/modules/ui/scene-manager.ts:191`
- Return type: `void`

**Signature**

```ts
( visible: boolean, floorsWrapEl: HTMLLabelElement | null, floorsEl: HTMLInputElement | null, settingsEl: HTMLDivElement | null ) => { if (floorsWrapEl) floorsWrapEl.style.display = visible ? 'flex' : 'none'; if (floorsEl) floorsEl.disabled = !visible;
```

**Parameters**

- `visible: boolean`: input argument of type `boolean`.
- `floorsWrapEl: HTMLLabelElement | null`: input argument of type `HTMLLabelElement | null`.
- `floorsEl: HTMLInputElement | null`: input argument of type `HTMLInputElement | null`.
- `settingsEl: HTMLDivElement | null`: input argument of type `HTMLDivElement | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `initSceneManager.setBuildingControlsVisible` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `setBuildingControlsVisible` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setBuildingControlsVisible(/* visible */, /* floorsWrapEl */, /* floorsEl */, /* settingsEl */);
```

### `initSceneManager.syncFloorLimit`

- Full name: `initSceneManager.syncFloorLimit`
- Location: `public/modules/ui/scene-manager.ts:157`
- Return type: `void`

**Signature**

```ts
(floorsEl: HTMLInputElement | null, floorEl: HTMLInputElement | null) => { if (!floorsEl || !floorEl) return; const maxFloor = clampFloors(floorsEl.value, 9); floorsEl.value = String(maxFloor); floorEl.max = String(maxFloor); floorEl.value = String(clampWindowFloor(floorEl.value, maxFloor)); }
```

**Parameters**

- `floorsEl: HTMLInputElement | null`: input argument of type `HTMLInputElement | null`.
- `floorEl: HTMLInputElement | null`: input argument of type `HTMLInputElement | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `initSceneManager.syncFloorLimit` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `syncFloorLimit` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncFloorLimit(/* floorsEl */, /* floorEl */);
```

### `initSceneManager.syncIncidentValue`

- Full name: `initSceneManager.syncIncidentValue`
- Location: `public/modules/ui/scene-manager.ts:153`
- Return type: `void`

**Signature**

```ts
(targetEl: HTMLInputElement | null, sourceEl: HTMLTextAreaElement | null) => { if (!targetEl || !sourceEl) return; targetEl.value = serializeIncidentEntries(normalizeIncidentEntries(sourceEl.value)); }
```

**Parameters**

- `targetEl: HTMLInputElement | null`: input argument of type `HTMLInputElement | null`.
- `sourceEl: HTMLTextAreaElement | null`: input argument of type `HTMLTextAreaElement | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `initSceneManager.syncIncidentValue` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `syncIncidentValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncIncidentValue(/* targetEl */, /* sourceEl */);
```

### `initSceneManager.updateAddControlsState`

- Full name: `initSceneManager.updateAddControlsState`
- Location: `public/modules/ui/scene-manager.ts:245`
- Return type: `void`

**Signature**

```ts
() => { if (!addTypeEl || !addValueEl || !addPointsEl || !addDictionaryEl) return; const type = addTypeEl.value; const isSingleMarker = isSingleMarkerType(type); const needsValueInput = isValueInputType(type); const isMarkerMap = isMarkerMapType(type); const isBuilding = isBuildingType(type); const isMarker = isSingleMarker || isMarkerMap;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `initSceneManager.updateAddControlsState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `updateAddControlsState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateAddControlsState();
```

### `initSceneManager.updateMapSummary`

- Full name: `initSceneManager.updateMapSummary`
- Location: `public/modules/ui/scene-manager.ts:226`
- Return type: `void`

**Signature**

```ts
() => { if (!addMapSummaryEl) return; const options = readAddMarkerMapOptions(); const total = options.rows! * options.columns!; const firstId = options.startId!; const lastId = firstId + Math.max(0, total - 1) * options.idStep!; const traversalLabel = options.traversal === 'column-major' ? 'по столбцам' : 'по строкам'; const cornerLabelMap = {
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `initSceneManager.updateMapSummary` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/scene-manager.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/scene-manager.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `updateMapSummary` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateMapSummary();
```

## Module `public/modules/ui/settings.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `initSettingsUI`

- Full name: `initSettingsUI`
- Location: `public/modules/ui/settings.ts:21`
- Return type: `void`

**Signature**

```ts
export function initSettingsUI() { const dom = collectSettingsDomRefs(); const state = createSettingsRuntimeState(); initWizard(); const hasChannelData = (): boolean => simSettings.gamepadConnected && state.activeGamepadHasChannelData; const getObservedStatsForRef = (ref: GamepadInputRef) => getObservedStats(state.observedInputStats, ref); const getModePositions = () => getModeObservedPositions(state.observedInputStats, getMappingRef('mode'));
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initSettingsUI` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initSettingsUI` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initSettingsUI();
```

### `initSettingsUI.applyStickMode`

- Full name: `initSettingsUI.applyStickMode`
- Location: `public/modules/ui/settings.ts:72`
- Return type: `void`

**Signature**

```ts
(): void => { const gp = findCurrentActiveGamepad(); if (!gp) return; applyPrimaryAxisMappingForCurrentMode(gp); initMappingSelects(gp); renderChannelDefaultsState(); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Applies `initSettingsUI.applyStickMode` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `applyStickMode` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
applyStickMode();
```

### `initSettingsUI.beginCalibration`

- Full name: `initSettingsUI.beginCalibration`
- Location: `public/modules/ui/settings.ts:118`
- Return type: `void`

**Signature**

```ts
(gp: Gamepad): void => { state.isCalibrating = true; state.calibrationStartedAt = beginCalibrationValues(simSettings.gamepadCalibration, gp); }
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Starts `initSettingsUI.beginCalibration` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `beginCalibration` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
beginCalibration(/* ... */);
```

### `initSettingsUI.findCurrentActiveGamepad`

- Full name: `initSettingsUI.findCurrentActiveGamepad`
- Location: `public/modules/ui/settings.ts:29`
- Return type: `Gamepad | null`

**Signature**

```ts
(): Gamepad | null => findActiveMappedGamepad(state.activeGamepadIndex, state.activeGamepadId)
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Gamepad | null` consumed by downstream logic.

**Purpose**

- Finds and returns `initSettingsUI.findCurrentActiveGamepad` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `findCurrentActiveGamepad` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
findCurrentActiveGamepad();
```

### `initSettingsUI.finishCalibration`

- Full name: `initSettingsUI.finishCalibration`
- Location: `public/modules/ui/settings.ts:123`
- Return type: `void`

**Signature**

```ts
(): void => { state.isCalibrating = false; state.calibrationStartedAt = 0; finishCalibrationValues(simSettings.gamepadCalibration); applyModeRangesFromObserved(state.observedInputStats, getMappingRef('mode')); renderModeMetaState(Number(dom.valueEls.mode?.textContent ?? getDefaultChannelValue('mode'))); renderAuxRangeEditorsState(); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Stops or finalizes `initSettingsUI.finishCalibration` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `finishCalibration` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
finishCalibration();
```

### `initSettingsUI.getModePositions`

- Full name: `initSettingsUI.getModePositions`
- Location: `public/modules/ui/settings.ts:28`
- Return type: `ObservedInputPosition[]`

**Signature**

```ts
() => getModeObservedPositions(state.observedInputStats, getMappingRef('mode'))
```

**Parameters**

- No input parameters.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Returns `initSettingsUI.getModePositions` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `getModePositions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getModePositions();
```

### `initSettingsUI.getObservedStatsForRef`

- Full name: `initSettingsUI.getObservedStatsForRef`
- Location: `public/modules/ui/settings.ts:27`
- Return type: `ObservedInputStats`

**Signature**

```ts
(ref: GamepadInputRef) => getObservedStats(state.observedInputStats, ref)
```

**Parameters**

- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.

**Return Value**

- Value of type `ObservedInputStats` consumed by downstream logic.

**Purpose**

- Returns `initSettingsUI.getObservedStatsForRef` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `getObservedStatsForRef` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getObservedStatsForRef(/* ref */);
```

### `initSettingsUI.hasChannelData`

- Full name: `initSettingsUI.hasChannelData`
- Location: `public/modules/ui/settings.ts:26`
- Return type: `boolean`

**Signature**

```ts
(): boolean => simSettings.gamepadConnected && state.activeGamepadHasChannelData
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks for `initSettingsUI.hasChannelData` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `hasChannelData` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
hasChannelData();
```

### `initSettingsUI.initMappingSelects`

- Full name: `initSettingsUI.initMappingSelects`
- Location: `public/modules/ui/settings.ts:186`
- Return type: `void`

**Signature**

```ts
(gp: Gamepad): void => { ensureMappingsForGamepad(gp, ALL_CHANNELS); for (const key of ALL_CHANNELS) { const select = dom.mappingSelects[key]; if (!select) continue; select.innerHTML = PRIMARY_CHANNELS.includes(key as PrimaryChannelKey) ? createAxisOptions(gp) : createAuxOptions(gp); const mappedRef = getMappingRef(key); const hasOption = Array.from(select.options).some((option) => option.value === mappedRef);
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initSettingsUI.initMappingSelects` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initMappingSelects` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initMappingSelects(/* ... */);
```

### `initSettingsUI.readChannelValue`

- Full name: `initSettingsUI.readChannelValue`
- Location: `public/modules/ui/settings.ts:266`
- Return type: `number`

**Signature**

```ts
(gp: Gamepad, key: ChannelKey, inversionIndex?: number): number => { const inputRef = getMappingRef(key); const inputIndex = Number(inputRef.slice(1)); const isAxis = inputRef.startsWith('a'); const isInverted = inversionIndex !== undefined ? simSettings.gamepadInversion[inversionIndex] : false; if (isAxis) { const rawValue = gp.axes[inputIndex] ?? 0;
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.
- `key: ChannelKey`: logical channel, property, or mode key.
- `inversionIndex?: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Reads `initSettingsUI.readChannelValue` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `readChannelValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
readChannelValue(/* ... */, /* key */, /* inversionIndex */);
```

### `initSettingsUI.renderAuxRangeEditorsState`

- Full name: `initSettingsUI.renderAuxRangeEditorsState`
- Location: `public/modules/ui/settings.ts:36`
- Return type: `void`

**Signature**

```ts
(): void => { renderAuxRangeEditors({ dom, state, getMappingRef, getAuxRange, getDefaultChannelValue, getObservedStats: getObservedStatsForRef
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `initSettingsUI.renderAuxRangeEditorsState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `renderAuxRangeEditorsState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderAuxRangeEditorsState();
```

### `initSettingsUI.renderCalibrationStateView`

- Full name: `initSettingsUI.renderCalibrationStateView`
- Location: `public/modules/ui/settings.ts:57`
- Return type: `void`

**Signature**

```ts
(): void => { renderCalibrationState(dom, state); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `initSettingsUI.renderCalibrationStateView` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `renderCalibrationStateView` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderCalibrationStateView();
```

### `initSettingsUI.renderChannelDataStateView`

- Full name: `initSettingsUI.renderChannelDataStateView`
- Location: `public/modules/ui/settings.ts:60`
- Return type: `void`

**Signature**

```ts
(): void => { renderChannelDataState(dom, state); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `initSettingsUI.renderChannelDataStateView` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `renderChannelDataStateView` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderChannelDataStateView();
```

### `initSettingsUI.renderChannelDefaultsState`

- Full name: `initSettingsUI.renderChannelDefaultsState`
- Location: `public/modules/ui/settings.ts:46`
- Return type: `void`

**Signature**

```ts
(): void => { renderChannelDefaults({ dom, state, getDefaultChannelValue, getModePositions, getMappingRef, getAuxRange,
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `initSettingsUI.renderChannelDefaultsState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `renderChannelDefaultsState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderChannelDefaultsState();
```

### `initSettingsUI.renderMappingControlsStateView`

- Full name: `initSettingsUI.renderMappingControlsStateView`
- Location: `public/modules/ui/settings.ts:63`
- Return type: `void`

**Signature**

```ts
(): void => { renderMappingControlsState(dom, state); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `initSettingsUI.renderMappingControlsStateView` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `renderMappingControlsStateView` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderMappingControlsStateView();
```

### `initSettingsUI.renderModeMetaState`

- Full name: `initSettingsUI.renderModeMetaState`
- Location: `public/modules/ui/settings.ts:33`
- Return type: `void`

**Signature**

```ts
(liveValue: number): void => { renderModeMeta(dom, state, liveValue, getModePositions); }
```

**Parameters**

- `liveValue: number`: numeric value being displayed, normalized, or transformed.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `initSettingsUI.renderModeMetaState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `renderModeMetaState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderModeMetaState(/* liveValue */);
```

### `initSettingsUI.resetCalibration`

- Full name: `initSettingsUI.resetCalibration`
- Location: `public/modules/ui/settings.ts:114`
- Return type: `void`

**Signature**

```ts
(): void => { resetCalibrationValues(simSettings.gamepadCalibration); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `initSettingsUI.resetCalibration` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `resetCalibration` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetCalibration();
```

### `initSettingsUI.resetDroneChannelsToSafeValues`

- Full name: `initSettingsUI.resetDroneChannelsToSafeValues`
- Location: `public/modules/ui/settings.ts:358`
- Return type: `void`

**Signature**

```ts
(): void => { const drone = drones[currentDroneId]; if (!drone) return; drone.rcChannels[0] = 1500; drone.rcChannels[1] = 1500; drone.rcChannels[2] = 1000; drone.rcChannels[3] = 1500; drone.rcChannels[4] = 1000;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `initSettingsUI.resetDroneChannelsToSafeValues` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `resetDroneChannelsToSafeValues` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetDroneChannelsToSafeValues();
```

### `initSettingsUI.resetObservedState`

- Full name: `initSettingsUI.resetObservedState`
- Location: `public/modules/ui/settings.ts:80`
- Return type: `void`

**Signature**

```ts
(): void => { state.activeGamepadHasChannelData = false; state.observedInputStats = resetObservedInputStats(); lastModePositionsCount = 0; }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `initSettingsUI.resetObservedState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `resetObservedState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetObservedState();
```

### `initSettingsUI.sampleObservedInputs`

- Full name: `initSettingsUI.sampleObservedInputs`
- Location: `public/modules/ui/settings.ts:86`
- Return type: `void`

**Signature**

```ts
(gp: Gamepad): void => { let sampled = false; for (let index = 0; index < gp.axes.length; index += 1) { const rawValue = gp.axes[index]; if (!Number.isFinite(rawValue)) continue; rememberObservedInputValue( state.observedInputStats,
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initSettingsUI.sampleObservedInputs` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `sampleObservedInputs` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sampleObservedInputs(/* ... */);
```

### `initSettingsUI.selectAuxPreset`

- Full name: `initSettingsUI.selectAuxPreset`
- Location: `public/modules/ui/settings.ts:142`
- Return type: `void`

**Signature**

```ts
(key: ActionAuxChannelKey, selectedIndex: number): void => { const ranges = buildRangesFromPositions(getObservedPositions(state.observedInputStats, getMappingRef(key))); const selectedRange = ranges[selectedIndex]; if (!selectedRange) return; setAuxRange(key, selectedRange); renderAuxRangeEditorsState(); saveGamepadSettings(); }
```

**Parameters**

- `key: ActionAuxChannelKey`: logical channel, property, or mode key.
- `selectedIndex: number`: selected preset or option index.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initSettingsUI.selectAuxPreset` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `selectAuxPreset` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
selectAuxPreset(/* key */, /* selectedIndex */);
```

### `initSettingsUI.setAutoStatusState`

- Full name: `initSettingsUI.setAutoStatusState`
- Location: `public/modules/ui/settings.ts:30`
- Return type: `void`

**Signature**

```ts
(mode: 'idle' | 'listening' | 'success', text: string): void => { setAutoStatus(dom, state, mode, text); }
```

**Parameters**

- `mode: 'idle' | 'listening' | 'success'`: input argument of type `'idle' | 'listening' | 'success'`.
- `text: string`: input argument of type `string`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `initSettingsUI.setAutoStatusState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `setAutoStatusState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setAutoStatusState(/* mode */, /* text */);
```

### `initSettingsUI.syncAuxRangeFromControls`

- Full name: `initSettingsUI.syncAuxRangeFromControls`
- Location: `public/modules/ui/settings.ts:151`
- Return type: `void`

**Signature**

```ts
(key: ActionAuxChannelKey, source: 'min' | 'max'): void => { const controls = dom.auxRangeControls[key]; if (!controls.minSlider || !controls.maxSlider) return; let minValue = Number(controls.minSlider.value); let maxValue = Number(controls.maxSlider.value); // Bring the active slider to front
```

**Parameters**

- `key: ActionAuxChannelKey`: logical channel, property, or mode key.
- `source: 'min' | 'max'`: source side of a synchronization/update action.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `initSettingsUI.syncAuxRangeFromControls` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `syncAuxRangeFromControls` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncAuxRangeFromControls(/* key */, /* source */);
```

### `initSettingsUI.syncConnectionState`

- Full name: `initSettingsUI.syncConnectionState`
- Location: `public/modules/ui/settings.ts:219`
- Return type: `void`

**Signature**

```ts
(gamepad: Gamepad | null): void => { const wasConnected = simSettings.gamepadConnected; const previousIndex = state.activeGamepadIndex; const previousId = state.activeGamepadId; simSettings.gamepadConnected = gamepad !== null; state.activeGamepadIndex = gamepad?.index ?? null; state.activeGamepadId = gamepad?.id ?? null; 
```

**Parameters**

- `gamepad: Gamepad | null`: browser `Gamepad` object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `initSettingsUI.syncConnectionState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `syncConnectionState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncConnectionState(/* ... */);
```

### `initSettingsUI.syncSelectWithMappingState`

- Full name: `initSettingsUI.syncSelectWithMappingState`
- Location: `public/modules/ui/settings.ts:66`
- Return type: `void`

**Signature**

```ts
(key: ChannelKey): void => { syncSelectWithMapping(dom, key, getMappingRef); }
```

**Parameters**

- `key: ChannelKey`: logical channel, property, or mode key.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `initSettingsUI.syncSelectWithMappingState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `syncSelectWithMappingState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncSelectWithMappingState(/* key */);
```

### `initSettingsUI.updateCalibrationProgress`

- Full name: `initSettingsUI.updateCalibrationProgress`
- Location: `public/modules/ui/settings.ts:132`
- Return type: `void`

**Signature**

```ts
(gp: Gamepad): void => { if (!state.isCalibrating) return; sampleCalibration(simSettings.gamepadCalibration, gp); if (Date.now() - state.calibrationStartedAt >= CALIBRATION_DURATION_MS) { finishCalibration(); } renderCalibrationStateView();
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `initSettingsUI.updateCalibrationProgress` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `updateCalibrationProgress` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateCalibrationProgress(/* ... */);
```

### `initSettingsUI.updateDroneChannels`

- Full name: `initSettingsUI.updateDroneChannels`
- Location: `public/modules/ui/settings.ts:298`
- Return type: `void`

**Signature**

```ts
(gp: Gamepad): void => { const drone = drones[currentDroneId]; if (!drone) return; sampleObservedInputs(gp); // Dynamic mode range detection const modeRef = getMappingRef('mode');
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `initSettingsUI.updateDroneChannels` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `updateDroneChannels` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateDroneChannels(/* ... */);
```

### `initSettingsUI.updateGamepadState`

- Full name: `initSettingsUI.updateGamepadState`
- Location: `public/modules/ui/settings.ts:416`
- Return type: `void`

**Signature**

```ts
(): void => { const activeGamepad = findCurrentActiveGamepad(); const connectionChanged = (activeGamepad?.index ?? null) !== state.activeGamepadIndex || simSettings.gamepadConnected !== (activeGamepad !== null); if (connectionChanged) { syncConnectionState(activeGamepad);
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `initSettingsUI.updateGamepadState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `updateGamepadState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateGamepadState();
```

## Module `public/modules/ui/settings/auto-detect.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `detectAutoInput`

- Full name: `detectAutoInput`
- Location: `public/modules/ui/settings/auto-detect.ts:50`
- Return type: `void`

**Signature**

```ts
export function detectAutoInput(params: { state: SettingsRuntimeState; gp: Gamepad; setMappingRef: (channel: ChannelKey, ref: GamepadInputRef) => void; syncSelectWithMapping: (channel: ChannelKey) => void; setAutoStatus: (mode: 'idle' | 'listening' | 'success', text: string) => void; }): void { const { state, gp, setMappingRef, syncSelectWithMapping, setAutoStatus } = params;
```

**Parameters**

- `params: {
    state: SettingsRuntimeState;
    gp: Gamepad;
    setMappingRef: (channel: ChannelKey, ref: GamepadInputRef) => void;
    syncSelectWithMapping: (channel: ChannelKey) => void;
    setAutoStatus: (mode: 'idle' | 'listening' | 'success', text: string) => void;
}`: aggregated call parameters object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Detects `detectAutoInput` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/auto-detect.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/auto-detect.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `detectAutoInput` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
detectAutoInput(/* ... */);
```

### `getChannelLabel`

- Full name: `getChannelLabel`
- Location: `public/modules/ui/settings/auto-detect.ts:125`
- Return type: `string`

**Signature**

```ts
function getChannelLabel(key: ChannelKey): string { switch (key) { case 'roll': return 'Roll'; case 'pitch': return 'Pitch'; case 'throttle': return 'Throttle';
```

**Parameters**

- `key: ChannelKey`: logical channel, property, or mode key.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Returns `getChannelLabel` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/auto-detect.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/auto-detect.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getChannelLabel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getChannelLabel(/* key */);
```

### `startAutoDetection`

- Full name: `startAutoDetection`
- Location: `public/modules/ui/settings/auto-detect.ts:16`
- Return type: `void`

**Signature**

```ts
export function startAutoDetection(params: { state: SettingsRuntimeState; channel: ChannelKey; findActiveGamepad: () => Gamepad | null; hasChannelData: () => boolean; setAutoStatus: (mode: 'idle' | 'listening' | 'success', text: string) => void; }): void { const { state, channel, findActiveGamepad, hasChannelData, setAutoStatus } = params;
```

**Parameters**

- `params: {
    state: SettingsRuntimeState;
    channel: ChannelKey;
    findActiveGamepad: () => Gamepad | null;
    hasChannelData: () => boolean;
    setAutoStatus: (mode: 'idle' | 'listening' | 'success', text: string) => void;
}`: aggregated call parameters object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Starts `startAutoDetection` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/auto-detect.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/auto-detect.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `startAutoDetection` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
startAutoDetection(/* ... */);
```

### `stopAutoDetection`

- Full name: `stopAutoDetection`
- Location: `public/modules/ui/settings/auto-detect.ts:6`
- Return type: `void`

**Signature**

```ts
export function stopAutoDetection( state: SettingsRuntimeState, setAutoStatus: (mode: 'idle' | 'success', text: string) => void, mode: 'idle' | 'success', text = 'Нажмите AUTO и подвигайте нужный стик или тумблер.' ): void { state.autoDetectState = null; setAutoStatus(mode, text);
```

**Parameters**

- `state: SettingsRuntimeState`: mutable runtime state for the current subsystem.
- `setAutoStatus: (mode: 'idle' | 'success', text: string) => void`: input argument of type `(mode: 'idle' | 'success', text: string) => void`.
- `mode: 'idle' | 'success'`: input argument of type `'idle' | 'success'`.
- `text?: string`: input argument of type `string`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Stops or finalizes `stopAutoDetection` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/auto-detect.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/auto-detect.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `stopAutoDetection` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
stopAutoDetection(/* ... */, /* setAutoStatus */, /* mode */, /* text */);
```

## Module `public/modules/ui/settings/bindings.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `bindGamepadSettingsControls`

- Full name: `bindGamepadSettingsControls`
- Location: `public/modules/ui/settings/bindings.ts:56`
- Return type: `void`

**Signature**

```ts
export function bindGamepadSettingsControls(params: { dom: SettingsDomRefs; state: SettingsRuntimeState; startAutoDetection: (channel: ChannelKey) => void; findActiveGamepad: () => Gamepad | null; beginCalibration: (gp: Gamepad) => void; finishCalibration: () => void; resetCalibration: () => void;
```

**Parameters**

- `params: {
    dom: SettingsDomRefs;
    state: SettingsRuntimeState;
    startAutoDetection: (channel: ChannelKey) => void;
    findActiveGamepad: () => Gamepad | null;
    beginCalibration: (gp: Gamepad) => void;
    finishCalibration: () => void;
    resetCalibration: () => void;
    renderCalibrationState: () => void;
    applyStickMode: () => void;
    syncAuxRangeFromControls: (key: ActionAuxChannelKey, source: 'min' | 'max') => void;
    selectAuxPreset: (key: ActionAuxChannelKey, selectedIndex: number) => void;
}`: aggregated call parameters object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `bindGamepadSettingsControls` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/bindings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/bindings.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `bindGamepadSettingsControls` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
bindGamepadSettingsControls(/* ... */);
```

### `bindGeneralSettingsControls`

- Full name: `bindGeneralSettingsControls`
- Location: `public/modules/ui/settings/bindings.ts:8`
- Return type: `void`

**Signature**

```ts
export function bindGeneralSettingsControls(dom: SettingsDomRefs): void { if (dom.showTracerEl) { dom.showTracerEl.checked = simSettings.showTracer; dom.showTracerEl.addEventListener('change', () => { simSettings.showTracer = dom.showTracerEl?.checked ?? false; }); } 
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `bindGeneralSettingsControls` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/bindings.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/bindings.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `bindGeneralSettingsControls` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
bindGeneralSettingsControls(/* ... */);
```

## Module `public/modules/ui/settings/calibration.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `beginCalibration`

- Full name: `beginCalibration`
- Location: `public/modules/ui/settings/calibration.ts:17`
- Return type: `number`

**Signature**

```ts
export function beginCalibration(calibration: CalibrationState, gp: Gamepad): number { calibration.min.fill(Number.POSITIVE_INFINITY); calibration.max.fill(Number.NEGATIVE_INFINITY); calibration.center.fill(0); const axisCount = Math.min(calibration.center.length, gp.axes.length); for (let i = 0; i < axisCount; i += 1) { const axisValue = Number.isFinite(gp.axes[i]) ? gp.axes[i] : 0; calibration.center[i] = axisValue;
```

**Parameters**

- `calibration: CalibrationState`: input argument of type `CalibrationState`.
- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Starts `beginCalibration` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/calibration.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/calibration.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `beginCalibration` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
beginCalibration(/* calibration */, /* ... */);
```

### `finishCalibration`

- Full name: `finishCalibration`
- Location: `public/modules/ui/settings/calibration.ts:32`
- Return type: `void`

**Signature**

```ts
export function finishCalibration(calibration: CalibrationState): void { let calibratedAxes = 0; for (let i = 0; i < calibration.min.length; i += 1) { const min = calibration.min[i]; const max = calibration.max[i]; const center = calibration.center[i]; if (!Number.isFinite(min) || !Number.isFinite(max) || max - min < 0.05) { calibration.min[i] = -1;
```

**Parameters**

- `calibration: CalibrationState`: input argument of type `CalibrationState`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Stops or finalizes `finishCalibration` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/calibration.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/calibration.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `finishCalibration` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
finishCalibration(/* calibration */);
```

### `normalizeCenteredAxis`

- Full name: `normalizeCenteredAxis`
- Location: `public/modules/ui/settings/calibration.ts:62`
- Return type: `number`

**Signature**

```ts
export function normalizeCenteredAxis(calibration: CalibrationState, rawValue: number, axisIndex: number): number { if (!calibration.isCalibrated) { const unclamped = clamp(rawValue, -1, 1); return Math.abs(unclamped) < CENTER_DEADBAND ? 0 : unclamped; } const min = calibration.min[axisIndex]; const max = calibration.max[axisIndex];
```

**Parameters**

- `calibration: CalibrationState`: input argument of type `CalibrationState`.
- `rawValue: number`: input argument of type `number`.
- `axisIndex: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Normalizes `normalizeCenteredAxis` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/calibration.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/calibration.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `normalizeCenteredAxis` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
normalizeCenteredAxis(/* calibration */, /* rawValue */, /* axisIndex */);
```

### `normalizeThrottleAxis`

- Full name: `normalizeThrottleAxis`
- Location: `public/modules/ui/settings/calibration.ts:88`
- Return type: `number`

**Signature**

```ts
export function normalizeThrottleAxis(calibration: CalibrationState, rawValue: number, axisIndex: number): number { if (!calibration.isCalibrated) { const fallback = clamp((clamp(rawValue, -1, 1) + 1) / 2, 0, 1); if (fallback < THROTTLE_IDLE_DEADBAND) return 0; if (fallback > 1 - THROTTLE_IDLE_DEADBAND) return 1; return fallback; } 
```

**Parameters**

- `calibration: CalibrationState`: input argument of type `CalibrationState`.
- `rawValue: number`: input argument of type `number`.
- `axisIndex: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Normalizes `normalizeThrottleAxis` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/calibration.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/calibration.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `normalizeThrottleAxis` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
normalizeThrottleAxis(/* calibration */, /* rawValue */, /* axisIndex */);
```

### `resetCalibration`

- Full name: `resetCalibration`
- Location: `public/modules/ui/settings/calibration.ts:10`
- Return type: `void`

**Signature**

```ts
export function resetCalibration(calibration: CalibrationState): void { calibration.min.fill(-1); calibration.max.fill(1); calibration.center.fill(0); calibration.isCalibrated = false; }
```

**Parameters**

- `calibration: CalibrationState`: input argument of type `CalibrationState`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `resetCalibration` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/calibration.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/calibration.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `resetCalibration` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetCalibration(/* calibration */);
```

### `sampleCalibration`

- Full name: `sampleCalibration`
- Location: `public/modules/ui/settings/calibration.ts:52`
- Return type: `void`

**Signature**

```ts
export function sampleCalibration(calibration: CalibrationState, gp: Gamepad): void { const axisCount = Math.min(calibration.min.length, gp.axes.length); for (let i = 0; i < axisCount; i += 1) { const axisValue = gp.axes[i]; if (!Number.isFinite(axisValue)) continue; calibration.min[i] = Math.min(calibration.min[i], axisValue); calibration.max[i] = Math.max(calibration.max[i], axisValue); }
```

**Parameters**

- `calibration: CalibrationState`: input argument of type `CalibrationState`.
- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `sampleCalibration` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/calibration.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/calibration.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `sampleCalibration` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sampleCalibration(/* calibration */, /* ... */);
```

## Module `public/modules/ui/settings/channel-ranges.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `applyModeRangesFromObserved`

- Full name: `applyModeRangesFromObserved`
- Location: `public/modules/ui/settings/channel-ranges.ts:34`
- Return type: `void`

**Signature**

```ts
export function applyModeRangesFromObserved( observedInputStats: Map<GamepadInputRef, ObservedInputStats>, modeRef: GamepadInputRef ): void { const positions = getModeObservedPositions(observedInputStats, modeRef); const ranges = buildRangesFromPositions(positions); if (ranges.length < 2) return; 
```

**Parameters**

- `observedInputStats: Map<GamepadInputRef, ObservedInputStats>`: input argument of type `Map<GamepadInputRef, ObservedInputStats>`.
- `modeRef: GamepadInputRef`: input argument of type `GamepadInputRef`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Applies `applyModeRangesFromObserved` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/channel-ranges.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/channel-ranges.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `applyModeRangesFromObserved` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
applyModeRangesFromObserved(/* observedInputStats */, /* modeRef */);
```

### `getAuxRange`

- Full name: `getAuxRange`
- Location: `public/modules/ui/settings/channel-ranges.ts:6`
- Return type: `AuxChannelRange`

**Signature**

```ts
export function getAuxRange(key: ActionAuxChannelKey): AuxChannelRange { return simSettings.gamepadAuxRanges[key]; }
```

**Parameters**

- `key: ActionAuxChannelKey`: logical channel, property, or mode key.

**Return Value**

- Value of type `AuxChannelRange` consumed by downstream logic.

**Purpose**

- Returns `getAuxRange` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/channel-ranges.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/channel-ranges.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getAuxRange` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getAuxRange(/* key */);
```

### `getModeObservedPositions`

- Full name: `getModeObservedPositions`
- Location: `public/modules/ui/settings/channel-ranges.ts:25`
- Return type: `ObservedInputPosition[]`

**Signature**

```ts
export function getModeObservedPositions( observedInputStats: Map<GamepadInputRef, ObservedInputStats>, modeRef: GamepadInputRef ): ObservedInputPosition[] { const positions = getObservedPositions(observedInputStats, modeRef); if (positions.length <= 3) return positions; return pickRepresentativePositions(positions, 3); }
```

**Parameters**

- `observedInputStats: Map<GamepadInputRef, ObservedInputStats>`: input argument of type `Map<GamepadInputRef, ObservedInputStats>`.
- `modeRef: GamepadInputRef`: input argument of type `GamepadInputRef`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Returns `getModeObservedPositions` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/channel-ranges.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/channel-ranges.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getModeObservedPositions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getModeObservedPositions(/* observedInputStats */, /* modeRef */);
```

### `getObservedStats`

- Full name: `getObservedStats`
- Location: `public/modules/ui/settings/channel-ranges.ts:18`
- Return type: `ObservedInputStats | null`

**Signature**

```ts
export function getObservedStats( observedInputStats: Map<GamepadInputRef, ObservedInputStats>, ref: GamepadInputRef ): ObservedInputStats | null { return observedInputStats.get(ref) ?? null; }
```

**Parameters**

- `observedInputStats: Map<GamepadInputRef, ObservedInputStats>`: input argument of type `Map<GamepadInputRef, ObservedInputStats>`.
- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.

**Return Value**

- Value of type `ObservedInputStats | null` consumed by downstream logic.

**Purpose**

- Returns `getObservedStats` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/channel-ranges.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/channel-ranges.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getObservedStats` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getObservedStats(/* observedInputStats */, /* ref */);
```

### `setAuxRange`

- Full name: `setAuxRange`
- Location: `public/modules/ui/settings/channel-ranges.ts:10`
- Return type: `void`

**Signature**

```ts
export function setAuxRange(key: ActionAuxChannelKey, range: AuxChannelRange): void { simSettings.gamepadAuxRanges[key] = range; }
```

**Parameters**

- `key: ActionAuxChannelKey`: logical channel, property, or mode key.
- `range: AuxChannelRange`: input argument of type `AuxChannelRange`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setAuxRange` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/channel-ranges.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/channel-ranges.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `setAuxRange` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setAuxRange(/* key */, /* range */);
```

### `setModeRange`

- Full name: `setModeRange`
- Location: `public/modules/ui/settings/channel-ranges.ts:14`
- Return type: `void`

**Signature**

```ts
export function setModeRange(key: 'loiter' | 'althold' | 'stabilize', range: AuxChannelRange): void { simSettings.gamepadModeRanges[key] = range; }
```

**Parameters**

- `key: 'loiter' | 'althold' | 'stabilize'`: logical channel, property, or mode key.
- `range: AuxChannelRange`: input argument of type `AuxChannelRange`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setModeRange` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/channel-ranges.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/channel-ranges.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `setModeRange` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setModeRange(/* key */, /* range */);
```

## Module `public/modules/ui/settings/constants.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `axisRef`

- Full name: `axisRef`
- Location: `public/modules/ui/settings/constants.ts:22`
- Return type: `GamepadInputRef`

**Signature**

```ts
(index: number): GamepadInputRef => `a${index}` as GamepadInputRef
```

**Parameters**

- `index: number`: input argument of type `number`.

**Return Value**

- Value of type `GamepadInputRef` consumed by downstream logic.

**Purpose**

- Performs `axisRef` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/constants.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/constants.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `axisRef` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
axisRef(/* index */);
```

### `buttonRef`

- Full name: `buttonRef`
- Location: `public/modules/ui/settings/constants.ts:23`
- Return type: `GamepadInputRef`

**Signature**

```ts
(index: number): GamepadInputRef => `b${index}` as GamepadInputRef
```

**Parameters**

- `index: number`: input argument of type `number`.

**Return Value**

- Value of type `GamepadInputRef` consumed by downstream logic.

**Purpose**

- Performs `buttonRef` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/constants.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/constants.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `buttonRef` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
buttonRef(/* index */);
```

### `clamp`

- Full name: `clamp`
- Location: `public/modules/ui/settings/constants.ts:24`
- Return type: `number`

**Signature**

```ts
(value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))
```

**Parameters**

- `value: number`: numeric value being displayed, normalized, or transformed.
- `min: number`: input argument of type `number`.
- `max: number`: input argument of type `number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `clamp` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/constants.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/constants.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `clamp` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clamp(0, /* min */, /* max */);
```

### `clampRc`

- Full name: `clampRc`
- Location: `public/modules/ui/settings/constants.ts:25`
- Return type: `number`

**Signature**

```ts
(value: number): number => Math.round(clamp(value, 1000, 2000))
```

**Parameters**

- `value: number`: numeric value being displayed, normalized, or transformed.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `clampRc` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/constants.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/constants.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `clampRc` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
clampRc(0);
```

## Module `public/modules/ui/settings/dom.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `collectSettingsDomRefs`

- Full name: `collectSettingsDomRefs`
- Location: `public/modules/ui/settings/dom.ts:40`
- Return type: `SettingsDomRefs`

**Signature**

```ts
export function collectSettingsDomRefs(): SettingsDomRefs { return { showTracerEl: document.getElementById('setting-show-tracer') as HTMLInputElement | null, tracerColorEl: document.getElementById('setting-tracer-color') as HTMLInputElement | null, tracerWidthEl: document.getElementById('setting-tracer-width') as HTMLInputElement | null, tracerShapeEl: document.getElementById('setting-tracer-shape') as HTMLSelectElement | null, showGizmoEl: document.getElementById('setting-show-gizmo') as HTMLInputElement | null, simSpeedEl: document.getElementById('setting-sim-speed') as HTMLInputElement | null,
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `SettingsDomRefs` consumed by downstream logic.

**Purpose**

- Performs `collectSettingsDomRefs` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/dom.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/dom.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `collectSettingsDomRefs` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
collectSettingsDomRefs();
```

## Module `public/modules/ui/settings/mapping.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `applyPrimaryAxisMappingForCurrentMode`

- Full name: `applyPrimaryAxisMappingForCurrentMode`
- Location: `public/modules/ui/settings/mapping.ts:154`
- Return type: `void`

**Signature**

```ts
export function applyPrimaryAxisMappingForCurrentMode(gp: Gamepad): void { const primaryMapping = getRcPrimaryAxisMapping(gp); if (!primaryMapping) return; simSettings.gamepadMapping.roll = primaryMapping.roll; simSettings.gamepadMapping.pitch = primaryMapping.pitch; simSettings.gamepadMapping.throttle = primaryMapping.throttle; simSettings.gamepadMapping.yaw = primaryMapping.yaw; }
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Applies `applyPrimaryAxisMappingForCurrentMode` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `applyPrimaryAxisMappingForCurrentMode` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
applyPrimaryAxisMappingForCurrentMode(/* ... */);
```

### `createAuxOptions`

- Full name: `createAuxOptions`
- Location: `public/modules/ui/settings/mapping.ts:243`
- Return type: `string`

**Signature**

```ts
export function createAuxOptions(gp: Gamepad): string { const options: string[] = []; gp.axes.forEach((_, index) => { const channelLabel = isLikelyRcTransmitter(gp) ? ` / CH${index + 1}` : ''; options.push(`<option value="${axisRef(index)}">A${index}: Axis ${index}${channelLabel}</option>`); }); gp.buttons.forEach((_, index) => { options.push(`<option value="${buttonRef(index)}">B${index}: Button ${index + 1}</option>`);
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Creates `createAuxOptions` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `createAuxOptions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createAuxOptions(/* ... */);
```

### `createAxisOptions`

- Full name: `createAxisOptions`
- Location: `public/modules/ui/settings/mapping.ts:237`
- Return type: `string`

**Signature**

```ts
export function createAxisOptions(gp: Gamepad): string { return gp.axes .map((_, index) => `<option value="${axisRef(index)}">A${index}: Axis ${index}</option>`) .join(''); }
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Creates `createAxisOptions` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `createAxisOptions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createAxisOptions(/* ... */);
```

### `ensureMappingsForGamepad`

- Full name: `ensureMappingsForGamepad`
- Location: `public/modules/ui/settings/mapping.ts:184`
- Return type: `void`

**Signature**

```ts
export function ensureMappingsForGamepad(gp: Gamepad, channels: ChannelKey[]): void { if (hasLegacyPrimaryMapping()) { applyPrimaryAxisMappingForCurrentMode(gp); } for (const key of channels) { const currentRef = getMappingRef(key); if (isAllowedForChannel(key, currentRef) && hasInputRef(gp, currentRef)) continue;
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.
- `channels: ChannelKey[]`: input argument of type `ChannelKey[]`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `ensureMappingsForGamepad` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `ensureMappingsForGamepad` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
ensureMappingsForGamepad(/* ... */, /* channels */);
```

### `findActiveGamepad`

- Full name: `findActiveGamepad`
- Location: `public/modules/ui/settings/mapping.ts:218`
- Return type: `Gamepad | null`

**Signature**

```ts
export function findActiveGamepad(activeGamepadIndex: number | null, activeGamepadId: string | null): Gamepad | null { const connected = getConnectedGamepads(); if (connected.length === 0) return null; if (activeGamepadIndex !== null) { const byIndex = connected.find((gp) => gp.index === activeGamepadIndex); if (byIndex) return byIndex; } if (activeGamepadId) {
```

**Parameters**

- `activeGamepadIndex: number | null`: input argument of type `number | null`.
- `activeGamepadId: string | null`: input argument of type `string | null`.

**Return Value**

- Value of type `Gamepad | null` consumed by downstream logic.

**Purpose**

- Finds and returns `findActiveGamepad` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `findActiveGamepad` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
findActiveGamepad(/* activeGamepadIndex */, 'drone_1');
```

### `getConnectedGamepads`

- Full name: `getConnectedGamepads`
- Location: `public/modules/ui/settings/mapping.ts:213`
- Return type: `Gamepad[]`

**Signature**

```ts
export function getConnectedGamepads(): Gamepad[] { if (typeof navigator.getGamepads !== 'function') return []; return Array.from(navigator.getGamepads()).filter((gp): gp is Gamepad => gp !== null); }
```

**Parameters**

- No input parameters.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Returns `getConnectedGamepads` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getConnectedGamepads` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getConnectedGamepads();
```

### `getDefaultChannelValue`

- Full name: `getDefaultChannelValue`
- Location: `public/modules/ui/settings/mapping.ts:21`
- Return type: `number`

**Signature**

```ts
export function getDefaultChannelValue(key: ChannelKey): number { return key === 'throttle' || AUXILIARY_CHANNELS.includes(key as any) ? 1000 : 1500; }
```

**Parameters**

- `key: ChannelKey`: logical channel, property, or mode key.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `getDefaultChannelValue` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getDefaultChannelValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getDefaultChannelValue(/* key */);
```

### `getFallbackMapping`

- Full name: `getFallbackMapping`
- Location: `public/modules/ui/settings/mapping.ts:163`
- Return type: `GamepadInputRef | null`

**Signature**

```ts
export function getFallbackMapping(gp: Gamepad, key: ChannelKey): GamepadInputRef | null { const primaryMapping = getRcPrimaryAxisMapping(gp); const auxRefs = getPreferredAuxRefs(gp); switch (key) { case 'roll': return primaryMapping?.roll ?? null; case 'pitch': return primaryMapping?.pitch ?? null;
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.
- `key: ChannelKey`: logical channel, property, or mode key.

**Return Value**

- Value of type `GamepadInputRef | null` consumed by downstream logic.

**Purpose**

- Returns `getFallbackMapping` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getFallbackMapping` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getFallbackMapping(/* ... */, /* key */);
```

### `getGamepadName`

- Full name: `getGamepadName`
- Location: `public/modules/ui/settings/mapping.ts:232`
- Return type: `string`

**Signature**

```ts
export function getGamepadName(gp: Gamepad): string { const trimmed = gp.id.split('(')[0].trim(); return trimmed || `Gamepad ${gp.index + 1}`; }
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Returns `getGamepadName` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getGamepadName` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getGamepadName(/* ... */);
```

### `getMappingRef`

- Full name: `getMappingRef`
- Location: `public/modules/ui/settings/mapping.ts:25`
- Return type: `GamepadInputRef`

**Signature**

```ts
export function getMappingRef(key: ChannelKey): GamepadInputRef { switch (key) { case 'roll': return simSettings.gamepadMapping.roll; case 'pitch': return simSettings.gamepadMapping.pitch; case 'throttle': return simSettings.gamepadMapping.throttle;
```

**Parameters**

- `key: ChannelKey`: logical channel, property, or mode key.

**Return Value**

- Value of type `GamepadInputRef` consumed by downstream logic.

**Purpose**

- Returns `getMappingRef` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getMappingRef` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getMappingRef(/* key */);
```

### `getModePrimaryAxisIndexes`

- Full name: `getModePrimaryAxisIndexes`
- Location: `public/modules/ui/settings/mapping.ts:92`
- Return type: `Record<PrimaryChannelKey, number>`

**Signature**

```ts
function getModePrimaryAxisIndexes(mode: StickMode): Record<PrimaryChannelKey, number> { switch (mode) { case 1: return { roll: 2, pitch: 1, throttle: 3, yaw: 0 }; case 2: return { roll: 2, pitch: 3, throttle: 1, yaw: 0 }; case 3: return { roll: 0, pitch: 1, throttle: 3, yaw: 2 };
```

**Parameters**

- `mode: StickMode`: input argument of type `StickMode`.

**Return Value**

- Structured object with computed fields or configuration data.

**Purpose**

- Returns `getModePrimaryAxisIndexes` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getModePrimaryAxisIndexes` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getModePrimaryAxisIndexes(/* mode */);
```

### `getPreferredAuxRefs`

- Full name: `getPreferredAuxRefs`
- Location: `public/modules/ui/settings/mapping.ts:127`
- Return type: `GamepadInputRef[]`

**Signature**

```ts
function getPreferredAuxRefs(gp: Gamepad): GamepadInputRef[] { const primaryMapping = getRcPrimaryAxisMapping(gp); const usedPrimaryRefs = new Set<GamepadInputRef>(primaryMapping ? Object.values(primaryMapping) : []); const refs: GamepadInputRef[] = []; const pushIfUnused = (ref: GamepadInputRef) => { if (usedPrimaryRefs.has(ref) || refs.includes(ref) || !hasInputRef(gp, ref)) return; refs.push(ref);
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Returns `getPreferredAuxRefs` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getPreferredAuxRefs` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getPreferredAuxRefs(/* ... */);
```

### `getPreferredAuxRefs.pushIfUnused`

- Full name: `getPreferredAuxRefs.pushIfUnused`
- Location: `public/modules/ui/settings/mapping.ts:132`
- Return type: `void`

**Signature**

```ts
(ref: GamepadInputRef) => { if (usedPrimaryRefs.has(ref) || refs.includes(ref) || !hasInputRef(gp, ref)) return; refs.push(ref); }
```

**Parameters**

- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `getPreferredAuxRefs.pushIfUnused` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `pushIfUnused` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
pushIfUnused(/* ref */);
```

### `getRcPrimaryAxisMapping`

- Full name: `getRcPrimaryAxisMapping`
- Location: `public/modules/ui/settings/mapping.ts:105`
- Return type: `Record<PrimaryChannelKey, GamepadInputRef> | null`

**Signature**

```ts
function getRcPrimaryAxisMapping(gp: Gamepad): Record<PrimaryChannelKey, GamepadInputRef> | null { if (gp.axes.length === 0) return null; const hasFourAxes = gp.axes.length >= 4; if (hasFourAxes) { const indexes = getModePrimaryAxisIndexes(simSettings.gamepadStickMode); return { roll: axisRef(indexes.roll),
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- Structured object with computed fields or configuration data.

**Purpose**

- Returns `getRcPrimaryAxisMapping` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getRcPrimaryAxisMapping` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getRcPrimaryAxisMapping(/* ... */);
```

### `hasInputRef`

- Full name: `hasInputRef`
- Location: `public/modules/ui/settings/mapping.ts:70`
- Return type: `boolean`

**Signature**

```ts
export function hasInputRef(gp: Gamepad, ref: GamepadInputRef): boolean { const inputIndex = Number(ref.slice(1)); return ref.startsWith('a') ? inputIndex < gp.axes.length : inputIndex < gp.buttons.length; }
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.
- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks for `hasInputRef` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `hasInputRef` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
hasInputRef(/* ... */, /* ref */);
```

### `hasLegacyPrimaryMapping`

- Full name: `hasLegacyPrimaryMapping`
- Location: `public/modules/ui/settings/mapping.ts:85`
- Return type: `boolean`

**Signature**

```ts
function hasLegacyPrimaryMapping(): boolean { return simSettings.gamepadMapping.roll === 'a0' && simSettings.gamepadMapping.pitch === 'a1' && simSettings.gamepadMapping.throttle === 'a2' && simSettings.gamepadMapping.yaw === 'a3'; }
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks for `hasLegacyPrimaryMapping` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `hasLegacyPrimaryMapping` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
hasLegacyPrimaryMapping();
```

### `isAllowedForChannel`

- Full name: `isAllowedForChannel`
- Location: `public/modules/ui/settings/mapping.ts:75`
- Return type: `boolean`

**Signature**

```ts
export function isAllowedForChannel(key: ChannelKey, ref: GamepadInputRef): boolean { if (PRIMARY_CHANNELS.includes(key as PrimaryChannelKey)) return ref.startsWith('a'); return true; }
```

**Parameters**

- `key: ChannelKey`: logical channel, property, or mode key.
- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isAllowedForChannel` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `isAllowedForChannel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isAllowedForChannel(/* key */, /* ref */);
```

### `isLikelyRcTransmitter`

- Full name: `isLikelyRcTransmitter`
- Location: `public/modules/ui/settings/mapping.ts:80`
- Return type: `boolean`

**Signature**

```ts
function isLikelyRcTransmitter(gp: Gamepad): boolean { const id = gp.id.toLowerCase(); return RC_TRANSMITTER_KEYWORDS.some((keyword) => id.includes(keyword)); }
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isLikelyRcTransmitter` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `isLikelyRcTransmitter` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isLikelyRcTransmitter(/* ... */);
```

### `readInputRcValue`

- Full name: `readInputRcValue`
- Location: `public/modules/ui/settings/mapping.ts:197`
- Return type: `number`

**Signature**

```ts
export function readInputRcValue( gp: Gamepad, ref: GamepadInputRef, normalizeCenteredAxis: (rawValue: number, axisIndex: number) => number ): number { const inputIndex = Number(ref.slice(1)); if (ref.startsWith('a')) { const rawValue = gp.axes[inputIndex] ?? 0;
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.
- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.
- `normalizeCenteredAxis: (rawValue: number, axisIndex: number) => number`: input argument of type `(rawValue: number, axisIndex: number) => number`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Reads `readInputRcValue` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `readInputRcValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
readInputRcValue(/* ... */, /* ref */, /* normalizeCenteredAxis */);
```

### `setMappingRef`

- Full name: `setMappingRef`
- Location: `public/modules/ui/settings/mapping.ts:44`
- Return type: `void`

**Signature**

```ts
export function setMappingRef(key: ChannelKey, ref: GamepadInputRef): void { switch (key) { case 'roll': simSettings.gamepadMapping.roll = ref; break; case 'pitch': simSettings.gamepadMapping.pitch = ref; break;
```

**Parameters**

- `key: ChannelKey`: logical channel, property, or mode key.
- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setMappingRef` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/mapping.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/mapping.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `setMappingRef` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setMappingRef(/* key */, /* ref */);
```

## Module `public/modules/ui/settings/observed-inputs.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `buildRangesFromPositions`

- Full name: `buildRangesFromPositions`
- Location: `public/modules/ui/settings/observed-inputs.ts:120`
- Return type: `{ min: number; max: number; center: number; }[]`

**Signature**

```ts
export function buildRangesFromPositions(positions: ObservedInputPosition[]) { if (positions.length === 0) return []; return positions.map((position, index) => { const prev = positions[index - 1]; const next = positions[index + 1]; const min = prev ? Math.round((prev.centerRc + position.centerRc) / 2) : Math.max(1000, position.minRc - Math.max(20, Math.round((position.maxRc - position.minRc) / 2)));
```

**Parameters**

- `positions: ObservedInputPosition[]`: input argument of type `ObservedInputPosition[]`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Creates `buildRangesFromPositions` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/observed-inputs.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/observed-inputs.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `buildRangesFromPositions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
buildRangesFromPositions(/* positions */);
```

### `findClosestRangeByCenter`

- Full name: `findClosestRangeByCenter`
- Location: `public/modules/ui/settings/observed-inputs.ts:139`
- Return type: `{ min: number; max: number; center?: number; }`

**Signature**

```ts
export function findClosestRangeByCenter( ranges: Array<{ min: number; max: number; center?: number }>, center?: number ) { if (!ranges.length || center === undefined) return null; let best: { min: number; max: number; center?: number } | null = null; let bestDistance = Number.POSITIVE_INFINITY; for (const range of ranges) {
```

**Parameters**

- `ranges: Array<{ min: number; max: number; center?: number }>`: input argument of type `Array<{ min: number; max: number; center?: number }>`.
- `center?: number`: input argument of type `number`.

**Return Value**

- Structured object with computed fields or configuration data.

**Purpose**

- Finds and returns `findClosestRangeByCenter` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/observed-inputs.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/observed-inputs.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `findClosestRangeByCenter` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
findClosestRangeByCenter(/* ranges */, /* center */);
```

### `getObservedPositions`

- Full name: `getObservedPositions`
- Location: `public/modules/ui/settings/observed-inputs.ts:62`
- Return type: `ObservedInputPosition[]`

**Signature**

```ts
export function getObservedPositions( observedInputStats: Map<GamepadInputRef, ObservedInputStats>, ref: GamepadInputRef ): ObservedInputPosition[] { const stats = observedInputStats.get(ref) ?? null; if (!stats) return []; const stable = stats.positions.filter((position) => position.samples >= MIN_POSITION_SAMPLES);
```

**Parameters**

- `observedInputStats: Map<GamepadInputRef, ObservedInputStats>`: input argument of type `Map<GamepadInputRef, ObservedInputStats>`.
- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Returns `getObservedPositions` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/observed-inputs.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/observed-inputs.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getObservedPositions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getObservedPositions(/* observedInputStats */, /* ref */);
```

### `mergeObservedPositions`

- Full name: `mergeObservedPositions`
- Location: `public/modules/ui/settings/observed-inputs.ts:157`
- Return type: `ObservedInputPosition[]`

**Signature**

```ts
function mergeObservedPositions(positions: ObservedInputPosition[]): ObservedInputPosition[] { if (positions.length <= 1) return [...positions]; const sorted = [...positions].sort((a, b) => a.centerRc - b.centerRc); const merged: ObservedInputPosition[] = []; for (const position of sorted) { const previous = merged[merged.length - 1];
```

**Parameters**

- `positions: ObservedInputPosition[]`: input argument of type `ObservedInputPosition[]`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Performs `mergeObservedPositions` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/observed-inputs.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/observed-inputs.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `mergeObservedPositions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
mergeObservedPositions(/* positions */);
```

### `pickRepresentativePositions`

- Full name: `pickRepresentativePositions`
- Location: `public/modules/ui/settings/observed-inputs.ts:85`
- Return type: `ObservedInputPosition[]`

**Signature**

```ts
export function pickRepresentativePositions( positions: ObservedInputPosition[], maxPositions: number ): ObservedInputPosition[] { if (positions.length <= maxPositions) return [...positions]; if (maxPositions <= 1) return [positions[0]]; const sorted = [...positions].sort((a, b) => a.centerRc - b.centerRc);
```

**Parameters**

- `positions: ObservedInputPosition[]`: input argument of type `ObservedInputPosition[]`.
- `maxPositions: number`: input argument of type `number`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Performs `pickRepresentativePositions` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/observed-inputs.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/observed-inputs.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `pickRepresentativePositions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
pickRepresentativePositions(/* positions */, /* maxPositions */);
```

### `rememberObservedInputValue`

- Full name: `rememberObservedInputValue`
- Location: `public/modules/ui/settings/observed-inputs.ts:9`
- Return type: `void`

**Signature**

```ts
export function rememberObservedInputValue( observedInputStats: Map<GamepadInputRef, ObservedInputStats>, ref: GamepadInputRef, rcValue: number ): void { const current = observedInputStats.get(ref); if (!current) { observedInputStats.set(ref, {
```

**Parameters**

- `observedInputStats: Map<GamepadInputRef, ObservedInputStats>`: input argument of type `Map<GamepadInputRef, ObservedInputStats>`.
- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.
- `rcValue: number`: input argument of type `number`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `rememberObservedInputValue` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/observed-inputs.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/observed-inputs.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `rememberObservedInputValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
rememberObservedInputValue(/* observedInputStats */, /* ref */, /* rcValue */);
```

### `resetObservedInputStats`

- Full name: `resetObservedInputStats`
- Location: `public/modules/ui/settings/observed-inputs.ts:5`
- Return type: `Map<GamepadInputRef, ObservedInputStats>`

**Signature**

```ts
export function resetObservedInputStats() { return new Map<GamepadInputRef, ObservedInputStats>(); }
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Map<GamepadInputRef, ObservedInputStats>` consumed by downstream logic.

**Purpose**

- Resets `resetObservedInputStats` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/observed-inputs.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/observed-inputs.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `resetObservedInputStats` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetObservedInputStats();
```

## Module `public/modules/ui/settings/rendering.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `getChannelLabel`

- Full name: `getChannelLabel`
- Location: `public/modules/ui/settings/rendering.ts:44`
- Return type: `string`

**Signature**

```ts
export function getChannelLabel(key: ChannelKey): string { switch (key) { case 'roll': return 'Roll'; case 'pitch': return 'Pitch'; case 'throttle': return 'Throttle';
```

**Parameters**

- `key: ChannelKey`: logical channel, property, or mode key.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Returns `getChannelLabel` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getChannelLabel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getChannelLabel(/* key */);
```

### `renderAutoButtons`

- Full name: `renderAutoButtons`
- Location: `public/modules/ui/settings/rendering.ts:21`
- Return type: `void`

**Signature**

```ts
export function renderAutoButtons(dom: SettingsDomRefs, state: SettingsRuntimeState, allowAssignment: boolean): void { for (const key of ALL_CHANNELS) { const button = dom.autoButtons[key]; if (!button) continue; const listening = state.autoDetectState?.channel === key; button.textContent = listening ? 'ЖДУ' : 'AUTO'; button.classList.toggle('is-listening', listening); button.disabled = !allowAssignment;
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.
- `state: SettingsRuntimeState`: mutable runtime state for the current subsystem.
- `allowAssignment: boolean`: input argument of type `boolean`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderAutoButtons` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderAutoButtons` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderAutoButtons(/* ... */, /* ... */, /* allowAssignment */);
```

### `renderAutoStatus`

- Full name: `renderAutoStatus`
- Location: `public/modules/ui/settings/rendering.ts:14`
- Return type: `void`

**Signature**

```ts
export function renderAutoStatus(dom: SettingsDomRefs, state: SettingsRuntimeState): void { if (!dom.autoStatusEl) return; dom.autoStatusEl.textContent = state.autoStatusText; dom.autoStatusEl.classList.toggle('is-listening', state.autoStatusMode === 'listening'); dom.autoStatusEl.classList.toggle('is-success', state.autoStatusMode === 'success'); }
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.
- `state: SettingsRuntimeState`: mutable runtime state for the current subsystem.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderAutoStatus` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderAutoStatus` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderAutoStatus(/* ... */, /* ... */);
```

### `renderAuxRangeEditor`

- Full name: `renderAuxRangeEditor`
- Location: `public/modules/ui/settings/rendering.ts:175`
- Return type: `void`

**Signature**

```ts
export function renderAuxRangeEditor(params: { dom: SettingsDomRefs; state: SettingsRuntimeState; key: ActionAuxChannelKey; liveValue: number; getMappingRef: (key: ChannelKey) => GamepadInputRef; getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange; getDefaultChannelValue: (key: ChannelKey) => number;
```

**Parameters**

- `params: {
    dom: SettingsDomRefs;
    state: SettingsRuntimeState;
    key: ActionAuxChannelKey;
    liveValue: number;
    getMappingRef: (key: ChannelKey) => GamepadInputRef;
    getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange;
    getDefaultChannelValue: (key: ChannelKey) => number;
    getObservedStats: (ref: GamepadInputRef) => ObservedInputStats | null;
}`: aggregated call parameters object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderAuxRangeEditor` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderAuxRangeEditor` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderAuxRangeEditor(/* ... */);
```

### `renderAuxRangeEditors`

- Full name: `renderAuxRangeEditors`
- Location: `public/modules/ui/settings/rendering.ts:231`
- Return type: `void`

**Signature**

```ts
export function renderAuxRangeEditors(params: { dom: SettingsDomRefs; state: SettingsRuntimeState; getMappingRef: (key: ChannelKey) => GamepadInputRef; getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange; getDefaultChannelValue: (key: ChannelKey) => number; getObservedStats: (ref: GamepadInputRef) => ObservedInputStats | null; }): void {
```

**Parameters**

- `params: {
    dom: SettingsDomRefs;
    state: SettingsRuntimeState;
    getMappingRef: (key: ChannelKey) => GamepadInputRef;
    getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange;
    getDefaultChannelValue: (key: ChannelKey) => number;
    getObservedStats: (ref: GamepadInputRef) => ObservedInputStats | null;
}`: aggregated call parameters object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderAuxRangeEditors` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderAuxRangeEditors` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderAuxRangeEditors(/* ... */);
```

### `renderAuxRangePresetOptions`

- Full name: `renderAuxRangePresetOptions`
- Location: `public/modules/ui/settings/rendering.ts:138`
- Return type: `void`

**Signature**

```ts
export function renderAuxRangePresetOptions(params: { dom: SettingsDomRefs; state: SettingsRuntimeState; key: ActionAuxChannelKey; getMappingRef: (key: ChannelKey) => GamepadInputRef; getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange; }): void { const { dom, state, key, getMappingRef, getAuxRange } = params;
```

**Parameters**

- `params: {
    dom: SettingsDomRefs;
    state: SettingsRuntimeState;
    key: ActionAuxChannelKey;
    getMappingRef: (key: ChannelKey) => GamepadInputRef;
    getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange;
}`: aggregated call parameters object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderAuxRangePresetOptions` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderAuxRangePresetOptions` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderAuxRangePresetOptions(/* ... */);
```

### `renderCalibrationState`

- Full name: `renderCalibrationState`
- Location: `public/modules/ui/settings/rendering.ts:296`
- Return type: `void`

**Signature**

```ts
export function renderCalibrationState(dom: SettingsDomRefs, state: SettingsRuntimeState): void { if (dom.gpBtnCalibrate) { const remainingSeconds = state.isCalibrating ? Math.max(1, Math.ceil((CALIBRATION_DURATION_MS - (Date.now() - state.calibrationStartedAt)) / 1000)) : 0; dom.gpBtnCalibrate.textContent = state.isCalibrating ? `КАЛ. ${remainingSeconds}с` : 'КАЛИБРОВКА'; dom.gpBtnCalibrate.style.color = state.isCalibrating ? '#f87171' : ''; dom.gpBtnCalibrate.disabled = !simSettings.gamepadConnected;
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.
- `state: SettingsRuntimeState`: mutable runtime state for the current subsystem.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderCalibrationState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderCalibrationState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderCalibrationState(/* ... */, /* ... */);
```

### `renderChannelDataState`

- Full name: `renderChannelDataState`
- Location: `public/modules/ui/settings/rendering.ts:77`
- Return type: `void`

**Signature**

```ts
export function renderChannelDataState(dom: SettingsDomRefs, state: SettingsRuntimeState): void { if (!dom.channelDataStatusEl) return; if (!simSettings.gamepadConnected) { dom.channelDataStatusEl.textContent = 'Подключите пульт, чтобы получить значения его каналов и открыть назначение.'; dom.channelDataStatusEl.classList.remove('is-ready'); dom.channelDataStatusEl.classList.add('is-waiting'); return;
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.
- `state: SettingsRuntimeState`: mutable runtime state for the current subsystem.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderChannelDataState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderChannelDataState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderChannelDataState(/* ... */, /* ... */);
```

### `renderChannelDefaults`

- Full name: `renderChannelDefaults`
- Location: `public/modules/ui/settings/rendering.ts:268`
- Return type: `void`

**Signature**

```ts
export function renderChannelDefaults(params: { dom: SettingsDomRefs; state: SettingsRuntimeState; getDefaultChannelValue: (key: ChannelKey) => number; getModePositions: () => ObservedInputPosition[]; getMappingRef: (key: ChannelKey) => GamepadInputRef; getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange; getObservedStats: (ref: GamepadInputRef) => ObservedInputStats | null;
```

**Parameters**

- `params: {
    dom: SettingsDomRefs;
    state: SettingsRuntimeState;
    getDefaultChannelValue: (key: ChannelKey) => number;
    getModePositions: () => ObservedInputPosition[];
    getMappingRef: (key: ChannelKey) => GamepadInputRef;
    getAuxRange: (key: ActionAuxChannelKey) => AuxChannelRange;
    getObservedStats: (ref: GamepadInputRef) => ObservedInputStats | null;
}`: aggregated call parameters object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderChannelDefaults` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderChannelDefaults` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderChannelDefaults(/* ... */);
```

### `renderChannelValue`

- Full name: `renderChannelValue`
- Location: `public/modules/ui/settings/rendering.ts:9`
- Return type: `void`

**Signature**

```ts
export function renderChannelValue(dom: SettingsDomRefs, key: ChannelKey, value: number): void { const el = dom.valueEls[key]; if (el) el.textContent = String(value); }
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.
- `key: ChannelKey`: logical channel, property, or mode key.
- `value: number`: numeric value being displayed, normalized, or transformed.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderChannelValue` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderChannelValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderChannelValue(/* ... */, /* key */, 0);
```

### `renderMappingControlsState`

- Full name: `renderMappingControlsState`
- Location: `public/modules/ui/settings/rendering.ts:99`
- Return type: `void`

**Signature**

```ts
export function renderMappingControlsState(dom: SettingsDomRefs, state: SettingsRuntimeState): void { const allowAssignment = simSettings.gamepadConnected && state.activeGamepadHasChannelData; for (const key of ALL_CHANNELS) { const select = dom.mappingSelects[key]; if (!select) continue; select.disabled = !allowAssignment || select.options.length === 0; } renderAutoButtons(dom, state, allowAssignment);
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.
- `state: SettingsRuntimeState`: mutable runtime state for the current subsystem.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderMappingControlsState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderMappingControlsState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderMappingControlsState(/* ... */, /* ... */);
```

### `renderModeMeta`

- Full name: `renderModeMeta`
- Location: `public/modules/ui/settings/rendering.ts:109`
- Return type: `void`

**Signature**

```ts
export function renderModeMeta( dom: SettingsDomRefs, state: SettingsRuntimeState, liveValue: number, getModePositions: () => ObservedInputPosition[] ): void { if (!dom.modeMetaEl) return; if (!simSettings.gamepadConnected) {
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.
- `state: SettingsRuntimeState`: mutable runtime state for the current subsystem.
- `liveValue: number`: numeric value being displayed, normalized, or transformed.
- `getModePositions: () => ObservedInputPosition[]`: input argument of type `() => ObservedInputPosition[]`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderModeMeta` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderModeMeta` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderModeMeta(/* ... */, /* ... */, /* liveValue */, /* getModePositions */);
```

### `setAutoStatus`

- Full name: `setAutoStatus`
- Location: `public/modules/ui/settings/rendering.ts:32`
- Return type: `void`

**Signature**

```ts
export function setAutoStatus( dom: SettingsDomRefs, state: SettingsRuntimeState, mode: AutoStatusMode, text: string ): void { state.autoStatusMode = mode; state.autoStatusText = text;
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.
- `state: SettingsRuntimeState`: mutable runtime state for the current subsystem.
- `mode: AutoStatusMode`: input argument of type `AutoStatusMode`.
- `text: string`: input argument of type `string`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setAutoStatus` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `setAutoStatus` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setAutoStatus(/* ... */, /* ... */, /* mode */, /* text */);
```

### `syncSelectWithMapping`

- Full name: `syncSelectWithMapping`
- Location: `public/modules/ui/settings/rendering.ts:63`
- Return type: `void`

**Signature**

```ts
export function syncSelectWithMapping( dom: SettingsDomRefs, key: ChannelKey, getMappingRef: (key: ChannelKey) => GamepadInputRef ): void { const select = dom.mappingSelects[key]; if (!select) return; const mappedRef = getMappingRef(key);
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.
- `key: ChannelKey`: logical channel, property, or mode key.
- `getMappingRef: (key: ChannelKey) => GamepadInputRef`: input argument of type `(key: ChannelKey) => GamepadInputRef`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `syncSelectWithMapping` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `syncSelectWithMapping` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncSelectWithMapping(/* ... */, /* key */, /* getMappingRef */);
```

### `toRangePercent`

- Full name: `toRangePercent`
- Location: `public/modules/ui/settings/rendering.ts:310`
- Return type: `number`

**Signature**

```ts
(value: number): number => clamp(((value - 1000) / 1000) * 100, 0, 100)
```

**Parameters**

- `value: number`: numeric value being displayed, normalized, or transformed.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `toRangePercent` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `toRangePercent` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
toRangePercent(0);
```

### `toRangeVisualPercent`

- Full name: `toRangeVisualPercent`
- Location: `public/modules/ui/settings/rendering.ts:312`
- Return type: `number`

**Signature**

```ts
(value: number): number => { const normalizedPercent = toRangePercent(value) / 100; return clamp( RANGE_EDGE_PADDING_PERCENT + normalizedPercent * (100 - RANGE_EDGE_PADDING_PERCENT * 2), RANGE_EDGE_PADDING_PERCENT, 100 - RANGE_EDGE_PADDING_PERCENT ); }
```

**Parameters**

- `value: number`: numeric value being displayed, normalized, or transformed.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Performs `toRangeVisualPercent` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `toRangeVisualPercent` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
toRangeVisualPercent(0);
```

### `updateBar`

- Full name: `updateBar`
- Location: `public/modules/ui/settings/rendering.ts:249`
- Return type: `void`

**Signature**

```ts
export function updateBar(dom: SettingsDomRefs, key: PrimaryChannelKey, value: number): void { const bar = dom.bars[key]; if (!bar) return; if (key === 'throttle') { const percent = clamp((value - 1000) / 10, 0, 100); bar.style.left = '0%'; bar.style.width = `${percent}%`; return;
```

**Parameters**

- `dom: SettingsDomRefs`: bundle of DOM references required by the UI module.
- `key: PrimaryChannelKey`: logical channel, property, or mode key.
- `value: number`: numeric value being displayed, normalized, or transformed.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateBar` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/rendering.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/rendering.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `updateBar` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateBar(/* ... */, /* key */, 0);
```

## Module `public/modules/ui/settings/runtime-state.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `createSettingsRuntimeState`

- Full name: `createSettingsRuntimeState`
- Location: `public/modules/ui/settings/runtime-state.ts:28`
- Return type: `SettingsRuntimeState`

**Signature**

```ts
export function createSettingsRuntimeState(): SettingsRuntimeState { return { isCalibrating: false, calibrationStartedAt: 0, activeGamepadIndex: null, activeGamepadId: null, activeGamepadHasChannelData: false, observedInputStats: new Map<GamepadInputRef, ObservedInputStats>(),
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `SettingsRuntimeState` consumed by downstream logic.

**Purpose**

- Creates `createSettingsRuntimeState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/runtime-state.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/runtime-state.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `createSettingsRuntimeState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
createSettingsRuntimeState();
```

## Module `public/modules/ui/settings/wizard.ts`

Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors.

### `applyAuxResults`

- Full name: `applyAuxResults`
- Location: `public/modules/ui/settings/wizard.ts:676`
- Return type: `void`

**Signature**

```ts
function applyAuxResults() { const modeResult = auxResults.mode; if (modeResult) { const positions = modeResult.positions.length > 3 ? pickRepresentativePositions(modeResult.positions, 3) : modeResult.positions; const ranges = buildRangesFromPositions(positions); if (ranges.length >= 2) {
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Applies `applyAuxResults` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `applyAuxResults` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
applyAuxResults();
```

### `buildSummaryHtml`

- Full name: `buildSummaryHtml`
- Location: `public/modules/ui/settings/wizard.ts:591`
- Return type: `string`

**Signature**

```ts
function buildSummaryHtml(): string { const primaryRows = (['throttle', 'yaw', 'pitch', 'roll'] as PrimaryChannelKey[]) .map((channel) => { const ref = detectedMapping[channel]; const value = ref ? formatRefLabel(ref) : 'не найдено'; return `<div class="gp-wizard-summary-row"><span>${CHANNEL_LABELS[channel]}</span><strong>${value}</strong></div>`; }) .join('');
```

**Parameters**

- No input parameters.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Creates `buildSummaryHtml` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `buildSummaryHtml` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
buildSummaryHtml();
```

### `detectAuxInput`

- Full name: `detectAuxInput`
- Location: `public/modules/ui/settings/wizard.ts:511`
- Return type: `void`

**Signature**

```ts
function detectAuxInput(gp: Gamepad, step: WizardStep) { for (let index = 0; index < gp.axes.length; index += 1) { const ref = axisRef(index); const rawValue = gp.axes[index] ?? 0; const normalized = normalizeCenteredAxis(simSettings.gamepadCalibration, rawValue, index); const rcValue = clampRc(1500 + normalized * 500); rememberObservedInputValue(stepObservedStats, ref, rcValue); rememberSwitchTransition(ref, rcValue);
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.
- `step: WizardStep`: input argument of type `WizardStep`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Detects `detectAuxInput` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `detectAuxInput` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
detectAuxInput(/* ... */, /* step */);
```

### `detectPrimaryAxis`

- Full name: `detectPrimaryAxis`
- Location: `public/modules/ui/settings/wizard.ts:475`
- Return type: `void`

**Signature**

```ts
function detectPrimaryAxis(gp: Gamepad, channel: PrimaryChannelKey) { const usedRefs = getUsedRefs(channel); let bestRef: GamepadInputRef | null = null; let bestScore = Number.NEGATIVE_INFINITY; let bestMaxDelta = 0; for (let index = 0; index < gp.axes.length; index += 1) { const value = gp.axes[index] ?? 0;
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.
- `channel: PrimaryChannelKey`: logical channel, property, or mode key.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Detects `detectPrimaryAxis` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `detectPrimaryAxis` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
detectPrimaryAxis(/* ... */, /* channel */);
```

### `finishWizard`

- Full name: `finishWizard`
- Location: `public/modules/ui/settings/wizard.ts:659`
- Return type: `void`

**Signature**

```ts
function finishWizard() { for (const channel of ['roll', 'pitch', 'throttle', 'yaw', 'mode', 'arm', 'magnet'] as ChannelKey[]) { const ref = detectedMapping[channel]; if (ref) { setMappingRefForChannel(channel, ref); } } 
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Stops or finalizes `finishWizard` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `finishWizard` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
finishWizard();
```

### `formatAuxRange`

- Full name: `formatAuxRange`
- Location: `public/modules/ui/settings/wizard.ts:646`
- Return type: `string`

**Signature**

```ts
function formatAuxRange(range: AuxChannelRange | null): string { if (!range) return 'Диапазон не определен'; return `${range.min}-${range.max}`; }
```

**Parameters**

- `range: AuxChannelRange | null`: input argument of type `AuxChannelRange | null`.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Performs `formatAuxRange` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `formatAuxRange` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
formatAuxRange(/* range */);
```

### `formatModeRanges`

- Full name: `formatModeRanges`
- Location: `public/modules/ui/settings/wizard.ts:632`
- Return type: `string`

**Signature**

```ts
function formatModeRanges(): string { const ranges = auxResults.mode?.ranges ?? []; const selected = ranges.length > 3 ? pickRepresentativePositions(auxResults.mode?.positions ?? [], 3) : auxResults.mode?.positions ?? []; const preparedRanges = buildRangesFromPositions(selected); if (preparedRanges.length < 2) { return 'Недостаточно данных для диапазонов Mode.'; } 
```

**Parameters**

- No input parameters.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Performs `formatModeRanges` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `formatModeRanges` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
formatModeRanges();
```

### `formatRefLabel`

- Full name: `formatRefLabel`
- Location: `public/modules/ui/settings/wizard.ts:651`
- Return type: `string`

**Signature**

```ts
function formatRefLabel(ref: GamepadInputRef): string { const index = Number(ref.slice(1)); if (ref.startsWith('a')) { return `Axis ${index} / CH${index + 1}`; } return `Button ${index + 1}`; }
```

**Parameters**

- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Performs `formatRefLabel` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `formatRefLabel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
formatRefLabel(/* ref */);
```

### `getAuxCandidate`

- Full name: `getAuxCandidate`
- Location: `public/modules/ui/settings/wizard.ts:240`
- Return type: `AuxDetectionCandidate | null`

**Signature**

```ts
function getAuxCandidate(step: WizardStep, ref: GamepadInputRef): AuxDetectionCandidate | null { const positions = getObservedPositions(stepObservedStats, ref); const stablePositions = step.preferThreePositions && positions.length > 3 ? pickRepresentativePositions(positions, 3) : positions; const ranges = buildRangesFromPositions(stablePositions); const stats = stepObservedStats.get(ref); if (!stats) return null;
```

**Parameters**

- `step: WizardStep`: input argument of type `WizardStep`.
- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.

**Return Value**

- Value of type `AuxDetectionCandidate | null` consumed by downstream logic.

**Purpose**

- Returns `getAuxCandidate` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getAuxCandidate` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getAuxCandidate(/* step */, /* ref */);
```

### `getBestAuxCandidate`

- Full name: `getBestAuxCandidate`
- Location: `public/modules/ui/settings/wizard.ts:308`
- Return type: `AuxDetectionCandidate | null`

**Signature**

```ts
function getBestAuxCandidate(step: WizardStep, requireResolved: boolean): AuxDetectionCandidate | null { const gp = getFirstConnectedGamepad(); if (!gp) return null; const usedRefs = getUsedRefs(step.channel); let bestCandidate: AuxDetectionCandidate | null = null; const refs: GamepadInputRef[] = [
```

**Parameters**

- `step: WizardStep`: input argument of type `WizardStep`.
- `requireResolved: boolean`: input argument of type `boolean`.

**Return Value**

- Value of type `AuxDetectionCandidate | null` consumed by downstream logic.

**Purpose**

- Returns `getBestAuxCandidate` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getBestAuxCandidate` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getBestAuxCandidate(/* step */, /* requireResolved */);
```

### `getCurrentStep`

- Full name: `getCurrentStep`
- Location: `public/modules/ui/settings/wizard.ts:172`
- Return type: `WizardStep`

**Signature**

```ts
function getCurrentStep(): WizardStep { return STEPS[currentStepIdx]; }
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `WizardStep` consumed by downstream logic.

**Purpose**

- Returns `getCurrentStep` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getCurrentStep` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getCurrentStep();
```

### `getDetectedRef`

- Full name: `getDetectedRef`
- Location: `public/modules/ui/settings/wizard.ts:236`
- Return type: `GamepadInputRef | null`

**Signature**

```ts
function getDetectedRef(channel: ChannelKey): GamepadInputRef | null { return detectedMapping[channel] ?? null; }
```

**Parameters**

- `channel: ChannelKey`: logical channel, property, or mode key.

**Return Value**

- Value of type `GamepadInputRef | null` consumed by downstream logic.

**Purpose**

- Returns `getDetectedRef` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getDetectedRef` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getDetectedRef(/* channel */);
```

### `getFirstConnectedGamepad`

- Full name: `getFirstConnectedGamepad`
- Location: `public/modules/ui/settings/wizard.ts:176`
- Return type: `Gamepad | null`

**Signature**

```ts
function getFirstConnectedGamepad(): Gamepad | null { if (typeof navigator.getGamepads !== 'function') return null; const connected = Array.from(navigator.getGamepads()).filter((gp): gp is Gamepad => gp !== null); return connected[0] ?? null; }
```

**Parameters**

- No input parameters.

**Return Value**

- Value of type `Gamepad | null` consumed by downstream logic.

**Purpose**

- Returns `getFirstConnectedGamepad` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getFirstConnectedGamepad` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getFirstConnectedGamepad();
```

### `getMappingRefForChannel`

- Full name: `getMappingRefForChannel`
- Location: `public/modules/ui/settings/wizard.ts:182`
- Return type: `GamepadInputRef`

**Signature**

```ts
function getMappingRefForChannel(channel: ChannelKey): GamepadInputRef { switch (channel) { case 'roll': return simSettings.gamepadMapping.roll; case 'pitch': return simSettings.gamepadMapping.pitch; case 'throttle': return simSettings.gamepadMapping.throttle;
```

**Parameters**

- `channel: ChannelKey`: logical channel, property, or mode key.

**Return Value**

- Value of type `GamepadInputRef` consumed by downstream logic.

**Purpose**

- Returns `getMappingRefForChannel` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getMappingRefForChannel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getMappingRefForChannel(/* channel */);
```

### `getNormalizedRefValue`

- Full name: `getNormalizedRefValue`
- Location: `public/modules/ui/settings/wizard.ts:574`
- Return type: `number`

**Signature**

```ts
function getNormalizedRefValue(gp: Gamepad, ref: GamepadInputRef, channel: ChannelKey): number { const index = Number(ref.slice(1)); if (ref.startsWith('b')) { const buttonValue = Math.max(0, Math.min(1, gp.buttons[index]?.value ?? 0)); if (channel === 'throttle') return 1 - buttonValue * 2; return buttonValue * 2 - 1; } 
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.
- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.
- `channel: ChannelKey`: logical channel, property, or mode key.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `getNormalizedRefValue` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getNormalizedRefValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getNormalizedRefValue(/* ... */, /* ref */, /* channel */);
```

### `getStepStatusText`

- Full name: `getStepStatusText`
- Location: `public/modules/ui/settings/wizard.ts:404`
- Return type: `string`

**Signature**

```ts
function getStepStatusText(step: WizardStep): string { const ref = getDetectedRef(step.channel); if (!ref) { if (step.type === 'aux') { const requiredPositions = step.minPositions ?? 2; const candidate = getBestAuxCandidate(step, false); if (!candidate) { return `Ожидание переключений... Нужно зафиксировать минимум ${requiredPositions} положения.`;
```

**Parameters**

- `step: WizardStep`: input argument of type `WizardStep`.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Returns `getStepStatusText` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getStepStatusText` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getStepStatusText(/* step */);
```

### `getStepTargetStick`

- Full name: `getStepTargetStick`
- Location: `public/modules/ui/settings/wizard.ts:387`
- Return type: `'L' | 'R' | 'both'`

**Signature**

```ts
function getStepTargetStick(step: WizardStep): 'L' | 'R' | 'both' { if (step.type === 'aux') return 'both'; switch (simSettings.gamepadStickMode) { case 1: return step.channel === 'pitch' || step.channel === 'roll' ? 'R' : 'L'; case 2: return step.channel === 'pitch' || step.channel === 'roll' ? 'R' : 'L';
```

**Parameters**

- `step: WizardStep`: input argument of type `WizardStep`.

**Return Value**

- Value of type `'L' | 'R' | 'both'` consumed by downstream logic.

**Purpose**

- Returns `getStepTargetStick` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getStepTargetStick` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getStepTargetStick(/* step */);
```

### `getUsedRefs`

- Full name: `getUsedRefs`
- Location: `public/modules/ui/settings/wizard.ts:227`
- Return type: `Set<GamepadInputRef>`

**Signature**

```ts
function getUsedRefs(exceptChannel?: ChannelKey): Set<GamepadInputRef> { const used = new Set<GamepadInputRef>(); for (const [channel, ref] of Object.entries(detectedMapping) as Array<[ChannelKey, GamepadInputRef | undefined]>) { if (!ref || channel === exceptChannel) continue; used.add(ref); } return used; }
```

**Parameters**

- `exceptChannel?: ChannelKey`: input argument of type `ChannelKey`.

**Return Value**

- Value of type `Set<GamepadInputRef>` consumed by downstream logic.

**Purpose**

- Returns `getUsedRefs` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getUsedRefs` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getUsedRefs(/* exceptChannel */);
```

### `getVisualChannelValue`

- Full name: `getVisualChannelValue`
- Location: `public/modules/ui/settings/wizard.ts:568`
- Return type: `number`

**Signature**

```ts
function getVisualChannelValue(gp: Gamepad, channel: PrimaryChannelKey, liveOverride: GamepadInputRef | null): number { const ref = liveOverride ?? detectedMapping[channel] ?? null; if (!ref) return 0; return getNormalizedRefValue(gp, ref, channel); }
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.
- `channel: PrimaryChannelKey`: logical channel, property, or mode key.
- `liveOverride: GamepadInputRef | null`: input argument of type `GamepadInputRef | null`.

**Return Value**

- Numeric result produced by a calculation, normalization step, or lookup.

**Purpose**

- Returns `getVisualChannelValue` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `getVisualChannelValue` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getVisualChannelValue(/* ... */, /* channel */, 'drone_1');
```

### `initWizard`

- Full name: `initWizard`
- Location: `public/modules/ui/settings/wizard.ts:78`
- Return type: `void`

**Signature**

```ts
export function initWizard() { const btn = document.getElementById('gp-btn-wizard'); const overlay = document.getElementById('gp-wizard-overlay'); const closeBtn = document.getElementById('gp-wizard-close'); const nextBtn = document.getElementById('gp-wizard-next') as HTMLButtonElement | null; const prevBtn = document.getElementById('gp-wizard-prev') as HTMLButtonElement | null; if (!btn || !overlay || !closeBtn || !nextBtn || !prevBtn) return;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initWizard` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `initWizard` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initWizard();
```

### `isBetterAuxCandidate`

- Full name: `isBetterAuxCandidate`
- Location: `public/modules/ui/settings/wizard.ts:276`
- Return type: `boolean`

**Signature**

```ts
function isBetterAuxCandidate( step: WizardStep, candidate: AuxDetectionCandidate, bestCandidate: AuxDetectionCandidate | null, requireResolved: boolean ): boolean { if (!bestCandidate) return true; 
```

**Parameters**

- `step: WizardStep`: input argument of type `WizardStep`.
- `candidate: AuxDetectionCandidate`: input argument of type `AuxDetectionCandidate`.
- `bestCandidate: AuxDetectionCandidate | null`: input argument of type `AuxDetectionCandidate | null`.
- `requireResolved: boolean`: input argument of type `boolean`.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isBetterAuxCandidate` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `isBetterAuxCandidate` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isBetterAuxCandidate(/* step */, 'drone_1', 'drone_1', /* requireResolved */);
```

### `isCurrentStepResolved`

- Full name: `isCurrentStepResolved`
- Location: `public/modules/ui/settings/wizard.ts:337`
- Return type: `boolean`

**Signature**

```ts
function isCurrentStepResolved(): boolean { return getDetectedRef(getCurrentStep().channel) !== null; }
```

**Parameters**

- No input parameters.

**Return Value**

- Boolean result used to represent a check, capability, or success condition.

**Purpose**

- Checks `isCurrentStepResolved` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `isCurrentStepResolved` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
isCurrentStepResolved();
```

### `prepareCurrentStep`

- Full name: `prepareCurrentStep`
- Location: `public/modules/ui/settings/wizard.ts:147`
- Return type: `void`

**Signature**

```ts
function prepareCurrentStep() { stepBaselineAxes = []; stepLastAxes = []; stepAxisStats = []; stepObservedStats = resetObservedInputStats(); stepLastSwitchValues = new Map<GamepadInputRef, number>(); stepSwitchTransitions = new Map<GamepadInputRef, number>(); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `prepareCurrentStep` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `prepareCurrentStep` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
prepareCurrentStep();
```

### `rememberSwitchTransition`

- Full name: `rememberSwitchTransition`
- Location: `public/modules/ui/settings/wizard.ts:537`
- Return type: `void`

**Signature**

```ts
function rememberSwitchTransition(ref: GamepadInputRef, rcValue: number) { const previousValue = stepLastSwitchValues.get(ref); if (previousValue === undefined) { stepLastSwitchValues.set(ref, rcValue); return; } if (Math.abs(previousValue - rcValue) >= 140) {
```

**Parameters**

- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.
- `rcValue: number`: input argument of type `number`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `rememberSwitchTransition` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `rememberSwitchTransition` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
rememberSwitchTransition(/* ref */, /* rcValue */);
```

### `renderWizardState`

- Full name: `renderWizardState`
- Location: `public/modules/ui/settings/wizard.ts:341`
- Return type: `void`

**Signature**

```ts
function renderWizardState() { const instruction = document.getElementById('gp-wizard-instruction'); const status = document.getElementById('gp-wizard-status'); const nextBtn = document.getElementById('gp-wizard-next') as HTMLButtonElement | null; const prevBtn = document.getElementById('gp-wizard-prev') as HTMLButtonElement | null; const stepContainer = document.getElementById('gp-wizard-step-container'); const summaryContainer = document.getElementById('gp-wizard-summary'); const summaryContent = document.getElementById('gp-wizard-summary-content');
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Renders or synchronizes `renderWizardState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `renderWizardState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
renderWizardState();
```

### `resetWizardBindings`

- Full name: `resetWizardBindings`
- Location: `public/modules/ui/settings/wizard.ts:156`
- Return type: `void`

**Signature**

```ts
function resetWizardBindings() { simSettings.gamepadMapping.roll = DETACHED_AXIS_REF; simSettings.gamepadMapping.pitch = DETACHED_AXIS_REF; simSettings.gamepadMapping.throttle = DETACHED_BUTTON_REF; simSettings.gamepadMapping.yaw = DETACHED_AXIS_REF; simSettings.gamepadMapping.modeSwitch = DETACHED_BUTTON_REF; simSettings.gamepadMapping.armSwitch = DETACHED_BUTTON_REF; simSettings.gamepadMapping.magnetBtn = DETACHED_BUTTON_REF;
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Resets `resetWizardBindings` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `resetWizardBindings` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
resetWizardBindings();
```

### `sampleCurrentStep`

- Full name: `sampleCurrentStep`
- Location: `public/modules/ui/settings/wizard.ts:459`
- Return type: `void`

**Signature**

```ts
function sampleCurrentStep(gp: Gamepad) { const step = getCurrentStep(); if (step.type === 'primary') { detectPrimaryAxis(gp, step.channel as PrimaryChannelKey); if (currentStepIdx === STEPS.length - 1 && isCurrentStepResolved()) { showingSummary = true; } return;
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `sampleCurrentStep` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `sampleCurrentStep` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
sampleCurrentStep(/* ... */);
```

### `setMappingRefForChannel`

- Full name: `setMappingRefForChannel`
- Location: `public/modules/ui/settings/wizard.ts:201`
- Return type: `void`

**Signature**

```ts
function setMappingRefForChannel(channel: ChannelKey, ref: GamepadInputRef) { switch (channel) { case 'roll': simSettings.gamepadMapping.roll = ref; break; case 'pitch': simSettings.gamepadMapping.pitch = ref; break;
```

**Parameters**

- `channel: ChannelKey`: logical channel, property, or mode key.
- `ref: GamepadInputRef`: encoded gamepad input reference such as an axis or button id.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Sets `setMappingRefForChannel` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `setMappingRefForChannel` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
setMappingRefForChannel(/* channel */, /* ref */);
```

### `startWizard`

- Full name: `startWizard`
- Location: `public/modules/ui/settings/wizard.ts:130`
- Return type: `void`

**Signature**

```ts
function startWizard() { isWizardActive = true; showingSummary = false; currentStepIdx = 0; resetWizardBindings(); detectedMapping = {}; auxResults = {}; prepareCurrentStep();
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Starts `startWizard` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `startWizard` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
startWizard();
```

### `stopWizard`

- Full name: `stopWizard`
- Location: `public/modules/ui/settings/wizard.ts:142`
- Return type: `void`

**Signature**

```ts
function stopWizard() { isWizardActive = false; showingSummary = false; }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Stops or finalizes `stopWizard` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `stopWizard` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
stopWizard();
```

### `updateStickVisuals`

- Full name: `updateStickVisuals`
- Location: `public/modules/ui/settings/wizard.ts:550`
- Return type: `void`

**Signature**

```ts
function updateStickVisuals(gp: Gamepad) { const dotLeft = document.getElementById('gp-wizard-dot-l'); const dotRight = document.getElementById('gp-wizard-dot-r'); if (!dotLeft || !dotRight) return; const step = getCurrentStep(); const liveRefForCurrentStep = getDetectedRef(step.channel); const leftX = getVisualChannelValue(gp, 'yaw', step.channel === 'yaw' ? liveRefForCurrentStep : null);
```

**Parameters**

- `gp: Gamepad`: browser `Gamepad` object.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateStickVisuals` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `updateStickVisuals` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateStickVisuals(/* ... */);
```

### `wizardLoop`

- Full name: `wizardLoop`
- Location: `public/modules/ui/settings/wizard.ts:433`
- Return type: `void`

**Signature**

```ts
function wizardLoop() { if (!isWizardActive) return; const gp = getFirstConnectedGamepad(); if (gp) { if (stepBaselineAxes.length !== gp.axes.length) { stepBaselineAxes = gp.axes.map((value) => value ?? 0); stepLastAxes = gp.axes.map((value) => value ?? 0);
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `wizardLoop` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/settings/wizard.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/settings/wizard.ts`. Gamepad settings and calibration subsystem. Collects DOM references, binds handlers, auto-detects channels, stores runtime state, and renders channel range editors. In practice, it isolates the implementation details of `wizardLoop` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
wizardLoop();
```

## Module `public/modules/ui/sidebar.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `initSidebar`

- Full name: `initSidebar`
- Location: `public/modules/ui/sidebar.ts:3`
- Return type: `void`

**Signature**

```ts
export function initSidebar(callbacks: UICallbacks) { const panels = document.querySelector('.sidebar-panels') as HTMLElement | null; const resizer = document.getElementById('sidebar-resizer') as HTMLElement | null; if (!panels || !resizer) return; let isResizing = false; let viewportRefreshFrame = 0; 
```

**Parameters**

- `callbacks: UICallbacks`: input argument of type `UICallbacks`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initSidebar` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/sidebar.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/sidebar.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initSidebar` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initSidebar(/* callbacks */);
```

### `initSidebar.refreshViewportLayout`

- Full name: `initSidebar.refreshViewportLayout`
- Location: `public/modules/ui/sidebar.ts:11`
- Return type: `void`

**Signature**

```ts
() => { window.cancelAnimationFrame(viewportRefreshFrame); viewportRefreshFrame = window.requestAnimationFrame(() => { window.dispatchEvent(new Event('resize')); window.setTimeout(() => window.dispatchEvent(new Event('resize')), 180); window.setTimeout(() => window.dispatchEvent(new Event('resize')), 360); }); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initSidebar.refreshViewportLayout` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/sidebar.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/sidebar.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `refreshViewportLayout` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
refreshViewportLayout();
```

### `initSidebar.syncSidebarCollapsedState`

- Full name: `initSidebar.syncSidebarCollapsedState`
- Location: `public/modules/ui/sidebar.ts:20`
- Return type: `void`

**Signature**

```ts
() => { panels.classList.toggle('is-collapsed', panels.style.width === '0px'); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `initSidebar.syncSidebarCollapsedState` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/sidebar.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/sidebar.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `syncSidebarCollapsedState` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncSidebarCollapsedState();
```

### `initSidebar.syncSidebarMode`

- Full name: `initSidebar.syncSidebarMode`
- Location: `public/modules/ui/sidebar.ts:24`
- Return type: `void`

**Signature**

```ts
(panelId: string | null) => { panels.classList.toggle('is-fullscreen', panelId === 'settings-panel' && panels.style.width !== '0px'); }
```

**Parameters**

- `panelId: string | null`: input argument of type `string | null`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Synchronizes `initSidebar.syncSidebarMode` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/sidebar.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/sidebar.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `syncSidebarMode` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
syncSidebarMode('drone_1');
```

## Module `public/modules/ui/simulation-notice.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `initSimulationNotice`

- Full name: `initSimulationNotice`
- Location: `public/modules/ui/simulation-notice.ts:1`
- Return type: `void`

**Signature**

```ts
export function initSimulationNotice() { const sceneContainer = document.querySelector('.scene-container') as HTMLElement | null; if (!sceneContainer) return; let notice = document.getElementById('simulation-notice') as HTMLDivElement | null; if (!notice) { notice = document.createElement('div'); notice.id = 'simulation-notice';
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Initializes `initSimulationNotice` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/simulation-notice.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/simulation-notice.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `initSimulationNotice` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
initSimulationNotice();
```

### `initSimulationNotice.hideNotice`

- Full name: `initSimulationNotice.hideNotice`
- Location: `public/modules/ui/simulation-notice.ts:22`
- Return type: `void`

**Signature**

```ts
() => { notice?.classList.remove('visible'); }
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `initSimulationNotice.hideNotice` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/simulation-notice.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/simulation-notice.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `hideNotice` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
hideNotice();
```

## Module `public/modules/ui/stats.ts`

Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows.

### `updateStats`

- Full name: `updateStats`
- Location: `public/modules/ui/stats.ts:14`
- Return type: `void`

**Signature**

```ts
export function updateStats() { const speed = Math.sqrt(simState.vel.x**2 + simState.vel.y**2 + simState.vel.z**2); // Update Telemetry Panel if (stateAlt) stateAlt.textContent = simState.pos.z.toFixed(2); if (stateSpd) stateSpd.textContent = speed.toFixed(1); if (stateBat) stateBat.textContent = Math.floor(simState.battery).toString(); if (stateStatus) {
```

**Parameters**

- No input parameters.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Updates `updateStats` in the UI layer. It encapsulates one well-defined step of the module contract in `public/modules/ui/stats.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/ui/stats.ts`. Simulator UI module. Manages panels, HUD, logs, drone lists, notices, and user-facing interaction flows. In practice, it isolates the implementation details of `updateStats` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
updateStats();
```

## Module `public/modules/utils.ts`

Core simulator module. Contains shared runtime logic, state management, or foundational services.

### `log`

- Full name: `log`
- Location: `public/modules/utils.ts:4`
- Return type: `void`

**Signature**

```ts
export function log(msg: string, type: 'info' | 'error' | 'warn' | 'success' = 'info') { if (!logs) return; const div = document.createElement('div'); div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`; if (type === 'error') div.className = 'log-error'; if (type === 'warn') div.className = 'log-warn'; if (type === 'success') div.className = 'log-success'; logs.appendChild(div);
```

**Parameters**

- `msg: string`: input argument of type `string`.
- `type?: 'info' | 'error' | 'warn' | 'success'`: message, state, or category discriminator.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `log` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/utils.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/utils.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `log` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
log(/* msg */, /* type */);
```

### `luaToStr`

- Full name: `luaToStr`
- Location: `public/modules/utils.ts:15`
- Return type: `string`

**Signature**

```ts
export function luaToStr(luaVal: any, L: any): string { if (luaVal === null || luaVal === undefined) { if (L) { const top = window.fengari.lua.lua_gettop(L); if (top > 0) { const s = window.fengari.lua.lua_tostring(L, -1); if (s) return window.fengari.to_jsstring(s); }
```

**Parameters**

- `luaVal: any`: input argument of type `any`.
- `L: any`: Lua VM state or Lua stack handle.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Performs `luaToStr` in the project runtime. It encapsulates one well-defined step of the module contract in `public/modules/utils.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `public/modules/utils.ts`. Core simulator module. Contains shared runtime logic, state management, or foundational services. In practice, it isolates the implementation details of `luaToStr` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
luaToStr(/* luaVal */, /* L */);
```

## Module `tests/cargo-contact.test.ts`

Automated test helper module used to verify physics, path logic, and state behavior.

### `runUntilGroundContact`

- Full name: `runUntilGroundContact`
- Location: `tests/cargo-contact.test.ts:7`
- Return type: `CargoStepState`

**Signature**

```ts
function runUntilGroundContact(initialVelocity: { x: number; y: number; z: number }, cargoMassKg: number) { let state = { position: { x: 0, y: 0, z: 1.2 }, velocity: initialVelocity }; for (let i = 0; i < 300; i++) { const next = simulateDetachedCargoStep({
```

**Parameters**

- `initialVelocity: { x: number; y: number; z: number }`: input argument of type `{ x: number; y: number; z: number }`.
- `cargoMassKg: number`: input argument of type `number`.

**Return Value**

- Value of type `CargoStepState` consumed by downstream logic.

**Purpose**

- Performs `runUntilGroundContact` in automated test code. It encapsulates one well-defined step of the module contract in `tests/cargo-contact.test.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tests/cargo-contact.test.ts`. Automated test helper module used to verify physics, path logic, and state behavior. In practice, it isolates the implementation details of `runUntilGroundContact` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
runUntilGroundContact(/* initialVelocity */, /* cargoMassKg */);
```

## Module `tools/audit_and_refactor.ts`

Engineering utility script used for data generation, audits, or local test automation.

### `getLDocTemplate`

- Full name: `getLDocTemplate`
- Location: `tools/audit_and_refactor.ts:16`
- Return type: `string`

**Signature**

```ts
function getLDocTemplate(filename: string, relPath: string): string { const moduleName = filename.replace('.lua', ''); const description = `Автоматически задокументированный скрипт: ${relPath}`; return `--- \n-- @module ${moduleName}\n-- @description ${description}\n-- @author Geoskan Simulator Auto-Refactor\n\n`; }
```

**Parameters**

- `filename: string`: input argument of type `string`.
- `relPath: string`: path relative to the project root or scenario directory.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Returns `getLDocTemplate` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/audit_and_refactor.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/audit_and_refactor.ts`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `getLDocTemplate` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
getLDocTemplate(/* filename */, /* relPath */);
```

### `processLuaFile`

- Full name: `processLuaFile`
- Location: `tools/audit_and_refactor.ts:22`
- Return type: `void`

**Signature**

```ts
function processLuaFile(filePath: string, relPath: string) { let content = fs.readFileSync(filePath, 'utf-8'); let modified = false; // 1. Добавление LDoc если его нет if (!content.trimStart().startsWith('---')) { content = getLDocTemplate(path.basename(filePath), relPath) + content; modified = true;
```

**Parameters**

- `filePath: string`: absolute path to the file being processed.
- `relPath: string`: path relative to the project root or scenario directory.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `processLuaFile` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/audit_and_refactor.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/audit_and_refactor.ts`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `processLuaFile` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
processLuaFile(/* filePath */, /* relPath */);
```

### `walkDir`

- Full name: `walkDir`
- Location: `tools/audit_and_refactor.ts:54`
- Return type: `void`

**Signature**

```ts
function walkDir(dir: string) { const files = fs.readdirSync(dir); for (const file of files) { const fullPath = path.join(dir, file); const stat = fs.statSync(fullPath); if (stat.isDirectory()) { walkDir(fullPath); } else if (file.endsWith('.lua')) {
```

**Parameters**

- `dir: string`: input argument of type `string`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `walkDir` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/audit_and_refactor.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/audit_and_refactor.ts`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `walkDir` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
walkDir(/* dir */);
```

## Module `tools/generate_marker_dictionaries.mjs`

Engineering utility script used for data generation, audits, or local test automation.

### `chunk`

- Full name: `chunk`
- Location: `tools/generate_marker_dictionaries.mjs:55`
- Return type: `any[]`

**Signature**

```ts
function chunk(array, size) { const result = []; for (let i = 0; i < array.length; i += size) { result.push(array.slice(i, i + size)); } return result; }
```

**Parameters**

- `array: any`: input argument of type `any`.
- `size: any`: input argument of type `any`.

**Return Value**

- Collection of values prepared for further processing by the caller.

**Purpose**

- Performs `chunk` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/generate_marker_dictionaries.mjs` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/generate_marker_dictionaries.mjs`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `chunk` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
chunk(/* array */, /* size */);
```

### `formatDataBlock`

- Full name: `formatDataBlock`
- Location: `tools/generate_marker_dictionaries.mjs:83`
- Return type: `string`

**Signature**

```ts
function formatDataBlock(data) { return JSON.stringify(data) .replace(/\],\[/g, '], [') .replace(/\[\[/g, '[[') .replace(/\]\]/g, ']]'); }
```

**Parameters**

- `data: any`: input argument of type `any`.

**Return Value**

- String result used as a label, serialized fragment, or converted representation.

**Purpose**

- Performs `formatDataBlock` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/generate_marker_dictionaries.mjs` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/generate_marker_dictionaries.mjs`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `formatDataBlock` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
formatDataBlock(/* data */);
```

### `loadSources`

- Full name: `loadSources`
- Location: `tools/generate_marker_dictionaries.mjs:90`
- Return type: `Promise<Map<any, any>>`

**Signature**

```ts
async function loadSources() { const parsed = new Map(); for (const source of SOURCES) { const response = await fetch(source.url); if (!response.ok) { throw new Error(`Failed to download ${source.url}: ${response.status}`); } const text = await response.text();
```

**Parameters**

- No input parameters.

**Return Value**

- Promise resolved when the asynchronous workflow completes.

**Purpose**

- Performs `loadSources` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/generate_marker_dictionaries.mjs` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/generate_marker_dictionaries.mjs`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `loadSources` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
loadSources();
```

### `main`

- Full name: `main`
- Location: `tools/generate_marker_dictionaries.mjs:104`
- Return type: `Promise<void>`

**Signature**

```ts
async function main() { const parsedSources = await loadSources(); const output = []; output.push('/* Auto-generated from official OpenCV predefined marker dictionaries. */'); output.push('export type MarkerDictionaryKind = \'aruco\' | \'apriltag\';'); output.push(''); output.push('export interface MarkerDictionaryDefinition {');
```

**Parameters**

- No input parameters.

**Return Value**

- Promise resolved when the asynchronous workflow completes.

**Purpose**

- Performs `main` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/generate_marker_dictionaries.mjs` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/generate_marker_dictionaries.mjs`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `main` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
main();
```

### `parseSourceArrays`

- Full name: `parseSourceArrays`
- Location: `tools/generate_marker_dictionaries.mjs:63`
- Return type: `Map<any, any>`

**Signature**

```ts
function parseSourceArrays(sourceText, allowedNames) { const arrays = new Map(); const regex = /static unsigned char\s+([A-Za-z0-9_]+)_BYTES\[\]\[4\]\[(\d+)\]\s*=\s*\{([\s\S]*?)\}\s*;/g; for (const match of sourceText.matchAll(regex)) { const name = match[1]; if (!allowedNames.includes(name)) continue; const byteWidth = Number.parseInt(match[2], 10); const numbers = (match[3].match(/\d+/g) || []).map((value) => Number.parseInt(value, 10));
```

**Parameters**

- `sourceText: any`: input argument of type `any`.
- `allowedNames: any`: input argument of type `any`.

**Return Value**

- Value of type `Map<any, any>` consumed by downstream logic.

**Purpose**

- Performs `parseSourceArrays` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/generate_marker_dictionaries.mjs` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/generate_marker_dictionaries.mjs`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `parseSourceArrays` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
parseSourceArrays(/* sourceText */, /* allowedNames */);
```

## Module `tools/revert_lua.ts`

Engineering utility script used for data generation, audits, or local test automation.

### `processLuaFile`

- Full name: `processLuaFile`
- Location: `tools/revert_lua.ts:10`
- Return type: `void`

**Signature**

```ts
function processLuaFile(filePath: string, relPath: string) { let content = fs.readFileSync(filePath, 'utf-8'); let modified = false; // 1. Убираем LDoc шапку const lines = content.split('\n'); if (lines[0].startsWith('---') && lines[1].startsWith('-- @module')) { lines.splice(0, 5); // Удаляем 5 строк шапки
```

**Parameters**

- `filePath: string`: absolute path to the file being processed.
- `relPath: string`: path relative to the project root or scenario directory.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `processLuaFile` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/revert_lua.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/revert_lua.ts`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `processLuaFile` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
processLuaFile(/* filePath */, /* relPath */);
```

### `walkDir`

- Full name: `walkDir`
- Location: `tools/revert_lua.ts:44`
- Return type: `void`

**Signature**

```ts
function walkDir(dir: string) { const files = fs.readdirSync(dir); for (const file of files) { const fullPath = path.join(dir, file); const stat = fs.statSync(fullPath); if (stat.isDirectory()) { walkDir(fullPath); } else if (file.endsWith('.lua')) {
```

**Parameters**

- `dir: string`: input argument of type `string`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `walkDir` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/revert_lua.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/revert_lua.ts`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `walkDir` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
walkDir(/* dir */);
```

## Module `tools/run_tests.ts`

Engineering utility script used for data generation, audits, or local test automation.

### `runLuaTest`

- Full name: `runLuaTest`
- Location: `tools/run_tests.ts:16`
- Return type: `void`

**Signature**

```ts
function runLuaTest(filePath: string, relPath: string) { totalFiles++; const content = fs.readFileSync(filePath, 'utf-8'); try { // Инициализируем стейт Lua const L = fengari.lauxlib.luaL_newstate(); fengari.lualib.luaL_openlibs(L);
```

**Parameters**

- `filePath: string`: absolute path to the file being processed.
- `relPath: string`: path relative to the project root or scenario directory.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `runLuaTest` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/run_tests.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/run_tests.ts`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `runLuaTest` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
runLuaTest(/* filePath */, /* relPath */);
```

### `walkDir`

- Full name: `walkDir`
- Location: `tools/run_tests.ts:60`
- Return type: `void`

**Signature**

```ts
function walkDir(dir: string) { const files = fs.readdirSync(dir); for (const file of files) { const fullPath = path.join(dir, file); const stat = fs.statSync(fullPath); if (stat.isDirectory()) { walkDir(fullPath); } else if (file.endsWith('.lua')) {
```

**Parameters**

- `dir: string`: input argument of type `string`.

**Return Value**

- No direct return value; the effect is expressed through state mutation, DOM updates, logging, or other side effects.

**Purpose**

- Performs `walkDir` in engineering tooling. It encapsulates one well-defined step of the module contract in `tools/run_tests.ts` and is designed to be reused by higher-level flows.

**Business Logic**

- This function belongs to `tools/run_tests.ts`. Engineering utility script used for data generation, audits, or local test automation. In practice, it isolates the implementation details of `walkDir` so that calling code can work with a simpler, stable interface.

**Usage Example**

```ts
walkDir(/* dir */);
```

## Alphabetical Function Index

- `activateTransformMode` -> `public/modules/scene/object-transform.ts`
- `addBoxSurfaceCandidates` -> `public/modules/environment/obstacles/markers.ts`
- `addIncidentEffect` -> `public/modules/environment/obstacles/buildings.ts`
- `addObject` -> `public/modules/scene/object-manager.ts`
- `addObjectToScene` -> `public/modules/environment.ts`
- `animate` -> `public/main.ts`
- `animateRotors` -> `public/modules/drone-model.ts`
- `ap_goToLocalPoint` -> `public/modules/lua/autopilot.ts`
- `ap_goToPoint` -> `public/modules/lua/autopilot.ts`
- `ap_push` -> `public/modules/lua/autopilot.ts`
- `ap_updateYaw` -> `public/modules/lua/autopilot.ts`
- `appendPointToSelectedLinearObject` -> `public/modules/scene/object-manager.ts`
- `applyAuxResults` -> `public/modules/ui/settings/wizard.ts`
- `applyCrashState` -> `public/modules/physics/events.ts`
- `applyGroundFriction` -> `public/modules/physics/cargo-contact.ts`
- `applyHudVisibility` -> `public/modules/ui/hud-controls.ts`
- `applyMarkerMapMetadata` -> `public/modules/environment/obstacles/markers.ts`
- `applyMarkerMetadata` -> `public/modules/environment/obstacles/markers.ts`
- `applyModeRangesFromObserved` -> `public/modules/ui/settings/channel-ranges.ts`
- `applyPrimaryAxisMappingForCurrentMode` -> `public/modules/ui/settings/mapping.ts`
- `applyShadows` -> `public/modules/environment/obstacles/utils.ts`
- `axisRef` -> `public/modules/ui/settings/constants.ts`
- `beginCalibration` -> `public/modules/ui/settings/calibration.ts`
- `beginDisarmedFall` -> `public/modules/physics/events.ts`
- `bindGamepadSettingsControls` -> `public/modules/ui/settings/bindings.ts`
- `bindGeneralSettingsControls` -> `public/modules/ui/settings/bindings.ts`
- `buildHorizontalPatch` -> `public/modules/environment/obstacles/linear.ts`
- `buildOrientedBox` -> `public/modules/environment/obstacles/linear.ts`
- `buildOrientedCylinder` -> `public/modules/environment/obstacles/linear.ts`
- `buildRangesFromPositions` -> `public/modules/ui/settings/observed-inputs.ts`
- `buildSummaryHtml` -> `public/modules/ui/settings/wizard.ts`
- `buttonRef` -> `public/modules/ui/settings/constants.ts`
- `bytesToBitMatrix` -> `public/modules/environment/obstacles/markers.ts`
- `camera_checkRequestShot` -> `public/modules/lua/hardware.ts`
- `camera_requestMakeShot` -> `public/modules/lua/hardware.ts`
- `camera_requestRecordStart` -> `public/modules/lua/hardware.ts`
- `camera_requestRecordStop` -> `public/modules/lua/hardware.ts`
- `capsuleDistanceToPoint` -> `public/modules/physics/collisions.ts`
- `checkPhysicsEvents` -> `public/modules/physics/events.ts`
- `chunk` -> `tools/generate_marker_dictionaries.mjs`
- `clamp` -> `public/modules/ui/settings/constants.ts`
- `clampBuildingFloors` -> `public/modules/environment/obstacles/buildings.ts`
- `clampInt` -> `public/modules/environment/obstacles/markers.ts`
- `clampNumber` -> `public/modules/environment/obstacles/markers.ts`
- `clampRc` -> `public/modules/ui/settings/constants.ts`
- `clampValue` -> `public/modules/environment/obstacles/markers.ts`
- `clearGeneratedChildren` -> `public/modules/environment/obstacles/utils.ts`
- `clearSelectedObjectInitialTransform` -> `public/modules/scene/object-transform.ts`
- `collectSettingsDomRefs` -> `public/modules/ui/settings/dom.ts`
- `combineContactMaterials` -> `public/modules/physics/cargo-contact.ts`
- `configureTransformHelperVisuals` -> `public/modules/scene/scene-init.ts`
- `createApartmentBuildingMesh` -> `public/modules/environment/obstacles/buildings.ts`
- `createAprilTagMarkerMapMesh` -> `public/modules/environment/obstacles/markers.ts`
- `createAprilTagMarkerMesh` -> `public/modules/environment/obstacles/markers.ts`
- `createArenaControlStationMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createArenaHeliportMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createArenaHillClusterMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createArenaSpaceMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createArucoMarkerMapMesh` -> `public/modules/environment/obstacles/markers.ts`
- `createArucoMarkerMesh` -> `public/modules/environment/obstacles/markers.ts`
- `createAuxOptions` -> `public/modules/ui/settings/mapping.ts`
- `createAxesLabels` -> `public/modules/environment/ground.ts`
- `createAxesLabels.makeLabel` -> `public/modules/environment/ground.ts`
- `createAxisLabel` -> `public/modules/scene/transform.ts`
- `createAxisOptions` -> `public/modules/ui/settings/mapping.ts`
- `createCameraAndAntenna` -> `public/modules/drone-model/camera-antenna.ts`
- `createCargoMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createChargeStationMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createDroneModel` -> `public/modules/drone-model.ts`
- `createDroneState` -> `public/modules/state.ts`
- `createEditor` -> `public/modules/editor.ts`
- `createFireEffect` -> `public/modules/environment/obstacles/buildings.ts`
- `createFirTreeMesh` -> `public/modules/environment/obstacles/nature.ts`
- `createFlagMesh` -> `public/modules/environment/obstacles/competition.ts`
- `createForestPatchMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createFrame` -> `public/modules/drone-model/frame.ts`
- `createGateMesh` -> `public/modules/environment/obstacles/competition.ts`
- `createGeoskanArenaPreset` -> `public/modules/environment/obstacles/presets.ts`
- `createGround` -> `public/modules/environment/ground.ts`
- `createGroundPointLabel` -> `public/modules/scene/input.ts`
- `createGuard` -> `public/modules/drone-model/frame.ts`
- `createHillMesh` -> `public/modules/environment/obstacles/nature.ts`
- `createLandingPad` -> `public/modules/environment/obstacles/pads.ts`
- `createLEDs` -> `public/modules/drone-model/leds.ts`
- `createLegs` -> `public/modules/drone-model/frame.ts`
- `createLightTowerMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createLocusBeaconMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createMarkerMapMesh` -> `public/modules/environment/obstacles/markers.ts`
- `createMarkerMesh` -> `public/modules/environment/obstacles/markers.ts`
- `createMarkerTexture` -> `public/modules/environment/obstacles/markers.ts`
- `createMotors` -> `public/modules/drone-model/motors.ts`
- `createObstacles` -> `public/modules/environment/obstacles.ts`
- `createParkPatch` -> `public/modules/environment/obstacles/nature.ts`
- `createPylonMesh` -> `public/modules/environment/obstacles/competition.ts`
- `createRaceTrackPreset` -> `public/modules/environment/obstacles/presets.ts`
- `createRailwayMesh` -> `public/modules/environment/obstacles/linear.ts`
- `createResidentialPreset` -> `public/modules/environment/obstacles/presets.ts`
- `createRoadMesh` -> `public/modules/environment/obstacles/linear.ts`
- `createSettingsRuntimeState` -> `public/modules/ui/settings/runtime-state.ts`
- `createSettlementMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createSmokeEffect` -> `public/modules/environment/obstacles/buildings.ts`
- `createStartPositionMesh` -> `public/modules/environment/obstacles/arena.ts`
- `createStyledLandingPad` -> `public/modules/environment/obstacles/pads.ts`
- `createThiefEffect` -> `public/modules/environment/obstacles/buildings.ts`
- `createTransportMesh` -> `public/modules/environment/obstacles/pads.ts`
- `createTreeMesh` -> `public/modules/environment/obstacles/nature.ts`
- `createTrussArena` -> `public/modules/environment/truss-arena.ts`
- `createTrussArenaMesh` -> `public/modules/environment/truss-arena.ts`
- `createTrussArenaMesh.createTruss` -> `public/modules/environment/truss-arena.ts`
- `createVideoTowerMesh` -> `public/modules/environment/obstacles/arena.ts`
- `deleteSceneObjectById` -> `public/modules/scene/object-manager.ts`
- `deleteSelectedObject` -> `public/modules/scene/object-manager.ts`
- `deselectObject` -> `public/modules/scene/selection.ts`
- `detectAutoInput` -> `public/modules/ui/settings/auto-detect.ts`
- `detectAuxInput` -> `public/modules/ui/settings/wizard.ts`
- `detectPrimaryAxis` -> `public/modules/ui/settings/wizard.ts`
- `disposeObject3D` -> `public/modules/environment/obstacles/utils.ts`
- `disposeTrailForDrone` -> `public/modules/drone/trails.ts`
- `DroneOrbitControls.addEventListener` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.clampElevation` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.clampTargetToSceneBounds` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.dispatchEvent` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.isTransformInteractionActive` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.onPointerDown` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.onPointerMove` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.onPointerUp` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.onWheel` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.setTarget` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.syncSphericalFromCamera` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.syncTargetToPendingObjectIfInView` -> `public/modules/scene/DroneOrbitControls.ts`
- `DroneOrbitControls.update` -> `public/modules/scene/DroneOrbitControls.ts`
- `duplicateObject` -> `public/modules/scene/object-manager.ts`
- `ensureMappingsForGamepad` -> `public/modules/ui/settings/mapping.ts`
- `ensurePyodide` -> `public/modules/python/runtime.ts`
- `EventEmitter.emit` -> `public/modules/mce-events.ts`
- `EventEmitter.off` -> `public/modules/mce-events.ts`
- `EventEmitter.on` -> `public/modules/mce-events.ts`
- `exitTransformMode` -> `public/modules/scene/selection.ts`
- `explodeDrone` -> `public/modules/drone/crash-visuals.ts`
- `fallbackEditor` -> `public/modules/editor.ts`
- `findActiveGamepad` -> `public/modules/ui/settings/mapping.ts`
- `findClosestRangeByCenter` -> `public/modules/ui/settings/observed-inputs.ts`
- `findSceneObjectById` -> `public/modules/scene/object-catalog.ts`
- `finishCalibration` -> `public/modules/ui/settings/calibration.ts`
- `finishWizard` -> `public/modules/ui/settings/wizard.ts`
- `focusOrbitControlsOnObject` -> `public/modules/scene/scene-init.ts`
- `formatAuxRange` -> `public/modules/ui/settings/wizard.ts`
- `formatDataBlock` -> `tools/generate_marker_dictionaries.mjs`
- `formatModeRanges` -> `public/modules/ui/settings/wizard.ts`
- `formatPoints` -> `public/modules/scene/object-catalog.ts`
- `formatRefLabel` -> `public/modules/ui/settings/wizard.ts`
- `gateHasCollision` -> `public/modules/physics/collisions.ts`
- `getAnchorPosition` -> `public/modules/environment/obstacles/markers.ts`
- `getAuxCandidate` -> `public/modules/ui/settings/wizard.ts`
- `getAuxRange` -> `public/modules/ui/settings/channel-ranges.ts`
- `getBestAuxCandidate` -> `public/modules/ui/settings/wizard.ts`
- `getCargoMassKg` -> `public/modules/physics/magnet-gripper.ts`
- `getCargoVelocity` -> `public/modules/physics/magnet-gripper.ts`
- `getChannelLabel` -> `public/modules/ui/settings/auto-detect.ts`
- `getChannelLabel` -> `public/modules/ui/settings/rendering.ts`
- `getConnectedGamepads` -> `public/modules/ui/settings/mapping.ts`
- `getCurrentStep` -> `public/modules/ui/settings/wizard.ts`
- `getDefaultChannelValue` -> `public/modules/ui/settings/mapping.ts`
- `getDefaultDictionary` -> `public/modules/environment/obstacles/markers.ts`
- `getDetectedRef` -> `public/modules/ui/settings/wizard.ts`
- `getDictionaryDefinition` -> `public/modules/environment/obstacles/markers.ts`
- `getDroneFromLua` -> `public/modules/state.ts`
- `getDroneOrDefault` -> `public/modules/python/runtime.ts`
- `getEditorValue` -> `public/modules/editor.ts`
- `getFallbackMapping` -> `public/modules/ui/settings/mapping.ts`
- `getFirstConnectedGamepad` -> `public/modules/ui/settings/wizard.ts`
- `getFullWordAtPosition` -> `public/modules/editor/hover.ts`
- `getGamepadName` -> `public/modules/ui/settings/mapping.ts`
- `getGroundPointFromPointer` -> `public/modules/scene/input.ts`
- `getGuideLength` -> `public/modules/scene/transform.ts`
- `getLDocTemplate` -> `tools/audit_and_refactor.ts`
- `getMappingRef` -> `public/modules/ui/settings/mapping.ts`
- `getMappingRefForChannel` -> `public/modules/ui/settings/wizard.ts`
- `getMarkerDictionaryOptions` -> `public/modules/environment/obstacles/markers.ts`
- `getMarkerKindKey` -> `public/modules/environment/obstacles/markers.ts`
- `getMarkerMatrix` -> `public/modules/environment/obstacles/markers.ts`
- `getModeObservedPositions` -> `public/modules/ui/settings/channel-ranges.ts`
- `getModePrimaryAxisIndexes` -> `public/modules/ui/settings/mapping.ts`
- `getNormalizedRefValue` -> `public/modules/ui/settings/wizard.ts`
- `getObjectDisplayName` -> `public/modules/scene/input.ts`
- `getObservedPositions` -> `public/modules/ui/settings/observed-inputs.ts`
- `getObservedStats` -> `public/modules/ui/settings/channel-ranges.ts`
- `getObstacles` -> `public/modules/drone.ts`
- `getPreferredAuxRefs` -> `public/modules/ui/settings/mapping.ts`
- `getPreferredAuxRefs.pushIfUnused` -> `public/modules/ui/settings/mapping.ts`
- `getRcPrimaryAxisMapping` -> `public/modules/ui/settings/mapping.ts`
- `getRootSceneObject` -> `public/modules/scene/input.ts`
- `getRotationStepDegrees` -> `public/modules/scene/object-transform.ts`
- `getRotationStepOptions` -> `public/modules/scene/object-transform.ts`
- `getSceneTopLevelObjects` -> `public/modules/scene/object-catalog.ts`
- `getSelectedSceneObjectId` -> `public/modules/scene/object-manager.ts`
- `getStepStatusText` -> `public/modules/ui/settings/wizard.ts`
- `getStepTargetStick` -> `public/modules/ui/settings/wizard.ts`
- `getTracerColorHex` -> `public/modules/drone/trails.ts`
- `getTracerPointSize` -> `public/modules/drone/trails.ts`
- `getTracerWidthPx` -> `public/modules/drone/trails.ts`
- `getUsedRefs` -> `public/modules/ui/settings/wizard.ts`
- `getVisualChannelValue` -> `public/modules/ui/settings/wizard.ts`
- `getWindowSlots` -> `public/modules/environment/obstacles/buildings.ts`
- `gpio_new` -> `public/modules/lua/hardware.ts`
- `groupObjects` -> `public/modules/scene/object-manager.ts`
- `handleDeselection` -> `public/modules/scene/selection.ts`
- `handleSceneKeyDown` -> `public/modules/drone/scene-events.ts`
- `handleSelection` -> `public/modules/scene/input.ts`
- `hasInputRef` -> `public/modules/ui/settings/mapping.ts`
- `hasLegacyPrimaryMapping` -> `public/modules/ui/settings/mapping.ts`
- `hideRotationGuide` -> `public/modules/scene/transform.ts`
- `hideTransformUiPreserveSelection` -> `public/modules/scene/input.ts`
- `init` -> `public/main.ts`
- `init3D` -> `public/modules/drone.ts`
- `initCameraModeUI` -> `public/modules/ui/camera-mode.ts`
- `initContextMenu` -> `public/modules/ui/context-menu.ts`
- `initContextMenu.addButton` -> `public/modules/ui/context-menu.ts`
- `initContextMenu.addButton.run` -> `public/modules/ui/context-menu.ts`
- `initContextMenu.hide` -> `public/modules/ui/context-menu.ts`
- `initContextMenu.hideToolbar` -> `public/modules/ui/context-menu.ts`
- `initContextMenu.renderButtons` -> `public/modules/ui/context-menu.ts`
- `initContextMenu.renderToolbar` -> `public/modules/ui/context-menu.ts`
- `initContextMenu.renderToolbar.addToolbarButton` -> `public/modules/ui/context-menu.ts`
- `initContextMenu.setRotationStep` -> `public/modules/ui/context-menu.ts`
- `initContextMenu.setToolbarMode` -> `public/modules/ui/context-menu.ts`
- `initContextMenu.show` -> `public/modules/ui/context-menu.ts`
- `initDroneManager` -> `public/modules/ui/drone-manager.ts`
- `initDroneManager.updateList` -> `public/modules/ui/drone-manager.ts`
- `initEditor` -> `public/modules/editor.ts`
- `initFileControls` -> `public/modules/ui/file-controls.ts`
- `initHudControls` -> `public/modules/ui/hud-controls.ts`
- `initHudToggle` -> `public/modules/ui/hud-controls.ts`
- `initLEDMatrixUI` -> `public/modules/ui/led-matrix.ts`
- `initPythonRuntime` -> `public/modules/python/runtime.ts`
- `initScene` -> `public/modules/scene/scene-init.ts`
- `initSceneManager` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.appendIncidentEntry` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.clampFloors` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.clampInt` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.clampNumber` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.clampWindowFloor` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.clearIncidentEntries` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.fillDictionarySelect` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.format` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.getIncidentKey` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.getMarkerMode` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.isBuildingType` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.isEditorFocused` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.isMarkerMapType` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.isSingleMarkerType` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.isValueInputType` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.normalizeIncidentEntries` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.readAddMarkerMapOptions` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.render` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.serializeIncidentEntries` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.setBuildingControlsVisible` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.syncFloorLimit` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.syncIncidentValue` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.updateAddControlsState` -> `public/modules/ui/scene-manager.ts`
- `initSceneManager.updateMapSummary` -> `public/modules/ui/scene-manager.ts`
- `initSettingsUI` -> `public/modules/ui/settings.ts`
- `initSettingsUI.applyStickMode` -> `public/modules/ui/settings.ts`
- `initSettingsUI.beginCalibration` -> `public/modules/ui/settings.ts`
- `initSettingsUI.findCurrentActiveGamepad` -> `public/modules/ui/settings.ts`
- `initSettingsUI.finishCalibration` -> `public/modules/ui/settings.ts`
- `initSettingsUI.getModePositions` -> `public/modules/ui/settings.ts`
- `initSettingsUI.getObservedStatsForRef` -> `public/modules/ui/settings.ts`
- `initSettingsUI.hasChannelData` -> `public/modules/ui/settings.ts`
- `initSettingsUI.initMappingSelects` -> `public/modules/ui/settings.ts`
- `initSettingsUI.readChannelValue` -> `public/modules/ui/settings.ts`
- `initSettingsUI.renderAuxRangeEditorsState` -> `public/modules/ui/settings.ts`
- `initSettingsUI.renderCalibrationStateView` -> `public/modules/ui/settings.ts`
- `initSettingsUI.renderChannelDataStateView` -> `public/modules/ui/settings.ts`
- `initSettingsUI.renderChannelDefaultsState` -> `public/modules/ui/settings.ts`
- `initSettingsUI.renderMappingControlsStateView` -> `public/modules/ui/settings.ts`
- `initSettingsUI.renderModeMetaState` -> `public/modules/ui/settings.ts`
- `initSettingsUI.resetCalibration` -> `public/modules/ui/settings.ts`
- `initSettingsUI.resetDroneChannelsToSafeValues` -> `public/modules/ui/settings.ts`
- `initSettingsUI.resetObservedState` -> `public/modules/ui/settings.ts`
- `initSettingsUI.sampleObservedInputs` -> `public/modules/ui/settings.ts`
- `initSettingsUI.selectAuxPreset` -> `public/modules/ui/settings.ts`
- `initSettingsUI.setAutoStatusState` -> `public/modules/ui/settings.ts`
- `initSettingsUI.syncAuxRangeFromControls` -> `public/modules/ui/settings.ts`
- `initSettingsUI.syncConnectionState` -> `public/modules/ui/settings.ts`
- `initSettingsUI.syncSelectWithMappingState` -> `public/modules/ui/settings.ts`
- `initSettingsUI.updateCalibrationProgress` -> `public/modules/ui/settings.ts`
- `initSettingsUI.updateDroneChannels` -> `public/modules/ui/settings.ts`
- `initSettingsUI.updateGamepadState` -> `public/modules/ui/settings.ts`
- `initSidebar` -> `public/modules/ui/sidebar.ts`
- `initSidebar.refreshViewportLayout` -> `public/modules/ui/sidebar.ts`
- `initSidebar.syncSidebarCollapsedState` -> `public/modules/ui/sidebar.ts`
- `initSidebar.syncSidebarMode` -> `public/modules/ui/sidebar.ts`
- `initSimulationNotice` -> `public/modules/ui/simulation-notice.ts`
- `initSimulationNotice.hideNotice` -> `public/modules/ui/simulation-notice.ts`
- `initTrailForDrone` -> `public/modules/drone/trails.ts`
- `initUI` -> `public/modules/ui/index.ts`
- `initUI.updateObjectList` -> `public/modules/ui/index.ts`
- `initWizard` -> `public/modules/ui/settings/wizard.ts`
- `installJsRuntimeAPI` -> `public/modules/python/runtime.ts`
- `installPioneerSdkModule` -> `public/modules/python/runtime.ts`
- `intersectsExpandedBox` -> `public/modules/physics/collisions.ts`
- `isAllowedForChannel` -> `public/modules/ui/settings/mapping.ts`
- `isBetterAuxCandidate` -> `public/modules/ui/settings/wizard.ts`
- `isCargoObject` -> `public/modules/physics/magnet-gripper.ts`
- `isCurrentStepResolved` -> `public/modules/ui/settings/wizard.ts`
- `isDroneArmed` -> `public/modules/state.ts`
- `isDroneObject` -> `public/modules/scene/input.ts`
- `isGroundObject` -> `public/modules/scene/input.ts`
- `isLikelyRcTransmitter` -> `public/modules/ui/settings/mapping.ts`
- `isMarkerObject` -> `public/modules/environment/obstacles/markers.ts`
- `isScenePointerEvent` -> `public/modules/drone/scene-events.ts`
- `isTransformableObject` -> `public/modules/scene/object-catalog.ts`
- `js_init_leds` -> `public/modules/lua/leds.ts`
- `js_ledbar_set` -> `public/modules/lua/leds.ts`
- `js_sleep` -> `public/modules/lua/timers.ts`
- `layoutEditor` -> `public/modules/editor.ts`
- `ledbar_fromHSV` -> `public/modules/lua/leds.ts`
- `listSceneObjects` -> `public/modules/scene/object-catalog.ts`
- `loadFileContent` -> `public/main.ts`
- `loadGamepadSettings` -> `public/modules/state.ts`
- `loadScript` -> `public/modules/python/runtime.ts`
- `loadSources` -> `tools/generate_marker_dictionaries.mjs`
- `log` -> `public/modules/ui/logger.ts`
- `log` -> `public/modules/utils.ts`
- `luaToStr` -> `public/modules/utils.ts`
- `main` -> `tools/generate_marker_dictionaries.mjs`
- `makeCandidate` -> `public/modules/environment/obstacles/markers.ts`
- `makePathCurve` -> `public/modules/environment/obstacles/linear.ts`
- `matchesAuxRange` -> `public/modules/state.ts`
- `mergeObservedPositions` -> `public/modules/ui/settings/observed-inputs.ts`
- `normalizeCenteredAxis` -> `public/modules/ui/settings/calibration.ts`
- `normalizeMarkerDictionaryId` -> `public/modules/environment/obstacles/markers.ts`
- `normalizeMarkerMapOptions` -> `public/modules/environment/obstacles/markers.ts`
- `normalizeMarkerValue` -> `public/modules/environment/obstacles/markers.ts`
- `normalizePoints` -> `public/modules/scene/object-catalog.ts`
- `normalizeThrottleAxis` -> `public/modules/ui/settings/calibration.ts`
- `obstacleHasCollision` -> `public/modules/physics/collisions.ts`
- `onPointerDown` -> `public/modules/scene/input.ts`
- `onPointerUp` -> `public/modules/scene/input.ts`
- `onWindowResize` -> `public/modules/scene/scene-init.ts`
- `OrbitControls.addEventListener` -> `public/global.d.ts`
- `OrbitControls.dispatchEvent` -> `public/global.d.ts`
- `OrbitControls.dispose` -> `public/global.d.ts`
- `OrbitControls.getAzimuthalAngle` -> `public/global.d.ts`
- `OrbitControls.getPolarAngle` -> `public/global.d.ts`
- `OrbitControls.hasEventListener` -> `public/global.d.ts`
- `OrbitControls.removeEventListener` -> `public/global.d.ts`
- `OrbitControls.reset` -> `public/global.d.ts`
- `OrbitControls.saveState` -> `public/global.d.ts`
- `OrbitControls.update` -> `public/global.d.ts`
- `parseIncidentKind` -> `public/modules/environment/obstacles/buildings.ts`
- `parseMarkerId` -> `public/modules/environment/obstacles/markers.ts`
- `parsePointsText` -> `public/modules/scene/object-catalog.ts`
- `parseSourceArrays` -> `tools/generate_marker_dictionaries.mjs`
- `parseWindowIncidents` -> `public/modules/environment/obstacles/buildings.ts`
- `pickRepresentativePositions` -> `public/modules/ui/settings/observed-inputs.ts`
- `prepareCurrentStep` -> `public/modules/ui/settings/wizard.ts`
- `processLuaFile` -> `tools/audit_and_refactor.ts`
- `processLuaFile` -> `tools/revert_lua.ts`
- `pushCommand` -> `public/modules/mce-events.ts`
- `readInputRcValue` -> `public/modules/ui/settings/mapping.ts`
- `rebuildApartmentBuilding` -> `public/modules/environment/obstacles/buildings.ts`
- `rebuildLinearFeature` -> `public/modules/environment/obstacles/linear.ts`
- `registerScenePointerHandlers` -> `public/modules/drone/scene-events.ts`
- `rememberObservedInputValue` -> `public/modules/ui/settings/observed-inputs.ts`
- `rememberSelectedObjectInitialTransform` -> `public/modules/scene/object-transform.ts`
- `rememberSwitchTransition` -> `public/modules/ui/settings/wizard.ts`
- `renderApiDocs` -> `public/modules/ui/api-docs-ui.ts`
- `renderAutoButtons` -> `public/modules/ui/settings/rendering.ts`
- `renderAutoStatus` -> `public/modules/ui/settings/rendering.ts`
- `renderAuxRangeEditor` -> `public/modules/ui/settings/rendering.ts`
- `renderAuxRangeEditors` -> `public/modules/ui/settings/rendering.ts`
- `renderAuxRangePresetOptions` -> `public/modules/ui/settings/rendering.ts`
- `renderCalibrationState` -> `public/modules/ui/settings/rendering.ts`
- `renderChannelDataState` -> `public/modules/ui/settings/rendering.ts`
- `renderChannelDefaults` -> `public/modules/ui/settings/rendering.ts`
- `renderChannelValue` -> `public/modules/ui/settings/rendering.ts`
- `renderMappingControlsState` -> `public/modules/ui/settings/rendering.ts`
- `renderModeMeta` -> `public/modules/ui/settings/rendering.ts`
- `renderWizardState` -> `public/modules/ui/settings/wizard.ts`
- `resetCalibration` -> `public/modules/ui/settings/calibration.ts`
- `resetDroneToOrigin` -> `public/modules/scene/object-manager.ts`
- `resetDroneVisuals` -> `public/modules/drone/crash-visuals.ts`
- `resetObservedInputStats` -> `public/modules/ui/settings/observed-inputs.ts`
- `resetRuntimeStatePreservePose` -> `public/modules/state.ts`
- `resetSelectedObjectToInitialTransform` -> `public/modules/scene/object-transform.ts`
- `resetSimulation` -> `public/main.ts`
- `resetState` -> `public/modules/state.ts`
- `resetWizardBindings` -> `public/modules/ui/settings/wizard.ts`
- `resolvePhysicsMaterial` -> `public/modules/physics/materials.ts`
- `rotateSelectedObjectByDegrees` -> `public/modules/scene/object-transform.ts`
- `runCoroutine` -> `public/modules/lua/runner.ts`
- `runIntegrationTests` -> `public/modules/tests.ts`
- `runLuaScript` -> `public/modules/lua/index.ts`
- `runLuaTest` -> `tools/run_tests.ts`
- `runMCETests` -> `public/modules/mce-events.ts`
- `runMCETests.testCb` -> `public/modules/mce-events.ts`
- `runPythonScript` -> `public/modules/python/runtime.ts`
- `runUntilGroundContact` -> `tests/cargo-contact.test.ts`
- `sampleCalibration` -> `public/modules/ui/settings/calibration.ts`
- `sampleCurrentStep` -> `public/modules/ui/settings/wizard.ts`
- `sampleSegmentPoints` -> `public/modules/physics/collisions.ts`
- `saveGamepadSettings` -> `public/modules/state.ts`
- `scriptHasVisibleDelay` -> `public/main.ts`
- `selectSceneObjectById` -> `public/modules/scene/object-manager.ts`
- `sensors_accel` -> `public/modules/lua/sensors.ts`
- `sensors_battery` -> `public/modules/lua/sensors.ts`
- `sensors_gyro` -> `public/modules/lua/sensors.ts`
- `sensors_orientation` -> `public/modules/lua/sensors.ts`
- `sensors_pos` -> `public/modules/lua/sensors.ts`
- `sensors_range` -> `public/modules/lua/sensors.ts`
- `sensors_tof` -> `public/modules/lua/sensors.ts`
- `sensors_vel` -> `public/modules/lua/sensors.ts`
- `setAutoStatus` -> `public/modules/ui/settings/rendering.ts`
- `setAuxRange` -> `public/modules/ui/settings/channel-ranges.ts`
- `setCargoVelocity` -> `public/modules/physics/magnet-gripper.ts`
- `setCommonMeta` -> `public/modules/environment/obstacles/utils.ts`
- `setCurrentDrone` -> `public/modules/state.ts`
- `setCurrentScriptLanguage` -> `public/modules/state.ts`
- `setEditorLanguage` -> `public/modules/editor.ts`
- `setEditorValue` -> `public/modules/editor.ts`
- `setHelperRenderOrder` -> `public/modules/scene/transform.ts`
- `setIsHittingGizmo` -> `public/modules/scene/scene-init.ts`
- `setLocalFrameOrigin` -> `public/modules/lua/autopilot.ts`
- `setMappingRef` -> `public/modules/ui/settings/mapping.ts`
- `setMappingRefForChannel` -> `public/modules/ui/settings/wizard.ts`
- `setModeRange` -> `public/modules/ui/settings/channel-ranges.ts`
- `setPointerDownPos` -> `public/modules/scene/scene-init.ts`
- `setRotationStepDegrees` -> `public/modules/scene/object-transform.ts`
- `setSceneObjectTransformMode` -> `public/modules/scene/object-manager.ts`
- `setSelectedObject` -> `public/modules/scene/scene-init.ts`
- `setupCompletionProvider` -> `public/modules/editor/completion.ts`
- `setupEnvironment` -> `public/modules/environment.ts`
- `setupHoverProvider` -> `public/modules/editor/hover.ts`
- `setupLights` -> `public/modules/environment/lights.ts`
- `setupLuaBridgeForDrone` -> `public/modules/lua/index.ts`
- `setupSyntaxHighlighting` -> `public/modules/editor/syntax.ts`
- `setupTransformControlListeners` -> `public/modules/scene/transform.ts`
- `shouldCrashOnGroundImpact` -> `public/modules/physics/events.ts`
- `shouldShowTracerLine` -> `public/modules/drone/trails.ts`
- `shouldShowTracerPoints` -> `public/modules/drone/trails.ts`
- `shouldSkipCollisionForObject` -> `public/modules/physics/collisions.ts`
- `showGroundPoint` -> `public/modules/scene/input.ts`
- `showRotationGuide` -> `public/modules/scene/transform.ts`
- `showTransformUi` -> `public/modules/scene/input.ts`
- `simulateDetachedCargoStep` -> `public/modules/physics/cargo-contact.ts`
- `snapMarkerToSurface` -> `public/modules/environment/obstacles/markers.ts`
- `spi_new` -> `public/modules/lua/hardware.ts`
- `startAutoDetection` -> `public/modules/ui/settings/auto-detect.ts`
- `startSimulation` -> `public/main.ts`
- `startWizard` -> `public/modules/ui/settings/wizard.ts`
- `stopAutoDetection` -> `public/modules/ui/settings/auto-detect.ts`
- `stopLuaScript` -> `public/modules/lua/index.ts`
- `stopPythonScript` -> `public/modules/python/runtime.ts`
- `stopSimulation` -> `public/main.ts`
- `stopWizard` -> `public/modules/ui/settings/wizard.ts`
- `summarizeWindowIncidents` -> `public/modules/environment/obstacles/buildings.ts`
- `syncDrones` -> `public/modules/drone.ts`
- `syncOrbitControlsFromCamera` -> `public/modules/camera.ts`
- `syncRotationGuide` -> `public/modules/scene/transform.ts`
- `syncSelectWithMapping` -> `public/modules/ui/settings/rendering.ts`
- `syncViewportDependentSceneVisuals` -> `public/modules/scene/scene-init.ts`
- `sys_deltaTime` -> `public/modules/lua/timers.ts`
- `sys_time` -> `public/modules/lua/timers.ts`
- `timer_callLater` -> `public/modules/lua/timers.ts`
- `timer_new` -> `public/modules/lua/timers.ts`
- `toggleMultiSelectObject` -> `public/modules/scene/scene-init.ts`
- `toPointList` -> `public/modules/environment/obstacles/linear.ts`
- `toRangePercent` -> `public/modules/ui/settings/rendering.ts`
- `toRangeVisualPercent` -> `public/modules/ui/settings/rendering.ts`
- `traceClick` -> `public/modules/scene/input.ts`
- `TransformControls.addEventListener` -> `public/global.d.ts`
- `TransformControls.attach` -> `public/global.d.ts`
- `TransformControls.detach` -> `public/global.d.ts`
- `TransformControls.dispatchEvent` -> `public/global.d.ts`
- `TransformControls.dispose` -> `public/global.d.ts`
- `TransformControls.getMode` -> `public/global.d.ts`
- `TransformControls.hasEventListener` -> `public/global.d.ts`
- `TransformControls.removeEventListener` -> `public/global.d.ts`
- `TransformControls.reset` -> `public/global.d.ts`
- `TransformControls.setMode` -> `public/global.d.ts`
- `TransformControls.setRotationSnap` -> `public/global.d.ts`
- `TransformControls.setScaleSnap` -> `public/global.d.ts`
- `TransformControls.setSize` -> `public/global.d.ts`
- `TransformControls.setSpace` -> `public/global.d.ts`
- `TransformControls.setTranslationSnap` -> `public/global.d.ts`
- `triggerEvent` -> `public/modules/mce-events.ts`
- `triggerLuaCallback` -> `public/modules/lua/index.ts`
- `uart_new` -> `public/modules/lua/hardware.ts`
- `ungroupObject` -> `public/modules/scene/object-manager.ts`
- `updateApartmentBuildingIncidents` -> `public/modules/environment/obstacles/buildings.ts`
- `updateApartmentBuildingMetadata` -> `public/modules/environment/obstacles/buildings.ts`
- `updateBar` -> `public/modules/ui/settings/rendering.ts`
- `updateCamera` -> `public/modules/camera.ts`
- `updateDebrisVisuals` -> `public/modules/drone/crash-visuals.ts`
- `updateDetachedCargoPhysics` -> `public/modules/physics/magnet-gripper.ts`
- `updateDrone3D` -> `public/modules/drone.ts`
- `updateLEDs` -> `public/modules/drone-model.ts`
- `updateLinearFeaturePoints` -> `public/modules/environment/obstacles/linear.ts`
- `updateMagnetGripper` -> `public/modules/physics/magnet-gripper.ts`
- `updateMarkerMaterials` -> `public/modules/environment/obstacles/markers.ts`
- `updateMarkerValue` -> `public/modules/environment/obstacles/markers.ts`
- `updateObjectSelectionVisuals` -> `public/modules/scene/input.ts`
- `updatePhysics` -> `public/modules/physics.ts`
- `updateSceneObjectDetails` -> `public/modules/ui/index.ts`
- `updateSceneObjectPoints` -> `public/modules/environment.ts`
- `updateSceneObjectValue` -> `public/modules/environment.ts`
- `updateSelectedSceneObject` -> `public/modules/scene/object-manager.ts`
- `updateStats` -> `public/modules/ui/stats.ts`
- `updateStickVisuals` -> `public/modules/ui/settings/wizard.ts`
- `updateTimers` -> `public/modules/lua/index.ts`
- `updateTrailForDrone` -> `public/modules/drone/trails.ts`
- `updateTransformModeDecorations` -> `public/modules/scene/transform.ts`
- `walkDir` -> `tools/audit_and_refactor.ts`
- `walkDir` -> `tools/revert_lua.ts`
- `walkDir` -> `tools/run_tests.ts`
- `warnAboutInstantExecution` -> `public/main.ts`
- `wizardLoop` -> `public/modules/ui/settings/wizard.ts`
- `wrapMarkerId` -> `public/modules/environment/obstacles/markers.ts`
