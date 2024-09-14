import { Star } from '@/models';
import { markRaw } from 'vue';
import { FrontEvents } from '~/game/events/FrontEvents';
import { debounce } from "typescript-debounce-decorator";
import { logger } from '@/services/logger';
import { useBattleStore, useScenesStore } from '@/stores';
import { BattleActionPayload, UISceneNames } from '@/types';
import { LogMng } from '~/monax/LogMng';
import { Emotion } from '~/game/battle/Types';

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
    LogMng.debug('Front: start game click');
    FrontEvents.onBattleSearch.dispatch();

    // mock start
    // player connect
    // playersConnectMock()

    // battle run
    // battleRunMock()

    return
    // mock end
    
  }

  onGameStartDuel() {
    // START DUEL
  }

  onGameStartWithBot() {
    FrontEvents.onBattleSearchBot.dispatch();
  }

  onSearchingClick() {
    LogMng.debug('Front: stop searching click');
    FrontEvents.onBattleStopSearch.dispatch();
  }

  onPlayerPick() {
    FrontEvents.onPlayerHeroPickClick.dispatch();
  }

  onBattleAccept() {
    // mock
    // useScenesStore().setScene(UISceneNames.Galaxy);
    FrontEvents.onBattleAcceptClick.dispatch();
  }

  onBattleConnectExit() {
    // mock
    // useScenesStore().setScene(UISceneNames.Galaxy);
    FrontEvents.onBattleAcceptCloseClick.dispatch();
  }

  onBattleAction(payload: BattleActionPayload) {
    const battleStore = useBattleStore()
    let skillId = -1;

    switch (payload.action) {
      case 'satelliteFire': skillId = 0; break;
      case 'rocketFire': skillId = 1; break;
      case 'slowdown': skillId = 2; break;
      case 'invisibility': skillId = 3; break;
    }

    LogMng.debug(`battle action, ${JSON.stringify(payload)}, skillId: ${skillId}`);

    switch (payload.type) {
      case 'call': {
        FrontEvents.onBattleAbilityClick.dispatch(skillId);
        battleStore.process.runCooldown(payload.action);
        // battleStore.process.addSkillToPendingList(payload.action);
        break;
      }

      case 'levelUp': {
        FrontEvents.onBattleAbilityLevelUpClick.dispatch(skillId);
        // mock
        // levelUpMock(payload);
        break;
      }
    }
  }

  onBattleExit() {
    logger.log('battle exit');
    FrontEvents.onBattleExit.dispatch();
  }


  onClaim() {
    logger.log('claim');
    LogMng.debug(`vue: claim`);
    FrontEvents.onBattleFinalClaimRewardClick.dispatch();
    // hide btns
    
  }

  onOpenBox() {
    logger.log('openBox');
    LogMng.debug(`vue: onOpenBox`);
    FrontEvents.onBattleFinalClaimBoxClick.dispatch();
    // hide btns

  }

  onCloseBox() {
    logger.log('closeBox');
    LogMng.debug(`vue: closeBox`);
    FrontEvents.onBattleRewardCloseClick.dispatch();
    // mock
    useScenesStore().setScene(UISceneNames.Galaxy);
  }

  onEmotionSelect(aEmotion: Emotion) {
    // LogMng.debug(`emotion select: ${type}`);
    FrontEvents.onBattleEmotion.dispatch(aEmotion);
  }

  onBuyBattleItemClick(id: Number) {
    FrontEvents.onBattlePurchaseRequest.dispatch(id);
  }

  onSellBattleItemClick(id: Number) {
    FrontEvents.onBattleSellRequest.dispatch(id);
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
