<template>
  <div class="BattleTutorialProgress">
    <transition name="fade">
      <BattleTutorial 
        v-if="showTutorial"
        @skip="handleSkip"
      />
      <BattleReadyProgress v-else />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BattleTutorial, BattleReadyProgress } from '@/components';

export default defineComponent({
  name: 'BattleTutorialProgress',
  components: {
    BattleTutorial,
    BattleReadyProgress
  },
  data() {
    return {
      showTutorial: true,
    };
  },
  methods: {
    handleSkip() {
      this.showTutorial = false;
    },
  },
});
</script>

<style scoped src="./BattleTutorialProgress.css"></style>