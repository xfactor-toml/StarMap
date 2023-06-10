import { defineStore } from 'pinia';
import { GuiMode, GuiModeName, GuiScreen, GuiView, GuiViewName } from '../types';
import { MODES } from '../constants/modes';

type SettingsStore = {
  agreementAccepted: boolean;
  fullscreen: boolean;
  mode: GuiMode;
  musicVolume: number;
  overlay: boolean;
  screen: GuiScreen;
  sfxVolume: number;
  view: GuiViewName;
};

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStore => {
    const agreementAccepted = Boolean(localStorage.getItem('agreementAccepted'));
    const musicVolume = Number(localStorage.getItem('musicVolume')) * 100;
    const sfxVolume = Number(localStorage.getItem('sfxVolume')) * 100;

    return {
      agreementAccepted,
      fullscreen: false,
      mode: MODES['real'],
      musicVolume: musicVolume ?? 50,
      overlay: false,
      screen: 'preloader',
      sfxVolume: sfxVolume ?? 50,
      view: 'galaxy'
    };
  },
  actions: {
    changeSfxVolume(volume: number) {
      this.sfxVolume = volume;
      this.client.setSFXVolume.dispatch({ v: volume / 100 });
    },
    changeMusicVolume(volume: number) {
      this.musicVolume = volume;
      this.client.setMusicVolume.dispatch({ v: volume / 100 });
    },
    toggleFullscreen() {
      this.client.toggleFullscreen.dispatch();
    },
    setFullscreenMode(value: boolean) {
      this.fullscreen = value;
    },
    setMode(modeName: GuiModeName) {
      const mode = MODES[modeName];
      const view = mode.views.find(view => view.enabled);

      this.mode = mode;
      this.view = view.name;
    },
    setView(view: GuiViewName) {
      this.view = view;
    },
    setScreen(screen: GuiScreen) {
      this.screen = screen;
    },
    enableOverlay() {
      this.overlay = true;
    },
    disableOverlay() {
      this.overlay = false;
    },
    acceptAgreement(value: boolean) {
      this.agreementAccepted = value;

      value
        ? localStorage.setItem('agreementAccepted', `${Number(value)}`)
        : localStorage.removeItem('agreementAccepted');
    }
  }
});
