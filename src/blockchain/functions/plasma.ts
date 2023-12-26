import Web3 from "web3";
import { contracts, env, plasmaDecimals, reserveRpcs } from "../config";
import { account } from "../types";
import { ERC20ABI } from "../ABI";
import { IsTrueNetwork, NetworkAuth } from "./auth";


const plasma = contracts.plasma
const web3 = new Web3(env || Web3.givenProvider)
const reader = new Web3()

reader.setProvider(new Web3.providers.HttpProvider(reserveRpcs[1]))

async function MintPlasma (account : string, amount : number) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        if (!env) {
            reject("Wallet not found")
        }

        if (!account) {
            reject("Account not specified")
        }
        const GasPrice = await web3.eth.getGasPrice()
        try {
            const contract = new web3.eth.Contract(ERC20ABI, plasma)
            await contract.methods.Mint(String(BigInt(amount * 1e18)), account).send({
                from: account,
                gasPrice: Number(GasPrice) < 1600000000 ? '1600000000' : GasPrice
            })
            resolve(await GetBalance(account))

        } catch (e : any) {
            reject(e.message)
        }
    })
  }

async function GetAllowance ( owner : account, spender : account = contracts.starNFT) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        if (!owner || !spender) {
            reject("Wrong entry")
        }

        const w3 = new reader.eth.Contract(ERC20ABI, plasma)
        const allowance = await w3.methods.allowance(owner, spender).call()
    
        resolve(Number(allowance) / (10 ** plasmaDecimals))
    })

}

async function GetBalance ( owner : account ) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        if (!owner) {
            reject("Owner not specified")
        }

    const w3 = new reader.eth.Contract(ERC20ABI, plasma)
    const balance = await w3.methods.balanceOf(owner).call()
    resolve(Number(balance) / (10 ** plasmaDecimals))
    })
}

async function ApprovePlasma (owner: account, amount: number, spender : account = contracts.starNFT) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        if (!owner || !IsTrueNetwork ()) owner = await NetworkAuth ();
        
    if (!owner || !env || !spender || !IsTrueNetwork()) {
        reject("User auth failed")
    }
    try {

        const w3 = new web3.eth.Contract(ERC20ABI, plasma)
        const num : number= amount * 1e18
        const amt =  BigInt(num).toString()
        const gs = await web3.eth.getGasPrice()
        
        await w3.methods.approve(spender, amt).send({
            from: owner,
            gasPrice: gs
          })

    } catch (e) {
        reject("Approve transaction failed")
    }

    resolve(await GetAllowance(owner, spender));
    })

}

export {
    MintPlasma,
    GetAllowance,
    GetBalance,
    ApprovePlasma
}
