<template>
  <div class="PhantomMode">
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
  </div>
</template>

<script lang="ts">
import { useClientStore } from '@/stores';
import { StarTooltip } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'PhantomMode',
  components: {
    StarTooltip
  },
  computed: {
    ...mapStores(useClientStore)
  }
};
</script>

<style scoped src="./PhantomMode.css"></style>
