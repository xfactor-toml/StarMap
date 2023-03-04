import * as THREE from 'three';
import { Settings } from '../data/Settings';
import { BigStar, BigStarParams } from './BigStar';
import { BigStar2 } from './BigStar2';


export type SolarSystemParams = {
    starParams: BigStarParams;
};

export class SolarSystem extends THREE.Group {
    private _camera: THREE.Camera;
    private _starScale: number;
    private params: SolarSystemParams;
    private star: BigStar2;
        
    constructor(aCamera: THREE.Camera, aStarScale: number, aParams: SolarSystemParams) {
        super();
        this._camera = aCamera;
        this._starScale = aStarScale;
        this.params = aParams;
        this.createStar();
    }
    
    private createStar() {
        this.star = new BigStar2(this.position, this._camera, this._starScale, this.params.starParams);
        if (Settings.isDebugMode) {
            this.star.createDebugGui(Settings.datGui);
        }
        this.add(this.star);
    }
    
    public get starScale(): number {
        return this._starScale;
    }

    public set starScale(v: number) {
        this._starScale = v;
        if (this.star) this.star.starScale = v;
    }

    free() {
        this.remove(this.star);
        this.star.free();
        this.star = null;
        this.params = null;
    }

    update(dt: number) {
        if (this.star) this.star.update(dt);
    }

}