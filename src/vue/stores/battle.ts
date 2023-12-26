import { defineStore } from 'pinia';
import { BattleMember, BattleRunningState } from '@/types';

import { ref } from 'vue';

export const useBattleStore = defineStore('battle', () => {
  const runningState = ref<BattleRunningState>('initial')

  const members = ref<[BattleMember, BattleMember] | null>(null)

  const setRunningState = (nextState: BattleRunningState) => {
    runningState.value = nextState;
  }

  const setMembers = (value: [BattleMember, BattleMember]) => {
    members.value = value;
  }

  return {
    runningState,
    members,
    setRunningState,
    setMembers
  }
});
