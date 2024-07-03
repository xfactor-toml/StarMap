<template>
  <div class="StartScene">
    <!-- <PowerIndicator/> -->
    <RivCanvas/>
    <component :is="scenesStore.current.mode.getComponent()" />
  </div>
</template>

<script lang="ts">
import { useScenesStore } from '@/stores';
import { PowerIndicator, RivCanvas } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'StartScene',
  components: {
    PowerIndicator,
    RivCanvas
  },
  computed: mapStores(useScenesStore),
};
</script>

<style scoped src="./StartScene.css"></style>
