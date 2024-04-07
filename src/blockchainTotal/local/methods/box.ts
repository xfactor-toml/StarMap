import Web3 from "web3";
import { ethers } from 'ethers';
import { jsonABIs, network } from "../../config";
import { web3local  } from "../auth";
import { OpenBox as OpenBoxWindow } from "~/blockchainTotal/windowEth/methods";

export async function OpenBox (address: string, _boxId: number) {
    return new Promise(async (resolve, reject) => {
        const privateKey = localStorage.getItem(network.lsPrivateKey);
        if (!privateKey) {
            reject("Account is not setup");
        }
        const provider = new ethers.providers.JsonRpcProvider(network.reserveRpcs[2]);
        const signer = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(network.contracts.BoxNFT, jsonABIs.BoxNFT, signer);
        const randomValue = Math.round(Math.random() * 10000000);
        try {
            const transaction = await contract["openBox"](_boxId, randomValue);
            const signedTransaction = await signer.signTransaction(transaction);
            const transactionResponse = await provider.sendTransaction(signedTransaction);
            const receipt = await transactionResponse.wait();
            resolve(true);    
        } catch (e) {
            reject("Transaction error: " + e.message)
        }
    })
}