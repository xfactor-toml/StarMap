import { reader, tokenContracts, web3 } from './common';
import { account } from '../types';
import { env, contracts, decimals } from '../config/network';

async function GetAllowance ( owner : account, spender : account = contracts.starNFT) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        if (!owner || !spender) {
            reject("Wrong entry")
        }

        const w3 = tokenContracts.Plasma;
        const allowance = await w3.methods.allowance(owner, spender).call()
    
        resolve(Number(allowance) / (10 ** decimals))
    })

}

async function GetBalance ( owner : account ) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        if (!owner) {
            reject("Owner not specified")
        }

    const w3 = tokenContracts.Plasma;
    const balance = await w3.methods.balanceOf(owner).call()
    resolve(Number(balance) / (10 ** decimals))
    })
}


export {
    GetAllowance,
    GetBalance,
}