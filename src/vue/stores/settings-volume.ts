import { defineStore } from 'pinia';
import { GlobalParams } from '~/game/data/GlobalParams';
import { ref } from 'vue';
import { useClient } from '@/services';
import { LOCAL_STORAGE_KEYS } from '@/constants';

export const useSettingsVolumeStore = defineStore('settingsVolume', () => { 
  const music = ref(Number(localStorage.getItem(LOCAL_STORAGE_KEYS.musicVolume) ?? GlobalParams.AUDIO.defaultMusicVolume) * 100)
  const sfx = ref(Number(localStorage.getItem(LOCAL_STORAGE_KEYS.sfxVolume) ?? GlobalParams.AUDIO.defaultSfxVolume) * 100)
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
