import * as THREE from 'three';
import { BattleObject } from './BattleObject';

export class BattleStar extends BattleObject {
    protected _mesh: THREE.Mesh;

    constructor(aId: string) {
        super(aId, 'BattleSun');

        let g = new THREE.SphereGeometry(2);
        let m = new THREE.MeshBasicMaterial({
            color: 0xffdd00
        });
        this._mesh = new THREE.Mesh(g, m);
        this.add(this._mesh);

    }

    free() {
        if (this._mesh) {
            this.remove(this._mesh);
            this._mesh = null;
        }
        super.free();
    }

}