import * as THREE from "three";

import starNovaVert from "../shaders/galaxy/starNova_v.glsl";
import starNovaFrag from "../shaders/galaxy/starNova_f.glsl";

export class NovaSprite extends THREE.Group {
    private _camera: THREE.Camera;
    private _spr: THREE.Mesh;
    private _material: THREE.ShaderMaterial;
    private _uniforms: any;

    constructor(aParams: { camera: THREE.Camera }) {
        super();
        this._camera = aParams.camera;
        this._uniforms = {
            camPos: { value: [this._camera.position.x, this._camera.position.y, this._camera.position.z] },
            sizeFactor: { value: 10 },
            iColor: { value: [0, 1, 0, 1] },
        };
        let geom = new THREE.PlaneGeometry(10, 10);
        this._material = new THREE.ShaderMaterial({
            vertexShader: starNovaVert,
            fragmentShader: starNovaFrag,
            uniforms: this._uniforms,
            transparent: true,
            alphaTest: 0.001,
            // opacity: 1,
            // depthWrite: false,
            // blending: THREE.AdditiveBlending
        });
        // let testMat = new THREE.MeshNormalMaterial();
        this._spr = new THREE.Mesh(geom, this._material);
        // this._spr = new THREE.Mesh(geom, testMat);
        this.add(this._spr);
    }

    update(dt: number) {
        this._spr.lookAt(this._camera.position);
    }

}