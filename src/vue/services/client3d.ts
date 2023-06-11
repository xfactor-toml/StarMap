import { markRaw } from 'vue';
import { FrontEvents } from '~/events/FrontEvents';

export class Client3DService {
  constructor(private dispatcher: typeof FrontEvents) {}

  run(fullscreen: boolean) {
    this.handleClick();
    this.dispatcher.startGame.dispatch(fullscreen);
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
    this.handleClick();
    this.dispatcher.starPreviewClose.dispatch();
  }

  diveIn(starId: number) {
    this.handleClick();
    this.dispatcher.diveIn.dispatch({ starId });
  }

  flyFromStar() {
    this.handleClick();
    this.dispatcher.flyFromStar.dispatch();
  }

  playStarPanel() {
    console.log('star panel play');
  }

  handleClick() {
    this.dispatcher.onClick.dispatch();
  }

  handleHover() {
    this.dispatcher.onHover.dispatch();
  }

  handleResize() {
    this.dispatcher.onWindowResizeSignal.dispatch();
  }

  static VuePlugin = {
    install: app => {
      app.config.globalProperties.$client = markRaw(new Client3DService(FrontEvents));
    }
  };

  static StorePlugin = () => ({
    client: markRaw(new Client3DService(FrontEvents))
  });
}
