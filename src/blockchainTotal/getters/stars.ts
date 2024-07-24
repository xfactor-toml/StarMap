import { network } from '../config';
import { StarNFTABI } from '../config/jsonABI';
import { decimals, env, fastDataServerUrl } from '../config/network';
import { account, StarList, StarParams, StarData, GameStats, Race } from '../types';
import { ExtractRace } from '../utils/race';
import { nftContracts } from './common';
import { GetAllowance } from './tokens';


interface StarTableRow {
    id?: number;
    owner?: string; 
    name: string;
    is_live: boolean;
    creation: number;
    updated?: number | null;
    level: number;
    fuel?: number;
    level_up_fuel?: number;
    fuel_spendings?: number;
    habitable_zone_min?: number;
    habitable_zone_max?: number;
    planet_slots?: number;
    mass?: number;
    race: Race;
    coords: number[]; 
}


async function RequiredPlasmaToApprove (owner : account, level : number = 1) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        try {
            const demand = await GetCreationCost(level);
            const allowed = await GetAllowance(owner, network.contracts.plasma);
        
            if (allowed >= demand) {
                resolve(0)
            }
            resolve(Number(demand - allowed) / (10 ** decimals))
        } catch (e) {
            reject(e.message);
            return null;
        }
    })
}

async function GetCreationCost (level : number = 1) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        try {
            const demand = await nftContracts.StarNFT.methods.CalcCreationCost(level.toString()).call();
            resolve(Number( demand ) / (10 ** decimals));
        } catch (e) {
            reject(e.message);
        }
    })
}

async function GetAllStarData () : Promise<StarList> {
    return new Promise(async (reslove, reject) => {
        const stars : StarList = []
        let cntr = 0
        GetStarsCount ().then(async (total) => {
            while (cntr < total) {
                try {
                   const dt : any[] = await nftContracts.StarNFT.methods.GetStarParams(cntr.toString()).call()
                   if(!dt[10]) {  // Planet slots always larger than zero
                      break;
                   }
       
                   const starParams : StarParams = {
                       name: String(dt[0]),
                       isLive: Boolean(dt[1]),
                       creation: Number(dt[2]),
                       updated: Number(dt[3]),
                       level: Number(dt[4]),
                       fuel: Number(dt[5]),
                       levelUpFuel: Number(dt[6]),
                       fuelSpendings: Number(dt[7]),
                       habitableZoneMin: Number(dt[8]),
                       habitableZoneMax: Number(dt[9]),
                       planetSlots: Number(dt[10]),
                       mass: Number(dt[11]),
                       race: ExtractRace(dt[12]),
                       coords: {
                           X: (Number(dt[13][0]) / 1000000) - 1000000,
                           Y: (Number(dt[13][1]) / 1000000) - 1000000,
                           Z: (Number(dt[13][2]) / 1000000) - 1000000
                       }
                   }
                   const owner : string = await nftContracts.StarNFT.methods.ownerOf(cntr.toString()).call()
                   const starData : StarData = {
                       id: cntr,
                       owner: owner,
                       params: starParams
                   }
                   stars.push(starData)
                   cntr += 1
                } catch (e) {
                   break;
                }
            }
            reslove(stars);
        }).catch(e => {
            reject(e)
        })
    })
}

async function GetStarsCount () : Promise<number> {
    return new Promise(async (reslove, reject) => {
        try {
            const contract = nftContracts.StarNFT
            const count : number = Number(await contract.methods.GetTotalStarCount().call())
            reslove(count) 
        } catch(e) {
            reject(e.message)
        }
    })
}

