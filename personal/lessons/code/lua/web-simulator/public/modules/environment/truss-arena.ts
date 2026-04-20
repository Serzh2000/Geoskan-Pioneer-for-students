import * as THREE from 'three';

export function createTrussArenaMesh(size = 18, height = 5) {
    const group = new THREE.Group();
    const trussRadius = 0.05;
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });

    const createTruss = (p1: THREE.Vector3, p2: THREE.Vector3) => {
        const dist = p1.distanceTo(p2);
        const geom = new THREE.CylinderGeometry(trussRadius, trussRadius, dist, 8);
        const truss = new THREE.Mesh(geom, trussMat);
        truss.position.copy(p1).lerp(p2, 0.5);
        truss.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
        group.add(truss);
    };

    // Pillars
    const corners = [
        new THREE.Vector3(size/2, size/2, 0),
        new THREE.Vector3(-size/2, size/2, 0),
        new THREE.Vector3(-size/2, -size/2, 0),
        new THREE.Vector3(size/2, -size/2, 0)
    ];

    corners.forEach(c => {
        createTruss(c, c.clone().setZ(height));
        // Feet
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16), trussMat);
        foot.position.copy(c).setZ(0.025);
        foot.rotation.x = Math.PI / 2;
        group.add(foot);
    });

    // Top beams
    for (let i = 0; i < 4; i++) {
        createTruss(corners[i].clone().setZ(height), corners[(i+1)%4].clone().setZ(height));
    }

    // Net
    const netMat = new THREE.MeshStandardMaterial({ 
        color: 0x000000, 
        transparent: true, 
        opacity: 0.15, 
        side: THREE.DoubleSide,
        wireframe: true
    });
    const netGeom = new THREE.BoxGeometry(size, size, height);
    const net = new THREE.Mesh(netGeom, netMat);
    net.position.z = height / 2;
    group.add(net);

    return group;
}

export function createTrussArena(group: THREE.Group) {
    group.add(createTrussArenaMesh());
}
