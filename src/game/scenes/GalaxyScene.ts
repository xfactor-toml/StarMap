import * as THREE from 'three';
import { GalaxyMng } from "../galaxy/GalaxyMng";
import { FrontEvents } from '../events/FrontEvents';
import { ServerStarData } from '../data/Types';
import { GlobalParams } from '../data/GlobalParams';
import { BasicScene } from '../core/scene/BasicScene';
import { SceneNames } from './SceneNames';
import { ThreeLoader } from '../utils/threejs/ThreeLoader';
import { SimpleRenderer } from '../core/renderers/SimpleRenderer';
import { BattleConnection, ConnectionEvent } from '../battle/BattleConnection';
import { DuelInfo, PackTitle, StartGameData } from '../battle/Types';
import { GameEvent, GameEventDispatcher } from '../events/GameEvents';
import { DebugGui } from '../debug/DebugGui';
import { useWallet } from '@/services';
import { AudioMng } from '../audio/AudioMng';
import { AudioAlias } from '../audio/AudioData';
import { BattleAcceptScreenMng, BattleAcceptScreenMngEvent } from '../controllers/BattleAcceptScreenMng';
import { MyUtils } from '../utils/MyUtils';
import { BlockchainConnectService } from '~/blockchainTotal';

export class GalaxyScene extends BasicScene {
    private _galaxy: GalaxyMng;
    private _battleAcceptScreenMng: BattleAcceptScreenMng;
    private _isDuelChecking = false;
    private _isBattleSearching = false;

    constructor() {
        super(SceneNames.GalaxyScene, {
            initRender: true,
            initScene: true,
            initCamera: true
        });
        this._isDuelChecking = !GlobalParams.duelChecked;
        this._isBattleSearching = false;
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
        this.initBattleAcceptController();
        this.initSkybox();
        this.initGalaxy();
        this.initDuel();
        this.initEvents();
        if (!GlobalParams.duelChecked) {
            this.checkDuel();
        }
        if (GlobalParams.isDebugMode) {
            this.initBlockchainDebugGui();
            this.initDebugGui();
            this.initBattleDebugGui();
        }
    }

    private initMusic() {
        // start music
        AudioMng.getInstance().playMusic(AudioAlias.MUSIC_MAIN);
    }

    private initBattleAcceptController() {
        this._battleAcceptScreenMng = new BattleAcceptScreenMng();
        this._battleAcceptScreenMng.on(BattleAcceptScreenMngEvent.Loading, this.onAcceptScreenLoading, this);
    }

    private initDuel() {
        if (GlobalParams.BATTLE.duelNumber >= 0) {
            let bc = BattleConnection.getInstance();
            bc.sendChallengeConnect(GlobalParams.BATTLE.duelNumber);
            GlobalParams.BATTLE.duelNumber = -1;
        }
    }

    private initEvents() {
        // front events
        FrontEvents.onLeftPanelGalaxyClick.add(this.onLeftPanelGalaxyClick, this);
        FrontEvents.onBotPanelPhantomClick.add(this.onBotPanelPhantomClick, this);
        FrontEvents.onBotPanelRealClick.add(this.onBotPanelRealClick, this);
        FrontEvents.onStarCreated.add(this.onStarCreated, this);
        FrontEvents.onStarUpdated.add(this.onStarUpdated, this);
        FrontEvents.onBattleSearch.add(this.onFrontStartBattleSearch, this);
        FrontEvents.onBattleSearchBot.add(this.onFrontStartBattleBotSearch, this);
        FrontEvents.onBattleStopSearch.add(this.onFrontStopBattleSearch, this);
        // battle server events
        let bc = BattleConnection.getInstance();
        bc.on(PackTitle.gameSearching, this.onGameSearchPack, this);
        bc.on(PackTitle.gameStart, this.onBattleStartPackage, this);
        bc.on(PackTitle.duel, this.onDuelPack, this);
        bc.on(ConnectionEvent.disconnect, this.onServerDisconnected, this);
    }

