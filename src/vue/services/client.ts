import { Star } from '@/models';
import { markRaw } from 'vue';
import { FrontEvents } from '~/game/events/FrontEvents';
import { debounce } from "typescript-debounce-decorator";
import { logger } from '@/services/logger';
import { useBattleStore, useScenesStore } from '@/stores';
import { BattleActionType, SceneName } from '@/types';
import { wait } from '@/utils';

export class ClientService {
  constructor(private dispatcher: typeof FrontEvents) {}

  run(fullscreen: boolean, stars: Star[] = []) {
    this.dispatcher.startGame.dispatch(
      fullscreen,
      stars.map(star => star.toRaw())
    );
  }

  playInitSceneSfx() {
    this.dispatcher.playInitScreenSfx.dispatch();
  }

  setSFXVolume(volume: number) {
    this.dispatcher.setSFXVolume.dispatch({ v: volume / 100 });
  }

  setMusicVolume(volume: number) {
    this.dispatcher.setMusicVolume.dispatch({ v: volume / 100 });
  }

  toggleFullscreen() {
    this.dispatcher.toggleFullscreen.dispatch();
  }

  closeStarPreview() {
    this.dispatcher.starPreviewClose.dispatch();
  }

  diveIn(starId: number) {
    this.dispatcher.diveIn.dispatch({ starId });
  }

  flyFromStar() {
    this.dispatcher.flyFromStar.dispatch();
  }

  updateStarLevelFilter(levels: number[]) {
    logger.log({ levels });
    this.dispatcher.starLevelFilterChanged.dispatch(levels);
  }

  @debounce(200)
  search(key: string) {
    this.dispatcher.starNameFilterChanged.dispatch(key);
  }

  onClick() {
    this.dispatcher.onClick.dispatch();
  }

  onHover() {
    this.dispatcher.onHover.dispatch();
  }

  onWindowResize() {
    this.dispatcher.onWindowResizeSignal.dispatch();
  }

  onLeftPanelGalaxyClick() {
    this.dispatcher.onLeftPanelGalaxyClick.dispatch();
  }

  onLeftPanelStarClick() {
    this.dispatcher.onLeftPanelStarClick.dispatch();
  }

  onLeftPanelPlanetClick() {
    this.dispatcher.onLeftPanelPlanetClick.dispatch();
  }

  onBotPanelPhantomClick() {
    this.dispatcher.onBotPanelPhantomClick.dispatch();
  }

  onBotPanelRealClick() {
    this.dispatcher.onBotPanelRealClick.dispatch();
  }

  onStarCreated(star: Star) {
    this.dispatcher.onStarCreated.dispatch(star.toRaw());
  }

  onStarUpdated(star: Star) {
    this.dispatcher.onStarUpdated.dispatch(star.toRaw());
  }

  async onGameStart() {
    logger.log('start game')

    // MOCK START
    const scenes = useScenesStore()
    const battle = useBattleStore()

    battle.setPlayerSearchingState(true);
    
    await wait(2000)
    
    battle.setPlayerSearchingState(false);
    scenes.setScene(SceneName.Battle)

    battle.setState({
      players: {
        connected: {
          address: '0xA089D195D994e8145dda68993A91C4a6D1704535',
          name: 'Kepler',
          race: 'Humans',
          star: '2048RX',
        },
        current: {
          address: '0xA089D195D994e8145dda68993A91C4a6D1704538',
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
            duration: 3000,
          }
        }
      }
    })

    await wait(2000)

    scenes.setScene(SceneName.Battle, {
      mode: 'process'
    })
    // MOCK END
  }
  
  onSearchingClick() {
    logger.log('searching click')
  }
  
  onBattleAction(payload: { type: BattleActionType }) {
    const battleStore = useBattleStore()

    battleStore.addSkillToPendingList(payload.type)
    logger.log(`battle action, ${JSON.stringify(payload)}`)

    // MOCK START
    wait(1000).then(() => {
      battleStore.setCooldown(payload.type, 2000)

      wait(3000).then(() => {
        const scenes = useScenesStore()

        battleStore.setResults({
          type: 'victory',
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

        scenes.setScene(SceneName.Battle, {
          mode: 'results'
        })
      })
    })
    // MOCK END
  }
  
  onClaim() {
    logger.log('claim')
  }
  

  static VuePlugin = {
    install: app => {
      app.config.globalProperties.$client = markRaw(new ClientService(FrontEvents));
    }
  };

  static StorePlugin = () => ({
    client: markRaw(new ClientService(FrontEvents))
  });
}

export const useClient = () => new ClientService(FrontEvents)
