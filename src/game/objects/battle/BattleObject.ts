import * as THREE from 'three';
import { MyObject3D } from "~/game/basics/MyObject3D";

export class BattleObject extends MyObject3D {
    private _objId: string;
    private _radius: number;
    private _maxHp: number;
    private _hp: number;
    private _debugSphere: THREE.Mesh;
    targetPosition: { x: number, z: number };

    constructor(aParams: {
        id: string,
        radius?: number,
        maxHp?: number
    }, aClassName?: string) {
        super(aClassName || 'BattleObject');
        this._objId = aParams.id;
        this._radius = aParams.radius;
        this._hp = this._maxHp = aParams.maxHp;
    }

    public get objId(): string {
        return this._objId;
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
    }

    public get maxHp(): number {
        return this._maxHp;
    }

    public set maxHp(value: number) {
        this._maxHp = value;
    }

    public get hp(): number {
        return this._hp;
    }
    
    public set hp(value: number) {
        this._hp = value;
    }

    createDebugSphere(aRadius: number) {
        let g = new THREE.SphereGeometry(aRadius);
        let m = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: .2,
            depthWrite: false,
            // blending: THREE.AdditiveBlending
        });
        this._debugSphere = new THREE.Mesh(g, m);
        this.add(this._debugSphere);
    }

    free() {
        this._debugSphere = null;
        super.free();
    }

    update(dt: number) {
        if (this.targetPosition) {
            this.position.x += (this.targetPosition.x - this.position.x) * dt;
            this.position.z += (this.targetPosition.z - this.position.z) * dt;
        }
    }

}