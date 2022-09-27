import { Signal } from "./Signal";

export const FrontEvents = {

    onWindowResizeSignal: new Signal(),
    
    /**
     * { aFullscreen: boolean }
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
    onClick: new Signal()

}
