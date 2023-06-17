<template>
  <div class="PhantomMode">
    <transition name="fade">
      <template v-if="settingsStore.overlay">
        <div class="gui-overlay" @click="closeStarCreationPanel" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="settingsStore.newStarPosition !== null && !creationPanel">
        <StarCreationTooltip
          :starPosition="settingsStore.newStarPosition"
          @hide="settingsStore.hideStarTooltip"
          @hideButtonHover="$client.onHover()"
          @create="openStarCreationPanel"
          @createButtonHover="$client.onHover()"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="settingsStore.newStarPosition !== null && creationPanel">
        <StarCreationPanel
          :starPosition="settingsStore.newStarPosition"
          @hide="closeStarCreationPanel"
          @hover="$client.onHover()"
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
    this.closeStarCreationPanel();
  }
};
</script>

<style scoped src="./PhantomMode.css"></style>
