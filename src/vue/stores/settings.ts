import { defineStore } from 'pinia';
import { GuiEvent, GuiMode, GuiModeName, GuiScreen, GuiViewName } from '@/types';
import { MODES } from '@/constants';
import { useClientStore } from '@/stores';

type SettingsStore = {
  agreementAccepted: boolean;
  mode: GuiMode;
  modesPanelHidden: boolean;
  screen: GuiScreen;
  view: GuiViewName;
  viewsPanelHidden: boolean;
};

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStore => {
    const agreementAccepted = localStorage.getItem('agreementAccepted') === '1';
    const modesPanelHidden = localStorage.getItem('modesPanelHidden') === '1';
    const viewsPanelHidden = localStorage.getItem('viewsPanelHidden') === '1';

    return {
      agreementAccepted,
      mode: MODES['real'],
      modesPanelHidden,
      screen: 'preloader',
      view: 'galaxy',
      viewsPanelHidden
    };
  },
  actions: {
    setMode(modeName: GuiModeName) {
      const clientStore = useClientStore();
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
      const clientStore = useClientStore();
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
        clientStore.hideStarPanel();
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
    }
  }
});
