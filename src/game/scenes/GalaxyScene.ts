import * as THREE from 'three';
import { GalaxyMng } from "../galaxy/GalaxyMng";
import { FrontEvents } from '../events/FrontEvents';
import { ServerStarData } from '../data/Types';
import { GlobalParams } from '../data/GlobalParams';
import { BasicScene } from '../core/scene/BasicScene';
import { SceneNames } from './SceneNames';
import { ThreeLoader } from '../utils/threejs/ThreeLoader';
import { SimpleRenderer } from '../core/renderers/SimpleRenderer';
import { BattleConnection } from '../battle/BattleConnection';
import { PackTitle, StartGameData } from '../battle/Types';
import { GameEvent, GameEventDispatcher } from '../events/GameEvents';
import { DebugGui } from '../debug/DebugGui';
import { useWallet } from '@/services';
import { getUserBoxesToOpen } from '~/blockchain/boxes';
import { AudioMng } from '../audio/AudioMng';
import { AudioAlias } from '../audio/AudioData';

export class GalaxyScene extends BasicScene {
    private _galaxy: GalaxyMng;

    constructor() {
        super(SceneNames.GalaxyScene, {
            initRender: true,
            initScene: true,
            initCamera: true
        });
        this.initFrontEvents();
    }

    private initFrontEvents() {
        FrontEvents.setMusicVolume.add((aData: { v: number }) => {
            let am = AudioMng.getInstance();
            am.musicVolume = aData.v;
            localStorage.setItem(`musicVolume`, String(am.musicVolume));
        }, this);

        FrontEvents.setSFXVolume.add((aData: { v: number }) => {
            let am = AudioMng.getInstance();
            am.sfxVolume = aData.v;
            localStorage.setItem(`sfxVolume`, String(am.sfxVolume));
        }, this);
    }

    protected initRenderer() {
        this._render = new SimpleRenderer({
            bgColor: 0x0,
            aa: false,
            domCanvasParent: GlobalParams.domCanvasParent
        });
        // this._render.renderer.toneMapping = THREE.LinearToneMapping;
        // this._render.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // this._render.renderer.toneMapping = THREE.ReinhardToneMapping;
        // this._render.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    protected initCamera() {
        const w = innerWidth;
        const h = innerHeight;
        this._camera = new THREE.PerspectiveCamera(45, w / h, GlobalParams.CAMERA.near, GlobalParams.CAMERA.far);
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        this._scene.add(this._camera);
        this._render.camera = this._camera;
    }

    protected onInit() {
        this.initMusic();
        this.initEvents();
        this.initSkybox();
        this.initGalaxy();
        if (GlobalParams.isDebugMode) {
            this.initBlockchainDebugGui();
            this.initBattleDebugGui();
        }
    }

    private initMusic() {
        // start music
        AudioMng.getInstance().playMusic(AudioAlias.MUSIC_MAIN);
    }
    
    private initEvents() {
        // front events
        FrontEvents.onLeftPanelGalaxyClick.add(this.onLeftPanelGalaxyClick, this);
        FrontEvents.onBotPanelPhantomClick.add(this.onBotPanelPhantomClick, this);
        FrontEvents.onBotPanelRealClick.add(this.onBotPanelRealClick, this);
        FrontEvents.onStarCreated.add(this.onStarCreated, this);
        FrontEvents.onStarUpdated.add(this.onStarUpdated, this);
        FrontEvents.onBattleSearch.add(this.onFrontStarBattleSearch, this);
        FrontEvents.onBattleSearchBot.add(this.onFrontStarBattleBotSearch, this);
        FrontEvents.onBattleStopSearch.add(this.onFrontStopBattleSearch, this);
        // battle server events
        let bc = BattleConnection.getInstance();
        bc.on(PackTitle.gameStart, this.onBattleStartPackage, this);
    }

