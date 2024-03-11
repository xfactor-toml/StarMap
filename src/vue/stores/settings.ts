import { defineStore } from 'pinia';

import { useSettingsVolumeStore } from '@/stores/settings-volume';
import { useSettingsAgreementStore } from '@/stores/settings-agreement';

export const useSettingsStore = defineStore('settings', () => {
  const agreement = useSettingsAgreementStore()
  const volume = useSettingsVolumeStore()

  return {
    agreement,
    volume,
  }
});
