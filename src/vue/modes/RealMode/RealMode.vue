<template>
  <div class="RealMode">
    <transition name="fade">
      <template v-if="uiStore.star.starPanel !== null">
        <StarPanel
          :starId="uiStore.star.starPanel.starId"
          :scale="uiStore.star.starPanel.scale"
          @callStarBoost="uiStore.star.showStarBoostPanel"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="uiStore.overlay.visible">
        <div class="gui-overlay" @click="hideAllPanels" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="uiStore.star.starTooltip !== null">
        <StarTooltipV2
          :star="uiStore.star.starTooltip.star"
          :position="uiStore.star.starTooltip.position"
          @hide="uiStore.star.hideStarTooltip"
          @hideButtonHover="$client.onHover()"
          @diveIn="uiStore.star.diveIn"
          @diveInButtonHover="$client.onHover()"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="uiStore.star.starBoostPanel !== null">
        <StarBoostPanel
          :starId="uiStore.star.starBoostPanel.starId"
          :type="uiStore.star.starBoostPanel.type"
          @hide="uiStore.star.hideStarBoostPanel"
          @hover="$client.onHover()"
        />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { useUiStore } from '@/stores';
import { StarBoostPanel, StarPanel, StarTooltipV2 } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'RealMode',
  components: {
    StarBoostPanel,
    StarPanel,
    StarTooltipV2
  },
  computed: {
    ...mapStores(useUiStore)
  },
  methods: {
    hideAllPanels() {
      if (!this.uiStore.overlay.active) return;
      this.uiStore.star.hideStarBoostPanel();
      this.uiStore.star.hideStarTooltip();
    }
  },
  unmounted() {
    this.uiStore.star.hideStarPanel();
    this.hideAllPanels();
  }
};
</script>

<style scoped src="./RealMode.css"></style>
