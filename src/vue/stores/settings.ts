import { defineStore } from 'pinia';
import {
  GuiMode,
  GuiModeName,
  GuiScreen,
  GuiViewName,
  PhantomStarPreviewEvent,
  ShowStarGuiEvent,
  ShowStarPreviewEvent
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
  panelStar: Star | null;
  screen: GuiScreen;
  sfxVolume: number;
  starTooltip: {
    star: Star;
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
      panelStar: null,
      screen: 'preloader',
      sfxVolume,
      starTooltip: null,
      view: 'galaxy',
      viewsPanelHidden
    };
  },
  actions: {
    setMode(modeName: GuiModeName) {
      const mode = MODES[modeName];
      const view = mode.views.find(view => view.enabled);
      const clientHandler: Record<Exclude<GuiModeName, 'season'>, () => {}> = {
        phantom: () => this.client.onBotPanelPhantomClick(),
        real: () => this.client.onBotPanelRealClick()
      };

      clientHandler[modeName]();

      this.mode = mode;
      this.setView(view.name);
    },
    setView(view: GuiViewName) {
      const clientHandler: Record<GuiViewName, () => {}> = {
        galaxy: () => this.client.onLeftPanelGalaxyClick(),
        planet: () => this.client.onLeftPanelPlanetClick(),
        star: () => this.client.onLeftPanelStarClick()
      };

      clientHandler[view]();

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
      this.client.onClick();
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
      this.panelStar = null;
    },
    setFullscreenMode(value: boolean) {
      this.fullscreen = value;
    },
    showStarTooltip({ starData, pos2d }: ShowStarPreviewEvent) {
      this.client.onClick();

      const starsStore = useStarsStore();
      const star = starsStore.getById(starData.id);

      if (!star) {
        return;
      }

      this.enableOverlay();
      this.starTooltip = {
        position: new StarScreenPosition(pos2d),
        star
      };
    },
    showStarPanel({ starData, scale }: ShowStarGuiEvent) {
      const starsStore = useStarsStore();
      const star = starsStore.getById(starData.id);

      star.setScale(scale);

      this.panelStar = star;
    },
    showPhantomStarTooltip({ pos2d, pos3d }: PhantomStarPreviewEvent) {
      this.client.onClick();
      this.enableOverlay();
      this.newStarPosition = new StarPosition(pos2d, pos3d);
    }
  }
});
