import { defineStore } from 'pinia';
import { BattleState } from '@/types';

import { ref } from 'vue';

export const useBattleStore = defineStore('battle', () => {
  const state = ref<BattleState>('initial')

  const setState = (nextState: BattleState) => {
    state.value = nextState;
  }

  return {
    state,
    setState,
  }
});
