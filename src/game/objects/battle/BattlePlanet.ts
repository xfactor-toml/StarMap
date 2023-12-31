import * as THREE from 'three';
import { BattleObject } from './BattleObject';
import { ObjectCreateData } from '~/game/battle/Types';

export class BattlePlanet extends BattleObject {
    protected _mesh: THREE.Mesh;
    protected _settelite: THREE.Mesh;

    constructor(aParams: ObjectCreateData) {
        super(aParams, 'BattlePlanet');

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

    // private updateRotation(dt: number) {
    //     this.rotation.y += this._rotationSpeed * dt;
    // }

    free() {
        if (this._mesh) {
            this.remove(this._mesh);
            this._mesh = null;
        }
        super.free();
    }

    update(dt: number) {
        super.update(dt);
    }

}