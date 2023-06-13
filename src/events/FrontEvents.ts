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
    starLevelFilterUpdate: new Signal(),

    /**
     * (aStarData: ServerStarData)
     */
    onStarCreated: new Signal()

    
}
