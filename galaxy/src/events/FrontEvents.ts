import { Signal } from "./Signal";

export const FrontEvents = {

    startGameWindow: new Signal(),
    startGameFull: new Signal(),

    setMusicVolume: new Signal(),
    setSFXVolume: new Signal(),
    setFullscreenMode: new Signal(),

    starPreviewClose: new Signal(),
    diveIn: new Signal(),
    flyFromStar: new Signal(),
    onHover: new Signal(),
    onClick: new Signal()

}
