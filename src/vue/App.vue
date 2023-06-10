<template>
  <component :is="screen" />
  <div class="version">{{ version }}</div>
</template>

<script lang="ts">
import { Component } from 'vue';
import { mapStores } from 'pinia';
import { InterfaceScreen, PreloaderScreen, WelcomeScreen } from '@/screens';
import { ClientData, GuiScreen } from '@/types';
import { useSettingsStore, useClientStore } from '@/stores';

export default {
  name: 'App',
  components: {
    PreloaderScreen
  },
  data: () => ({
    version: 'v0.25'
  }),
  computed: {
    ...mapStores(useSettingsStore, useClientStore),
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
          this.clientStore.showStarTooltip(data);
          break;

        case 'HIDE_STAR_PREVIEW':
          this.clientStore.hideStarTooltip();
          break;

        case 'SHOW_STAR_GUI':
          this.clientStore.showStarPanel(data);
          break;
      }
    }
  },
  created() {
    // Game Events
    window.addEventListener('gameEvent', this.handleGameEvent.bind(this));

    // Global Events
    window.addEventListener('resize', () => {
      this.$client.handleResize();
    });

    // INFO: client didnt send event when press escape
    document.body.addEventListener('fullscreenchange', () => {
      this.clientStore.setFullscreenMode(!this.clientStore.fullscreen);
    });
  }
};
</script>
