import { w3cwebsocket as WebSocket } from 'websocket';
import Web3 from "web3";
import { wsServerUrl, env } from "../config";

export async function GameAuth ( account : string ) : Promise<string> {

     if (!env || !account) {
        return ""
     }
     
     const wss = new WebSocket(wsServerUrl)
     const web3 = new Web3(env)

     return await new Promise(resolve => {
        wss.onopen = (ws : WebSocket) => {
            wss.onmessage = async (message : any) => {

                try {
                    const msg = JSON.parse(message.data)

                    if (msg.action === "auth" && msg.state === "success") {
                        resolve(ws)
                        return ws
                    } 
                    
                    const dt = new Date().getTime()
                    const signMsg = "auth_" + String(dt - (dt % 600000))
                    const signature = await web3.eth.personal.sign(signMsg, account, '')
                    wss.send(JSON.stringify({
                        action: "auth",
                        signature: signature
                    }))
                } catch (e) {
                    console.log(e.message)
                }
            }

            wss.onclose = () => {
                resolve('')
                return ''
            }
        }
     })
}

export async function EnterGame (ws : WebSocket) {
    return await new Promise(resolve =>{
        ws.send(JSON.stringify({
            action: "entergame"
        })).then(() => {
            resolve(true)
        })
    })

}