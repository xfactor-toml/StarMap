<template>
  <div class="ModesPanel" :class="{ 'is-hidden': !uiStore.panels.visibility.modes }">
    <button class="ModesPanel__toggle" @click="uiStore.panels.togglePanel('modes')" />
    <div class="ModesPanel__group">
      <template v-for="mode in modes">
        <button
          class="ModesPanel__button"
          :class="[
            `is-${mode.name}`,
            {
              'is-active': mode.name === scenesStore.current.mode?.name,
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
import { useScenesStore, useUiStore } from '@/stores';
import { GuiMode, GuiModeName } from '@/types';
import { mapStores } from 'pinia';

export default {
  name: 'ModesPanel',
  computed: {
    ...mapStores(useScenesStore, useUiStore),
    modes() {
      return this.scenesStore.current.scene.modes || []
    }
  },
  methods: {
    isDisabled(mode: GuiMode) {
      if (mode.name !== 'real' && this.scenesStore.current.clientScene?.name === 'star') {
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

      this.scenesStore.setSceneMode(modeName);
    }
  }
};
</script>

<style scoped src="./ModesPanel.css"></style>
