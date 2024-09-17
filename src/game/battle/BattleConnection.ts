import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { Socket, io } from "socket.io-client";
import { GlobalParams } from "../data/GlobalParams";
import { ClaimRewardData, DebugTestData, GameCompleteData, AcceptScreenData, PackTitle, SkillRequest, StartGameData, SearchGameData, SignData, PlayerLoadingData, Emotion, EmotionData, DuelInfo, MessagePack, ShopData } from "./Types";
import { BlockchainConnectService } from "~/blockchainTotal";
import { GameEventDispatcher } from "../events/GameEvents";

export enum ConnectionEvent {
  disconnect = 'disconnect'
}

export class BattleConnection extends MyEventDispatcher {
  private static _instance: BattleConnection;
  private _socket: Socket;
  private _bcConnectService: BlockchainConnectService;

  private constructor() {
    super('BattleConnection');
    // auto connection
    this._bcConnectService = BlockchainConnectService.getInstance();
    if (GlobalParams.BATTLE.localConnect) {
      this.connectLocal();
    }
    else {
      this.connectServer();
    }
  }

  static getInstance(aIsLocalConnect?: boolean): BattleConnection {
    if (!BattleConnection._instance) BattleConnection._instance = new BattleConnection();
    return BattleConnection._instance;
  }

  private connectLocal() {
    this.logDebug(`connectLocal...`);
    this.closeConnection();
    this._socket = io('localhost:3089');
    this.initListeners();
  }

  private connectServer() {
    this.logDebug(`connectServer...`);
    this.closeConnection();
    this._socket = io(GlobalParams.BATTLE.serverAddr);
    this.initListeners();
  }

  private sendPacket(aPackTitle: PackTitle, aData: any) {
    this.logDebug(`sendPacket:`, aData);
    this._socket.emit(aPackTitle, aData);
    // this._ws?.send(JSON.stringify(aData));
  }

  private initListeners() {

    this._socket.on('connect', () => {
      this.logDebug('socket connected...');
    });

    this._socket.on('disconnect', () => {
      this.logDebug('socket disconnected...');
      this.emit(ConnectionEvent.disconnect);
    });

    this._socket.on(PackTitle.sign, (aData: SignData) => {
      this.onSignRecv(aData);
    });

    this._socket.on(PackTitle.duel, (aData) => {
      this.logDebug(`challengeInfo:`, aData);
      this.emit(PackTitle.duel, aData);
    });

    this._socket.on(PackTitle.gameSearching, (aData) => {
      this.logDebug(`gameSearching:`, aData);
      this.emit(PackTitle.gameSearching, aData);
    });

    this._socket.on(PackTitle.battleConfirmation, (aData: AcceptScreenData) => {
      this.logDebug(`initScreen:`, aData);
      this.emit(PackTitle.battleConfirmation, aData);
    });

    this._socket.on(PackTitle.gameStart, (aData: StartGameData) => {
      this.logDebug(`gameStart:`, aData);
      this.emit(PackTitle.gameStart, aData);
    });

    this._socket.on(PackTitle.gameComplete, (aData: GameCompleteData) => {
      this.logDebug(`gameComplete:`, aData);
      this.emit(PackTitle.gameComplete, aData);
    });

    this._socket.on(PackTitle.message, (aData: MessagePack) => {
      this.onMessagePack(aData);
    });

  }

  private onMessagePack(aData: MessagePack) {
    switch (aData.showType) {
      case 'console':
        console.log(`Server:`, aData.msg);
        break;
      case 'popup':
        GameEventDispatcher.showMessage(aData.msg);
        break;
      case 'alert':
        alert(`Server: ${aData.msg}`);
        break;
    }
  }

  private onSignRecv(aData: SignData) {
    switch (aData.fromServer) {
      case 'request':
        this.logDebug(`onSignRecv: request...`);
        const authPriority = this._bcConnectService.getDefaultAuthMethod();
        this.logDebug(`onSignRecv: authPriority: ${authPriority}`);
        // always local
        this.signProcessLocal();
        break;
      case 'reject':
        this.logDebug(`onSignRecv: REJECT!`, aData);
        break;
      case 'success':
        this.logDebug(`onSignRecv: SUCCESS`, aData);
        break;
      default:
        this.logWarn(`onSignRecv: unknown status:`, aData);
        break;
    }
  }

  private async signProcessLocal() {
    this.logDebug(`signProcessLocal()...`);

    let signData: SignData = {
      fromCli: 'web2'
    }

    if (GlobalParams.isDebugMode) {

      signData.walletId = 'DebugNick';
      signData.tgInitString = '12345678';
      signData.tgAuthData = {
        auth_date: 0,
        id: 12345678,
        first_name: 'Debug',
        username: 'DebugNick',
        hash: '12345678',
      };
      this.sendPacket(PackTitle.sign, signData);

    }
    else {

      if (this._bcConnectService.isTelegram()) {

        // TG
        // signData.tgNick = this.signService.TelegramLogin();
        signData.tgInitString = this._bcConnectService.getTelegramInitData();
        signData.tgAuthData = this._bcConnectService.getTelegramAuthData();
        this.sendPacket(PackTitle.sign, signData);

      }
      else {

        // Web3
        signData.fromCli = 'web3';

        const walletAddress = await this._bcConnectService.getWalletAddressWithConnect();
        this.logDebug(`signProcessLocal: walletAddress = ${walletAddress}`);

        if (!walletAddress) {
          const authPriority = this._bcConnectService.getDefaultAuthMethod();
          this.logDebug(`signProcessLocal: Priority`, authPriority);
          this._bcConnectService.setupAuthMethod('Local');
          this._bcConnectService.getSignedAuthMessage().then((aSignature) => {
            this.logDebug(`signProcessLocal: local wallet auth...`);
            signData.signature = aSignature;
            this.sendPacket(PackTitle.sign, signData);
          })
          return;
        }
        else {
          this._bcConnectService.getSignedAuthMessage().then(aSignature => {
            this.logDebug(`signProcessLocal: getSignedAuthMessage signature = ${aSignature}`);
            signData.signature = aSignature;
            this.sendPacket(PackTitle.sign, signData);
          });
        }

      }

    }

  }

