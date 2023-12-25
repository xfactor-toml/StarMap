<template>
  <div class="GalaxyScene">
    <div v-if="scenesStore.current.mode" class="GalaxyScene__content">
      <component :is="scenesStore.current.mode.getComponent()" />
    </div>
    <div class="GalaxyScene__header">
      <div class="GalaxyScene__headerColumn">
        <Logo />
      </div>
      <div class="GalaxyScene__headerColumn is-center">
        <StartGameButton
          v-if="battleStore.state === 'initial'"
          @click="$client.onGameStart"
        />
        <SearchingIndicator
          v-if="battleStore.state === 'searching'"
          @click="$client.onSearchingClick"
        />
      </div>
      <div class="GalaxyScene__headerColumn is-right">
        <div class="GalaxyScene__userbar">
          <UserBar @openPlasmaMintPopup="openPlasmaMintPopup"/>
        </div>
      </div>
    </div>
    <div class="GalaxyScene__panels">
      <template v-if="scenesStore.current.mode?.clientScenes?.length">
        <div class="GalaxyScene__views">
          <ViewsPanel />
        </div>
      </template>
      <transition name="fade">
        <template v-if="scenesStore.current.clientScene?.name === 'galaxy'">
          <div class="GalaxyScene__levels">
            <LevelsPanel />
          </div>
        </template>
      </transition>
      <div class="GalaxyScene__modes">
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
import { useBattleStore, useScenesStore, useSettingsStore, useWalletStore } from '@/stores';
import { mapStores } from 'pinia';
import { default as vClickOutside } from 'click-outside-vue3';

export default {
  name: 'GalaxyScene',
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
  computed: mapStores(useBattleStore, useScenesStore, useSettingsStore, useWalletStore),
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

<style scoped src="./GalaxyScene.css"></style>
