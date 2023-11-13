import { w3cwebsocket as WebSocket } from 'websocket';
import Web3 from "web3";
import { wsServerUrl, env, pingPongDelay } from "../config";

export async function GameAuth(account: string): Promise<WebSocket | null> {
  if (!env || !account) {
    return null;
  }

  const wss = new WebSocket(wsServerUrl);
  const web3 = new Web3(env);

  return await new Promise((resolve) => {
    wss.onopen = (ws: WebSocket) => {
      let isAuthRequested = false;
      const PingPong = setInterval(() => {
        wss.send('ping');
      }, pingPongDelay);
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
        clearInterval(PingPong)
        wss.onClientCloseEvent?.apply(wss.onClientCloseContext);
        resolve(null);
        return null;
      };
    };
  });
}
