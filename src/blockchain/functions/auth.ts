import { connect, env, mobileUrl, networkParams, reserveRpcs, walletChangingEventName } from "../config";
import { account } from "../types";

export function IsTrueNetwork(): boolean {
    if (!env) return false
    return env.chainId === networkParams.networkHexID;
}

async function NetworkAuth(): Promise<account> {
    if (!env) {
        // Checking mobile device
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.location.href = mobileUrl
        }
        return null
    }

    try {
        const accs = await env.request({ method: "eth_requestAccounts" }, connect)
        const network = env.chainId

        if (network !== networkParams.networkHexID) {

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

        if (!IsTrueNetwork()) {
            return ""
        }

        return accs[0] || ""

    } catch (e) {
        return ""
    }

}

async function SubscribeOnAccountChanging(): Promise<account> {
    return new Promise((resolve, reject) => {
        if (!env) {
            reject("Wallet not found");
        }

        env.on('accountsChanged', function () {
            resolve(NetworkAuth());
        });
        env.on('chainChanged', function () {
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
