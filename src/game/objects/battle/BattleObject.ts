import * as THREE from 'three';
import { MyObject3D } from "~/game/basics/MyObject3D";

export class BattleObject extends MyObject3D {
    private _objId: string;
    
    constructor(aId: string, aClassName?: string) {
        super(aClassName || 'BattleObject');
        this._objId = aId;
    }

    public get objId(): string {
        return this._objId;
    }
    
}