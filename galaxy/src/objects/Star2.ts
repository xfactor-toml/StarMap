import * as THREE from "three";

import vsSun from '../shaders/sun1/vs.glsl';
import fsSun from '../shaders/sun1/fs.glsl';
import { SolarSystem } from "./SolarSystem";

export type StarParams = {
    solarSystem: SolarSystem;
    camera: THREE.PerspectiveCamera;
    starSize: number;
};

export class Star2 extends THREE.Group {
    private params: StarParams;
    private light: THREE.PointLight;
    private mesh: THREE.Mesh;
    private uniforms: any;

    constructor(aParams: StarParams) {

        super();

        this.params = aParams;

        // if (this.params.isShine == true) {
        //     this.light = new THREE.PointLight(this.data.color, this.data.shineIntensive, this.data.shineDistance);
        //     this.add(this.light);
        // }

        // let sun_clr_1 = new THREE.Color(aStarData.sunClr1);
        // let sun_clr_2 = new THREE.Color(aStarData.sunClr2);
        // let sun_clr_3 = new THREE.Color(aStarData.sunClr3);
        // let sun_clr_4 = new THREE.Color(aStarData.sunClr4);
        // let sun_clr_5 = new THREE.Color(aStarData.sunClr5);
        // let sun_corona_clr_1 = new THREE.Color(aStarData.sunCoronaClr1);
        // let sun_corona_clr_2 = new THREE.Color(aStarData.sunCoronaClr2);

        // test
        let sun_clr_1 = new THREE.Color(1.0, 1.0, .0);
        let sun_clr_2 = new THREE.Color(1.0, .0, .0);
        let sun_clr_3 = new THREE.Color(1.0, .0, 1.0);
        let sun_clr_4 = new THREE.Color(1.0, 1.0, 1.0);
        let sun_clr_5 = new THREE.Color(1., 0.894, 0.);
        let sun_corona_clr_1 = new THREE.Color(1.0, .95, 1.0);
        let sun_corona_clr_2 = new THREE.Color(1.0, 0.6, 0.1);

        this.uniforms = {
            iTime: { value: 0 },
            mx: { value: 0 },
            my: { value: 0 },
            sun_clr_1: { value: { x: sun_clr_1.r, y: sun_clr_1.g, z: sun_clr_1.b } },
            sun_clr_2: { value: { x: sun_clr_2.r, y: sun_clr_2.g, z: sun_clr_2.b } },
            sun_clr_3: { value: { x: sun_clr_3.r, y: sun_clr_3.g, z: sun_clr_3.b } },
            sun_clr_4: { value: { x: sun_clr_4.r, y: sun_clr_4.g, z: sun_clr_4.b } },
            sun_clr_5: { value: { x: sun_clr_5.r, y: sun_clr_5.g, z: sun_clr_5.b } },
            sun_corona_clr_1: { value: { x: sun_corona_clr_1.r, y: sun_corona_clr_1.g, z: sun_corona_clr_1.b } },
            sun_corona_clr_2: { value: { x: sun_corona_clr_2.r, y: sun_corona_clr_2.g, z: sun_corona_clr_2.b } },
            corona_size: { value: 1 } //aParams.coronaSize }
        };

        let shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vsSun,
            fragmentShader: fsSun,
            uniforms: this.uniforms,
            transparent: true,
            depthWrite: false,
            // blending: THREE.AdditiveBlending
        });

        let size = this.params.starSize || 1;

        let geom = new THREE.PlaneGeometry(size, size);

        this.mesh = new THREE.Mesh(geom, shaderMaterial);
        
        this.add(this.mesh);
    }

    update(dt: number) {
        // this.uf.iTime.value = Params.clock.getElapsedTime();
        this.uniforms.iTime.value += dt;

        let camera = this.params.camera;
        if (camera) {
            this.mesh.quaternion.copy(camera.quaternion);
            let p = camera.position.clone().sub(this.params.solarSystem.position).normalize();
            this.uniforms.my.value = Math.atan2(Math.sqrt(p.x * p.x + p.z * p.z), p.y) - Math.PI / 2;
            this.uniforms.mx.value = Math.atan2(p.z, p.x);
        }
    }

}