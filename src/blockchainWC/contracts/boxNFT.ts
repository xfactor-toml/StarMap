import { NFTAbi } from "./token";

export const BoxNFTAbi = [
    'function safeMint (address to, string uri )',
    'function openBox (uint _boxId, uint _random)',
    'function getBoxInfo (uint _boxId) view returns (boxInfo)',
    ...NFTAbi
]