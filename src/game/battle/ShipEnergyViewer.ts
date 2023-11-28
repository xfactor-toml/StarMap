import * as THREE from 'three';
import { ShipEnergyBar } from "../objects/battle/ShipEnergyBar";
import { ILogger } from '../interfaces/ILogger';
import { IUpdatable } from '../interfaces/IUpdatable';
import { LogMng } from '../utils/LogMng';
import { BattleObject } from '../objects/battle/BattleObject';

export class ShipEnergyViewer implements ILogger, IUpdatable {

    private _parent: THREE.Group;
    private _objects: Map<string, BattleObject>;
    private _bars: Map<string, ShipEnergyBar>;

    constructor(aParent: THREE.Group) {
        this._parent = aParent;
        this._objects = new Map<string, BattleObject>();
        this._bars = new Map<string, ShipEnergyBar>();
    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`ShipEnergyViewer: ${aMsg}`, aData);
    }

    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`ShipEnergyViewer: ${aMsg}`, aData);
    }

    logError(aMsg: string, aData?: any): void {
        LogMng.error(`ShipEnergyViewer: ${aMsg}`, aData);
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

    update(dt: number) {
        this._objects.forEach(obj => {
            let bar = this._bars.get(obj.objId);
            let p = obj.hp / obj.maxHp;
            bar.progress = p;
            bar.position.x = obj.position.x;
            bar.position.y = obj.position.y;
            bar.position.z = obj.position.z + obj.radius + 1;
        });
    }

}