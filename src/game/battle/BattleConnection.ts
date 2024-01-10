import { NetworkAuth } from "~/blockchain";
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { newGameAuth } from "~/blockchain/functions/gameplay";
import { Socket, io } from "socket.io-client";
import { Settings } from "../data/Settings";
import { getWalletAddress, isWalletConnected } from "~/blockchain/functions/auth";
import { GameCompleteData, PackTitle, StartGameData } from "./Types";
import { GameEvent, GameEventDispatcher } from "../events/GameEvents";

export class BattleConnection extends MyEventDispatcher {
    private _socket: Socket;

    constructor() {
        super('BattleConnection');
        // auto connection
        if (Settings.BATTLE.localConnect) {
            this.connectLocal();
        }
        else {
            this.connectServer();
        }
    }

    private connectLocal() {
        this.closeConnection();
        this._socket = io('localhost:3089');
        this.initListeners();
    }

    private connectServer() {
        this.closeConnection();
        this._socket = io(Settings.BATTLE.serverAddr);
        this.initListeners();
    }

    private sendPacket(aPackTitle: PackTitle, aData: any) {
        this.logDebug(`sendPacket:`, aData);
        this._socket.emit(aPackTitle, aData);
        // this._ws?.send(JSON.stringify(aData));
    }

    private initListeners() {

        this._socket.on('connect', () => {
            this.logDebug('socket connected...');
        });

        this._socket.on(PackTitle.sign, (aData: {
            cmd: 'request'
        }) => {
            this.onSignRecv(aData);
        });

        this._socket.on(PackTitle.gameSearching, (aData) => {
            this.logDebug(`gameSearching:`, aData);
            this.emit(PackTitle.gameSearching, aData);
        });

        this._socket.on(PackTitle.gameStart, (aData: StartGameData) => {
            this.logDebug(`gameStart:`, aData);
            this.emit(PackTitle.gameStart, aData);
        });

        this._socket.on(PackTitle.gameComplete, (aData: GameCompleteData) => {
            this.logDebug(`gameComplete:`, aData);
            this.emit(PackTitle.gameComplete, aData);
        });

    }

    private onSignRecv(aData: {
        cmd: 'request' | 'reject' | 'success'
    }) {
        switch (aData.cmd) {
            case 'request':
                this.logDebug(`onSignRecv: request...`);
                this.signProcess1();
                break;
            case 'reject':
                this.logDebug(`onSignRecv: REJECT!`, aData);
                break;
            case 'success':
                this.logDebug(`onSignRecv: SUCCESS`, aData);
                break;
            default:
                this.logWarn(`onSignRecv: unknown status:`, aData);
                break;
        }
    }

    private signProcess1() {
        if (!isWalletConnected()) {
            NetworkAuth().then((aWallet: string) => {
                this.signProcess2();
            }).catch((reason) => {
                alert(reason);
                GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_ERROR, { reason: reason });
            });
        }
        else {
            this.signProcess2();
        }
    }
    
    private signProcess2() {
        newGameAuth(getWalletAddress()).then(aSignature => {
            this.logDebug(`wallet auth...`);
            this._socket.emit(PackTitle.sign, aSignature);
        });
    }

    public get connected(): boolean {
        return this._socket.connected;
    }
    
    public get socket(): Socket {
        return this._socket;
    }

    closeConnection() {
        if (this._socket) {
            this._socket.close();
            this._socket = null;
        }
    }

    sendSearchGame() {
        this._socket.emit(PackTitle.startSearchGame);
    }

    sendLaserClick() {
        this._socket.emit(PackTitle.planetLaser, {
            cmd: 'click'
        });
    }

    sendSearchGameBot() {
        this._socket.emit(PackTitle.startSearchGame, {
            withBot: true
        });
    }

    sendStopSearchingGame() {
        this._socket.emit(PackTitle.stopSearchGame);
    }

    sendExitGame() {
        // this.sendPacket({
        //     action: "exitgame"
        // });
    }

    sendPlanetFire() {
        // this.sendPacket({
        //     action: "planetFire"
        // });
    }

}