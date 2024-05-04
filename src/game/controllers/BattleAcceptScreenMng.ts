import { BattleConnection } from "../battle/BattleConnection";
import { AcceptScreenData, PackTitle } from "../battle/Types";
import { ILogger } from "../core/interfaces/ILogger";
import { FrontEvents } from "../events/FrontEvents";
import { GameEventDispatcher } from "../events/GameEvents";
import { LogMng } from "../utils/LogMng";

export class BattleAcceptScreenMng implements ILogger {
    private _className = 'BattleAcceptScreenMng';
    private _startDeadlineTimer: NodeJS.Timeout;

    constructor() {
        this.initListeners();
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

    private initListeners() {
        FrontEvents.onBattleAcceptClick.add(this.onFrontBattleAcceptClick, this);
        FrontEvents.onBattleAcceptCloseClick.add(this.onFrontBattleAcceptCloseClick, this);
        // battle server events
        let bc = BattleConnection.getInstance();
        bc.on(PackTitle.battleConfirmation, this.onBattleAcceptScreenPack, this);
    }

    private removeListeners() {
        FrontEvents.onBattleAcceptClick.remove(this.onFrontBattleAcceptClick, this);
        FrontEvents.onBattleAcceptCloseClick.remove(this.onFrontBattleAcceptCloseClick, this);
        let bc = BattleConnection.getInstance();
        bc.remove(PackTitle.battleConfirmation, this.onBattleAcceptScreenPack);
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
        BattleConnection.getInstance().sendAcceptConfirmation();
        this.clearDeadlineTimeout();
    }
    
    private onFrontBattleAcceptCloseClick() {
        this.logDebug(`onFrontBattleAcceptCloseClick...`);
        BattleConnection.getInstance().sendAcceptCloseClick();
        this.clearDeadlineTimeout();
    }

    private onBattleAcceptScreenPack(aData: AcceptScreenData) {
        this.logDebug(`onBattleAcceptScreenPack: action=${aData.action}`, aData);
        switch (aData.action) {
            case 'start':
                // const startTimer = 6;
                // GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_STOP);
                GameEventDispatcher.battleAcceptScreenShow(aData.timer);
                this.initDeadlineTimer(aData.timer);
                break;
            case 'update':
                GameEventDispatcher.battleAcceptScreenUpdate(aData);
                break;
            case 'cancel':
                GameEventDispatcher.battleAcceptScreenClose();
                // GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_STOP);
                break;
            default:
                this.logWarn(`onBattleAcceptScreenPack: `);
                break;
        }
    }
    
    free() {
        this.logDebug(`free...`);
        this.removeListeners();
    }

}