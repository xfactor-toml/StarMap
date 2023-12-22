import { defineStore } from 'pinia';
import { GuiScreenName } from '@/types';

import { ref } from 'vue';

export const useSettingsScreenStore = defineStore('settingsScreen', () => {
  const selected = ref<GuiScreenName>('preloader')

  const setScreen = (screen: GuiScreenName) => {
    selected.value = screen;
  }

  return {
    selected,
    setScreen,
  }
});
