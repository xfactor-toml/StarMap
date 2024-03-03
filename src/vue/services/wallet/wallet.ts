import { BaseProvider } from '@/services/wallet/providers/base-provider';
import { MetamaskProvider } from '@/services/wallet/providers/metamask-provider';
import { ReaderProvider } from '@/services/wallet/providers/reader-provider';
import { WalletConnectProvider } from '@/services/wallet/providers/walletconnect-provider';
import { WalletStoreState } from '@/stores';
import { markRaw } from 'vue';
import { InitWalletconnectModal } from '~/blockchainWC';

let walletInstance: WalletService | null = null

export class WalletService {
  account = '';
  connected = false;
  installed = false;
  currency = 'plasma';
  provider: BaseProvider = new ReaderProvider()

  stateListeners = []

  constructor() {
    walletInstance = this
    InitWalletconnectModal()
  }

  get state(): WalletStoreState {
    return {
      account: this.account,
      connected: this.connected,
      installed: this.installed,
    }
  }

  async connect(provider: 'metamask' | 'walletconnect') {
    if (provider === 'metamask') {
      this.provider = new MetamaskProvider()
    }

    if (provider === 'walletconnect') {
      this.provider = new WalletConnectProvider()
    }

    if (!this.provider) {
      throw new Error('provider not defined')
    }

    return this.updateState((await this.provider.connect()).value);
  }

  private updateState(account: string | null) {
    this.installed = account !== null;

    if (!account) {
      this.callListeners()

      return false;
    }

    this.connected = true;
    this.account = account;
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
    return walletInstance || new WalletService()
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
