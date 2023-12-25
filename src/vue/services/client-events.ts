import { useBattleStore, useScenesStore, useSettingsStore, useStarsStore, useUiStore } from '@/stores';
import { ClientEvent } from '@/types';
import { Settings } from '~/game/data/Settings';

export class ClientEventsService {
  static async handleEvent({ detail: clientEvent }: Event & { detail: ClientEvent }) {
    const battleStore = useBattleStore();
    const scenesStore = useScenesStore();
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
        scenesStore.setSceneMode('welcome');
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
        scenesStore.setSceneMode('real');
        break;

      case 'SHOW_PHANTOM_MODE':
        scenesStore.setSceneMode('phantom');
        break;

      case 'EVENT_STAR_MODE':
        scenesStore.setClientScene('star');
        break;

      case 'EVENT_GALAXY_MODE':
        scenesStore.setClientScene('galaxy');
        break;

      // case 'GAME_SEARCHING_START':
      //   battleStore.setState('searching');
      //   break;

      // case 'GAME_SEARCHING_END':
      //   battleStore.setState('initial');
      //   break;

      // case 'GAME_SEARCHING_ERROR':
      //   battleStore.setState('initial');
      //   break;
    }
  }
}
