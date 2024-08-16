<template>
    <div class="BattleReadyProgress">
        <h1 class="BattleReadyProgress__title jura-font --bold">
            <span >Your GAME</span>
            <span >IS READY</span>
        </h1>
        <h2 class="BattleReadyProgress__time --light">
            {{ time }}
        </h2>
        <button class="BattleReadyProgress__buton" @click="$emit('click')">
            <img src="/gui/images/battle-ready-progress/readybutton.svg">
            <div class="BattleReadyProgress__acceptprogress">
                <BattleAcceptProgress 
                  :total-time="50"
                  :increase="false"
                  @update="updateTime"
                  />
            </div>
            <div class="BattleReadyProgress__buton-name --bold">
                ACCEPT GAME 
            </div> 
        </button>
        <div class="BattleReadyProgress__content">
            <h3 class="BattleReadyProgress__content-name --bold">
                QUICK TIP
            </h3>
            <p class="BattleReadyProgress__content-description exo2-font">
                Amet, luctus leo, platea orci, cursus in nisi cursus dictum libero, ipsum nulla imperdiet nulla non molestie justo cursus dolor velit venenatis amet, vel consectetur dictum. Cras id non platea .
            </p>
        </div>
        <p class="BattleReadyProgress__bottom --bold"> decline match </p>
    </div>
</template>

<script  lang="ts">
  import { BattleAcceptProgress } from '@/components';
  
  export default {
    name: 'BattleReadyProgress',
    data() {
        return {
            time: 50,
        }
    },
    components: {
        BattleAcceptProgress,
    },
    methods: {
        updateTime(time: Number) {
            this.time = time
        }
    }, 
    
  }

</script>

<style scoped src="./BattleReadyProgress.css">

</style>