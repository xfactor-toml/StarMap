import * as THREE from 'three';
import { MyMath } from '../utils/MyMath';
import { GalaxyStarParams } from '~/game/data/Types';

export class QTPoint {
    x: number;
    y: number;
    data?: {
        starData: GalaxyStarParams
    };

    constructor(x: number, y: number, data?: {
        starData: GalaxyStarParams
    }) {
        this.x = x;
        this.y = y;
        this.data = data;
    }
}

export class QTRect {
    private _leftTop: QTPoint;
    private _rightBot: QTPoint;
    private _x: number;
    private _y: number;
    private _w: number;
    private _h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._leftTop = new QTPoint(this._x - this._w / 2, this._y - this._h / 2);
        this._rightBot = new QTPoint(this._x + this._w / 2, this._y + this._h / 2);
    }

    public get x(): number {
        return this._x;
    }
    public get y(): number {
        return this._y;
    }
    public get w(): number {
        return this._w;
    }
    public get h(): number {
        return this._h;
    }

    public get leftTop(): QTPoint {
        return this._leftTop;
    }

    public get rightBot(): QTPoint {
        return this._rightBot;
    }

    isPointContains(p: QTPoint): boolean {
        let lt = this.leftTop;
        let rb = this.rightBot;
        return p.x >= lt.x && p.y >= lt.y && p.x <= rb.x && p.y <= rb.y;
    }

    isRectContains(r: QTRect): boolean {
        return (
            this.leftTop.x <= r.leftTop.x
            && this.leftTop.y <= r.leftTop.y 
            && this.rightBot.x >= r.rightBot.x 
            && this.rightBot.y >= r.rightBot.y 
        );
    }

    /**
     * Is this Rect overlap the 2nd Rect
     * @param r 2nd Rect
     * @returns overlap?
     */
    intersectRect(r2: QTRect): boolean {
        return !(
            this.rightBot.x < r2.leftTop.x 
            || this.leftTop.x > r2.rightBot.x 
            || this.leftTop.y > r2.rightBot.y 
            || this.rightBot.y < r2.leftTop.y 
        );
    }

    intersectCircle(aCircle: QTCircle): boolean {
        return this.intersectRect(aCircle.boundingRect);
    }

    getLeftTopRect(): QTRect {
        return new QTRect(this._x - this._w / 4, this._y - this._h / 4, this._w / 2, this._h / 2);
    }
    getLeftBotRect(): QTRect {
        return new QTRect(this._x - this._w / 4, this._y + this._h / 4, this._w / 2, this._h / 2);
    }
    getRightTopRect(): QTRect {
        return new QTRect(this._x + this._w / 4, this._y - this._h / 4, this._w / 2, this._h / 2);
    }
    getRightBotRect(): QTRect {
        return new QTRect(this._x + this._w / 4, this._y + this._h / 4, this._w / 2, this._h / 2);
    }

}

export class QTCircle {
    private _boundingRect: QTRect;
    private _x: number;
    private _y: number;
    private _r: number;
    private _d: number;

    constructor(x: number, y: number, r: number) {
        this._x = x;
        this._y = y;
        this._r = r;
        this._d = r * 2;
        this._boundingRect = new QTRect(x, y, this._d, this._d);
    }

    public get x(): number {
        return this._x;
    }
    public get y(): number {
        return this._y;
    }
    public get r(): number {
        return this._r;
    }
    public get d(): number {
        return this._d;
    }
    public get boundingRect(): QTRect {
        return this._boundingRect;
    }

    isPointContains(p: QTPoint): boolean {
        return MyMath.isPointInCircle(p.x, p.y, this._x, this._y, this._r);
    }

    intersectCircle(c: QTCircle): boolean {
        return MyMath.isCirclesIntersect(this._x, this._y, this._r, c.x, c.y, c.r);
    }

}

export class QuadTree {
    private _id: number;
    private _boundary: QTRect;
    private _capacity = 4;
    private _points: QTPoint[];
    private _devided = false;
    private _children: QuadTree[];

    constructor(aBoundary: QTRect, aCapacity: number, id = 0) {
        this._id = id;
        this._boundary = aBoundary;
        this._capacity = aCapacity;
        this._points = [];
        this._devided = false;
        this._children = [];
    }

