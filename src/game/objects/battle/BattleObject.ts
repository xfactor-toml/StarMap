import { MyMath } from '@/utils';
import * as THREE from 'three';
import { MyObject3D } from "~/game/basics/MyObject3D";
import { ObjectCreateData } from '~/game/battle/Types';

export class BattleObject extends MyObject3D {
    protected _params: ObjectCreateData;
    protected _maxHp: number;
    protected _hp: number;
    private _debugRadiusSphere: THREE.Mesh;
    private _debugAttackRadius: THREE.Mesh;
    private _targetPosition: { x: number; z: number; };
    // targetRotation = 0;
    private _dirrection: THREE.Vector3;

    constructor(aParams: ObjectCreateData, aClassName?: string) {
        super(aClassName || 'BattleObject');
        this._params = aParams;
        this._hp = this._maxHp = this._params.hp;
        this._dirrection = new THREE.Vector3(0, 0, 1);
    }

    public get objId(): number {
        return this._params.id;
    }

    public get radius(): number {
        return this._params.radius;
    }

    public set radius(value: number) {
        this._params.radius = value;
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
        let newHp = Math.max(0, value);
        this._hp = newHp;
    }

    public get owner(): string {
        return this._params.owner;
    }

    public get targetPosition(): { x: number; z: number; } {
        return this._targetPosition;
    }
    public set targetPosition(value: { x: number; z: number; }) {
        this._targetPosition = value;
    }

    createDebugRadiusSphere() {
        const geometry = new THREE.TorusGeometry(this._params.radius, .2, 2, 20);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: .3,
            depthWrite: false
        });
        this._debugRadiusSphere = new THREE.Mesh(geometry, material);
        this._debugRadiusSphere.rotation.x = MyMath.toRadian(-90);
        this.add(this._debugRadiusSphere);
    }

    createDebugAttackSphere() {
        const geometry = new THREE.TorusGeometry(this._params.attackRadius, .15, 2, 20);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: .2,
            depthWrite: false
        });
        this._debugAttackRadius = new THREE.Mesh(geometry, material);
        this._debugAttackRadius.rotation.x = MyMath.toRadian(-90);
        this.add(this._debugAttackRadius);
    }

    free() {
        this._debugRadiusSphere = null;
        this._debugAttackRadius = null;
        this._params = null;
        super.free();
    }

    setQuaternion(q: {x, y, z, w}) {
        this.quaternion.set(q.x, q.y, q.z, q.w);
    }

    update(dt: number) {
        // move
        if (this._targetPosition) {
            this.position.x += (this._targetPosition.x - this.position.x) * dt;
            this.position.z += (this._targetPosition.z - this.position.z) * dt;
        }

        // rotate
        // smoth
        // this.rotation.y += (this.targetRotation - this.rotation.y) * dt;
        // moment
        // this.rotation.y = this.targetRotation;
    }

}