    private freeEvents() {
        // front events
        FrontEvents.onLeftPanelGalaxyClick.remove(this.onLeftPanelGalaxyClick, this);
        FrontEvents.onBotPanelPhantomClick.remove(this.onBotPanelPhantomClick, this);
        FrontEvents.onBotPanelRealClick.remove(this.onBotPanelRealClick, this);
        FrontEvents.onStarCreated.remove(this.onStarCreated, this);
        FrontEvents.onStarUpdated.remove(this.onStarUpdated, this);
        FrontEvents.onBattleSearch.remove(this.onFrontStarBattleSearch, this);
        FrontEvents.onBattleStopSearch.remove(this.onFrontStopBattleSearch, this);
        // battle server events
        let bc = BattleConnection.getInstance();
        bc.remove(PackTitle.gameStart, this.onBattleStartPackage);
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

    private onFrontStarBattleSearch() {
        let con = BattleConnection.getInstance();
        if (!con.connected) {
            alert(`No connection to server!`);
            return;
        }
        GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
        con.sendSearchGame();
    }

    private onFrontStarBattleBotSearch() {
        let con = BattleConnection.getInstance();
        if (!con.connected) {
            alert(`No connection to server!`);
            return;
        }
        GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
        con.sendSearchGameBot();
    }

    private onFrontStopBattleSearch() {
        BattleConnection.getInstance().sendStopSearchingGame();
    }

    private onBattleStartPackage(aData: StartGameData) {
        switch (aData.cmd) {
            case 'start':
                this.logDebug(`onBattleEnterGame...`);
                
                GameEventDispatcher.battlePrerollShow({
                    timer: aData.timer,
                    playerWallet: aData.playerWallet,
                    enemyWallet: aData.enemyWallet
                });
                setTimeout(() => {
                    //this._battleScene.show();
                    this.startScene(SceneNames.BattleScene);
                }, 1000);
                break;
            default:
                this.logDebug(`onBattleStartPackage(): unknown cmd:`, aData);
                break;
        }
    }

    private initSkybox() {
        let loader = ThreeLoader.getInstance();
        this._scene.background = loader.getCubeTexture('skybox');
    }

    private initGalaxy() {

        this._galaxy = new GalaxyMng({
            parent: this._scene,
            camera: this._camera as THREE.PerspectiveCamera
        });
        this._galaxy.init();

        // DEBUG GUI
        if (GlobalParams.isDebugMode) {
            this._galaxy.initDebugGui();
        }

    }

    private initBlockchainDebugGui() {

        const BLOCKCHAIN_DEBUG_GUI = {
            boxId: '0',
            claimReward: async () => {

            },
            openBox: async () => {
                let ws = useWallet();
                if (!ws.connected) {
                    alert('Wallet Not Connected!');
                    return;
                }
                const boxId = Number(BLOCKCHAIN_DEBUG_GUI.boxId);
                alert(`Trying to open Box ${boxId}`);
                let openResult = ws.provider.openBox(boxId);
                console.log(`openResult:`, openResult);
            },
            getBoxList: async () => {
                const wallet = '';// getWalletAddress();
                // TODO: normal new get wallet
                // getUserBoxesToOpen(wallet).then((aList: number[]) => {
                //     let list = aList.map(val => Number(val));
                //     this.logDebug(`Box ids to open:`);
                //     if (GlobalParams.isDebugMode) console.log(list);
                //     if (list.length > 0) {
                //         let ids: string = '';
                //         for (let i = 0; i < list.length; i++) {
                //             ids += String(`${list[i]}, `);
                //         }
                //         alert(`You have ${list.length} boxes for open.
                //         ids: ${ids}`);
                //         // GameEventDispatcher.showBoxOpenScreen({ list });
                //     }
                //     else {
                //         alert(`No box found for this user...`);
                //     }
                // });
            }
        }

        let f = DebugGui.getInstance().createFolder('Blockchain');

        f.add(BLOCKCHAIN_DEBUG_GUI, 'claimReward');

        f.add(BLOCKCHAIN_DEBUG_GUI, 'boxId').onChange((aValue: string) => {
            this.logDebug(`boxId: ${BLOCKCHAIN_DEBUG_GUI.boxId}`);
        }).name(`Box id`);

        f.add(BLOCKCHAIN_DEBUG_GUI, 'openBox');
        f.add(BLOCKCHAIN_DEBUG_GUI, 'getBoxList');
    }

    private initBattleDebugGui() {
        let bc = BattleConnection.getInstance();

        const DATA = {
            connectLocal: () => {
                // this._connection.connectLocal();
            },
            searchGame: () => {
                if (!bc.connected) {
                    alert(`No connection to server!`);
                    return;
                }
                FrontEvents.onBattleSearch.dispatch();
            },
            searchGameBot: () => {
                if (!bc.connected) {
                    alert(`No connection to server!`);
                    return;
                }
                bc.sendSearchGameBot();
            },
            withdrawgame: () => {
                // bc.sendStopSearchingGame();
            },
        }

        const f = DebugGui.getInstance().createFolder('Battle');
        f.add(DATA, 'searchGameBot').name('Play with Bot');
        // f.add(DATA, 'withdrawgame').name('Withdraw');
    }

    protected onFree() {
        this.freeEvents();
        if (GlobalParams.isDebugMode) DebugGui.getInstance().clear();
        this._galaxy.free();
        this._galaxy = null;
    }

    update(dt: number) {
        this._galaxy.update(dt);
    }

}