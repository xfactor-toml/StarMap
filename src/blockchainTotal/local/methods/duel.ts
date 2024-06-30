import Web3 from "web3";
import { ethers } from 'ethers';
import { jsonABIs, network } from "../../config";
import { fastDataServerUrl } from "../../config/network";


export async function AcceptDuelInvitation (authData: any, inviter: string) {
    return new Promise(async (resolve, reject) => {
        const url = fastDataServerUrl.concat('api/duelaccept');
        alert(inviter)
        const responce = await fetch(url, {
            method: 'post',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              telegramInitData: authData,
              inviter
            })
        })
        alert(responce.status)
        if (responce.status !== 200) {
            reject("Invalid data");
        }
        const data = await responce.json();
        resolve(data.success)
    })
}