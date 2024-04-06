import Web3 from "web3";
import { jsonABIs, network } from "../../config";
import { web3local  } from "../auth";
import { OpenBox as OpenBoxWindow } from "~/blockchainTotal/windowEth/methods";

export async function OpenBox (address: string, _boxId: number) {
    return OpenBoxWindow (address, _boxId, web3local);
}