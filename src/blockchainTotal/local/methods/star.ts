import { Coords, Race, StarData, account, fuelTarget } from "../../types";
import { jsonABIs, network } from "../../config";
import { Stars, Tokens } from "../../getters";
import { web3local } from "../auth";
import { 
         CreateNewStar as CreateNewStarWindow,
         RefuelStar as RefuelStarWindow,
         IncreaseStarLevel as IncreaseStarLevelWindow
       } from "../../windowEth/methods"

export async function CreateNewStar (
    owner : account, 
    name : string,
    uri = `${document.location.hostname}`, 
    race: Race, 
    coords: Coords,
    ) : Promise<StarData | null> {
    return CreateNewStarWindow(owner, name, uri, race, coords, web3local);
}

export async function RefuelStar ( account : account, 
    starId : number, 
    amount : number, 
    target : fuelTarget) : Promise<StarData | null> {
    return RefuelStarWindow(account, starId, amount, target, web3local)
}

export async function IncreaseStarLevel (
    owner : account, 
    starId : number) : Promise<StarData | null> {
       return IncreaseStarLevelWindow (owner, starId, web3local);
}

