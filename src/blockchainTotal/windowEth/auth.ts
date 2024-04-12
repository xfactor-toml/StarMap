import Web3 from "web3";
import { network } from "../config";
import { env, networkParams, walletChangingEventName } from "../config/network";
import { account } from "../types";

export let walletAddress: account = "";
export const web3window = new Web3(env);
export async function IsTrueEthNetwork(): Promise<boolean> {
    if (!env) return false
    const network = await env.request({ method: "eth_chainId" });
    return network === networkParams.networkHexID;
}

export async function WindowEthAuth(): Promise<account> {
    return new Promise(async (resolve, reject) => {
        if (!env) {
            // Checking mobile device
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.location.href = network.mobileMetamaskUrl;
                resolve("");
            } else {
                reject("Wallet not found");
            }
        }

        try {
            const accs = await env.request({ method: "eth_requestAccounts" }, network.connect)
    
            if (!await IsTrueEthNetwork()) {
    
                await env.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: networkParams.networkHexID,
                        chainName: networkParams.chainName,
                        nativeCurrency: {
                            name: networkParams.ethSymbol,
                            symbol: networkParams.ethSymbol,
                            decimals: 18
                        },
                        rpcUrls: [networkParams.rpcUrl] // , reserveRpcs[0], reserveRpcs[1]
                    }]
                })
            }
    
            if (!await IsTrueEthNetwork()) {
                reject("User had refused to connect with using network");
            }

            if (!accs[0]) {
                reject("User wallet address not found");
            }
            
            walletAddress = accs[0];
            resolve(walletAddress);
    
        } catch (e) {
            reject(e.message);
        }
    })
}

export async function SubscribeOnAccountChanging(): Promise<account> {
    return new Promise((resolve, reject) => {
        if (!env) {
            reject("Wallet not found");
        }
        env.on('accountsChanged', () => {
            resolve(WindowEthAuth());
        });
        env.on('chainChanged', () => {
            resolve(WindowEthAuth());
        });
    })
}

export function EmitAccountEvent(eventName = walletChangingEventName, account: account): void {
    const eventOptions: CustomEventInit = { detail: { account: account} };
    const event = new CustomEvent(eventName, eventOptions);
    window.dispatchEvent(event);
  }

export function SubscribeOnWalletChangesAuto (): void {
    if (!env) {
        throw new Error("Wallet not found");
    }

    env.on('accountsChanged', function () {
        WindowEthAuth().then(account => {
            EmitAccountEvent(walletChangingEventName, account)
        })
      })
      
    env.on('chainChanged', function () {
        WindowEthAuth().then(account => {
            EmitAccountEvent(walletChangingEventName, account)
        })
     })
}