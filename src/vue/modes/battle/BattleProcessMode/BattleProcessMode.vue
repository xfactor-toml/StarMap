<template>
  <div class="BattleProcessMode">
    BattleProcessMode
  </div>
</template>

<script lang="ts">
import { useBattleStore } from '@/stores';
import { mapStores } from 'pinia'; 

export default {
  name: 'BattleProcessMode',
  computed: {
    ...mapStores(useBattleStore),
  },
};
</script>

<style scoped src="./BattleProcessMode.css"></style>
