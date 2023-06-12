import { GuiEvent } from '@/types';
import { markRaw } from 'vue';
import { FrontEvents } from '~/events/FrontEvents';

export class ClientService {
  constructor(private dispatcher: typeof FrontEvents) {}

  run(fullscreen: boolean) {
    this.handleGuiEvent('click');
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
    this.handleGuiEvent('click');
    this.dispatcher.starPreviewClose.dispatch();
  }

  diveIn(starId: number) {
    this.handleGuiEvent('click');
    this.dispatcher.diveIn.dispatch({ starId });
  }

  flyFromStar() {
    this.handleGuiEvent('click');
    this.dispatcher.flyFromStar.dispatch();
  }

  updateStarLevelFilter(levels: number[]) {
    this.dispatcher.starLevelFilterUpdate.dispatch(levels);
  }

  handleGuiEvent(event: GuiEvent) {
    const handlers: Record<GuiEvent, () => void> = {
      click: () => this.dispatcher.onClick.dispatch(),
      hover: () => this.dispatcher.onHover.dispatch(),
      resize: () => this.dispatcher.onWindowResizeSignal.dispatch(),
      leftPanelGalaxyClick: () => this.dispatcher.onLeftPanelGalaxyClick.dispatch(),
      leftPanelStarClick: () => this.dispatcher.onLeftPanelStarClick.dispatch(),
      leftPanelPlanetClick: () => this.dispatcher.onLeftPanelPlanetClick.dispatch(),
      botPanelPhantomClick: () => this.dispatcher.onBotPanelPhantomClick.dispatch(),
      botPanelRealClick: () => this.dispatcher.onBotPanelRealClick.dispatch()
    };

    const handler = handlers[event];

    handler();
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
