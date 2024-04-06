
import { GetBalance } from "../../getters/tokens";
import { jsonABIs, network } from "../../config";
import { IsTrueEthNetwork, WindowEthAuth, web3window as web3 } from "../auth";
import { Tokens } from "../../getters";
import { account } from "../../types";

export async function MintPlasma (account : string, amount : number, w3 = web3) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        if (!network.env) {
            reject("Wallet not found")
        }

        if (!account) {
            reject("Account not specified")
        }
        const GasPrice = await w3.eth.getGasPrice()
        try {
            const contract = new w3.eth.Contract(jsonABIs.ERC20ABI, network.contracts.plasma)

            await contract.methods.Mint(String(amount * (10 ** network.decimals)), account).send({
                from: account,
                gasPrice: Number(GasPrice) < 1600000000 ? '1600000000' : String(Number(GasPrice))
            })
            resolve(await GetBalance(account))

        } catch (e : any) {
            reject(e.message)
        }
    })
  }

export async function ApprovePlasma (
    owner: account, 
    amount: number, 
    spender : account = network.contracts.starNFT,
    w3 = web3) : Promise<number> {
    return new Promise(async (resolve, reject) => {
        if (!owner || !await IsTrueEthNetwork()) owner = await WindowEthAuth();
        
    if (!owner || !network.env || !spender || !await IsTrueEthNetwork()) {
        reject("User auth failed")
    }
    try {

        const contract = new w3.eth.Contract(jsonABIs.ERC20ABI, network.contracts.plasma)
        const num : number= amount * (10 ** 18)
        const amt =  String(num)
        const gs = await web3.eth.getGasPrice()
        await contract.methods.approve(spender, amt).send({
            from: owner,
            gasPrice: String(Number(gs))
          })

    } catch (e) {
        reject("Approve transaction failed")
    }

    resolve(await Tokens.GetAllowance(owner, spender));
    })

}