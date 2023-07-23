<template>
  <div class="InterfaceScreen">
    <div class="InterfaceScreen__content">
      <component :is="mode" />
    </div>
    <div class="InterfaceScreen__logo">
      <Logo />
    </div>
    <div class="InterfaceScreen__userbar">
      <UserBar @openPlasmaMintPopup="openPlasmaMintPopup"/>
    </div>
    <div class="InterfaceScreen__panels">
      <template v-if="settingsStore.mode.views.length">
        <div class="InterfaceScreen__views">
          <ViewsPanel />
        </div>
      </template>
      <transition name="fade">
        <template v-if="settingsStore.view === 'galaxy'">
          <div class="InterfaceScreen__levels">
            <LevelsPanel />
          </div>
        </template>
      </transition>
      <div class="InterfaceScreen__modes">
        <ModesPanel />
      </div>
    </div>
    <PlasmaMintPopup
      v-if="showPlasmaMintPopup"
      v-click-outside="closePlasmaMintPopup"
      @close="closePlasmaMintPopup"
    />
  </div>
</template>

<script lang="ts">
import { LevelsPanel, Logo, ModesPanel, UserBar, ViewsPanel, PlasmaMintPopup } from '@/components';
import { PhantomMode, RealMode } from '@/modes';
import { useSettingsStore, useWalletStore } from '@/stores';
import { mapStores } from 'pinia';
import { GuiModeName } from '@/types';
import { Component } from 'vue';
import { default as vClickOutside } from 'click-outside-vue3';

export default {
  name: 'InterfaceScreen',
  components: {
    LevelsPanel,
    Logo,
    ModesPanel,
    UserBar,
    ViewsPanel,
    PlasmaMintPopup
  },
  data: () => {
    return {
      showPlasmaMintPopup: false
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  computed: {
    ...mapStores(useSettingsStore, useWalletStore),
    mode() {
      const modes: Record<GuiModeName, Component | null> = {
        phantom: PhantomMode,
        real: RealMode,
        season: null
      };

      return modes[this.settingsStore.mode.name];
    }
  },
  methods: {
    openPlasmaMintPopup() {
      this.showPlasmaMintPopup = true
    },
    closePlasmaMintPopup() {
      this.showPlasmaMintPopup = false
    },
  },
  created() {

    this.$wallet.onStateUpdate((state) => {
      this.walletStore.setState(state)
    })
  }
};
</script>

<style scoped src="./InterfaceScreen.css"></style>
