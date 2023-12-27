import { Star } from '@/models';
import { markRaw } from 'vue';
import { FrontEvents } from '~/game/events/FrontEvents';
import { debounce } from "typescript-debounce-decorator";
import { logger } from '@/services/logger';
import { useBattleStore, useScenesStore } from '@/stores';
import { SceneName } from '@/types';
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

    // battle.setRunningState('searching');
    
    // await wait(2000)
    
    // battle.setRunningState('initial');
    scenes.setScene(SceneName.Battle)
    battle.setMembers([
      {
        address: '0xA089D195D994e8145dda68993A91C4a6D1704538',
        name: 'Kepler',
        race: 'Humans',
      },
      {
        address: '0xA089D195D994e8145dda68993A91C4a6D1704538',
        name: 'Anthares',
        race: 'Insects',
      },
    ])

    await wait(2000)

    scenes.setScene(SceneName.Battle, {
      mode: 'process'
    })
    // MOCK END
  }
  
  onSearchingClick() {
    logger.log('searching click')
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
