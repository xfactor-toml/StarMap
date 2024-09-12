<template>
    <div class="PlayerPick">
      <div class="PlayerPick__container">
        <h1 class="PlayerPick__name orbitron-font --semi-bold">
            <span>{{ player.name }}</span>
            <span>{{ player.category }}</span>
        </h1>
        <div class="PlayerPick__item">
            <PlayerModel 
             :background="background" 
             :player="player"
             :info="info" 
             @click="cancelPick"
             />
        </div>
        <div class="PlayerPick__time orbitron-font --semi-bold">
            <hr />
               <p> 00:{{ currentTime }}</p>
            <hr />
        </div>

        <div class="PlayerPick__title">
            <h4 class="orbitron-font --bold ">TITLE</h4>
            <p>{{ player.title }}</p>
        </div>

        <hr class="PlayerPick__title-line"/>

        <div class="PlayerPick__ability">
            <div class="PlayerPick__ability-img">
                <img src="/gui/images/battle-player-list/ability.svg"/>
            </div>
            <div class="PlayerPick__ability-content">
                <h4 class="PlayerPick__ability-title orbitron-font --bold">
                NAME ABILITY
               </h4>
                <p>{{ player.ability }}</p>
            </div>
        </div>

        <button class="PlayerPick__button orbitron-font --semi-bold" @click="pickHero"> 
            <img src="/gui/images/battle-player-list/pick-button.svg"/>
            <div class="PlayerPick__button-name">PICK THIS HERO</div>      
        </button>
      </div>
    </div>
</template>

<script lang="ts">
import PlayerModel from '../PlayerModel/PlayerModel.vue';
import { Players } from '@/constants';
import { PlayerType } from '@/types';
import { PropType } from 'vue';
import { computed, watch } from 'vue';
import { timerStore } from '@/utils';

export default {
    name: 'PlayerPick',
    components: {
        PlayerModel
    },
    props: {
        player: {
           type: Object as PropType<PlayerType>,
           default: () => Players[0]
        },
    
    },
    data() {
        return {
            background: "/gui/images/battle-player-list/background.svg",
            info: "/gui/images/battle-player-list/close.svg"
        };
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
    mounted() {
        timerStore.startTimer(); // Ensure the timer continues running when this component is mounted
    },
    methods: {
        cancelPick() {
            this.$emit('cancelPick');
        },
        pickHero() {
            this.$emit('pickHero', this.player);
            timerStore.resetTimer()
        }
    }
}
</script>

<style scoped src="./PlayerPick.css"></style>
