import { useBattleStore, useScenesStore, useStarsStore, useUiStore } from '@/stores';
import { ClientEvent, SceneName } from '@/types';
import { wait } from '@/utils';
import { Settings } from '~/game/data/Settings';
import { GameEvent } from '~/game/events/GameEvents';
import { LogMng } from '~/game/utils/LogMng';

export class ClientEventsService {

  static async handleEvent({ detail: clientEvent }: Event & { detail: ClientEvent }) {
    const battleStore = useBattleStore();
    const scenesStore = useScenesStore();
    const starsStore = useStarsStore();
    const uiStore = useUiStore();

    switch (clientEvent.eventName) {

      case GameEvent.GAME_LOADING:
        break;

      case GameEvent.GAME_LOADED:
        if (!Settings.isDebugMode) {
          // await starsStore.fetchStars();
        }
        scenesStore.setScene(SceneName.Start, {
          mode: 'welcome'
        });
        break;

      case GameEvent.GAME_CREATED:
        break;

      case GameEvent.GAME_FULLSCREEN:
        break;

      case GameEvent.HIDE_STAR_PREVIEW:
        uiStore.star.hideStarTooltip();
        break;

      case GameEvent.HIDE_STAR_GUI:
        uiStore.star.hideStarPanel();
        break;

      case GameEvent.SHOW_STAR_PREVIEW:
        uiStore.star.showStarTooltip(clientEvent, 500);
        break;

      case GameEvent.SHOW_STAR_GUI:
        uiStore.star.showStarPanel(clientEvent);
        break;

      case GameEvent.PHANTOM_STAR_PREVIEW:
        uiStore.star.showPhantomStarTooltip(clientEvent, 500);
        break;

      case GameEvent.SHOW_REAL_MODE:
        scenesStore.setSceneMode('real');
        break;

      case GameEvent.SHOW_PHANTOM_MODE:
        scenesStore.setSceneMode('phantom');
        break;

      case GameEvent.STAR_MODE:
        scenesStore.setClientScene('star');
        break;

      case GameEvent.GALAXY_MODE:
        scenesStore.setScene(SceneName.Galaxy);
        scenesStore.setClientScene('galaxy');
        break;

      case GameEvent.BATTLE_SEARCHING_START:
        battleStore.connecting.setPlayerSearchingState(true);
        break;

      case GameEvent.BATTLE_SEARCHING_STOP:
        battleStore.connecting.setPlayerSearchingState(false);
        break;
      
      case GameEvent.BATTLE_SEARCHING_ERROR:
        battleStore.connecting.setPlayerSearchingState(false);
        break;

      case GameEvent.BATTLE_PREROLL_SHOW:
        battleStore.connecting.setPlayerSearchingState(false);
        scenesStore.setScene(SceneName.Battle);
        battleStore.process.setState({
          players: {
            connected: {
              address: clientEvent.enemyWallet || '0xADDR-ENEMY',
              name: 'Kepler',
              race: 'Humans',
              star: '2048RX',
            },
            current: {
              address: clientEvent.playerWallet || '0xADDR-PLAYER',
              name: 'Anthares',
              race: 'Insects',
              star: '2048RX',
            },
          },
          gold: 1000,
          level: 1,
          skills: {
            satelliteFire: {
              charges: {
                count: 3,
                fractions: 4
              },
              cooldown: {
                duration: clientEvent.timer || 3000,
              }
            }
          }
        });

        await wait(3000);

        scenesStore.setSceneMode('process');

        break;

      // case GameEvent.BATTLE_SHOW_START:
      //   scenesStore.setSceneMode('process');
      //   break;

      // case 'GAME_BATTLE_ACTION_COOLDOWN':
      //   scenesStore.setSceneMode('process');
      //   break;

      case GameEvent.BATTLE_COMPLETE_SHOW:
        const typeByStatus: {[index: string]: 'victory' | 'defeat'} = {
          win: 'victory',
          lose: 'defeat',
          draw: 'defeat'
        }

        battleStore.process.setResults({
          type: typeByStatus[clientEvent.status],
          player: '0xA089D195D994e8145dda68993A91C4a6D1704535',
          owner: '0xA089D195D994e8145dda68993A91C4a6D1704535',
          demage: 1000,
          gold: 1000,
          exp: 51323,
          rating: {
            prevoius: 1310,
            current: 1422
          },
        })

        scenesStore.setScene(SceneName.Battle, {
          mode: 'results'
        })

        break;

      default:
        LogMng.error(`Unknown game event:`, clientEvent);
        break;
    }
  }
}
