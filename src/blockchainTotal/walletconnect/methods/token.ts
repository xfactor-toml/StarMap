import { ethers } from "ethers";
import { contractABIs, network } from "../../config";

export interface ApproveArgsWC {
  walletProvider: ethers.providers.ExternalProvider,
  user: string,
  token: string,
  spender: string,
  amount: number
}

export interface MintArgsWC {
  walletProvider: ethers.providers.ExternalProvider,
  user: string,
  amount: number,
  token: string
}

export async function ApproveFor(args: ApproveArgsWC) {
  return new Promise(async (resolve, reject) => {
    if (!args.walletProvider) reject("Invalid provider");
    const spending = BigInt(args.amount * 10 ** network.decimals).toString();
    const ethersProvider = new ethers.providers.Web3Provider(args.walletProvider);
    const signer = ethersProvider.getSigner();
    const TokenContract = new ethers.Contract(args.token, contractABIs.TokenAbi, signer);

    try {
      const tx = await TokenContract.approve(args.spender, spending);
      const receipt = await ethersProvider.waitForTransaction(tx.hash);
        if (!receipt || !receipt.blockNumber) {
          reject("Transaction not included in block");
          return;
        }
        resolve(
          Number(await TokenContract.allowance(args.user, args.spender)) /
            10 ** network.decimals
        );
      return;
    } catch (e) {
      console.log(e.message);
      reject("Txn failed : " + e.message);
    }
  });
}

export async function MintToken(args: MintArgsWC ) {
  return new Promise(async (resolve, reject) => {
    if (!args.walletProvider) reject("Invalid provider");
    const minting = BigInt(args.amount * 10 ** network.decimals).toString();
    const ethersProvider = new ethers.providers.Web3Provider(args.walletProvider);
    const signer = ethersProvider.getSigner();
    const TokenContract = new ethers.Contract(args.token, contractABIs.PlasmaAbi, signer);

    try {
      const tx = await TokenContract.Mint(minting, args.user);
      const receipt = await ethersProvider.waitForTransaction(tx.hash);
        if (!receipt || !receipt.blockNumber) {
          reject("Transaction not included in block");
          return;
        }
      resolve(
        Number(await TokenContract.balanceOf(args.user)) / 10 ** network.decimals
      );
      return;
    } catch (e) {
      console.log(e.message);
      reject("Txn failed : " + e.message);
    }
  });
}
