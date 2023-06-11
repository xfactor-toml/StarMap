import { markRaw } from 'vue';
import { NetworkAuth, GetBalance } from '~/blockchain';

export class WalletService {
  constructor() {}

  async connect() {
    try {
      return (await NetworkAuth()) !== null;
    } catch (error) {
      return false;
    }
  }

  async getBalance() {
    return GetBalance();
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
