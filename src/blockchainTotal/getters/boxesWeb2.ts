import { fastDataServerUrl } from "../config/network";

export type web2assets = {
    laser1: number;
    laser2: number;
    laser3: number;
    token: number;
    spice: number;
    spore: number;
    metal: number;
    biomass: number;
    carbon: number;
    trends: number;
}

export async function getUserBoxesToOpenWeb2 ( ownerAddress: string ): Promise<number[]> {
    return new Promise((resolve, reject) => {
        if (!ownerAddress) {
            reject ("Login is not defuned");
            return;
        }
        const url = fastDataServerUrl.concat('api/boxes/available');
        fetch(url, {
            method: 'post',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ownerLogin: ownerAddress, 
            })
          }).then(res => {
            if (res.status !== 200) {
                reject("Api reqest failed")
            }
            return res.json()
        }).then(res => {
            const ids: number[] = [];
            res.forEach((item) => {
                ids.push(item.id);
            })
            resolve(ids)
            return ids
          })
    })
}

export async function GetGameAssetsWeb2 ( ownerAddress: string ): Promise<web2assets> {
    return new Promise((resolve, reject) => {
        if (!ownerAddress) {
            reject ("Login is not defuned");
            return;
        }
        const url = fastDataServerUrl.concat('api/boxes/assets');
        fetch(url, {
            method: 'post',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ownerLogin: ownerAddress, 
            })
          }).then(res => {
            if (res.status !== 200) {
                reject("Api reqest failed")
            }
            return res.json()
        }).then((res: {assets: {
            laser1: number;
            laser2: number;
            laser3: number;
            token: number;
            spice: number;
            spore: number;
            metal: number;
            biomass: number;
            carbon: number;
            trends: number;
        }}) => {
             resolve(res.assets)
             return res.assets;
          })
    })
}

export function GetBoxPrizeTypeWeb2(prize: string) {
    return prize;
}

export type BoxItemType = 'vrp' | 'biomass' | 'carbon' | 'metal' | 'spice' | 'spore' | 'laser';

export type BoxDataWeb2 = {
    type: BoxItemType,
    value?: number,
    laserLevel?: number,
    isPaid?: boolean
}

export async function getBoxDataWeb2(_boxId: number): Promise<BoxDataWeb2> {

    return new Promise((resolve, reject) => {
        const url = fastDataServerUrl.concat('api/boxes/openresult');
        fetch(url, {
            method: 'post',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              boxId: _boxId, 
            })
          }).then(res => {
            if (res.status !== 200) {
                reject("Api reqest failed")
            }
            return res.json()
        }).then(res => {
             if (!res.data) {
                resolve(
                    {
                        type: 'vrp',
                        isPaid: false
                    }
                )
             } else {
                const data = {
                    type: res.data.openresult.indexOf("laser") > -1 ? "laser" : res.data.openresult,
                    value: res.data.openresult.indexOf("laser") > -1 ? null : res.data.openamount,
                    laserLevel: res.data.openresult.indexOf("laser") > -1 ? Number(res.data.openresult.replace("laser", "")) : null,
                    isPaid: true
                }
                resolve(data);
             }
             return res.assets;
          })
    })
}

export async function getUserLaserListWeb2(_user: string) {
    const data = await GetGameAssetsWeb2(_user);
    const levels: number[] = [];
    if (data.laser1 > 0) {
        levels.push(1)
    }
    if (data.laser2 > 0) {
        levels.push(2)
    }
    if (data.laser3 > 0) {
        levels.push(3)
    }
    return levels;
}

export async function getUserAvailableLaserLevelsWeb2(_user: string) {
    const list: number[] = [];
    const lasers = await getUserLaserListWeb2(_user);
    return lasers
}