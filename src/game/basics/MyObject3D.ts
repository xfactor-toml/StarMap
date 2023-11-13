import * as THREE from 'three';
import { ILogger } from "../interfaces/ILogger";
import { IUpdatable } from "../interfaces/IUpdatable";
import { LogMng } from "../utils/LogMng";

export class MyObject3D extends THREE.Group implements ILogger, IUpdatable {
    protected _className: string;

    constructor(aClassName?: string) {
        super();
        this._className = aClassName || 'MyBasicClass';
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

    free() {
        this.clear();
        this.parent?.remove(this);
    }
    
    update(dt: number) {
        
    }

}