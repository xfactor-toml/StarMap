import { ServerStarParams } from "~/data/Types";

export class StarMath {
    
    public static getMassValues(aStarParams: ServerStarParams): {
        value: number,
        percent: number
    } {
        const min = 10000;
        const max = 10000000;
        let res = {
            value: aStarParams.mass,
            percent: aStarParams.mass / max
        }
        return res;
    }

    public static getSlotsValues(aStarParams: ServerStarParams): {
        value: number,
        percent: number
    } {
        const min = 1;
        const max = 100;
        let res = {
            value: aStarParams.planetSlots,
            percent: aStarParams.planetSlots / max
        }
        return res;
    }

    public static getTotalEnergyValues(aStarParams: ServerStarParams): {
        value: number,
        percent: number
    } {
        const min = 0.01;
        const max = 1000;
        const factor = 1e18;
        const realValue = aStarParams.fuel / factor;
        let res = {
            value: realValue,
            percent: realValue / max
        }
        return res;
    }

    public static getEnergyPerHourValues(aStarParams: ServerStarParams): {
        value: number,
        percent: number
    } {
        const factorView = 1e9;
        const factor = 1e18;
        const min = 0.000002314 * factor;
        const max = 0.042651648 * factor;
        let res = {
            value: aStarParams.fuelSpendings * factorView,
            percent: aStarParams.fuelSpendings / max
        }
        return res;
    }

    public static getLifeValues(aStarParams: ServerStarParams): {
        value: number,
        percent: number
    } {
        const HoursByLevel = {
            1: 4320,
            2: 2160,
            3: 720,
            4: 8640,
            5: 17280
        };
        const starMaxHours = HoursByLevel[aStarParams.level];
        const factorView = 1e9;
        const factor = 1e18;
        const e = aStarParams.fuel / aStarParams.fuelSpendings;
        let res = {
            value: e,
            percent: e / starMaxHours
        }
        return res;
    }


}