  public get connected(): boolean {
    return this._socket.connected;
  }

  public get socket(): Socket {
    return this._socket;
  }

  closeConnection() {
    if (this._socket) {
      this._socket.close();
      this._socket = null;
    }
  }

  sendSearchGame() {
    let data: SearchGameData = {
      isFreeConnect: GlobalParams.BATTLE.freeConnect
    }
    this._socket.emit(PackTitle.startSearchGame, data);
  }

  sendSearchGameBot() {
    let data: SearchGameData = {
      withBot: true,
      isFreeConnect: GlobalParams.BATTLE.freeConnect
    }
    this._socket.emit(PackTitle.startSearchGame, data);
  }

  // sendDuelCreate() {
  //     let data: SearchGameData = {
  //         isChallenge: true,
  //         duelCmd: 'create',
  //         isFreeConnect: GlobalParams.BATTLE.freeConnect
  //     }
  //     this._socket.emit(PackTitle.startSearchGame, data);
  // }

  // sendDuelConnect(aChNumber: number) {
  //     let data: SearchGameData = {
  //         isChallenge: true,
  //         duelCmd: 'connect',
  //         duelNumber: aChNumber,
  //         isFreeConnect: GlobalParams.BATTLE.freeConnect
  //     }
  //     this._socket.emit(PackTitle.startSearchGame, data);
  // }

  sendSkillActionClick(aSkillId: number) {
    let data: SkillRequest = {
      action: 'click',
      skillId: aSkillId
    }
    this._socket.emit(PackTitle.skill, data);
  }

  sendSkillLevelUpClick(aSkillId: number) {
    let data: SkillRequest = {
      action: 'levelUp',
      skillId: aSkillId
    }
    this._socket.emit(PackTitle.skill, data);
  }

  sendStopSearchingGame() {
    this._socket.emit(PackTitle.stopSearchGame);
  }

  sendAcceptConfirmation() {
    let data: AcceptScreenData = {
      action: 'accept'
    }
    this._socket.emit(PackTitle.battleConfirmation, data);
  }

  sendAcceptCloseClick() {
    let data: AcceptScreenData = {
      action: 'closeClick'
    }
    this._socket.emit(PackTitle.battleConfirmation, data);
  }

  sendAcceptLoading(aData: PlayerLoadingData) {
    let data: AcceptScreenData = {
      action: 'loading',
      loadingData: aData
    }
    this._socket.emit(PackTitle.battleConfirmation, data);
  }

  /**
   * Calls after hero pick
   */
  sendBattleSceneLoaded(heroId: number) {
    this._socket.emit(PackTitle.battleSceneLoaded);
  }

  sendExitGame() {
    this._socket.emit(PackTitle.exitGame);
  }

  sendClaimReward(aData: ClaimRewardData) {
    this._socket.emit(PackTitle.claimReward, aData);
  }

  sendTestWinBattle() {
    let data: DebugTestData = {
      action: 'win'
    }
    this._socket.emit(PackTitle.debugTest, data);
  }

  sendTestLossBattle() {
    let data: DebugTestData = {
      action: 'loss'
    }
    this._socket.emit(PackTitle.debugTest, data);
  }

  sendEmotion(aEmotion: Emotion) {
    let data: EmotionData = {
      emotion: aEmotion
    }
    this._socket.emit(PackTitle.emotion, data);
  }

  sendBattleShopPurchaseRequest(itemId: number) {
    let data: ShopData = {
      action: 'purchase',
      itemId: itemId
    }
    this._socket.emit(PackTitle.shop, data);
  }

  sendBattleShopSellRequest(itemId: number) {
    let data: ShopData = {
      action: 'sale',
      itemId: itemId
    }
    this._socket.emit(PackTitle.shop, data);
  }

  sendDuelCheck(aUserNick: string) {
    let data: DuelInfo = {
      cmd: 'check',
      userNick: aUserNick
    }
    this._socket.emit(PackTitle.duel, data);
  }

  sendDuelCancel(aUserNick: string) {
    let data: DuelInfo = {
      cmd: 'cancel',
      userNick: aUserNick
    }
    this._socket.emit(PackTitle.duel, data);
  }

  sendDebugAdd1kGold() {
    let data: DebugTestData = {
      action: 'addGold1k'
    }
    this._socket.emit(PackTitle.debugTest, data);
  }

}