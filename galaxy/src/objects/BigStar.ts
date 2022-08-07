import * as THREE from "three";

import vsSun from '../shaders/sun1/vs.glsl';
import fsSun from '../shaders/sun1/fs.glsl';
import { Params } from "../data/Params";

export type BigStarParams = {
    starSize: number;
    sunClr1?: { r, g, b };
    sunClr2?: { r, g, b };
    sunClr3?: { r, g, b };
    sunClr4?: { r, g, b };
    sunClr5?: { r, g, b };
    sunCoronaClr1?: { r, g, b };
    sunCoronaClr2?: { r, g, b };
};

export class BigStar extends THREE.Group {

    private _parentPos: THREE.Vector3;
    private _camera: THREE.Camera;
    private _params: BigStarParams;
    private _light: THREE.PointLight;
    private _mesh: THREE.Mesh;
    private _uniforms: any;

    constructor(aParentPos: THREE.Vector3, aCamera: THREE.Camera, aParams: BigStarParams) {

        super();

        this._parentPos = aParentPos;
        this._camera = aCamera;
        this._params = aParams;

        if (!this._params.sunClr1) this._params.sunClr1 = { r: 1.0, g: 1.0, b: .0 };
        if (!this._params.sunClr2) this._params.sunClr2 = { r: 1.0, g: .0, b: .0 };
        if (!this._params.sunClr3) this._params.sunClr3 = { r: 1.0, g: .0, b: 1.0 };
        if (!this._params.sunClr4) this._params.sunClr4 = { r: 1.0, g: 1.0, b: 1.0 };
        if (!this._params.sunClr5) this._params.sunClr5 = { r: 1.0, g: .894, b: .0 };
        if (!this._params.sunCoronaClr1) this._params.sunCoronaClr1 = { r: 1.0, g: .95, b: 1.0 };
        if (!this._params.sunCoronaClr2) this._params.sunCoronaClr2 = { r: 1.0, g: .6, b: .1 };
        
        // if (this.params.isShine == true) {
        //     this.light = new THREE.PointLight(this.data.color, this.data.shineIntensive, this.data.shineDistance);
        //     this.add(this.light);
        // }

        // test
        // let sun_clr_1 = new THREE.Color(1.0, 1.0, .0);
        // let sun_clr_2 = new THREE.Color(1.0, .0, .0);
        // let sun_clr_3 = new THREE.Color(1.0, .0, 1.0);
        // let sun_clr_4 = new THREE.Color(1.0, 1.0, 1.0);
        // let sun_clr_5 = new THREE.Color(1., 0.894, 0.);
        // let sun_corona_clr_1 = new THREE.Color(1.0, .95, 1.0);
        // let sun_corona_clr_2 = new THREE.Color(1.0, 0.6, 0.1);

        // from string to RGB
        // let sun_clr_1 = new THREE.Color(aStarData.sunClr1);
        // let sun_clr_2 = new THREE.Color(aStarData.sunClr2);
        // let sun_clr_3 = new THREE.Color(aStarData.sunClr3);
        // let sun_clr_4 = new THREE.Color(aStarData.sunClr4);
        // let sun_clr_5 = new THREE.Color(aStarData.sunClr5);
        // let sun_corona_clr_1 = new THREE.Color(aStarData.sunCoronaClr1);
        // let sun_corona_clr_2 = new THREE.Color(aStarData.sunCoronaClr2);
        
        // RGB
        let clr1 = this._params.sunClr1;
        let clr2 = this._params.sunClr2;
        let clr3 = this._params.sunClr3;
        let clr4 = this._params.sunClr4;
        let clr5 = this._params.sunClr5;
        let coronaClr1 = this._params.sunCoronaClr1;
        let coronaClr2 = this._params.sunCoronaClr2;

        this._uniforms = {
            iTime: { value: 0 },
            mx: { value: 0 },
            my: { value: 0 },
            sun_clr_1: { value: { x: clr1.r, y: clr1.g, z: clr1.b } },
            sun_clr_2: { value: { x: clr2.r, y: clr2.g, z: clr2.b } },
            sun_clr_3: { value: { x: clr3.r, y: clr3.g, z: clr3.b } },
            sun_clr_4: { value: { x: clr4.r, y: clr4.g, z: clr4.b } },
            sun_clr_5: { value: { x: clr5.r, y: clr5.g, z: clr5.b } },
            sun_corona_clr_1: { value: { x: coronaClr1.r, y: coronaClr1.g, z: coronaClr1.b } },
            sun_corona_clr_2: { value: { x: coronaClr2.r, y: coronaClr2.g, z: coronaClr2.b } },
            corona_size: { value: 1 } //aParams.coronaSize }
        };

        // GUI settings
        if (false && Params.datGui) {
            let gui = Params.datGui;
            let f = gui.addFolder('Big Star');
            let clr1 = gui.addFolder('clr 1');
            let clr2 = gui.addFolder('clr 2');
            let clr3 = gui.addFolder('clr 3');
            let clr4 = gui.addFolder('clr 4');
            let clr5 = gui.addFolder('clr 5');
            let corona1 = gui.addFolder('corona 1');
            let corona2 = gui.addFolder('corona 2');

            clr1.add(this._uniforms.sun_clr_1.value, 'x', 0, 1, 0.01);
            clr1.add(this._uniforms.sun_clr_1.value, 'y', 0, 1, 0.01);
            clr1.add(this._uniforms.sun_clr_1.value, 'z', 0, 1, 0.01);

            clr2.add(this._uniforms.sun_clr_2.value, 'x', 0, 1, 0.01);
            clr2.add(this._uniforms.sun_clr_2.value, 'y', 0, 1, 0.01);
            clr2.add(this._uniforms.sun_clr_2.value, 'z', 0, 1, 0.01);

            clr3.add(this._uniforms.sun_clr_3.value, 'x', 0, 1, 0.01);
            clr3.add(this._uniforms.sun_clr_3.value, 'y', 0, 1, 0.01);
            clr3.add(this._uniforms.sun_clr_3.value, 'z', 0, 1, 0.01);

            clr4.add(this._uniforms.sun_clr_4.value, 'x', 0, 1, 0.01);
            clr4.add(this._uniforms.sun_clr_4.value, 'y', 0, 1, 0.01);
            clr4.add(this._uniforms.sun_clr_4.value, 'z', 0, 1, 0.01);

            clr5.add(this._uniforms.sun_clr_5.value, 'x', 0, 1, 0.01);
            clr5.add(this._uniforms.sun_clr_5.value, 'y', 0, 1, 0.01);
            clr5.add(this._uniforms.sun_clr_5.value, 'z', 0, 1, 0.01);

            corona1.add(this._uniforms.sun_corona_clr_1.value, 'x', 0, 1, 0.01);
            corona1.add(this._uniforms.sun_corona_clr_1.value, 'y', 0, 1, 0.01);
            corona1.add(this._uniforms.sun_corona_clr_1.value, 'z', 0, 1, 0.01);

            corona2.add(this._uniforms.sun_corona_clr_2.value, 'x', 0, 1, 0.01);
            corona2.add(this._uniforms.sun_corona_clr_2.value, 'y', 0, 1, 0.01);
            corona2.add(this._uniforms.sun_corona_clr_2.value, 'z', 0, 1, 0.01);            
        }

        let shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vsSun,
            fragmentShader: fsSun,
            uniforms: this._uniforms,
            transparent: true,
            depthWrite: false,
            // blending: THREE.AdditiveBlending
        });

        let size = this._params.starSize || 1;

        let geom = new THREE.PlaneGeometry(size, size);

        this._mesh = new THREE.Mesh(geom, shaderMaterial);
        
        this.add(this._mesh);
    }

    update(dt: number) {
        // this.uf.iTime.value = Params.clock.getElapsedTime();
        this._uniforms.iTime.value += dt;

        let camera = this._camera;
        if (camera) {
            this._mesh.quaternion.copy(camera.quaternion);
            let p = camera.position.clone().sub(this._parentPos).normalize();
            this._uniforms.my.value = Math.atan2(Math.sqrt(p.x * p.x + p.z * p.z), p.y) - Math.PI / 2;
            this._uniforms.mx.value = Math.atan2(p.z, p.x);
        }
    }

}