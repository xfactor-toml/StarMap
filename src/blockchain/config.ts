import { connectRpc } from "./types"

export const mobileUrl = `https://metamask.app.link/dapp/${document.location.hostname}/`;
export const wsServerUrl = 'wss://staging-api.vorpal.finance/ws/';
export const fastDataServerUrl = 'https://staging-api.vorpal.finance/';
export const walletChangingEventName = 'wallet';
export const env = window.ethereum
export const pingPongDelay = 3000
export const plasmaDecimals = 18;
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
   networkHexID: '0x15eb',
   chainName: 'Binance Tsetnet opBNB',
   ethSymbol: 'TBNB',
   rpcUrl: "https://opbnb-testnet-rpc.bnbchain.org"
}
 
/* 
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
    starNFT: "0x0EE0275faCF743F774fC3aeF5F54eAF7e0E7072d"
}

export const reserveRpcs = [
    "https://opbnb-testnet-rpc.bnbchain.org",
    "https://opbnb-testnet-rpc.bnbchain.org",
    "https://opbnb-testnet-rpc.bnbchain.org",
    "https://opbnb-testnet-rpc.bnbchain.org"
]

/*
export const reserveRpcs = [
	"https://data-seed-prebsc-1-s1.binance.org:8545/",
	"https://data-seed-prebsc-2-s1.binance.org:8545/",
	"http://data-seed-prebsc-1-s2.binance.org:8545/",
	"http://data-seed-prebsc-2-s2.binance.org:8545/",
	"https://data-seed-prebsc-1-s3.binance.org:8545/",
	"https://data-seed-prebsc-2-s3.binance.org:8545/",
	"https://data-seed-prebsc-1-s1.binance.org:8545/",
	"https://data-seed-prebsc-2-s1.binance.org:8545/",
	"http://data-seed-prebsc-1-s2.binance.org:8545/",
	"http://data-seed-prebsc-2-s2.binance.org:8545/",
	"https://data-seed-prebsc-1-s3.binance.org:8545/",
	"https://data-seed-prebsc-2-s3.binance.org:8545/",
	"http://data-seed-prebsc-2-s2.binance.org:8545/"
]

*/