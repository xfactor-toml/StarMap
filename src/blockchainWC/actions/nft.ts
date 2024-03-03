import { ethers } from "ethers";
import { PlasmaAbi, TokenAbi } from "../contracts/token";
import { contracts, settings } from "../network";
import { StarNFTAbi } from "../contracts/starNFT";
import { Coords, Race } from "~/blockchain/types";
import { ExtractRace } from "~/blockchain/functions/starnft";

export interface CreateStarWCArgs {
  walletProvider: ethers.providers.ExternalProvider;
  owner: string;
  name: string;
  uri: string;
  race: Race;
  coords: Coords;
}

export interface ReFuelWCArgs {
  walletProvider: ethers.providers.ExternalProvider;
  user: string;
  starId: number;
  amount: number;
  target: "existence" | "levelup";

}

export async function CreateNewStarWC(dt: CreateStarWCArgs) {
  return new Promise(async (resolve, reject) => {

    if (!dt.walletProvider) reject("Invalid provider");
    const ethersProvider = new ethers.providers.Web3Provider(dt.walletProvider);
    const signer = ethersProvider.getSigner();
    const StarContract = new ethers.Contract(
      contracts.StarNFT,
      StarNFTAbi,
      signer
    );
    const coordX = String(Math.round(dt.coords.X * 1000000));
    const coordY = String(Math.round(dt.coords.Y * 1000000));
    const coordZ = String(Math.round(dt.coords.Z * 1000000));

    try {
      const tx = await StarContract.safeMint(
        dt.owner,
        dt.uri,
        dt.name,
        dt.race,
        coordX,
        coordY,
        coordZ
      );
      const receipt = await ethersProvider.waitForTransaction(tx.hash);
      if (!receipt || !receipt.blockNumber) {
        reject("Transaction not included in block");
        return;
      }
      resolve(true);
    } catch (e) {
      reject("Txn failed : " + e.message);
    }
  });
}

export async function RefuelStar(dt: ReFuelWCArgs) {
  return new Promise(async (resolve, reject) => {
    if (dt.amount == 0 || !dt.walletProvider || !dt.user) {
      reject("Invalid arguments");
      return null;
    }

    const ethersProvider = new ethers.providers.Web3Provider(dt.walletProvider);
    const fuel = String(dt.amount * 10 ** settings.decimals);
    const signer = ethersProvider.getSigner();
    const StarContract = new ethers.Contract(
      contracts.StarNFT,
      StarNFTAbi,
      signer
    );
    const Plasma = new ethers.Contract(contracts.plasma, TokenAbi, signer);
    const allowedAmount =
      Number(await Plasma.allowance(dt.user, contracts.StarNFT)) /
      10 ** settings.decimals;
    console.log(allowedAmount);
    if (allowedAmount < dt.amount) {
      reject("Insufficient plasma approved");
      return null;
    }

    try {
      const tx =
      dt.target === "existence"
          ? await StarContract.UpdateStarFuel(String(dt.starId), fuel)
          : await StarContract.UpdateStarLevelFuel(String(dt.starId), fuel);
      const receipt = await ethersProvider.waitForTransaction(tx.hash);
      if (!receipt || !receipt.blockNumber) {
        reject("Transaction not included in block");
        return;
      }
      // const result = await StarContract.GetStarParams(String(dt.starId));
      resolve(true);
    } catch (e) {
      reject(e.message);
      return null;
    }
  });
}

export async function IncreaseStarLevel(
  walletProvider: ethers.providers.ExternalProvider,
  starId: number
) {
  return new Promise(async (resolve, reject) => {
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = ethersProvider.getSigner();
    const StarContract = new ethers.Contract(
      contracts.StarNFT,
      StarNFTAbi,
      signer
    );
    try {
      const tx = await StarContract.IncreaseStarLevel(String(starId));
      const receipt = await ethersProvider.waitForTransaction(tx.hash);
      if (!receipt || !receipt.blockNumber) {
        reject("Transaction not included in block");
        return;
      }
      // const result = await StarContract.GetStarParams(String(starId));
      resolve(true);
    } catch (e) {
      reject("Txn failed : " + e.message);
    }
  });
}
