import * as THREE from 'three';
import { BattleObject } from './BattleObject';

export class BattlePlanet extends BattleObject {
    protected _mesh: THREE.Mesh;
    protected _settelite: THREE.Mesh;
    private _orbitRadius;
    private _rotationSpeed;
    private _orbitCenter;
    private _orbitSpeed;
    private _orbitAngle;

    constructor(aId: number, aParams: {
        radius: number, // object radius
        orbitRadius: number, // planet orbit radius
        rotationSpeed: number, // planet rad/sec
        year: number, // planet period in sec
        orbitCenter: { x: number, y: number }, // planet orbit center
        orbitSpeed: number, // planet orbit speed in rad/sec
        startOrbitAngle: number
    }) {
        super(null, 'BattlePlanet');

        this.logDebug(`params:`, aParams);

        this._orbitRadius = aParams.orbitRadius;
        this._rotationSpeed = aParams.rotationSpeed;
        this._orbitCenter = aParams.orbitCenter;
        this._orbitSpeed = aParams.orbitSpeed;
        this._orbitAngle = aParams.startOrbitAngle;

        this.updatePosition();

        let g = new THREE.SphereGeometry(this.radius);
        let m = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa
        });
        this._mesh = new THREE.Mesh(g, m);
        this.add(this._mesh);

        g = new THREE.SphereGeometry(this.radius / 3);
        m = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        this._settelite = new THREE.Mesh(g, m);
        this._settelite.position.z = this.radius * 1.7;
        this.add(this._settelite);
        
    }

    private updatePosition() {
        this.position.x = this._orbitCenter.x + Math.cos(this._orbitAngle) * this._orbitRadius;
        this.position.y = 0;
        this.position.z = this._orbitCenter.y + Math.sin(this._orbitAngle) * this._orbitRadius;
    }

    private updateRotation(dt: number) {
        this.rotation.y += this._rotationSpeed * dt;
    }

    free() {
        if (this._mesh) {
            this.remove(this._mesh);
            this._mesh = null;
        }
        super.free();
    }

    update(dt: number) {
        this._orbitAngle += this._orbitSpeed * dt;
        this.updatePosition();
        this.updateRotation(dt);
    }

}