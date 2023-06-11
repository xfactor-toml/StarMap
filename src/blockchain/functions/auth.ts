import { connectOptions, env, networkParams, reserveRpcs } from "../config";
import { account } from "../types";

export function IsTrueNetwork (): boolean {
    return env.chainId === networkParams.networHexID
}

async function NetworkAuth (): Promise<account> {
    if (!env) {
        return null
    }

    const accs = await env.request({ method: "eth_requestAccounts" }, connectOptions)
    const network = env.chainId

    if (network !== networkParams.networHexID) {
        await env.request({
          method: 'wallet_addEthereumChain',
          params: [{ 
            chainId: networkParams.networHexID,
            chainName: networkParams.chainName,
            nativeCurrency: {
                name: networkParams.ethSymbol,
                symbol: networkParams.ethSymbol,
                decimals: 18
            },
            rpcUrls: [networkParams.rpcUrl, reserveRpcs[0], reserveRpcs[1]]
          }]
        })
      }

    if (!IsTrueNetwork ()) {
        return null
    }

    return accs[0]
}

async function SubscribeOnAccountChanging (): Promise<account> {
    if (!env) {
        return null
    }

    return await new Promise((resolve) => {
        env.on('accountsChanged', function () {
            resolve(NetworkAuth ())
          })
          
        env.on('networkChanged', function () {
            resolve(NetworkAuth ())
         })
    })
}

export {
    NetworkAuth,
    SubscribeOnAccountChanging
}