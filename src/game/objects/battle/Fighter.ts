import * as THREE from 'three';
import { BattleObject, BattleObjectData } from './BattleObject';
import { ThreeLoader } from '~/game/utils/threejs/ThreeLoader';
import { ModelAlias } from '~/game/data/ModelData';
import { MyMath } from '@/utils';

type FighterParams = BattleObjectData & {
    
}

export class Fighter extends BattleObject {
    protected _mesh: THREE.Mesh;
    protected _model: THREE.Group;
    protected _currGunNumber: number;

    constructor(aParams: FighterParams) {
        super(aParams, 'Fighter');
        this._currGunNumber = MyMath.randomIntInRange(1, 2);
        this.initShipModel();
    }

    private initSimpleModel() {
        let g = new THREE.OctahedronGeometry(this.radius);
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
                modelAlias = ModelAlias.FighterInsects;
                break;
            default:
                modelAlias = ModelAlias.FighterWaters;
                break;
        }
        this._model = ThreeLoader.getInstance().getModel(modelAlias);
        // let tMap = ThreeLoader.getInstance().getTexture(TextureAlias.ship1Color);

        let m = new THREE.MeshStandardMaterial({
        // let m = new THREE.MeshBasicMaterial({
            // map: tMap
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

    private getCurrentGunLocalPoint(): THREE.Vector3 {
        const dx = 1.5;
        if (this._currGunNumber == 1) {
            // left
            return new THREE.Vector3(-dx, 0, 0);
        }
        else {
            // right
            return new THREE.Vector3(dx, 0, 0);
        }
    }

    private switchGunPoint() {
        if (this._currGunNumber == 1) {
            this._currGunNumber = 2;
        }
        else {
            this._currGunNumber = 1;
        }
    }

    getGlobalFirePoint(): THREE.Vector3 {
        let localPoint = this.getCurrentGunLocalPoint();
        this.switchGunPoint();
        return this.localToWorld(localPoint);
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