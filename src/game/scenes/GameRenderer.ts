import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";

import { LogMng } from "../utils/LogMng";
import { Settings } from "../data/Settings";
import { FrontEvents } from "../events/FrontEvents";
import { GameEvents } from "../events/GameEvents";
import { GameUtils } from "../math/GameUtils";


export class GameRenderer {
    
    private _renderer: THREE.WebGLRenderer;
    private _fxaaPass: ShaderPass;
    private _smaaPass: SMAAPass;
    private _composer: EffectComposer;
    private _renderPixelRatio = 1;
    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;

    
    constructor() {

        let w = GameUtils.getClientWidth();
        let h = GameUtils.getClientHeight();

        const clearColor = new THREE.Color(Settings.BG_COLOR);

        this._renderer = new THREE.WebGLRenderer({
            antialias: false
        });
        this._renderer.autoClear = false;
        this._renderer.getContext().getExtension('OES_standard_derivatives');
        if (Settings.USE_DEVICE_PIXEL_RATIO) {
            this._renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        }
        this._renderer.setSize(w, h);
        this._renderer.setClearColor(clearColor);
        this._renderPixelRatio = this._renderer.getPixelRatio();
        LogMng.debug(`Renderer PixelRatio: ${this._renderPixelRatio}`);
        Settings.domCanvasParent.appendChild(this._renderer.domElement);
        Settings.domRenderer = this._renderer.domElement;

        // SCENES
        
        this._scene = new THREE.Scene();

        // CAMERA

        this._camera = new THREE.PerspectiveCamera(
            45,
            GameUtils.getClientAspectRatio(),
            Settings.CAMERA.near,
            Settings.CAMERA.far);
        this._camera.position.set(10, 0, 10);
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));        

        // global events
        FrontEvents.onWindowResizeSignal.add(this.onWindowResize, this);

        if (Settings.INIT_FULL_SCREEN) {
            document.body.requestFullscreen();
        }

        FrontEvents.toggleFullscreen.add(() => {
            if (!document.fullscreenElement) {
                document.body.requestFullscreen();
                GameEvents.dispatchEvent(GameEvents.EVENT_GAME_FULLSCREEN, { v: true });
            }
            else {
                document.exitFullscreen();
                GameEvents.dispatchEvent(GameEvents.EVENT_GAME_FULLSCREEN, { v: false });
            }
        }, this);

    }

    private onWindowResize() {

        if (!this._renderer || !this._camera) return;

        let w = GameUtils.getClientWidth();
        let h = GameUtils.getClientHeight();

        this._renderer.setSize(w, h);

        if (this._composer) {
            this._composer.setSize(w, h);
        }

        this._camera.aspect = w / h;
        this._camera.updateProjectionMatrix();
        
        switch (Settings.AA_TYPE) {
            case 1:
                if (this._fxaaPass) {
                    this._fxaaPass.material.uniforms['resolution'].value.x = 1 / (w * this._renderPixelRatio);
                    this._fxaaPass.material.uniforms['resolution'].value.y = 1 / (h * this._renderPixelRatio);
                }
                break;
            
            case 2:

                break;
        
            default:
                break;
        }

    }
    
    public get renderer(): THREE.WebGLRenderer {
        return this._renderer;
    }
    
    public get scene(): THREE.Scene {
        return this._scene;
    }
    
    public get camera(): THREE.PerspectiveCamera {
        return this._camera;
    }
    
    render() {
        this._renderer.clear();
        this._renderer.render(this._scene, this._camera);
    }

}
