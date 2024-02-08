import * as THREE from 'three';
import { BattleObject } from './BattleObject';
import { BigStar2 } from '../BigStar2';
import { Settings } from '~/game/data/Settings';
import { ObjectCreateData } from '~/game/battle/Types';
import { ThreeUtils } from '~/game/utils/threejs/ThreejsUtils';
import { MyMath } from '@/utils';
import { BattleStarHpBar } from './BattleStarHpBar';

type BattleStarParams = ObjectCreateData & {
    camera: THREE.Camera,
    planetOrbitRadius: number,
    light: {
        parent: THREE.Object3D,
        height?: number,
        dist?: number,
        intens?: number,
        decay?: number
    }
}

export class BattleStar extends BattleObject {
    private _starParams: BattleStarParams;
    protected _mesh: THREE.Mesh;
    protected _star: BigStar2;
    protected _starHpBar: BattleStarHpBar;
    protected _prevHp: number;
    // light
    protected _lightParent: THREE.Object3D;
    protected _pointLight: THREE.PointLight;
    private _lightHeight = 0;
    protected _lightHelper: THREE.Line;
    
    constructor(aParams: BattleStarParams) {
        super(aParams, 'BattleStar');
        this._starParams = aParams;
        this._prevHp = this.hp;
        this._lightParent = aParams.light.parent;
        this._lightHeight = aParams.light.height || 0;

        this.initStar();
        this.initHpBgLine();
        this.initHpBar();
        this.initPlanetOrbit();
        this.initPointLight(aParams.light);

    }

    private initPrimitiveStar() {
        let g = new THREE.SphereGeometry(this.radius);
        let m = new THREE.MeshBasicMaterial({
            color: 0xffdd00
        });
        this._mesh = new THREE.Mesh(g, m);
        this.add(this._mesh);
    }

    private initStar() {
        this._star = new BigStar2(this.position, this._starParams.camera, 1, {
            starSize: this.radius * 2 * 2,
            galaxyColor: { r: .9, g: .6, b: .3 }
        });
        this._star.position.y = this.radius / 2;
        this.add(this._star);
    }

    private initHpBgLine() {
        let circle = ThreeUtils.drawLineCircle({
            radius: this.radius * 1.5,
            color: 0x00ffff,
            lineWidth: 1,
            transparent: true,
            opacity: .4
        });
        circle.rotation.x = MyMath.toRadian(-90);
        circle.position.y = -1;
        this.add(circle);
    }

    private initHpBar() {
        this._starHpBar = new BattleStarHpBar({
            radius: this.radius * 1.5,
            width: .4,
            maxHp: this.hpMax,
            hp: this.hp
        });
        this.add(this._starHpBar);
    }

    private initPlanetOrbit() {
        let orbitLine = ThreeUtils.drawLineCircle({
            radius: this._starParams.planetOrbitRadius,
            lineWidth: 1,
            color: 0x00ffff
        });
        orbitLine.rotation.x = MyMath.toRadian(-90);
        this.add(orbitLine);
    }

    private initPointLight(aParams: {
        dist?: number,
        intens?: number,
        decay?: number
    }) {
        const lightColor = 0xffffff;
        this._pointLight = new THREE.PointLight(lightColor,
            aParams.intens || 1,
            aParams.dist || 50,
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

    public get lightHelperVisible() {
        return this._lightHelper.visible;
    }

    public set lightHelperVisible(value) {
        this._lightHelper.visible = value;
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
        this._star?.update(dt);

        if (this._prevHp != this.hp) {
            this._prevHp = this.hp;
            this._starHpBar.hp = this.hp;
        }

        if (this._pointLight) this.updateLight();

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

        this._starHpBar = null;

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