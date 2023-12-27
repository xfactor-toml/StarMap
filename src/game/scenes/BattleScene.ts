import * as THREE from 'three';
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { Settings } from '../data/Settings';
import { IUpdatable } from '../interfaces/IUpdatable';
import { BattleView } from '../battle/BattleView';
import { FrontEvents } from '../events/FrontEvents';
import { GUI } from 'dat.gui';
import { BattleConnection, PackTitle } from '../battle/BattleConnection';

export enum BattleSceneEvent {
    onGameSearchStart = 'onGameSearchStart',
    onEnterGame = 'onEnterGame',
    onWithdraw = 'onWithdraw',
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
        this.initSocket();
        this.initView(aParams);
        this.initEvents();
        this.initDebug();
    }

    private initSocket() {
        this._connection = new BattleConnection();
        // this._connection.on(BattleConnectionEvent.message, this.onBattleSocketMessage, this);
        this._connection.on(PackTitle.gameSearching, this.onGameSearchPack, this);

    }

    private initView(aParams: {
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera
    }) {
        this._view = new BattleView({
            scene: aParams.scene,
            camera: aParams.camera
        })
    }

    private initEvents() {
        FrontEvents.onBattleSearch.add(this.onFrontStarBattleSearch, this);
        FrontEvents.onBattleWithdrawSearch.add(this.onFrontWithdrawSearch, this);
        FrontEvents.onExitBattle.add(this.onFrontExitBattle, this);
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
                this._connection.sendWithdrawGame();
            },
            exitgame: () => {
                this._connection.sendExitGame();
            },
            planetFire: () => {
                this._connection.sendPlanetFire();
            },
            planetFireClient: () => {
                
            }
        }

        const f = aFolder;
        f.add(DATA, 'searchGame').name('Play');
        f.add(DATA, 'searchGameBot').name('Play with Bot');
        f.add(DATA, 'withdrawgame').name('Withdraw');
        f.add(DATA, 'exitgame').name('Exit Game');
        f.add(DATA, 'planetFire').name('Planet Fire');
        f.add(DATA, 'planetFireClient').name('Planet Fire - Client');
    }

    private onFrontStarBattleSearch() {
        this._connection.sendSearchGame();
    }

    private onFrontWithdrawSearch() {
        this._connection.sendWithdrawGame();
    }

    private onFrontExitBattle() {
        this._connection.sendSearchGame();
    }

    private onBattleSocketMessage(aData: any) {
        switch (aData.action) {
            // case PackTitle.entergame:
            //     this._view.walletNumber = this._socket.walletAccount;

            //     this.emit(BattleSceneEvent.onEnterGame);
            //     break;
            
            // case PackTitle.withdrawgame:
            //     this.emit(BattleSceneEvent.onWithdraw);
            //     break;
            
            // case PackTitle.gameend:
            //     if (aData.win) {
            //         alert(`You Win!`);
            //     }
            //     else {
            //         alert(`You Loose...`);
            //     }
            //     this.emit(BattleSceneEvent.onGameComplete);
            //     break;
            
            default:
                this._view.onSocketMessage(aData);
                break;
        }
    }

    onGameSearchPack(aData: {
        cmd: 'start'
    }) {
        switch (aData.cmd) {
            case 'start':
                this.emit(BattleSceneEvent.onGameSearchStart);
                break;
        
            default:
                this.logDebug(`onGameSearchPack(): unknown cmd`, aData);
                break;
        }
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