<template>
    <div class="BattleChoosePlayer">        
        <div class="BattleChoosePlayer__item"> 
            <h1 class="BattleChoosePlayer__title orbitron-font --semi-bold">
              CHOOSE A HERO
            </h1>
            <div class="BattleChoosePlayer__model">
              <PlayerModel               
              :background="changeBackground(Players[0])"
              :player="Players[0]"
              :info="info"
              @click="showInfo"
              @pick="pick"
              />          
            </div>
            <h2 class="BattleChoosePlayer__item-name orbitron-font --semi-bold">
                <span>{{ Players[0].name }} </span>
                <span>[{{ Players[0].category }}]</span>
            </h2>
        </div>

        <div class="BattleChoosePlayer__time orbitron-font --semi-bold">
            <hr />
              <p> 00:{{ currentTime }}</p>
            <hr />
        </div>

        <div class="BattleChoosePlayer__item">
            <div class="BattleChoosePlayer__model">
                <PlayerModel 
                :background="changeBackground(Players[1])"
                :player="Players[1]"
                :info="info"
                @click="showInfo"
                @pick="pick"
                />
            </div>

            <h2 class="BattleChoosePlayer__item-name orbitron-font --semi-bold">
                <span>{{ Players[1].name }} </span>
                <span>[{{ Players[1].category }}]</span>
            </h2>

            <button v-if="pickedPlayer" class="PlayerPick__button orbitron-font --semi-bold" @click="handlePickBtn"> 
                <img src="/gui/images/battle-player-list/pick-button.svg"/>
                <div class="PlayerPick__button-name">PICK THIS HERO</div>      
             </button>
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
      const currentTime = computed(() => {
        const time = timerStore.time;
        return time < 10 ? `0${time}` : time;
      });

      watch(currentTime, (newTime) => {
        if (newTime === "00") {
          emit('timeReached');
          timerStore.resetTimer()
        }
      });

      return {
        currentTime,
      };
  },

  data() {
    return {
        pickedPlayer: null,
        background: "/gui/images/battle-player-list/background.svg",
        pickedBackground: "/gui/images/battle-player-list/picked-background.svg",
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
    },

     pick(player: PlayerType) {
          this.pickedPlayer = player
     },

     changeBackground(player: PlayerType) {
        if (this.pickedPlayer && this.pickedPlayer === player) {
          return this.pickedBackground;
        } 
        else {
          return this.background;
        }
     },

     handlePickBtn() {
        this.$emit('picked', this.pickedPlayer)
        timerStore.resetTimer()
     }
   },
   
}
</script>


<style scoped src="./BattleChoosePlayer.css">

</style>