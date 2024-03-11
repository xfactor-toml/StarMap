<template>
  <BattleConnectBase>
    <BattleConnectIndicator
      :progress="progress"
      :type="'connect'"
    >{{ connectedUsers.current }}/{{ connectedUsers.max }}
    </BattleConnectIndicator>
  </BattleConnectBase>
</template>

<script lang="ts">
import { useBattleStore } from '@/stores';
import { BattleConnectIndicator } from '@/components';
import { BattleConnectBase } from '../BattleConnectBase';
import { mapStores } from 'pinia';

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
    BattleConnectBase,
    BattleConnectIndicator
  }
};
</script>
