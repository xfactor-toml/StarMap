<template>
    <div class="BattleChoosePlayer">    
        <h1 class="BattleChoosePlayer__title orbitron-font --semi-bold">CHOOSE A HERO</h1>
            <div class="BattleChoosePlayer__item"> 
                <PlayerModel               
                :background="background"
                :player="this.Players[0]"
                :info="info"
                @click="showInfo"
                />
                  
            <h2 class="BattleChoosePlayer__item-name orbitron-font --semi-bold">
                <span>{{ Players[0].name }} </span>
                <span>[{{ Players[0].category }}]</span>
            </h2>
            </div>
            <div class="BattleChoosePlayer__time orbitron-font --semi-bold">
            <hr />
            <p> {{ currentTime }}s</p> <!-- Display the countdown timer -->
            <hr />
            </div>
            <div class="BattleChoosePlayer__item">
                <PlayerModel 
                :background="background"
                :player="this.Players[1]"
                :info="info"
                 @click="showInfo"
            />
            <h2 class="BattleChoosePlayer__item-name orbitron-font --semi-bold">
                <span>{{ Players[1].name }} </span>
                <span>[{{ Players[1].category }}]</span>
            </h2>
            </div>
    </div>
</template>

<script lang="ts">
import { PlayerType } from '@/types';
import PlayerModel from '../PlayerModel/PlayerModel.vue';
import { Players } from '@/constants';
import { timerStore } from '@/utils';
import { computed, watch } from 'vue';
export default {
   name: 'BattleChoosePlayer',
   components: {
     PlayerModel
   },
   setup(_, { emit }) {
    const currentTime = computed(() => timerStore.time);
    watch(currentTime, (newTime) => {
      if (newTime === 0) {
        emit('timeReached');
      }
    });
    return {
      currentTime,
    };
  },
   data() {
    return {
        background: "/gui/images/battle-player-list/background.svg",
        info: "/gui/images/battle-player-list/info.svg",
        Players,
    
    }
   },
   mounted() {
     timerStore.startTimer(); 
   },
   methods: {
     showInfo(player: PlayerType) {
        this.$emit('player-selected', player);

     }
   },
   
}
</script>


<style scoped src="./BattleChoosePlayer.css">

</style>