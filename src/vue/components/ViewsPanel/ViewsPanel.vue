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
          @click="setView(view.name)"
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
    setView(view: GuiViewName) {
      this.settingsStore.setView(view);
    }
  }
};
</script>

<style scoped src="./ViewsPanel.css"></style>
