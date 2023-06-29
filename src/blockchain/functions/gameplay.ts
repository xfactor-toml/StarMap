import Web3 from "web3";
import WebSocket from 'ws'
import { wsServerUrl, env } from "../config";

export async function GameAuth ( account : string ) : Promise<string> {

     if (!env || !account) {
        return ""
     }
     
     const wss = new WebSocket(wsServerUrl)
     const web3 = new Web3(env)

     return await new Promise(resolve => {
        wss.on("open", (ws) => {
            wss.on("message", async (message : string) =>{
                try {
                    const msg = JSON.parse(message)

                    if (msg.action === "auth" && msg.state === "success") {
                        return String(msg.playerId)
                    }
                    
                    const dt = new Date().getTime()
                    const signMsg = "auth_" + String(dt - (dt % 600000))
                    const signature = await web3.eth.personal.sign(signMsg, account, '')
                    ws.send(JSON.stringify({
                        action: "auth",
                        signature: signature
                    }))
                } catch (e) {
                    console.log(e.message)
                }
            })

            wss.on("close", () => {
                resolve('')
                return ''
            })
        })

        wss.on("error", () => {
            resolve('')
            return ''
        })
     })
}