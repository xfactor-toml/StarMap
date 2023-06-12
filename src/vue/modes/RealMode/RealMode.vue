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
          @hideButtonHover="$client.handleGuiEvent('hover')"
          @diveIn="diveIn"
          @diveInButtonHover="$client.handleGuiEvent('hover')"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="clientStore.panelStar !== null">
        <StarPanel :star="clientStore.panelStar" />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { useClientStore, useSettingsStore } from '@/stores';
import { StarPanel, StarTooltip } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'RealMode',
  components: {
    StarPanel,
    StarTooltip
  },
  computed: {
    ...mapStores(useClientStore, useSettingsStore)
  },
  methods: {
    diveIn() {
      this.clientStore.diveIn();
      this.settingsStore.setView('star');
    }
  }
};
</script>

<style scoped src="./RealMode.css"></style>
