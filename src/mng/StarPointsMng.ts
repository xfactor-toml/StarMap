import * as THREE from 'three';
import { QTPoint } from '../systems/QuadTree';
import { StarPoint } from "../objects/StarPoint";
import { GalaxyStarParams } from '~/data/Types';

export class StarPointsMng {

    private _parent: THREE.Object3D;
    private _camera: THREE.PerspectiveCamera;
    private _cameraTarget: THREE.Vector3;
    private _poolSize: number;
    private _dist: number;
    private _starPoints: StarPoint[];

    constructor(aParams: {
        parent: THREE.Object3D,
        camera: THREE.PerspectiveCamera,
        cameraTarget: THREE.Vector3,
        poolSize: number,
        dist: number
    }) {
        this._parent = aParams.parent;
        this._camera = aParams.camera;
        this._cameraTarget = aParams.cameraTarget;
        this._poolSize = aParams.poolSize;
        this._dist = aParams.dist;
        this._starPoints = [];
    }

    updatePoints(aPoints: QTPoint[], aRadius: number, aIsPhantom: boolean) {

        let ids: number[] = [];
        let points: { 
            id: number,
            dist: number
        }[] = [];
        let pDatas: GalaxyStarParams[] = [];

        // let camDir = new THREE.Vector3();
        // this._camera.getWorldDirection(camDir);
        // camDir.add(this._camera.position);

        for (let i = 0; i < aPoints.length; i++) {
            const p = aPoints[i];
            let starParams = p.data.starData as GalaxyStarParams;
            let pos = new THREE.Vector3(starParams.pos.x, starParams.pos.y, starParams.pos.z);
            let camDist = pos.distanceTo(this._camera.position);
            let centerDist = pos.distanceTo(this._cameraTarget);

            let wPos = pos.clone();
            this._parent.localToWorld(wPos);

            let pDir = new THREE.Vector3();

            pDir.subVectors(wPos, this._camera.position);

            // let dotProduct = camDir.dot(pDir);
            // if (dotProduct >= 0) continue;

            if (centerDist > aRadius) continue;
            points.push({
                id: starParams.id,
                dist: camDist
            });
            pDatas.push(starParams);
        }

        // sort for nearest
        // points.sort((a, b) => {
        //     return a.dist - b.dist;
        // })
        // let iters = Math.min(points.length, this._poolSize);
        let iters = points.length;
        for (let i = 0; i < iters; i++) {
            ids.push(points[i].id);
        }
        
        // destroy points
        for (let i = this._starPoints.length - 1; i >= 0; i--) {
            const p = this._starPoints[i];
            if (!p?.params?.starParams) continue;
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
                p.hide(.5, 0, {
                    context: this,
                    onComplete: () => {
                        this._parent.remove(p);
                        p.destroy();
                    }
                });
            }

        }

        // add new points
        for (let i = 0; i < ids.length; i++) {
            let starParams = pDatas[i];
            let pos = new THREE.Vector3(starParams.pos.x, starParams.pos.y, starParams.pos.z);
            // test
            // if (pos.distanceTo(this._camera.position) > 60) continue;
            let starPointSprite = new StarPoint({
                baseScale: 3,
                camera: this._camera,
                maxAlpha: .7,
                starParams: starParams,
                scaleFactor: 0,
                isPhantom: aIsPhantom
            });
            starPointSprite.position.copy(pos);
            starPointSprite.show(1);
            this._starPoints.push(starPointSprite);
            this._parent.add(starPointSprite);

            // if (i >= this._poolSize) break;

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

}