import * as THREE from 'three';
import { MyObject3D } from '~/game/basics/MyObject3D';
import { ThreeUtils } from '~/game/utils/threejs/ThreejsUtils';

export class ShipEnergyBar extends MyObject3D {
    protected _mesh: THREE.Mesh;
    private _progress: number;
    
    constructor(aParams?: {
        w?: number,
        color?: number
    }) {
        super('ShipEnergyBar');

        let w = aParams?.w || 2;
        let g = new THREE.BoxGeometry(w, .2, .2);
        let m = new THREE.MeshBasicMaterial({
            color: aParams.color || 0xff0000
        });
        this._mesh = new THREE.Mesh(g, m);
        this.add(this._mesh);

    }

    get progress(): number {
        return this._progress;
    }
    set progress(value: number) {
        this._progress = value;
        this._mesh.scale.x = this._progress;
    }

    free() {
        try {
            if (this._mesh) {
                ThreeUtils.removeAndDispose(this._mesh);
            }
        } catch (error) {
            
        }
        this._mesh = null;
        super.free();
    }

    update(dt: number) {
        
    }

}