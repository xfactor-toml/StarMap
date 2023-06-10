import { defineStore } from 'pinia';
import { GuiElement } from '../types';
import { useSettingsStore } from './settings';

type ElementsStore = Record<
  GuiElement,
  {
    visible: boolean;
    data?: any;
  }
>;

export const useElementsStore = defineStore('elements', {
  state: (): ElementsStore => ({
    starPanel: { visible: false, data: null },
    tooltip: { visible: false, data: null }
  }),
  actions: {
    showElement({
      element,
      overlay,
      data
    }: {
      element: GuiElement;
      overlay: boolean;
      data: any;
    }) {
      const target = this[element];
      const settingsStore = useSettingsStore();

      if (target) {
        if (target.data && target.data.name === data?.name) {
          this.hideElement({
            element,
            overlay
          });
        } else {
          target.data = data;
          target.visible = true;

          if (overlay) {
            settingsStore.enableOverlay();
          }
        }
      }
    },
    hideElement({
      element,
      overlay
    }: {
      element: GuiElement;
      overlay: boolean;
    }) {
      const target = this[element];
      const settingsStore = useSettingsStore();

      if (target?.visible) {
        target.data = null;
        target.visible = false;

        if (overlay) {
          settingsStore.disableOverlay();
        }
      }
    },
    showTooltip(data) {
      this.showElement({
        element: 'tooltip',
        overlay: true,
        data
      });
    },
    hideTooltip() {
      this.hideElement({
        element: 'tooltip',
        overlay: true
      });
    },
    showStarPanel(data) {
      this.showElement({ element: 'starPanel', data });
    },
    hideStarPanel() {
      this.hideElement({ element: 'starPanel' });
    }
  }
});
