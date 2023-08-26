import * as THREE from "three";
import { Settings } from "~/game/data/Settings";
import { ServerStarData } from "~/game/data/Types";
import { FrontEvents } from "~/game/events/FrontEvents";
import { ILogger } from "~/game/interfaces/ILogger";
import { Galaxy } from "~/game/scenes/Galaxy";
import { LogMng } from "./utils/LogMng";
import { GameRender as GameRenderer } from "./scenes/GameRenderer";
import { InputMng } from "./utils/inputs/InputMng";
import { DeviceInfo } from "./utils/DeviceInfo";
import * as datGui from "dat.gui";


export class GameEngine implements ILogger {
    private _renderer: GameRenderer;
    private _galaxy: Galaxy;
    private clock: THREE.Clock;
    private stats: Stats;

    constructor() {

        this.clock = new THREE.Clock();

        // events
        FrontEvents.onLeftPanelGalaxyClick.add(this.onLeftPanelGalaxyClick, this);
        FrontEvents.onBotPanelPhantomClick.add(this.onBotPanelPhantomClick, this);
        FrontEvents.onBotPanelRealClick.add(this.onBotPanelRealClick, this);
        FrontEvents.onStarCreated.add(this.onStarCreated, this);
        FrontEvents.onStarUpdated.add(this.onStarUpdated, this);
    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`GameEngine: ${aMsg}`, aData);
    }
    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`GameEngine: ${aMsg}`, aData);
    }
    logError(aMsg: string, aData?: any): void {
        LogMng.error(`GameEngine: ${aMsg}`, aData);
    }

    private onLeftPanelGalaxyClick() {
        this.logDebug(`onLeftPanelGalaxyClick...`);
        this._galaxy?.gotoGalaxy();
    }

    private onBotPanelPhantomClick() {
        this.logDebug(`onBotPanelPhantomClick...`);
        this._galaxy?.openPhantomMode();
    }

    private onBotPanelRealClick() {
        this.logDebug(`onBotPanelRealClick...`);
        this._galaxy?.openRealMode();
    }

    private onStarCreated(aStarData: ServerStarData) {
        this._galaxy?.onStarCreated(aStarData);
    }

    private onStarUpdated(aStarData: ServerStarData) {
        this._galaxy?.onStarUpdated(aStarData);
    }

    private initRender() {
        this._renderer = new GameRenderer();
    }

    private initGalaxy() {
        // SCENES
        this._galaxy = new Galaxy({
            render: this._renderer.renderer,
            scene: this._renderer.scene,
            camera: this._renderer.camera
        });
        this._galaxy.init();

        // DEBUG GUI
        if (Settings.isDebugMode && Settings.datGui) {
            this._galaxy.initDebugGui();
        }
    }

    private initInputs() {
        InputMng.getInstance({
            inputDomElement: Settings.domCanvasParent,
            // inputDomElement: Params.domTouchParent,
            desktop: DeviceInfo.getInstance().desktop,
            isRightClickProcessing: false,
            clickDistDesktop: 10,
            clickDistMobile: 40
        });
    }

    private initStats() {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
    }

    private initDebugGui() {
        Settings.datGui = new datGui.GUI();
        Settings.datGui.close();
    }

    private update(dt: number) {
        this._galaxy?.update(dt);
    }

    private render() {
        this._renderer?.render();
    }

    private animate() {
        let dtSec = this.clock.getDelta();

        if (Settings.isDebugMode) this.stats.begin();
        this.update(dtSec);
        this.render();
        if (Settings.isDebugMode) this.stats.end();

        requestAnimationFrame(() => this.animate());
    }

    initGame() {
        this.initRender();
        this.initInputs();
        if (Settings.isDebugMode) {
            this.initStats();
            this.initDebugGui();
        }
        this.initGalaxy();
        this.animate();
    }


}