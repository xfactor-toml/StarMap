<template>
  <BattleConnectBase>
    <BattleAcceptButton
      :progress="battleStore.connecting.acceptTimeProgress"
      @click="$client.onBattleAccept"
    />
  </BattleConnectBase>
</template>

<script lang="ts">
import { useBattleStore } from '@/stores';
import { BattleAcceptButton } from '@/components/';
import { BattleConnectBase } from '../BattleConnectBase';
import { mapStores } from 'pinia';

export default {
  name: 'BattleAcceptMode',
  computed: mapStores(useBattleStore),
  components: {
    BattleAcceptButton,
    BattleConnectBase
  },
};
</script>
