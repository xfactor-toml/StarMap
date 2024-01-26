import * as THREE from 'three';
import { BattleObject } from './BattleObject';
import { ThreeLoader } from '~/game/utils/threejs/ThreeLoader';
import { ModelAlias } from '~/game/data/ModelData';
import { TextureAlias } from '~/game/data/TextureData';
import { ObjectCreateData } from '~/game/battle/Types';

export class BattleShip extends BattleObject {
    protected _mesh: THREE.Mesh;
    protected _model: THREE.Group;

    constructor(aParams: ObjectCreateData) {
        super(aParams, 'BattleShip');
        // this.initSimpleModel();
        this.initShipModel();
    }

    private initSimpleModel() {
        let r = this.radius;
        let g = new THREE.BoxGeometry(r, r, r * 2);
        let m = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa
        });
        this._mesh = new THREE.Mesh(g, m);
        this.add(this._mesh);
    }

    private initShipModel() {
        let modelAlias: ModelAlias;
        switch (this._params.race) {
            case 'Insects':
                modelAlias = ModelAlias.BattleShipInsects;
                break;
            default:
                modelAlias = ModelAlias.BattleShipWaters;
                break;
        }
        this._model = ThreeLoader.getInstance().getModel(modelAlias);

        let m = new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

        this._model.traverse((aObj) => {
            if (aObj.type == 'Mesh') {
                let mesh = aObj as THREE.Mesh;
                mesh.material = m;
            }
        });

        // basic rotation
        this._model.rotation.y = Math.PI / 2;

        const sc = this.radius * 0.0015;
        this._model.scale.set(sc, sc, sc);

        this.add(this._model);
    }

    updateQuaternion(dt: number) {
        // clear override
    }

    free() {
        this._mesh = null;
        this._model = null;
        super.free();
    }

}