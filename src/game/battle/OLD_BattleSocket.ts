import { GameAuth, NetworkAuth, SubscribeOnAccountChanging } from "~/blockchain";
import { MyEventDispatcher } from "../basics/MyEventDispatcher";

export enum BattleSocketEvent {
    message = 'message'
};

export enum PackTitle {
    entergame = 'entergame',
    withdrawgame = 'withdrawgame',
    exitgame = 'exitgame',
    gamestart = 'gamestart',
    objectlist = 'objectlist',
    objectCreate = 'objectCreate',
    objectUpdate = 'objectUpdate',
    objectdestroy = 'objectdestroy',
    attack = 'attack',
    event = 'event',
    gameend = 'gameend',
    log = 'log'

}

export enum ObjectClass {
    star = 'star',
    planet = 'planet',
    ship = 'ship',
    battleship = 'battleship',
    shell = 'shell'
}

export class BattleSocket extends MyEventDispatcher {
    // wallet
    private _walletSubscribed = false;
    private _walletConnected = false;
    private _walletAccount: string;
    // ws
    private _wsConnected = false;
    private _ws: WebSocket;

    constructor() {
        super('BattleSocket');
    }

    private updateState(auth: string | null) {
        if (!auth) return false;
        this._walletConnected = true;
        this._walletAccount = auth;
        return true;
    }

    private async walletSubscribe() {
        this._walletSubscribed = true;
        return this.updateState(await SubscribeOnAccountChanging());
    }

    private async walletConnect() {
        if (!this._walletSubscribed) {
            this.walletSubscribe();
        }
        return this.updateState(await NetworkAuth());
    }

    private async wsConnect() {
        if (this._wsConnected) {
            this.logWarn(`wsConnect: already connected!`);
            return;
        }
        if (!this._walletConnected) {
            this.logWarn(`wsConnect: wallet doesn't connected!`);
            return;
        }

        this.logDebug(`wsConnect wallet: ${this._walletAccount}`)

        this._ws = await GameAuth(this._walletAccount);

        this.logDebug(`WS connection:`, this._ws);

        if (this._ws) {
            this._wsConnected = true;
            this._ws.onmessage = (event) => {
                this.onMessage(event);
            };
            // this._ws.onclose = () => {
            //     this._wsConnected = false;
            //     this._ws = null;
            // }
            (this._ws as any).onClientCloseContext = this;
            (this._ws as any).onClientCloseEvent = () => {
                this._wsConnected = false;
                this._ws = null;
            }
        }
    }

    private sendPacket(aData: any) {
        this.logDebug(`sendPacket:`, aData);
        this._ws?.send(JSON.stringify(aData));
    }

    private onMessage(event) {
        
        let recvData = event.data;
        if (!recvData) {
            this.logDebug(`onWSMessage: data == null`);
            return;
        }
        // this.logDebug(`recv data: ${recvData}`);

        let data: any;

        try {
            if (['p', 'pong', 'ping'].indexOf(recvData) >= 0) return;
            data = JSON.parse(recvData);
            this.logDebug(`Parsed Data:`, data);
        } catch (error) {
            this.logWarn(`recvData: ${recvData}`);
            this.logWarn(`onMessage parsed data:`, data);
            this.logError(`${error.message}`);
        }

        if (!data) return;

        switch (data.action) {
            case 'ping':
                this._ws.send(JSON.stringify({ action: 'pong' }));
                break;
            default:
                this.emit(BattleSocketEvent.message, data);
                break;
        }

    }

    public get connected(): boolean {
        return this._wsConnected;
    }
    
    public get walletAccount(): string {
        return this._walletAccount;
    }

    initConnection() {
        if (this._walletConnected) {
            if (!this._wsConnected) this.wsConnect();
        }
        else {
            this.walletConnect().then((value: boolean) => {
                if (!this._wsConnected) this.wsConnect();
            });
        }
    }

    sendEnterGame() {
        this.sendPacket({
            action: "entergame"
        });
    }

    sendWithdrawGame() {
        this.sendPacket({
            action: "withdrawgame"
        });
    }

    sendExitGame() {
        this.sendPacket({
            action: "exitgame"
        });
    }

    sendPlanetFire() {
        this.sendPacket({
            action: "planetFire"
        });
    }

}