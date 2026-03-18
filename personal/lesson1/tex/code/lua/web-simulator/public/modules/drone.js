
import { simState, pathPoints, MAX_PATH_POINTS } from './state.js';
import { log } from './ui.js';
import { runIntegrationTests } from './tests.js';

let scene, camera, renderer, controls;
let droneMesh, flightPath, pathGeometry, pathMaterial, particles;
export let is3DActive = false;
let canvasContainer;

// Environment objects
let envGroup;

// Interaction
let raycaster, mouse;
let selectedObject = null;
let isDragging = false;
let dragPlane = new THREE.Plane();
let dragOffset = new THREE.Vector3();
let transformControl;

// Internal 2D fallback context
let ctx2d = null;
let canvas2d = null;

export function init3D(container, retries = 3) {
    canvasContainer = container;
    const errorPrefix = "[3D-LOADER]";
    try {
        if (typeof THREE === 'undefined') {
            if (retries > 0) {
                console.log(`${errorPrefix} THREE is undefined, retrying in 500ms... (${retries} left)`);
                setTimeout(() => init3D(container, retries - 1), 500);
                return;
            }
            throw new Error("THREE is undefined after retries. Script not loaded or blocked.");
        }
        
        scene = new THREE.Scene();
        is3DActive = true;
        scene.background = new THREE.Color(0x0f172a);
        
        // Fog for depth
        scene.fog = new THREE.FogExp2(0x0f172a, 0.02);

        const aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        camera.position.set(3, 3, 3);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        canvasContainer.innerHTML = '';
        canvasContainer.appendChild(renderer.domElement);

        // FPV Overlay Container
        createFPVOverlay();

        // Orbit Controls
        let OC = window.OrbitControls;
        if (typeof OC !== 'function' && typeof THREE.OrbitControls === 'function') {
            OC = THREE.OrbitControls;
        }
        
        if (typeof OC === 'function') {
            controls = new OC(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            
            // Fix Pitch limitations: Allow full spherical view, including from below.
            // Removed maxPolarAngle restriction to allow full -90 to +90 pitch (and beyond)
            controls.minPolarAngle = 0; 
            controls.maxPolarAngle = Math.PI; // Full 180 degrees pitch (top to bottom)
            
            // Allow full 360 degree Yaw (Azimuth Angle)
            controls.minAzimuthAngle = -Infinity;
            controls.maxAzimuthAngle = Infinity;
            
            controls.minDistance = 0.5;
            controls.maxDistance = 100;
            // Initially disabled unless in free mode
            controls.enabled = false;
        } else {
            console.warn(`${errorPrefix} OrbitControls not found, continuing without mouse controls.`);
            log('OrbitControls not found. Interactive camera disabled.', 'warn');
        }

        // Transform Controls
        if (typeof THREE.TransformControls === 'function') {
            transformControl = new THREE.TransformControls(camera, renderer.domElement);
            transformControl.addEventListener('dragging-changed', function (event) {
                if (controls) controls.enabled = !event.value && window.cameraMode === 'free';
            });
            transformControl.addEventListener('change', function () {
                if (selectedObject === droneMesh) {
                    simState.pos.x = droneMesh.position.x;
                    simState.pos.y = droneMesh.position.y;
                    simState.pos.z = Math.max(0, droneMesh.position.z);
                    droneMesh.position.z = simState.pos.z;
                }
            });
            scene.add(transformControl);
        } else {
            log('TransformControls not found. Object moving disabled.', 'warn');
        }
        
        // Initialize scene objects
        setupSceneObjects();
        
        // Initialize Interaction
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        canvasContainer.addEventListener('mousedown', onMouseDown);
        // Prevent default context menu to show our custom one
        canvasContainer.addEventListener('contextmenu', e => e.preventDefault());
        
        // canvasContainer.addEventListener('mousemove', onMouseMove); // Removed old drag logic
        // window.addEventListener('mouseup', onMouseUp); // Removed old drag logic
        window.addEventListener('keydown', onKeyDown);
        
        log('3D Engine initialized successfully.', 'success');
        
        // Window resize handler
        window.addEventListener('resize', onWindowResize, false);
        
        // Initial camera update to set directions
        updateCamera();
        
        // Run integration tests
        setTimeout(() => runIntegrationTests(droneMesh, camera, controls), 1000);
        
    } catch (e) {
        is3DActive = false;
        console.error(`${errorPrefix} Critical error:`, e);
        log(`3D failed to load: ${e.message}. Using 2D fallback.`, 'error');
        show2DFallback(e.message.includes("THREE") ? "LIB_MISSING" : "WEBGL_ERR");
    }
}

function onMouseDown(event) {
    if (simState.running) return; // Don't interact while flying
    if (window.cameraMode === 'fpv') return; // Don't interact in FPV
    if (transformControl && transformControl.dragging) return;

    // Handle left click (select) or right click (context menu)
    if (event.button === 0 || event.button === 2) {
        if (window.hideContextMenu) window.hideContextMenu();
        
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const interactables = [droneMesh, ...envGroup.children].filter(o => o.visible);
        const intersects = raycaster.intersectObjects(interactables, true);
        
        if (intersects.length > 0) {
            let obj = intersects[0].object;
            while(obj.parent && obj.parent !== scene && obj.parent !== envGroup) {
                obj = obj.parent;
            }
            
            if (obj === droneMesh || obj.userData.draggable) {
                selectedObject = obj;
                highlightObject(selectedObject, true);
                
                // Show modal context menu on LKM or RKM
                if (window.showContextMenu) {
                    window.showContextMenu(event.clientX, event.clientY, 
                        // On Move
                        () => {
                            if (transformControl) {
                                transformControl.attach(selectedObject);
                                transformControl.setMode('translate');
                            }
                        },
                        // On Delete
                        () => {
                            deleteSelectedObject();
                        }
                    );
                }
            }
        } else {
            // Clicked on empty space
            if (selectedObject) highlightObject(selectedObject, false);
            selectedObject = null;
            if (transformControl) transformControl.detach();
        }
        return;
    }
}

// Old onMouseMove and onMouseUp removed since TransformControls handles it
function onKeyDown(event) {
    if (!selectedObject) return;
    if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelectedObject();
    }
    // Switch Gizmo mode
    if (transformControl) {
        switch (event.key.toLowerCase()) {
            case 't': transformControl.setMode('translate'); break;
            case 'r': transformControl.setMode('rotate'); break;
            case 's': transformControl.setMode('scale'); break;
        }
    }
}

