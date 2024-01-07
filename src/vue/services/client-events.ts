import { useBattleStore, useScenesStore, useSettingsStore, useStarsStore, useUiStore } from '@/stores';
import { ClientEvent, SceneName } from '@/types';
import { Settings } from '~/game/data/Settings';
import { GameEvents } from '~/game/events/GameEvents';

export class ClientEventsService {

  static async handleEvent({ detail: clientEvent }: Event & { detail: ClientEvent }) {
    const battleStore = useBattleStore();
    const scenesStore = useScenesStore();
    const settingsStore = useSettingsStore();
    const starsStore = useStarsStore();
    const uiStore = useUiStore();

    switch (clientEvent.eventName) {
      case GameEvents.EVENT_LOADING:
        break;

      case GameEvents.EVENT_LOADED:
        if (!Settings.isDebugMode) {
          await starsStore.fetchStars();
        }
        scenesStore.setScene(SceneName.Start, {
          mode: 'welcome'
        });
        break;

      case GameEvents.EVENT_GAME_CREATED:
        break;

      case GameEvents.EVENT_GAME_FULLSCREEN:
        break;

      case GameEvents.EVENT_HIDE_STAR_PREVIEW:
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
      //   battleStore.setPlayerSearchingState(true);
      //   break;

      case GameEvents.EVENT_STOP_SEARCHING:
        battleStore.setPlayerSearchingState(false);
        break;

      // case 'GAME_SEARCHING_ERROR':
      //   battleStore.setPlayerSearchingState(false);
      //   break;

      // case 'GAME_BATTLE_PREPARE':
      //   scenesStore.setScene(SceneName.Battle);
      //   break;

      // case 'GAME_BATTLE_START':
      //   scenesStore.setSceneMode('process');
      //   break;

      // case 'GAME_BATTLE_ACTION_COOLDOWN':
      //   scenesStore.setSceneMode('process');
      //   break;
    }
  }
}
