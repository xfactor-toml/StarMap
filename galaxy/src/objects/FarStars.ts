import * as THREE from "three";
import { IBaseClass } from "../interfaces/IBaseClass";

import vsFarStars from '../shaders/farStars/vs.glsl';
import fsFarStars from '../shaders/farStars/fs.glsl';
import { MyMath } from "../utils/MyMath";
import { Params } from "../data/Params";

export type FarStarsParams = {
    starsCount: number;
    radiusMin: number;
    radiusMax: number;
};

export class FarStars extends THREE.Group implements IBaseClass {
    private params: FarStarsParams;
    private geometry: THREE.Geometry;
    private material: THREE.ShaderMaterial;
    private stars: THREE.Points;
    private _azimutAngle = 0;
    private _polarAngle = 0;
    private _prevCamAzimutAngle = 0;
    private _prevCamPolarAngle = 0;

    constructor(aParams: FarStarsParams) {
        super();
        this.params = aParams;

        this.geometry = new THREE.Geometry();
        this.geometry.vertices = this.generatePositions(this.params.starsCount, this.params.radiusMin, this.params.radiusMax);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vsFarStars,
            fragmentShader: fsFarStars,
            uniforms: {
                radiusMin: { value: Params.skyData.radiusMin },
                radiusMax: { value: Params.skyData.radiusMax },
                scaleMin: { value: Params.skyData.scaleMin },
                scaleMax: { value: Params.skyData.scaleMax },
                starSize: { value: Params.skyData.starSize },
                starAlpha: { value: Params.skyData.starAlpha },
                cameraMovmentPower: { value: [0.0, 0.0] },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.stars = new THREE.Points(this.geometry, this.material);
        this.add(this.stars);
    }

    private generatePositions(aStarsCount: number, aRadiusMin: number, aRadiusMax: number): THREE.Vector3[] {
        const starsCount = aStarsCount;
        const systemRadius = aRadiusMax - aRadiusMin;
        let stars: THREE.Vector3[] = [];

        for (let i = 0; i < starsCount; i++) {
            let layer = 0;
            let r = MyMath.randomIntInRange(0, 100);
            if (r < 10) layer = 0;
            else if (r < 30) layer = 1;
            else layer = 2;

            let radius = 0;

            switch (layer) {
                case 0:
                    radius = MyMath.randomInRange(0, systemRadius * 0.25);
                    break;
                case 1:
                    radius = MyMath.randomInRange(systemRadius * 0.25, systemRadius * 0.5);
                    break;
                case 2:
                    radius = MyMath.randomInRange(systemRadius * 0.5, systemRadius);
                    break;
            }

            radius += aRadiusMin;

            let newStarPos = new THREE.Vector3(
                MyMath.randomInRange(-10, 10),
                MyMath.randomInRange(-10, 10),
                MyMath.randomInRange(-10, 10)
            );
            newStarPos.normalize().multiplyScalar(aRadiusMin + radius);
            stars.push(newStarPos);
        }
        return stars;
    }
    
    public set azimutAngle(v: number) {
        this._azimutAngle = v;
    }

    public set polarAngle(v: number) {
        this._polarAngle = v;
    }

    updateUniformValues() {
        this.material.uniforms.radiusMin.value = Params.skyData.radiusMin;
        this.material.uniforms.radiusMax.value = Params.skyData.radiusMax;
        this.material.uniforms.scaleMin.value = Params.skyData.scaleMin;
        this.material.uniforms.scaleMax.value = Params.skyData.scaleMax;
        this.material.uniforms.starSize.value = Params.skyData.starSize;
        this.material.uniforms.starAlpha.value = Params.skyData.starAlpha;
    }
    
    free() {
        this.remove(this.stars);
        this.geometry.vertices = [];
        this.geometry = null;
        this.material = null;
        this.params = null;
        this.stars = null;
    }

    update(dt: number) {

        // let aAngle = camOrbit.getAzimuthalAngle();
        this._azimutAngle;
        let dtAzimut = this._azimutAngle - this._prevCamAzimutAngle;
        const checkAngle = Math.PI / 4 * 3;

        if (
            (this._prevCamAzimutAngle < -checkAngle && this._azimutAngle > checkAngle) ||
            (this._prevCamAzimutAngle > checkAngle && this._azimutAngle < -checkAngle)
        ) {
            dtAzimut = Math.abs(this._azimutAngle) - Math.abs(this._prevCamAzimutAngle);
        }
        this._prevCamAzimutAngle = this._azimutAngle;

        // let pAngle = camOrbit.getPolarAngle();
        let dtPolar = this._polarAngle - this._prevCamPolarAngle;
        this._prevCamPolarAngle = this._polarAngle;

        let azFactor = dtAzimut * 10;
        let polFactor = dtPolar * 10;

        this.material.uniforms.cameraMovmentPower.value = [azFactor, polFactor];

    }

}