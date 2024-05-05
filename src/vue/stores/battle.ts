import { defineStore } from 'pinia';

import { useBattleConnectingStore } from '@/stores/battle-connecting';
import { useBattleProcessStore } from '@/stores/battle-process';
import { useBattleResultsStore } from '@/stores/battle-results';
import { useBattleRewardsStore } from '@/stores/battle-rewards';
import { useBattleEmotionsStore } from '@/stores/battle-emotions';

export const useBattleStore = defineStore('battle', () => {
  const connecting = useBattleConnectingStore()
  const process = useBattleProcessStore()
  const results = useBattleResultsStore()
  const rewards = useBattleRewardsStore()
  const emotions = useBattleEmotionsStore()

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
    emotions,
    reset,
  }
});
