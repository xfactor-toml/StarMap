<template>
    <div class="BattleWaitProgress">
        <h1 class="BattleWaitProgress__title jura-font --bold">
            <span >Waiting</span>
            <span >opponent</span>    
        </h1>
        <h2 class="BattleWaitProgress__time --light">
            {{ time }}
        </h2>
        <button class="BattleWaitProgress__buton">
            <img src="/gui/images/battle-ready-progress/waitingbutton.svg">
            <div class="BattleWaitProgress__acceptprogress">
                <BattleAcceptProgress 
                  :totalTime="0"
                  :maxTime="10"
                  :increase="true"
                  @update="updateTime"
                  />
            </div>
            <div class="BattleWaitProgress__buton-name --bold">
                {{ this.currenUser }} / {{ this.maxUsers }}
            </div> 
        </button>
        <div class="BattleWaitProgress__content">
            <h3 class="BattleWaitProgress__content-name --bold">
                QUICK TIP
            </h3>
            <p class="BattleWaitProgress__content-description exo2-font">
                Amet, luctus leo, platea orci, cursus in nisi cursus dictum libero, ipsum nulla imperdiet nulla non molestie justo cursus dolor velit venenatis amet, vel consectetur dictum. Cras id non platea .
            </p>
        </div>
    </div>
</template>

<script  lang="ts">
  import { BattleAcceptProgress } from '@/components';
  
  export default {
    name: 'BattleWaitProgress',
    data() {
        return {
            time: 0,
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
    props: {
        currenUser: {
            type: Number
        },
        maxUsers: {
            type: Number
        }
    }
    
  }

</script>

<style scoped src="./BattleWaitProgress.css">

</style>