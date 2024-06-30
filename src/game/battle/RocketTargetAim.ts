import * as THREE from 'three';
import { MyObject3D } from '~/game/basics/MyObject3D';
import { ThreeUtils } from '~/game/utils/threejs/ThreejsUtils';
import { ThreeLoader } from '../utils/threejs/ThreeLoader';
import { TextureAlias } from '../data/TextureData';
import { MyMath } from '../../monax/MyMath';

export class RocketTargetAim extends MyObject3D {
    protected _mesh: THREE.Mesh;
    protected _animTime = 0;

    constructor(aParams?: {
        w?: number
    }) {
        super('RocketTargetAim');
        this.initMesh(aParams?.w * 2 || 2);
    }

    private initMesh(size) {
        this.logDebug(`initMesh`);
        let g = new THREE.PlaneGeometry(size, size);
        let t = ThreeLoader.getInstance().getTexture(TextureAlias.rocketTargetAim);
        let m = new THREE.MeshBasicMaterial({
            map: t,
            blending: THREE.NormalBlending,
            transparent: true,
            alphaTest: .01,
            depthTest: true,
            // depthWrite: false
        });
        this._mesh = new THREE.Mesh(g, m);
        this._mesh.rotation.x = MyMath.toRadian(-90);
        this.add(this._mesh);
    }

    update(dt: number) {
        this._animTime += dt * 15;
        let scaleFactor = 1 + Math.cos(this._animTime) * .05;
        this._mesh?.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    free() {
        this.logDebug(`free`);
        if (this._mesh) ThreeUtils.removeAndDispose(this._mesh);
        this._mesh = null;
        super.free();
    }

}