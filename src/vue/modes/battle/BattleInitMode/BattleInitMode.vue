<template>
  <div class="BattleInitMode">
    <template v-if="battleStore.players.current && battleStore.players.connected">
      <div class="BattleInitMode__top">
        <BattleInitMember
          :name="battleStore.players.connected.name"
          :address="battleStore.players.connected.address"
          :race="battleStore.players.connected.race"
        />
      </div>
      <div class="BattleInitMode__vs">VS</div>
      <div class="BattleInitMode__bottom">
        <BattleInitMember
          :name="battleStore.players.current.name"
          :address="battleStore.players.current.address"
          :race="battleStore.players.current.race"
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
