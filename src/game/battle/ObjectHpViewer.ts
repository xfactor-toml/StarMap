import * as THREE from 'three';
import { ShipEnergyBar } from "../objects/battle/ShipEnergyBar";
import { ILogger } from '../core/interfaces/ILogger';
import { IUpdatable } from '../core/interfaces/IUpdatable';
import { LogMng } from '../../monax/LogMng';
import { BattleObject } from '../objects/battle/BattleObject';

export class ObjectHpViewer implements ILogger, IUpdatable {
    private _className = 'ObjectHpViewer';
    private _parent: THREE.Group;
    private _objects: Map<number, BattleObject>;
    private _hpBars: Map<number, ShipEnergyBar>;
    private _shieldBars: Map<number, ShipEnergyBar>;
    private _isTopViewPosition = false;
    
    constructor(aParent: THREE.Group) {
        this._parent = aParent;
        this._objects = new Map();
        this._hpBars = new Map();
        this._shieldBars = new Map();
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

    addBar(aObject: BattleObject, isEnemy: boolean) {
        this._objects.set(aObject.objId, aObject);

        let hpBar = new ShipEnergyBar({
            w: aObject.radius * 2,
            color: isEnemy ? 0xff0000 : 0x00ff00
        });
        this._hpBars.set(aObject.objId, hpBar);
        this._parent.add(hpBar);

        if (aObject.shield > 0) {
            let shieldBar = new ShipEnergyBar({
                w: aObject.radius * 2,
                color: 0x30b4ff
            });
            this._shieldBars.set(aObject.objId, shieldBar);
            this._parent.add(shieldBar);
        }
    }

    removeBar(aShipId: number) {
        this._objects.delete(aShipId);

        let hpBar = this._hpBars.get(aShipId);
        this._hpBars.delete(aShipId);
        if (hpBar) hpBar.free();

        let shieldBar = this._shieldBars.get(aShipId);
        this._shieldBars.delete(aShipId);
        if (shieldBar) shieldBar.free();
    }

    clear() {
        this._objects.clear();
        this._hpBars.forEach(bar => {
            bar.free();
        });
        this._hpBars.clear();
        this._shieldBars.forEach(bar => {
            bar.free();
        });
        this._shieldBars.clear();
    }

    update(dt: number) {
        const f = this._isTopViewPosition ? -1 : 1;
        this._objects.forEach(obj => {

            let hpBar = this._hpBars.get(obj.objId);
            if (hpBar) {
                let p = obj.hp / obj.hpMax;
                hpBar.progress = p;
                hpBar.position.x = obj.position.x;
                hpBar.position.y = obj.position.y;
                hpBar.position.z = obj.position.z + f * (obj.radius + 1);
            }

            let shieldBar = this._shieldBars.get(obj.objId);
            if (shieldBar) {
                let p = obj.shield / obj.shieldMax;
                shieldBar.progress = p;
                shieldBar.position.x = obj.position.x;
                shieldBar.position.y = obj.position.y;
                shieldBar.position.z = obj.position.z + f * (obj.radius + 1.4);
            }

        });
    }

    free() {
        this.clear();
        this._parent = null;
        this._objects = null;
        this._hpBars = null;
        this._shieldBars = null;
    }

}