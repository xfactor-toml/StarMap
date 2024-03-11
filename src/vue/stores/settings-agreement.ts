import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LOCAL_STORAGE_KEYS } from '@/constants';

export const useSettingsAgreementStore = defineStore('settingsAgreement', () => {
  const accepted = ref(localStorage.getItem(LOCAL_STORAGE_KEYS.agreement) === '1')

  const accept = () => {
    accepted.value = true;
    localStorage.setItem(LOCAL_STORAGE_KEYS.agreement, '1');
  }

  const revoke = () => {
    accepted.value = false;
    localStorage.removeItem(LOCAL_STORAGE_KEYS.agreement);
  }

  return {
    accepted,
    accept,
    revoke
  }
});
