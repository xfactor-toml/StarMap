import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/vue";
import { Socket, io } from "socket.io-client";
import { network } from "./config";
import { AuthMethod, account } from "./types";
import { ConnectWalletWC, InitWalletconnectModal } from "./walletconnect/auth";
import { AuthByLocal, web3local } from "./local/auth";
import { WindowEthAuth, web3window } from "./windowEth";
import { lsPrivateKey } from "./config/network";
import { GenerateSignature } from "./walletconnect/methods";

export class BlockchainConnectService {
    public authMethod: AuthMethod;
    public userAccount: account;
    public displayLogin: string;
    public walletAddress: string;

    public GetDefaultAuthMethod() {
        let tgLogin;
        try {
            tgLogin = window.Telegram.WebApp.initDataUnsafe.user.username;
        } catch (e) {
            tgLogin = "";
        }

        if (tgLogin) {
            this.displayLogin = tgLogin;
            return "Local"
        }
        if (network.env && network.env.request) {
            return "WindowEth"
        }
        try { 
          const { address } = useWeb3ModalAccount()
          console.log(address, address.value)
           if (address && address.value) return "Walletconnect"
        } catch (e) {
            return "Local"
        }
        return "Local"
    }

    constructor() {
        this.authMethod = this.GetDefaultAuthMethod();
        if (this.authMethod !== "Local") {
            InitWalletconnectModal();
        }
    }

    public SetupAuthMethod (method: AuthMethod) {
        this.authMethod = method;
    }

    public async Auth(method: AuthMethod = this.authMethod): Promise<string> {
        switch (method) {
            case "Walletconnect" :
                this.walletAddress = await ConnectWalletWC ();
                return this.walletAddress;
            case "WindowEth" :
                this.walletAddress = await WindowEthAuth();
                return this.walletAddress;
            default:
                this.walletAddress = await AuthByLocal();
               return this.walletAddress;
        }
    }

    public async GetSignedAuthMessage(): Promise<string> {
        return new Promise (async (resolve, reject) => {
            const dt = new Date().getTime();
            const signMsg = "auth_" + String(dt - (dt % 600000));
            let signature = ""
            if (this.authMethod === "Local") {
                let tempPK = localStorage.getItem(lsPrivateKey);
                if (!tempPK) {
                    try {
                        await AuthByLocal();
                        tempPK = localStorage.getItem(lsPrivateKey);
                    } catch (e) {
                        console.log("account not created", e.message);
                        reject ("Account not exist");
                    }
                    // reject ("Account not exist");
                }
                    const sign = await web3local.eth.accounts.sign(
                        signMsg,
                        tempPK
                    );
                    signature = sign.signature;
                resolve(signature);
            }
            if (this.authMethod === "WindowEth") {
              try {
                signature = await web3window.eth.personal.sign(
                    signMsg,
                    this.userAccount,
                    ""
                );
                resolve(signature);
              } catch (e) {
                reject("Sign failed : " + e.message)
              }
            }
            if (this.authMethod === "Walletconnect") {
                const { walletProvider } = useWeb3ModalProvider();
                try {
                  const signature = await GenerateSignature(walletProvider.value, this.userAccount);
                  resolve(signature);
                } catch (e) {
                    reject("Sign failed : " + e.message)
                }
            }
            reject("Wrong auth method")
        })
    }

    public async GameAuth(): Promise<string> {
        const funcName = 'newGameAuth()';
    
        return new Promise((resolve, reject) => {
            if (!this.userAccount) reject(`${funcName}: account not found`);
    
            // auth request
            const dt = new Date().getTime();
            const signMsg = "auth_" + String(dt - (dt % 600000));
            const signaturePromise = this.GetSignedAuthMessage;
    
            signaturePromise().then((value: string) => {
                resolve(value);
            }, (reason: any) => {
                reject(reason);
            });
            
        });
    
    }

    public async GetWalletAddress() {
        if (!this.walletAddress) return await this.Auth();
        return this.walletAddress;
    }
}