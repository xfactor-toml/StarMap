import * as THREE from 'three';
import { ShipEnergyBar } from "../objects/battle/ShipEnergyBar";
import { ILogger } from '../interfaces/ILogger';
import { IUpdatable } from '../interfaces/IUpdatable';
import { LogMng } from '../utils/LogMng';
import { BattleObject } from '../objects/battle/BattleObject';

export class ObjectEnergyViewer implements ILogger, IUpdatable {

    private _className = 'ShipEnergyViewer';
    private _parent: THREE.Group;
    private _objects: Map<string, BattleObject>;
    private _bars: Map<string, ShipEnergyBar>;
    private _isTopViewPosition = false;
    
    constructor(aParent: THREE.Group) {
        this._parent = aParent;
        this._objects = new Map<string, BattleObject>();
        this._bars = new Map<string, ShipEnergyBar>();
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

    addBar(aObject: BattleObject) {
        this._objects.set(aObject.objId, aObject);
        let bar = new ShipEnergyBar({
            w: aObject.radius * 2
        });
        this._bars.set(aObject.objId, bar);
        this._parent.add(bar);
    }

    removeBar(aShipId: string) {
        this._objects.delete(aShipId);
        let bar = this._bars.get(aShipId);
        this._bars.delete(aShipId);
        if (!bar) return;
        bar.free();
    }

    clear() {
        this._objects.clear();
        this._bars.forEach(bar => {
            bar.free();
        });
        this._bars.clear();
    }

    update(dt: number) {
        const f = this._isTopViewPosition ? -1 : 1;
        this._objects.forEach(obj => {
            let bar = this._bars.get(obj.objId);
            let p = obj.hp / obj.maxHp;
            bar.progress = p;
            bar.position.x = obj.position.x;
            bar.position.y = obj.position.y;
            bar.position.z = obj.position.z + f * (obj.radius + 1);
        });
    }

}