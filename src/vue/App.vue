<template>
  <transition
    :css="false"
    @enter="onEnter"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <component :is="scenesStore.current.scene.getComponent()" />
  </transition>
  <div class="version">{{ version }}</div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { debounce } from 'debounce';
import { useScenesStore, useSettingsStore, useUiStore } from '@/stores';
import { ClientEventsService } from '@/services';
import { SCENES } from '@/settings';
import { UISceneNames } from '@/types';
import { default as anime } from 'animejs';

export default {
  name: 'App',
  data: () => ({
    version: 'v0.3.4'
  }),
  computed: mapStores(useScenesStore, useSettingsStore, useUiStore),
  methods: {
    async onEnter(el, done) {
      await anime({
        targets: el,
        easing: 'easeInOutQuart',
        duration: 400,
        opacity: [0, 1],
      }).finished

      done()
    },
    async onLeave(el, done) {
      await anime({
        targets: el,
        easing: 'easeInOutQuart',
        duration: 400,
        opacity: [1, 0],
      }).finished

      done()
    },
    onAfterLeave() {
      this.scenesStore.previous.scene?.afterLeave?.()
    }
  },
  created() {
    this.scenesStore.setScenes(SCENES, UISceneNames.Start)

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