export function deleteSelectedObject() {
    if (selectedObject && selectedObject !== droneMesh) {
        if (transformControl) transformControl.detach();
        envGroup.remove(selectedObject);
        selectedObject = null;
        log('Объект удален', 'info');
    }
}

function highlightObject(obj, active) {
    // Simple visual feedback could be implemented here
    // For now just log
    if(active) log(`Выбран: ${obj.userData.type || 'Дрон'}`);
}

export function addObject(type) {
    if (!envGroup) return;
    let obj;
    if (type === 'gate') {
        obj = createGateMesh();
        obj.position.set(0, 0, 0);
    } else if (type === 'pylon') {
        obj = createPylonMesh();
        obj.position.set(0, 0, 0);
    } else if (type === 'flag') {
        obj = createFlagMesh();
        obj.position.set(0, 0, 0);
    }
    
    if (obj) {
        // Place in front of camera
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.multiplyScalar(5);
        const pos = camera.position.clone().add(dir);
        obj.position.set(pos.x, pos.y, 0); // Snap to ground
        
        envGroup.add(obj);
        selectedObject = obj; // Auto select
        log(`Добавлен: ${type}`, 'success');
    }
}

function createGateMesh() {
    const group = new THREE.Group();
    group.userData.draggable = true;
    group.userData.type = 'Ворота';
    
    const mat = new THREE.MeshStandardMaterial({ color: 0xff8800, roughness: 0.7, emissive: 0xff4400, emissiveIntensity: 0.1 });
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.5 });
    
    const legGeom = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const leg1 = new THREE.Mesh(legGeom, mat); leg1.position.set(0, -0.75, 1); leg1.rotation.x = Math.PI/2;
    const leg2 = new THREE.Mesh(legGeom, mat); leg2.position.set(0, 0.75, 1); leg2.rotation.x = Math.PI/2;
    group.add(leg1); group.add(leg2);
    
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.1, 16, 32), ringMat);
    torus.position.z = 1.5;
    torus.rotation.y = Math.PI/2;
    group.add(torus);
    
    group.traverse(o => { if(o.isMesh) { o.castShadow = true; o.receiveShadow = true; }});
    return group;
}

function createPylonMesh() {
    const pylonGeom = new THREE.ConeGeometry(0.3, 2, 8);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.8 });
    const pylon = new THREE.Mesh(pylonGeom, pylonMat);
    pylon.rotation.x = Math.PI/2;
    pylon.position.z = 1;
    pylon.userData.draggable = true;
    pylon.userData.type = 'Пилон';
    pylon.castShadow = true;
    pylon.receiveShadow = true;
    return pylon;
}

