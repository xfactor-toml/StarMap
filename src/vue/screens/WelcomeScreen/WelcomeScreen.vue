<template>
  <div class="WelcomeScreen">
    <template v-if="showAgreement">
      <div class="WelcomeScreen__logo-text" />
      <p class="WelcomeScreen__text">
        Welcome to the open beta test of the VORPAL Gameverse: stage I.<br>
        To create stars in the universe, you will need a
        <a target="_blank" href="https://metamask.io/download">MetaMask wallet</a> and
        <a target="_blank" href="https://discord.gg/bnbchain">test BNB tokens</a>,
        if you encounter problems, check out our
        <a target="_blank" href="https://teletype.in/@vorpal/xzbjyT7vPyl">guide</a>
        or write to us on
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
          :value="settingsStore.agreement.accepted"
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
      if (this.settingsStore.agreement.accepted) {
        this.$client.onClick();
        this.$client.run(fullscreen, this.starsStore.stars);
        this.settingsStore.screen.setScreen('interface');
      } else {
        this.preservedFullscreenRun = fullscreen;
        this.showAgreement = true;
        this.$client.playInitScreenSfx();
      }
    },
    handleAgreementClick() {
      if (this.settingsStore.agreement.accepted) {
        this.settingsStore.agreement.revoke();
      } else {
        this.settingsStore.agreement.accept();
      }
    },
    handleAgreementRunClick() {
      this.$client.onClick();
      this.$client.run(this.preservedFullscreenRun, this.starsStore.stars);
      this.settingsStore.screen.setScreen('interface');
    },
  },
};
</script>

<style scoped src="./WelcomeScreen.css"></style>
