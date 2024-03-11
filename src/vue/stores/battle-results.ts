import { defineStore } from 'pinia';
import { BattleResults } from '@/types';

import { ref } from 'vue';

export const useBattleResultsStore = defineStore('battleResults', () => {
  const state = ref<BattleResults | null>(null)

  const setResults = (value: BattleResults) => {
    state.value = value
  }

  const reset = () => {
    state.value = null
  }

  return {
    state,
    setResults,
    reset
  }
});
