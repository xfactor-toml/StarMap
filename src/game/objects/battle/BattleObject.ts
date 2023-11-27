import * as THREE from 'three';
import { MyObject3D } from "~/game/basics/MyObject3D";

export class BattleObject extends MyObject3D {
    private _objId: string;
    private _debugSphere: THREE.Mesh;
    targetPosition: { x: number, z: number };

    constructor(aId: string, aClassName?: string) {
        super(aClassName || 'BattleObject');
        this._objId = aId;
    }

    public get objId(): string {
        return this._objId;
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