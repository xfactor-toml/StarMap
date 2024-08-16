<template>
  <BattleReadyProgress @click="$client.onBattleAccept"/>
</template>

<script lang="ts">
import { useBattleStore } from '@/stores';
import { BattleAcceptButton } from '@/components/';
import { BattleConnectBase } from '../BattleConnectBase';
import { BattleReadyProgress } from '@/components/';
import { mapStores } from 'pinia';

export default {
  name: 'BattleAcceptMode',
  computed: mapStores(useBattleStore),
  components: {
    BattleAcceptButton,
    BattleConnectBase,
    BattleReadyProgress
  },
};
</script>
