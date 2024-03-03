import { ethers } from "ethers";
import { contracts, settings } from "../network";
import { BoxNFTAbi } from "../contracts/boxNFT";

export async function OpenBox(
  walletProvider: ethers.providers.ExternalProvider,
  _boxId: number
) {
  return new Promise(async (resolve, reject) => {
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = ethersProvider.getSigner();
    const BoxContract = new ethers.Contract(
      contracts.BoxNFT,
      BoxNFTAbi,
      signer
    );
    try {
      const tx = await BoxContract.openBox(String(_boxId));
      const receipt = await ethersProvider.waitForTransaction(tx.hash);
        if (!receipt || !receipt.blockNumber) {
          reject("Transaction not included in block");
          return;
        }
      resolve(true);
    } catch (e) {
      reject("Failed to open: " + e.message);
    }
  });
}
