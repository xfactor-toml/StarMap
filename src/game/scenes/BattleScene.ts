import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { GlobalParams } from '../data/GlobalParams';
import { BattleView } from '../battle/BattleView';
import { FrontEvents } from '../events/FrontEvents';
import { BattleConnection, ConnectionEvent } from '../battle/BattleConnection';
import { ClaimRewardData, Emotion, EmotionData, ExpData, GameCompleteData, PackTitle } from '../battle/Types';
import { GameEvent, GameEventDispatcher } from '../events/GameEvents';
import { DebugGui } from '../debug/DebugGui';
import { BasicScene } from '../core/scene/BasicScene';
import { SceneNames } from './SceneNames';
import { SimpleRenderer } from '../core/renderers/SimpleRenderer';
import { ThreeLoader } from '../utils/threejs/ThreeLoader';
import { BlockchainConnectService } from '~/blockchainTotal';
import { GetGameAssetsWeb2, getUserBoxesToOpenWeb2 } from '~/blockchainTotal/getters/boxesWeb2';
import { ThreeUtils } from '../utils/threejs/ThreejsUtils';
import { DeviceInfo } from '../utils/DeviceInfo';

export enum BattleSceneEvent {
    onGameStart = 'onEnterGame',
    onGameComplete = 'onGameComplete',
    onDisconnect = 'onDisconnect',
    onCloseBattle = 'onCloseBattle',
}

enum BattleSceneState {
    none = 'none',
    game = 'game',
    win = 'win',
    loss = 'loss'
}

export class BattleScene extends BasicScene {
    private _state: BattleSceneState;
    private _connection: BattleConnection;
    private _view: BattleView;
    private _boxIdList: number[];

    constructor() {
        super(SceneNames.BattleScene, {
            initRender: true,
            initScene: true,
            initCamera: true
        });
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
        // this._camera = new THREE.OrthographicCamera(-1, 1, -1, 1, .1, 1000);
        this._camera.position.set(0, 180, 0);
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        this._scene.add(this._camera);
        this._render.camera = this._camera;
    }

    protected onInit() {
        this._connection = BattleConnection.getInstance();
        this._state = BattleSceneState.none;
        this.initEvents();
        this.initSkybox();
        this.initView();
        this.initDebug();
        this._state = BattleSceneState.game;
    }

    private initSkybox() {
        let loader = ThreeLoader.getInstance();
        this._scene.background = loader.getCubeTexture('skybox');
    }

    private initView() {
        this._view = new BattleView({
            render: this._render,
            scene: this._scene,
            camera: this._camera,
            connection: this._connection
        });
        this._connection.sendBattleSceneLoaded();
    }

    private initEvents() {
        // connection
        this._connection.on(PackTitle.gameComplete, this.onGameCompletePack, this);
        this._connection.on(ConnectionEvent.disconnect, this.onSocketDisconnect, this);
        this._connection.socket.on(PackTitle.exp, (aData: ExpData) => {
            this.onExpUpdatePack(aData);
        });
        this._connection.socket.on(PackTitle.emotion, (aData: EmotionData) => {
            this.onServerEmotion(aData);
        });
        // front
        FrontEvents.onBattleExit.add(this.onFrontExitBattle, this);
        FrontEvents.onBattleAbilityClick.add(this.onFrontSkillClick, this);
        FrontEvents.onBattleAbilityLevelUpClick.add(this.onFrontSkillUpClick, this);
        FrontEvents.onBattleFinalClaimRewardClick.add(this.onFrontClaimRewardClick, this);
        FrontEvents.onBattleFinalClaimBoxClick.add(this.onFrontClaimBoxClick, this);
        FrontEvents.onBattleRewardCloseClick.add(this.onFrontBattleRewardCloseClick, this);
        FrontEvents.onBattleEmotion.add(this.onFrontBattleEmotion, this);
    }

    private removeEvents() {
        // connection
        this._connection.remove(PackTitle.gameComplete, this.onGameCompletePack);
        this._connection.remove(ConnectionEvent.disconnect, this.onSocketDisconnect);
        this._connection.socket.removeListener(PackTitle.exp);
        this._connection.socket.removeListener(PackTitle.emotion);
        // front
        FrontEvents.onBattleExit.remove(this.onFrontExitBattle, this);
        FrontEvents.onBattleAbilityClick.remove(this.onFrontSkillClick, this);
        FrontEvents.onBattleAbilityLevelUpClick.remove(this.onFrontSkillUpClick, this);
        FrontEvents.onBattleFinalClaimRewardClick.remove(this.onFrontClaimRewardClick, this);
        FrontEvents.onBattleFinalClaimBoxClick.remove(this.onFrontClaimBoxClick, this);
        FrontEvents.onBattleRewardCloseClick.remove(this.onFrontBattleRewardCloseClick, this);
        FrontEvents.onBattleEmotion.remove(this.onFrontBattleEmotion, this);
    }

