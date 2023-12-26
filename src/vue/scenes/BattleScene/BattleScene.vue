<template>
  <div class="BattleScene">
    <component :is="scenesStore.current.mode.getComponent()" />
  </div>
</template>

<script lang="ts">
import { useScenesStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'BattleScene',
  computed: mapStores(useScenesStore),
};
</script>

<style scoped src="./BattleScene.css"></style>
