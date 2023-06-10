import { defineStore } from 'pinia';
import { GuiMode, GuiModeName, GuiScreen, GuiViewName } from '@/types';
import { MODES } from '@/constants';

type SettingsStore = {
  agreementAccepted: boolean;
  mode: GuiMode;
  screen: GuiScreen;
  view: GuiViewName;
};

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStore => {
    const agreementAccepted = Boolean(localStorage.getItem('agreementAccepted'));

    return {
      agreementAccepted,
      mode: MODES['real'],
      screen: 'preloader',
      view: 'galaxy'
    };
  },
  actions: {
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
    acceptAgreement() {
      this.agreementAccepted = true;
      localStorage.setItem('agreementAccepted', '1');
    },
    revokeAgreement() {
      this.agreementAccepted = false;
      localStorage.removeItem('agreementAccepted');
    }
  }
});
