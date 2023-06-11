import { markRaw } from 'vue';
import { NetworkAuth, GetBalance } from '~/blockchain';

export class WalletService {
  account = '';
  connected = false;
  currency = 'plasma';

  async connect() {
    const auth = await NetworkAuth();

    if (auth) {
      this.connected = true;
      this.account = auth;
    }

    return auth;
  }

  async getBalance() {
    if (!this.connected && !(await this.connect())) {
      return 0;
    }

    return GetBalance(this.account);
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
