<template>
  <div class="startScreen">
    <template v-if="showAgreement">
      <div class="startScreen__logo-text" />
      <p class="startScreen__text">
        Vel in dicant cetero phaedrum, usu populo interesset cu, eum ea facer
        nostrum pericula. Per cu iracundia splendide. Nec labore cetero
        theophrastus no, ei vero facer veritus nec. Eu eam dolores lobortis
        percipitur, quo te equidem deleniti disputando. Magna copiosae apeirian
        ius at.
      </p>
      <button
        class="startScreen__button active"
        @mouseenter="$emit('runButtonHover')"
        @click="handleAgreementRunClick()"
      >
        Run
      </button>
      <label
        class="startScreen__checkbox"
        @mouseenter="$emit('agreementHover')"
      >
        <input
          type="checkbox"
          class="startScreen__checkbox-field"
          v-model="dontShowAgreement"
          @change="handleAgreementCheckbox()"
        />
        <span class="startScreen__checkbox-label">don’t show me again</span>
      </label>
    </template>
    <template v-else>
      <div class="startScreen__logo" />
      <div class="startScreen__logo-text" />
      <button
        class="startScreen__button active"
        @mouseenter="$emit('runButtonHover')"
        @click="handleRunClick(true)"
      >
        Run fullscreen
      </button>
      <button
        class="startScreen__button"
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
  name: "StartScreen",
  data() {
    return {
      dontShowAgreement: false,
      showAgreement: false,
      fullscreenRun: true
    };
  },
  methods: {
    handleRunClick(fullscreen = false) {
      const agreementVisible = !Boolean(
        Number(localStorage.getItem("agreement-hidden"))
      );

      if (agreementVisible) {
        this.fullscreenRun = fullscreen;
        this.showAgreement = true;
        this.$emit("agreement");
      } else {
        this.$emit("run", fullscreen);
      }
    },
    handleAgreementCheckbox() {
      this.dontShowAgreement
        ? localStorage.setItem(
            "agreement-hidden",
            `${Number(this.dontShowAgreement)}`
          )
        : localStorage.removeItem("agreement-hidden");
      this.$emit("agreementClick");
    },
    handleAgreementRunClick() {
      this.$emit("run", this.fullscreenRun);
    }
  }
};
</script>

<style scoped src="./StartScreen.css"></style>
