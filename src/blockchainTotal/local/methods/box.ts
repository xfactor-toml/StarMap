import Web3 from "web3";
import { ethers } from 'ethers';
import { jsonABIs, network } from "../../config";
import { fastDataServerUrl } from "~/blockchainTotal/config/network";
import { BlockchainConnectService } from "~/blockchainTotal";
import { TelegramAuthData } from "~/blockchainTotal/types";
import { GetGameAssetsWeb2, web2assets } from "~/blockchainTotal/getters/boxesWeb2";

export async function OpenBox (address: string, _boxId: number) {
    return new Promise(async (resolve, reject) => {
	    reject("Local transactions is not allowed")
	})
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

export async function OpenBoxWeb2 (_boxId: number, address?: string, telegramData?: TelegramAuthData, telegramInitData?: any) {
    return new Promise(async (resolve, reject) => {
        if (!address && !telegramData && !telegramInitData) {
            reject("At least 1 auth parameter must exist")
        }
        // alert(`Box open called, promise ${telegramInitData}`)
        const url = fastDataServerUrl.concat('api/boxes/open');
        const connector = BlockchainConnectService.getInstance();
        const priority = connector.getDefaultAuthMethod();
        connector.setupAuthMethod(priority);
        const signature =  address ? await connector.getSignedAuthMessage() : "";
        const balancePrev = await GetGameAssetsWeb2 (String(telegramData.id) || address);
        const response = await fetch(url, {
            method: 'post',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              signature: signature || "", 
              telegramData,
              boxId: Number(_boxId),
              telegramInitData
            })
          });
          if (response.status !== 200) {
            reject("Api reqest failed")
          }
          const balanceNext = await GetGameAssetsWeb2 (String(telegramData.id) || address);
          console.log("Balances change: ", {
            prev: balancePrev,
            next: balanceNext
          })
          const balanceResult: web2assets = Object.keys(balancePrev).reduce((acc, key) => {
            return { ...acc, [key]: balanceNext[key as keyof web2assets] - balancePrev[key as keyof web2assets] };
          }, {} as web2assets);

          resolve(balanceResult);
    })
}
