import * as THREE from 'three';
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { Settings } from '../data/Settings';
import { IUpdatable } from '../interfaces/IUpdatable';
import { BattleView } from '../battle/BattleView';
import { FrontEvents } from '../events/FrontEvents';
import { GUI } from 'dat.gui';
import { BattleConnection, ConnectionEvent } from '../battle/BattleConnection';
import { GameCompleteData, PackTitle, StartGameData } from '../battle/Types';
import { GameEvent, GameEventDispatcher } from '../events/GameEvents';

export enum BattleSceneEvent {
    onGameStart = 'onEnterGame',
    onGameComplete = 'onGameComplete',
    onDisconnect = 'onDisconnect',
}

enum BattleSceneState {
    none = 'none',
    game = 'game'
}

export class BattleScene extends MyEventDispatcher implements IUpdatable {
    private _state: BattleSceneState;
    private _connection: BattleConnection;
    private _view: BattleView;

    constructor(aParams: {
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera
    }) {
        super('BattleScene');
        this._state = BattleSceneState.none;
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
        this._connection.on(ConnectionEvent.disconnect, this.onSocketDisconnect, this);

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
        FrontEvents.onBattleFinalOpenBoxClick.add(this.onFrontOpenBoxClick, this);

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
                    alert(`No connection to server!`);
                    return;
                }
                FrontEvents.onBattleSearch.dispatch();
            },
            searchGameBot: () => {
                if (!this._connection.connected) {
                    alert(`No connection to server!`);
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
            testBattleWin: () => {
                // let data: GameCompleteData = {
                //     status: 'win'
                // }
                // this.emit(BattleSceneEvent.onGameComplete, data);
                GameEventDispatcher.battleComplete({
                    status: 'win',
                    // showBoxClaim: false,
                    // boxLevel: 1
                });
            },
            testBattleWinBox: () => {
                GameEventDispatcher.battleComplete({
                    status: 'win',
                    showBoxClaim: true,
                    boxLevel: 1
                });
            },
            
        }

        const f = aFolder;
        // f.add(DATA, 'searchGame').name('Play');
        f.add(DATA, 'searchGameBot').name('Play with Bot');
        // f.add(DATA, 'withdrawgame').name('Withdraw');
        f.add(DATA, 'exitgame').name('Exit Game');
        // f.add(DATA, 'winScreenTest').name('Win Screen Test');
        f.add(DATA, 'testBattleWin').name('Test Battle Win NO Box');
        f.add(DATA, 'testBattleWinBox').name('Test Battle Win Box');

    }

    private onFrontStarBattleSearch() {
        if (!this._connection.connected) {
            alert(`No connection to server!`);
            return;
        }
        GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
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
    
    private onFrontOpenBoxClick() {
        this._connection.sendOpenBox();
    }
    
    private onGameSearchPack(aData: {
        cmd: 'start' | 'stop'
    }) {
        switch (aData.cmd) {
            case 'start':
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

    private onGameStartPack(aData: StartGameData) {
        switch (aData.cmd) {
            case 'start':
                this._state = BattleSceneState.game;
                this.emit(BattleSceneEvent.onGameStart, aData);
                break;
            default:
                this.logDebug(`onGameStartPack(): unknown cmd`, aData);
                break;
        }
    }

    private onGameCompletePack(aData: GameCompleteData) {
        this._state = BattleSceneState.none;
        this.emit(BattleSceneEvent.onGameComplete, aData);
    }

    private onSocketDisconnect() {
        switch (this._state) {
            case BattleSceneState.game:
                this.emit(BattleSceneEvent.onDisconnect);
                // alert(`Disconnect...`);
                // stop the battle
                // this._view
                break;
        }
    }

    public get connection(): BattleConnection {
        return this._connection;
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