import * as THREE from 'three';
import { BattleObject } from './BattleObject';
import { BigStar2 } from '../BigStar2';
import { Settings } from '~/game/data/Settings';
import { ObjectCreateData } from '~/game/battle/Types';
import { ThreeUtils } from '~/game/utils/threejs/ThreejsUtils';
import { MyMath } from '@/utils';
import { BattleStarHpBar } from './BattleStarHpBar';

type BattleStarParams = ObjectCreateData & {
    camera: THREE.Camera
}

export class BattleStar extends BattleObject {
    private _starParams: BattleStarParams;
    protected _mesh: THREE.Mesh;
    protected _star: BigStar2;
    protected _starHpBar: BattleStarHpBar;
    protected _prevHp: number;

    constructor(aParams: BattleStarParams) {
        super(aParams, 'BattleStar');
        this._starParams = aParams;
        this._prevHp = this.hp;
        this.initStar();
        this.initHpBgLine();
        this.initHpBar();

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
            maxHp: this.maxHp,
            hp: this.hp
        });
        this.add(this._starHpBar);
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

        super.free();
    }

    update(dt: number) {
        this._star?.update(dt);

        if (this._prevHp != this.hp) {
            this._prevHp = this.hp;
            this._starHpBar.hp = this.hp;
        }

    }

}