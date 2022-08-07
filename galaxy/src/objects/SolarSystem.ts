import * as THREE from 'three';
import { BigStar, BigStarParams } from './BigStar';


export type SolarSystemParams = {
    starParams: BigStarParams;
};

export class SolarSystem extends THREE.Group {
    private _camera: THREE.Camera;
    private params: SolarSystemParams;
    private star: BigStar;
        
    constructor(aCamera: THREE.Camera, aParams: SolarSystemParams) {
        super();
        this._camera = aCamera;
        this.params = aParams;
        this.createStar();
    }
    
    private createStar() {
        this.star = new BigStar(this.position, this._camera, this.params.starParams);
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