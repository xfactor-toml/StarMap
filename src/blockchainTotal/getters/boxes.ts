import Web3 from 'web3';
import { nftContracts, rewardContract, web3 } from './common';
import * as config from "../config";
import { contracts, decimals, fastDataServerUrl } from '../config/network';
import { WinData, BoxData } from '../types';

export async function getNextWinId() {
    return await rewardContract.methods.getGameCount().call()
}

export async function getWinData(_winId: number): Promise<WinData> {
    const winData: WinData = await rewardContract.methods.getVictoryData(_winId).call()
    return winData
}

export async function getLaserLevel(_laserId: number) {
    const laserLevel: number = await nftContracts.LaserNFT.methods.GetTokenLevel(_laserId).call()
    return laserLevel;
}

export async function getUserLaserList(_user: string) {
    const laserList: number[] = await nftContracts.LaserNFT.methods.getUserCreationHistory(_user).call();
    return laserList;
}

export async function getUserAvailableLaserLevels(_user: string) {
    const list: number[] = [];
    const laserNFTs = await getUserLaserList(_user);
    for (let j = 0; j < laserNFTs.length; j++) {
        const laserLevel = await getLaserLevel(Number(laserNFTs[j]));
        if (list.indexOf(laserLevel) === -1) {
            list.push(laserLevel);
        }
    }
    return list
}

export async function getUserBoxes(_user: string) {
    const boxList: number[] = await nftContracts.BoxNFT.methods.getUserCreationHistory(_user).call();
    return boxList;
}

export async function getBoxData(_boxId: number) {
    const boxData: BoxData = await nftContracts.BoxNFT.methods.getBoxInfo(_boxId).call();
    const data = {
        type: config.network.prizeNames[boxData.rewardAddress],
        value: boxData.rewardAddress === contracts.LaserNFT ? null : (Number(boxData.rewardAmount) / (10 ** decimals)),
        laserLevel: boxData.rewardAddress === contracts.LaserNFT ? await getLaserLevel(boxData.rewardId) : null,
        isPaid: boxData.isPaid
    }
    return data;
}

export async function getUserBoxesToOpen(_user: string) {
    const list: number[] = [];
    const allBoxes = await getUserBoxes(_user);
    for (let j = 0; j < allBoxes.length; j++) {
        const dt = await getBoxData(allBoxes[j]);
        if (!dt.isPaid) list.push(allBoxes[j]);
    }
    return list;
}

export async function getUserWinContractBalance(_user: string) {
    const balance = Number(await rewardContract.methods.balanceOf(_user).call());
    return Number(balance / (10 ** decimals));
}

export function GetBoxPrizeType(prizeAddress: string) {
    if (prizeAddress = contracts.LaserNFT) {
        return "laser"
    }
    for (let key in contracts) {
        if (contracts[key] === prizeAddress) {
            return key;
        }
    }
}

