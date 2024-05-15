
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

    battleStartGates = 'battleStartGates',
    battleBtnClick = 'battleBtnClick',
    battleBtnUpgrade = 'battleBtnUpgrade',
    battleCreepSpawn = 'battleCreepSpawn',
    battleFireCreep_1 = 'battleFireCreep_1',
    battleFireCreep_2 = 'battleFireCreep_2',
    battlePlanetLaserFire = 'battlePlanetLaserFire',
    battleRocketFly = 'battleRocketFly',
    battleExplosionSmall_1 = 'battleExplosionSmall_1',
    battleExplosionSmall_2 = 'battleExplosionSmall_2',
    battleExplosionBig = 'battleExplosionBig',
    battleStarAlarm = 'battleStarAlarm',
    battleVictory = 'battleVictory',

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

    { alias: AudioAlias.battleStartGates, file: './assets/audio/battle/NACHALO_VRATA.mp3' },
    { alias: AudioAlias.battleBtnClick, file: './assets/audio/battle/BUTTON_PUSH.mp3' },
    { alias: AudioAlias.battleBtnUpgrade, file: './assets/audio/battle/BUTTON_UPGRATE.mp3' },
    { alias: AudioAlias.battleCreepSpawn, file: './assets/audio/battle/BURN_NEW_KRIPI.mp3' },
    { alias: AudioAlias.battleFireCreep_1, file: './assets/audio/battle/VISTREL_KRIP_1.mp3' },
    { alias: AudioAlias.battleFireCreep_2, file: './assets/audio/battle/VISTREL_KRIP_2.mp3' },
    { alias: AudioAlias.battlePlanetLaserFire, file: './assets/audio/battle/VISTREL_LAZER.mp3' },
    { alias: AudioAlias.battleRocketFly, file: './assets/audio/battle/RAKETA_LETIT_CICLE.mp3' },
    { alias: AudioAlias.battleExplosionSmall_1, file: './assets/audio/battle/VZRIV_1.mp3' },
    { alias: AudioAlias.battleExplosionSmall_2, file: './assets/audio/battle/VZRIV_2.mp3' },
    { alias: AudioAlias.battleExplosionBig, file: './assets/audio/battle/VZRIV_BIG.mp3' },
    { alias: AudioAlias.battleStarAlarm, file: './assets/audio/battle/ALARM_CICLE.mp3' },
    { alias: AudioAlias.battleVictory, file: './assets/audio/battle/VICTORY.mp3' },



]
