import Web3 from "web3";
import { jsonABIs, network } from "../../config";
import { web3window as web3 } from "../auth";

export async function OpenBox(address: string, _boxId: number, env = web3) {
    return new Promise(async (resolve, reject) => {
        const contract = new env.eth.Contract(jsonABIs.BoxNFT, network.contracts.BoxNFT);
		const randomValue = Math.round(Math.random() * 10000000);

        try {
            const gasPrice = await env.eth.getGasPrice();
            await contract.methods.openBox(_boxId, randomValue).send({
                from: address,
                gasPrice: String(gasPrice)
            })
            resolve(true)
        } catch (e) {
            reject("Failed to open: " + e.message)
        }
    })
}