    private initDebug() {
        if (GlobalParams.isDebugMode) {
            let f = DebugGui.getInstance().createFolder('Battle');
            this.initSocketDebugGui(f);
            this._view.initDebugGui(f);
            // this.initEmotionsDebugGui(f);
        }
    }

    private initSocketDebugGui(aFolder: GUI) {
        const DATA = {
            exitgame: () => {
                this._connection.sendExitGame();
            },
            testBattleWin: () => {
                this._connection.sendTestWinBattle();
            },
            testBattleLoss: () => {
                this._connection.sendTestLossBattle();
            },

        }

        const f = aFolder;
        f.add(DATA, 'exitgame').name('Exit Game');
        f.add(DATA, 'testBattleWin').name('Test Battle Win');
        f.add(DATA, 'testBattleLoss').name('Test Battle Loss');

    }

    private initEmotionsDebugGui(aFolder: GUI) {

        const DATA = {
            showEmotionSelection: () => {
                let sun = this._view.getCurrentPlayerSun();
                if (!sun) {
                    GameEventDispatcher.showMessage(`Warning: player's sun not found!`);
                    this.logWarn(`showEmotionSelection: player's sun not found!`);
                    return;
                }
                let pos2d = ThreeUtils.toScreenPosition(this._render.renderer, sun, this._camera, DeviceInfo.getInstance().devicePixelRatio);
                GameEventDispatcher.showEmotionSelection(pos2d);
            },
            showRandomEmotion: () => {
                let sun = this._view.getCurrentPlayerSun();
                if (!sun) {
                    GameEventDispatcher.showMessage(`Warning: player's sun not found!`);
                    this.logWarn(`showEmotionSelection: player's sun not found!`);
                    return;
                }
                let pos2d = ThreeUtils.toScreenPosition(this._render.renderer, sun, this._camera, DeviceInfo.getInstance().devicePixelRatio);
                GameEventDispatcher.showRandomEmotion(pos2d);
            },
        }

        const f = aFolder.addFolder('Emotions');
        f.add(DATA, 'showEmotionSelection').name('Show Emotion Select');
        f.add(DATA, 'showRandomEmotion').name('Show Random Emotion');

    }

    private closeScene() {
        GameEventDispatcher.dispatchEvent(GameEvent.GALAXY_MODE);
        this.startScene(SceneNames.GalaxyScene);
    }

    private onFrontExitBattle() {
        
    }

    private onFrontSkillClick(aSkillId: number) {
        this._connection.sendSkillActionClick(aSkillId);
    }

    private onFrontSkillUpClick(aSkillId: number) {
        this._connection.sendSkillLevelUpClick(aSkillId);
    }

    private onFrontClaimRewardClick() {
        switch (this._state) {
            case 'win':
                this.logDebug('onFrontClaimClick: win handling...');
                // case 'lose':
                this.claimReward();
                break;
            default:
                this.logDebug('onFrontClaimClick: default handling...');
                GameEventDispatcher.battleCompleteHide();
                this.onFrontBattleRewardCloseClick();
                break;
        }
    }
    
    private onFrontClaimBoxClick() {
        this.logDebug('onFrontOpenBoxClick...');
        this.claimBox();
    }

    private onFrontBattleRewardCloseClick() {
        // this.emit(BattleSceneEvent.onCloseBattle);
        this.closeScene();
    }

    private onFrontBattleEmotion(aEmotion: Emotion) {
        this.logDebug(`onFrontBattleEmotion: ${aEmotion}`);
        this._connection.sendEmotion(aEmotion);
    }

    private onGameCompletePack(aData: GameCompleteData) {
        this._state = aData.status == 'win' ? BattleSceneState.win : BattleSceneState.loss;
        // this.emit(BattleSceneEvent.onGameComplete, aData);
        GameEventDispatcher.battleComplete(aData);
    }

    private onSocketDisconnect() {
        switch (this._state) {
            case BattleSceneState.game:
                GameEventDispatcher.showMessage(`Game Server disconnected...`);
                this.closeScene();
                break;
        }
    }

    private onExpUpdatePack(aExpData: ExpData) {
        GameEventDispatcher.battleExpUpdate(aExpData);
    }

    private onServerEmotion(aData: EmotionData) {
        let sun = this._view.getPlayerSun(aData.owner);
        if (!sun) {
            this.logWarn(`onServerEmotion: player's sun not found!`);
            return;
        }
        let pos2d = ThreeUtils.toScreenPosition(this._render.renderer, sun, this._camera, DeviceInfo.getInstance().devicePixelRatio);
        GameEventDispatcher.showEmotion(aData.emotion, pos2d);
    }

