import { Star } from '@/models';
import { markRaw } from 'vue';
import { FrontEvents } from '~/events/FrontEvents';

export class ClientService {
  constructor(private dispatcher: typeof FrontEvents) {}

  run(fullscreen: boolean, stars: Star[] = []) {
    this.dispatcher.startGame.dispatch(
      fullscreen,
      stars.map(star => star.toRaw())
    );
  }

  playInitScreenSfx() {
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
    this.dispatcher.starLevelFilterUpdate.dispatch(levels);
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

  static VuePlugin = {
    install: app => {
      app.config.globalProperties.$client = markRaw(new ClientService(FrontEvents));
    }
  };

  static StorePlugin = () => ({
    client: markRaw(new ClientService(FrontEvents))
  });
}
