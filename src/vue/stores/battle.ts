import { defineStore } from 'pinia';

import { useBattleConnectingStore } from '@/stores/battle-connecting';
import { useBattleProcessStore } from '@/stores/battle-process';

export const useBattleStore = defineStore('battle', () => {
  const connecting = useBattleConnectingStore()
  const process = useBattleProcessStore()

  return {
    connecting,
    process,
  }
});
