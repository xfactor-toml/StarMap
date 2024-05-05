<template>
  <BasePopup
    class="WalletConnectPopup"
    :title="'Connect wallet'"
    @close="$emit('close')"
  >
    <div class="WalletConnectPopup__wallets">
      <button
        class="WalletConnectPopup__wallet is-metamask"
        type="button"
        @click="metamaskConnect"
      >Metamask
      </button>
      <button
        class="WalletConnectPopup__wallet is-walletconnect"
        type="button"
        @click="walletConnect"
      >WalletСonnect
      </button>
    </div>
  </BasePopup>
</template>

<script lang="ts">
import { BasePopup } from '@/components'

export default {
  name: 'WalletConnectPopup',
  components: {
    BasePopup
  },
  methods: {
    metamaskConnect() {
      this.$wallet.connect('metamask').then(() => {
        this.$emit('close')
      });
    },
    walletConnect() {
      this.$wallet.connect('walletconnect').then(() => {
        this.$emit('close')
      });
    },
  }
};
</script>

<style scoped src="./WalletConnectPopup.css"></style>
