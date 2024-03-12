import Web3 from "web3";
import { contracts, env, fastDataServerUrl, maxStarLevel, plasmaDecimals, reserveRpcs } from "../config";
import { Coords, GameStats, Race, StarData, StarList, StarParams, account, fuelTarget } from "../types";
import { ERC20ABI, StarNFTABI } from "../ABI";
import { ApprovePlasma, GetAllowance } from "./plasma";

const nft = contracts.starNFT
const web3 = new Web3(env)
const reader = new Web3()

reader.setProvider(new Web3.providers.HttpProvider(reserveRpcs[1]))
const contract = new reader.eth.Contract(StarNFTABI, nft)
const writeable = new web3.eth.Contract(StarNFTABI, nft)

export function ExtractRace ( str : string) : Race {
    switch (str) {
        case "Waters" :
            return "Waters";
        case "Humans" :
            return "Waters";
        case "Insects" :
            return "Insects";
        case "Lizards":
            return "Lizards";
    default:
        throw new Error("wrong race")
    }
}

async function RequiredPlasmaToApprove (owner : account, level : number = 1) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        try {
            const demand = await GetCreationCost(level)
            const allowed = await GetAllowance(owner, nft)
        
            if (allowed >= demand) {
                resolve(0)
            }
            resolve(Number(demand - allowed) / (10 ** plasmaDecimals))
        } catch (e) {
            reject(e.message);
            return null;
        }
    })
}

async function GetCreationCost (level : number = 1) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        try {
            const demand = await contract.methods.CalcCreationCost(level.toString()).call();
            resolve(Number( demand ) / (10 ** plasmaDecimals));
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
                   const dt : any[] = await contract.methods.GetStarParams(cntr.toString()).call()
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
                   const owner : string = await contract.methods.ownerOf(cntr.toString()).call()
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
            const contract = new reader.eth.Contract(StarNFTABI, nft)
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
            const dt : any[] = await contract.methods.GetStarParams(starId.toString()).call()
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
            const owner : string = await contract.methods.ownerOf(starId.toString()).call()
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

async function CreateNewStar (owner : account, name : string, uri = `${document.location.hostname}`, race: Race, coords: Coords) : Promise<StarData | null> {
    return new Promise(async (resolve, reject) => {
        if (!owner || !name || !env) {
            reject("Invalid arguments");
         }
        
         coords = {
            X: coords.X + 1000000,
            Y: coords.Y + 1000000,
            Z: coords.Z + 1000000
        }
        try { 
            const requiredToAllow = await RequiredPlasmaToApprove(owner)

            if (requiredToAllow > 0) {
                reject("Not enough approved plasma")
                return null
            }
        /* if (requiredToAllow > 0) {
            // return null

            try {
                const allowed = await ApprovePlasma(owner, requiredToAllow)
                if (allowed < requiredToAllow) {
                    return null
                }
            } catch (e) {
                return null
            }
        } */
            const coordX = String(Math.round(coords.X * 1000000))
            const coordY = String(Math.round(coords.Y * 1000000))
            const coordZ = String(Math.round(coords.Z * 1000000))
			const gs = await web3.eth.getGasPrice()
            await writeable.methods.safeMint(owner, uri, name, race, coordX, coordY, coordZ).send({
                from: owner,
				gasPrice: String(gs)
              })
            const count = await GetStarsCount ()
            if (count > 0) {
               const data = await GetSingleStarData(count - 1);
               resolve(data);
            }
        } catch(e) {
            reject(e.message);
        }
    })

}

async function GetStarDataFromServer(): Promise<StarList> {
    return new Promise(async (reslove, reject) => {
        const url = fastDataServerUrl.concat('api/getstarlist');
        try {
            const response = await fetch(url);
            const data: StarList = await response.json();
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

async function RefuelStar ( account : account, 
                            starId : number, 
                            amount : number, 
                            target : fuelTarget) : Promise<StarData | null> {

    
      return new Promise(async (resolve, reject) => {
        if (amount == 0 || !account) {
            reject("Invalid arguments");
            return null
        }
  
        const allowedAmount = await GetAllowance (account, nft);
        if (allowedAmount < amount) {
            reject("Insufficient plasma approved");
            return null;
        }

            /* if (allowedAmount < amount) {
          
        // return null
         const demand = amount - allowedAmount
        try {
            const allowed = await ApprovePlasma(account, demand)
            if (allowed < amount) {
                return null
            }
        } catch (e) {
            return null
        }
      } */

      try {
        const fuel = String(amount * (10 ** 18))
		const gs = await web3.eth.getGasPrice()
        if (target === "existence") {
            await writeable.methods.UpdateStarFuel(starId, fuel).send({
                from: account,
				gasPrice: String(gs)
              })
        } else {
            await writeable.methods.UpdateStarLevelFuel(starId, fuel).send({
                from: account,
				gasPrice: String(gs)
              })
        }

        const result =  await GetSingleStarData(starId);
        resolve(result);
      } catch (e) {
        reject(e.message)
        return null
      }
      })
}

async function IncreaseStarLevel (owner : account, starId : number) : Promise<StarData | null> {
    return new Promise(async (resolve, reject) => {
        if (!owner) {
            reject("Owner not specified");
            return null;
        }

        try {
            const CurrentData = await GetSingleStarData(starId)
            const starOwner = String(await contract.methods.ownerOf(starId).call())
            const newLevel = CurrentData.params.level + 1
            if (newLevel > maxStarLevel) {
                reject("Star maximum level reached");
                return null;
            }

            if (starOwner.toLowerCase() !== owner) {
                reject("User is not a star owner");
                return null;
            }
            const requireApprove = await RequiredPlasmaToApprove (owner, newLevel)
            if (requireApprove > 0) {
                reject("Approved plasma not enough");
                return null;
            }
            
    /* if (requireApprove > 0) {
        // return null
        try {
            const allowed = await ApprovePlasma(owner, requireApprove, nft)
            if (allowed < requireApprove) {
                return null
            }
        } catch (e) {
            return null
        }
    } */

    const gs = await web3.eth.getGasPrice()
    await writeable.methods.IncreaseStarLevel(starId).send({
        from: owner,
        gasPrice: String(gs)
    })
    const result = await GetSingleStarData(starId)
     resolve(result);
        } catch (e) {
            reject(e.message);
            return null;
        }
    })
}

async function GetStarStats ( starId : number) : Promise<GameStats> {
    return new Promise(async (resolve, reject) => {
        const contract = new reader.eth.Contract(StarNFTABI, nft)
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
    GetAllStarData,
    GetSingleStarData,
    CreateNewStar,
    RefuelStar,
    IncreaseStarLevel,
    GetCreationCost,
    GetStarStats,
    GetStarsCount
}

