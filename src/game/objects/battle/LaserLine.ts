import * as THREE from 'three';
import { MyObject3D } from '~/game/basics/MyObject3D';
import { MyMath } from '~/game/utils/MyMath';
import gsap from 'gsap';

const LINES_CNT = 10;

const START_OPACITY = 0.2;
const FINAL_OPACITY = 0;

const MIN_RADIUS = 0.01;
const MAX_RADIUS = 0.08;


export class LaserLine extends MyObject3D {
    private materials: THREE.MeshBasicMaterial[];
    private meshes: THREE.Mesh[];
    private tweens: gsap.core.Tween[];
    private _color: string;
    private _points: any[];
    private _hided = false;
    private _lighted = false;


    constructor(aPosStart: THREE.Vector3, aPosEnd: THREE.Vector3, aColor: string) {
        super();

        this._color = aColor;
        this._points = [aPosStart, aPosEnd];

        let pos1 = aPosStart;
        let pos2 = aPosEnd;

        let newPos1 = pos1.clone(); // .add(norm1.multiplyScalar(130));
        let newPos2 = pos2.clone(); // .add(norm2.multiplyScalar(130));

        let distance = newPos1.distanceTo(newPos2);

        this.tweens = [];
        this.materials = [];
        this.meshes = [];
        let len = LINES_CNT;

        for (let i = 0; i < len; i++) {

            // line
            let mat = new THREE.MeshBasicMaterial({
                color: this._color,
                transparent: true,
                opacity: this.getOpacityForLine(i),
                side: THREE.DoubleSide,
                // depthTest: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            let radius = MIN_RADIUS + i / len * (MAX_RADIUS - MIN_RADIUS);
            let geometry = new THREE.CylinderGeometry(radius, radius, distance, 8, 1, false);
            // shift it so one end rests on the origin
            geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, distance / 2, 0));
            // rotate it the right way for lookAt to work
            geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(MyMath.toRadian(90)));
            // Make a mesh with the geometry
            let mesh = new THREE.Mesh(geometry, mat);
            // Position it where we want
            mesh.position.copy(newPos1);
            mesh.scale.set(2, 2, 1);
            // And make it point to where we want
            mesh.lookAt(newPos2);
            this.add(mesh);

            this.materials.push(mat);
            this.meshes.push(mesh);
        }

    }

    public get color(): string {
        return this._color;
    }
    
    public get stars(): any[] {
        return this._points;
    }

    public set lineScale(aScale: number) {
        for (let i = 0; i < this.meshes.length; i++) {
            const mesh = this.meshes[i];
            mesh.scale.set(aScale, aScale, 1);
        }
    }

    private stopAllTweens() {
        for (let i = 0; i < this.tweens.length; i++) {
            const tw = this.tweens[i];
            tw.kill();
        }
        this.tweens = [];
    }

    private getOpacityForLine(aLineId: number): number {
        // let res = BASE_OPACITY - BASE_OPACITY * aLineId / LINES_CNT;
        let res = START_OPACITY - aLineId / LINES_CNT * (START_OPACITY - FINAL_OPACITY);
        return res;
    }

    private getLightOpacityForLine(aLineId: number): number {
        // let res = LIGHT_FACTOR * (BASE_OPACITY - BASE_OPACITY * aLineId / LINES_CNT);
        let start = 1;
        let final = 0.8;
        let res = start - aLineId / LINES_CNT * (start - (final)) / 1;
        return res;
    }

    hide(aParams: {
        dur?: number,
        delay?: number,
        easing?: any,
        cb?: Function, ctx?: any,
        isFast?: boolean
    }) {
        if (this._hided) return;
        this._hided = true;
        this.stopAllTweens();

        if (!aParams.easing) aParams.easing = 'sine.inOut';

        if (aParams.isFast == true) {
            for (let i = 0; i < this.materials.length; i++) {
                const mat = this.materials[i];
                mat.opacity = 0;
            }
        }
        else {
            for (let i = 0; i < this.materials.length; i++) {
                const mat = this.materials[i];
                let tw = gsap.to(mat, {
                    opacity: 0,
                    duration: aParams.dur || 1000,
                    delay: aParams.delay || 0,
                    ease: aParams.easing,
                });
                this.tweens.push(tw);
            }
        }
    }

    show(aParams: {
        dur?: number,
        delay?: number,
        easing?: any,
        cb?: Function, ctx?: any,
        isFast?: boolean
    }) {
        if (!this._hided) return;
        this._hided = false;
        this.stopAllTweens();

        if (!aParams.easing) aParams.easing = 'sine.inOut';

        for (let i = 0; i < this.materials.length; i++) {
            const mat = this.materials[i];
            // let opacity = BASE_OPACITY / i;
            let opacity = this.getOpacityForLine(i); // BASE_OPACITY - i / len;
            if (aParams.isFast == true) {
                mat.opacity = opacity;
            }
            else {
                let tw = gsap.to(mat, {
                    opacity: opacity,
                    duration: aParams.dur || 1000,
                    delay: aParams.delay || 0,
                    ease: aParams.easing
                });
                this.tweens.push(tw);
            }
        }

    }

    lightOn(aParams: {
        intensFactor?: number,
        dur?: number,
        delay?: number,
        easing?: any,
        cb?: Function, ctx?: any,
        isFast?: boolean
    }) {
        if (this._lighted) return;
        this._lighted = true;

        if (!aParams.easing) aParams.easing = 'sine.inOut';

        let len = this.materials.length;
        for (let i = 0; i < this.materials.length; i++) {
            const mat = this.materials[i];
            let opacity = this.getLightOpacityForLine(i);
            if (aParams.intensFactor > 0) opacity *= aParams.intensFactor;

            if (aParams.isFast == true) {
                mat.opacity = opacity;
            }
            else {
                gsap.to(mat, {
                    opacity: opacity,
                    duration: aParams.dur || 1000,
                    delay: aParams.delay || 0,
                    ease: aParams.easing,
                });
            }
        }

    }

    lightOff(aParams: {
        dur?: number,
        delay?: number,
        easing?: any,
        cb?: Function, ctx?: any,
        isFast?: boolean
    }) {
        if (!this._lighted) return;
        this._lighted = false;

        if (!aParams.easing) aParams.easing = 'sine.inOut';

        let len = this.materials.length;
        for (let i = 0; i < this.materials.length; i++) {
            const mat = this.materials[i];
            let opacity = this.getOpacityForLine(i);
            if (aParams.isFast == true) {
                mat.opacity = opacity;
            }
            else {
                gsap.to(mat, {
                    opacity: opacity,
                    duration: aParams.dur || 1000,
                    delay: aParams.delay || 0,
                    ease: aParams.easing,
                });
            }
        }

    }

    update(dt: number) {
        super.update(dt);
    }

}