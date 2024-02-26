import { w3cwebsocket as WebSocket } from 'websocket';
import Web3 from "web3";
import { wsServerUrl, env } from "../config";

export async function GameAuth(account: string): Promise<WebSocket | null> {
    if (!env || !account) {
        return null;
    }

    const wss = new WebSocket(wsServerUrl);
    const web3 = new Web3(env);

    return new Promise((resolve) => {

        wss.onopen = (ws: WebSocket) => {
            let isAuthRequested = false;
            wss.onmessage = async (message: any) => {

                try {
                    const msg = JSON.parse(message.data);

                    if (msg.action === "auth" && msg.state === "success") {
                        wss.onmessage = null;
                        resolve(wss);
                        return wss;
                    }

                    if (!isAuthRequested) {
                        const dt = new Date().getTime();
                        const signMsg = "auth_" + String(dt - (dt % 600000));
                        const signature = await web3.eth.personal.sign(
                            signMsg,
                            account,
                            ""
                        );
                        wss.send(
                            JSON.stringify({
                                action: "auth",
                                signature: signature,
                            })
                        );
                        isAuthRequested = true;
                    }
                } catch (e) {
                    console.log(e.message);
                }
            };

            wss.onclose = () => {
                console.log("closed");
                wss.onClientCloseEvent?.apply(wss.onClientCloseContext);
                resolve(null);
                return null;
            };

        };
    });
}

export async function GenerateSignature(account: string): Promise<string> {
    return new Promise (async (resolve, reject) => {
        if (!env) reject("Web3 not found!");
        const web3 = new Web3(env);
        const dt = new Date().getTime();
        const signMsg = "auth_" + String(dt - (dt % 600000));
        try {
            const signature = await web3.eth.personal.sign(
                signMsg,
                account,
                ""
            );
            resolve(signature);
        } catch (e) {
            reject("Sign failed : " + e.message)
        }
    })
}

export async function newGameAuth(account: string): Promise<string> {
    const funcName = 'newGameAuth()';

    return new Promise((resolve, reject) => {
        if (!env) reject(`${funcName}: env not found`);
        if (!account) reject(`${funcName}: account not found`);

        const web3 = new Web3(env);

        // auth request
        const dt = new Date().getTime();
        const signMsg = "auth_" + String(dt - (dt % 600000));
        const signaturePromise = web3.eth.personal.sign(
            signMsg,
            account,
            ""
        );

        signaturePromise.then((value: string) => {
            resolve(value);
        }, (reason: any) => {
            reject(reason);
        });
        
    });

}