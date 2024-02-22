import { defineStore } from 'pinia';
import { BattleReward } from '@/types';

import { ref } from 'vue';

export const useBattleRewardsStore = defineStore('battleRewards', () => {
  const list = ref<BattleReward[]>([])

  const setRewards = (rewards: BattleReward[]) => {
    list.value = rewards
  }

  const reset = () => {
    list.value = []
  }

  return {
    list,
    setRewards,
    reset
  }
});
