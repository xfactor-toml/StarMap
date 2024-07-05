import { TonConnect, isWalletInfoCurrentlyInjected  } from '@tonconnect/sdk';

const connector = new TonConnect({
    manifestUrl: 'https://starmap.vorpal.finance/tonmanifest.json',// Замените на ваш URL манифеста
});

export async function TONPreconnect() {
    connector.getWallets().then(async (list) => {
        connector.onStatusChange((wallet) => {
            console.log(wallet)
        })
        console.log("Wallet list: ", list);
        const usingItem = list.find((item) => {
            return isWalletInfoCurrentlyInjected(item)
        })
        console.log("Using list: ", usingItem);
        if (!usingItem) {
            alert("No TON wallet found");
            return;
        }
        const itm: any = usingItem
        connector.connect({
            jsBridgeKey: itm.jsBridgeKey
        })
    }).catch((e) => {
        console.log("Err: ", e)
    });
}

export async function TheOpenNetworkAuth (): Promise<string> {
    return new Promise(async (resolve, reject) => {
        console.log("TON auth called")
        connector.getWallets().then(async (list) => {
            console.log("Wallet list: ", list);
            const usingItem = list.find((item) => {
                return isWalletInfoCurrentlyInjected(item)
            })
            if (!usingItem) {
                console.log("No TON wallet found");
                resolve(null)
            }
            connector.onStatusChange((wallet) => {
                if (!wallet || !wallet.account) {
                    console.log("No access to wallet");
                    resolve(null)
                }
                resolve(wallet.account.publicKey)
            })
            const itm: any = usingItem
            connector.connect({
                jsBridgeKey: itm.jsBridgeKey
            })
        })
        return;
    })
}