    private freeEvents() {
        // front events
        FrontEvents.onLeftPanelGalaxyClick.remove(this.onLeftPanelGalaxyClick, this);
        FrontEvents.onBotPanelPhantomClick.remove(this.onBotPanelPhantomClick, this);
        FrontEvents.onBotPanelRealClick.remove(this.onBotPanelRealClick, this);
        FrontEvents.onStarCreated.remove(this.onStarCreated, this);
        FrontEvents.onStarUpdated.remove(this.onStarUpdated, this);
        FrontEvents.onBattleSearch.remove(this.onFrontStartBattleSearch, this);
        FrontEvents.onBattleStopSearch.remove(this.onFrontStopBattleSearch, this);
        // battle server events
        let bc = BattleConnection.getInstance();
        bc.remove(PackTitle.gameSearching, this.onGameSearchPack);
        bc.remove(PackTitle.gameStart, this.onBattleStartPackage);
        bc.remove(PackTitle.duel, this.onDuelPack);
        bc.remove(ConnectionEvent.disconnect, this.onServerDisconnected);
    }

    private checkDuel() {
        let con = BattleConnection.getInstance();
        if (!con.connected) {
            return;
        }
        const bcs = BlockchainConnectService.getInstance();
        if (!bcs.isTelegram()) {
            return;
        }
        con.sendDuelCheck(bcs.TelegramLogin());
        this._isDuelChecking = true;
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

    private onFrontStartBattleSearch() {
        let con = BattleConnection.getInstance();
        if (!con.connected) {
            GameEventDispatcher.showMessage(`No connection to server!`);
            return;
        }
        GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
        con.sendSearchGame();
        this._isBattleSearching = true;
    }

    private onFrontStartBattleBotSearch() {
        let con = BattleConnection.getInstance();
        if (!con.connected) {
            GameEventDispatcher.showMessage(`No connection to server!`);
            return;
        }
        GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
        con.sendSearchGameBot();
        this._isBattleSearching = true;
    }

    private onFrontChallengeClick() {
        let con = BattleConnection.getInstance();
        if (!con.connected) {
            GameEventDispatcher.showMessage(`No connection to server!`);
            return;
        }
        GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
        con.sendChallengeCreate();
    }

    private onFrontStopBattleSearch() {
        BattleConnection.getInstance().sendStopSearchingGame();
    }

    private onGameSearchPack(aData: {
        cmd: 'start' | 'stop'
    }) {
        switch (aData.cmd) {
            case 'start':
                this._isBattleSearching = true;
                GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
                break;
            case 'stop':
                this._isBattleSearching = false;
                GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_STOP);
                break;
            default:
                this.logDebug(`onGameSearchPack(): unknown cmd:`, aData);
                break;
        }
    }

    private onBattleStartPackage(aData: StartGameData) {
        switch (aData.cmd) {
            case 'start':
                this.logDebug(`onBattleStartPackage, StartGameData:`, aData);

                GameEventDispatcher.battlePrerollShow(aData);

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
    
    private onDuelPack(aData: DuelInfo) {
        // generate link for challenge
        this.logDebug(`onDuelPack:`, aData);
        switch (aData.cmd) {
            case 'number':
                // gen link and copy
                let link = `${window.location.origin}?duel=${aData.challengeNumber}#debug`;
                this.logDebug(`link: ${link}`);
                MyUtils.copyToClipboard(link);
                // msg
                GameEventDispatcher.showMessage(`Link copied to clipboard`);
                break;

            case 'notFound':
                // msg
                GameEventDispatcher.showMessage(`Challenge game not found`);
                GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_STOP);
                break;
        }
    }

    private onServerDisconnected() {
        if (this._isBattleSearching) {
            GameEventDispatcher.showMessage(`Game Server disconnected...`);
            GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_ERROR);
        }
    }

