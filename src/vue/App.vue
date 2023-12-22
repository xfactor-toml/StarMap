<template>
  <component :is="screen" />
  <div class="version">{{ version }}</div>
</template>

<script lang="ts">
import { Component } from 'vue';
import { mapStores } from 'pinia';
import { debounce } from 'debounce';
import { GalaxyScreen, PreloaderScreen, WelcomeScreen } from '@/screens';
import { GuiScreenName } from '@/types';
import { useSettingsStore, useUiStore } from '@/stores';
import { ClientEventsService } from '@/services';

export default {
  name: 'App',
  data: () => ({
    version: 'v0.3.3'
  }),
  computed: {
    ...mapStores(useSettingsStore, useUiStore),
    screen() {
      const screens: Record<GuiScreenName, Component> = {
        preloader: PreloaderScreen,
        welcome: WelcomeScreen,
        interface: GalaxyScreen
      };

      return screens[this.settingsStore.screen.selected];
    }
  },
  created() {
    // Game Events
    window.addEventListener('gameEvent', ClientEventsService.handleEvent);

    // Global Events
    window.addEventListener(
      'resize',
      debounce(() => {
        this.$client.onWindowResize();
        this.uiStore.viewport.setWindowWidth(window.innerWidth);
      }, 200)
    );

    // INFO: client didnt send event when press escape
    document.body.addEventListener('fullscreenchange', () => {
      this.uiStore.fullscreen.active
        ? this.uiStore.fullscreen.disable()
        : this.uiStore.fullscreen.enable()
    });
  }
};
</script>
