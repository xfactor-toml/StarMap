export type Point = {
    x: number;
    y: number;
};

export class RectABCD {
    a: Point;
    b: Point;
    c: Point;
    d: Point;
    constructor(a: Point, b: Point, c: Point, d: Point) {
        this.a = a; this.b = b; this.c = c; this.d = d;
    }
}

export class MyMath {

    public static randomInRange(aMin: number, aMax: number, auto = false): number {
        if (auto && aMin > aMax) {
            var tmp = aMin;
            aMin = aMax;
            aMax = tmp;
        }
        return Math.random() * Math.abs(aMax - aMin) + aMin;
    }

    public static randomIntInRange(aMin: number, aMax: number): number {
        return Math.round(MyMath.randomInRange(aMin, aMax));
    }

    public static shuffleArray(mas: any[], factor = 4) {
        for (let i = 0; i < mas.length * factor; i++) {
            const id1 = this.randomIntInRange(0, mas.length - 1);
            const id2 = this.randomIntInRange(0, mas.length - 1);
            let item = mas[id1];
            mas[id1] = mas[id2];
            mas[id2] = item;
        }
    }

    public static clamp(x, min, max): number {
        return Math.min(Math.max(x, min), max);
    }

    public static sat(x: number): number {
        return this.clamp(x, 0, 1);
    }

    public static lerp(t, a, b): number {
        return a + (b - a) * t;
    }

    public static toRadian(aDeg: number): number {
        return aDeg * Math.PI / 180;
    }

    public static toDeg(aRad: number): number {
        return aRad * 180 / Math.PI;
    }

    public static easeInOutSine(t: number): number {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    public static easeOutCirc(x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }

    public static easeInExpo(x: number): number {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    }

    /**
     * Convert a hex string (#FFAA22 or #FA2) to RGB
     * @param aHexColorStr 
     * @returns 
     */
    public static strHexToRGB(aHexColorStr: string): { r: number, g: number, b: number } {
        //LogMng.debug(`aHexColorStr: ${aHexColorStr}`);

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        // let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        // let newHexColor = aHexColorStr.replace(shorthandRegex, function (m, r, g, b) {
        //     return r + r + g + g + b + b;
        // });
        // LogMng.debug(`newHexColor: ${newHexColor}`);

        // let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHexColor);
        // LogMng.debug(`result: ${result}`);

        let newHex = aHexColorStr.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b);
        //LogMng.debug(`newHex: ${newHex}`);

        let res: number[] = newHex.substring(1).match(/.{2}/g).map(x => parseInt(x, 16));
        //LogMng.debug(`res: ${res}`);
        //console.log(res);

        return res ? {
            r: res[0],
            g: res[1],
            b: res[2]
        } : null;
    }

    /**
     * Convert hex num (0x2266FF) to RGB
     * @param aHexNum 
     * @returns 
     */
    public static hexToRGB(aHexNum: number): { r: number, g: number, b: number } {
        let res = {
            r: (aHexNum >> 16) & 255,
            g: (aHexNum >> 8) & 255,
            b: aHexNum & 255
        };
        return res;
    }

    /**
     * 
     * @param c number in 0-255 format
     * @returns 
     */
    static byteToHex(c: number) {
        let hex = c.toString(16);
        //LogMng.debug(`componentToHex: c = ${c}, hex = ${hex}`);
        return hex.length == 1 ? "0" + hex : hex;
    }

    /**
     * Convert RGB to Hex string
     * @param r Red in format 0 - 255
     * @param g Green in format 0 - 255
     * @param b Blue in format 0 - 255
     * @returns 
     */
    public static rgbToHexStr(r: number, g: number, b: number) {
        return "#" + this.byteToHex(r) + this.byteToHex(g) + this.byteToHex(b);
    }

    /**
   * Convert RGB to Hex
   * @param r Red in format 0 - 255
   * @param g Green in format 0 - 255
   * @param b Blue in format 0 - 255
   * @returns 
   */
    public static rgbToHex(r: number, g: number, b: number) {
        return (Math.floor(r) << 16) + (Math.floor(g) << 8) + Math.floor(b);
    }

    public static getVectorLength(x1: number, y1: number, x2: number, y2: number): number {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Find the angle of a segment from (x1, y1) -> (x2, y2).
     * @function Phaser.Math.Angle.Between
     * @param {number} x1 - The x coordinate of the first point.
     * @param {number} y1 - The y coordinate of the first point.
     * @param {number} x2 - The x coordinate of the second point.
     * @param {number} y2 - The y coordinate of the second point.
     *
     * @return {number} The angle in radians.
     */
    public static angleBetween(x1: number, y1: number, x2: number, y2: number) {
        return Math.atan2(y2 - y1, x2 - x1);
    };

    public static IsPointInTriangle(ax, ay, bx, by, cx, cy, px, py: number): boolean {
        var b0x, b0y, c0x, c0y, p0x, p0y: number;
        var m, l: number; // мю и лямбда
        var res = false;
        // переносим треугольник точкой А в (0;0).
        b0x = bx - ax; b0y = by - ay;
        c0x = cx - ax; c0y = cy - ay;
        p0x = px - ax; p0y = py - ay;
        //
        m = (p0x * b0y - b0x * p0y) / (c0x * b0y - b0x * c0y);
        if (m >= 0 && m <= 1) {
            l = (p0x - m * c0x) / b0x;
            if (l >= 0 && (m + l) <= 1)
                res = true;
        }
        return res;
    }

    public static isPointInRect(rect: RectABCD, p: Point): boolean {
        return MyMath.IsPointInTriangle(rect.a.x, rect.a.y, rect.b.x, rect.b.y, rect.c.x, rect.c.y, p.x, p.y) &&
            MyMath.IsPointInTriangle(rect.c.x, rect.c.y, rect.d.x, rect.d.y, rect.a.x, rect.a.y, p.x, p.y);
    }

    public static isPointInCircle(x: number, y: number, cx: number, cy: number, r: number): boolean {
        return MyMath.getVectorLength(x, y, cx, cy) <= r;
    }

    public static isCirclesIntersect(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): boolean {
        return MyMath.getVectorLength(x1, y1, x2, y2) <= r1 + r2;
    }

}

export class LinearSpline {
    private _points = [];
    private _lerp: Function;

    constructor(lerp: Function) {
        this._points = [];
        this._lerp = lerp;
    }

    addPoint(t: number, val) {
        this._points.push([t, val]);
    }

    get(t: number) {
        let p1 = 0;

        for (let i = 0; i < this._points.length; i++) {
            const p = this._points[i];
            if (p[0] >= t) {
                break;
            }
            p1 = i;
        }

        const p2 = Math.min(this._points.length - 1, p1 + 1);

        if (p1 == p2) {
            return this._points[p1][1];
        }

        return this._lerp(
            (t - this._points[p1][0]) / (this._points[p2][0] - this._points[p1][0]),
            this._points[p1][1],
            this._points[p2][1]
        );
    }

}