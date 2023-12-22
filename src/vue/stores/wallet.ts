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
    return `${account.value.slice(0, 2)}...${account.value.slice(-4)}`
  })

  const setState = (state: WalletStoreState) => {
    account.value = state.account
    installed.value = state.installed
    connected.value = state.connected
  }

  return {
    account,
    connected,
    installed,
    shortAddress,
    setState
  }
});
