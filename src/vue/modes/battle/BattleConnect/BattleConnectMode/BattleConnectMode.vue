<template>
  <BattleConnectBase>
    <BattleConnectIndicator
      :progress="progress"
      :type="'connect'"
    >1/2
    </BattleConnectIndicator>
  </BattleConnectBase>
</template>

<script lang="ts">
import { useBattleStore } from '@/stores';
import { BattleConnectIndicator } from '@/components';
import { BattleConnectBase } from '../BattleConnectBase';
import { mapStores } from 'pinia';
import { default as anime } from 'animejs';

export default {
  name: 'BattleConnectMode',
  computed: mapStores(useBattleStore),
  components: {
    BattleConnectBase,
    BattleConnectIndicator
  },
  data: () => ({
    progress: 0,
  }),
  mounted() {
    anime({
      targets: this,
      progress: [0, 100],
      duration: this.battleStore.connecting.acceptTime * 1000,
      easing: 'linear',
      complete: () => {
        this.$client.onBattleConnectTimeout()
      }
    })
  }
};
</script>
