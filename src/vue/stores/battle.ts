import { defineStore } from 'pinia';
import { BattleStoreState } from '@/types';

import { computed, ref } from 'vue';

export const useBattleStore = defineStore('battle', () => {
  const playerSearching = ref(false)

  const state = ref<BattleStoreState>({
    players: {
      connected: null,
      current: null,
    },
    gold: 0,
    level: 1,
    skills: {}
  })

  const players = computed(() => state.value.players)

  const setPlayerSearchingState = (state: boolean) => {
    playerSearching.value = state;
  }

  const setState = (newState: BattleStoreState) => {
    state.value = newState;
  }

  return {
    playerSearching,
    players,
    state,
    setPlayerSearchingState,
    setState,
  }
});
