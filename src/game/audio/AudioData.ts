
export enum AudioAlias {
    SFX_INIT = 'SFX_INIT',
    SFX_INIT_FLY = 'SFX_INIT_FLY',
    SFX_CLICK = 'SFX_CLICK',
    SFX_HOVER = 'SFX_HOVER',
    SFX_CAM_ROTATE = 'SFX_CAM_ROTATE',
    SFX_DIVE_IN = 'SFX_DIVE_IN',
    SFX_DIVE_OUT = 'SFX_DIVE_OUT',
    SFX_STAR_FIRE = 'SFX_STAR_FIRE',
    MUSIC_MAIN = 'mainMusic',
}

export const MusicLoadList = [
    { alias: AudioAlias.MUSIC_MAIN, file: './assets/audio/musicMain.mp3' }
]

export const SoundLoadList = [
    { alias: AudioAlias.SFX_INIT, file: './assets/audio/init.mp3' },
    { alias: AudioAlias.SFX_INIT_FLY, file: './assets/audio/initFly.mp3' },
    { alias: AudioAlias.SFX_CLICK, file: './assets/audio/mouseClick.mp3' },
    { alias: AudioAlias.SFX_HOVER, file: './assets/audio/mouseOver.mp3' },
    { alias: AudioAlias.SFX_CAM_ROTATE, file: './assets/audio/camRotate.mp3' },
    { alias: AudioAlias.SFX_DIVE_IN, file: './assets/audio/diveIn.mp3' },
    { alias: AudioAlias.SFX_DIVE_OUT, file: './assets/audio/diveOut.mp3' },
    { alias: AudioAlias.SFX_STAR_FIRE, file: './assets/audio/starFire.mp3' },
]
