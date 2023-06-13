<template>
  <div class="PhantomMode">
    <transition name="fade">
      <template v-if="settingsStore.overlay">
        <div class="gui-overlay" @click="settingsStore.hideStarTooltip" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="settingsStore.tooltipNewStar !== null && !creationPanel">
        <StarCreationTooltip
          :star="settingsStore.tooltipNewStar"
          @hide="settingsStore.hideStarTooltip"
          @hideButtonHover="$client.handleGuiEvent('hover')"
          @create="openStarCreationPanel"
          @createButtonHover="$client.handleGuiEvent('hover')"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="creationPanel">
        <StarCreationPanel
          :star="settingsStore.tooltipNewStar"
          @hide="closeStarCreationPanel"
          @hover="$client.handleGuiEvent('hover')"
        />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { useSettingsStore } from '@/stores';
import { StarCreationPanel, StarCreationTooltip } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'PhantomMode',
  components: {
    StarCreationPanel,
    StarCreationTooltip
  },
  data: () => ({
    creationPanel: false
  }),
  computed: {
    ...mapStores(useSettingsStore)
  },
  methods: {
    openStarCreationPanel() {
      this.creationPanel = true;
    },
    closeStarCreationPanel() {
      this.settingsStore.hideStarTooltip();
      this.creationPanel = false;
    }
  },
  unmounted() {
    this.settingsStore.hideStarTooltip();
    this.closeStarCreationPanel();
  }
};
</script>

<style scoped src="./PhantomMode.css"></style>
