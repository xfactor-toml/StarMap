<template>
  <div class="WelcomeMode">
    <template v-if="showAgreement">
      <div class="WelcomeScene__logo-text" />
      <p class="WelcomeScene__text">
        Welcome to the open beta test of the VORPAL Gameverse: stage I.<br>
        To create stars in the universe, you will need a
        <a target="_blank" href="https://metamask.io/download">MetaMask wallet</a> and
        <a target="_blank" href="https://discord.gg/bnbchain">test BNB tokens</a>,
        if you encounter problems, check out our
        <a target="_blank" href="https://teletype.in/@vorpal/xzbjyT7vPyl">guide</a>
        or write to us on
        <a target="_blank" href="https://discord.gg/epUsWEPaDA">discord</a>.
      </p>
      <button class="WelcomeScene__button active" @mouseenter="$client.onHover()" @click="handleAgreementRunClick">
        Run
      </button>
      <label class="WelcomeScene__checkbox" @mouseenter="$client.onHover()">
        <input type="checkbox" class="WelcomeScene__checkbox-field" :value="settingsStore.agreement.accepted"
          @change="handleAgreementClick" />
        <span class="WelcomeScene__checkbox-label">don’t show me again</span>
      </label>
    </template>
    <template v-else>
      <div class="WelcomeScene__logo">
        <img src="/gui/images/preloader/logo.svg" alt="logo">
        <div class="WelcomeScene__animation">
          <button class="WelcomeScene__start-button" @mouseenter="$client.onHover()"
          @click="handleRunClick(false)">
            <img src="/gui/images/preloader/start-button.svg" alt="button">
            <div>
              <p class="WelcomeScene__start-button-title --bold">START</p>
              <p class="WelcomeScene__start-button-description">Audio on = Awesom experiens</p>
            </div>
          </button>
          <div class="WelcomeScene__button-animation" v-for="(item, index) in 30" :key="index">
            <img src="/gui/images/preloader/start-button-animation/Vector.svg" alt="logo">
          </div>
        </div>
        <div class="WelcomeScene__caution">
          <p>This site is protected by reCAPTCHA
          and the Google <a>Privacy Policy</a>
          and <a>Terms of Service</a> apply.</p>
        </div>
      </div>

    </template>
  </div>
</template>

<script lang="ts">
import { useScenesStore, useSettingsStore, useStarsStore } from '@/stores';
import { UISceneNames } from '@/types';
import { mapStores } from 'pinia';

export default {
  name: 'WelcomeMode',
  data() {
    return {
      showAgreement: false,
      preservedFullscreenRun: true,
    };
  },
  computed: {
    ...mapStores(useScenesStore, useSettingsStore, useStarsStore)
  },
  methods: {
    handleRunClick(fullscreen = false) {
      if (this.settingsStore.agreement.accepted) {
        this.$client.onClick();
        this.$client.run(fullscreen, this.starsStore.stars);
        this.scenesStore.setScene(UISceneNames.Galaxy);
      } else {
        this.preservedFullscreenRun = fullscreen;
        this.showAgreement = true;
        this.$client.playInitSceneSfx();
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
      this.scenesStore.setScene(UISceneNames.Galaxy);
    },
  },
};
</script>

<style scoped src="./WelcomeMode.css"></style>
