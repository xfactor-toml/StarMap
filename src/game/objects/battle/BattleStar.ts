import * as THREE from 'three';
import { BattleObject } from './BattleObject';
import { BigStar2 } from '../BigStar2';
import { Settings } from '~/game/data/Settings';
import { ObjectCreateData } from '~/game/battle/Types';

export class BattleStar extends BattleObject {
    protected _mesh: THREE.Mesh;
    protected _star: BigStar2;

    constructor(aParams: ObjectCreateData) {
        super(aParams, 'BattleStar');

        let g = new THREE.SphereGeometry(aParams.radius);
        let m = new THREE.MeshBasicMaterial({
            color: 0xffdd00
        });
        this._mesh = new THREE.Mesh(g, m);
        this.add(this._mesh);

        // this._star = new BigStar2(this.position, aCamera, 1, {
        //     starSize: 10,
        //     galaxyColor: { r: .9, g: .6, b: .3 }
        // });
        if (Settings.isDebugMode) {
            // this._star.createDebugGui(Settings.datGui);
        }
        // this.add(this._star);

    }

    free() {
        this.clear();
        
        if (this._mesh) {
            this.remove(this._mesh);
            this._mesh = null;
        }

        if (this._star) {
            this._star.free();
        }
        this._star = null;

        super.free();
    }

    update(dt: number) {
        this._star?.update(dt);
    }

}