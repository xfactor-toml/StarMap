<template>
  <div class="StartScene">
    <component :is="scenesStore.current.mode.getComponent()" />
  </div>
</template>

<script lang="ts">
import { useScenesStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'StartScene',
  computed: mapStores(useScenesStore),
};
</script>

<style scoped src="./StartScene.css"></style>
