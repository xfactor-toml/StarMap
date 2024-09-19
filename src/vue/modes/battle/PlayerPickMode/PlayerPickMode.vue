<template>
  <transition name="fade">
    <div class="PlayerPickMode">
        <transition name="fade">
            <BattleChoosePlayer 
              v-if="showChoose"
              @player-selected="showInfo"
              @timeReached="timeReached"
              @picked="picked"
            />
          </transition>

          <transition name="fade">
            <PlayerPick 
              v-if="showPick"
              :player="player"
              @cancelPick="cancelPick"
              @pickHero="pickHero"
              @timeReached="timeReached"
            />
          </transition>
    </div>
</transition>
</template>

<script lang="ts">
import {BattleChoosePlayer, PlayerPick} from '@/components';
import { mapStores } from 'pinia';
import { useBattleStore, useScenesStore } from '@/stores';
import { PlayerType } from '@/types';
import { Players } from '@/constants';
export default {
  name: 'PlayerPickMode',
  components: {
      BattleChoosePlayer,
      PlayerPick
  },
  computed: {
  ...mapStores(useBattleStore, useScenesStore),
  players() {
    return this.battleStore.process.players
  }
},

data() {
  return {
    player: Players[0],
    showPick: false,
    showChoose: true,
  }
},
watch: {
  player(newVal) {
      console.log('Player updated:', newVal);
  }
},

methods: {
  showInfo(choose: PlayerType) {   
    this.player = choose;
    this.showChoose = false;
    this.showPick = true;  
  },

  timeReached() {
    this.$client.onPlayerPick()
    this.showChoose = false;
    this.showPick = false;  
  },

  cancelPick() {
    this.showChoose = true;
    this.showPick = false;
  },

  pickHero() {
    this.$client.onPlayerPick();
    this.showPick = false
  },

  picked(player) {
    this.$client.onPlayerPick();
    this.showPick = false;
    this.showChoose = false;
  }
}
}
</script>
<style scoped lang="./PlayerPickMode.css">
  
</style>