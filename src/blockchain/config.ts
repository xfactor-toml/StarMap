import { connectRpc } from "./types"

export const mobileUrl = `https://metamask.app.link/dapp/${document.location.hostname}/`
export const env = window.ethereum

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
   networkId: 97,
   networHexID: '0x61',
   chainName: 'Binance Tsetnet',
   ethSymbol: 'TBNB',
   rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/"
 }

export const contracts = {
    plasma: "0x5291337c93a0c86E570F4189965BB9Cca48A474e",
    starNFT: "0x7b6f4297A65453114112B3E51A7BD52405f2b4f1"
}

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
