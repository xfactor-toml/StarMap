import { connect, env, mobileUrl, networkParams, reserveRpcs, walletChangingEventName } from "../config";
import { account } from "../types";

let walletAddress = '';

export function getWalletAddress(): string {
    return walletAddress;
}

export function isWalletConnected(): boolean {
    return walletAddress != '';
}

export async function IsTrueNetwork(): Promise<boolean> {
    if (!env) return false
    const network = await env.request({ method: "eth_chainId" });
    return network === networkParams.networkHexID;
}

async function NetworkAuth(): Promise<account> {
    return new Promise(async (resolve, reject) => {
        if (!env) {
            // Checking mobile device
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.location.href = mobileUrl;
                walletAddress = '';
                resolve("");
            } else {
                reject("Wallet not found");
            }
        }

        try {
            const accs = await env.request({ method: "eth_requestAccounts" }, connect)
    
            if (!await IsTrueNetwork()) {
    
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
    
            if (!await IsTrueNetwork()) {
                walletAddress = '';
                reject("User had refused to connect with using network");
            }

            if (!accs[0]) {
                walletAddress = '';
                reject("User wallet address not found");
            }
            
            walletAddress = accs[0];
            resolve(walletAddress);
    
        } catch (e) {
            reject(e.message);
        }
    })

}

async function SubscribeOnAccountChanging(): Promise<account> {
    return new Promise((resolve, reject) => {
        if (!env) {
            reject("Wallet not found");
        }
        env.on('accountsChanged', () => {
            resolve(NetworkAuth());
        });
        env.on('chainChanged', () => {
            resolve(NetworkAuth());
        });
    })
}

function EmitAccountEvent(eventName = walletChangingEventName, account: account): void {
    const eventOptions: CustomEventInit = { detail: { account: account} };
    const event = new CustomEvent(eventName, eventOptions);
    window.dispatchEvent(event);
  }

function SubscribeOnWalletChangesAuto (): void {
    if (!env) {
        throw new Error("Wallet not found");
    }

    env.on('accountsChanged', function () {
        NetworkAuth ().then(account => {
            EmitAccountEvent(walletChangingEventName, account)
        })
      })
      
    env.on('chainChanged', function () {
        NetworkAuth ().then(account => {
            EmitAccountEvent(walletChangingEventName, account)
        })
     })
}

export {
    NetworkAuth,
    SubscribeOnAccountChanging,
    SubscribeOnWalletChangesAuto
}
