import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useBattleConnectingStore = defineStore('battleConnecting', () => {
  const playerSearching = ref(false)
  const acceptTime = ref(0) // seconds
  const loadingProgress = ref(0)

  const setPlayerSearchingState = (state: boolean) => {
    playerSearching.value = state;
  }

  const setAcceptTime = (time: number) => {
    acceptTime.value = time;
  }

  const setLoadingProgress = (value: number) => {
    loadingProgress.value = value;
  }

  return {
    playerSearching,
    acceptTime,
    loadingProgress,
    setAcceptTime,
    setLoadingProgress,
    setPlayerSearchingState,
  }
});
