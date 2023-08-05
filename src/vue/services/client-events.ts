import { useSettingsStore, useStarsStore } from '@/stores';
import { ClientEvent } from '@/types';

export class ClientEventsService {
  static async handleEvent({ detail: clientEvent }: Event & { detail: ClientEvent }) {
    const settingsStore = useSettingsStore();
    const starsStore = useStarsStore();

    switch (clientEvent.eventName) {
      case 'GAME_LOADING':
        break;

      case 'GAME_LOADED':
        await starsStore.fetchStars();
        settingsStore.setScreen('welcome');
        break;

      case 'GAME_CREATED':
        break;

      case 'GAME_FULLSCREEN':
        break;

      case 'HIDE_STAR_PREVIEW':
        settingsStore.hideStarTooltip();
        break;

      case 'HIDE_STAR_GUI':
        settingsStore.hideStarPanel();
        break;

      case 'SHOW_STAR_PREVIEW':
        settingsStore.showStarTooltip(clientEvent, 500);
        break;

      case 'SHOW_STAR_GUI':
        settingsStore.showStarPanel(clientEvent);
        break;

      case 'PHANTOM_STAR_PREVIEW':
        settingsStore.showPhantomStarTooltip(clientEvent, 500);
        break;

      case 'SHOW_REAL_MODE':
        settingsStore.setMode('real');
        break;

      case 'SHOW_PHANTOM_MODE':
        settingsStore.setMode('phantom');
        break;

      case 'EVENT_STAR_MODE':
        settingsStore.setView('star');
        break;

      case 'EVENT_GALAXY_MODE':
        settingsStore.setView('galaxy');
        break;
    }
  }
}
