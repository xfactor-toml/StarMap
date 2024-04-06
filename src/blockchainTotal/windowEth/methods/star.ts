import { Coords, Race, StarData, account, fuelTarget } from "../../types";
import { jsonABIs, network } from "../../config";
import { Stars, Tokens } from "../../getters";
import { web3window as web3 } from "../auth";

export async function CreateNewStar (
    owner : account, 
    name : string, 
    uri = `${document.location.hostname}`, 
    race: Race, 
    coords: Coords, 
    w3 = web3) : Promise<StarData | null> {
        
    const writeable = new w3.eth.Contract(jsonABIs.StarNFTABI, network.contracts.starNFT);
    return new Promise(async (resolve, reject) => {
        if (!owner || !name || !network.env) {
            reject("Invalid arguments");
         }
        
         coords = {
            X: coords.X + 1000000,
            Y: coords.Y + 1000000,
            Z: coords.Z + 1000000
        }
        try { 
            const requiredToAllow = await Stars.RequiredPlasmaToApprove(owner)

            if (requiredToAllow > 0) {
                reject("Not enough approved plasma")
                return null
            }

            const coordX = String(Math.round(coords.X * 1000000))
            const coordY = String(Math.round(coords.Y * 1000000))
            const coordZ = String(Math.round(coords.Z * 1000000))
			const gs = await web3.eth.getGasPrice()
            await writeable.methods.safeMint(owner, uri, name, race, coordX, coordY, coordZ).send({
                from: owner,
				gasPrice: String(gs)
              })
            const count = await Stars.GetStarsCount ()
            if (count > 0) {
                try {
                    Stars.RequestToUpdateOneStar(count - 1);
                } catch (e) {
                    console.error(e.message);
                }
               const data = await Stars.GetSingleStarData(count - 1);
               resolve(data);
            }
        } catch(e) {
            reject(e.message);
        }
    })

}

export async function RefuelStar ( account : account, 
    starId : number, 
    amount : number, 
    target : fuelTarget,
    w3 = web3) : Promise<StarData | null> {

const writeable = new w3.eth.Contract(jsonABIs.StarNFTABI, network.contracts.starNFT);
return new Promise(async (resolve, reject) => {
if (amount == 0 || !account) {
reject("Invalid arguments");
return null
}

const allowedAmount = await Tokens.GetAllowance (account, network.contracts.starNFT);
  if (allowedAmount < amount) {
     reject("Insufficient plasma approved");
    return null;
  }

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
     try {
        Stars.RequestToUpdateOneStar(starId);
     } catch (e) {
       console.error(e.message);
     }
     const result =  await Stars.GetSingleStarData(starId);
     resolve(result);
    } catch (e) {
       reject(e.message)
       return null
     }
  })
}

export async function IncreaseStarLevel (
    owner : account, 
    starId : number,
    w3 = web3) : Promise<StarData | null> {
    const writeable = new w3.eth.Contract(jsonABIs.StarNFTABI, network.contracts.starNFT);
       return new Promise(async (resolve, reject) => {
         if (!owner) {
            reject("Owner not specified");
            return null;
         }

        try {
            const CurrentData = await Stars.GetSingleStarData(starId)
            const starOwner = String(await writeable.methods.ownerOf(starId).call())
            const newLevel = CurrentData.params.level + 1
         if (newLevel > network.maxStarLevel) {
            reject("Star maximum level reached");
            return null;
         }

        if (starOwner.toLowerCase() !== owner) {
           reject("User is not a star owner");
           return null;
        }
        const requireApprove = await Stars.RequiredPlasmaToApprove (owner, newLevel)
        if (requireApprove > 0) {
           reject("Approved plasma not enough");
           return null;
        }

        const gs = await web3.eth.getGasPrice()
        await writeable.methods.IncreaseStarLevel(starId).send({
           from: owner,
           gasPrice: String(gs)
        })
        const result = await Stars.GetSingleStarData(starId);
        try {
           Stars.RequestToUpdateOneStar(starId);
        } catch (e) {
          console.error(e.message);
        }
        resolve(result);
    } catch (e) {
       reject(e.message);
       return null;
    }
  })
}

