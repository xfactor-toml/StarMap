
export class MyUtils {

    private static queryValues: { [index: string]: string }[] = null;

    private static readQueryValues() {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var vals: any = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof vals[pair[0]] === "undefined") {
                vals[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof vals[pair[0]] === "string") {
                var arr = [vals[pair[0]], decodeURIComponent(pair[1])];
                vals[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                vals[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        this.queryValues = vals;
    }

    /**
     * Get GET value by key
     * @param aValName 
     * @returns 
     */
    public static getQueryValue(aValName: string): any {
        if (this.queryValues == null) this.readQueryValues();
        return this.queryValues[aValName];
    }

    public static getFileName(aFilePath: string): string {
        return aFilePath.split('\\').pop().split('/').pop();
    }

    public static getRandomRBG(aMinimum = 0): number {
        // let alphaStepCnt = 15;
        // let alphaStepValue = 255 / alphaStepCnt;
        let r = Math.trunc(aMinimum + Math.random() * (255 - aMinimum));
        let g = Math.trunc(aMinimum + Math.random() * (255 - aMinimum));
        let b = Math.trunc(aMinimum + Math.random() * (255 - aMinimum));
        // let step = randomIntInRange(0, alphaStepCnt);
        // let a = Math.trunc(step * alphaStepValue);
        return (r << 16) + (g << 8) + b;
    }

}