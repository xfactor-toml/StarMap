import Web3 from "web3";
import { contracts, env, reserveRpcs } from "../config";
import { Coords, Race, StarData, StarList, StarParams, account, fuelTarget } from "../types";
import { ERC20ABI, StarNFTABI } from "../ABI";
import { IsTrueNetwork, NetworkAuth } from "./auth";
import { ApprovePlasma, GetAllowance } from "./plasma";

const nft = contracts.starNFT
const web3 = new Web3(env)
const reader = new Web3()

reader.setProvider(new Web3.providers.HttpProvider(reserveRpcs[1]))
const contract = new reader.eth.Contract(StarNFTABI, nft)
const writeable = new web3.eth.Contract(StarNFTABI, nft)

function ExtractRace ( str : string) : Race {
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
    const demand = await contract.methods.CalcCreationCost(level.toString()).call()
    const allowed = await GetAllowance(owner, nft)
    if (allowed > demand) {
        return 0
    }
    return Number(demand - allowed) / 1e18
}

async function GetCreationCost (level : number = 1) : Promise<number> {
    const demand = await contract.methods.CalcCreationCost(level.toString()).call()
    return Number( demand ) / 1e18
}


async function GetAllStarData () : Promise<StarList> {
     const stars : StarList = []
     let cntr = 0
     const total = await GetStarsCount ()
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
                fuel: Number(dt[5]) / 1e18,
                levelUpFuel: Number(dt[6]) / 1e18,
                fuelSpendings: Number(dt[7]) / 1e18,
                habitableZoneMin: Number(dt[8]),
                habitableZoneMax: Number(dt[9]),
                planetSlots: Number(dt[10]),
                mass: Number(dt[11]),
                race: ExtractRace(dt[12]),
                coords: {
                    X: Number(dt[13][0]) / 1000000,
                    Y: Number(dt[13][1]) / 1000000,
                    Z: Number(dt[13][2]) / 1000000
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
     return stars
}

async function GetStarsCount () : Promise<number> {
    const contract = new reader.eth.Contract(StarNFTABI, nft)
    const count : number = Number(await contract.methods.GetTotalStarCount().call())
    return count 
}

async function GetSingleStarData ( starId : number ) : Promise<StarData | null> {
    try {
        const dt : any[] = await contract.methods.GetStarParams(starId.toString()).call()
        if(!dt[10]) { 
           return null
        }
        const starParams : StarParams = {
            name: String(dt[0]),
            isLive: Boolean(dt[1]),
            creation: Number(dt[2]),
            updated: Number(dt[3]),
            level: Number(dt[4]),
            fuel: Number(dt[5]) / 1e18,
            levelUpFuel: Number(dt[6]) / 1e18,
            fuelSpendings: Number(dt[7]) / 1e18,
            habitableZoneMin: Number(dt[8]),
            habitableZoneMax: Number(dt[9]),
            planetSlots: Number(dt[10]),
            mass: Number(dt[11]),
            race: ExtractRace(dt[12]),
            coords: {
                X: Number(dt[13][0]) / 1000000,
                Y: Number(dt[13][1]) / 1000000,
                Z: Number(dt[13][2]) / 1000000
            }
        }
        const owner : string = await contract.methods.ownerOf(starId.toString()).call()
        const starData : StarData = {
            id: starId,
            owner: owner,
            params: starParams
        }
        return starData
     } catch (e) {
        return null
     }
}

async function CreateNewStar (owner : account, name : string, uri = `${document.location.hostname}`, race: Race, coords: Coords) : Promise<StarData | null> {
        if (!owner || !name || !env) {
           return null
        }

        const requiredToAllow = await RequiredPlasmaToApprove(owner)

        if (requiredToAllow > 0) {
            try {
                const allowed = await ApprovePlasma(owner, requiredToAllow)
                if (allowed < requiredToAllow) {
                    return null
                }
            } catch (e) {
                return null
            }
        }

        try {
            const coordX = String(Math.round(coords.X * 1000000))
            const coordY = String(Math.round(coords.Y * 1000000))
            const coordZ = String(Math.round(coords.Z * 1000000))
            await writeable.methods.safeMint(owner, uri, name, race, coordX, coordY, coordZ).send({
                from: owner
              })
            const count = await GetStarsCount ()
            if (count > 0) {
               return await GetSingleStarData(count - 1)
            }
        } catch (e) {
            console.log(e.message)
            return null
        }

}

async function RefuelStar ( account : account, 
                            starId : number, 
                            amount : number, 
                            target : fuelTarget) : Promise<StarData | null> {
      if (amount == 0 || !account) {
          return null
      }

      const allowedAmount = await GetAllowance (account, nft)

      if (allowedAmount < amount) {
        const demand = amount - allowedAmount
        try {
            const allowed = await ApprovePlasma(account, demand)
            if (allowed < amount) {
                return null
            }
        } catch (e) {
            return null
        }
      }

      try {
        const fuel = BigInt(amount * 1e18).toString()
        if (target === "existence") {
            await writeable.methods.UpdateStarFuel(starId, fuel).send({
                from: account
              })
        } else {
            await writeable.methods.UpdateStarLevelFuel(starId, fuel).send({
                from: account
              })
        }

        return await GetSingleStarData(starId)
      } catch (e) {
        console.log(e.message)
        return null
      }
}

async function IncreaseStarLevel (owner : account, starId : number) : Promise<StarData | null> {
    if (!owner) {
        return null
    }
    const CurrentData = await GetSingleStarData(starId)
    const starOwner = await contract.methods.ownerOf(starId).call()
    const newLevel = CurrentData.params.level + 1
    if (newLevel > 3 || starOwner !== owner) {
        return null
    }

    const requireApprove = await RequiredPlasmaToApprove (owner, newLevel)
    
    if (requireApprove > 0) {
        try {
            const allowed = await ApprovePlasma(owner, requireApprove, nft)
            if (allowed < requireApprove) {
                return null
            }
        } catch (e) {
            return null
        }
    }

    try {
        const result = await contract.methods.IncreaseStarLevel(starId).send({
            from: owner
        })
        return await GetSingleStarData(starId)
    } catch (e) {
        return null
    }
}

export {
    RequiredPlasmaToApprove,
    GetAllStarData,
    GetSingleStarData,
    CreateNewStar,
    RefuelStar,
    IncreaseStarLevel,
    GetCreationCost,
    GetStarsCount
}

