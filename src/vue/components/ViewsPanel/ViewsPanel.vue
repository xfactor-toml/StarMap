<template>
  <div class="ViewsPanel" :class="{ 'is-hidden': settingsStore.viewsPanelHidden }">
    <div class="ViewsPanel__group">
      <template v-for="view in settingsStore.mode.views">
        <button
          class="ViewsPanel__button"
          :class="[
            `is-${view.name}`,
            {
              'is-active': view.name === settingsStore.view,
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
    <button class="ViewsPanel__toggle" @click="settingsStore.toggleViewsPanel" />
  </div>
</template>

<script lang="ts">
import { useSettingsStore } from '@/stores';
import { GuiViewName } from '@/types';
import { mapStores } from 'pinia';

export default {
  name: 'ViewsPanel',
  computed: {
    ...mapStores(useSettingsStore)
  },
  methods: {
    changeView(viewName: GuiViewName) {
      this.$client.onClick();

      switch (viewName) {
        case 'galaxy':
          this.settingsStore.hideStarPanel();
          this.$client.onLeftPanelGalaxyClick();
          break;
        case 'planet':
          this.$client.onLeftPanelPlanetClick();
          break;
        case 'star':
          this.$client.onLeftPanelStarClick();
          break;
      }

      this.settingsStore.setView(viewName);
    }
  }
};
</script>

<style scoped src="./ViewsPanel.css"></style>
