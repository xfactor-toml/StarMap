import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/vue";
import { network } from "./config";
import { AuthMethod, TelegramAuthData, account } from "./types";
import { ConnectWalletWC, InitWalletconnectModal } from "./walletconnect/auth";
import { AuthByLocal, web3local } from "./local/auth";
import { WindowEthAuth, web3window } from "./windowEth";
import { lsPrivateKey } from "./config/network";
import { GenerateSignature } from "./walletconnect/methods";
import * as getters from "./getters";
import * as store from "./local/methods/store";
import { web2assets } from "./getters/boxesWeb2";
import { OpenBoxWeb2 } from "./local/methods";
import { AcceptDuelInvitation } from "./local/methods/duel";
import { getQueryParam } from "@/utils/parsers";

export class BlockchainConnectService  {
    public authMethod: AuthMethod;
    public userAccount: account;
    public displayLogin: string;
    public walletAddress: string;
    public telegramAuthData: TelegramAuthData;
    private static instance: BlockchainConnectService | null = null;
    private TelegramInfo: any = window.Telegram;
    public getters = getters;
    public store = store;
    public telegramInitData: any;
    

    public LoadTelegramData() {
        const tg = this.TelegramInfo;
        if (tg && tg.WebApp && tg.WebApp.initData) {
            this.telegramInitData = tg.WebApp.initData;
            const initDataSearchParams = new URLSearchParams(window.Telegram.WebApp.initData);
            let inviterId = initDataSearchParams.get('start_param')?.replace("inviterId_", "");

            if (inviterId) {
                AcceptDuelInvitation(this.telegramInitData, inviterId).then((res) => {
                    //alert("Duel found, invitation accepted")
                    if (res) {
                        window.dispatchEvent(new CustomEvent('duelEvent', { detail: { with: inviterId } }))
                    } 
                }).catch((err) => {
                    console.log(err)
                    // alert("Duel invitation failed")
                })
            }
            const user = JSON.parse(initDataSearchParams.get('user'));
            const authDate = initDataSearchParams.get('auth_date');
            const hash = initDataSearchParams.get('hash');
            const webApp = tg.WebApp;
            webApp.expand();
            window.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
            window.scrollTo(0, 100);
            // webApp.isClosingConfirmationEnabled = true;

            const overflow = 100
            document.body.style.overflowY = 'hidden'
            document.body.style.marginTop = `${overflow}px`
            document.body.style.height = window.innerHeight + overflow + "px"
            document.body.style.paddingBottom = `${overflow}px`
            window.scrollTo(0, overflow)
        
            let ts: number | undefined
        const onTouchStart = (e: TouchEvent) => {
          ts = e.touches[0].clientY
        }
        const onTouchMove = (e: TouchEvent) => {
          if (document.body) {
            const scroll = document.body.scrollTop
            const te = e.changedTouches[0].clientY
            if (scroll <= 0 && ts! < te) {
              e.preventDefault()
            }
          } else {
            e.preventDefault()
          }
        }
        document.documentElement.addEventListener('touchstart', onTouchStart, { passive: false })
        document.documentElement.addEventListener('touchmove', onTouchMove, { passive: false })
        
            // alert("Closing confirmation 12: ");
            // document.body.style.height = '100vh';
            // document.body.style.overflow = 'hidden';
            // document.body.style.paddingTop = '100px';
            document.body.classList.add("tgAppBody");
            // const { enableClosingConfirmation, disableClosingConfirmation } = useWebAppClosingConfirmation()
            // enableClosingConfirmation();

            webApp.ready();
            if (hash) {
                const AuthData: TelegramAuthData = {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    hash: hash,
                    auth_date: Number(authDate)
                }
                this.telegramAuthData = AuthData;
                return;
            }
        }
        const urlAuthParams = new URLSearchParams(window.location.search);
        const authHash = urlAuthParams.get('authHash');
        const authDate = urlAuthParams.get('authDate');
        const userId = urlAuthParams.get('id');
        const firstName = urlAuthParams.get('firstName');
        const lastName = urlAuthParams.get('lastName');
        const username = urlAuthParams.get('userName');
        const AuthData: TelegramAuthData = {
            id: Number(userId),
            first_name: firstName,
            last_name: lastName || "",
            username: username || "",
            hash: authHash || "",
            auth_date: Number(authDate)
        }
        this.telegramAuthData = AuthData;
        // console.log("Auth data: ", AuthData);
        if (!tg) {
            console.log("Telegram script not installed");
            return;
        }
        const webApp = tg.WebApp;
        if (!webApp) {
            console.log("Web app telegram interface not found");
            return;
        }
        webApp.expand();
        if (!authHash || !authDate) {
            console.log("Required auth data not found");
        }
        if (!webApp.initDataUnsafe) {
            console.log("Failed to get user id");
            return;
        }
        const user = webApp.initDataUnsafe.user;
        if (!user) {
            console.log("User not found ");
            return;
        }
        if (!user.username) {
            alert("You need to have a visible username to enter a duel");
        }
    }

