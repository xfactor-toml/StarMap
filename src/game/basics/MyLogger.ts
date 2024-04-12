import { ILogger } from "../core/interfaces/ILogger";
import { LogMng } from "../utils/LogMng";

export class MyLogger implements ILogger {
    protected _className: string;

    constructor(aClassName?: string) {
        this._className = aClassName || 'MyLogger';
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

}