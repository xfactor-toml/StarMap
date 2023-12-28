import * as THREE from 'three';
import { BattleObject } from './BattleObject';
import { ThreeLoader } from '~/game/utils/threejs/ThreeLoader';
import { ModelAlias } from '~/game/data/ModelData';
import { TextureAlias } from '~/game/data/TextureData';

export class BattleShip extends BattleObject {
    protected _mesh: THREE.Mesh;
    protected _model: THREE.Group;

    constructor(aParams: {
        id: string,
        radius?: number,
        maxHp?: number,
        owner?: string
    }) {
        super(aParams, 'BattleShip');
        this.initSimpleModel();
        // this.initShipModel();
    }

    private initSimpleModel() {
        let r = this.radius;
        let g = new THREE.BoxGeometry(r, r, r * 2);
        let m = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa
        });
        this._mesh = new THREE.Mesh(g, m);
        // basic rotation
        this._mesh.rotation.y = Math.PI / 2;
        this.add(this._mesh);
    }

    private initShipModel() {
        this._model = ThreeLoader.getInstance().getModel(ModelAlias.BattleShip);
        let tMap = ThreeLoader.getInstance().getTexture(TextureAlias.Ship1Color);

        let m = new THREE.MeshBasicMaterial({
            map: tMap
        });

        this._model.traverse((aObj) => {
            if (aObj.type == 'Mesh') {
                let mesh = aObj as THREE.Mesh;
                mesh.material = m;
            }
        });

        // basic rotation
        // this._model.rotation.y = Math.PI / 2;

        const sc = this.radius * 1;
        this._model.scale.set(sc, sc, sc);

        this.add(this._model);
    }

    free() {
        this._mesh = null;
        this._model = null;
        super.free();
    }

}