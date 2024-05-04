<template>
  <div class="WalletConnectPopup">
    <div
      class="WalletConnectPopup__overlay"
      @click="$emit('close')"
    />
    <div class="WalletConnectPopup__box">
      <button
        class="WalletConnectPopup__close"
        @click="$emit('close')"
      />
      <div class="WalletConnectPopup__head">
        <div class="WalletConnectPopup__title">Connect wallet</div>
      </div>
      <div class="WalletConnectPopup__body">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WalletConnectPopup',
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
