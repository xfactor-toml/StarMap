<template>
  <div class="StartScene">
    <!-- <PowerIndicator/> -->
    <component :is="scenesStore.current.mode.getComponent()" />
  </div>
</template>

<script lang="ts">
import { useScenesStore } from '@/stores';
import { PowerIndicator } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'StartScene',
  components: {
    PowerIndicator
  },
  computed: mapStores(useScenesStore),
};
</script>

<style scoped src="./StartScene.css"></style>
