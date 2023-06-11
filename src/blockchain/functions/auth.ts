import { connectOptions, env, networkParams, reserveRpcs } from "../config";

export async function NetworkAuth () {
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
      
}