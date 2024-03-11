<template>
  <div class="BattleInitMode">
    <template v-if="players.current && players.connected">
      <div class="BattleInitMode__top">
        <BattleInitMember
          :name="players.connected.name"
          :address="players.connected.address"
          :race="players.connected.race"
        />
      </div>
      <div class="BattleInitMode__vs">VS</div>
      <div class="BattleInitMode__bottom">
        <BattleInitMember
          :name="players.current.name"
          :address="players.current.address"
          :race="players.current.race"
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
  computed: {
    ...mapStores(useBattleStore, useScenesStore),
    players() {
      return this.battleStore.process.players
    }
  },
};
</script>

<style scoped src="./BattleInitMode.css"></style>
