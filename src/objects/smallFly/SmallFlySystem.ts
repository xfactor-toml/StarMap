import * as THREE from 'three';
import { MyMath } from '../../utils/MyMath';
import { SmallFlyLine } from './SmallFlyLine';


export class SmallFlySystem {

    private _parent: THREE.Object3D;
    private _starPositions: THREE.Vector3[];
    private _lines: SmallFlyLine[];

    private _timerSpawn = 0;
    private _activeSpawn = true;


    constructor(aParent: THREE.Object3D, aStarPositions: THREE.Vector3[]) {
        this._parent = aParent;
        this._starPositions = aStarPositions;
        this._lines = [];
    }
    
    public get activeSpawn(): boolean {
        return this._activeSpawn;
    }

    public set activeSpawn(v: boolean) {
        this._activeSpawn = v;
    }

    private spawn() {
        if (this._starPositions?.length <= 0) return;
        let starId1 = MyMath.randomIntInRange(0, this._starPositions.length - 1);
        let starId2 = MyMath.randomIntInRange(0, this._starPositions.length - 1);
        let pos1 = this._starPositions[starId1];
        let pos2 = this._starPositions[starId2];
        let dist = pos1.distanceTo(pos2);

        while (starId1 == starId2 || dist < 120) {
            starId2 = MyMath.randomIntInRange(0, this._starPositions.length - 1);
            pos2 = this._starPositions[starId2];
            dist = pos1.distanceTo(pos2);
        }
        let fly = new SmallFlyLine(this._parent, pos1, pos2, {
            spd: MyMath.randomInRange(0.3, 0.4) * 2.5,
            pointsCnt: MyMath.randomIntInRange(14, 16)
        });
        this._lines.push(fly);
    }

    update(dt: number) {

        this._timerSpawn -= dt;

        for (let i = this._lines.length - 1; i >= 0; i--) {
            const line = this._lines[i];
            line.update(dt);
            if (line.isComplete) {
                line.free();
                this._lines.splice(i, 1);
            }
        }

        if (this._activeSpawn && this._timerSpawn <= 0) {
            this._timerSpawn = MyMath.randomInRange(0.2, 2);
            this.spawn();
        }

    }
    
}