import { GameAuth, NetworkAuth, SubscribeOnAccountChanging } from "~/blockchain";
import { Settings } from "../data/Settings";
import { MyEventDispatcher } from "../basics/MyEventDispatcher";

export enum BattleSocketEvent {
    // enterGame = 'enterGame',
    // withdrawGame = 'withdrawGame',
    // gameStart = 'gameStart',
    message = 'packet'
};

export enum BattleAction {
    entergame = 'entergame',
    withdrawgame = 'withdrawgame',
    exitgame = 'exitgame',
    gamestart = 'gamestart',
    objectlist = 'objectlist',
    objectcreate = 'objectcreate',
    objectupdate = 'objectupdate'
}

export class BattleSocket extends MyEventDispatcher {
    // wallet
    private _subscribed = false;
    private _connected = false;
    private _account: string;
    // ws
    private _wsConnected = false;
    private _ws: WebSocket;

    constructor() {
        super('BattleSocket');
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
            this._wsConnected = true;
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
                default:
                    this.emit(BattleSocketEvent.message, data);
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
                if (!this._wsConnected) this.initConnection();
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