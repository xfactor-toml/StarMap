<template>
  <div class="PhantomMode">
    <transition name="fade">
      <template v-if="uiStore.overlay.visible">
        <div class="gui-overlay" @click="closeStarCreationPanel" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="uiStore.star.newStarPosition !== null && !creationPanel">
        <StarCreationTooltipV2
          :starPosition="uiStore.star.newStarPosition"
          @hide="uiStore.star.hideStarTooltip"
          @hideButtonHover="$client.onHover()"
          @create="openStarCreationPanel"
          @createButtonHover="$client.onHover()"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="uiStore.star.newStarPosition !== null && creationPanel">
        <StarCreationPanel
          :starPosition="uiStore.star.newStarPosition"
          @hide="closeStarCreationPanel"
          @hover="$client.onHover()"
        />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { useUiStore } from '@/stores';
import { StarCreationPanel, StarCreationTooltipV2 } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'PhantomMode',
  components: {
    StarCreationPanel,
    StarCreationTooltipV2
  },
  data: () => ({
    creationPanel: false
  }),
  computed: {
    ...mapStores(useUiStore)
  },
  methods: {
    openStarCreationPanel() {
      this.creationPanel = true;
    },
    closeStarCreationPanel() {
      if (!this.uiStore.overlay.active) return;
      this.uiStore.star.hideStarTooltip();
      this.creationPanel = false;
    }
  },
  unmounted() {
    this.closeStarCreationPanel();
  }
};
</script>

<style scoped src="./PhantomMode.css"></style>
