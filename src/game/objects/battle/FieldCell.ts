import * as THREE from 'three';
import { MyObject3D } from "~/game/basics/MyObject3D";
import { MyMath } from '~/game/utils/MyMath';

export class FieldCell extends MyObject3D {
    protected _radius = 5;
    protected _mesh: THREE.Mesh;

    constructor(aRadius: number) {
        super(`FieldCell`);
        this._radius = aRadius;
        this.initModel();
    }

    private initModel() {
        const geometry = new THREE.TorusGeometry(this._radius, .3, 2, 20);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: .2,
            depthWrite: false
        });
        const torus = new THREE.Mesh(geometry, material);
        torus.rotation.x = MyMath.toRadian(-90);
        this.add(torus);
    }

    free() {
        this._mesh = null;
        super.free();
    }

}