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
  LaserNFT: "0x22415C3E4C7590c1Ba5C49a049160c8a3f0b03E5",
  BoxNFT: "0x37f299a556A1d54E0c97a784A74A2ebafeb4ab42", // "0x3F81F68836A08169e98bDe00077430cB202634DD",
  StarNFT: "0x0EE0275faCF743F774fC3aeF5F54eAF7e0E7072d",
  RewardSender: "0xc5036483C842171E0EB33d4Bafa28E4E539f664D" // "0xfb3277aee2a414b3663371BEF50e05B163FDad61",
};

export const settings = {
    decimals: 18
}