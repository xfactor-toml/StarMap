<template>
  <BattleConnectBase>
    <BattleConnectIndicator
      :progress="battleStore.connecting.loadingProgress"
      :type="'loading'"
      :mode="'loading'"
    >Loading
    </BattleConnectIndicator>
  </BattleConnectBase>
</template>

<script lang="ts">
import { useBattleStore } from '@/stores';
import { BattleConnectIndicator } from '@/components';
import { BattleConnectBase } from '../BattleConnectBase';
import { mapStores } from 'pinia';

export default {
  name: 'BattleLoadingMode',
  computed: mapStores(useBattleStore),
  components: {
    BattleConnectBase,
    BattleConnectIndicator
  },
};
</script>
