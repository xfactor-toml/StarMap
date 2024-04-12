export const TokenAbi = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function balanceOf(address) view returns (uint)',
    'function approve(address spender, uint amount)',
    'function transfer(address to, uint amount)',
    'function allowance(address tokenOwner, address spender) view returns (uint remaining)',
    'event Transfer(address indexed from, address indexed to, uint amount)'
  ]

export const PlasmaAbi = [
  ...TokenAbi,
  'function Mint (uint amount, address to)'
]

export const NFTAbi = [
    'function balanceOf(address owner) view returns (uint balance)',
    'function ownerOf(uint tokenId) view returns (address owner)',
    'function safeTransferFrom(address from, address to, uint tokenId)',
    'function transferFrom(address from, address to, uint tokenId)',
    'function approve(address to, uint tokenId)',
    'function transferFrom(address from, address to, uint tokenId)',
    'function approve(address to, uint tokenId)',
    'function getApproved(uint tokenId) view returns (address operator)',
    'function setApprovalForAll(address operator, bool _approved)',
    'function isApprovedForAll( address owner, address operator ) external view returns (bool)'
]

export const RewardSenderAbi = [
    'function PullPrizeFund (uint256 _amount)',
    'function withdrawRewards ()',
    'function balanceOf (address _user) view returns (uint)',
    'function getUserWinsCount (address _user) view returns (uint)',
    'function getUserWinHistory (address _user) view returns (uint256[])',
    'function getGameCount () view returns (uint)',
    'function getVictoryData (uint _winId) view returns (RewardData)'
]

export const BoxNFTAbi = [
    'function safeMint (address to, string uri )',
    'function openBox (uint _boxId, uint _random)',
    'function getBoxInfo (uint _boxId) view returns (boxInfo)',
    ...NFTAbi
]

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