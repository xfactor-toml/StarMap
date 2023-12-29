import * as THREE from 'three';
import { BattleObject } from './BattleObject';

export class BattlePosition extends BattleObject {
    protected _mesh: THREE.Mesh;

    constructor(aParams: {
        id: number,
        radius?: number
    }) {
        super(aParams, 'BattlePosition');

        let g = new THREE.SphereGeometry(this.radius);
        let m = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: .2,
            depthWrite: false
        });
        this._mesh = new THREE.Mesh(g, m);
        this.add(this._mesh);
        
    }

    free() {
        this._mesh = null;
        super.free();
    }

    update(dt: number) {
        
    }

}