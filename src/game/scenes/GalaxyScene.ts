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
import sizeof from 'object-sizeof';

export class GalaxyScene extends BasicScene {
    private _galaxy: GalaxyMng;
    private _battleAcceptScreenMng: BattleAcceptScreenMng;
    private _isBattleSearching = false;

    private _isDuelSearching = false;
    private _timerDuelCheck = 0;
    
    bcs = BlockchainConnectService.getInstance();

    constructor() {
        super(SceneNames.GalaxyScene, {
            initRender: true,
            initScene: true,
            initCamera: true
        });
        this._isBattleSearching = false;
        this._isDuelSearching = false;
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
        this.initEvents();
        if (GlobalParams.isDebugMode) {
            this.initBlockchainDebugGui();
            this.initDebugGui();
            this.initBattleDebugGui();
            this.initTestsDebugGui();
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
        FrontEvents.onPlayerPickClick.add(this.onFrontPlayerPickClick, this);
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
        const isTG = bcs.isTelegram();
        if (!isTG) {
            return;
        }
        this.logDebug(`checkDuel: isTelegram = ${isTG}`);
        const userNick = String(bcs.telegramId());
        this.logDebug(`checkDuel: userNick = ${userNick}`);
        if (!userNick || userNick == '') {
            return;
        }
        con.sendDuelCheck(userNick);
        GlobalParams.duelChecked = true;
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
        AudioMng.getInstance().playSfx({ alias: AudioAlias.SFX_CLICK });
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
        AudioMng.getInstance().playSfx({ alias: AudioAlias.SFX_CLICK });
        let con = BattleConnection.getInstance();
        if (!con.connected) {
            GameEventDispatcher.showMessage(`No connection to server!`);
            return;
        }
        GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
        con.sendSearchGameBot();
        this._isBattleSearching = true;
    }

     private onFrontPlayerPickClick() {
        GameEventDispatcher.playerPickScreenClose();
        setTimeout(() => {
            // this._battleScene.show();
            this.startScene(SceneNames.BattleScene);
        }, 3000);
               
     }

    // private onFrontChallengeClick() {
    //     let con = BattleConnection.getInstance();
    //     if (!con.connected) {
    //         GameEventDispatcher.showMessage(`No connection to server!`);
    //         return;
    //     }
    //     GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
    //     con.sendDuelCreate();
    // }

    private onFrontStopBattleSearch() {
        AudioMng.getInstance().playSfx({ alias: AudioAlias.SFX_CLICK });
        let con = BattleConnection.getInstance();

        if (this._isDuelSearching) {
            if (confirm(`Are you sure you want to cancel the duel?`)) {
                const bcs = BlockchainConnectService.getInstance();
                con.sendDuelCancel(bcs.telegramLogin());
                BattleConnection.getInstance().sendStopSearchingGame();
            }
            else {
                return;
            }
        }
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

                AudioMng.getInstance().playSfx({ alias: AudioAlias.battleStartGates });

                GameEventDispatcher.battlePrerollShow(aData);

                // setTimeout(() => {
                    //this._battleScene.show();
                //     this.startScene(SceneNames.BattleScene);
                // }, 1000);
                // break;
            default:
                this.logDebug(`onBattleStartPackage(): unknown cmd:`, aData);
                break;
        }
    }
    
