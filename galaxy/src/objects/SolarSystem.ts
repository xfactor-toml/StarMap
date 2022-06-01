import * as THREE from 'three';
import { Star } from './Star';

import vsSun from '../shaders/sun1/vs.glsl';
import fsSun from '../shaders/sun1/fs.glsl';
import { Star2 } from './Star2';


export type SolarSystemParams = {
    camera: THREE.PerspectiveCamera;
    starSize: number;
};

export class SolarSystem extends THREE.Group {
    private params: SolarSystemParams;
    private star: Star2;
        
    constructor(aParams: SolarSystemParams) {
        super();
        
        this.params = aParams;

        this.createStar();

    }

    private createStar() {
        
        this.star = new Star2({
            solarSystem: this,
            camera: this.params.camera,
            starSize: this.params.starSize
        });

        this.add(this.star);

    }

    update(dt: number) {
        if (this.star) this.star.update(dt);
    }

}