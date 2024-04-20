import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from "three/examples/jsm/loaders/FontLoader";
import { ThreeLoader } from '../utils/threejs/ThreeLoader';
import gsap from 'gsap';
import { MyMath } from '../utils/MyMath';
// import { TextGeometry } from 'three/examples/jsm/';

export class DamageNumber {
    private _camera: THREE.Camera;
    private _mesh: THREE.Mesh;

    constructor(aParams: {
        parent: THREE.Group,
        camera: THREE.Camera,
        position: THREE.Vector3,
        text: string,
        color?: number,
        size?: number
    }) {
        this._camera = aParams.camera;
        let f = ThreeLoader.getInstance().getFont('Exo2-Medium');
        const geometry = new TextGeometry(aParams.text, {
            font: f,
            size: aParams.size || 2,
            height: 0.1
        });
        const material = new THREE.MeshBasicMaterial({ color: aParams.color || 0xff0000 });
        this._mesh = new THREE.Mesh(geometry, material);
        this._mesh.position.copy(aParams.position);
        this._mesh.position.y += 2;
        aParams.parent.add(this._mesh);
    }

    animate(aDir: 1 | -1) {
        const az = MyMath.randomInRange(0, Math.PI / 4);
        const long = MyMath.randomInRange(0, Math.PI * 2);
        const r = 6;
        const newY = this._mesh.position.y + Math.sin(az) * r;
        const newX = this._mesh.position.x + Math.cos(long) * r;
        const newZ = this._mesh.position.z + Math.sin(long) * r;
        gsap.to(this._mesh.position, {
            x: newX,
            y: newY,
            z: newZ,
            duration: 1,
            ease: 'sine.Out',
            onUpdate: () => {
                this._mesh.quaternion.copy(this._camera.quaternion);
            },
            onComplete: () => {
                this.dispose();
            }
        });
    }

    dispose() {
        this._mesh.parent?.remove(this._mesh);
    }


}