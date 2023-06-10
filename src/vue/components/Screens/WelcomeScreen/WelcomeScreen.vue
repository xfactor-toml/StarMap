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
        @mouseenter="$emit('runButtonHover')"
        @click="handleAgreementRunClick()"
      >
        Run
      </button>
      <label class="WelcomeScreen__checkbox" @mouseenter="$emit('agreementHover')">
        <input
          type="checkbox"
          class="WelcomeScreen__checkbox-field"
          :value="agreementAccepted"
          @change="$emit('agreementClick', !agreementAccepted)"
        />
        <span class="WelcomeScreen__checkbox-label">don’t show me again</span>
      </label>
    </template>
    <template v-else>
      <div class="WelcomeScreen__logo" />
      <div class="WelcomeScreen__logo-text" />
      <button
        class="WelcomeScreen__button active"
        @mouseenter="$emit('runButtonHover')"
        @click="handleRunClick(true)"
      >
        Run fullscreen
      </button>
      <button
        class="WelcomeScreen__button"
        @mouseenter="$emit('runButtonHover')"
        @click="handleRunClick(false)"
      >
        Run windowed
      </button>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WelcomeScreen',
  props: {
    agreementAccepted: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showAgreement: false,
      preservedFullscreenRun: true
    };
  },
  methods: {
    handleRunClick(fullscreen = false) {
      if (this.agreementAccepted) {
        this.$emit('run', fullscreen);
      } else {
        this.preservedFullscreenRun = fullscreen;
        this.showAgreement = true;
        this.$emit('agreement');
      }
    },
    handleAgreementRunClick() {
      this.$emit('run', this.preservedFullscreenRun);
    }
  }
};
</script>

<style scoped src="./WelcomeScreen.css"></style>
