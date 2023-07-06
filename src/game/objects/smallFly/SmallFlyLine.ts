import * as THREE from 'three';

const START_COLOR = {
    r: 1,
    g: 1,
    b: 1
};

const FINAL_COLOR = {
    r: 0.4,
    g: 0.6,
    b: 1
};

type FlyLineParams = {
    spd: number;
    pointsCnt: number;
    color?: string;
};

export class SmallFlyLine {

    private _params: FlyLineParams;
    private _parent: THREE.Object3D;
    private _pos1: THREE.Vector3;
    private _pos2: THREE.Vector3;
    private _curve: THREE.QuadraticBezierCurve3;

    private _geometry: THREE.BufferGeometry;
    private _posAttr: any;
    private _lines: THREE.LineSegments;

    private _isComplete = false;

    private _time = 0;


    constructor(aParent: THREE.Object3D, aPos1: THREE.Vector3, aPos2: THREE.Vector3, aParams: FlyLineParams) {
        
        this._params = aParams;
        this._parent = aParent;
        this._pos1 = aPos1;
        this._pos2 = aPos2;

        let midPos = this._pos1.clone().add(this._pos2).multiplyScalar(0.5);
        midPos.y += (Math.random() - 0.5) * 50;

        // create curve
        this._curve = new THREE.QuadraticBezierCurve3(
            this._pos1,
            midPos,
            this._pos2
        );

        const positions = [];
        const colors = [];

        for (let i = 0; i < this._params.pointsCnt; i++) {

            let x = this._pos1.x;
            let y = this._pos1.y;
            let z = this._pos1.z;

            // positions

            positions.push(x, y, z);
            positions.push(x, y, z);

            // colors

            let t = i / (this._params.pointsCnt - 1);
            let clr = {
                r: START_COLOR.r + t * (FINAL_COLOR.r - START_COLOR.r),
                g: START_COLOR.g + t * (FINAL_COLOR.g - START_COLOR.g),
                b: START_COLOR.b + t * (FINAL_COLOR.b - START_COLOR.b)
            };
            colors.push(clr.r);
            colors.push(clr.g);
            colors.push(clr.b);
            colors.push(1 - t);

            colors.push(clr.r);
            colors.push(clr.g);
            colors.push(clr.b);
            colors.push(1 - t);

        }

        this._geometry = new THREE.BufferGeometry();
        this._geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this._geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));

        this._posAttr = this._geometry.getAttribute('position');

        let _mat = new THREE.LineBasicMaterial({
            // color: 0xb2dcff,
            linewidth: 4,
            vertexColors: true,
            transparent: true,
            depthWrite: false
        });
        this._lines = new THREE.LineSegments(this._geometry, _mat);
        this._parent.add(this._lines);
        
        this._time = 0;

    }

    public get isComplete(): boolean {
        return this._isComplete;
    }

    free() {
        this._parent.remove(this._lines);
        this._lines = null;
        this._geometry = null;

        this._curve = null;
        this._pos1 = null;
        this._pos2 = null;
        this._params = null;
        this._parent = null;
    }
    
    update(dt: number) {

        const f = 0.02;

        this._time += dt * this._params.spd;
        if (this._time - this._params.pointsCnt * f >= 1) {
            this._time = 1;
            this._isComplete = true;
        }

        // this._obj.position.copy(this._curve.getPoint(this._time));
        let pa: number[] = this._geometry.getAttribute('position').array as any;
        
        for (let i = 0; i < this._params.pointsCnt; i++) {
            let t1 = this._time - i * f;
            if (t1 < 0) t1 = 0;
            if (t1 > 1) t1 = 1;
            let t2 = this._time - (i + 1) * f;
            if (t2 < 0) t2 = 0;
            if (t2 > 1) t2 = 1;

            let pos1 = this._curve.getPoint(t1);
            let pos2 = this._curve.getPoint(t2);

            // line start
            pa[6 * i + 0] = pos1.x;
            pa[6 * i + 1] = pos1.y;
            pa[6 * i + 2] = pos1.z;
            // line end
            pa[6 * i + 3] = pos2.x;
            pa[6 * i + 4] = pos2.y;
            pa[6 * i + 5] = pos2.z;
        }

        this._posAttr.needsUpdate = true;

    }

}