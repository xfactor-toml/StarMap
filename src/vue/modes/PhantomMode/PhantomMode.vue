<template>
  <div class="PhantomMode">
    <transition name="fade">
      <template v-if="clientStore.overlay">
        <div class="gui-overlay" @click="clientStore.hideStarTooltip" />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="clientStore.tooltipStar !== null && !creation">
        <StarCreationTooltip
          :star="clientStore.tooltipStar"
          @hide="clientStore.hideStarTooltip"
          @hideButtonHover="$client.handleHover()"
          @create="() => (creation = true)"
          @createButtonHover="$client.handleHover()"
        />
      </template>
    </transition>
    <transition name="fade">
      <template v-if="clientStore.tooltipStar !== null && creation">
        <StarCreationPanel
          :star="clientStore.tooltipStar"
          @hide="() => ((creation = false), clientStore.hideStarTooltip)"
          @create="() => {}"
          @approve="() => {}"
          @hover="$client.handleHover()"
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
    creation: false
  }),
  computed: {
    ...mapStores(useClientStore)
  }
};
</script>

<style scoped src="./PhantomMode.css"></style>
