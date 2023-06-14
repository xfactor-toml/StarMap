<template>
  <div class="RealMode">
    <transition name="fade">
      <template v-if="settingsStore.overlay">
        <div class="gui-overlay" @click="settingsStore.hideStarTooltip" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="settingsStore.starTooltip !== null">
        <StarTooltip
          :star="settingsStore.starTooltip.star"
          :position="settingsStore.starTooltip.position"
          @hide="settingsStore.hideStarTooltip"
          @hideButtonHover="$client.onHover()"
          @diveIn="settingsStore.diveIn"
          @diveInButtonHover="$client.onHover()"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="settingsStore.starPanel !== null">
        <StarPanel :star="settingsStore.starPanel.star" :scale="settingsStore.starPanel.scale" />
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
    this.settingsStore.hideStarPanel();
    this.settingsStore.hideStarTooltip();
  }
};
</script>

<style scoped src="./RealMode.css"></style>