    private onDuelPack(aData: DuelInfo) {
        // generate link for challenge
        this.logDebug(`onDuelPack:`, aData);
        switch (aData.cmd) {
            // case 'number':
                // gen link and copy
                // let link = `${window.location.origin}?duel=${aData.challengeNumber}#debug`;
                // this.logDebug(`link: ${link}`);
                // MyUtils.copyToClipboard(link);
                // // msg
                // GameEventDispatcher.showMessage(`Link copied to clipboard`);
            // break;
            
            case 'found':
                this._isDuelSearching = true;
                const thisUserNick = String(this.bcs.telegramLogin()).replace('@', '').toLowerCase();
                const enemyNick = String(aData.enemyNick).replace('@', '').toLowerCase();
                const duelFoundNotifyText = enemyNick === thisUserNick ? 'Duel created!' : `Duel with ${aData.enemyNick} found!`;

                if (aData.enemyNick?.length > 0) {
                    GameEventDispatcher.showMessage(duelFoundNotifyText);
                }
                else {
                    GameEventDispatcher.showMessage(`Duel found!`);
                }
                GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
                break;

            case 'notFound':
                this._isDuelSearching = false;

                this.logDebug(`Duel game for this nick not found...`);
                // msg
                // GameEventDispatcher.showMessage(`Duel game not found`);
                GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_STOP);
                break;
            
            case 'cancel':
                this.logDebug(`Duel game canceled...`);
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
            },
            getUserAssets() {
                let bcs = BlockchainConnectService.getInstance();
                bcs.getUserAssets().then(web2Assets => {
                    console.log(`web2Assets:`, web2Assets);
                })
            }
        }

        let f = DebugGui.getInstance().createFolder('Blockchain');

        f.add(BLOCKCHAIN_DEBUG_GUI, 'claimReward');

        f.add(BLOCKCHAIN_DEBUG_GUI, 'boxId').onChange((aValue: string) => {
            this.logDebug(`boxId: ${BLOCKCHAIN_DEBUG_GUI.boxId}`);
        }).name(`Box id`);

        f.add(BLOCKCHAIN_DEBUG_GUI, 'openBox');
        // f.add(BLOCKCHAIN_DEBUG_GUI, 'getBoxList');
        f.add(BLOCKCHAIN_DEBUG_GUI, 'getUserAssets');
    }

    private initDebugGui() {
        let bc = BattleConnection.getInstance();
        let bcs = BlockchainConnectService.getInstance();

        const DEBUG_GUI_TG = {
            clearLogin: () => {
                localStorage.setItem("userLogin", '');
                bcs.setTestUserName('');
            },
        }
        let fTg = DebugGui.getInstance().createFolder('TG');
        fTg.add(DEBUG_GUI_TG, 'clearLogin').name('Clear Login');

        const DEBUG_GUI_DUEL = {
            duelTest1Check: () => {
                bc.sendDuelCheck(`testNick1`);
            },
            duelTest2Check: () => {
                bc.sendDuelCheck(`testNick2`);
            }
        }
        let f = DebugGui.getInstance().createFolder('Duels');
        f.add(DEBUG_GUI_DUEL, 'duelTest1Check').name('Test1 Check');
        f.add(DEBUG_GUI_DUEL, 'duelTest2Check').name('Test2 Check');

    }

    private initBattleDebugGui() {
        let bc = BattleConnection.getInstance();

        const DATA = {
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
        }

        const f = DebugGui.getInstance().createFolder('Battle');
        f.add(DATA, 'searchGameBot').name('Play with Bot');
    }

    private initTestsDebugGui() {
        const DATA = {
            getGlobalSize: () => {
                if (!global) {
                    this.logDebug(`global == NULL`);
                    return;
                }
                const size = sizeof(global);
                this.logDebug(`Size global = ${size}`);
            }
        }

        const f = DebugGui.getInstance().createFolder('Tests');
        f.add(DATA, 'getGlobalSize').name('Global Size'); 
    }

    protected onFree() {
        this.freeEvents();
        this._battleAcceptScreenMng.free();
        if (GlobalParams.isDebugMode) DebugGui.getInstance().clear();
        this._galaxy.free();
        this._galaxy = null;
    }

    private updateDuelCheck(dt: number) {

        if (this._isDuelSearching) return;
        if (GlobalParams.duelChecked) return;

        this._timerDuelCheck -= dt;
        if (this._timerDuelCheck <= 0) {
            this._timerDuelCheck = 1;
            this.checkDuel();
        }
    }

    update(dt: number) {
        this.updateDuelCheck(dt);
        this._galaxy.update(dt);
    }

}
