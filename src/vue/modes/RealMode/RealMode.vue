<template>
  <div class="RealMode">
    <transition name="fade">
      <template v-if="settingsStore.overlay">
        <div class="gui-overlay" @click="settingsStore.hideStarTooltip" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="settingsStore.tooltipStar !== null">
        <StarTooltip
          :star="settingsStore.tooltipStar"
          @hide="settingsStore.hideStarTooltip"
          @hideButtonHover="$client.handleGuiEvent('hover')"
          @diveIn="settingsStore.diveIn"
          @diveInButtonHover="$client.handleGuiEvent('hover')"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="settingsStore.panelStar !== null">
        <StarPanel :star="settingsStore.panelStar" />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { useSettingsStore } from '@/stores';
import { StarPanel, StarTooltip } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'RealMode',
  components: {
    StarPanel,
    StarTooltip
  },
  computed: {
    ...mapStores(useSettingsStore)
  },
  unmounted() {
    this.settingsStore.hideStarTooltip();
  }
};
</script>

<style scoped src="./RealMode.css"></style>
