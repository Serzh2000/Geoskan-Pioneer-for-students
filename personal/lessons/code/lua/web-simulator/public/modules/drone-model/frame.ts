import * as THREE from 'three';

export function createFrame(carbonMat: THREE.Material, pcbMat: THREE.Material, plasticMat: THREE.Material) {
    const frameGroup = new THREE.Group();
    
    // Frame Plates
    const plateGeom = new THREE.BoxGeometry(0.14, 0.14, 0.002);
    const bottomPlate = new THREE.Mesh(plateGeom, carbonMat);
    bottomPlate.position.z = -0.015;
    bottomPlate.castShadow = true;
    frameGroup.add(bottomPlate);
    
    const topPlate = new THREE.Mesh(plateGeom, carbonMat);
    topPlate.position.z = 0.035;
    topPlate.castShadow = true;
    frameGroup.add(topPlate);
    
    // Stack (Electronics)
    const pcbGeom = new THREE.BoxGeometry(0.06, 0.06, 0.002);
    const pcb1 = new THREE.Mesh(pcbGeom, pcbMat);
    pcb1.position.z = 0.005;
    pcb1.castShadow = true;
    frameGroup.add(pcb1);

    const pcb2 = new THREE.Mesh(pcbGeom, pcbMat);
    pcb2.position.z = 0.025;
    pcb2.castShadow = true;
    frameGroup.add(pcb2);

    // Components on PCB (simulating the photo)
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

    // Central Chip
    const chipGeom = new THREE.BoxGeometry(0.02, 0.02, 0.005);
    const chip = new THREE.Mesh(chipGeom, blackMat);
    chip.position.z = 0.028;
    frameGroup.add(chip);

    // Red components (4 resistors/switches)
    const redCompGeom = new THREE.BoxGeometry(0.015, 0.008, 0.008);
    const redPositions = [
        [0.02, 0.01, 0.03], [0.02, -0.01, 0.03],
        [-0.02, 0.01, 0.03], [-0.02, -0.01, 0.03]
    ];
    redPositions.forEach(pos => {
        const comp = new THREE.Mesh(redCompGeom, redMat);
        comp.position.set(pos[0], pos[1], pos[2]);
        frameGroup.add(comp);
    });

    // Yellow connectors and wires on arms
    const connGeom = new THREE.BoxGeometry(0.015, 0.012, 0.008);
    const armOffsets = [
        [0.06, 0.06], [0.06, -0.06], [-0.06, 0.06], [-0.06, -0.06]
    ];
    armOffsets.forEach(offset => {
        const conn = new THREE.Mesh(connGeom, yellowMat);
        conn.position.set(offset[0] * 0.8, offset[1] * 0.8, 0.01);
        conn.rotation.z = Math.atan2(offset[1], offset[0]);
        frameGroup.add(conn);

        // Simple wire simulation
        const wireGeom = new THREE.BoxGeometry(0.04, 0.002, 0.002);
        const wire = new THREE.Mesh(wireGeom, blackMat);
        wire.position.set(offset[0] * 0.9, offset[1] * 0.9, 0.01);
        wire.rotation.z = Math.atan2(offset[1], offset[0]);
        frameGroup.add(wire);
    });

    // Arms
    const armGeom = new THREE.BoxGeometry(0.45, 0.03, 0.005);
    const arm1 = new THREE.Mesh(armGeom, carbonMat);
    arm1.rotation.z = Math.PI / 4;
    arm1.castShadow = true;
    frameGroup.add(arm1);
    const arm2 = new THREE.Mesh(armGeom, carbonMat);
    arm2.rotation.z = -Math.PI / 4;
    arm2.castShadow = true;
    frameGroup.add(arm2);

    // Legs (Landing Gear) - 4 curved blades as seen in photos
    const legGroup = createLegs(carbonMat);
    frameGroup.add(legGroup);

    // Battery
    const batGeom = new THREE.BoxGeometry(0.08, 0.035, 0.02);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const battery = new THREE.Mesh(batGeom, batMat);
    battery.position.z = -0.03;
    battery.castShadow = true;
    frameGroup.add(battery);

    // Guard (Clover shape, transparent plastic)
    const guardGroup = createGuard();
    frameGroup.add(guardGroup);

    return frameGroup;
}

