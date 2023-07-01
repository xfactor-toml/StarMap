<template>
  <div class="RealMode">
    <transition name="fade">
      <template v-if="settingsStore.starPanel !== null">
        <StarPanel
          :starId="settingsStore.starPanel.starId"
          :scale="settingsStore.starPanel.scale"
          @callStarBoost="settingsStore.showStarBoostPanel"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="settingsStore.overlay">
        <div class="gui-overlay" @click="hideAllPanels" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="settingsStore.starTooltip !== null">
        <StarCreationTooltipV2
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
      <template v-if="settingsStore.starBoostPanel !== null">
        <StarBoostPanel
          :starId="settingsStore.starBoostPanel.starId"
          :type="settingsStore.starBoostPanel.type"
          @hide="settingsStore.hideStarBoostPanel"
          @hover="$client.onHover()"
        />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { useSettingsStore } from '@/stores';
import { StarBoostPanel, StarPanel, StarCreationTooltipV2 } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'RealMode',
  components: {
    StarBoostPanel,
    StarPanel,
    StarCreationTooltipV2
  },
  computed: {
    ...mapStores(useSettingsStore)
  },
  methods: {
    hideAllPanels() {
      this.settingsStore.hideStarBoostPanel();
      this.settingsStore.hideStarTooltip();
    }
  },
  unmounted() {
    this.settingsStore.hideStarPanel();
    this.hideAllPanels();
  }
};
</script>

<style scoped src="./RealMode.css"></style>
