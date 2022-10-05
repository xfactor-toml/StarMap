import * as THREE from 'three';
import { Config } from '../data/Config';
import { Params } from '../data/Params';
import { BigStar, BigStarParams } from './BigStar';
import { BigStar2 } from './BigStar2';


export type SolarSystemParams = {
    starParams: BigStarParams;
};

export class SolarSystem extends THREE.Group {
    private _camera: THREE.Camera;
    private params: SolarSystemParams;
    private star: BigStar2;
        
    constructor(aCamera: THREE.Camera, aParams: SolarSystemParams) {
        super();
        this._camera = aCamera;
        this.params = aParams;
        this.createStar();
    }
    
    private createStar() {
        this.star = new BigStar2(this.position, this._camera, this.params.starParams);
        if (Params.isDebugMode) {
            this.star.createDebugGui(Params.datGui);
        }
        this.add(this.star);
    }

    free() {
        this.remove(this.star);
        this.star = null;
        this.params = null;
    }

    update(dt: number) {
        if (this.star) this.star.update(dt);
    }

}