import * as THREE from 'three';
import { BattleObject } from './BattleObject';
import { ThreeLoader } from '~/game/utils/threejs/ThreeLoader';
import { ModelAlias } from '~/game/data/ModelData';
import { TextureAlias } from '~/game/data/TextureData';
import { ObjectCreateData, ObjectRace } from '~/game/battle/Types';
import { MyMath } from '@/utils';
import { ThreeUtils } from '~/game/utils/threejs/ThreejsUtils';

type LightParams = {
    parent: THREE.Object3D,
    height?: number,
    dist?: number,
    intens?: number,
    decay?: number
}

type BattleTowerParams = ObjectCreateData & {
    light: LightParams
}

export class BattleTower extends BattleObject {
    protected _mesh: THREE.Mesh;
    protected _model: THREE.Group;
    protected _currGunNumber: number;
    // light
    protected _lightParent: THREE.Object3D;
    protected _lightHeight = 0;
    protected _pointLight: THREE.PointLight;
    protected _lightHelper: THREE.Line;

    constructor(aParams: BattleTowerParams) {
        super(aParams, 'BattleFighter');
        this._currGunNumber = MyMath.randomIntInRange(1, 2);
        this._lightParent = aParams.light.parent;
        this._lightHeight = aParams.light.height || 0;
        this.initSimpleModel();
        this.initPointLight(aParams.light);
    }

    private initSimpleModel() {
        let g = new THREE.SphereGeometry(this.radius);
        let m = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa
        });
        this._mesh = new THREE.Mesh(g, m);
        this.add(this._mesh);
    }

    private initModel() {
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

    private initPointLight(aParams: LightParams) {
        const lightColor = 0xff0000;
        this._pointLight = new THREE.PointLight(lightColor,
            aParams.intens || 1,
            aParams.dist || 100,
            aParams.decay || 1
        );
        this._lightParent.add(this._pointLight);

        // helper
        this._lightHelper = ThreeUtils.drawLineCircle({
            radius: 1,
            lineWidth: 2,
            color: lightColor
        });
        this._lightHelper.rotation.x = MyMath.toRadian(-90);
        this._lightHelper.visible = false;
        this._lightParent.add(this._lightHelper);
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