function createFlagMesh() {
    const group = new THREE.Group();
    group.userData.draggable = true;
    group.userData.type = 'Флаг';
    
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    pole.rotation.x = Math.PI/2;
    pole.position.z = 1;
    group.add(pole);
    
    const flag = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.6, 0.4), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
    flag.position.set(0, 0.3, 1.8);
    group.add(flag);
    
    return group;
}

function createFPVOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'fpv-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s';
    overlay.style.background = 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjUiIG51bU9jdGF2ZXM9IjEiIHN0aXRjaFRpbGVzPSJub1N0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+")';
    overlay.style.mixBlendMode = 'overlay';
    // Scanlines
    overlay.style.backgroundImage += ', linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))';
    overlay.style.backgroundSize = '100% 2px, 3px 100%';
    canvasContainer.appendChild(overlay);
}

function setupSceneObjects() {
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(20, 30, 20);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -30;
    mainLight.shadow.camera.right = 30;
    mainLight.shadow.camera.top = 30;
    mainLight.shadow.camera.bottom = -30;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);
    
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 0.4);
    scene.add(hemiLight);

    // Environment Group
    envGroup = new THREE.Group();
    scene.add(envGroup);

    // Ground Plane with Grid Texture
    const groundSize = 200;
    const groundGeom = new THREE.PlaneGeometry(groundSize, groundSize);
    
    // Procedural Grid Texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0,0,1024,1024);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    // 1m grid (assuming texture maps to some size)
    const step = 64; // 1024 / 16 cells
    for(let i=0; i<=1024; i+=step) {
        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,1024); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(1024,i); ctx.stroke();
    }
    // Subgrid
    ctx.strokeStyle = '#172033';
    ctx.lineWidth = 1;
    const subStep = 16;
    for(let i=0; i<=1024; i+=subStep) {
        if (i%step === 0) continue;
        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,1024); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(1024,i); ctx.stroke();
    }
    
    const gridTex = new THREE.CanvasTexture(canvas);
    gridTex.wrapS = THREE.RepeatWrapping;
    gridTex.wrapT = THREE.RepeatWrapping;
    gridTex.repeat.set(groundSize/16, groundSize/16); // 1 cell approx 1 meter
    gridTex.anisotropy = 16;

    const groundMat = new THREE.MeshStandardMaterial({ 
        map: gridTex,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.receiveShadow = true;
    envGroup.add(ground);

    // Obstacles (Gates & Pylons)
    createObstacles();

    const axesHelper = new THREE.AxesHelper(2);
    axesHelper.position.z = 0.01;
    scene.add(axesHelper);

    // Labels for Axes
    createAxesLabels();

    // Drone Model
    droneMesh = createDroneModel();
    droneMesh.up.set(0, 0, 1);
    droneMesh.castShadow = true;
    scene.add(droneMesh);

    // Flight Path
    pathGeometry = new THREE.BufferGeometry();
    pathMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8, opacity: 0.6, transparent: true, linewidth: 2 });
    flightPath = new THREE.Line(pathGeometry, pathMaterial);
    scene.add(flightPath);

    // Particles
    const particleGeom = new THREE.BufferGeometry();
    const particleMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.08, transparent: true, opacity: 0.8 });
    particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);
}

function createObstacles() {
    // Gate 1 (+X)
    const gate1 = createGateMesh();
    gate1.position.set(5, 0, 0);
    envGroup.add(gate1);

    // Gate 2 (+Y)
    const gate2 = createGateMesh();
    gate2.position.set(5, 5, 0);
    gate2.rotation.z = Math.PI/4;
    envGroup.add(gate2);
    
    // Gate 3 (-Y) - Added for symmetry
    const gate3 = createGateMesh();
    gate3.position.set(5, -5, 0);
    gate3.rotation.z = -Math.PI/4;
    envGroup.add(gate3);
    
    // Pylons
    for(let i=0; i<5; i++) {
        const pylon = createPylonMesh();
        pylon.position.set(-5, -5 + i*2.5, 1);
        envGroup.add(pylon);
    }
}

