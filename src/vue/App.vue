<template>
    <transition :css="false" @enter="onEnter" @leave="onLeave" @after-leave="onAfterLeave">
      <component :is="scenesStore.current.scene.getComponent()" />
    </transition>
    <div class="version">{{ version }}</div>
    <WalletConnectPopup v-if="walletStore.popup" @close="walletStore.hidePopup" />
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { debounce } from 'debounce';
import { useScenesStore, useSettingsStore, useUiStore, useWalletStore } from '@/stores';
import { ClientEventsService } from '@/services';
import { SCENES } from '@/settings';
import { UISceneNames } from '@/types';
import { default as anime } from 'animejs';
import { WalletConnectPopup } from '@/components/WalletConnectPopup';
import { GlobalParams } from '~/game/data/GlobalParams';

export default {
    name: 'App',
    components: {
      WalletConnectPopup
    },
    data: () => ({
      version: GlobalParams.galaxyVersion
    }),
    computed: mapStores(
      useScenesStore,
      useSettingsStore,
      useUiStore,
      useWalletStore
    ),
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

      this.$wallet.on('state', (state) => {
        this.walletStore.setState(state)
      })

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