function createLegs(mat: THREE.Material) {
    const legGroup = new THREE.Group();
    
    // Blade-like leg geometry
    const legGeom = new THREE.BoxGeometry(0.12, 0.015, 0.002);
    
    const offsets = [
        [0.05, 0.05], [0.05, -0.05], [-0.05, 0.05], [-0.05, -0.05]
    ];

    offsets.forEach(offset => {
        const pivot = new THREE.Group();
        pivot.position.set(offset[0], offset[1], -0.015);
        pivot.rotation.z = Math.atan2(offset[1], offset[0]);

        const mesh = new THREE.Mesh(legGeom, mat);
        // Pivot point at one end, mesh extends down and out
        mesh.position.set(0.045, 0, -0.05);
        mesh.rotation.y = 1.0; // About 57 degrees
        
        pivot.add(mesh);
        legGroup.add(pivot);
    });

    return legGroup;
}

function createGuard() {
    const guardGroup = new THREE.Group();
    const guardMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.2, 
        roughness: 0, 
        metalness: 0.2,
        side: THREE.DoubleSide
    });

    const armLen = 0.16;
    const ringRadius = 0.12;
    
    // We'll use 4 overlapping rings to form the clover shape.
    const ringGeom = new THREE.TorusGeometry(ringRadius, 0.005, 8, 32);
    const offsets = [
        [armLen, -armLen],
        [-armLen, armLen],
        [armLen, armLen],
        [-armLen, -armLen]
    ];

    offsets.forEach(offset => {
        const ring = new THREE.Mesh(ringGeom, guardMat);
        ring.position.set(offset[0], offset[1], 0.04);
        guardGroup.add(ring);

        // Add 4 spokes (ribs) per ring
        for(let i=0; i<4; i++) {
            const spokeGeom = new THREE.BoxGeometry(ringRadius, 0.002, 0.002);
            const spoke = new THREE.Mesh(spokeGeom, guardMat);
            const angle = i * Math.PI / 2;
            spoke.position.set(
                offset[0] + Math.cos(angle) * ringRadius/2,
                offset[1] + Math.sin(angle) * ringRadius/2,
                0.04
            );
            spoke.rotation.z = angle;
            guardGroup.add(spoke);
        }
        
        // Vertical support columns
        const colGeom = new THREE.CylinderGeometry(0.003, 0.003, 0.04, 8);
        [0, Math.PI/2, Math.PI, 3*Math.PI/2].forEach(angle => {
            const col = new THREE.Mesh(colGeom, guardMat);
            col.position.set(
                offset[0] + Math.cos(angle) * ringRadius * 0.9,
                offset[1] + Math.sin(angle) * ringRadius * 0.9,
                0.02
            );
            col.rotation.x = Math.PI / 2;
            guardGroup.add(col);
        });
    });

    // Connecting bridges between the clover leaves
    const bridgeGeom = new THREE.BoxGeometry(0.08, 0.01, 0.005);
    const bridges = [
        { x: armLen, y: 0, rot: Math.PI/2 },
        { x: -armLen, y: 0, rot: Math.PI/2 },
        { x: 0, y: armLen, rot: 0 },
        { x: 0, y: -armLen, rot: 0 }
    ];
    bridges.forEach(b => {
        const bridge = new THREE.Mesh(bridgeGeom, guardMat);
        bridge.position.set(b.x, b.y, 0.04);
        bridge.rotation.z = b.rot;
        guardGroup.add(bridge);
    });

    return guardGroup;
}
