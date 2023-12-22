import { Star } from '@/models';
import { WalletStoreState } from '@/stores';
import { markRaw } from 'vue';
import {
  ApprovePlasma,
  CreateNewStar,
  GetAllowance,
  GetAllStarData,
  GetBalance,
  GetCreationCost,
  IncreaseStarLevel,
  MintPlasma,
  NetworkAuth,
  RefuelStar,
  RequiredPlasmaToApprove,
  SubscribeOnAccountChanging
} from '~/blockchain';
import { fuelTarget } from '~/blockchain/types';
import { Coords, StarList } from '~/blockchain/types';

let walletInstance: WalletService | null = null

export class WalletService {
  account = '';
  connected = false;
  installed = false;
  currency = 'plasma';
  subscribed = false;

  stateListeners = []

  get state(): WalletStoreState {
    return {
      account: this.account,
      connected: this.connected,
      installed: this.installed,
    }
  }

  async connect() {
    if (!this.subscribed) {
      this.subscribe();
    }

    return this.updateState(await NetworkAuth());
  }

  async subscribe() {
    this.subscribed = true;
    this.updateState(await SubscribeOnAccountChanging());
  }

  async approvePlasma(amount: number) {
    return this.checkConnection(() => ApprovePlasma(this.account, amount));
  }

  async createStar(name: string, coords: Coords) {
    const owner = this.account;
    const uri = `${document.location.hostname}`;
    const race = Star.getRandomRace();

    return this.checkConnection(() => CreateNewStar(owner, name, uri, race, coords), null);
  }

  async refuelStar(starId: number, amount: number, target: fuelTarget) {
    return this.checkConnection(() => RefuelStar(this.account, starId, amount, target), null);
  }

  async refuelStarLevelUp(starId: number, amount: number) {
    return this.refuelStar(starId, amount, 'levelup');
  }

  async refuelStarExistence(starId: number, amount: number) {
    return this.refuelStar(starId, amount, 'existence');
  }

  async increaseStarLevel(starId: number) {
    return this.checkConnection(() => IncreaseStarLevel(this.account, starId), null);
  }

  async getAllowance() {
    return this.checkConnection(() => GetAllowance(this.account));
  }

  async getBalance() {
    return this.checkConnection(() => GetBalance(this.account), 0);
  }

  async getCreationCost(level = 1) {
    return GetCreationCost(level) || 0;
  }

  async getStars(): Promise<StarList> {
    return GetAllStarData();
  }

  async mintPlasma(amount: number): Promise<number> {
    return MintPlasma(this.account, amount);
  }

  async requiredPlasmaToApprove() {
    return this.checkConnection(() => RequiredPlasmaToApprove(this.account));
  }

  private async checkConnection<T extends (...args: unknown[]) => ReturnType<Awaited<T>>>(
    method: T,
    defaultValue?: Awaited<ReturnType<T>>
  ) {
    return (await this.connect()) ? method() : defaultValue;
  }

  private updateState(auth: string | null) {
    this.installed = auth !== null;

    if (!auth) {
      this.callListeners()

      return false;
    }

    this.connected = true;
    this.account = auth;
    this.callListeners()

    return true;
  }

  onStateUpdate(listener: (state: WalletStoreState) => void) {
    this.stateListeners.push(listener)
  }

  callListeners() {
    if (this.stateListeners.length) {
      this.stateListeners.forEach(listener => {
        listener(this.state)
      })
    }
  }

  static getWalletInstance() {
    const instance = walletInstance || new WalletService()
    return instance
  }

  static VuePlugin = {
    install: app => {
      app.config.globalProperties.$wallet = markRaw(WalletService.getWalletInstance());
    }
  };

  static StorePlugin = () => ({
    wallet: markRaw(WalletService.getWalletInstance())
  });
}

export const useWallet = () => WalletService.getWalletInstance()
