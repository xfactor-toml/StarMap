import { NFTAbi } from "./token"

export const StarNFTAbi = [
  'function CalcCreationCost (uint32 level)',
  'function GetTotalStarCount () view returns (uint)',
  'function IsRaceExists (string _race) view returns (bool)',
  'function safeMint(address to, string uri, string _name, string _race, uint coordX, uint coordY, uint coordZ )',
  'function GetStarParams (uint256 tokenId) view returns (StarParams)',
  'function UpdateStarFuel (uint256 tokenId, uint fuel)',
  'function UpdateStarLevelFuel (uint256 tokenId, uint fuel)',
  'function IncreaseStarLevel ( uint256 tokenId )',
  ...NFTAbi
]