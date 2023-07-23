import { defineStore } from 'pinia';
import {
  GuiMode,
  GuiModeName,
  GuiScreen,
  GuiViewName,
  PhantomStarPreviewEvent,
  ShowStarGuiEvent,
  ShowStarPreviewEvent,
  StarBoostPanelType
} from '@/types';
import { MODES } from '@/constants';
import { Star, StarPosition, StarScreenPosition } from '@/models';
import { useStarsStore } from '@/stores/stars';
import { WINDOW_MOBILE_BREAKPOINT } from '@/constants/global';

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