function createAxesLabels() {
    const makeLabel = (text, pos, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, 32, 48);
        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex });
        const sprite = new THREE.Sprite(mat);
        sprite.position.copy(pos);
        sprite.scale.set(0.5, 0.5, 0.5);
        scene.add(sprite);
    };
    makeLabel('X', new THREE.Vector3(2.2, 0, 0.2), '#f87171');
    makeLabel('Y', new THREE.Vector3(0, 2.2, 0.2), '#4ade80');
    makeLabel('Z', new THREE.Vector3(0, 0, 2.2), '#38bdf8');
}

function createDroneModel() {
    const droneGroup = new THREE.Group();
    
    // Materials
    const carbonMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        roughness: 0.4, 
        metalness: 0.3,
        map: null // Could add carbon fiber texture here
    });
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.6 });
    const plasticMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.9 });
    const propMatCW = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, transparent: true, opacity: 0.9 });
    const propMatCCW = new THREE.MeshStandardMaterial({ color: 0xf87171, transparent: true, opacity: 0.9 });

    // Frame Plates
    const plateGeom = new THREE.BoxGeometry(0.14, 0.14, 0.002);
    const bottomPlate = new THREE.Mesh(plateGeom, carbonMat);
    bottomPlate.position.z = -0.015;
    bottomPlate.castShadow = true;
    droneGroup.add(bottomPlate);
    
    const topPlate = new THREE.Mesh(plateGeom, carbonMat);
    topPlate.position.z = 0.035;
    topPlate.castShadow = true;
    droneGroup.add(topPlate);
    
    // Stack
    const stackGeom = new THREE.BoxGeometry(0.06, 0.06, 0.03);
    const stack = new THREE.Mesh(stackGeom, pcbMat);
    stack.position.z = 0.01;
    stack.castShadow = true;
    droneGroup.add(stack);

    // Arms
    const armGeom = new THREE.BoxGeometry(0.45, 0.03, 0.01);
    const arm1 = new THREE.Mesh(armGeom, plasticMat);
    arm1.rotation.z = Math.PI / 4;
    arm1.castShadow = true;
    droneGroup.add(arm1);
    const arm2 = new THREE.Mesh(armGeom, plasticMat);
    arm2.rotation.z = -Math.PI / 4;
    arm2.castShadow = true;
    droneGroup.add(arm2);

    // Battery
    const batGeom = new THREE.BoxGeometry(0.09, 0.04, 0.025);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 });
    const battery = new THREE.Mesh(batGeom, batMat);
    battery.position.z = -0.04;
    battery.castShadow = true;
    droneGroup.add(battery);

    // Camera Module (Front)
    const camGroup = new THREE.Group();
    camGroup.position.set(0.07, 0, 0.02);
    
    const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0x000000 }));
    camGroup.add(camBody);
    
    const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.01, 16),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0, metalness: 0.8 })
    );
    lens.rotation.z = Math.PI / 2;
    lens.position.x = 0.01;
    camGroup.add(lens);
    
    // FPV Camera Logic Object
    const fpvCamera = new THREE.PerspectiveCamera(80, 16/9, 0.01, 1000);
    fpvCamera.rotation.set(0, -Math.PI / 2, -Math.PI / 2); // Pitch -90 (Look +X), Roll -90
    fpvCamera.position.x = 0.02;
    camGroup.add(fpvCamera);
    window.fpvCamera = fpvCamera;
    
    droneGroup.add(camGroup);

    // Antenna
    const ant = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.002, 0.08, 8),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    ant.position.set(-0.05, 0, 0.08);
    ant.rotation.x = 0.2;
    droneGroup.add(ant);

    // Orientation Arrow
    const arrowHelper = new THREE.Group();
    arrowHelper.name = 'orientation_arrow';
    const arrowShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.2, 12), new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 }));
    arrowShaft.rotation.z = Math.PI; // points along -Y (down in 2D), need to rotate to point along +Y or +X
    // Actually, Cylinder is Y-up by default. 
    // If we want it to point along +Y (Left in body frame?), user said "points along X, not Y".
    // User wants arrow to point along Y.
    // Body Frame: +X is Front. +Y is Left.
    // If user wants arrow along Y, it means pointing to the Left side? 
    // OR maybe user thinks +Y is Forward?
    // In standard Pioneer: +X is Forward.
    // If user says "arrow points along X, not Y" and complains, maybe they think Y should be forward?
    // Let's assume user wants the arrow to point along +Y axis of the world/drone.
    
    // Wait, let's look at the request: "стрелка дрона все еще смотрит вдоль оси Х, а не Y"
    // Does the user WANT it to point along Y? 
    // "arrow points along X (current), not Y (desired)" -> Make it point along Y.
    
    // Cylinder geometry is aligned along Y axis by default.
    // To point along +Y, we just need no rotation (or Z rotation 0).
    arrowShaft.rotation.z = 0; 
    arrowHelper.add(arrowShaft);
    
    const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.06, 12), new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 }));
    arrowHead.position.y = 0.1; // Place at tip of Y-aligned shaft
    arrowHelper.add(arrowHead);
    
    arrowHelper.position.z = 0.15;
    
    droneGroup.add(arrowHelper);

    // Motors & Props
    const motorGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.03, 16);
    // X-configuration:
    // Front Right (CW), Back Left (CW) - Props Standard
    // Front Left (CCW), Back Right (CCW) - Props Reversed
    // Coordinates: Front is +X, Left is +Y
    // 0: Front Right (+X, -Y)
    // 1: Back Left (-X, +Y)
    // 2: Front Left (+X, +Y)
    // 3: Back Right (-X, -Y)
    const armLen = 0.16;
    const motorOffsets = [
        [armLen, -armLen],  // FR
        [-armLen, armLen],  // BL
        [armLen, armLen],   // FL
        [-armLen, -armLen]  // BR
    ];
    
    motorOffsets.forEach((offset, i) => {
        const motor = new THREE.Mesh(motorGeom, motorMat);
        motor.position.set(offset[0], offset[1], 0.02);
        motor.rotation.x = Math.PI / 2;
        motor.castShadow = true;
        droneGroup.add(motor);
        
        const propGroup = new THREE.Group();
        propGroup.name = `rotor_${i}`;
        propGroup.position.set(offset[0], offset[1], 0.04);
        
        // Prop Hub
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.01, 8), motorMat);
        hub.rotation.x = Math.PI / 2;
        propGroup.add(hub);
        
        // Blades
        const isCCW = (i === 2 || i === 3); // Check flight controller config usually
        // Let's assume standard Quad X:
        // 1 (FR) - CCW, 2 (BL) - CCW, 3 (FL) - CW, 4 (BR) - CW ?
        // Actually Pioneer might differ. Let's stick to visual distinction.
        // Diagonals match.
        const isDiag1 = (i === 0 || i === 1);
        
        const bladeMat = isDiag1 ? propMatCW : propMatCCW;
        const bladeGeom = new THREE.BoxGeometry(0.12, 0.015, 0.001);
        
        const blade = new THREE.Mesh(bladeGeom, bladeMat);
        // Twist
        blade.rotation.x = 0.1 * (isDiag1 ? 1 : -1);
        propGroup.add(blade);
        
        droneGroup.add(propGroup);
    });

    return droneGroup;
}