    public getDefaultAuthMethod(): AuthMethod {
        return "Local";
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

    private constructor() {
        this.authMethod = this.getDefaultAuthMethod();
        window.addEventListener('authEvent', (event: CustomEvent) => {
            console.log("Auth passed, login: ", event.detail?.username)
            this.telegramAuthData = event.detail;
        })
        if (this.authMethod === "Walletconnect") {
            InitWalletconnectModal();
        }
        this.LoadTelegramData();
    }

    public static getInstance(): BlockchainConnectService {
        if (!BlockchainConnectService.instance) {
            BlockchainConnectService.instance = new BlockchainConnectService();
        }
        return BlockchainConnectService.instance;
      }

    public SetupAuthMethod (method: AuthMethod) {
        this.authMethod = method;
    }

    public async connect(method: AuthMethod = this.authMethod): Promise<string> {
        switch (method) {
            case "Walletconnect" :
                this.walletAddress = (await ConnectWalletWC()).value;
                return this.walletAddress;
            case "WindowEth" :
                this.walletAddress = await WindowEthAuth();
                return this.walletAddress;
            default:
                this.walletAddress = await AuthByLocal();
               return this.walletAddress;
        }
    }

    public GetAuthMessageToSign(): string {
        const dt = new Date().getTime();
        const signMsg = "auth_" + String(dt - (dt % 600000));
        return signMsg;
    }

    public async getUserAvailableBoxes (): Promise<number[]> {
        return new Promise ((resolve, reject) => {
            if (!this.telegramAuthData?.username) {
                reject("User not authorized by login");
            }
            this.getters.BoxesWeb2.getUserBoxesToOpenWeb2 (this.telegramAuthData.username).then((res) => {
                resolve(res);
            })
        })
    }

    public async getUserAssets (): Promise<web2assets> {
        return new Promise ((resolve, reject) => {
            console.log("Username: ", this.telegramAuthData.username);
            if (!this.telegramAuthData.username) {
                reject("User not authorized by login");
            }
            this.getters.BoxesWeb2.GetGameAssetsWeb2 (this.telegramAuthData.username).then((res) => {
                resolve(res);
            })
        })
    }

    public async getSignedAuthMessage(): Promise<string> {
        return new Promise (async (resolve, reject) => {
            const signMsg = this.GetAuthMessageToSign();
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
                    this.walletAddress,
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
                  const signature = await GenerateSignature(walletProvider.value, this.walletAddress);
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
            const signaturePromise = this.getSignedAuthMessage;
    
            signaturePromise().then((value: string) => {
                resolve(value);
            }, (reason: any) => {
                reject(reason);
            });
            
        });
    
    }

    public async OpenBoxByTg (_boxId: number) {
        if (!this.telegramAuthData.hash) {
            Promise.reject("User not authorized");
            return;
        }
        return await OpenBoxWeb2 (_boxId, "", this.telegramAuthData, this.telegramInitData)
    }

    public async getWalletAddressWithConnect() {
        if (!this.walletAddress) return await this.connect();
        return this.walletAddress;
    }

    public TelegramLogin() {
        return this.telegramAuthData?.username || "";
    }

    public isTelegram(): Boolean {
        return this.telegramAuthData?.id ? true : false
    }

    public isConnected(): Boolean {
        return this.walletAddress ? true: false;
    }

    public getWalletAddress() {
        return this.walletAddress;
    }

    public getTelegramAuthData() : TelegramAuthData | undefined {
        return this.telegramAuthData;
    }

    setTestUserName(aUserName: string) {
        if (this.telegramAuthData) {
            this.telegramAuthData.username = aUserName;
        }
        else {
            this.telegramAuthData = {
                id: 0,
                first_name: '',
                last_name: "",
                hash: "",
                auth_date: 0,
                username: aUserName
            };
        }
    }

}