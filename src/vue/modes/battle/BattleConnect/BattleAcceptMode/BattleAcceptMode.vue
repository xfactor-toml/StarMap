<template>
  <BattleConnectBase>
    <BattleAcceptButton
      :duration="battleStore.connecting.acceptTime"
      @click="$client.onBattleAccept"
      @timeout="$client.onBattleConnectTimeout"
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
