<template>
  <BasePopup
    class="WalletConnectPopup"
    :title="'Connect wallet'"
    @close="$emit('close')"
  >
    <div class="WalletConnectPopup__wallets">
      <button
        class="WalletConnectPopup__wallet is-telegram"
        type="button"
        @click="telegramConnect"
      >Telegram
      </button>
      <button
        class="WalletConnectPopup__wallet is-ton"
        type="button"
        disabled
      >TON
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
    telegramConnect() {
      this.$wallet.connect('telegram').then(() => {
        this.$emit('close')
      });
    },
  }
};
</script>

<style scoped src="./WalletConnectPopup.css"></style>
