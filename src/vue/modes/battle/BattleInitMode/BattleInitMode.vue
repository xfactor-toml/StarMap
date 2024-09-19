<template>
  <transition name="fade">
    <div class="BattleInitMode">
      <template v-if="players.current && players.connected">
        <div class="BattleInitMode__top">
              <BattleInitEnemyMember 
                :name="players.connected.name"
                :race="players.connected.race"
                :star="players.connected.address"
                :isNick="players.connected.isNick"
              />
        </div>
        <div class="BattleInitMode__vs --semi-bold">VS</div>
        <div class="BattleInitMode__bottom">
            <BattleInitPlayerMember 
              :name="players.current.name"
              :race="players.current.race"
              :star="players.current.address"
              :isNick="players.current.isNick"
            />
        </div>
      </template>
    </div>
  </transition>
</template>

<script lang="ts">
import { BattleInitEnemyMember, BattleInitPlayerMember } from '@/components';
import { useBattleStore, useScenesStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'BattleInitMode',
  components: {
    BattleInitEnemyMember, BattleInitPlayerMember
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