import gsap from 'gsap';
import * as THREE from 'three';

const START_COLOR = {
    r: 1,
    g: 0,
    b: 0
};

const FINAL_COLOR = {
    r: 1,
    g: 0,
    b: 0
};

type FlyLineParams = {
    color?: number;
};

export class PlanetAimLine {

    private _params: FlyLineParams;
    private _parent: THREE.Object3D;
    private _positions: THREE.Vector3[];
    private _curve: THREE.LineCurve3;

    private _geometry: THREE.BufferGeometry;
    private _lines: THREE.LineSegments;
    private _alphaTween: gsap.core.Tween;

    constructor(aParent: THREE.Object3D, aPos1: THREE.Vector3, aPos2: THREE.Vector3, aParams?: FlyLineParams) {
        
        this._params = aParams;
        this._parent = aParent;
        this._positions = [aPos1, aPos2];

        // create curve
        this._curve = new THREE.LineCurve3(
            this._positions[0],
            this._positions[1]
        );

        const positions = [];
        const colors = [];
        const pointsCnt = 2;

        for (let i = 0; i < pointsCnt; i++) {

            let x = this._positions[i].x;
            let y = this._positions[i].y;
            let z = this._positions[i].z;

            // positions

            positions.push(x, y, z);

            // colors

            let t = i / (pointsCnt - 1);
            let clr = {
                r: START_COLOR.r + t * (FINAL_COLOR.r - START_COLOR.r),
                g: START_COLOR.g + t * (FINAL_COLOR.g - START_COLOR.g),
                b: START_COLOR.b + t * (FINAL_COLOR.b - START_COLOR.b)
            };
            colors.push(clr.r);
            colors.push(clr.g);
            colors.push(clr.b);
            colors.push(0);

        }

        this._geometry = new THREE.BufferGeometry();
        this._geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this._geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));

        let _mat = new THREE.LineBasicMaterial({
            // color: 0xb2dcff,
            linewidth: 4,
            vertexColors: true,
            transparent: true,
            depthWrite: false
        });
        this._lines = new THREE.LineSegments(this._geometry, _mat);
        this._parent.add(this._lines);
        
    }

    private stopAlphaTween() {
        this._alphaTween?.kill();
    }

    show() {
        this.stopAlphaTween();

        let clrAttr = this._geometry.getAttribute('color');
        let colors: number[] = clrAttr.array as any;
        let currAlpha = {
            a: colors[3]
        };
        
        this._alphaTween = gsap.to(currAlpha, {
            a: 1,
            duration: .5,
            ease: 'sine.inOut',
            onUpdate: () => {
                colors[3] = currAlpha.a;
                clrAttr.needsUpdate = true;
            }
        });
    }

    hide() {
        this.stopAlphaTween();

        let clrAttr = this._geometry.getAttribute('color');
        let colors: number[] = clrAttr.array as any;
        let currAlpha = {
            a: colors[3]
        };

        this._alphaTween = gsap.to(currAlpha, {
            a: 0,
            duration: .5,
            ease: 'sine.inOut',
            onUpdate: () => {
                colors[3] = currAlpha.a;
                clrAttr.needsUpdate = true;
            }
        });
    }

    free() {
        this._parent.remove(this._lines);
        this._lines = null;
        this._geometry = null;

        this._curve = null;
        this._positions = [];
        this._params = null;
        this._parent = null;
    }
    
    update(dt: number) {

    }

}