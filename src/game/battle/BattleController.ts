import { GameAuth, NetworkAuth, SubscribeOnAccountChanging } from "~/blockchain";
import { Settings } from "../data/Settings";
import { ILogger } from "../interfaces/ILogger";
import { LogMng } from "../utils/LogMng";

export class BattleController implements ILogger {

    // wallet
    private _subscribed = false;
    private _connected = false;
    private _account: string;
    // ws
    private _wsConnected = false;
    private _ws: WebSocket;

    constructor() {
        
    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`BattleController: ${aMsg}`, aData);
    }
    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`BattleController: ${aMsg}`, aData);
    }
    logError(aMsg: string, aData?: any): void {
        LogMng.error(`BattleController: ${aMsg}`, aData);
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
            this._ws.send(
                JSON.stringify({
                    action: "entergame",
                })
            );
        }

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

    private onMessage(event) {
        this.logDebug(`onWSMessage: event:`, event);
        let dt = event.data;
        if (!dt) {
            this.logDebug(`onWSMessage: data == null`);
            return;
        }
        this.logDebug(`onWSMessage: data:`, dt);

        try {
            let data = JSON.parse(dt);
            this.logDebug(`onWSMessage: data decoded:`, data);

            switch (data.action) {
                case 'ping':
                    this._ws.send( JSON.stringify({ action: 'pong' }) );
                    break;
                
                case 'objectlist':
                    // InitGame(ws, data.list)
                    this._ws.onmessage = null;
                    break;
            
                default:
                    this.logWarn(`onMessage: unhandled package action=${data.action}`);
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
            }
        }

        let gui = Settings.datGui;
        let f = gui.addFolder('Gameplay');
        f.add(DATA, 'connect');
    }

}