    private subdevide() {
        for (let i = 0; i < 4; i++) {
            let rect: QTRect;
            switch (i) {
                case 0:
                    rect = this._boundary.getLeftTopRect();
                    break;
                case 1:
                    rect = this._boundary.getRightTopRect();
                    break;
                case 2:
                    rect = this._boundary.getLeftBotRect();
                    break;
                case 3:
                    rect = this._boundary.getRightBotRect();
                    break;
            }
            let qt = new QuadTree(rect, this._capacity, this._id + i);
            this._children.push(qt);
        }
        this._devided = true;
    }

    private addPointToSubNodes(aPoint: QTPoint): boolean {
        for (let i = 0; i < this._children.length; i++) {
            if (this._children[i].addPoint(aPoint)) return true;
        }
        return false;
    }

    addPoint(aPoint: QTPoint): boolean {

        if (!this._boundary.isPointContains(aPoint)) {
            return false;
        }

        if (this._points.length < this._capacity && !this._devided) {
            this._points.push(aPoint);
            return true;
        }
        else {
            if (!this._devided) {
                this.subdevide();
                // move all points to sub nodes
                for (let i = 0; i < this._points.length; i++) {
                    const p = this._points[i];
                    this.addPointToSubNodes(p);
                }
                this._points = [];
            }
            return this.addPointToSubNodes(aPoint);
        }
    }

    getAllBoundaries(): QTRect[] {
        let res: QTRect[] = [];
        if (this._devided) {
            for (let i = 0; i < this._children.length; i++) {
                res = res.concat(this._children[i].getAllBoundaries());
            }
        }
        else {
            res.push(this._boundary);
        }
        return res;
    }

    getPointsInRect(aRect: QTRect): QTPoint[] {
        let res: QTPoint[] = [];

        if (this._devided) {
            for (let i = 0; i < this._children.length; i++) {
                res = res.concat(this._children[i].getPointsInRect(aRect));
            }
        }
        else if (this._boundary.intersectRect(aRect)) {
            for (let i = 0; i < this._points.length; i++) {
                const p = this._points[i];
                if (aRect.isPointContains(p)) res.push(p);
            }
        }

        return res;
    }

    getPointsInCircle(aCircle: QTCircle, params?: {
        levels?: number[],
        name?: string
    }): QTPoint[] {
        let res: QTPoint[] = [];

        if (this._devided) {
            for (let i = 0; i < this._children.length; i++) {
                res = res.concat(this._children[i].getPointsInCircle(aCircle));
            }
        }
        else if (this._boundary.intersectCircle(aCircle)) {
            for (let i = 0; i < this._points.length; i++) {
                const p = this._points[i];
                const starInfo = p.data.starData.starInfo;
                if (params?.levels?.indexOf(starInfo.level) < 0) continue;
                if (params?.name?.length > 0 && !starInfo.name.includes(params.name)) continue;
                if (aCircle.isPointContains(p)) res.push(p);
            }
        }

        return res;
    }

    free() {
        this._boundary = null;
        this._points = [];
        this._children = [];
    }

}

export class QTDebugRender extends THREE.Group {
    private _qt: QuadTree;
    private _material: THREE.Material;
    private _lines: THREE.Line[];

    constructor() {
        super();
        this._lines = [];
        this._material = new THREE.LineBasicMaterial({ vertexColors: true });
    }

    
    public set quadtree(v: QuadTree) {
        this._qt = v;
    }

    clear(): this {
        super.clear();
        this._lines = [];
        return this;
    }

    render() {

        this.clear();

        if (!this._qt) return;

        let boundaries = this._qt.getAllBoundaries();

        for (let i = 0; i < boundaries.length; i++) {
            let b = boundaries[i];

            // 4 lines

            let geometry = new THREE.BufferGeometry();
            let line = new THREE.Line(geometry, this._material);
            this.add(line);
            this._lines.push(line);

            // positions
            let positions: number[] = [];
            positions.push(b.leftTop.x, 0, b.rightBot.y);
            positions.push(b.leftTop.x, 0, b.leftTop.y);
            positions.push(b.rightBot.x, 0, b.leftTop.y);
            positions.push(b.rightBot.x, 0, b.rightBot.y);
            positions.push(b.leftTop.x, 0, b.rightBot.y);

            // colors
            let colors: number[] = [];
            colors.push(1, 1, 1);
            colors.push(1, 1, 1);
            colors.push(1, 1, 1);
            colors.push(1, 1, 1);
            colors.push(1, 1, 1);

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        }

    }

}
