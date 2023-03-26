import * as THREE from 'three';
import { QTPoint } from '../systems/QuadTree';
import { StarPoint } from "../objects/StarPoint";
import { GalaxyStarParams } from '../scenes/Galaxy';

export class StarPointsMng {

    private _parent: THREE.Object3D;
    private _camera: THREE.PerspectiveCamera;
    // private starPointPool: StarPoint[];
    private starPoints: StarPoint[];

    constructor(aParams: {
        parent: THREE.Object3D,
        poolSize: number,
        camera: THREE.PerspectiveCamera
    }) {
        this._parent = aParams.parent;
        this._camera = aParams.camera;
        // this.starPointPool = [];
        this.starPoints = [];
    }

    updatePoints(aPoints: QTPoint[]) {

        let ids = [];
        let pDatas: GalaxyStarParams[] = [];
        // let newIds = [];

        for (let i = 0; i < aPoints.length; i++) {
            const p = aPoints[i];
            let starParams = p.data.starData as GalaxyStarParams;
            // if (this.starPoints[starParams.id]) continue;
            ids.push(starParams.id);
            pDatas.push(starParams);
        }

        // destroy points
        for (let i = this.starPoints.length - 1; i >= 0; i--) {
            const p = this.starPoints[i];
            let idPos = ids.indexOf(p.params.starId);
            if (idPos >= 0) {
                p.update();
                // stay point, remove id
                ids.splice(idPos, 1);
                pDatas.splice(idPos, 1);
            }
            else {
                // destroy
                this.starPoints.splice(i, 1);
                this._parent.remove(p);
                p.destroy();
            }
        }

        // add new points
        for (let i = 0; i < ids.length; i++) {
            let pd = pDatas[i];
            let starPointSprite = new StarPoint({
                name: 'starPoint',
                starId: pd.id,
                baseScale: 6,
                camera: this._camera,
                maxAlpha: .7
            });
            starPointSprite.position.set(pd.pos.x, pd.pos.y, pd.pos.z);
            this.starPoints.push(starPointSprite);
            this._parent.add(starPointSprite);
        }

    }

    // update(dt: number) {
    //     for (let i = this.starPoints.length - 1; i >= 0; i--) {
    //         const p = this.starPoints[i];
    //         p.update();
    //     }
    // }

}