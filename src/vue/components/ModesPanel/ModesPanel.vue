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
              'is-disabled': isDisabled(mode)
            }
          ]"
          @click="changeMode(mode.name)"
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
import { GuiMode, GuiModeName } from '@/types';
import { mapStores } from 'pinia';

export default {
  name: 'ModesPanel',
  data: () => ({
    modes: Object.values(MODES)
  }),
  computed: {
    ...mapStores(useSettingsStore)
  },
  methods: {
    isDisabled(mode: GuiMode) {
      if (mode.name !== 'real' && this.settingsStore.view === 'star') {
        return true;
      }

      return !mode.enabled;
    },
    changeMode(modeName: GuiModeName) {
      this.$client.onClick();

      switch (modeName) {
        case 'phantom':
          this.$client.onBotPanelPhantomClick();
          break;
        case 'real':
          this.$client.onBotPanelRealClick();
          break;
      }

      this.settingsStore.setMode(modeName);
    }
  }
};
</script>

<style scoped src="./ModesPanel.css"></style>
