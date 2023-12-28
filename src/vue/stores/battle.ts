import { defineStore } from 'pinia';
import { BattleActionType, BattleActiveCooldown, BattleCooldown, BattleStoreState } from '@/types';

import { computed, ref } from 'vue';

import { default as anime } from 'animejs';

const cancelAnimation = (animation) => {
  const activeInstances = anime.running;
  const index = activeInstances.indexOf(animation);

  activeInstances.splice(index, 1);
}

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

  const cooldown = ref<BattleCooldown>({
    invisibility: null,
    satelliteFire: null,
    slowdown: null,
    rocketFire: null,
  })

  const skillsPendingList = ref<BattleActionType[]>([])

  const activeCooldown = ref<BattleActiveCooldown>({})

  const players = computed(() => state.value.players)

  const addSkillToPendingList = (skillType: BattleActionType) => {
    skillsPendingList.value.push(skillType)
  }

  const removeSkillFromPendingList = (skillType: BattleActionType) => {
    skillsPendingList.value = skillsPendingList.value.filter(type => type !== skillType)
  }

  const runCooldown = (skillType: BattleActionType, duration: number) => {
    if (activeCooldown.value[skillType]) {
      cancelAnimation(activeCooldown.value[skillType])
    }

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

  const setPlayerSearchingState = (state: boolean) => {
    playerSearching.value = state;
  }

  const setState = (newState: BattleStoreState) => {
    state.value = newState;
  }

  const setCooldown = (skillType: BattleActionType, duration: number) => {
    runCooldown(skillType, duration)
  }

  return {
    cooldown,
    playerSearching,
    players,
    state,
    skillsPendingList,
    addSkillToPendingList,
    setPlayerSearchingState,
    setState,
    setCooldown,
  }
});
