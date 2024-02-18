import { defineStore } from 'pinia';
import { BattleActionType, BattleActiveCooldown, BattleCooldown, BattleData, BattleResults, BattleSkill } from '@/types';

import { computed, ref } from 'vue';

import { default as anime } from 'animejs';
import { cancelAnimation } from '@/utils';

const getInitialState = () => ({
  players: {
    connected: null,
    current: null,
  },
  gold: 0,
  level: {
    current: 1,
    progress: 0
  },
  skills: {}
})

const getInitialCooldown = () => ({
  invisibility: null,
  satelliteFire: null,
  slowdown: null,
  rocketFire: null,
})

export const useBattleProcessStore = defineStore('battleProcess', () => {
  const state = ref<BattleData>(getInitialState())
  const cooldown = ref<BattleCooldown>(getInitialCooldown())
  const results = ref<BattleResults | null>(null)
  const skillsPendingList = ref<BattleActionType[]>([])
  const activeCooldown = ref<BattleActiveCooldown>({})
  const players = computed(() => state.value.players)

  const addSkillToPendingList = (skillType: BattleActionType) => {
    skillsPendingList.value.push(skillType)
  }

  const removeSkillFromPendingList = (skillType: BattleActionType) => {
    skillsPendingList.value = skillsPendingList.value.filter(type => type !== skillType)
  }

  const setState = (newState: BattleData) => {
    state.value = newState;
  }

  const setLevel = (data: BattleData['level']) => {
    state.value.level = data
  }

  const setSkill = (skillType: BattleActionType, data: BattleSkill) => {
    state.value.skills[skillType] = data
  }

  const setResults = (value: BattleResults) => {
    results.value = value
  }

  const runCooldown = (skillType: BattleActionType) => {
    const { duration } = state.value.skills[skillType].cooldown
    
    cooldown.value[skillType] = {
      duration,
      progress: 0
    };

    activeCooldown.value[skillType] = anime({
      targets: cooldown.value[skillType],
      progress: 100,
      duration,
      easing: 'linear',
      update: ({ progress }) => {
        const timePassed = duration * (progress / 100)
        const timeleft = Math.trunc(duration - timePassed)

        cooldown.value[skillType].duration = timeleft
      },
      complete: () => {
        cooldown.value[skillType] = null
        removeSkillFromPendingList(skillType)
      }
    })
  }

  const reset = () => {
    results.value = null
    state.value = getInitialState()
    cooldown.value = getInitialCooldown()
    skillsPendingList.value = []
    Object.values(activeCooldown).forEach(cancelAnimation)
    activeCooldown.value = {}
  }

  return {
    cooldown,
    players,
    state,
    skillsPendingList,
    results,
    addSkillToPendingList,
    setState,
    setLevel,
    setSkill,
    setResults,
    runCooldown,
    reset
  }
});
