import { getShortAddress } from '@/utils';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type WalletStoreState = {
  account: string;
  connected: boolean;
  installed: boolean;
};

export const useWalletStore = defineStore('wallet', () => {
  const account = ref('')
  const connected = ref(false)
  const installed = ref(false)

  const shortAddress = computed(() => {
    return getShortAddress(account.value)
  })

  const setState = (state: WalletStoreState) => {
    account.value = state.account
    installed.value = state.installed
    connected.value = state.connected
  }

  const isOwner = (address: string) => {
    return account.value && account.value.toLowerCase() === address.toLowerCase(); 
  }

  return {
    account,
    connected,
    installed,
    shortAddress,
    isOwner,
    setState
  }
});
