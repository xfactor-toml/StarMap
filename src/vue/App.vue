<template>
  <component :is="screen" />
  <div class="version">{{ version }}</div>
</template>

<script lang="ts">
import { Component } from 'vue';
import { mapStores } from 'pinia';
import { debounce } from 'debounce';
import { InterfaceScreen, PreloaderScreen, WelcomeScreen } from '@/screens';
import { ClientEvent, GuiScreen } from '@/types';
import { useSettingsStore, useStarsStore } from '@/stores';

export default {
  name: 'App',
  data: () => ({
    version: 'v0.25'
  }),
  computed: {
    ...mapStores(useSettingsStore, useStarsStore),
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
    async handleGameEvent({ detail: clientEvent }: Event & { detail: ClientEvent }) {
      switch (clientEvent.eventName) {
        case 'GAME_LOADING':
          break;

        case 'GAME_LOADED':
          await this.starsStore.fetchStars();
          this.settingsStore.setScreen('welcome');
          break;

        case 'GAME_CREATED':
          break;

        case 'GAME_FULLSCREEN':
          break;

        case 'HIDE_STAR_PREVIEW':
          this.settingsStore.hideStarTooltip();
          break;

        case 'HIDE_STAR_GUI':
          this.settingsStore.hideStarPanel();
          break;

        case 'SHOW_STAR_PREVIEW':
          this.settingsStore.showStarTooltip(clientEvent);
          break;

        case 'SHOW_STAR_GUI':
          this.settingsStore.showStarPanel(clientEvent);
          break;

        case 'PHANTOM_STAR_PREVIEW':
          this.settingsStore.showPhantomStarTooltip(clientEvent);
          break;

        case 'SHOW_REAL_MODE':
          this.settingsStore.setMode('real');
          break;

        case 'SHOW_PHANTOM_MODE':
          this.settingsStore.setMode('phantom');
          break;

        case 'EVENT_STAR_MODE':
          this.settingsStore.setView('star');
          break;

        case 'EVENT_GALAXY_MODE':
          this.settingsStore.setView('galaxy');
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
        this.$client.onWindowResize();
      }, 200)
    );

    // INFO: client didnt send event when press escape
    document.body.addEventListener('fullscreenchange', () => {
      this.settingsStore.setFullscreenMode(!this.settingsStore.fullscreen);
    });
  }
};
</script>
