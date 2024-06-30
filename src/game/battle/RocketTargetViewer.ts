import * as THREE from 'three';
import { ILogger } from '../core/interfaces/ILogger';
import { IUpdatable } from '../core/interfaces/IUpdatable';
import { LogMng } from '../../monax/LogMng';
import { BattleObject } from '../objects/battle/BattleObject';
import { RocketTargetAim } from './RocketTargetAim';
import { RocketPacket } from './Types';

type TargetRecord = {
    targetObject: BattleObject,
    aim: RocketTargetAim,
    data: RocketPacket
}

export class RocketTargetViewer implements ILogger, IUpdatable {

    private _className = 'RocketTargetViewer';
    private _parent: THREE.Group;
    private _records: TargetRecord[];

    constructor(aParent: THREE.Group) {
        this._parent = aParent;
        this._records = [];
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

    private deleteByItemId(aItemId: number) {
        
    }

    createAim(aObject: BattleObject, aData: RocketPacket) {
        let aim = new RocketTargetAim({
            w: aObject.radius * 2
        });

        this._records.push({
            targetObject: aObject,
            aim: aim,
            data: aData
        });

        this._parent.add(aim);
    }

    onObjectDestroy(aObjectId: number) {
        let id = this._records.findIndex(
            item => item.data.targetId == aObjectId
            || item.data.rocketId == aObjectId
        );
        if (id < 0) return;

        let rec = this._records[id];
        if (rec) rec.aim.free();

        this._records.splice(id, 1);
    }

    clear() {
        this._records.forEach(item => item.aim.free());
        this._records = [];
    }

    update(dt: number) {
        this._records.forEach(rec => {
            let aim = rec.aim;
            let obj = rec.targetObject;
            if (!aim) return;
            if (!obj) {
                rec.aim.free();
                rec.aim = null;
                return;
            }
            
            // update position
            try {
                aim.position.x = obj.position.x;
                aim.position.y = obj.position.y + .1;
                aim.position.z = obj.position.z;
                aim.update(dt);
            } catch (error) {
                return;
            }

        });
    }

    free() {
        this.clear();
        this._parent = null;
        this._records = null;
    }

}