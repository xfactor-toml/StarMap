import { defineStore } from 'pinia';
import { GuiScreen } from '@/types';

import { ref } from 'vue';

export const useSettingsScreenStore = defineStore('settingsScreen', () => {
  const selected = ref<GuiScreen>('preloader')

  const setScreen = (screen: GuiScreen) => {
    selected.value = screen;
  }

  return {
    selected,
    setScreen,
  }
});
