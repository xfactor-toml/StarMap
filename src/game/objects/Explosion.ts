import * as THREE from 'three';
import { ParticleSystem } from '../core/effects/ParticleSystem';
import { ThreeLoader } from '../utils/threejs/ThreeLoader';
import { TextureAlias } from '../data/TextureData';
import { ExplosionParticleSystem } from '../core/effects/ExplosionParticleSystem';

export class Explosion {
    private _parent: THREE.Object3D;
    private _camera: THREE.Camera;
    private _texture: THREE.Texture;
    private _effect: ExplosionParticleSystem;

    constructor(aParams: {
        parent: THREE.Object3D,
        camera: THREE.Camera
    }) {
        this._parent = aParams.parent;
        this._camera = aParams.camera;
        this._texture = ThreeLoader.getInstance().getTexture(TextureAlias.particleCircle);
        this.initEffect();
    }

    private initEffect() {

        const dVel = 10;
        this._effect = new ExplosionParticleSystem({
            parent: this._parent,
            camera: this._camera,
            texture: this._texture,
            frequency: 60,
            lifeTime: 1,
            size: { min: .1, max: .4 },

            velocity: new THREE.Vector3(0, 0, 0),
            deltaVelocity: {
                x: { min: -dVel, max: dVel },
                y: { min: -dVel, max: dVel },
                z: { min: -dVel, max: dVel }
            },

            color: 0xff0000,
            // TODO:
            // color: [
            //     { t: 0, val: 0xffae00 },
            //     { t: 1, val: 0xff0000 },
            // ],

            alphaChange: [
                { t: 0, val: 1 },
                { t: 0.5, val: 1 },
                { t: 1.0, val: 0 }
            ],
            scaleFactorChange: [
                { t: 0, val: .05 },
                { t: 0.2, val: .2 },
                { t: 1, val: 0.01 },
            ]
        });

        this._effect.activated = false;

    }

    exposion(aPos: THREE.Vector3) {
        this._effect.explosion(aPos);
    }

    update(dt: number) {
        this._effect.update(dt);
    }

    free() {
        this._effect.free();
        this._effect = null;
        this._parent = null;
        this._camera = null;
        this._texture = null;
    }

}