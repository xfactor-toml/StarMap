export const mobileUrl = `https://metamask.app.link/dapp/${document.location.hostname}/`
export const env = window.ethereum

export const connectOptions = {
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
    plasma: "0xBC8F69419A68B377607067FEc8D38ab26070879D",
    starNFT: "0xc79cF23fD363e268e5B4c09c1069483a41A7Fd8e"
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