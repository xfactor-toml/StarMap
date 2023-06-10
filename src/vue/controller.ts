import { GuiInterface, ClientData, GuiButton } from './types';
import { useSettingsStore, useElementsStore } from './stores';

export function Controller(GUI: GuiInterface) {
  // @ts-ignore
  let frontEvents;
  let currentStarId = -1;

  const elementsStore = useElementsStore();
  const settingsStore = useSettingsStore();

  settingsStore.setScreen('preloader');

  GUI.on('agreement', () => {
    frontEvents.playInitScreenSfx.dispatch();
  });

  GUI.on('run', fullscreen => {
    frontEvents.onClick.dispatch();
    frontEvents.startGame.dispatch(fullscreen);
    settingsStore.setScreen('interface');
  });

  GUI.on('buttonClick', (buttonName: GuiButton) => {
    frontEvents.onClick.dispatch();

    switch (buttonName) {
      case 'starPanelHide': {
        elementsStore.hideStarPanel();
        frontEvents.flyFromStar.dispatch();
        break;
      }

      case 'starPanelPlay': {
        console.log('star panel play');
        break;
      }

      case 'tooltipHide': {
        elementsStore.hideTooltip();
        frontEvents.starPreviewClose.dispatch();
        break;
      }

      case 'tooltipDiveIn': {
        elementsStore.hideTooltip();
        frontEvents.diveIn.dispatch({
          starId: currentStarId
        });
        break;
      }
    }
  });

  GUI.on('buttonHover', (buttonName: GuiButton) => {
    frontEvents.onHover.dispatch();
  });

  GUI.on('overlayClick', () => {
    GUI.emit('buttonClick', 'tooltipHide');
  });

  window.addEventListener('gameEvent', (e: Event & { detail: ClientData }) => {
    const data = e.detail;

    switch (data.eventName) {
      case 'GAME_LOADING':
        break;

      case 'GAME_LOADED':
        // @ts-ignore
        frontEvents = e.detail.frontEvents;
        settingsStore.setScreen('welcome');

        break;

      case 'GAME_CREATED':
        break;

      case 'GAME_FULLSCREEN':
        break;

      case 'SHOW_STAR_PREVIEW':
        currentStarId = data.starId;
        elementsStore.showTooltip({ ...data, textAutofit: true });
        break;

      case 'HIDE_STAR_PREVIEW':
        elementsStore.hideTooltip();
        break;

      case 'SHOW_STAR_GUI':
        elementsStore.showStarPanel(data);
        break;
    }
  });

  // INFO: client didnt send event when press escape
  document.body.addEventListener('fullscreenchange', () => {
    settingsStore.setFullscreenMode(!settingsStore.fullscreen);
  });

  // Global Events
  window.addEventListener('resize', () => {
    frontEvents.onWindowResizeSignal.dispatch();
  });

  return GUI;
}
