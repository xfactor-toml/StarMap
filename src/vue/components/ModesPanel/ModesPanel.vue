<template>
  <div class="ModesPanel" :class="{ 'is-hidden': settingsStore.modesPanelHidden }">
    <button class="ModesPanel__toggle" @click="settingsStore.toggleModesPanel" />
    <div class="ModesPanel__group">
      <template v-for="mode in modes">
        <button
          class="ModesPanel__button"
          :class="[
            `is-${mode.name}`,
            {
              'is-active': mode.name === settingsStore.mode.name,
              'is-disabled': !mode.enabled
            }
          ]"
          @click="settingsStore.setMode(mode.name)"
        >
          {{ mode.label }}
        </button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { MODES } from '@/constants';
import { useSettingsStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'ModesPanel',
  data: () => ({
    modes: Object.values(MODES)
  }),
  computed: {
    ...mapStores(useSettingsStore)
  }
};
</script>

<style scoped src="./ModesPanel.css"></style>
