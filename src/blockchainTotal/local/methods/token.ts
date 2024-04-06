
import { GetBalance } from "../../getters/tokens";
import { jsonABIs, network } from "../../config";
import { web3local } from "../auth";
import { 
    MintPlasma as MintPlasmaWindow, 
    ApprovePlasma as ApprovePlasmaWindow 
} from '../../windowEth/methods'
import { Tokens } from "../../getters";
import { account } from "../../types";

export async function MintPlasma (account : string, amount : number) : Promise<number> {
    return MintPlasmaWindow (account, amount, web3local);
  }

export async function ApprovePlasma (
    owner: account, 
    amount: number, 
    spender : account = network.contracts.starNFT) : Promise<number> {
    return ApprovePlasmaWindow (owner, amount, spender, web3local);
}