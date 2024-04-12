import Web3 from 'web3';
import { network, jsonABIs } from '../config';

export const web3 = new Web3(network.networkParams.rpcUrl);
export const reader = web3;

export const tokenContracts = {
    VRP: new web3.eth.Contract(jsonABIs.ResourceToken, network.contracts.reward),
    Spore: new web3.eth.Contract(jsonABIs.ResourceToken, network.contracts.SPORE),
    Spice: new web3.eth.Contract(jsonABIs.ResourceToken, network.contracts.SPICE),
    Metal: new web3.eth.Contract(jsonABIs.ResourceToken, network.contracts.METAL),
    Biomass: new web3.eth.Contract(jsonABIs.ResourceToken, network.contracts.BIOMASS),
    Carbon: new web3.eth.Contract(jsonABIs.ResourceToken, network.contracts.CARBON),
    Plasma: new web3.eth.Contract(jsonABIs.ERC20ABI, network.contracts.plasma),
}

export const nftContracts = {
    BoxNFT: new web3.eth.Contract(jsonABIs.BoxNFT, network.contracts.BoxNFT),
    LaserNFT: new web3.eth.Contract(jsonABIs.LaserNFT, network.contracts.LaserNFT),
    StarNFT: new web3.eth.Contract(jsonABIs.StarNFTABI, network.contracts.starNFT)
}

export const rewardContract = new web3.eth.Contract(jsonABIs.RewardSenderWithChoose, network.contracts.RewardSender);
