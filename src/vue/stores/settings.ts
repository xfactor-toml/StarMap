import { defineStore } from 'pinia';

import { useSettingsVolumeStore } from '@/stores/settings-volume';
import { useSettingsAgreementStore } from '@/stores/settings-agreement';
import { useSettingsModeStore } from '@/stores/settings-mode';
import { useSettingsViewStore } from '@/stores/settings-view';
import { useSettingsScreenStore } from '@/stores/settings-screen';

export const useSettingsStore = defineStore('settings', () => {
  const agreement = useSettingsAgreementStore()
  const mode = useSettingsModeStore()
  const screen = useSettingsScreenStore()
  const view = useSettingsViewStore()
  const volume = useSettingsVolumeStore()

  return {
    agreement,
    mode,
    screen,
    view,
    volume,
  }
});
