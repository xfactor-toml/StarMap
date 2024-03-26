import * as THREE from "three";
import { SceneMng } from "./scene/SceneMng";
import { BasicScene } from "./scene/BasicScene";
import { DeviceInfo } from "../utils/DeviceInfo";
import { GlobalParams } from "../data/GlobalParams";
import { FrontEvents } from "../events/FrontEvents";
import { InputMng } from "../utils/inputs/InputMng";
import { MyLogger } from "../basics/MyLogger";

type GameParams = {
    scenes: BasicScene[];
    inputDomElement: HTMLElement;
}

export class GameEngine extends MyLogger {
    private _params: GameParams;
    private _sceneMng: SceneMng;
    private _stats: Stats;
    private _clock: THREE.Clock;

    constructor(aParams: GameParams) {
        super('GameEngine');

        this._params = aParams;
        this._clock = new THREE.Clock();

        this.initStats();
        this.initEvents();
        this.initInputs(this._params.inputDomElement);
        this.initScenes(this._params.scenes);
        this.animate();
    }

    private initStats() {
        if (GlobalParams.isDebugMode) {
            this._stats = new Stats();
            this._stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this._stats.dom);
        }
    }

    private initEvents() {
        FrontEvents.onWindowResizeSignal.add(this.onWindowResize, this);
    }

    private initScenes(aScenes: BasicScene[]) {
        this._sceneMng = new SceneMng({
            scenes: aScenes
        });
        // start first scene in list
        this._sceneMng.startScene(this._params.scenes[0].name);
    }

    private initInputs(aDomCanvasParent: HTMLElement) {
        InputMng.getInstance({
            inputDomElement: aDomCanvasParent,
            desktop: DeviceInfo.getInstance().desktop,
            isRightClickProcessing: false,
            clickDistDesktop: 10,
            clickDistMobile: 40
        });
    }

    private onWindowResize() {
        this._sceneMng.onWindowResize();
    }

    /**
     * Main cycle
     */
    private animate() {
        let dt = this._clock.getDelta();

        if (GlobalParams.isDebugMode) this._stats.begin();
        this.update(dt);
        this.render();
        if (GlobalParams.isDebugMode) this._stats.end();

        requestAnimationFrame(() => this.animate());
    }

    update(dt: number) {
        this._sceneMng.update(dt);
    }

    render() {
        this._sceneMng.render();
    }

}