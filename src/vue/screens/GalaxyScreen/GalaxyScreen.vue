<template>
  <div class="GalaxyScreen">
    <div v-if="screensStore.current.mode" class="GalaxyScreen__content">
      <component :is="screensStore.current.mode.getComponent()" />
    </div>
    <div class="GalaxyScreen__header">
      <div class="GalaxyScreen__headerColumn">
        <Logo />
      </div>
      <div class="GalaxyScreen__headerColumn is-center">
        <StartGameButton
          v-if="battleStore.state === 'initial'"
          @click="$client.onGameStart"
        />
        <SearchingIndicator
          v-if="battleStore.state === 'searching'"
          :duration="60 * 1000"
          @click="$client.onSearchingClick"
          @expired="$client.onSearchingExpired"
        />
      </div>
      <div class="GalaxyScreen__headerColumn is-right">
        <div class="GalaxyScreen__userbar">
          <UserBar @openPlasmaMintPopup="openPlasmaMintPopup"/>
        </div>
      </div>
    </div>
    <div class="GalaxyScreen__panels">
      <template v-if="screensStore.current.mode?.views.length">
        <div class="GalaxyScreen__views">
          <ViewsPanel />
        </div>
      </template>
      <transition name="fade">
        <template v-if="screensStore.current.view?.name === 'galaxy'">
          <div class="GalaxyScreen__levels">
            <LevelsPanel />
          </div>
        </template>
      </transition>
      <div class="GalaxyScreen__modes">
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
import {
  LevelsPanel,
  Logo,
  ModesPanel,
  PlasmaMintPopup,
  SearchingIndicator,
  StartGameButton,
  UserBar,
  ViewsPanel,
} from '@/components';
import { useBattleStore, useScreensStore, useSettingsStore, useWalletStore } from '@/stores';
import { mapStores } from 'pinia';
import { default as vClickOutside } from 'click-outside-vue3';

export default {
  name: 'GalaxyScreen',
  components: {
    LevelsPanel,
    Logo,
    ModesPanel,
    PlasmaMintPopup,
    SearchingIndicator,
    StartGameButton,
    UserBar,
    ViewsPanel,
  },
  data: () => {
    return {
      showPlasmaMintPopup: false
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  computed: mapStores(useBattleStore, useScreensStore, useSettingsStore, useWalletStore),
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

<style scoped src="./GalaxyScreen.css"></style>
