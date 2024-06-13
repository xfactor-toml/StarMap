import * as THREE from 'three';
import { MyObject3D } from '~/game/basics/MyObject3D';
import { ThreeUtils } from '~/game/utils/threejs/ThreejsUtils';
import { MyMath } from '@/utils';

export class BattleStarHpBar extends MyObject3D {
    private _radius: number;
    private _width: number;
    private _maxHp = 1;
    private _hp = 1;
    private _bar: THREE.Mesh;

    constructor(aParams: {
        maxHp: number,
        hp: number,
        radius: number,
        width: number
    }) {
        super('BattleStarHpBar');
        this._maxHp = aParams.maxHp;
        this._hp = aParams.hp;
        this._radius = aParams.radius;
        this._width = aParams.width;
        this.recreateBar();
    }

    private recreateBar() {
        if (this._bar) this.removeBar();
        
        const p = this._hp / this._maxHp;
        const innerRadius = this._radius;
        const outerRadius = this._radius + this._width;
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 32, null,
            0, p * Math.PI * 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x9cff00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: .8,
            depthWrite: false
        });
        this._bar = new THREE.Mesh(geometry, material);

        this._bar.rotation.x = MyMath.toRadian(90);
        this.add(this._bar);

    }

    private removeBar() {
        if (!this._bar) return;
        ThreeUtils.removeAndDispose(this._bar);
        this._bar = null;
    }

    set hp(val: number) {
        this._hp = val;
        this.recreateBar();
    }

    free() {
        this.removeBar();
        super.free();
    }
    
}