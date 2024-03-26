import * as THREE from "three";
import { Renderer } from "./Renderer";

type SimpleRendererParams = {
    domCanvasParent: HTMLElement,
    bgColor: number,
    aa?: boolean,
    shadows?: boolean,
    shadowType?: any,
    scene?: THREE.Scene,
    camera?: THREE.Camera
};

export class SimpleRenderer extends Renderer {
        
    constructor(aParams: SimpleRendererParams) {
        super(aParams);
        this.initRenderer(aParams);
    }

    protected initRenderer(aParams: SimpleRendererParams): void {

        let w = this._domCanvasParent.clientWidth;
        let h = this._domCanvasParent.clientHeight;

        this._renderer = new THREE.WebGLRenderer({
            antialias: aParams.aa != null ? aParams.aa : true
        });
        this._renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this._renderer.setSize(w, h);
        this._renderer.setClearColor(this._bgColor);
        this._renderer.shadowMap.enabled = aParams.shadows;
        this._renderer.shadowMap.type = aParams.shadowType || THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        this._domCanvasParent.appendChild(this._renderer.domElement);

    }

    onWindowResize(w: number, h: number) {

        this._renderer.setSize(w, h);

        if (this._camera && this._camera instanceof THREE.PerspectiveCamera) {
            this._camera.aspect = w / h;
            this._camera.updateProjectionMatrix();
        }

    }

    free() {
        this._domCanvasParent.removeChild(this._renderer.domElement);
        this._domCanvasParent = null;
        this._scene = null;
        this._camera = null;
        this._renderer = null;
    }

    render() {
        if (this._scene && this._camera) {
            this._renderer.render(this._scene, this._camera);
        }
    }

}