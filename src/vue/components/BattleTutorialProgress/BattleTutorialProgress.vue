<template>
    <div class="BattleTutorialProgress">
    <transition name="fade">
        <BattleTutorial 
        v-if="showTutorial"
        @skip="handleSkip" />
     </transition>
    <transition name="fade">
        <BattleReadyProgress 
            v-if="!showTutorial"
            @click="battleAccept"/>
    </transition>
    </div>
   
  </template>
  
  <script lang="ts">
  import { BattleTutorial, BattleReadyProgress } from '@/components';
  
  export default {
    name: 'BattleTutorialProgress',
    components: {
      BattleTutorial,
      BattleReadyProgress
    },
    data() {
      return {
        showTutorial: true, 
      }
    },
    methods: {
      handleSkip() {
        this.showTutorial = false;
      },
      battleAccept() {
        this.$client.onBattleAccept()
      }
    }
  };
  </script>

<style scoped src="./BattleTutorialProgress.css">

</style>