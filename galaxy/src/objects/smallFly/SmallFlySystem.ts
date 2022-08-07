import * as THREE from 'three';
import { MyMath } from '../../utils/MyMath';
import { SmallFlyLine } from './SmallFlyLine';

const TIME_SPAWN = 5;

export class SmallFlySystem {

    private _parent: THREE.Object3D;
    private _starPositions: THREE.Vector3[];
    private _lines: SmallFlyLine[];

    private _timerSpawn = 0;


    constructor(aParent: THREE.Object3D, aStarPositions: THREE.Vector3[]) {
        this._parent = aParent;
        this._starPositions = aStarPositions;
        this._lines = [];
    }

    private spawn() {
        let starId1 = MyMath.randomIntInRange(0, this._starPositions.length - 1);
        let starId2 = MyMath.randomIntInRange(0, this._starPositions.length - 1);
        while (starId1 == starId2) starId2 = MyMath.randomIntInRange(0, this._starPositions.length - 1);
        let fly = new SmallFlyLine(this._parent, this._starPositions[starId1], this._starPositions[starId2], {
            spd: MyMath.randomInRange(0.2, 0.5),
            lineCnt: MyMath.randomIntInRange(4, 10)
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

        if (this._timerSpawn <= 0) {
            this._timerSpawn = MyMath.randomInRange(1, 3);
            this.spawn();
        }

    }
    
}