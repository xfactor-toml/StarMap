<template>
  <div class="RealMode">
    <p>TEST</p>
    <transition name="fade">
      <template v-if="clientStore.overlay">
        <div class="gui-overlay" @click="clientStore.hideTooltip" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="clientStore.tooltip !== null">
        <Tooltip
          :name="clientStore.tooltip.name"
          :description="clientStore.tooltip.description"
          :textAutofit="clientStore.tooltip.textAutofit"
          :level="clientStore.tooltip.level"
          :race="clientStore.tooltip.race"
          :position="clientStore.tooltip.pos2d"
          :scale="clientStore.tooltip.scale"
          :raceImageUrl="getRaceImage(clientStore.tooltip.race, 'tooltip')"
          @hide="clientStore.hideTooltip"
          @hideButtonHover="$client.handleHover()"
          @diveIn="clientStore.diveIn"
          @diveInButtonHover="$client.handleHover()"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="clientStore.starPanel !== null">
        <StarPanel
          :name="clientStore.starPanel.name"
          :description="clientStore.starPanel.description"
          :level="clientStore.starPanel.level"
          :race="clientStore.starPanel.race"
          :planetSlots="clientStore.starPanel.planetSlots"
          :energy="clientStore.starPanel.energy"
          :life="clientStore.starPanel.life"
          :scale="clientStore.starPanel.scale"
          :raceImageUrl="getRaceImage(clientStore.starPanel.race, 'star-panel')"
          @hide="clientStore.hideStarPanel"
          @hideButtonHover="$client.handleHover()"
          @play="$client.playStarPanel()"
          @playButtonHover="$client.handleHover()"
        />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { StarPanel, Tooltip } from '@/components';
import { getRaceImage } from '@/helpers';
import { useSettingsStore, useClientStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'RealMode',
  components: {
    StarPanel,
    Tooltip
  },
  computed: {
    ...mapStores(useSettingsStore, useClientStore)
  },
  methods: {
    getRaceImage
  }
};
</script>

<style scoped src="./RealMode.css"></style>
