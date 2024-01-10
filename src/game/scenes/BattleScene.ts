import * as THREE from 'three';
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { Settings } from '../data/Settings';
import { IUpdatable } from '../interfaces/IUpdatable';
import { BattleView } from '../battle/BattleView';
import { FrontEvents } from '../events/FrontEvents';
import { GUI } from 'dat.gui';
import { BattleConnection } from '../battle/BattleConnection';
import { GameCompleteData, PackTitle, StartGameData } from '../battle/Types';
import { GameEvent, GameEventDispatcher } from '../events/GameEvents';

export enum BattleSceneEvent {
    onGameSearchStart = 'onGameSearchStart',
    onGameStart = 'onEnterGame',
    // onWithdraw = 'onWithdraw',
    onGameComplete = 'onGameComplete'
}

export class BattleScene extends MyEventDispatcher implements IUpdatable {
    private _connection: BattleConnection;
    private _view: BattleView;

    constructor(aParams: {
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera
    }) {
        super('BattleScene');
        this.initConnection();
        this.initView(aParams);
        this.initEvents();
        this.initDebug();
    }

    private initConnection() {
        this._connection = new BattleConnection();
        this._connection.on(PackTitle.gameSearching, this.onGameSearchPack, this);
        this._connection.on(PackTitle.gameStart, this.onGameStartPack, this);
        this._connection.on(PackTitle.gameComplete, this.onGameCompletePack, this);

    }

    private initView(aParams: {
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera
    }) {
        this._view = new BattleView({
            scene: aParams.scene,
            camera: aParams.camera,
            connection: this._connection
        });
    }

    private initEvents() {
        FrontEvents.onBattleSearch.add(this.onFrontStarBattleSearch, this);
        FrontEvents.onBattleStopSearch.add(this.onFrontStopBattleSearch, this);
        FrontEvents.onBattleExit.add(this.onFrontExitBattle, this);
        FrontEvents.onBattleAbilityLaserClick.add(this.onFrontLaserClick, this);
    }

    private initDebug() {
        if (Settings.isDebugMode && Settings.datGui) {
            let gui = Settings.datGui;
            let f = gui.addFolder('Battle');
            this.initSocketDebugGui(f);
            this._view.initDebugGui(f);
        }
    }

    private initSocketDebugGui(aFolder: GUI) {
        const DATA = {
            connectLocal: () => {
                // this._connection.connectLocal();
            },
            searchGame: () => {
                if (!this._connection.connected) {
                    alert('Socket is disconnected...');
                    return;
                }
                FrontEvents.onBattleSearch.dispatch();
            },
            searchGameBot: () => {
                if (!this._connection.connected) {
                    alert('Socket is disconnected...');
                    return;
                }
                this._connection.sendSearchGameBot();
            },
            withdrawgame: () => {
                this._connection.sendStopSearchingGame();
            },
            exitgame: () => {
                this._connection.sendExitGame();
            },
            winScreenTest: () => {
                let data: GameCompleteData = {
                    status: 'win'
                }
                this.emit(BattleSceneEvent.onGameComplete, data);
            },
        }

        const f = aFolder;
        // f.add(DATA, 'searchGame').name('Play');
        f.add(DATA, 'searchGameBot').name('Play with Bot');
        // f.add(DATA, 'withdrawgame').name('Withdraw');
        f.add(DATA, 'exitgame').name('Exit Game');
        f.add(DATA, 'winScreenTest').name('Win Screen Test');
    }

    private onFrontStarBattleSearch() {
        this._connection.sendSearchGame();
    }

    private onFrontStopBattleSearch() {
        this._connection.sendStopSearchingGame();
    }

    private onFrontExitBattle() {
        
    }

    private onFrontLaserClick() {
        this._connection.sendLaserClick();
    }

    onGameSearchPack(aData: {
        cmd: 'start' | 'stop'
    }) {
        switch (aData.cmd) {
            case 'start':
                this.emit(BattleSceneEvent.onGameSearchStart);
                GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
                break;
            case 'stop':
                GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_STOP);
                break;
            default:
                this.logDebug(`onGameSearchPack(): unknown cmd`, aData);
                break;
        }
    }

    onGameStartPack(aData: StartGameData) {
        switch (aData.cmd) {
            case 'start':
                this.emit(BattleSceneEvent.onGameStart, aData);
                break;
            default:
                this.logDebug(`onGameStartPack(): unknown cmd`, aData);
                break;
        }
    }

    onGameCompletePack(aData: GameCompleteData) {
        this.emit(BattleSceneEvent.onGameComplete, aData);
    }

    show() {
        this._view.show();
    }

    hide() {
        this._view.hide();
    }

    clear() {
        this._view.clear();
    }

    update(dt: number) {
        this._view.update(dt);
    }

}