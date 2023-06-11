import Web3 from "web3";
import { contracts, env, reserveRpcs } from "../config";
import { account } from "../types";
import { ERC20ABI } from "../ABI";
import { IsTrueNetwork, NetworkAuth } from "./auth";


const plasma = contracts.plasma
const web3 = new Web3(env || Web3.givenProvider)
const reader = new Web3()

reader.setProvider(new Web3.providers.HttpProvider(reserveRpcs[1]))


async function GetAllowance ( owner : account, spender : account = contracts.starNFT) : Promise<number> {
    if (!owner || !spender) {
        return 0
    }

    const w3 = new reader.eth.Contract(ERC20ABI, plasma)
    const allowance = await w3.methods.allowance(owner, spender).call()

    return Number(allowance) / 1e18

}

async function GetBalance ( owner : account ) : Promise<number> {
    if (!owner) {
        return 0
    }

    const w3 = new reader.eth.Contract(ERC20ABI, plasma)
    const balance = await w3.methods.balanceOf(owner).call()
    return Number(balance) / 1e18
}

async function ApprovePlasma (owner: account, amount: number, spender : account = contracts.starNFT) : Promise<number> {
    if (!owner || !IsTrueNetwork ()) owner = await NetworkAuth ()

    if (!owner || !env || !spender || !IsTrueNetwork()) {
        return 0
    }

    try {

        const w3 = new web3.eth.Contract(ERC20ABI, plasma)
        const num : number= amount * 1e18
        const amt =  BigInt(num).toString()
        
        await w3.methods.approve(spender, amt).send({
            from: owner
          })

    } catch (e) {
        return GetAllowance(owner, spender)
    }

    return GetAllowance(owner, spender)
}

export {
    GetAllowance,
    GetBalance,
    ApprovePlasma
}