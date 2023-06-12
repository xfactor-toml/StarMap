import { defineStore } from 'pinia';
import { ClientData, GuiEvent, GuiMode, GuiModeName, GuiScreen, GuiViewName } from '@/types';
import { MODES } from '@/constants';
import { Star } from '@/models';

type SettingsStore = {
  agreementAccepted: boolean;
  fullscreen: boolean;
  mode: GuiMode;
  modesPanelHidden: boolean;
  musicVolume: number;
  overlay: boolean;
  panelStar: ClientData | null;
  screen: GuiScreen;
  sfxVolume: number;
  tooltipStar: Star | null;
  tooltipNewStar: Star | null;
  view: GuiViewName;
  viewsPanelHidden: boolean;
};

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStore => {
    const agreementAccepted = localStorage.getItem('agreementAccepted') === '1';
    const modesPanelHidden = localStorage.getItem('modesPanelHidden') === '1';
    const musicVolume = Number(localStorage.getItem('musicVolume') ?? 0.5) * 100;
    const sfxVolume = Number(localStorage.getItem('sfxVolume') ?? 0.5) * 100;
    const viewsPanelHidden = localStorage.getItem('viewsPanelHidden') === '1';

    return {
      agreementAccepted,
      fullscreen: false,
      mode: MODES['real'],
      modesPanelHidden,
      musicVolume,
      overlay: false,
      panelStar: null,
      screen: 'preloader',
      sfxVolume,
      tooltipStar: null,
      tooltipNewStar: null,
      view: 'galaxy',
      viewsPanelHidden
    };
  },
  actions: {
    setMode(modeName: GuiModeName) {
      const mode = MODES[modeName];
      const view = mode.views.find(view => view.enabled);
      const eventsMap: Record<
        Exclude<GuiModeName, 'season'>,
        Extract<GuiEvent, 'botPanelPhantomClick' | 'botPanelRealClick'>
      > = {
        phantom: 'botPanelPhantomClick',
        real: 'botPanelRealClick'
      };

      this.client.handleGuiEvent(eventsMap[modeName]);
      this.mode = mode;
      this.setView(view.name);
    },
    setView(view: GuiViewName) {
      const eventsMap: Record<
        GuiViewName,
        Extract<GuiEvent, 'leftPanelGalaxyClick' | 'leftPanelStarClick' | 'leftPanelPlanetClick'>
      > = {
        galaxy: 'leftPanelGalaxyClick',
        planet: 'leftPanelPlanetClick',
        star: 'leftPanelStarClick'
      };

      this.client.handleGuiEvent(eventsMap[view]);

      if (this.view === 'star' && view === 'galaxy') {
        this.returnToGalaxy();
      }

      this.view = view;
    },
    setScreen(screen: GuiScreen) {
      this.screen = screen;
    },
    acceptAgreement() {
      this.agreementAccepted = true;
      localStorage.setItem('agreementAccepted', '1');
    },
    revokeAgreement() {
      this.agreementAccepted = false;
      localStorage.removeItem('agreementAccepted');
    },
    toggleModesPanel() {
      this.modesPanelHidden = !this.modesPanelHidden;
      localStorage.setItem('modesPanelHidden', `${Number(this.modesPanelHidden)}`);
    },
    toggleViewsPanel() {
      this.viewsPanelHidden = !this.viewsPanelHidden;
      localStorage.setItem('viewsPanelHidden', `${Number(this.viewsPanelHidden)}`);
    },
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
      this.setView('star');
    },
    returnToGalaxy() {
      this.hideStarPanel();
      this.client.flyFromStar();
    },
    hideStarTooltip() {
      this.tooltipNewStar = null;
      this.tooltipStar = null;
      this.disableOverlay();
      this.client.closeStarPreview();
    },
    hideStarPanel() {
      this.panelStar = null;
    },
    setFullscreenMode(value: boolean) {
      this.fullscreen = value;
    },
    showStarTooltip(data) {
      this.client.handleGuiEvent('click');
      if (this.mode.name === 'phantom') {
        this.tooltipNewStar = new Star(data);
      } else {
        this.tooltipStar = new Star(data);
      }
      this.enableOverlay();
    },
    showStarPanel(data) {
      this.panelStar = data;
    }
  }
});
