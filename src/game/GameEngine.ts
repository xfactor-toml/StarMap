import * as THREE from "three";
import { GameRenderer } from "./scenes/GameRenderer";
import * as datGui from "dat.gui";
import { Settings } from "~/game/data/Settings";
import { InputMng } from "./utils/inputs/InputMng";
import { DeviceInfo } from "./utils/DeviceInfo";
import { GalaxyScene } from "./scenes/GalaxyScene";
import { MyBasicClass } from "./basics/MyBasicClass";
import { ThreeLoader } from "./utils/threejs/ThreeLoader";
import { BattleScene, BattleSceneEvent } from "./scenes/BattleScene";
import { GameCompleteData, StartGameData } from "./battle/Types";
import { GameEvent, GameEventDispatcher } from "./events/GameEvents";
import { getWalletAddress } from "~/blockchain/functions/auth";
import { FrontEvents } from "./events/FrontEvents";

export class GameEngine extends MyBasicClass {
    private _renderer: GameRenderer;
    private _galaxyScene: GalaxyScene;
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

    private initGalaxyScene() {
        // SCENES
        this._galaxyScene = new GalaxyScene({
            scene: this._renderer.scene,
            camera: this._renderer.camera
        });
        this._galaxyScene.initGalaxy();
    }

    private initBattleScene() {
        this._battleScene = new BattleScene({
            scene: this._renderer.scene,
            camera: this._renderer.camera
        });
        this._battleScene.hide();
        this._battleScene.on(BattleSceneEvent.onGameStart, this.onBattleGameStart, this);
        this._battleScene.on(BattleSceneEvent.onGameComplete, this.onBattleComplete, this);
        this._battleScene.on(BattleSceneEvent.onDisconnect, this.onBattleDisconnect, this);

        FrontEvents.onBattleClaimClick.add(this.onFrontClaimClick, this);

    }

    private onBattleGameStart(aData: StartGameData) {
        this.logDebug(`onBattleEnterGame...`);

        GameEventDispatcher.battlePrerollShow({
            timer: aData.timer,
            playerWallet: aData.playerWallet,
            enemyWallet: aData.enemyWallet
        });
        
        setTimeout(() => {
            this._galaxyScene.hide();
            this._battleScene.show();
        }, 1000);

    }

    private onBattleComplete(aData: GameCompleteData) {
        this.logDebug(`onBattleComplete...`);
        GameEventDispatcher.battleComplete(aData);
    }

    private onBattleDisconnect() {
        this.logDebug(`onBattleDisconnect...`);
        alert(`Disconnect...`);
        this.switchSceneToGalaxy();
    }

    private onFrontClaimClick() {
        this.switchSceneToGalaxy();
    }

    private switchSceneToGalaxy() {
        this._battleScene.hide();
        this._battleScene.clear();
        this._galaxyScene.show();
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
        this.initGalaxyScene();
        this.initBattleScene();
        this.animate();
    }


}