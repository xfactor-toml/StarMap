<template>
  <div class="ViewsPanel" :class="{ 'is-hidden': !uiStore.panels.visibility.views }">
    <div class="ViewsPanel__group">
      <template v-for="view in screensStore.current.mode?.views">
        <button
          class="ViewsPanel__button"
          :class="[
            `is-${view.name}`,
            {
              'is-active': view.name === screensStore.current.view.name,
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
import { useScreensStore, useUiStore } from '@/stores';
import { ClientViewName } from '@/types';
import { mapStores } from 'pinia';

export default {
  name: 'ViewsPanel',
  computed: {
    ...mapStores(useScreensStore, useUiStore)
  },
  methods: {
    changeView(viewName: ClientViewName) {
      this.$client.onClick();

      switch (viewName) {
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

      this.screensStore.setClientView(viewName);
    }
  }
};
</script>

<style scoped src="./ViewsPanel.css"></style>
