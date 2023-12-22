import { defineStore } from 'pinia';

import { useSettingsVolumeStore } from '@/stores/settings-volume';
import { useSettingsBattleStore } from '@/stores/settings-battle';
import { useSettingsAgreementStore } from '@/stores/settings-agreement';
import { useSettingsModeStore } from '@/stores/settings-mode';
import { useSettingsViewStore } from '@/stores/settings-view';
import { useSettingsScreenStore } from '@/stores/settings-screen';

export const useSettingsStore = defineStore('settings', () => {
  const agreement = useSettingsAgreementStore()
  const battle = useSettingsBattleStore()
  const mode = useSettingsModeStore()
  const screen = useSettingsScreenStore()
  const view = useSettingsViewStore()
  const volume = useSettingsVolumeStore()

  return {
    agreement,
    battle,
    mode,
    screen,
    view,
    volume,
  }
});
