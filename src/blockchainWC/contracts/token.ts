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