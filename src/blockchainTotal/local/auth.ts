import Web3 from "web3";
import { network } from "../config";
import { account } from "../types";

export const web3local = new Web3(network.reserveRpcs[1]);

export async function AuthByLocal(): Promise<account> {
    return new Promise((resolve, reject) => {
        const userAccount = localStorage.getItem(network.lsAddressKey);
        if (!userAccount) {
            const newAccount = web3local.eth.accounts.create();
            localStorage.setItem(network.lsAddressKey, newAccount.address);
            localStorage.setItem(network.lsPrivateKey, newAccount.privateKey);
            resolve(newAccount.address)
        } else {
            resolve(userAccount);
        }
    })
}