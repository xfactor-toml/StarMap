<template>
  <div class="BattleInitMode">
    <template v-if="battleStore.process.players.current && battleStore.process.players.connected">
      <div class="BattleInitMode__top">
        <BattleInitMember
          :name="battleStore.process.players.connected.name"
          :address="battleStore.process.players.connected.address"
          :race="battleStore.process.players.connected.race"
        />
      </div>
      <div class="BattleInitMode__vs">VS</div>
      <div class="BattleInitMode__bottom">
        <BattleInitMember
          :name="battleStore.process.players.current.name"
          :address="battleStore.process.players.current.address"
          :race="battleStore.process.players.current.race"
          :reflected="true"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { useBattleStore, useScenesStore } from '@/stores';
import { BattleInitMember } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'BattleInitMode',
  components: {
    BattleInitMember,
  },
  computed: mapStores(useBattleStore, useScenesStore),
};
</script>

<style scoped src="./BattleInitMode.css"></style>
