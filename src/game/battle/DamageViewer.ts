import * as THREE from 'three';
import { ILogger } from "../interfaces/ILogger";
import { IUpdatable } from "../interfaces/IUpdatable";
import { LogMng } from '../utils/LogMng';
import { BattleObject } from '../objects/battle/BattleObject';
import { DamageNumber } from './DamageNumber';

export class DamageViewer implements ILogger, IUpdatable {
    private _className = 'DamageViewer';
    private _parent: THREE.Group;
    private _camera: THREE.Camera;
    private _damageText: any[];
    private _isTopViewPosition = false;

    constructor(aParent: THREE.Group, aCamera: THREE.Camera) {
        this._parent = aParent;
        this._camera = aCamera;
        this._damageText = [];
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

    public get isTopViewPosition() {
        return this._isTopViewPosition;
    }
    public set isTopViewPosition(value) {
        this._isTopViewPosition = value;
    }

    showDamage(aObject: BattleObject, aDamage: number) {
        const damageNumber = new DamageNumber(this._parent, this._camera, aObject.position, aDamage);
        damageNumber.animate();
    }

    clear() {

    }

    update(dt: number) {
        const f = this._isTopViewPosition ? -1 : 1;
        this._damageText.forEach(obj => {
            
        });
    }

}