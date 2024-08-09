import { Signal } from "../utils/events/Signal";

export const FrontEvents = {

    onWindowResizeSignal: new Signal(),
    
    /**
     * ( aFullscreen: boolean, aRealStars: [] )
     */
    startGame: new Signal(),

    playInitScreenSfx: new Signal(),

    setMusicVolume: new Signal(),
    setSFXVolume: new Signal(),
    toggleFullscreen: new Signal(),

    starPreviewClose: new Signal(),
    diveIn: new Signal(),
    flyFromStar: new Signal(),
    onHover: new Signal(),
    onClick: new Signal(),

    // left panel
    onLeftPanelGalaxyClick: new Signal(),
    onLeftPanelStarClick: new Signal(),
    onLeftPanelPlanetClick: new Signal(),

    // bot panel
    onBotPanelPhantomClick: new Signal(),
    onBotPanelRealClick: new Signal(),
    
    /**
     * dispatch(levels), levels: [1, 2, 3, 4, 5]
     */
    starLevelFilterChanged: new Signal(),

    /**
     * dispatch(name), name: string
     */
    starNameFilterChanged: new Signal(),

    /**
     * (aStarData: ServerStarData)
     */
    onStarCreated: new Signal(),
    
    /**
     * (aStarData: ServerStarData)
     */
    onStarUpdated: new Signal(),
    
    /**
     * Start battle search
     */
    onBattleSearch: new Signal(),
    onBattleSearchBot: new Signal(),
    onBattleStopSearch: new Signal(),
    // battle accept screen
    onBattleAcceptClick: new Signal(),
    onBattleAcceptCloseClick: new Signal(),

    onBattleExit: new Signal(),
    onBattleAbilityClick: new Signal(),
    onBattleAbilityLevelUpClick: new Signal(),

    onBattleFinalClaimRewardClick: new Signal(),
    onBattleFinalClaimBoxClick: new Signal(),
    onBattleRewardCloseClick: new Signal(),

    onBattleEmotion: new Signal(),

    /**
     * id: number - item id
     */
    onBattlePurchaseRequest: new Signal(),
    /**
     * id: number - item id
     */
    onBattleSellRequest: new Signal(),

}