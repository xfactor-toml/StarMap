import * as THREE from "three";
import { GalaxyStarParams } from "~/game/data/Types";

import star1Vert from "../shaders/galaxy/star_v.glsl";
import star1Frag from "../shaders/galaxy/star_f.glsl";
import star2Vert from "../shaders/galaxy/star2_v.glsl";
import star2Frag from "../shaders/galaxy/star2_f.glsl";
import { Signal } from "~/game/utils/events/Signal";
import { Settings } from "~/game/data/Settings";
import { IBaseClass } from "~/game/interfaces/IBaseClass";

const SHADER_1 = {
    vertex: star1Vert,
    fragment: star1Frag
}
const SHADER_2 = {
    vertex: star2Vert,
    fragment: star2Frag
}

type GalaxyStarsParams = {
    camera: THREE.Camera;
    starsData: GalaxyStarParams[];
    texture?: THREE.Texture;
    onWindowResizeSignal: Signal;
    camDistLogic: boolean;
    alpha?: {
        camDist: {
            min: number;
            max: number;
        },
        value: {
            min: number;
            max: number;
        }
    }
};

type Version = '1' | '2';

export class GalaxyStars extends THREE.Group implements IBaseClass {

    private _params: GalaxyStarsParams;
    private _uniforms: any;
    private _geometry: THREE.BufferGeometry;
    private _material: THREE.ShaderMaterial;
    private _stars: THREE.Points;
    private _alphaFactor = 1;

    private _type: Version;

    constructor(aParams: GalaxyStarsParams) {

        super();
        this._params = aParams;

        // this.init1();
        // this.init2_saturn();
        this.init3();

        this._params.onWindowResizeSignal.add(this.onWindowResize, this);

    }

    get alphaFactor(): number {
        return this._alphaFactor;
    }

    set alphaFactor(aVal: number) {
        this._alphaFactor = aVal;
    }

    private getPoitSizeFactor(): number {
        return innerHeight / (2.0 * Math.tan(.02 * 60.0 * Math.PI / 180));
    }

    private init2_saturn() {

        let starsData = this.generateStars(this._params.starsData);

        this._uniforms = {
            time: { value: 0 }
        }

        let points: THREE.Vector3[] = [];

        for (let i = 0; i < starsData.positionsXYZ.length; i += 3) {
            const x = starsData.positionsXYZ[i];
            const y = starsData.positionsXYZ[i + 1];
            const z = starsData.positionsXYZ[i + 2];
            points.push(new THREE.Vector3(x, y, z));
        }


        this._geometry = new THREE.BufferGeometry().setFromPoints(points);
        this._geometry.setAttribute('position', new THREE.Float32BufferAttribute(starsData.positionsXYZ, 3));
        this._geometry.setAttribute('sizes', new THREE.Float32BufferAttribute(starsData.scales, 1));
        this._geometry.setAttribute('clr', new THREE.Float32BufferAttribute(starsData.colorsRGBA, 4));


        /* eslint-disable */
        let m = new THREE.PointsMaterial({
            size: 0.125,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending
        });

        m.onBeforeCompile = shader => {

            shader.uniforms.time = this._uniforms.time;
            shader.vertexShader = `
                uniform float time;
                attribute float sizes;
                // attribute vec4 shift;
                // varying vec3 vColor;
                attribute vec4 clr;
                ${shader.vertexShader}
            `.replace(
                `gl_PointSize = size;`,
                `gl_PointSize = size * sizes;`
            ).replace(
                `#include <color_vertex>`,
                `#include <color_vertex>
                float d = length(abs(position) / vec3(40., 10., 40));
                d = clamp(d, 0., 1.);
                // vColor = mix(vec3(227., 155., 0.), vec3(100., 50., 255.), d) / 255.;
                `
            ).replace(
                `#include <begin_vertex>`,
                `#include <begin_vertex>
                float t = time;
                // float moveT = mod(shift.x + shift.z * t, PI2);
                // float moveS = mod(shift.y + shift.z * t, PI2);
                // transformed += vec3(cos(moveS) * sin(moveT), cos(moveT), sin(moveS) * sin(moveT)) * shift.w;
                `
            );

            shader.fragmentShader = `
                varying vec3 vColor;
                attribute vec4 clr;
                ${shader.fragmentShader}
          `.replace(
                `#include <clipping_planes_fragment>`,
                `
                #include <clipping_planes_fragment>
                float d = length(gl_PointCoord.xy - 0.5);
                //if (d > 0.5) discard;
                `
            ).replace(
                `vec4 diffuseColor = vec4(diffuse, opacity);`,
                `vec4 diffuseColor = vec4(clr, smoothstep(0.5, 0.1, d) /* * 0.5 + 0.5*/ );`
                // `gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColor;`
            );

        };
        /* eslint-enable */

        this._material = m as any;

        let p = new THREE.Points(this._geometry, m);
        this.add(p)

        this._type = '2';

    }

    private init3() {

        let camPos = this._params.camera.position.clone();
        if (!this._params.camDistLogic) {
            camPos.x = 0;
            camPos.y = 0;
            camPos.z = 0;
        }

        this._uniforms = {
            pointMultiplier: { value: this.getPoitSizeFactor() },
            isCamDistLogic: { value: this._params.camDistLogic },
            camPos: { value: [camPos.x, camPos.y, camPos.z] },
            sizeFactor: { value: 1 },
            // alphaFactor: { value: 1 },
            scale: { value: 1 },
        };

        this._material = new THREE.ShaderMaterial({
            vertexShader: SHADER_2.vertex,
            fragmentShader: SHADER_2.fragment,
            uniforms: this._uniforms,
            transparent: true,
            alphaTest: 0.001,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });

        let starsData = this.generateStars(this._params.starsData);

        this._geometry = new THREE.BufferGeometry();
        this._geometry.setAttribute('position', new THREE.Float32BufferAttribute(starsData.positionsXYZ, 3));
        this._geometry.setAttribute('size', new THREE.Float32BufferAttribute(starsData.scales, 1));
        this._geometry.setAttribute('clr', new THREE.Float32BufferAttribute(starsData.colorsRGBA, 4));

        this._stars = new THREE.Points(this._geometry, this._material);
        this.add(this._stars);

        this._type = '1';
    }