export function updateDrone3D() {
    if (!is3DActive) {
        if (typeof draw2DFallback === 'function') draw2DFallback();
        return;
    }
    if (!droneMesh) return;
    
    // 1. Update Position & Orientation
    droneMesh.position.set(simState.pos.x, simState.pos.y, simState.pos.z);
    droneMesh.rotation.set(simState.orientation.roll, simState.orientation.pitch, simState.orientation.yaw);

    // 2. Update LEDs
    updateLEDs();

    // 3. Update Path & Particles
    updateTrail();

    // 4. Camera Logic
    updateCamera();

    // 5. Rotor Animation
    animateRotors();

    // 6. Arrow Scale
    updateArrowScale();

    renderer.render(scene, camera);
}

function updateLEDs() {
    if (simState.leds && simState.leds.length > 0) {
        const ledCount = 4;
        for (let i = 0; i < ledCount; i++) {
            const led = simState.leds[i] || {r:0, g:0, b:0, w:0};
            let ledMesh = droneMesh.getObjectByName(`led_${i}`);
            if (!ledMesh) {
                const ledGeom = new THREE.SphereGeometry(0.012, 12, 12);
                const ledMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
                ledMesh = new THREE.Mesh(ledGeom, ledMat);
                ledMesh.name = `led_${i}`;
                const offset = 0.04;
                const positions = [[offset, offset], [offset, -offset], [-offset, -offset], [-offset, offset]];
                ledMesh.position.set(positions[i][0], positions[i][1], 0.038);
                droneMesh.add(ledMesh);
                const light = new THREE.PointLight(0x000000, 0, 0.4);
                light.name = `led_light_${i}`;
                ledMesh.add(light);
            }
            const color = new THREE.Color((led.r||0)/255, (led.g||0)/255, (led.b||0)/255);
            ledMesh.material.color.set(color);
            const light = ledMesh.getObjectByName(`led_light_${i}`);
            if (light) {
                light.color.set(color);
                light.intensity = (led.r + led.g + led.b > 0) ? 0.6 : 0;
            }
        }
    }
}

