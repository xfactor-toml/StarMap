<template>
  <div class="WelcomeScreen">
    <template v-if="showAgreement">
      <div class="WelcomeScreen__logo-text" />
      <p class="WelcomeScreen__text">
        Welcome to the open beta test of the VORPAL Gameverse: stage I.<br>
        To create stars in the universe, you will need a
        <a target="_blank" href="https://metamask.io/download">MetaMask wallet</a> and
        <a target="_blank" href="https://discord.gg/bnbchain">test BNB tokens</a>,
        if you encounter problems, check out our guide or write to us on
        <a target="_blank" href="https://discord.gg/epUsWEPaDA">discord</a>.
      </p>
      <button
        class="WelcomeScreen__button active"
        @mouseenter="$client.onHover()"
        @click="handleAgreementRunClick"
      >
        Run
      </button>
      <label class="WelcomeScreen__checkbox" @mouseenter="$client.onHover()">
        <input
          type="checkbox"
          class="WelcomeScreen__checkbox-field"
          :value="settingsStore.agreementAccepted"
          @change="handleAgreementClick"
        />
        <span class="WelcomeScreen__checkbox-label">don’t show me again</span>
      </label>
    </template>
    <template v-else>
      <div class="WelcomeScreen__logo" />
      <div class="WelcomeScreen__logo-text" />
      <button
        class="WelcomeScreen__button active"
        @mouseenter="$client.onHover()"
        @click="handleRunClick(true)"
      >
        Run fullscreen
      </button>
      <button
        class="WelcomeScreen__button"
        @mouseenter="$client.onHover()"
        @click="handleRunClick(false)"
      >
        Run windowed
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { useSettingsStore, useStarsStore } from '@/stores';
import { mapStores } from 'pinia';
import { DeviceInfo } from '~/game/utils/DeviceInfo';

export default {
  name: 'WelcomeScreen',
  data() {
    return {
      showAgreement: false,
      preservedFullscreenRun: true
    };
  },
  computed: {
    ...mapStores(useSettingsStore, useStarsStore)
  },
  methods: {
    handleRunClick(fullscreen = false) {
      if (this.settingsStore.agreementAccepted) {
        this.$client.onClick();
        this.$client.run(fullscreen, this.starsStore.stars);
        this.settingsStore.setScreen('interface');
      } else {
        this.preservedFullscreenRun = fullscreen;
        this.showAgreement = true;
        this.$client.playInitScreenSfx();
      }
    },
    handleAgreementClick() {
      if (this.settingsStore.agreementAccepted) {
        this.settingsStore.revokeAgreement();
      } else {
        this.settingsStore.acceptAgreement();
      }
    },
    handleAgreementRunClick() {
      this.$client.onClick();
      this.$client.run(this.preservedFullscreenRun, this.starsStore.stars);
      this.settingsStore.setScreen('interface');
    },
    onMetamaskClick() {
      let url = 'https://metamask.io/download';
      if (!DeviceInfo.getInstance().desktop) {
        url = DeviceInfo.getInstance().android
          ? 'https://play.google.com/store/apps/details?id=io.metamask'
          : 'https://apps.apple.com/ru/app/metamask-blockchain-wallet/id1438144202'
      }
      window.open(url, '_blank');
    }
  },
};
</script>

<style scoped src="./WelcomeScreen.css"></style>
