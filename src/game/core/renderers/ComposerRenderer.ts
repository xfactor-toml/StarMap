import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Renderer, RendererParams } from "./Renderer";
import { DebugGui } from "~/game/debug/DebugGui";

const DEBUG_FOLDER_NAME = 'ComposerRenderer';

export type AAType = 'NONE' | 'BASIC' | 'FXAA' | 'SMAA';

type Passes = {
    composer?: EffectComposer;
    renderPass?: RenderPass;
    fxaaPass?: ShaderPass;
    smaaPass?: SMAAPass;
}

type ComposerRendererParams = RendererParams & {
    aaType?: AAType
}

export class ComposerRenderer extends Renderer {

    private _aaType: AAType;
    private _passes: Passes;
    private _guiAlias = {
        bloomStrength: 'bloomStrength',
        bloomRadius: 'bloomRadius',
        bloomThreshold: 'bloomThreshold'
    };

    constructor(aParams: ComposerRendererParams) {
        super(aParams);
        this._aaType = aParams.aaType || 'BASIC';
        this.initRenderer();
        this.initPasses();
    }

    protected initRenderer() {
        const w = this._domCanvasParent.clientWidth;
        const h = this._domCanvasParent.clientHeight;

        this._renderer = new THREE.WebGLRenderer({
            antialias: this._aaType === 'BASIC'
        });
        this._renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this._renderer.setSize(w, h);
        this._renderer.setClearColor(this._bgColor);
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        
        this._domCanvasParent.appendChild(this._renderer.domElement);
    }

    public set scene(v: THREE.Scene) {
        this._scene = v;
        if (this._passes && this._passes.renderPass) this._passes.renderPass.scene = this._scene;
    }

    public set camera(v: THREE.Camera) {
        this._camera = v;
        if (this._passes && this._passes.renderPass) this._passes.renderPass.camera = this._camera;
    }

    private initPasses() {

        const w = this._domCanvasParent.clientWidth;
        const h = this._domCanvasParent.clientHeight;
        const pixelRatio = this._renderer.getPixelRatio();

        this._passes = {};

        // render pass
        this._passes.renderPass = new RenderPass(this._scene, this._camera);

        // anti-aliasing pass
        let aaPass: ShaderPass | SMAAPass;
        switch (this._aaType) {

            case 'NONE':
            case 'BASIC':
                break;

            case 'FXAA':
                // FXAA
                aaPass = this._passes.fxaaPass = new ShaderPass(FXAAShader);
                this._passes.fxaaPass.material.uniforms['resolution'].value.x = 1 / (w * pixelRatio);
                this._passes.fxaaPass.material.uniforms['resolution'].value.y = 1 / (h * pixelRatio);
                break;

            case 'SMAA':
                // SMAA
                aaPass = this._passes.smaaPass = new SMAAPass(w, h);
                break;

            default:
                this.logWarn(`initPasses(): Unknown anti-aliasing type: ${this._aaType}`);
                break;
        }

        // bloom pass
        const bloomParams = {
            bloomStrength: .5,
            bloomRadius: 0,
            bloomThreshold: 0
        };

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            bloomParams.bloomStrength,
            bloomParams.bloomRadius,
            bloomParams.bloomThreshold
        );

        let rt = new THREE.WebGLRenderTarget(innerWidth, innerHeight, {
            type: THREE.FloatType,
            colorSpace: THREE.SRGBColorSpace,
            // minFilter: THREE.NearestFilter,
            // magFilter: THREE.NearestFilter,
            // samples: 2
        });

        this._passes.composer = new EffectComposer(this._renderer, rt);
        this._passes.composer.setPixelRatio(1);
        this._passes.composer.addPass(this._passes.renderPass);
        this._passes.composer.addPass(bloomPass);

        // output pass (improves the picture but -16 FPS)
        const outputPass = new OutputPass();
        this._passes.composer.addPass(outputPass);

        if (aaPass) this._passes.composer.addPass(aaPass);

        // debug gui bloom
        if (this._debugMode) {
            let f = DebugGui.getInstance().createFolder(DEBUG_FOLDER_NAME);
            f.add(bloomParams, 'bloomStrength', 0, 3, 0.0001).onChange((v) => {
                bloomPass.strength = v;
            });
            f.add(bloomParams, 'bloomRadius', 0, 1, 0.001).onChange((v) => {
                bloomPass.radius = v;
            });
            f.add(bloomParams, 'bloomThreshold', 0, 1, 0.001).onChange((v) => {
                bloomPass.threshold = v;
            });
        }

    }

    onWindowResize(w: number, h: number) {
        const pixelRatio = this._renderer.getPixelRatio();

        this._renderer.setSize(w, h);
        this._passes.composer.setSize(w, h);

        switch (this._aaType) {
            case 'FXAA':
                this._passes.fxaaPass.material.uniforms['resolution'].value.x = 1 / (w * pixelRatio);
                this._passes.fxaaPass.material.uniforms['resolution'].value.y = 1 / (h * pixelRatio);
                break;
        }

        if (this._camera && this._camera instanceof THREE.PerspectiveCamera) {
            this._camera.aspect = w / h;
            this._camera.updateProjectionMatrix();
        }

    }

    free() {
        if (this._debugMode) {
            DebugGui.getInstance().removeElement(DEBUG_FOLDER_NAME);
        }

        this._domCanvasParent.removeChild(this._renderer.domElement);
        this._domCanvasParent = null;
        this._scene = null;
        this._camera = null;
        this._aaType = null;
        this._renderer = null;
        this._passes = null;
    }

    render() {
        if (this._scene && this._camera) {
            this._passes.composer.render();
        }
    }

}