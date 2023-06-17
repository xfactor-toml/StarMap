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

type SettingsStoreState = {
  agreementAccepted: boolean;
  fullscreen: boolean;
  mode: GuiMode;
  modesPanelHidden: boolean;
  musicVolume: number;
  newStarPosition: StarPosition | null;
  overlay: boolean;
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
};

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStoreState => {
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
      newStarPosition: null,
      overlay: false,
      screen: 'preloader',
      sfxVolume,
      starBoostPanel: null,
      starPanel: null,
      starTooltip: null,
      view: 'galaxy',
      viewsPanelHidden
    };
  },
  actions: {
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
    showStarTooltip({ starData, pos2d }: ShowStarPreviewEvent) {
      this.client.onClick();

      const starsStore = useStarsStore();
      const star = starsStore.getById(starData.id) || new Star(starData);

      this.enableOverlay();
      this.starTooltip = {
        position: new StarScreenPosition(pos2d),
        star
      };
    },
    showStarPanel({ starData, scale }: ShowStarGuiEvent) {
      const starsStore = useStarsStore();
      const star = starsStore.getById(starData.id) || new Star(starData);

      this.starPanel = {
        scale,
        starId: star.id
      };
    },
    showPhantomStarTooltip({ pos2d, pos3d }: PhantomStarPreviewEvent) {
      this.client.onClick();
      this.enableOverlay();
      this.newStarPosition = new StarPosition(pos2d, pos3d);
    },
    showStarBoostPanel({ starId, type }: SettingsStoreState['starBoostPanel']) {
      this.client.onClick();
      this.enableOverlay();
      this.starBoostPanel = {
        starId,
        type
      };
    }
  }
});
