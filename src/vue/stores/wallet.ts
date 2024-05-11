import { getShortAddress } from '@/utils';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type WalletStoreState = {
  account: string;
  login: string;
  connected: boolean;
  installed: boolean;
};

export const useWalletStore = defineStore('wallet', () => {
  const account = ref('')
  const login = ref('')
  const connected = ref(false)
  const installed = ref(false)
  const popup = ref(false)

  const shortAddress = computed(() => {
    return getShortAddress(account.value)
  })

  const setState = (state: WalletStoreState) => {
    account.value = state.account
    login.value = state.login
    installed.value = state.installed
    connected.value = state.connected
  }

  const isOwner = (address: string) => {
    return account.value && account.value.toLowerCase() === address.toLowerCase(); 
  }

  const openPopup = () => {
    popup.value = true
  }

  const hidePopup = () => {
    popup.value = false
  }

  return {
    account,
    login,
    connected,
    installed,
    shortAddress,
    popup,
    isOwner,
    setState,
    openPopup,
    hidePopup,
  }
});
