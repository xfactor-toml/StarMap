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
          @hideButtonHover="$client.handleHover()"
          @create="clientStore.diveIn"
          @createButtonHover="$client.handleHover()"
        />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { useClientStore } from '@/stores';
import { StarCreationTooltip } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'PhantomMode',
  components: {
    StarCreationTooltip
  },
  computed: {
    ...mapStores(useClientStore)
  }
};
</script>

<style scoped src="./PhantomMode.css"></style>
