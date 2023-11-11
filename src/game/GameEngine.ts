import * as THREE from "three";
import { Settings } from "~/game/data/Settings";
import { GameRender as GameRenderer } from "./scenes/GameRenderer";
import { InputMng } from "./utils/inputs/InputMng";
import { DeviceInfo } from "./utils/DeviceInfo";
import * as datGui from "dat.gui";
import { BattleAction, BattleSocket, BattleSocketEvent } from "./battle/BattleSocket";
import { GalaxyScene } from "./scenes/GalaxyScene";
import { MyBasicClass } from "./basics/MyBasicClass";
import { BattleScene } from "./scenes/BattleScene";
import { ThreeLoader } from "./utils/threejs/ThreeLoader";

export class GameEngine extends MyBasicClass {
    private _renderer: GameRenderer;
    private _galaxyScene: GalaxyScene;
    private _battle: BattleSocket;
    private _battleScene: BattleScene;
    private clock: THREE.Clock;
    private stats: Stats;

    constructor() {
        super('GameEngine');
        this.clock = new THREE.Clock();
    }

    private initRender() {
        this._renderer = new GameRenderer();
    }

    private initInputs() {
        InputMng.getInstance({
            inputDomElement: Settings.domCanvasParent,
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

    private initSkybox() {
        let loader = ThreeLoader.getInstance();
        this._renderer.scene.background = loader.getCubeTexture('skybox');
    }

    private initGalaxy() {
        // SCENES
        this._galaxyScene = new GalaxyScene({
            scene: this._renderer.scene,
            camera: this._renderer.camera
        });
        this._galaxyScene.initGalaxy();
    }

    private initBattle() {

        this._battleScene = new BattleScene({
            scene: this._renderer.scene,
            camera: this._renderer.camera
        }, true);

        this._battle = new BattleSocket();
        // this._battle.on(BattleSocketEvent.enterGame, this.onBattleSocketEnterGame, this);
        // this._battle.on(BattleSocketEvent.withdrawGame, this.onBattleSocketWithdrawGame, this);
        this._battle.on(BattleSocketEvent.message, this.onBattleSocketMessage, this);

        // DEBUG GUI
        if (Settings.isDebugMode && Settings.datGui) {
            this._battle.initDebugGui();
        }

    }

    private onBattleEnterGame() {
        this.logDebug(`entergame: hide galaxy...`);
        this._galaxyScene.hide();
    }

    private onBattleWithdrawGame() {
        this.logDebug(`withdrawgame: show galaxy...`);
        this._galaxyScene.show();
    }

    private onBattleSocketMessage(aData: any) {
        switch (aData.action) {
            case BattleAction.entergame:
                this.onBattleEnterGame();
                break;
            case BattleAction.withdrawgame:
                this.onBattleWithdrawGame();
                break;
            default:
                this._battleScene.onSocketMessage(aData);
                break;
        }
    }

    private update(dt: number) {
        this._galaxyScene?.update(dt);
        this._battleScene?.update(dt);
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
        this.initSkybox();
        this.initGalaxy();
        this.initBattle();
        this.animate();
    }


}