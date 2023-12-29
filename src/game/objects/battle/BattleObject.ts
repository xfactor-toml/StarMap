import * as THREE from 'three';
import { MyObject3D } from "~/game/basics/MyObject3D";

export class BattleObject extends MyObject3D {
    private _objId: number;
    private _radius: number;
    private _maxHp: number;
    private _hp: number;
    private _owner: string;
    private _debugSphere: THREE.Mesh;
    private _targetPosition: { x: number; z: number; };
    // targetRotation = 0;
    private _dirrection: THREE.Vector3;

    constructor(aParams: {
        id: number,
        radius?: number,
        maxHp?: number,
        owner?: string
    }, aClassName?: string) {
        super(aClassName || 'BattleObject');
        this._objId = aParams.id;
        this._radius = aParams.radius;
        this._hp = this._maxHp = aParams.maxHp;
        this._owner = aParams.owner || '';
        this._dirrection = new THREE.Vector3(0, 0, 1);
    }

    public get objId(): number {
        return this._objId;
    }

    public get radius(): number {
        return this._radius;
    }

    public set radius(value: number) {
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

    public get owner(): string {
        return this._owner;
    }

    public get targetPosition(): { x: number; z: number; } {
        return this._targetPosition;
    }
    public set targetPosition(value: { x: number; z: number; }) {
        this._targetPosition = value;
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