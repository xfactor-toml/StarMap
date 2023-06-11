import { defineStore } from 'pinia';
import { ClientData } from '@/types';
import { Star } from '@/models';

type ClientStore = {
  fullscreen: boolean;
  musicVolume: number;
  overlay: boolean;
  panelStar: ClientData | null;
  sfxVolume: number;
  tooltipStar: Star | null;
};

export const useClientStore = defineStore('client', {
  state: (): ClientStore => {
    const musicVolume = Number(localStorage.getItem('musicVolume') ?? 0.5) * 100;
    const sfxVolume = Number(localStorage.getItem('sfxVolume') ?? 0.5) * 100;

    return {
      fullscreen: false,
      musicVolume,
      overlay: false,
      panelStar: null,
      sfxVolume,
      tooltipStar: null
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
      this.client.diveIn(this.tooltipStar.starId);
      this.hideStarTooltip();
    },
    hideStarTooltip() {
      this.tooltipStar = null;
      this.disableOverlay();
      this.client.closeStarPreview();
    },
    hideStarPanel() {
      this.panelStar = null;
      this.client.flyFromStar();
    },
    setFullscreenMode(value: boolean) {
      this.fullscreen = value;
    },
    showStarTooltip(data) {
      this.client.handleGuiEvent('click');
      this.tooltipStar = new Star(data);
      this.enableOverlay();
    },
    showStarPanel(data) {
      this.panelStar = data;
    }
  }
});
