<template>
  <div class="BattleConnectBase">
    <div class="BattleConnectBase__content">
      <slot/>
    </div>
    <button
      class="BattleConnectBase__close"
      @click="$client.onBattleConnectExit"
    />
  </div>
</template>

<script lang="ts">
import { useUiStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'BattleConnectBase',
  computed: mapStores(useUiStore),
  mounted() {
    this.uiStore.blur.enable()
  },
  beforeUnmount() {
    this.uiStore.blur.disable()
  }
};
</script>

<style scoped src="./BattleConnectBase.css"/>
