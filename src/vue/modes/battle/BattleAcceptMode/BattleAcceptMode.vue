<template>
  <div class="BattleAcceptMode">
    <div class="BattleAcceptMode__content">
      <BattleAcceptButton
        :duration="battleStore.acceptTime"
        @click="$client.onBattleAccept"
        @timeout="$client.onBattleAcceptExit"
      />
    </div>
    <button
      class="BattleAcceptMode__close"
      @click="$client.onBattleAcceptExit"
    />
  </div>
</template>

<script lang="ts">
import { useBattleStore, useUiStore } from '@/stores';
import { BattleAcceptButton } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'BattleAcceptMode',
  computed: mapStores(useBattleStore, useUiStore),
  components: {
    BattleAcceptButton
  },
  mounted() {
    this.uiStore.blur.enable()
  },
  beforeUnmount() {
    this.uiStore.blur.disable()
  }
};
</script>

<style scoped src="./BattleAcceptMode.css"/>
