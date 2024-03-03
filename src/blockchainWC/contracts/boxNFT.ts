import { NFTAbi } from "./token";

export const BoxNFTAbi = [
    'function safeMint (address to, string memory uri )',
    'function openBox (uint _boxId)',
    'function getBoxInfo (uint _boxId) view returns (boxInfo memory)',
    ...NFTAbi
]