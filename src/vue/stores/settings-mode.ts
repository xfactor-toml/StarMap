import { defineStore } from 'pinia';
import { GuiMode, GuiModeName } from '@/types';

import { MODES } from '@/constants';
import { ref } from 'vue';
import { useSettingsViewStore } from '@/stores/settings-view';

export const useSettingsModeStore = defineStore('settingsMode', () => {
  const selected = ref<GuiMode>(MODES['real'])
  const viewsStore = useSettingsViewStore()

  const setMode = (modeName: GuiModeName) => {
    const mode = MODES[modeName];
    const view = mode.views.find(view => view.enabled);

    selected.value = mode;
    viewsStore.setView(view.name);
  }

  return {
    selected,
    setMode,
  }
});
