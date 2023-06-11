<template>
  <div class="RealMode">
    <transition name="fade">
      <template v-if="clientStore.overlay">
        <div class="gui-overlay" @click="clientStore.hideStarTooltip" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="clientStore.tooltipStar !== null">
        <StarTooltip
          :star="clientStore.tooltipStar"
          @hide="clientStore.hideStarTooltip"
          @hideButtonHover="$client.handleHover()"
          @diveIn="clientStore.diveIn"
          @diveInButtonHover="$client.handleHover()"
        />
      </template>
    </transition>
    <!-- <transition name="fade">
      <template v-if="clientStore.panelStar !== null">
        <StarPanel
          :name="clientStore.panelStar.name"
          :description="clientStore.panelStar.description"
          :level="clientStore.panelStar.level"
          :race="clientStore.panelStar.race"
          :planetSlots="clientStore.panelStar.planetSlots"
          :energy="clientStore.panelStar.energy"
          :life="clientStore.panelStar.life"
          :scale="clientStore.panelStar.scale"
          :raceImageUrl="getRaceImage(clientStore.panelStar.race, 'star-panel')"
          @hide="clientStore.hideStarPanel"
          @hideButtonHover="$client.handleHover()"
          @play="$client.playStarPanel()"
          @playButtonHover="$client.handleHover()"
        />
      </template>
    </transition> -->
  </div>
</template>

<script lang="ts">
import { useClientStore } from '@/stores';
import { StarPanel, StarTooltip } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'RealMode',
  components: {
    StarPanel,
    StarTooltip
  },
  computed: {
    ...mapStores(useClientStore)
  }
};
</script>

<style scoped src="./RealMode.css"></style>
