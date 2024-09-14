<template>
  <div class="BattleTutorialProgress">
    <transition name="fade">
      <BattleTutorial 
        v-if="battleStore.connecting.showTutorial"
        @skip="handleSkip"
      />
      <BattleReadyProgress v-else />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BattleTutorial, BattleReadyProgress } from '@/components';
import { useBattleStore } from '@/stores';
import { mapStores } from 'pinia';

export default defineComponent({
  name: 'BattleTutorialProgress',
  components: {
    BattleTutorial,
    BattleReadyProgress
  },
  computed: mapStores(useBattleStore),
  methods: {
    handleSkip() {
      this.battleStore.connecting.setShowTutorial(false);
    },
  },
});
</script>

<style scoped src="./BattleTutorialProgress.css"></style>