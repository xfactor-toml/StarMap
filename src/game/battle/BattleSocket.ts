import { GameAuth, NetworkAuth, SubscribeOnAccountChanging } from "~/blockchain";
import { Settings } from "../data/Settings";
import { ILogger } from "../interfaces/ILogger";
import { LogMng } from "../utils/LogMng";
import { Signal } from "../utils/events/Signal";

export enum BattleSocketEvent {
    enterGame = 'enterGame',
    withdrawGame = 'withdrawGame',
    gameStart = 'gameStart'
};

export class BattleSocket implements ILogger {
    private _className = 'BattleSocket';

    // wallet
    private _subscribed = false;
    private _connected = false;
    private _account: string;
    // ws
    private _wsConnected = false;
    private _ws: WebSocket;

    /**
     * ({ event: BattleControllerEvent })
     */
    onEvent = new Signal();

    constructor() {
        
    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`${this._className}: ${aMsg}`, aData);
    }
    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`${this._className}: ${aMsg}`, aData);
    }
    logError(aMsg: string, aData?: any): void {
        LogMng.error(`${this._className}: ${aMsg}`, aData);
    }

    private updateState(auth: string | null) {
        if (!auth) return false;
        this._connected = true;
        this._account = auth;
        return true;
    }

    private async walletSubscribe() {
        this._subscribed = true;
        return this.updateState(await SubscribeOnAccountChanging());
    }

    private async walletConnect() {
        if (!this._subscribed) {
            this.walletSubscribe();
        }
        return this.updateState(await NetworkAuth());
    }

    private async wsConnect() {
        if (this._wsConnected) {
            this.logWarn(`wsConnect: already connected!`);
            return;
        }
        if (!this._connected) {
            this.logWarn(`wsConnect: wallet doesn't connected!`);
            return;
        }

        this.logDebug(`wsConnect wallet: ${this._account}`)

        this._ws = await GameAuth(this._account);

        this.logDebug(`WS connection:`)
        console.log(this._ws);

        if (this._ws) {
            this._ws.onmessage = (event) => {
                this.onMessage(event);
            };
        }
    }

    private sendPacket(aData: any) {
        this.logDebug(`sendPacket:`, aData);
        this._ws?.send(JSON.stringify(aData));
    }

    private initConnection() {
        if (this._connected) {
            this.wsConnect();
        }
        else {
            this.walletConnect().then((value: boolean) => {
                this.wsConnect();
            });
        }
    }

    private enterGame() {
        this.sendPacket({
            action: "entergame"
        });
    }

    private withdrawGame() {
        this.sendPacket({
            action: "withdrawgame"
        });
    }

    private exitGame() {
        this.sendPacket({
            action: "exitgame"
        });
    }

    private onMessage(event) {
        // this.logDebug(`onWSMessage: event:`, event);
        let recvData = event.data;
        if (!recvData) {
            this.logDebug(`onWSMessage: data == null`);
            return;
        }
        // this.logDebug(`onWSMessage: data:`, recvData);

        try {
            if (['p', 'pong', 'ping'].indexOf(recvData) >= 0) return;

            let data = JSON.parse(recvData);
            this.logDebug(`onWSMessage: data:`, data);

            switch (data.action) {
                case 'ping':
                    this._ws.send( JSON.stringify({ action: 'pong' }) );
                    break;
                
                case 'entergame':
                    this.onEvent.dispatch({
                        event: BattleSocketEvent.enterGame
                    });
                    break;
                
                case 'withdrawgame':
                    this.onEvent.dispatch({
                        event: BattleSocketEvent.withdrawGame
                    });
                    break;

                case 'gamestart':
                    this.logDebug(`gamestart...`);
                    this.onEvent.dispatch({
                        event: BattleSocketEvent.gameStart
                    });
                    break;

                case 'objectlist':
                    this.logDebug(`objectlist...`);
                    break;

                default:
                    this.logWarn(`onMessage: unhandled package:`, data);
                    break;
            }

        } catch (error) {
            this.logError(`onMessage: ${error.message}`);
        }

    }

    initDebugGui() {
        const DATA = {
            connect: () => {
                this.initConnection();
            },
            entergame: () => {
                this.enterGame();
            },
            withdrawgame: () => {
                this.withdrawGame();
            },
            exitgame: () => {
                this.exitGame();
            },
        }

        let gui = Settings.datGui;
        let f = gui.addFolder('Gameplay');
        f.add(DATA, 'connect');
        f.add(DATA, 'entergame');
        f.add(DATA, 'withdrawgame');
        f.add(DATA, 'exitgame');
    }

}