    private onWindowResize() {
        this._uniforms.pointMultiplier.value = this.getPoitSizeFactor();
    }

    private generateStars(aStarsData: GalaxyStarParams[]): {
        positionsXYZ: Float32Array,
        colorsRGBA: Float32Array,
        scales: Float32Array
    } {
        const starsCount = aStarsData.length;
        let positions = new Float32Array(starsCount * 3);
        let colors = new Float32Array(starsCount * 4);
        let scales = new Float32Array(starsCount);

        for (let i = 0; i < starsCount; i++) {

            let starData = aStarsData[i];
            // position
            let pId = i * 3;
            positions[pId] = starData.pos.x;
            positions[pId + 1] = starData.pos.y;
            positions[pId + 2] = starData.pos.z;

            // color
            let cId = i * 4;
            colors[cId] = starData.color.r;
            colors[cId + 1] = starData.color.g;
            colors[cId + 2] = starData.color.b;
            colors[cId + 3] = starData.color.a * this._alphaFactor;

            // size
            scales[i] = starData.scale;

        }

        return {
            positionsXYZ: positions,
            colorsRGBA: colors, 
            scales: scales
        };
    }

    // public set azimutAngle(v: number) {
    //     this._azimutAngle = v;
    // }

    // public set polarAngle(v: number) {
    //     this._polarAngle = v;
    // }

    updateUniformValues() {
        this._material.uniforms.radiusMin.value = Settings.skyData.radiusMin;
        this._material.uniforms.radiusMax.value = Settings.skyData.radiusMax;
        this._material.uniforms.scaleMin.value = Settings.skyData.scaleMin;
        this._material.uniforms.scaleMax.value = Settings.skyData.scaleMax;
        this._material.uniforms.starSize.value = Settings.skyData.starSize;
        this._material.uniforms.starAlpha.value = Settings.skyData.starAlpha;
    }
    
    free() {
        this.remove(this._stars);
        // this.geometry.vertices = [];
        this._geometry = null;
        this._material = null;
        this._params = null;
        this._stars = null;
    }

    private updateParticles(dt: number) {

        let starsData = this._params.starsData;
        // let clr: Float32Array = this.geometry.attributes['clr'].array as any; // getAttribute('clr').array;
        let clr: any = this._geometry.attributes['clr'];
        let pos: Float32Array = this._geometry.attributes['position'].array as any; // getAttribute('clr').array;

        for (let i = 0; i < starsData.length; i++) {
            const sd = starsData[i];
            let a = 1;

            // debugger;
            // if (this.params.alpha) {
            //     let posId = i * 3;
            //     let posVec = new THREE.Vector3(pos[posId], pos[posId + 1], pos[posId + 2]);
            //     let camDist = this.params.camera.position.distanceTo(posVec);
            //     let camFactor = 1 - MyMath.clamp((camDist - this.params.alpha.camDist.min) / (this.params.alpha.camDist.max - this.params.alpha.camDist.min), 0, 1);
            //     a = this.params.alpha.value.min + camFactor * (this.params.alpha.value.max - this.params.alpha.value.min);
            // }
            
            if (sd.blink) {

                let b = sd.blink;
                b.progressTime += dt;
                let t = Math.min(1, b.progressTime / b.duration);

                a = b.isFade ? 1 - b.tweenFunction(t) : b.tweenFunction(t);

                if (b.progressTime >= b.duration) {
                    b.isFade = !b.isFade;
                    b.progressTime = 0;
                }

                
            }

            let clrId = i * 4;
            clr.array[clrId + 3] = a * this._alphaFactor;
            // clr[clrId + 3] = a * this._alphaFactor;
            // LogMng.debug(`clr a: ${clr.array[clrId + 3]}`);

        }

        if (this._params.camDistLogic) {
            let camPos = this.worldToLocal(this._params.camera.position.clone());
            // let camPos = this._params.camera.position.clone();
            this._uniforms.camPos.value = [camPos.x, camPos.y, camPos.z];
        }
        else {

        }
        
        // SIZE FACTOR
        // let camDist = this.params.camera.position.length()
        // let sizeFactor = 1 - MyMath.clamp((camDist - 50) / (500 - 50), 0, .8);
        // this.uniforms.sizeFactor.value = sizeFactor;

        // CAM DIST ALPHA FACTOR
        // let camDist = this._params.camera.position.length()
        // let alphaFactor = 1 - MyMath.clamp((camDist - 100) / (500 - 100), 0, 1) * .6;
        // this._uniforms.alphaFactor.value = alphaFactor;

        // this.geometry.setAttribute('clr', colors);
        clr.needsUpdate = true;

    }

    update(dt: number) {

        switch (this._type) {
            case '1':
                // this._uniforms.scale.value = this.parent.scale.x;
                this._uniforms.scale.value = this.parent['currScale'] || 1;
                this.updateParticles(dt);
                break;
        
            case '2':
                this._uniforms.time.value += dt;
                break;
        }

    }

}