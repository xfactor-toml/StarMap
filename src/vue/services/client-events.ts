import { useSettingsStore, useStarsStore, useUiStore } from '@/stores';
import { ClientEvent } from '@/types';
import { Settings } from '~/game/data/Settings';

export class ClientEventsService {
  static async handleEvent({ detail: clientEvent }: Event & { detail: ClientEvent }) {
    const settingsStore = useSettingsStore();
    const starsStore = useStarsStore();
    const uiStore = useUiStore();

    switch (clientEvent.eventName) {
      case 'GAME_LOADING':
        break;

      case 'GAME_LOADED':
        if (!Settings.isDebugMode) {
          await starsStore.fetchStars();
        }
        settingsStore.screen.setScreen('welcome');
        break;

      case 'GAME_CREATED':
        break;

      case 'GAME_FULLSCREEN':
        break;

      case 'HIDE_STAR_PREVIEW':
        uiStore.star.hideStarTooltip();
        break;

      case 'HIDE_STAR_GUI':
        uiStore.star.hideStarPanel();
        break;

      case 'SHOW_STAR_PREVIEW':
        uiStore.star.showStarTooltip(clientEvent, 500);
        break;

      case 'SHOW_STAR_GUI':
        uiStore.star.showStarPanel(clientEvent);
        break;

      case 'PHANTOM_STAR_PREVIEW':
        uiStore.star.showPhantomStarTooltip(clientEvent, 500);
        break;

      case 'SHOW_REAL_MODE':
        settingsStore.mode.setMode('real');
        break;

      case 'SHOW_PHANTOM_MODE':
        settingsStore.mode.setMode('phantom');
        break;

      case 'EVENT_STAR_MODE':
        settingsStore.view.setView('star');
        break;

      case 'EVENT_GALAXY_MODE':
        settingsStore.view.setView('galaxy');
        break;
    }
  }
}
