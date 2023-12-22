import { defineStore } from 'pinia';
import { Settings } from '~/game/data/Settings';
import { ref } from 'vue';
import { useClient } from '@/services';
import { LOCAL_STORAGE_KEYS } from '@/constants';

export const useSettingsVolumeStore = defineStore('settingsVolume', () => { 
  const music = ref(Number(localStorage.getItem(LOCAL_STORAGE_KEYS.musicVolume) ?? Settings.AUDIO.defaultMusicVolume) * 100)
  const sfx = ref(Number(localStorage.getItem(LOCAL_STORAGE_KEYS.sfxVolume) ?? Settings.AUDIO.defaultSfxVolume) * 100)
  const client = useClient()

  const changeSfxVolume = (volume: number) => {
    sfx.value = volume;
    client.setSFXVolume(volume);
  }

  const changeMusicVolume = (volume: number) => {
    music.value = volume;
    client.setMusicVolume(volume);
  }

  return {
    music,
    sfx,
    changeSfxVolume,
    changeMusicVolume
  }
});