async function GetSingleStarData ( starId : number ) : Promise<StarData | null> {
    return new Promise(async (resolve, reject) => {
        try {
            const dt : any[] = await nftContracts.StarNFT.methods.GetStarParams(starId.toString()).call()
            if(!dt[10]) { 
               reject("Received data is invalid")
               return null
            }
            const starParams : StarParams = {
                name: String(dt[0]),
                isLive: Boolean(dt[1]),
                creation: Number(dt[2]),
                updated: Number(dt[3]),
                level: Number(dt[4]),
                fuel: Number(dt[5]),
                levelUpFuel: Number(dt[6]),
                fuelSpendings: Number(dt[7]),
                habitableZoneMin: Number(dt[8]),
                habitableZoneMax: Number(dt[9]),
                planetSlots: Number(dt[10]),
                mass: Number(dt[11]),
                race: ExtractRace(dt[12]),
                coords: {
                    X: (Number(dt[13][0]) / 1000000) - 1000000,
                    Y: (Number(dt[13][1]) / 1000000) - 1000000,
                    Z: (Number(dt[13][2]) / 1000000) - 1000000
                }
            }
            const owner : string = await nftContracts.StarNFT.methods.ownerOf(starId.toString()).call()
            const starData : StarData = {
                id: starId,
                owner: owner,
                params: starParams
            }
            resolve(starData)
         } catch (e) {
            reject(e.message)
         }
    })
}


async function GetStarDataFromServer(): Promise<StarList> {
    return new Promise(async (reslove, reject) => {
        const url = fastDataServerUrl.concat('api/getstarlist');
        try {
            const response = await fetch(url);
            const data: StarList = await response.json();
            console.log("Received: ", data)
            reslove(data);
        }  catch (e) {
            reject(e.message);
        }
    })
}

export async function getWeb2StarDataFromServer(): Promise<StarList> {
    return new Promise(async (reslove, reject) => {
        const url = fastDataServerUrl.concat('api/getserverstarlist');
        try {
            const response = await fetch(url);
            const data: StarList = (await response.json()).map((item: StarTableRow) => {
                return({
                    id: item.id,
                    owner: item.owner || "none",
                    params: {
                        creation: Math.round(new Date(item.creation).getTime() / 1000),
                        isLive: item.is_live,
                        updated: item.updated ? Math.round(new Date(item.updated).getTime() / 1000) : 0,
                        level: item.level,
                        levelUpFuel: item.level_up_fuel,
                        fuel: item.fuel,
                        fuelSpendings: item.fuel_spendings || 0,
                        habitableZoneMin: item.habitable_zone_min,
                        habitableZoneMax: item.habitable_zone_max,
                        planetSlots: item.planet_slots,
                        mass: item.mass,
                        race: item.race,
                        coords: {
                            X: item.coords[0],
                            Y: item.coords[1],
                            Z: item.coords[2]
                        }
                    }})
            });
            console.log("Received: ", data)
            reslove(data);
        }  catch (e) {
            reject(e.message);
        }
    })
}

async function RequestToUpdateStars() {
    return new Promise(async (resolve, reject) => {
        const url = fastDataServerUrl.concat('api/updatestars');
        try {
            const response = await fetch(url, {method: 'POST'});
            const data = await response.json();
            resolve(data);
        } catch (e) {
                reject(e.message);
            }
    })
}

async function RequestToUpdateOneStar (starId: number) {
    return new Promise(async (resolve, reject) => {
        if (starId < 0 || isNaN(starId)) {
            reject("Invalid id")
        }
        const url = fastDataServerUrl.concat(`api/updateonestar/${Math.ceil(starId)}`);
        try {
            const response = await fetch(url, {method: 'POST'});
            const data = await response.json();
            resolve(data);
        } catch (e) {
                reject(e.message);
            }
    })
}


async function GetStarStats ( starId : number) : Promise<GameStats> {
    return new Promise(async (resolve, reject) => {
        const contract = nftContracts.StarNFT
        try {
            const stats : any[] = await contract.methods.StarStats(starId).call()
            resolve( {
                games: Number(stats[0]),
                win: Number(stats[1])
            })
        } catch (e) {
            reject(e.message)
            return null;
        }
    })
}

export {
    RequiredPlasmaToApprove,
    GetStarDataFromServer,
    RequestToUpdateStars,
    RequestToUpdateOneStar,
    GetAllStarData,
    GetSingleStarData,
    GetCreationCost,
    GetStarStats,
    GetStarsCount
}