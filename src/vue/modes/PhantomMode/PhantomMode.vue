<template>
  <div class="PhantomMode">
    <transition name="fade">
      <template v-if="clientStore.overlay">
        <div class="gui-overlay" @click="clientStore.hideStarTooltip" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="clientStore.tooltipStar !== null">
        <StarCreationTooltip
          :star="clientStore.tooltipStar"
          @hide="clientStore.hideStarTooltip"
          @hideButtonHover="$client.handleGuiEvent('hover')"
          @create="openStarCreationPanel"
          @createButtonHover="$client.handleGuiEvent('hover')"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="creationPanel">
        <StarCreationPanel
          :star="clientStore.tooltipStar"
          @hide="closeStarCreationPanel"
          @hover="$client.handleGuiEvent('hover')"
        />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { useClientStore } from '@/stores';
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
    ...mapStores(useClientStore)
  },
  methods: {
    openStarCreationPanel() {
      this.clientStore.hideStarTooltip();
      this.clientStore.enableOverlay();
      this.creationPanel = true;
    },
    closeStarCreationPanel() {
      this.clientStore.disableOverlay();
      this.creationPanel = false;
    }
  }
};
</script>

<style scoped src="./PhantomMode.css"></style>
