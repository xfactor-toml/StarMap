import { markRaw } from 'vue';
import {
  NetworkAuth,
  GetBalance,
  GetCreationCost,
  CreateNewStar,
  SubscribeOnAccountChanging
} from '~/blockchain';

export class WalletService {
  account = '';
  connected = false;
  installed = false;
  currency = 'plasma';

  constructor() {
    this.init();
  }

  async init() {
    this.updateState(await SubscribeOnAccountChanging());
  }

  async connect() {
    return this.updateState(await NetworkAuth());
  }

  async getBalance() {
    return this.checkConnection(() => GetBalance(this.account), 0);
  }

  async getCreationCost(level = 1) {
    return this.checkConnection(() => GetCreationCost(level), 0);
  }

  async createStar(name: string) {
    return this.checkConnection(() => CreateNewStar(this.account, name), null);
  }

  private async checkConnection(method, defaultValue) {
    return (await this.connect()) ? method() : defaultValue;
  }

  private updateState(auth: string | null) {
    this.installed = auth !== null;

    if (!auth) {
      return false;
    }

    this.connected = true;
    this.account = auth;

    return true;
  }

  static VuePlugin = {
    install: app => {
      app.config.globalProperties.$wallet = markRaw(new WalletService());
    }
  };

  static StorePlugin = () => ({
    wallet: markRaw(new WalletService())
  });
}
