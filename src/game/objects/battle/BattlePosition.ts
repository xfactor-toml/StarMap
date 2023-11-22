import * as THREE from 'three';
import { BattleObject } from './BattleObject';

export class BattlePosition extends BattleObject {
    protected _mesh: THREE.Mesh;
    private _radius;

    constructor(aId: string, aRadius: number) {
        super(aId, 'BattlePlanet');

        this._radius = aRadius;

        let g = new THREE.SphereGeometry(this._radius);
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