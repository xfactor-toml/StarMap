<template>
  <BattleWaitProgress 
    :curren-user="connectedUsers.current"
    :max-users="connectedUsers.max"
    />
</template>

<script lang="ts">
import { useBattleStore } from '@/stores';
import { BattleConnectIndicator } from '@/components';
import { BattleConnectBase } from '../BattleConnectBase';
import { mapStores } from 'pinia';
import { BattleWaitProgress } from '@/components';

export default {
  name: 'BattleConnectMode',
  computed: {
    ...mapStores(useBattleStore),
    connectedUsers() {
      return this.battleStore.connecting.connectedUsers
    },
    progress() {
      return this.battleStore.connecting.acceptTimeProgress
    }
  },
  components: {
    BattleWaitProgress,
    BattleConnectBase,
    BattleConnectIndicator
  }
};
</script>
