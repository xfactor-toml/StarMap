import * as THREE from 'three';
import { MyMath } from '../../utils/MyMath';


type FlyLineParams = {
    spd: number;
    lineCnt: number;
    color?: string;
};

export class SmallFlyLine {

    private _params: FlyLineParams;
    private _parent: THREE.Object3D;
    private _pos1: THREE.Vector3;
    private _pos2: THREE.Vector3;
    private _curve: THREE.QuadraticBezierCurve3;
    // private _obj: THREE.Mesh;

    private geom: THREE.BufferGeometry;
    private pos: any;
    private pa: any;
    private _lines: THREE.LineSegments;

    private _isComplete = false;

    private _time = 0;


    constructor(aParent: THREE.Object3D, aPos1: THREE.Vector3, aPos2: THREE.Vector3, aParams: FlyLineParams) {
        
        this._params = aParams;
        this._parent = aParent;
        this._pos1 = aPos1;
        this._pos2 = aPos2;

        let midPos = this._pos1.clone().add(this._pos2).multiplyScalar(0.5);
        midPos.y += (Math.random() - 0.5) * 70;

        // create curve
        this._curve = new THREE.QuadraticBezierCurve3(
            this._pos1,
            midPos,
            this._pos2
        );

        this.geom = new THREE.BufferGeometry();
        this.geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6 * this._params.lineCnt), 3));
        // this.geom.setAttribute('velocity', new THREE.BufferAttribute(new Float32Array(2 * this._params.lineCnt), 1));
        this.pos = this.geom.getAttribute('position');
        this.pa = this.pos.array;
        // this.vel = this.geom.getAttribute('velocity');
        // this.va = this.vel.array;
        
        for (let i = 0; i < this._params.lineCnt; i++) {
            let x = this._pos1.x;
            let y = this._pos1.y;
            let z = this._pos1.z;
            // line start
            this.pa[6 * i] = x;
            this.pa[6 * i + 1] = y;
            this.pa[6 * i + 2] = z;
            // line end
            this.pa[6 * i + 3] = x;
            this.pa[6 * i + 4] = y;
            this.pa[6 * i + 5] = z;
            // spd
            // this.va[2 * i] = this.va[2 * i + 1] = 0;
        }

        let _mat = new THREE.LineBasicMaterial({ color: 0xffffff });
        this._lines = new THREE.LineSegments(this.geom, _mat);
        this._parent.add(this._lines);

        // debug draw path
        // const points = this._curve.getPoints(20);
        // const geometry = new THREE.BufferGeometry().setFromPoints(points);
        // const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        // const curveObject = new THREE.Line(geometry, material);
        // this._parent.add(curveObject);

        // let geom = new THREE.SphereGeometry(1);
        // let mat = new THREE.LineBasicMaterial({ color: 0xff0000 });
        // this._obj = new THREE.Mesh(geom, mat);
        // this._obj.position.copy(this._pos1);
        // this._parent.add(this._obj);
        
        this._time = 0;

    }

    public get isComplete(): boolean {
        return this._isComplete;
    }

    free() {
        // this._parent.remove(this._obj);
        // this._obj = null;
        this._parent.remove(this._lines);
        this._lines = null;
        this.geom = null;
        this.pos = null;
        this.pa = null;

        this._curve = null;
        this._pos1 = null;
        this._pos2 = null;
        this._params = null;
        this._parent = null;
    }
    
    update(dt: number) {

        const f = 0.01;

        this._time += dt * this._params.spd;
        if (this._time - this._params.lineCnt * f >= 1) {
            this._time = 1;
            this._isComplete = true;
        }

        // this._obj.position.copy(this._curve.getPoint(this._time));

        for (let i = 0; i < this._params.lineCnt; i++) {
            let t1 = this._time - i * f;
            if (t1 < 0) t1 = 0;
            if (t1 > 1) t1 = 1;
            let t2 = this._time - (i + 1) * f;
            if (t2 < 0) t2 = 0;
            if (t2 > 1) t2 = 1;

            let pos1 = this._curve.getPoint(t1);
            let pos2 = this._curve.getPoint(t2);

            // line start
            this.pa[6 * i + 0] = pos1.x;
            this.pa[6 * i + 1] = pos1.y;
            this.pa[6 * i + 2] = pos1.z;
            // line end
            this.pa[6 * i + 3] = pos2.x;
            this.pa[6 * i + 4] = pos2.y;
            this.pa[6 * i + 5] = pos2.z;
            // spd
            // this.va[2 * i] = this.va[2 * i + 1] = 0;
        }

        this.pos.needsUpdate = true;

    }

}