function updateTrail() {
    if (simState.status !== 'ГОТОВ' && simState.status !== 'ПРИЗЕМЛЕН' && simState.running && is3DActive) {
        const point = { x: simState.pos.x, y: simState.pos.y, z: simState.pos.z };
        pathPoints.push(point);
        if (pathPoints.length > MAX_PATH_POINTS) pathPoints.shift();
        
        if (pathGeometry && particles) {
            const threePoints = pathPoints.map(p => new THREE.Vector3(p.x, p.y, p.z));
            pathGeometry.setFromPoints(threePoints);
            particles.geometry.setFromPoints(threePoints);
        }
    }
}

function updateCamera() {
    const mode = window.cameraMode || 'drone';
    const overlay = document.getElementById('fpv-overlay');
    
    // Disable controls if not free mode to avoid conflict
    if (controls) {
        controls.enabled = (mode === 'free');
    }
    
    // FPV Overlay Logic
    if (mode === 'fpv') {
        if (overlay) overlay.style.opacity = '1';
    } else {
        if (overlay) overlay.style.opacity = '0';
    }

    if (mode === 'drone') {
        // Smooth Chase Camera
        const relativeOffset = new THREE.Vector3(-0.8, 0, 0.4);
        const cameraOffset = relativeOffset.applyMatrix4(droneMesh.matrixWorld);
        
        // Smooth Lerp
        camera.position.lerp(cameraOffset, 0.1);
        
        // Look at slightly ahead of drone
        const lookTarget = droneMesh.position.clone();
        lookTarget.z += 0.1; // Look slightly above center
        
        // Smooth lookAt by slerping quaternion
        const targetRotation = new THREE.Quaternion();
        const m = new THREE.Matrix4();
        m.lookAt(camera.position, lookTarget, camera.up);
        targetRotation.setFromRotationMatrix(m);
        camera.quaternion.slerp(targetRotation, 0.1);

    } else if (mode === 'fpv') {
        if (window.fpvCamera) {
            const camWorldPos = new THREE.Vector3();
            window.fpvCamera.getWorldPosition(camWorldPos);
            const camWorldRot = new THREE.Quaternion();
            window.fpvCamera.getWorldQuaternion(camWorldRot);
            
            // Fast lerp for position to reduce jitter but keep it smooth
            camera.position.lerp(camWorldPos, 0.5);
            camera.quaternion.slerp(camWorldRot, 0.5);
            
            // Fix rotation: rotate -90 around local Z to align Up vector
            camera.rotateZ(-Math.PI / 2);
        }
    } else if (mode === 'ground') {
        // Fixed ground position, looking at drone
        const groundPos = new THREE.Vector3(3, 3, 2);
        camera.position.lerp(groundPos, 0.05);
        
        const targetRotation = new THREE.Quaternion();
        const m = new THREE.Matrix4();
        m.lookAt(camera.position, droneMesh.position, camera.up);
        targetRotation.setFromRotationMatrix(m);
        camera.quaternion.slerp(targetRotation, 0.1);
        
    } else if (mode === 'free') {
        if (controls) controls.update();
    }
}

function animateRotors() {
    const isArmed = simState.status !== 'ГОТОВ' && simState.status !== 'IDLE' && simState.status !== 'ПРИЗЕМЛЕН';
    if (isArmed) {
        for (let i = 0; i < 4; i++) {
            const rotor = droneMesh.getObjectByName(`rotor_${i}`);
            if (rotor) {
                const dir = (i === 0 || i === 1) ? 1 : -1; // Match blade setup
                const speed = (simState.status === 'ВЗВЕДЕН') ? 0.3 : 0.8;
                rotor.rotation.z += speed * dir;
            }
        }
    }
}

function updateArrowScale() {
    const arrow = droneMesh.getObjectByName('orientation_arrow');
    if (arrow && camera) {
        const dist = camera.position.distanceTo(droneMesh.position);
        const scale = Math.max(1, dist * 0.15);
        arrow.scale.set(scale, scale, scale);
    }
}

// 2D Fallback logic (Keep simplified)
function show2DFallback(reason = "UNKNOWN") {
    // ... same as before ...
}

function draw2DFallback() {
   // ... same as before ...
}

function onWindowResize() {
    if (!canvasContainer) return;
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    if (camera && renderer) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
}
