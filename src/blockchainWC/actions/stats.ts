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

export async function GenerateSignature(walletProvider: ethers.providers.ExternalProviderб account: string): Promise<string> {
  return new Promise (async (resolve, reject) => {
      if (!walletProvider) reject("Web3 not found!");
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const dt = new Date().getTime();
      const signMsg = "auth_" + String(dt - (dt % 600000));
      try {
          const signature = await signer.signMessage(signMsg);
          resolve(signature);
      } catch (e) {
          reject("Sign failed : " + e.message)
      }
  })
}
