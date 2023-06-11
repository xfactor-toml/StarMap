import Web3 from "web3";
import { contracts, env } from "../config";
import { account } from "../types";


const plasma = contracts.plasma
const web3 = new Web3(env || Web3.givenProvider)

async function GetAllowance ( owner : account, spender : account = contracts.starNFT) {
    if (!owner || !spender) {
        return 0
    }
}