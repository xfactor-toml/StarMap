import * as THREE from 'three';
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { GalaxyMng } from "../galaxy/Galaxy";
import { Settings } from '../data/Settings';
import { IUpdatable } from '../interfaces/IUpdatable';
import { BattleAction, BattleSocket, BattleSocketEvent } from '../battle/BattleSocket';
import { BattleView } from '../battle/BattleView';
import { FrontEvents } from '../events/FrontEvents';
import { GUI } from 'dat.gui';

export enum BattleSceneEvent {
    onEnterGame = 'onEnterGame',
    onWithdraw = 'onWithdraw',
    onGameComplete = 'onGameComplete'
}

export class BattleScene extends MyEventDispatcher implements IUpdatable {
    private _socket: BattleSocket;
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
        this._socket = new BattleSocket();
        this._socket.on(BattleSocketEvent.message, this.onBattleSocketMessage, this);
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
            connect: () => {
                this._socket.initConnection();
            },
            entergame: () => {
                // if (!this._socket.connected) this._socket.initConnection();
                if (!this._socket.connected) return;
                FrontEvents.onBattleSearch.dispatch();
            },
            withdrawgame: () => {
                this._socket.sendWithdrawGame();
            },
            exitgame: () => {
                this._socket.sendExitGame();
            },
            planetFire: () => {
                this._socket.sendPlanetFire();
            },
            planetFireClient: () => {
                
            }
        }

        const f = aFolder;
        f.add(DATA, 'connect').name('Connect');
        f.add(DATA, 'entergame').name('Enter Game');
        f.add(DATA, 'withdrawgame').name('Withdraw');
        f.add(DATA, 'exitgame').name('Exit Game');
        f.add(DATA, 'planetFire').name('Planet Fire');
        f.add(DATA, 'planetFireClient').name('Planet Fire - Client');
    }

    private onFrontStarBattleSearch() {
        this._socket.sendEnterGame();
    }

    private onFrontWithdrawSearch() {
        this._socket.sendWithdrawGame();
    }

    private onFrontExitBattle() {
        this._socket.sendEnterGame();
    }

    private onBattleSocketMessage(aData: any) {
        switch (aData.action) {
            case BattleAction.entergame:
                this.emit(BattleSceneEvent.onEnterGame);
                break;
            case BattleAction.withdrawgame:
                this.emit(BattleSceneEvent.onWithdraw);
                break;
            case BattleAction.gameend:
                this.emit(BattleSceneEvent.onGameComplete);
                break;
            default:
                this._view.onSocketMessage(aData);
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