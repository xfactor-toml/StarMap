import * as THREE from 'three';
import { BattleObject } from './BattleObject';
import { ThreeLoader } from '~/game/utils/threejs/ThreeLoader';
import { ModelAlias } from '~/game/data/ModelData';
import { TextureAlias } from '~/game/data/TextureData';

export class BattleShip1 extends BattleObject {
    protected _model: THREE.Group;

    constructor(aId: string, aRadius: number) {
        super(aId, 'BattleShip1');

        this._model = ThreeLoader.getInstance().getModel(ModelAlias.Ship1);
        let tMap = ThreeLoader.getInstance().getTexture(TextureAlias.Ship1Color);
        
        let m = new THREE.MeshBasicMaterial({
            // color: 0xaaaaaa
            map: tMap
        });

        this._model.traverse((aObj) => {
            if (aObj.type == 'Mesh') {
                let mesh = aObj as THREE.Mesh;
                mesh.material = m;
            }
        })

        const sc = aRadius * 0.001;
        this._model.scale.set(sc, sc, sc);

        this.add(this._model);

    }

    free() {
        this._model = null;
        super.free();
    }

}