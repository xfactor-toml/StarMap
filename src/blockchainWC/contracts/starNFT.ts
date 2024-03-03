import { NFTAbi } from "./token"

export const StarNFTAbi = [
    'function CalcCreationCost (uint32 level)',
    'function GetTotalStarCount () view returns (uint)',
    'function IsRaceExists (string memory _race) view returns (bool)',
    'function safeMint(address to, string memory uri, string memory _name, string memory _race, uint coordX, uint coordY, uint coordZ )',
    'function GetStarParams (uint256 tokenId) view returns (StarParams memory)',
    'function UpdateStarFuel (uint256 tokenId, uint fuel)',
    'function UpdateStarLevelFuel (uint256 tokenId, uint fuel)',
    'function IncreaseStarLevel ( uint256 tokenId )',
    ...NFTAbi
  ]