    private onAcceptScreenLoading() {
        // start loading game
        // search random star name
        let starName = this._galaxy.getRandomStarName([1]);
        if (starName == '') {
            const NAMES = ['Sun', 'Sirius', 'Kanopus', 'Rigel', 'Vega', 'Procion', 'Betelgeise', 'Altair', 'Antares'];
            starName = MyUtils.getRandomValueFromArray(NAMES);
        }
        // send loading complete
        setTimeout(() => {
            this._battleAcceptScreenMng.sendLoadingComplete({
                starName: starName
            });
        }, 2000);
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
        this._galaxy.init({
            initDebugGui: GlobalParams.isDebugMode
        });

        // DEBUG GUI
        // if (GlobalParams.isDebugMode) {
        //     this._galaxy.initDebugGui();
        // }

    }

    private initBlockchainDebugGui() {

        const BLOCKCHAIN_DEBUG_GUI = {
            boxId: '0',
            claimReward: async () => {

            },
            openBox: async () => {
                let ws = useWallet();
                if (!ws.connected) {
                    GameEventDispatcher.showMessage('Wallet not connected!');
                    return;
                }
                const boxId = Number(BLOCKCHAIN_DEBUG_GUI.boxId);
                // GameEventDispatcher.showMessage(`Trying to open Box ${boxId}`);
                let openResult = ws.provider.openBox(boxId);
                this.logDebug(`openResult:`, openResult);
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

    private initDebugGui() {
        let bc = BattleConnection.getInstance();

        const DEBUG_GUI_TG = {
            tgLoginMaxMonax: () => {

            },
        }
        // let f = DebugGui.getInstance().createFolder('TG');
        // f.add(DEBUG_GUI_TG, 'tgLoginMaxMonax').name('TG Login Max');

        const DEBUG_GUI_DUEL = {
            duelMaxCheck: () => {
                bc.sendDuelCheck(`maxmonax`);
            },
            duelIvemakerCheck: () => {
                bc.sendDuelCheck(`ivemaker`);
            },
            duelBerumCheck: () => {
                bc.sendDuelCheck(`berum`);
            }
        }
        let f = DebugGui.getInstance().createFolder('Duels');
        f.add(DEBUG_GUI_DUEL, 'duelMaxCheck').name('Duel Max Check');
        f.add(DEBUG_GUI_DUEL, 'duelIvemakerCheck').name('Duel Ivemaker Check');
        f.add(DEBUG_GUI_DUEL, 'duelBerumCheck').name('Duel Berum Check');

    }

    private initBattleDebugGui() {
        let bc = BattleConnection.getInstance();

        const DATA = {
            connectLocal: () => {
                // this._connection.connectLocal();
            },
            searchGame: () => {
                if (!bc.connected) {
                    GameEventDispatcher.showMessage(`No connection to server!`);
                    return;
                }
                FrontEvents.onBattleSearch.dispatch();
            },
            searchGameBot: () => {
                if (!bc.connected) {
                    GameEventDispatcher.showMessage(`No connection to server!`);
                    return;
                }
                bc.sendSearchGameBot();
            },
            withdrawgame: () => {
                // bc.sendStopSearchingGame();
            },
            createChallenge: () => {
                if (!bc.connected) {
                    GameEventDispatcher.showMessage(`No connection to server!`);
                    return;
                }
                bc.sendChallengeCreate();
            }
        }

        const f = DebugGui.getInstance().createFolder('Battle');
        f.add(DATA, 'searchGameBot').name('Play with Bot');
        f.add(DATA, 'createChallenge').name('Create Challenge');
    }

    protected onFree() {
        this.freeEvents();
        this._battleAcceptScreenMng.free();
        if (GlobalParams.isDebugMode) DebugGui.getInstance().clear();
        this._galaxy.free();
        this._galaxy = null;
    }

    update(dt: number) {
        this._galaxy.update(dt);
    }

}