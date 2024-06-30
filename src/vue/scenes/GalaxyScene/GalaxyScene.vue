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
        <SearchingIndicator v-if="battleStore.connecting.playerSearching" @click="$client.onSearchingClick" />
        <template v-else>
          <!-- <StartGameButton
            @click="$client.onGameStart"
          >Start<br>game
          </StartGameButton> -->
          <!-- <StartGameButton
            @click="$client.onGameStartDuel"
          >DUEL
          </StartGameButton> -->
          <StartGameButton
            class="GalaxyScene__playButton"
            @click="$client.onGameStartWithBot"
          >Play<br>With Bot
          </StartGameButton>
        </template>
      </div>
      <div class="GalaxyScene__headerColumn is-right">
        <div class="GalaxyScene__userbar">
          <UserBar @openPlasmaMintPopup="openPlasmaMintPopup" />
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
        <template v-if="
          config.SHOW_STARS_FILTER_BY_LEVEL &&
          scenesStore.current.clientScene?.name === 'galaxy'
        ">
          <div class="GalaxyScene__levels">
            <LevelsPanel />
          </div>
        </template>
      </transition>
      <template v-if="scenesStore.current.clientScene?.name !== 'star'">
        <div class="GalaxyScene__modes">
          <ModesPanel />
        </div>
      </template>
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
import {
  useBattleStore,
  useScenesStore,
  useSettingsStore,
  useUiStore,
  useWalletStore
} from '@/stores';
import { mapStores } from 'pinia';
import { default as vClickOutside } from 'click-outside-vue3';
import { config } from '@/config';

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
      showPlasmaMintPopup: false,
      config
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  computed: mapStores(
    useBattleStore,
    useScenesStore,
    useSettingsStore,
    useUiStore,
    useWalletStore,
  ),
  watch: {
    ['scenesStore.current.clientScene']: {
      handler() {
        switch (this.scenesStore.current.clientScene?.name) {
          case 'star': {
            this.uiStore.panels.setPanelState('views', true)
            break
          }
          case 'galaxy': {
            this.uiStore.panels.setPanelState('modes', true)
            break
          }
        }
      }
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
};
</script>

<style scoped src="./GalaxyScene.css"></style>
