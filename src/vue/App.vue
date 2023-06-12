<template>
  <component :is="screen" />
  <div class="version">{{ version }}</div>
</template>

<script lang="ts">
import { Component } from 'vue';
import { mapStores } from 'pinia';
import { debounce } from 'debounce';
import { InterfaceScreen, PreloaderScreen, WelcomeScreen } from '@/screens';
import { ClientData, GuiScreen } from '@/types';
import { useSettingsStore } from '@/stores';

export default {
  name: 'App',
  components: {
    PreloaderScreen
  },
  data: () => ({
    version: 'v0.25'
  }),
  computed: {
    ...mapStores(useSettingsStore),
    screen() {
      const screens: Record<GuiScreen, Component> = {
        preloader: PreloaderScreen,
        welcome: WelcomeScreen,
        interface: InterfaceScreen
      };

      return screens[this.settingsStore.screen];
    }
  },
  methods: {
    handleGameEvent({ detail: data }: Event & { detail: ClientData }) {
      switch (data.eventName) {
        case 'GAME_LOADING':
          break;

        case 'GAME_LOADED':
          this.settingsStore.setScreen('welcome');
          break;

        case 'GAME_CREATED':
          break;

        case 'GAME_FULLSCREEN':
          break;

        case 'SHOW_STAR_PREVIEW':
          this.settingsStore.showStarTooltip(data);
          break;

        case 'HIDE_STAR_PREVIEW':
          this.settingsStore.hideStarTooltip();
          break;

        case 'SHOW_STAR_GUI':
          this.settingsStore.showStarPanel(data);
          break;
      }
    }
  },
  created() {
    // Game Events
    window.addEventListener('gameEvent', this.handleGameEvent.bind(this));

    // Global Events
    window.addEventListener(
      'resize',
      debounce(() => {
        this.$client.handleGuiEvent('resize');
      }, 200)
    );

    // INFO: client didnt send event when press escape
    document.body.addEventListener('fullscreenchange', () => {
      this.settingsStore.setFullscreenMode(!this.settingsStore.fullscreen);
    });
  }
};
</script>
