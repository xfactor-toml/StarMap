<template>
  <div class="WelcomeScreen">
    <template v-if="showAgreement">
      <div class="WelcomeScreen__logo-text" />
      <p class="WelcomeScreen__text">
        Vel in dicant cetero phaedrum, usu populo interesset cu, eum ea facer nostrum pericula. Per
        cu iracundia splendide. Nec labore cetero theophrastus no, ei vero facer veritus nec. Eu eam
        dolores lobortis percipitur, quo te equidem deleniti disputando. Magna copiosae apeirian ius
        at.
      </p>
      <button
        class="WelcomeScreen__button active"
        @mouseenter="$client.handleHover()"
        @click="handleAgreementRunClick"
      >
        Run
      </button>
      <label class="WelcomeScreen__checkbox" @mouseenter="$client.handleHover()">
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
        @mouseenter="$client.handleHover()"
        @click="handleRunClick(true)"
      >
        Run fullscreen
      </button>
      <button
        class="WelcomeScreen__button"
        @mouseenter="$client.handleHover()"
        @click="handleRunClick(false)"
      >
        Run windowed
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { useSettingsStore } from '@/stores';
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
    ...mapStores(useSettingsStore)
  },
  methods: {
    handleRunClick(fullscreen = false) {
      if (this.settingsStore.agreementAccepted) {
        this.$client.run(fullscreen);
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
      this.$client.run(this.preservedFullscreenRun);
      this.settingsStore.setScreen('interface');
    }
  }
};
</script>

<style scoped src="./WelcomeScreen.css"></style>
