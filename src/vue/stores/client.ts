import { defineStore } from 'pinia';
import { ClientData } from '@/types';

type ClientStore = {
  currentStarId: number;
  fullscreen: boolean;
  musicVolume: number;
  overlay: boolean;
  sfxVolume: number;
  starPanel: ClientData | null;
  tooltip: ClientData | null;
};

export const useClientStore = defineStore('client', {
  state: (): ClientStore => {
    const musicVolume = Number(localStorage.getItem('musicVolume')) * 100;
    const sfxVolume = Number(localStorage.getItem('sfxVolume')) * 100;

    return {
      currentStarId: -1,
      fullscreen: false,
      musicVolume: musicVolume ?? 50,
      overlay: false,
      sfxVolume: sfxVolume ?? 50,
      starPanel: null,
      tooltip: null
    };
  },
  actions: {
    changeSfxVolume(volume: number) {
      this.sfxVolume = volume;
      this.client.setSFXVolume(volume);
    },
    changeMusicVolume(volume: number) {
      this.musicVolume = volume;
      this.client.setMusicVolume(volume);
    },
    enableOverlay() {
      this.overlay = true;
    },
    disableOverlay() {
      this.overlay = false;
    },
    diveIn() {
      this.hideTooltip();
      this.client.diveIn(this.currentStarId);
    },
    hideTooltip() {
      this.tooltip = null;
      this.disableOverlay();
      this.client.closeStarPreview();
    },
    hideStarPanel() {
      this.starPanel = null;
      this.client.flyFromStar();
    },
    setFullscreenMode(value: boolean) {
      this.fullscreen = value;
    },
    setCurrentStarId(starId: number) {
      this.currentStarId = starId;
    },
    showTooltip(data) {
      this.client.handleClick();
      this.tooltip = data;
      this.enableOverlay();
    },
    showStarPanel(data) {
      this.starPanel = data;
    }
  }
});
