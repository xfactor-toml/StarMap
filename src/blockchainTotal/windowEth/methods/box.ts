import Web3 from "web3";
import { jsonABIs, network } from "../../config";
import { web3window as web3 } from "../auth";

export async function OpenBox(env = web3, address: string, _boxId: number) {
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

export async function OpenBoxDefaultEnv(address: string, _boxId: number) {
    return OpenBox(web3, address, _boxId);
}