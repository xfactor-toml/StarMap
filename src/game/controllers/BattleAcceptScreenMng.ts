import { AudioAlias } from "../audio/AudioData";
import { AudioMng } from "../audio/AudioMng";
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { BattleConnection } from "../battle/BattleConnection";
import { AcceptScreenData, PackTitle, PlayerLoadingData } from "../battle/Types";
import { FrontEvents } from "../events/FrontEvents";
import { GameEventDispatcher } from "../events/GameEvents";

export enum BattleAcceptScreenMngEvent {
    Loading = 'Loading'
}

export class BattleAcceptScreenMng extends MyEventDispatcher {
    private _startDeadlineTimer: NodeJS.Timeout;

    constructor() {
        super('BattleAcceptScreenMng');
        this.initListeners();
    }

    private initListeners() {
        FrontEvents.onBattleAcceptClick.add(this.onFrontBattleAcceptClick, this);
        FrontEvents.onBattleAcceptCloseClick.add(this.onFrontBattleAcceptCloseClick, this);
        // battle server events
        let bc = BattleConnection.getInstance();
        bc.on(PackTitle.battleConfirmation, this.onServerBattleAcceptScreenPack, this);
    }

    private removeListeners() {
        FrontEvents.onBattleAcceptClick.remove(this.onFrontBattleAcceptClick, this);
        FrontEvents.onBattleAcceptCloseClick.remove(this.onFrontBattleAcceptCloseClick, this);
        let bc = BattleConnection.getInstance();
        bc.remove(PackTitle.battleConfirmation, this.onServerBattleAcceptScreenPack);
    }

    private initDeadlineTimer(aTimeSec: number) {
        this._startDeadlineTimer = setTimeout(() => {
            this.onFrontBattleAcceptCloseClick();
        }, aTimeSec * 1000);
    }

    private clearDeadlineTimeout() {
        if (this._startDeadlineTimer) {
            clearTimeout(this._startDeadlineTimer);
            this._startDeadlineTimer = null;
        }
    }

    private onFrontBattleAcceptClick() {
        this.logDebug(`onFrontBattleAcceptClick...`);
        AudioMng.getInstance().playSfx({ alias: AudioAlias.battleBtnClick });
        BattleConnection.getInstance().sendAcceptConfirmation();
        this.clearDeadlineTimeout();
    }
    
    private onFrontBattleAcceptCloseClick() {
        this.logDebug(`onFrontBattleAcceptCloseClick...`);
        BattleConnection.getInstance().sendAcceptCloseClick();
        this.clearDeadlineTimeout();
    }

    private onServerBattleAcceptScreenPack(aData: AcceptScreenData) {
        this.logDebug(`onBattleAcceptScreenPack: action=${aData.action}`, aData);
        switch (aData.action) {
            case 'start': // show screen
                GameEventDispatcher.battleAcceptScreenShow(aData.timer);
                // this.initDeadlineTimer(aData.timer);
                break;
            case 'update': // update screen
                GameEventDispatcher.battleAcceptScreenUpdate(aData);
                break;
            case 'loading': // update to loading screen
                GameEventDispatcher.battleAcceptScreenLoading(aData);
                this.emit(BattleAcceptScreenMngEvent.Loading);
                break;
            case 'cancel':
                GameEventDispatcher.battleAcceptScreenClose();
                break;
            default:
                this.logWarn(`onBattleAcceptScreenPack: `);
                break;
        }
    }

    sendLoadingComplete(aData: PlayerLoadingData) {
        BattleConnection.getInstance().sendAcceptLoading(aData);
    }
    
    free() {
        this.logDebug(`free...`);
        this.removeAll(BattleAcceptScreenMngEvent.Loading);
        this.removeListeners();
    }

}