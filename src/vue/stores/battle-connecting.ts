import { defineStore } from 'pinia';
import { ref } from 'vue';
import { default as anime } from 'animejs';
import { cancelAnimation, toMilliseconds } from '@/utils';
import { BattleConnectedUsers } from '@/types';

export const useBattleConnectingStore = defineStore('battleConnecting', () => {
  const playerSearching = ref(false)
  const showTutorial = ref(false)
  const acceptTime = ref(0)
  const acceptTimeProgress = ref(0)
  const acceptTimeProgressAnimation = ref<anime.AnimeInstance | null>(null)
  const loadingProgress = ref(0)
  const connectedUsers = ref<BattleConnectedUsers>({
    current: 0,
    max: 0,
  })


  const setPlayerSearchingState = (state: boolean) => {
    playerSearching.value = state;
  }

  const setShowTutorial = (state: boolean) => {
    showTutorial.value = state;
  }

  // time - seconds
  const setAcceptTime = (time: number) => {
    acceptTime.value = time
    if (acceptTimeProgressAnimation.value) {
      cancelAnimation(acceptTimeProgressAnimation.value)
    }

    acceptTimeProgressAnimation.value = anime({
      targets: { progress: 0 },
      progress: [0, 100],
      duration: toMilliseconds({
        seconds: time
      }),
      easing: 'linear',
      update({ progress }) {
        acceptTimeProgress.value = progress;
      },
    })

  }

  const setLoadingProgress = (value: number) => {
    loadingProgress.value = value;
  }

  const setConnectedUsers = (value: BattleConnectedUsers) => {
    connectedUsers.value = value;
  }

  return {
    playerSearching,
    acceptTimeProgress,
    loadingProgress,
    connectedUsers,
    acceptTime,
    showTutorial,
    setAcceptTime,
    setLoadingProgress,
    setPlayerSearchingState,
    setConnectedUsers,
    setShowTutorial
  }
});
