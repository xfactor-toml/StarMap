import { defineStore } from 'pinia';
import { GuiViewName } from '@/types';

import { ref } from 'vue';

export const useSettingsViewStore = defineStore('settingsView', () => {
  const selected = ref<GuiViewName>('galaxy')

  const setView = (view: GuiViewName) => {
    selected.value = view;
  }

  return {
    selected,
    setView,
  }
});
