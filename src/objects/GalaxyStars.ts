import * as THREE from "three";
import { IBaseClass } from "../interfaces/IBaseClass";
import { Settings } from "../data/Settings";
import { Signal } from "../events/Signal";
import { GalaxyStarParams } from "../scenes/Galaxy";
import { LogMng } from "../utils/LogMng";

const _vShader = `
    attribute vec4 clr;
    attribute float size;
    uniform float pointMultiplier;
    varying vec4 vColor;

    void main() {
        vColor = clr;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = size * pointMultiplier / gl_Position.w;
    }
`;

const _fShader = `
    uniform sampler2D diffuseTexture;
    varying vec4 vColor;

    void main() {
        gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColor;
    }
`;

type GalaxyStarsParams = {
    starsData: GalaxyStarParams[];
    texture: THREE.Texture;
    onWindowResizeSignal: Signal;
};

export class GalaxyStars extends THREE.Group implements IBaseClass {

    private params: GalaxyStarsParams;
    private uniforms: any;
    private geometry: THREE.BufferGeometry;
    private material: THREE.ShaderMaterial;
    private stars: THREE.Points;
    private _alphaFactor = 1;

    constructor(aParams: GalaxyStarsParams) {

        super();
        this.params = aParams;
        
        this.uniforms = {
            diffuseTexture: { value: this.params.texture },
            pointMultiplier: { value: innerHeight / (2.0 * Math.tan(.02 * 60.0 * Math.PI / 180)) }
        };

        this.material = new THREE.ShaderMaterial({
            vertexShader: _vShader,
            fragmentShader: _fShader,
            uniforms: this.uniforms,
            blending: THREE.AdditiveBlending,
            // depthTest: true,
            depthWrite: false,
            transparent: true,
            alphaTest: 0.01,
            vertexColors: true
        });
        
        let starsData = this.generateStars(this.params.starsData);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(starsData.positionsXYZ, 3));
        this.geometry.setAttribute('size', new THREE.Float32BufferAttribute(starsData.sizes, 1));
        this.geometry.setAttribute('clr', new THREE.Float32BufferAttribute(starsData.colorsRGBA, 4));

        this.stars = new THREE.Points(this.geometry, this.material);
        this.add(this.stars);

        this.params.onWindowResizeSignal.add(this.onWindowResize, this);

    }

    get alphaFactor(): number {
        return this._alphaFactor;
    }

    set alphaFactor(aVal: number) {
        this._alphaFactor = aVal;
    }

    private onWindowResize() {
        this.uniforms.pointMultiplier.value = window.innerHeight / (2.0 * Math.tan(.02 * 60.0 * Math.PI / 180));
    }

    private generateStars(aStarsData: GalaxyStarParams[]): {
        positionsXYZ: Float32Array,
        colorsRGBA: Float32Array,
        sizes: Float32Array
    } {
        const starsCount = aStarsData.length;
        let positions = new Float32Array(starsCount * 3);
        let colors = new Float32Array(starsCount * 4);
        let sizes = new Float32Array(starsCount);

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
            sizes[i] = starData.scale;

        }

        return {
            positionsXYZ: positions,
            colorsRGBA: colors, 
            sizes: sizes
        };
    }

    // public set azimutAngle(v: number) {
    //     this._azimutAngle = v;
    // }

    // public set polarAngle(v: number) {
    //     this._polarAngle = v;
    // }

    updateUniformValues() {
        this.material.uniforms.radiusMin.value = Settings.skyData.radiusMin;
        this.material.uniforms.radiusMax.value = Settings.skyData.radiusMax;
        this.material.uniforms.scaleMin.value = Settings.skyData.scaleMin;
        this.material.uniforms.scaleMax.value = Settings.skyData.scaleMax;
        this.material.uniforms.starSize.value = Settings.skyData.starSize;
        this.material.uniforms.starAlpha.value = Settings.skyData.starAlpha;
    }
    
    free() {
        this.remove(this.stars);
        // this.geometry.vertices = [];
        this.geometry = null;
        this.material = null;
        this.params = null;
        this.stars = null;
    }

    private updateParticles(dt: number) {

        let starsData = this.params.starsData;
        // let colors: Float32Array = this.geometry.attributes['clr'].array as any; // getAttribute('clr').array;
        let clr: any = this.geometry.attributes['clr']; // getAttribute('clr').array;

        for (let i = 0; i < starsData.length; i++) {
            const sd = starsData[i];
            let a = 1;

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
            // LogMng.debug(`clr a: ${clr.array[clrId + 3]}`);

        }

        // this.geometry.setAttribute('clr', colors);
        clr.needsUpdate = true;

    }

    update(dt: number) {

        this.updateParticles(dt);

    }

}