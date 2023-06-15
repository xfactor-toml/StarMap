import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";

import * as datGui from "dat.gui";
import { InputMng } from "../inputs/InputMng";
import { DeviceInfo } from "../utils/DeviceInfo";
import { LogMng } from "../utils/LogMng";
import { Settings } from "../data/Settings";
import { Galaxy } from "./Galaxy";
import { FrontEvents } from "../events/FrontEvents";
import { GameEvents } from "../events/GameEvents";
import { GameUtils } from "../math/GameUtils";
import { GameController } from "~/mng/GameController";


export class GameRender {
    
    private renderer: THREE.WebGLRenderer;
    private fxaaPass: ShaderPass;
    private smaaPass: SMAAPass;
    private composer: EffectComposer;
    
    private renderPixelRatio = 1;

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    private _gameController: GameController;

    private clock: THREE.Clock;
    private stats: Stats;
    
    constructor() {

        // RENDER

        let w = GameUtils.getClientWidth();
        let h = GameUtils.getClientHeight();

        const clearColor = new THREE.Color(Settings.BG_COLOR);

        this.renderer = new THREE.WebGLRenderer({
            antialias: false
        });
        this.renderer.autoClear = false;
        this.renderer.getContext().getExtension('OES_standard_derivatives');
        if (Settings.USE_DEVICE_PIXEL_RATIO) {
            this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        }
        this.renderer.setSize(w, h);
        this.renderer.setClearColor(clearColor);
        this.renderPixelRatio = this.renderer.getPixelRatio();
        LogMng.debug(`Renderer PixelRatio: ${this.renderPixelRatio}`);
        Settings.domCanvasParent.appendChild(this.renderer.domElement);
        Settings.domRenderer = this.renderer.domElement;

        // SCENES
        
        this.scene = new THREE.Scene();

        // CAMERA

        this.camera = new THREE.PerspectiveCamera(
            45,
            GameUtils.getClientAspectRatio(),
            Settings.CAMERA.near,
            Settings.CAMERA.far);
        this.camera.position.set(10, 0, 10);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        // this.scene.add(this.camera);

        // INPUTS
        
        InputMng.getInstance({
            inputDomElement: Settings.domCanvasParent,
            // inputDomElement: Params.domTouchParent,
            desktop: DeviceInfo.getInstance().desktop,
            isRightClickProcessing: false
        });

        // DEBUG GUI INIT

        if (Settings.isDebugMode) {
            Settings.datGui = new datGui.GUI();
        }

        // clock

        this.clock = new THREE.Clock();

        // stats
        if (Settings.isDebugMode) {
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
        }

        // global events
        FrontEvents.onWindowResizeSignal.add(this.onWindowResize, this);

        if (Settings.INIT_FULL_SCREEN) {
            Settings.domCanvasParent.requestFullscreen();
        }

        FrontEvents.toggleFullscreen.add(() => {
            let elem = Settings.domCanvasParent;
            if (!document.fullscreenElement) {
                elem.requestFullscreen();
                GameEvents.dispatchEvent(GameEvents.EVENT_GAME_FULSCREEN, { v: true });
            }
            else {
                document.exitFullscreen();
                GameEvents.dispatchEvent(GameEvents.EVENT_GAME_FULSCREEN, { v: false });
            }
        }, this);

        if (Settings.datGui) {
            Settings.datGui.add({
                fullscreen: () => {
                    FrontEvents.toggleFullscreen.dispatch();
                }
            }, `fullscreen`);
        }

        this.animate();

    }

    initGame() {
        // SCENES
        this._gameController = new GameController();
        this._gameController.initGalaxy({
            render: this.renderer,
            scene: this.scene,
            camera: this.camera
        });
    }

    private onWindowResize() {

        if (!this.renderer || !this.camera) return;

        let w = GameUtils.getClientWidth();
        let h = GameUtils.getClientHeight();

        this.renderer.setSize(w, h);

        if (this.composer) {
            this.composer.setSize(w, h);
        }

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        
        switch (Settings.AA_TYPE) {
            case 1:
                if (this.fxaaPass) {
                    this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (w * this.renderPixelRatio);
                    this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (h * this.renderPixelRatio);
                }
                break;
            
            case 2:

                break;
        
            default:
                break;
        }

    }

    private render() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    private update(dt: number) {

        // galaxy update
        if (this._gameController) this._gameController.update(dt);

    }

    private animate() {
        let dtSec = this.clock.getDelta();

        if (Settings.isDebugMode) this.stats.begin();
        this.update(dtSec);
        this.render();
        if (Settings.isDebugMode) this.stats.end();
        
        requestAnimationFrame(() => this.animate());
    }

}
