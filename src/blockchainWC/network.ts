export const opBSCTestnet = {
  chainId: 5611,
  name: "opBSC Testnet",
  currency: "TBNB",
  explorerUrl: "https://testnet.opbnbscan.com/",
  rpcUrl: "https://opbnb-testnet-rpc.bnbchain.org",
};

export const projectId = process.env.WALLETCONNECT_PROJECT_ID;

export const metadata = {
    name: 'Vorpal',
    description: 'Vorpal starmap',
    url: 'https://starmap.vorpal.finance',
    icons: []
  }

export const contracts = {
  plasma: "0xE9497F5387074d5eEbb25e9D0a471E88797cb3FB",
  reward: "0xA6497E6899859967E887931110ab95b095637d87",
  SPORE: "0xE008BaeB32712d222c23C3741acd2BB3C16B63dc",
  SPICE: "0x21a95F022CE42e4f147a480197AAf04c50fF264C",
  METAL: "0x9780aed8D3035f3851481F4c3C6050EDe10c1029",
  BIOMASS: "0x6bc04BBd78fd185c8D24a62798150E24F5dEF029",
  CARBON: "0x1a68c3338468b3334721cc70f886ddf3E24C579B",
  LaserNFT: "0x8B3f24aF7b00A0E0089F2D5e9D78a6B3C5247724",
  BoxNFT: "0x45fd9e5061714682fd25050b07864F5704a805F2", 
  StarNFT: "0x0EE0275faCF743F774fC3aeF5F54eAF7e0E7072d",
  RewardSender: "0x7a01248509cc6Ce6A820a9504D600597689b4449"
};

export const settings = {
    decimals: 18
}