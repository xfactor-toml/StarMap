import * as THREE from 'three';
import { BattleObject, BattleObjectData } from './BattleObject';
import { ThreeLoader } from '~/game/utils/threejs/ThreeLoader';
import { ModelAlias } from '~/game/data/ModelData';
import { ThreeUtils } from '~/game/utils/threejs/ThreejsUtils';
import { TextureAlias } from '~/game/data/TextureData';
import { MyMath } from '@/utils';

type LightParams = {
    parent: THREE.Object3D,
    height?: number,
    dist?: number,
    intens?: number,
    decay?: number,
    color?: number
}

type TowerParams = BattleObjectData & {
    light?: LightParams
}

export class Tower extends BattleObject {
    protected _mesh: THREE.Mesh;
    protected _model: THREE.Group;
    protected _currGunNumber: number;
    // light
    protected _lightParent: THREE.Object3D;
    protected _lightHeight = 0;
    protected _pointLight: THREE.PointLight;
    protected _lightHelper: THREE.Line;

    constructor(aParams: TowerParams) {
        super(aParams, 'Tower');
        this._currGunNumber = MyMath.randomIntInRange(1, 2);
        // model
        // this.initSimpleModel();
        this.initModel();
        // light
        if (aParams.light) {
            this._lightParent = aParams.light.parent;
            this._lightHeight = aParams.light.height || 0;
            this.initPointLight(aParams.light);
        }
    }

    private initSimpleModel() {
        let g = new THREE.OctahedronGeometry(this.radius);
        let m = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa
        });
        this._mesh = new THREE.Mesh(g, m);
        this.add(this._mesh);
    }

    private initModel() {
        let modelAlias: ModelAlias;
        let textureAlias: TextureAlias;
        switch (this._params.race) {
            case 'Insects':
                modelAlias = ModelAlias.Tower;
                textureAlias = TextureAlias.tower;
                break;
            default:
                modelAlias = ModelAlias.WaterTower;
                textureAlias = TextureAlias.waterTower;
                break;
        }
        this._model = ThreeLoader.getInstance().getModel(modelAlias);
        let tMap = ThreeLoader.getInstance().getTexture(textureAlias);

        // let m = new THREE.MeshLambertMaterial({
        let m = new THREE.MeshBasicMaterial({
            map: tMap,
            color: 0xaaaaaa,
            // color: 0xffffff,
            side: THREE.DoubleSide
        });

        this._model.traverse((aObj) => {
            if (aObj.type == 'Mesh') {
                let mesh = aObj as THREE.Mesh;
                mesh.material = m;
                mesh.geometry.computeVertexNormals();
            }
        });

        // basic rotation
        // this._model.rotation.y = Math.PI / 2;

        const sc = this.radius * 0.0020;
        this._model.scale.set(sc, sc, sc);

        this.add(this._model);
    }

    private initPointLight(aParams: LightParams) {
        const lightColor = aParams.color || 0xff0000;
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

    public get lightHeight(): number {
        return this._lightHeight;
    }

    public set lightHeight(value: number) {
        this._lightHeight = value;
    }

    public get lightIntens(): number {
        return this._pointLight?.intensity;
    }

    public set lightIntens(aValue: number) {
        if (this._pointLight) this._pointLight.intensity = aValue;
    }

    public get lightDist(): number {
        return this._pointLight?.distance;
    }

    public set lightDist(aValue: number) {
        if (this._pointLight) this._pointLight.distance = aValue;
    }

    public get lightDecay(): number {
        return this._pointLight?.intensity;
    }

    public set lightDecay(aValue: number) {
        if (this._pointLight) this._pointLight.decay = aValue;
    }

    public set lightColor(value: number) {
        this._pointLight.color.setHex(value);
    }

    public get lightHelperVisible() {
        return this._lightHelper.visible;
    }

    public set lightHelperVisible(value) {
        this._lightHelper.visible = value;
    }
    
    getGlobalFirePoint(): THREE.Vector3 {
        let localPoint = this.getCurrentGunLocalPoint();
        this.switchGunPoint();
        return this.localToWorld(localPoint);
    }

    protected updateLight() {
        this._pointLight.position.x = this.position.x;
        this._pointLight.position.y = this.position.y + this._lightHeight;
        this._pointLight.position.z = this.position.z;

        if (this._lightHelper) {
            this._lightHelper.position.copy(this._pointLight.position);
            const sc = this._pointLight.distance;
            this._lightHelper.scale.set(sc, sc, sc);
        }
    }

    update(dt: number) {
        if (this._pointLight) this.updateLight();
    }

    free() {
        this.clear();

        if (this._mesh) {
            ThreeUtils.removeAndDispose(this._mesh);
        }
        this._mesh = null;

        if (this._model) {
            ThreeUtils.removeAndDispose(this._model);
        }
        this._model = null;
        
        if (this._pointLight) {
            this._lightParent.remove(this._pointLight);
            this._pointLight.dispose();
            this._pointLight = null;
        }
        if (this._lightHelper) {
            this._lightHelper.visible = false;
            this._lightParent.remove(this._lightHelper);
            this._lightHelper = null;
        }

        super.free();
    }

}