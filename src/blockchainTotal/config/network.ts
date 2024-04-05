import { connectRpc } from "../types"

export const mobileMetamaskUrl = `https://metamask.app.link/dapp/${document.location.hostname}/`;
export const wsServerUrl = 'wss://staging-api.vorpal.finance/ws/';
export const fastDataServerUrl = 'https://staging-api.vorpal.finance/';
export const walletChangingEventName = 'wallet';
export const env = window.ethereum
export const pingPongDelay = 3000
export const decimals = 18;
export const maxStarLevel = 3;

export const connect : connectRpc = {
    keepAlive: true,
    withCredentials: false,
    timeout: 20000, // ms
    headers: [
        {
            name: 'Access-Control-Allow-Origin',
            value: '*'
        }
    ]
  }

/* TESTNET! */
export const networkParams = {
   networkId: 5611,
   chainId: 5611,
   networkHexID: '0x15eb',
   chainName: 'Binance Tsetnet opBNB',
   ethSymbol: 'TBNB',
   name: "opBSC Testnet",
   currency: "TBNB",
   explorerUrl: "https://testnet.opbnbscan.com/",
   rpcUrl: "https://opbnb-testnet-rpc.bnbchain.org"
}

export const lsAddressKey = "AddressCtnr";
export const lsPrivateKey = "PrivateKeyCtnr";
export const userLoginKey = "userLogin";

/* 
// Classic BNB testnet
  export const networkParams = {
   networkId: 97,
   networHexID: '0x61',
   chainName: 'Binance Tsetnet',
   ethSymbol: 'TBNB',
   rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/"
 }

*/

export const contracts = {
    plasma: "0xE9497F5387074d5eEbb25e9D0a471E88797cb3FB",
    starNFT: "0x0EE0275faCF743F774fC3aeF5F54eAF7e0E7072d",
    reward: "0xA6497E6899859967E887931110ab95b095637d87",
    SPORE: "0xE008BaeB32712d222c23C3741acd2BB3C16B63dc",
    SPICE: "0x21a95F022CE42e4f147a480197AAf04c50fF264C",
    METAL: "0x9780aed8D3035f3851481F4c3C6050EDe10c1029",
    BIOMASS: "0x6bc04BBd78fd185c8D24a62798150E24F5dEF029",
    CARBON: "0x1a68c3338468b3334721cc70f886ddf3E24C579B",
    LaserNFT: "0x8B3f24aF7b00A0E0089F2D5e9D78a6B3C5247724",
    BoxNFT: "0x45fd9e5061714682fd25050b07864F5704a805F2", 
    RewardSender: "0x7a01248509cc6Ce6A820a9504D600597689b4449"
}

export const prizeNames = {
    "0xE008BaeB32712d222c23C3741acd2BB3C16B63dc": "spore",
    "0x21a95F022CE42e4f147a480197AAf04c50fF264C": "spice",
    "0x9780aed8D3035f3851481F4c3C6050EDe10c1029": "metal",
    "0x6bc04BBd78fd185c8D24a62798150E24F5dEF029": "biomass",
    "0x1a68c3338468b3334721cc70f886ddf3E24C579B": "carbon",
    "0xA6497E6899859967E887931110ab95b095637d87": "vrp",
    "0x8B3f24aF7b00A0E0089F2D5e9D78a6B3C5247724": "laser"
};

export const reserveRpcs = [
    "https://opbnb-testnet-rpc.bnbchain.org",
    "https://opbnb-testnet-rpc.bnbchain.org",
    "https://opbnb-testnet-rpc.bnbchain.org",
    "https://opbnb-testnet-rpc.bnbchain.org"
]
