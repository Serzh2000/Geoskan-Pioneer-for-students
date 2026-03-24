import * as THREE from 'three';

export class DroneOrbitControls {
    camera: THREE.PerspectiveCamera;
    domElement: HTMLElement;
    target: THREE.Vector3 = new THREE.Vector3();
    
    enabled: boolean = true;
    
    radius: number = 10;
    azimuth: number = 0; 
    elevation: number = Math.PI / 4; 
    
    rotateSpeed: number = 1.0;
    zoomSpeed: number = 1.2;
    panSpeed: number = 1.0;
    
    private isDragging: boolean = false;
    private previousMouse: {x: number, y: number} = {x: 0, y: 0};
    private mouseButton: number = -1;
    
    private listeners: { [key: string]: Function[] } = {};

    constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
        this.camera = camera;
        this.domElement = domElement;
        
        // Инициализация из текущей позиции камеры
        const offset = new THREE.Vector3().subVectors(camera.position, this.target);
        this.radius = offset.length() || 10;
        this.elevation = Math.asin(Math.max(-1, Math.min(1, offset.z / this.radius)));
        this.azimuth = Math.atan2(offset.y, offset.x);
        
        this.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.domElement.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.domElement.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        this.domElement.addEventListener('contextmenu', e => e.preventDefault());
        
        this.update();
    }
    
    addEventListener(type: string, listener: Function) {
        if (!this.listeners[type]) this.listeners[type] = [];
        this.listeners[type].push(listener);
    }
    
    dispatchEvent(type: string) {
        if (this.listeners[type]) {
            for (const cb of this.listeners[type]) cb();
        }
    }
    
    onPointerDown(e: PointerEvent) {
        if (!this.enabled) return;
        this.isDragging = true;
        this.mouseButton = e.button;
        this.previousMouse = { x: e.clientX, y: e.clientY };
        this.domElement.setPointerCapture(e.pointerId);
    }
    
    onPointerMove(e: PointerEvent) {
        if (!this.enabled || !this.isDragging) return;
        
        const deltaX = e.clientX - this.previousMouse.x;
        const deltaY = e.clientY - this.previousMouse.y;
        this.previousMouse = { x: e.clientX, y: e.clientY };
        
        if (this.mouseButton === 0) { // ЛКМ: Вращение
            this.azimuth -= deltaX * 0.005 * this.rotateSpeed;
            this.elevation += deltaY * 0.005 * this.rotateSpeed;
            
            // Ограничиваем, чтобы не заглядывать под карту (elevation >= 0.01)
            // И разрешаем переходить через зенит на другую сторону (elevation вплоть до PI - 0.01)
            this.elevation = Math.max(0.01, Math.min(Math.PI - 0.01, this.elevation));
            
            this.update();
        } else if (this.mouseButton === 2) { // ПКМ: Панорамирование
            const forward = new THREE.Vector3().subVectors(this.target, this.camera.position).normalize();
            const up = this.camera.up.clone();
            const right = new THREE.Vector3().crossVectors(forward, up).normalize();
            const actualUp = new THREE.Vector3().crossVectors(right, forward).normalize();
            
            const distance = this.camera.position.distanceTo(this.target);
            const panX = right.multiplyScalar(-deltaX * 0.002 * this.panSpeed * distance);
            const panY = actualUp.multiplyScalar(deltaY * 0.002 * this.panSpeed * distance);
            
            this.target.add(panX).add(panY);
            this.update();
        }
    }
    
    onPointerUp(e: PointerEvent) {
        this.isDragging = false;
        this.mouseButton = -1;
        this.domElement.releasePointerCapture(e.pointerId);
    }
    
    onWheel(e: WheelEvent) {
        if (!this.enabled) return;
        e.preventDefault();
        
        if (e.deltaY > 0) {
            this.radius *= this.zoomSpeed;
        } else {
            this.radius /= this.zoomSpeed;
        }
        this.radius = Math.max(0.1, Math.min(1000, this.radius));
        this.update();
    }
    
    update() {
        // Вычисляем новую позицию камеры (сферические координаты относительно оси Z)
        const x = this.radius * Math.cos(this.elevation) * Math.cos(this.azimuth);
        const y = this.radius * Math.cos(this.elevation) * Math.sin(this.azimuth);
        const z = this.radius * Math.sin(this.elevation);
        
        this.camera.position.set(this.target.x + x, this.target.y + y, this.target.z + z);
        
        // Вычисляем правильный up вектор, чтобы не было шарнирного замка и резких переворотов
        // Это производная позиции по углу elevation (касательная к меридиану)
        const upX = -Math.sin(this.elevation) * Math.cos(this.azimuth);
        const upY = -Math.sin(this.elevation) * Math.sin(this.azimuth);
        const upZ = Math.cos(this.elevation);
        
        this.camera.up.set(upX, upY, upZ).normalize();
        this.camera.lookAt(this.target);
        
        this.dispatchEvent('change');
    }
}
