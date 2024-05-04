import { playersConnectMock } from '@/mocks';
import { useBattleStore, useScenesStore, useStarsStore, useUiStore } from '@/stores';
import { BattleActionType, ClientEvent, UISceneNames } from '@/types';
import { toMilliseconds, wait } from '@/utils';
import { GameEvent } from '~/game/events/GameEvents';
import { LogMng } from '~/game/utils/LogMng';

export class ClientEventsService {
  static async handleEvent({ detail: clientEvent }: Event & { detail: ClientEvent }) {
    const battleStore = useBattleStore();
    const scenesStore = useScenesStore();
    const starsStore = useStarsStore();
    const uiStore = useUiStore();

    switch (clientEvent.eventName) {

      case GameEvent.MESSAGE:
        // TODO: redo
        alert(clientEvent.msg);
        break;
      
      case GameEvent.GAME_LOADING:
        break;

      case GameEvent.GAME_LOADED:
        await starsStore.fetchStars();
        scenesStore.setScene(UISceneNames.Start, {
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
        scenesStore.setScene(UISceneNames.Galaxy);
        scenesStore.setClientScene('galaxy');
        break;
      
      case GameEvent.BATTLE_ACCEPT_SCREEN:
        switch (clientEvent.action) {

          case 'show':
            // playersConnectMock();
            // seconds
            const ACCEPT_TIME = clientEvent.time?.acceptTimeSec || 6
            // const LOADING_TIME = 4
            
            scenesStore.setScene(UISceneNames.Battle)

            // Accept
            scenesStore.setSceneMode('accept');
            battleStore.connecting.setAcceptTime(ACCEPT_TIME);

            // await wait(toMilliseconds({
            //   seconds: ACCEPT_TIME / 3
            // }))

            break;
          
          case 'update':
            scenesStore.setSceneMode('connect');
            battleStore.connecting.setConnectedUsers({
              current: clientEvent.state.current,
              max: clientEvent.state.max
            });
            break;
          
          case 'close':
            scenesStore.setScene(UISceneNames.Galaxy);
            break;
          
          default:
            LogMng.warn(`vue(ClientEventsService): BATTLE_ACCEPT_SCREEN: unknown clientEvent.action=${clientEvent.action}`);
            break;
          
        }
        battleStore.connecting.setPlayerSearchingState(true);
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
        scenesStore.setScene(UISceneNames.Battle);
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
          gold: 0,
          level: {
            current: 1,
            progress: 0
          },
          skills: {
            satelliteFire: {
              level: 1,
              levelUpAvailable: false,
              cooldown: {
                duration: 3000,
              }
            },
            rocketFire: {
              level: 0,
              levelUpAvailable: false,
              cooldown: {
                duration: 3000,
              }
            },
            slowdown: {
              level: 0,
              levelUpAvailable: false,
              cooldown: {
                duration: 3000,
              }
            },
            invisibility: {
              level: 0,
              levelUpAvailable: false,
              cooldown: {
                duration: 3000,
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
          loss: 'defeat',
          draw: 'defeat'
        }

        battleStore.results.setResults({
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
          box: {
            show: clientEvent.showBoxClaim,
            level: clientEvent.boxLevel
          }
        })

        scenesStore.setScene(UISceneNames.Battle, {
          mode: 'results'
        });

        break;
      
      case GameEvent.BATTLE_COMPLETE_HIDE:
        scenesStore.setScene(UISceneNames.Galaxy);
        break;
      
      case GameEvent.SHOW_TOKEN_REWARD:
        battleStore.rewards.setCoins(clientEvent.tokens);
        scenesStore.setScene(UISceneNames.Battle, {
          mode: 'coins'
        });
        break;
      
      case GameEvent.SHOW_BOX_OPEN:
        // battleStore.rewards.setRewards([
        //   { name: 'test1', image: '/gui/images/box.png' },
        //   { name: 'test2', image: '/gui/images/box.png' },
        //   { name: 'test3', image: '/gui/images/box.png' },
        //   { name: 'test4', image: '/gui/images/box.png' },
        //   { name: 'test5', image: '/gui/images/box.png' },
        // ]);

        battleStore.rewards.setBoxesIds(clientEvent.list);

        scenesStore.setScene(UISceneNames.Battle, {
          mode: 'rewards'
        });
        
        break;
      
      case GameEvent.BATTLE_EXP_DATA:
        LogMng.debug(`GUI: update level progress: ${clientEvent.levelExpPercent}`);
        const actionTypes: BattleActionType[] = ['satelliteFire', 'rocketFire', 'slowdown', 'invisibility'];
        
        battleStore.process.setLevel({
          current: clientEvent.level,
          progress: clientEvent.levelExpPercent
        });

        LogMng.debug(`GUI: update skiils: ${clientEvent.skills}`);

        for (let i = 0; i < clientEvent.skills.length; i++) {
          const sd = clientEvent.skills[i];
          battleStore.process.setSkill(actionTypes[i], {
            level: sd.level,
            levelUpAvailable: sd.levelUpAvailable,
            cooldown: {
              duration: sd.cooldown.duration
            }
          });
        }
        
        break;

      default:
        LogMng.error(`Unknown game event:`, clientEvent);
        break;
    }
  }
}
