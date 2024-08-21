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
        v-if="selectedMenu == 'MAIN MENU'" 
        @close="closeMainMenu" 
        @selectItem="handleMenuSelection"
        :selectedItem="this.previousSelectedMenu" 
      />  
    </transition>

    <transition name="fade">
      <StarDefenderButton
        v-if="!selectedMenu"
        @click="showMainMenu"
      />
    </transition>
     
   
    <transition name="fade">
        <StarDefenderProcess
        v-if="selectedMenu == 'SEARCH GAME' || selectedMenu == 'PLAY WITH A BOT' || selectedMenu == 'DUEL WAITING'"
        :selectedMenu=this.selectedMenu
      />
    </transition>

    <transition name="fade">
      <SearchingMenu 
        v-if="selectedMenu == 'SEARCH GAME' || selectedMenu == 'PLAY WITH A BOT' || selectedMenu == 'DUEL WAITING'" 
        @close="closeMenu" 
        @previous="handlePrevious" 
        @cancel="cancelOperation"
        :currentMenu="selectedMenu"
      />
    </transition>

    <transition name="fade">
      <DuelMenu 
        v-if="selectedMenu == 'DUEL'" 
        @close="closeMenu" 
        @previous="handlePrevious" 
        @sendLink="sendLink"
      />
    </transition>
    
    <transition name="fade">
      <AudioMenu 
        v-if="selectedMenu == 'SETTINGS'" 
        @close="closeMenu" 
        @previous="handlePrevious" 
      />
    </transition>
   
    <transition name="fade">
      <div v-if="!selectedMenu" class="GalaxyScene__panels">
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
  StarDefenderButton,
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
    StarDefenderButton,
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
    showMainMenu() {
      this.selectedMenu = 'MAIN MENU'
    },
    handleMenuSelection(item: string) {
      this.selectedMenu = item;
      if (item == 'PLAY WITH A BOT') {
        this.$client.onGameStartWithBot();
      }
    },
    closeMenu() {
      this.selectedMenu = 'MAIN MENU'
    },
    handlePrevious(item: string) {
      this.selectedMenu = 'MAIN MENU'
      this.previousSelectedMenu = item
    },
    closeMainMenu() {
      this.selectedMenu = null
    },
    cancelOperation() {
      this.selectedMenu = 'MAIN MENU'
    },
    sendLink() {
      this.selectedMenu = 'DUEL WAITING'
    }

  },
};
</script>

<style scoped src="./GalaxyScene.css"></style>
