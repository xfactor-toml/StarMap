
const SFX_INIT = 'SFX_INIT';
const SFX_INIT_FLY = 'SFX_INIT_FLY';
const SFX_CLICK = 'SFX_CLICK';
const SFX_HOVER = 'SFX_HOVER';
const SFX_CAM_ROTATE = 'SFX_CAM_ROTATE';
const SFX_DIVE_IN = 'SFX_DIVE_IN';
const SFX_DIVE_OUT = 'SFX_DIVE_OUT';
const SFX_STAR_FIRE = 'SFX_STAR_FIRE';

const MUSIC_MAIN = 'mainMusic';

export const AudioData = {

    SFX_INIT: SFX_INIT,
    SFX_INIT_FLY: SFX_INIT_FLY,
    SFX_CLICK: SFX_CLICK,
    SFX_HOVER: SFX_HOVER,
    SFX_CAM_ROTATE: SFX_CAM_ROTATE,
    SFX_DIVE_IN: SFX_DIVE_IN,
    SFX_DIVE_OUT: SFX_DIVE_OUT,
    SFX_STAR_FIRE: SFX_STAR_FIRE,

    MUSIC_MAIN: MUSIC_MAIN,

    SOUNDS: [
        {
            alias: SFX_INIT,
            file: './assets/audio/init.mp3'
        },
        {
            alias: SFX_INIT_FLY,
            file: './assets/audio/initFly.mp3'
        },
        { 
            alias: SFX_CLICK,
            file: './assets/audio/mouseClick.mp3'
        },
        {
            alias: SFX_HOVER,
            file: './assets/audio/mouseOver.mp3'
        },
        {
            alias: SFX_CAM_ROTATE,
            file: './assets/audio/camRotate.mp3'
        },
        {
            alias: SFX_DIVE_IN,
            file: './assets/audio/diveIn.mp3'
        },
        {
            alias: SFX_DIVE_OUT,
            file: './assets/audio/diveOut.mp3'
        },
        {
            alias: SFX_STAR_FIRE,
            file: './assets/audio/starFire.mp3'
        },
        
        {
            alias: MUSIC_MAIN,
            file: './assets/audio/musicMain.mp3'
        }
    ]

}