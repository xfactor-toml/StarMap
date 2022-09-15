import { Signal } from "./Signal";

export const FrontEvents = {

    /**
     * { aFullscreen: boolean }
     */
    startGame: new Signal(),

    setMusicVolume: new Signal(),
    setSFXVolume: new Signal(),
    toggleFullscreen: new Signal(),

    starPreviewClose: new Signal(),
    diveIn: new Signal(),
    flyFromStar: new Signal(),
    onHover: new Signal(),
    onClick: new Signal()

}
