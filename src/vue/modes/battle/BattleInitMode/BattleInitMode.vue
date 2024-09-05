<template>
   <transition name="fade">
      <div class="BattleInitMode">
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
            
            <transition name="fade">
              <PreGameCountdown 
                  v-if="showPreGame"
                />
            </transition>
      </div>
  </transition>
</template>

<script lang="ts">
import { useBattleStore, useScenesStore } from '@/stores';
import { BattleChoosePlayer, PlayerPick, PreGameCountdown} from '@/components';
import { mapStores } from 'pinia';
import { PlayerType } from '@/types';
import { Players } from '@/constants';
import { SceneNames } from '~/game/scenes/SceneNames';
export default {
  name: 'BattleInitMode',

  components: {
    BattleChoosePlayer,
    PlayerPick,
    PreGameCountdown
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
      showPreGame: false,
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
      this.showPreGame = true;
    },

    cancelPick() {
      this.showChoose = true;
      this.showPick = false;
    },

    pickHero() {
      this.$client.onPlayerPick();
      this.showPick = false;
      this.showPreGame = true;
    },

    picked(player) {
      this.$client.onPlayerPick();
      this.showPick = false;
      this.showChoose = false;
      this.showPreGame = true;
    }
  }
};
</script>

<style scoped src="./BattleInitMode.css"></style>
