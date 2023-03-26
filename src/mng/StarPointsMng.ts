import * as THREE from 'three';
import { QTPoint } from '../systems/QuadTree';
import { StarPoint } from "../objects/StarPoint";
import { GalaxyStarParams } from '../scenes/Galaxy';

export class StarPointsMng {

    private _parent: THREE.Object3D;
    private _camera: THREE.PerspectiveCamera;
    private _starPoints: StarPoint[];

    constructor(aParams: {
        parent: THREE.Object3D,
        poolSize: number,
        camera: THREE.PerspectiveCamera
    }) {
        this._parent = aParams.parent;
        this._camera = aParams.camera;
        this._starPoints = [];
    }

    updatePoints(aPoints: QTPoint[]) {

        let ids = [];
        let pDatas: GalaxyStarParams[] = [];

        for (let i = 0; i < aPoints.length; i++) {
            const p = aPoints[i];
            let starParams = p.data.starData as GalaxyStarParams;
            ids.push(starParams.id);
            pDatas.push(starParams);
        }

        // destroy points
        for (let i = this._starPoints.length - 1; i >= 0; i--) {
            const p = this._starPoints[i];
            let idPos = ids.indexOf(p.params.starParams.id);
            if (idPos >= 0) {
                p.update();
                // stay point, remove id
                ids.splice(idPos, 1);
                pDatas.splice(idPos, 1);
            }
            else {
                // destroy
                this._starPoints.splice(i, 1);
                this._parent.remove(p);
                p.destroy();
            }
        }

        // add new points
        for (let i = 0; i < ids.length; i++) {
            let starParams = pDatas[i];
            let starPointSprite = new StarPoint({
                // name: 'starPoint',
                // starId: pd.id,
                baseScale: 6,
                camera: this._camera,
                maxAlpha: .7,
                starParams: starParams
            });
            starPointSprite.position.set(starParams.pos.x, starParams.pos.y, starParams.pos.z);
            this._starPoints.push(starPointSprite);
            this._parent.add(starPointSprite);
        }

    }

    hidePoints(aDur) {
        for (let i = 0; i < this._starPoints.length; i++) {
            const p = this._starPoints[i];
            p.hide(aDur);
        }
    }

    showPoints(aDur, aDelay) {
        for (let i = 0; i < this._starPoints.length; i++) {
            const p = this._starPoints[i];
            p.show(aDur, aDelay);
        }
    }

    // update(dt: number) {
    //     for (let i = this.starPoints.length - 1; i >= 0; i--) {
    //         const p = this.starPoints[i];
    //         p.update();
    //     }
    // }

}