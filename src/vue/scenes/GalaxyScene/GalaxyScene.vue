<template>
  <div class="GalaxyScene">
    <div v-if="scenesStore.current.mode" class="GalaxyScene__content">
      <component :is="scenesStore.current.mode.getComponent()" />
    </div>

    <div class="GalaxyScene__header">
      <div class="GalaxyScene__headerColumn">
        <Logo />
      </div>
      <div class="GalaxyScene__headerColumn is-right">
        <div class="GalaxyScene__userbar">
          <UserBar @openPlasmaMintPopup="openPlasmaMintPopup" />
        </div>
      </div>
    </div>

    <transition name="fade">
      <MainMenu 
        v-if="stardefender == 'MAIN MENU'" 
        @close="closeMainMenu" 
        @selectItem="handleMenuSelection"
        :selectedItem="previousSelectedMenu" 
      />  
    </transition>

    <transition name="fade">
      <SearchingMenu 
        v-if="stardefender == 'SEARCH GAME' || stardefender == 'PLAY WITH A BOT' || stardefender == 'DUEL WAITING'" 
        @close="closeMenu" 
        @previous="handlePrevious" 
        @cancel="cancelOperation"
        :currentMenu="stardefender"
      />
    </transition>

    <transition name="fade">
      <DuelMenu 
        v-if="stardefender == 'DUEL'" 
        @close="closeMenu" 
        @previous="handlePrevious" 
        @sendLink="sendLink"
      />
    </transition>
    
    <transition name="fade">
      <AudioMenu 
        v-if="stardefender == 'SETTINGS'" 
        @close="closeMenu" 
        @previous="handlePrevious" 
      />
    </transition>
   
    <transition name="fade">
      <div class="GalaxyScene__panels">
        <template v-if="scenesStore.current.mode?.clientScenes?.length">
          <div class="GalaxyScene__views">
            <ViewsPanel />
          </div>
        </template>
        <transition name="fade">
          <template v-if="
            config.SHOW_STARS_FILTER_BY_LEVEL &&
            scenesStore.current.clientScene?.name == 'galaxy'"
          >
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
    </transition>

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
  MainMenu,
  DuelMenu,
  AudioMenu,
  SearchingMenu,
  StarDefenderProcess,  
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
    MainMenu,
    DuelMenu,
    AudioMenu,
    SearchingMenu,
    StarDefenderProcess,
  },
  data: () => {
    return {
      showPlasmaMintPopup: false,
      config,
      selectedMenu: null,
      previousSelectedMenu: null,
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  computed: {
    ... mapStores(
    useBattleStore,
    useScenesStore,
    useSettingsStore,
    useUiStore,
    useWalletStore,
  ),
    
   stardefender() {
     return  this.uiStore.stardefender.starDefenderMenu
   }
  },
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

    showMainMenu() {
      this.uiStore.stardefender.setStarDefenderMenu ('MAIN MENU')
    },

    handleMenuSelection(item: string) {
      this.uiStore.stardefender.setStarDefenderMenu(item);
      if (item == 'PLAY WITH A BOT') {
        this.$client.onGameStartWithBot();
      }
    },

    closeMenu() {
      this.uiStore.stardefender.setStarDefenderMenu ('MAIN MENU')
      this.previousSelectedMenu = null
    },

    handlePrevious(item: string) {
      this.uiStore.stardefender.setStarDefenderMenu('MAIN MENU')
      this.previousSelectedMenu = item
    },

    closeMainMenu() {
      this.uiStore.stardefender.setStarDefenderMenu(null);
    },

    cancelOperation() {
      this.uiStore.stardefender.setStarDefenderMenu('MAIN MENU')
    },

    sendLink() {
      this.uiStore.stardefender.setStarDefenderMenu('DUEL WAITING')
    }

  },
};
</script>

<style scoped src="./GalaxyScene.css"></style>
