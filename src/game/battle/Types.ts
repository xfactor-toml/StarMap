
export enum PackTitle {
    // for lobby
    sign = 'sign',
    startSearchGame = 'startSearchGame', // request
    stopSearchGame = 'stopSearchGame', // request
    gameSearching = 'gameSearching', // status, update, info
    duel = 'duel',
    battleConfirmation = 'battleConfirmation',
    battleSceneLoaded = 'battleSceneLoaded',
    gameStart = 'gameStart',
    gameComplete = 'gameComplete',
    exitGame = 'exitGame',
    // for game
    fieldInit = 'fieldInit',
    objectCreate = 'objectCreate',
    objectUpdate = 'objectUpdate',
    objectDestroy = 'objectDestroy',
    rotate = 'rotate',
    jump = 'jump',
    attack = 'attack',
    rayStart = 'rayStart',
    rayStop = 'rayStop',
    planetLaser = 'planetLaser',
    damage = 'damage',
    exp = 'exp',
    skill = 'skill',

    sniper = 'sniper',
    explosion = 'explosion',

    emotion = 'emotion',

    claimReward = 'claimReward',

    debugTest = 'debugTest'

}

export type SignData = {
    fromServer?: 'request' | 'reject' | 'success',
    fromCli?: 'web3' | 'web2',
    signature?: string,
    displayName?: string
}

export type ObjectType = 'Star' | 'Planet' | 'Tower' | 'FighterShip' | 'BattleShip' | 'HomingMissile';

export type AttackType = 'laser' | 'ray';
// Humans, Insects, Waters, Lizards
export type ObjectRace = 'Humans' | 'Waters' | 'Insects' | 'Lizards';

export type SearchGameData = {
    isFreeConnect?: boolean,
    isChallenge?: boolean,
    withBot?: boolean,
    challengeCmd?: 'create' | 'connect',
    challengeNumber?: number,
}

export type DuelInfo = {
    cmd: 'check' | 'number' | 'notFound',
    userNick?: string,
    challengeNumber?: number
}

export type AcceptScreenAction = 'start' | 'update' | 'accept' | 'connect' | 'loading' | 'cancel' | 'closeClick';

/**
 * Send to server after accept screen due loading screen
 */
export type PlayerLoadingData = {
    starName: string
}

export type AcceptScreenData = {
    action: AcceptScreenAction,
    timer?: number,
    state?: {
        current: number,
        max: number
    },
    loadingData?: PlayerLoadingData
}

export type PlayerData = {
    name: string,
    isNick: boolean,
    starName: string,
    race: ObjectRace
}
export type StartGameData = {
    cmd?: 'start',
    prerollTimerSec: number,
    playerData: PlayerData,
    enemyData: PlayerData
}

export type GameCompleteData = {
    status: 'win' | 'loss',
    showBoxClaim?: boolean,
    boxLevel?: number
}

export type FieldInitData = {
    fieldParams: any,
    playerWalletAddr: string,
    playerPosition: 'top' | 'bot',
    playerRace: ObjectRace,
    enemyRace: ObjectRace,
}

export type ObjectUpdateData = {
    id?: number,
    hp?: number,
    shield?: number,
    pos?: {
        x: number,
        y: number,
        z: number
    },
    q?: {
        x: number,
        y: number,
        z: number,
        w: number
    },
}

export type ObjectCreateData = ObjectUpdateData & {
    type: ObjectType,
    owner?: string, // owner id
    race?: ObjectRace,
    radius?: number,
    hp?: number,
    shield?: number,
    attackRadius?: number,
    lookDir?: { x, y, z }
}

export type AttackData = {
    attackType: AttackType,
    idFrom: number,
    idTo: number,
    damage?: number,
    isMiss?: boolean,
    isCrit?: boolean
}

export type PlanetLaserSkin = 'blue' | 'red' | 'white' | 'violet';

export type PlanetLaserData = {
    planetId: number,
    pos: { x: number, y: number, z: number },
    dir: { x: number, y: number, z: number },
    length: number,
    skin: PlanetLaserSkin
}

export type DamageInfo = {
    damage: number,
    isMiss?: boolean,
    isCrit?: boolean,
    critFactor?: number
}

export type DamageData = {
    id: number,
    pos: { x: number, y: number, z: number },
    info: DamageInfo
}

export type SkillData = {
    level: number,
    levelUpAvailable: boolean,
    cooldown: {
        duration: number
    }
}

export type ExpData = {
    exp: number,
    level: number,
    levelExpPercent: number,
    skills: SkillData[]
}

export type BoxOpenData = {
    list: number[]
}

export type SkillRequest = {
    action: 'levelUp' | 'click',
    skillId: number
}

export type ClaimRewardData = {
    type: 'reward' | 'box',
    action?: 'request' | 'accept' | 'reject',
    reasone?: any
}

export type DebugTestData = {
    action: 'win' | 'loss'
}

export type ExplosionType = 'rocket';

export type ExplosionData = {
    type: ExplosionType,
    pos: { x: number, y: number, z: number }
}

export type SniperData = {
    action: 'start' | 'end',
    planetId: number
}

export type Emotion = 'smile' | 'evil' | 'dead' | 'thinking' | 'angry' | 'sad';
export type EmotionData = {
    owner?: string,
    emotion: Emotion
}