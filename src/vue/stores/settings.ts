import { defineStore } from 'pinia';
import {
  GuiMode,
  GuiModeName,
  GuiScreen,
  GuiViewName,
  PhantomStarPreviewEvent,
  ShowStarGuiEvent,
  ShowStarPreviewEvent,
  StarBoostPanelType
} from '@/types';
import { MODES } from '@/constants';
import { Star, StarPosition, StarScreenPosition } from '@/models';
import { useStarsStore } from '@/stores/stars';
import { WINDOW_MOBILE_BREAKPOINT } from '@/constants/global';

type SettingsStoreState = {
  agreementAccepted: boolean;
  fullscreen: boolean;
  levelsPanelHidden: boolean;
  mode: GuiMode;
  modesPanelHidden: boolean;
  musicVolume: number;
  newStarPosition: StarPosition | null;
  overlay: boolean;
  overlayActive: boolean;
  screen: GuiScreen;
  sfxVolume: number;
  starBoostPanel: {
    starId: number;
    type: StarBoostPanelType;
  } | null;
  starPanel: {
    starId: number;
    scale: number;
  } | null;
  starTooltip: {
    star: Star;
    scale: number;
    position: StarScreenPosition;
  } | null;
  view: GuiViewName;
  viewsPanelHidden: boolean;
  windowWidth: number;
};

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStoreState => {
    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= WINDOW_MOBILE_BREAKPOINT;
    const agreementAccepted = localStorage.getItem('agreementAccepted') === '1';
    const levelsPanelHidden = isMobile ? true : localStorage.getItem('levelsPanelHidden') === '1';
    const modesPanelHidden = isMobile ? true : localStorage.getItem('modesPanelHidden') === '1';
    const musicVolume = Number(localStorage.getItem('musicVolume') ?? 0.5) * 100;
    const sfxVolume = Number(localStorage.getItem('sfxVolume') ?? 0.5) * 100;
    const viewsPanelHidden = isMobile ? true : localStorage.getItem('viewsPanelHidden') === '1';

    return {
      agreementAccepted,
      fullscreen: false,
      levelsPanelHidden,
      mode: MODES['real'],
      modesPanelHidden,
      musicVolume,
      newStarPosition: null,
      overlay: false,
      overlayActive: false,
      screen: 'preloader',
      sfxVolume,
      starBoostPanel: null,
      starPanel: null,
      starTooltip: null,
      view: 'galaxy',
      viewsPanelHidden,
      windowWidth: window.innerWidth
    };
  },
  actions: {
    setWindowWidth(width: number) {
      this.windowWidth = width;
    },
    setMode(modeName: GuiModeName) {
      const mode = MODES[modeName];
      const view = mode.views.find(view => view.enabled);

      this.mode = mode;
      this.setView(view.name);
    },
    setView(view: GuiViewName) {
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
    setModesPanelHidden(state: boolean) {
      this.modesPanelHidden = state;
    },
    setViewsPanelHidden(state: boolean) {
      this.viewsPanelHidden = state;
    },
    setLevelsPanelHidden(state: boolean) {
      this.levelsPanelHidden = state;
    },
    toggleModesPanel() {
      this.modesPanelHidden = !this.modesPanelHidden;
      localStorage.setItem('modesPanelHidden', `${Number(this.modesPanelHidden)}`);
      if (this.isMobileViewport && !this.modesPanelHidden) {
        this.setLevelsPanelHidden(true);
        this.setViewsPanelHidden(true);
      }
    },
    toggleViewsPanel() {
      this.viewsPanelHidden = !this.viewsPanelHidden;
      localStorage.setItem('viewsPanelHidden', `${Number(this.viewsPanelHidden)}`);
      if (this.isMobileViewport && !this.viewsPanelHidden) {
        this.setLevelsPanelHidden(true);
        this.setModesPanelHidden(true);
      }
    },
    toggleLevelsPanel() {
      this.levelsPanelHidden = !this.levelsPanelHidden;
      localStorage.setItem('levelsPanelHidden', `${Number(this.levelsPanelHidden)}`);
      if (this.isMobileViewport && !this.levelsPanelHidden) {
        this.setModesPanelHidden(true);
        this.setViewsPanelHidden(true);
      }
    },
    closePanels() {
      this.setModesPanelHidden(true);
      this.setViewsPanelHidden(true);
      this.setLevelsPanelHidden(true);
    },
    changeSfxVolume(volume: number) {
      this.sfxVolume = volume;
      this.client.setSFXVolume(volume);
    },
    changeMusicVolume(volume: number) {
      this.musicVolume = volume;
      this.client.setMusicVolume(volume);
    },
    enableOverlay(aActiveTimer) {
      this.overlay = true;
      this.overlayActive = false;
      setTimeout(() => {
        this.overlayActive = true;
      }, aActiveTimer);
    },
    disableOverlay() {
      this.overlayActive = false;
      this.overlay = false;
    },
    diveIn() {
      this.client.onClick();
      this.client.diveIn(this.starTooltip.star.id);
      this.hideStarTooltip();
      this.setView('star');
    },
    returnToGalaxy() {
      this.hideStarPanel();
      this.client.flyFromStar();
    },
    hideStarTooltip() {
      this.newStarPosition = null;
      this.starTooltip = null;
      this.disableOverlay();
      this.client.onClick();
      this.client.closeStarPreview();
    },
    hideStarPanel() {
      this.starPanel = null;
    },
    hideStarBoostPanel() {
      this.disableOverlay();
      this.client.onClick();
      this.starBoostPanel = null;
    },
    setFullscreenMode(value: boolean) {
      this.fullscreen = value;
    },
    showStarTooltip({ starData, pos2d }: ShowStarPreviewEvent, aOverlayActionDelay: number) {
      this.client.onClick();

      const starsStore = useStarsStore();
      const star = starsStore.getById(starData.id) || new Star(starData);

      this.enableOverlay(aOverlayActionDelay);
      this.starTooltip = {
        position: new StarScreenPosition(pos2d),
        star
      };

      if (this.isMobileViewport) {
        this.closePanels();
      }
    },
    showStarPanel({ starData, scale }: ShowStarGuiEvent) {
      const starsStore = useStarsStore();
      const star = starsStore.getById(starData.id) || new Star(starData);

      this.starPanel = {
        scale,
        starId: star.id
      };
    },
    showPhantomStarTooltip({ pos2d, pos3d }: PhantomStarPreviewEvent, aOverlayActionDelay: number) {
      this.client.onClick();
      this.enableOverlay(aOverlayActionDelay);
      this.newStarPosition = new StarPosition(pos2d, pos3d);

      if (this.isMobileViewport) {
        this.closePanels();
      }
    },
    showStarBoostPanel({ starId, type }: SettingsStoreState['starBoostPanel']) {
      this.client.onClick();
      this.enableOverlay();
      this.starBoostPanel = {
        starId,
        type
      };
    }
  },
  getters: {
    isMobileViewport() {
      return this.windowWidth <= WINDOW_MOBILE_BREAKPOINT;
    }
  }
});
