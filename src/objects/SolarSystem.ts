import * as THREE from 'three';
import { Settings } from '../data/Settings';
import { BigStar2, BigStar2Params } from './BigStar2';
import { GalaxyStarParams } from '~/data/Types';


export type SolarSystemParams = {
    starParams: BigStar2Params;
};

export class SolarSystem extends THREE.Group {
    private _camera: THREE.Camera;
    private _starScale: number;
    private _params: SolarSystemParams;
    private _star: BigStar2;
        
    constructor(aCamera: THREE.Camera, aStarScale: number, aParams: SolarSystemParams) {
        super();
        this._camera = aCamera;
        this._starScale = aStarScale;
        this._params = aParams;
        this.createStar();
    }
    
    private createStar() {
        this._star = new BigStar2(this.position, this._camera, this._starScale, this._params.starParams);
        if (Settings.isDebugMode) {
            this._star.createDebugGui(Settings.datGui);
        }
        this.add(this._star);
    }
    
    public get starScale(): number {
        return this._starScale;
    }

    public set starScale(v: number) {
        this._starScale = v;
        if (this._star) this._star.starScale = v;
    }

    onStarUpdated(aStarParams: GalaxyStarParams) {
        this._star.updateStar({
            galaxyColor: aStarParams.color,
            starSize: aStarParams.starInfo.bigStar.starSize,
            mainColor: aStarParams.starInfo.bigStar.color.main,
            coronaColor: aStarParams.starInfo.bigStar.color.corona
        });
    }

    free() {
        this.remove(this._star);
        this._star.free();
        this._star = null;
        this._params = null;
    }

    update(dt: number) {
        if (this._star) this._star.update(dt);
    }

}