<template>
  <div class="ViewsPanel" :class="{ 'is-hidden': !uiStore.panels.visibility.views }">
    <div class="ViewsPanel__group">
      <template v-for="view in settingsStore.mode.selected.views">
        <button
          class="ViewsPanel__button"
          :class="[
            `is-${view.name}`,
            {
              'is-active': view.name === settingsStore.view.selected,
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
import { useSettingsStore, useUiStore } from '@/stores';
import { GuiViewName } from '@/types';
import { mapStores } from 'pinia';

export default {
  name: 'ViewsPanel',
  computed: {
    ...mapStores(useSettingsStore, useUiStore)
  },
  methods: {
    changeView(viewName: GuiViewName) {
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

      this.settingsStore.view.setView(viewName);
    }
  }
};
</script>

<style scoped src="./ViewsPanel.css"></style>
