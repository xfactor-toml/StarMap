import { defineStore } from 'pinia';

import { useBattleConnectingStore } from '@/stores/battle-connecting';
import { useBattleProcessStore } from '@/stores/battle-process';
import { useBattleResultsStore } from '@/stores/battle-results';
import { useBattleRewardsStore } from '@/stores/battle-rewards';

export const useBattleStore = defineStore('battle', () => {
  const connecting = useBattleConnectingStore()
  const process = useBattleProcessStore()
  const results = useBattleResultsStore()
  const rewards = useBattleRewardsStore()

  const reset = () => {
    process.reset()
    results.reset()
    rewards.reset()
  }

  return {
    connecting,
    process,
    results,
    rewards,
    reset,
  }
});