    private async claimReward() {
        const bcs = BlockchainConnectService.getInstance();
        const wallet = bcs.getWalletAddress();
        // let oldBalance = Math.trunc(await getUserWinContractBalance(wallet));
        let oldAssets = await GetGameAssetsWeb2(wallet);

        if (!oldAssets) {
            alert(`Error: oldAssets ( get from GetGameAssetsWeb2(wallet) ) == null!`);
            // GameEventDispatcher.showMessage(`Error: oldAssets ( get from GetGameAssetsWeb2(wallet) ) == null!`);
            this.logWarn(`oldAssets ( get from GetGameAssetsWeb2(wallet) ) == null!`, {
                wallet: wallet,
                oldAssets: oldAssets
            });
            this.closeScene();
            return;
        }

        console.log("Old assets: ", oldAssets);

        this._connection.socket.once(PackTitle.claimReward, async (aData: ClaimRewardData) => {
            this.logDebug(`Claim Reward recieved`);
            switch (aData.action) {

                case 'accept':
                    // let newBalance = Math.trunc(await getUserWinContractBalance(wallet));
                    let newAssets = await GetGameAssetsWeb2(wallet);
                    console.log("New assets: ", newAssets);
                    if (!newAssets) {
                        // alert(`Error: newAssets ( get from GetGameAssetsWeb2(wallet) ) == null!`);
                        this.logWarn(`newAssets ( get from GetGameAssetsWeb2(wallet) ) == null!`, {
                            wallet: wallet,
                            oldAssets: oldAssets,
                            newAssets: newAssets
                        });
                        this.closeScene();
                        return;
                    }

                    const rewardValue = Math.trunc(newAssets.token - oldAssets.token);
                    const balance = newAssets.token;
                    const rewardAmount = newAssets.token - oldAssets.token;
                    // alert(`VRP token: +${rewardAmount}`);
                    // alert(`Reward: ${rewardValue}; Balance: ${balance}`);
                    GameEventDispatcher.showTokenReward({
                        tokens: rewardAmount
                    });
                    break;
                
                case 'reject':
                    alert(`Error: Server RecordWinnerWithChoose reject: ${aData.reasone}`);
                    GameEventDispatcher.showMessage(`Error: Server RecordWinnerWithChoose reject: ${aData.reasone}`);
                    this.closeScene();
                    break;
                
            }

        });

        this._connection.sendClaimReward({ type: 'reward', action: 'request' });
        
    }

    private async claimBox() {
        const bcs = BlockchainConnectService.getInstance();
        const wallet = bcs.getWalletAddress();

        this._connection.socket.once(PackTitle.claimReward, async (aData: ClaimRewardData) => {
            this.logDebug(`Claim Box recieved`);
            switch (aData.action) {

                case 'accept':
                    // getUserBoxesToOpen(wallet).then((aList: number[]) => {
                    //     let list = aList.map(val => Number(val));
                    //     this.logDebug(`Box ids to open:`);
                    //     if (GlobalParams.isDebugMode) console.log(list);
                    //     if (list.length > 0) {
                    //         this._boxIdList = list;
                    //         alert(`You have ${list.length} boxes for open`);
                    //         GameEventDispatcher.showBoxOpenScreen({list});
                    //     }
                    //     else {
                    //         alert(`No box found for this user...`);
                    //     }
                    //     // temp
                    //     // this.emit(BattleSceneEvent.onCloseBattle);
                    // });

                    getUserBoxesToOpenWeb2(wallet).then((aList: number[]) => {
                        let list = aList.map(val => Number(val));
                        this.logDebug(`Box ids to open:`);
                        if (GlobalParams.isDebugMode) console.log(list);
                        if (list.length > 0) {
                            this._boxIdList = list;
                            // alert(`You have ${list.length} boxes for open`);
                            GameEventDispatcher.showBoxOpenScreen({ list });
                        }
                        else {
                            // alert(`No box found for this user...`);
                            GameEventDispatcher.showMessage(`No box found for this user...`);
                        }
                        // temp
                        // this.emit(BattleSceneEvent.onCloseBattle);
                    });

                    // TODO: change to getAvailableBoxesWeb2()

                    break;
                
                case 'reject':
                    alert(`Error: Server RecordWinnerWithChoose reject: ${aData.reasone}`);
                    this.closeScene();
                    break;
                
            }
        });

        this._connection.sendClaimReward({ type: 'box', action: 'request' });

        // alert(`Box generation in process, wait please...`);
    }

    protected onFree() {
        this.removeEvents();
        if (GlobalParams.isDebugMode) DebugGui.getInstance().clear();
        this._view.clear();
        this._view = null;
    }

    update(dt: number) {
        this._view.update(dt);
    }

}
