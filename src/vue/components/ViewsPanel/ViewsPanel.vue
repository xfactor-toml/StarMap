<template>
  <div class="ViewsPanel" :class="{ 'is-hidden': !uiStore.panels.visibility.views }">
    <div class="ViewsPanel__group">
      <template v-for="view in scenesStore.current.mode?.clientScenes">
        <button
          class="ViewsPanel__button"
          :class="[
            `is-${view.name}`,
            {
              'is-active': view.name === scenesStore.current.clientScene?.name,
              'is-disabled': !view.enabled,
              'is-clickable': view.clickable
            }
          ]"
          :disabled="!view.clickable"
          @click="changeView(view.name)"
        >
          {{ view.label }}
        </button>
      </template>
    </div>
    <button class="ViewsPanel__toggle" @click="uiStore.panels.togglePanel('views')" />
  </div>
</template>

<script lang="ts">
import { useScenesStore, useUiStore } from '@/stores';
import { GuiClientSceneName } from '@/types';
import { mapStores } from 'pinia';

export default {
  name: 'ViewsPanel',
  computed: {
    ...mapStores(useScenesStore, useUiStore)
  },
  methods: {
    changeView(sceneName: GuiClientSceneName) {
      this.$client.onClick();

      switch (sceneName) {
        case 'galaxy':
          this.uiStore.star.hideStarPanel();
          this.$client.onLeftPanelGalaxyClick();
          break;
        case 'planet':
          this.$client.onLeftPanelPlanetClick();
          break;
        case 'star':
          this.$client.onLeftPanelStarClick();
          break;
      }

      this.scenesStore.setClientScene(sceneName);
    }
  }
};
</script>

<style scoped src="./ViewsPanel.css"></style>