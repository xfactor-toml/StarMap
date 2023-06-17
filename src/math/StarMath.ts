import { ServerStarParams } from "~/data/Types";
import { LogMng } from "~/utils/LogMng";
import { MyMath } from "~/utils/MyMath";

export class StarMath {
    
    public static getMassValues(aStarParams: ServerStarParams): {
        value: number,
        percent: number,
        unit: string
    } {
        const min = 10000;
        const max = 250000;//10000000;
        let res = {
            value: aStarParams.mass,
            percent: MyMath.clamp(aStarParams.mass / max, 0, 1),
            unit: 'E.M.'
        }

        LogMng.debug(`getMassValues:`, {
            min: min,
            max: max,
            res: res,
            params: aStarParams
        });

        return res;
    }

    public static getSlotsValues(aStarParams: ServerStarParams): {
        value: number,
        percent: number,
        unit: string
    } {
        const MAX_FOR_LEVEL = [0, 5, 10, 25, 50, 100];
        const min = 1;
        const max = MAX_FOR_LEVEL[4];//100;
        let res = {
            value: aStarParams.planetSlots,
            percent: MyMath.clamp(aStarParams.planetSlots / max, 0, 1),
            unit: ''
        }

        LogMng.debug(`getSlotsValues:`, {
            min: min,
            max: max,
            res: res,
            params: aStarParams
        });

        return res;
    }

    public static getTotalEnergyValues(aStarParams: ServerStarParams): {
        value: number,
        percent: number,
        unit: string
    } {
        const min = 0.01;
        const max = 2.5;//1000;
        const factor = 1e18;
        const realValue = aStarParams.fuel / factor;
        let res = {
            value: realValue,
            percent: MyMath.clamp(realValue / max, 0, 1),
            unit: ''
        }

        LogMng.debug(`getTotalEnergyValues:`, {
            min: min,
            max: max,
            res: res,
            params: aStarParams
        });

        return res;
    }

    public static getEnergyPerHourValues(aStarParams: ServerStarParams): {
        value: number,
        percent: number,
        unit: string
    } {
        const factorView = 1e9;
        const factor = 1e18;
        const min = 0.000002314 * factor;
        const max = 0.000222144 * factor;
        // const max = 0.042651648 * factor;
        let res = {
            value: Math.trunc(aStarParams.fuelSpendings / factorView),
            percent: MyMath.clamp(aStarParams.fuelSpendings / max, 0, 1),
            unit: 'GWei/hour'
        }

        LogMng.debug(`getEnergyPerHourValues:`, {
            min: min,
            max: max,
            res: res,
            params: aStarParams
        });

        return res;
    }

    public static getLifeValues(aStarParams: ServerStarParams): {
        value: number,
        percent: number,
        unit: string
    } {
        const HoursByLevel = {
            1: 4380,
            2: 2190,
            3: 730,
            4: 8640,
            5: 17280
        };
        const starMaxHours = HoursByLevel[aStarParams.level];
        const e = aStarParams.fuel / aStarParams.fuelSpendings;
        let res = {
            // value: e,
            value: Math.trunc(MyMath.clamp(e / starMaxHours, 0, 1) * 100),
            percent: MyMath.clamp(e / starMaxHours, 0, 1),
            unit: '%'
        }

        LogMng.debug(`getLifeValues:`, {
            starMaxHours: starMaxHours,
            e: e,
            res: res,
            params: aStarParams
        });

        return res;
    }


}