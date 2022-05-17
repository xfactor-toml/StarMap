import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import * as datGui from "dat.gui";
import { InputMng } from "../inputs/InputMng";
import { DeviceInfo } from "../utils/DeviceInfo";
import { Config } from "../data/Config";
import { LogMng } from "../utils/LogMng";
import { Params } from "../data/Params";
import { GlobalEvents } from "../events/GlobalEvents";
import { Galaxy as Galaxy } from "./Galaxy";
import { initScene, updateTest } from "./GalaxyTest";


export class GameEngine {
    private renderer: THREE.WebGLRenderer;
    private fxaaPass: ShaderPass;
    private smaaPass: SMAAPass;
    // private bloomPass: UnrealBloomPass;
    private composer: EffectComposer;
    
    private renderPixelRatio = 1;

    private backScene: THREE.Scene;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private galaxy: Galaxy;

    private clock: THREE.Clock;
    private stats: Stats;
    
    constructor() {

        // RENDER

        let w = innerWidth;
        let h = innerHeight;

        const clearColor = new THREE.Color(Config.BG_COLOR);

        this.renderer = new THREE.WebGLRenderer({
            antialias: false
        });
        this.renderer.autoClear = false;
        this.renderer.getContext().getExtension('OES_standard_derivatives');
        if (Config.USE_DEVICE_PIXEL_RATIO) {
            this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        }
        this.renderer.setSize(w, h);
        this.renderer.setClearColor(clearColor);
        this.renderPixelRatio = this.renderer.getPixelRatio();
        LogMng.debug(`Renderer PixelRatio: ${this.renderPixelRatio}`);
        Params.domCanvasParent.appendChild(this.renderer.domElement);

        // SCENES

        this.backScene = new THREE.Scene();
        this.scene = new THREE.Scene();

        // CAMERA

        this.camera = new THREE.PerspectiveCamera(
            45,
            innerWidth / innerHeight,
            0.5,
            10000);
        this.camera.position.set(10, 0, 10);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        // this.scene.add(this.camera);

        // INPUTS
        
        InputMng.getInstance({
            inputDomElement: Params.domCanvasParent,
            desktop: DeviceInfo.getInstance().desktop
        });

        // DEBUG GUI INIT

        if (Params.isDebugMode) {
            Params.datGui = new datGui.GUI();
        }

        // SCENES

        this.galaxy = new Galaxy({
            backScene: this.backScene,
            scene: this.scene,
            camera: this.camera
        });
        this.galaxy.init();

        // GUI

        let gui = Params.datGui;

        if (Params.isDebugMode) {

            const LOCAL_PARAMS = {
                'center visible': true,
                'recreate': () => {
                    
                },
                axiesHelper: false
            };

            let galaxyFolder = gui.addFolder('Galaxy');
            galaxyFolder.add(Params.galaxyData, 'stars count', 0, 10000, 100);
            galaxyFolder.add(LOCAL_PARAMS, 'center visible', true).onChange((value) => {
                this.galaxy.centerVisible = value;
            });
            galaxyFolder.add(LOCAL_PARAMS, 'recreate');
            galaxyFolder.open();

            gui.add(LOCAL_PARAMS, 'axiesHelper').onChange((value) => {
                Params.debugAxeHelperOn = value;
                // GameEvents.onDebugAxeHelperVisibleChange.dispatch(value);
            });
            
        }

        this.clock = new THREE.Clock();

        // stats
        if (Params.isDebugMode) {
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
        }

        // global events
        GlobalEvents.onWindowResizeSignal.add(this.onWindowResize, this);

        this.animate();

    }

    private onKeyDown(aCode: string, aKey: string) {
        let keyNum = Number(aKey);
        // LogMng.debug(`Test: code: ${aCode}; key: ${aKey} pressed...`);
        switch (keyNum) {
            case 1:
                if (InputMng.getInstance().isKeyDown('AltLeft')) {
                }
                break;
        }
    }

    private onWindowResize() {

        if (!this.renderer || !this.camera) return;

        let w = innerWidth;
        let h = innerHeight;

        this.renderer.setSize(w, h);

        if (this.composer) {
            this.composer.setSize(w, h);
        }

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        
        switch (Config.AA_TYPE) {
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
        this.renderer.render(this.backScene, this.camera);
        this.renderer.render(this.scene, this.camera);
    }

    private update(dt: number) {

        // hangar update
        if (this.galaxy) this.galaxy.update(dt);

    }

    private animate() {
        let dtSec = this.clock.getDelta();

        if (Params.isDebugMode) this.stats.begin();
        this.update(dtSec);
        this.render();
        if (Params.isDebugMode) this.stats.end();
        
        requestAnimationFrame(() => this.animate());
    }

}
