import { defineStore } from 'pinia';

type WalletStoreState = {
  account: string;
  connected: boolean;
  installed: boolean;
};

export const useWalletStore = defineStore('wallet', {
  state: (): WalletStoreState  => {
    return {
      account: '',
      connected: false,
      installed: false,
    };
  },
  actions: {
    setState({
      account,
      installed,
      connected
    }: WalletStoreState) {
      this.account = account
      this.installed = installed
      this.connected = connected
    },
  },
  getters: {
    shortAddress() {
      return `${this.account.slice(0, 2)}...${this.account.slice(-4)}`
    }
  }
});
