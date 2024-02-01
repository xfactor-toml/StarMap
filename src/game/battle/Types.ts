
export enum PackTitle {
    // for lobby
    sign = 'sign',
    startSearchGame = 'startSearchGame', // request
    stopSearchGame = 'stopSearchGame', // request
    gameSearching = 'gameSearching', // status, update, info
    exitGame = 'exitGame',
    gameStart = 'gameStart',
    gameComplete = 'gameComplete',
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
    damage = 'damage'
}

export type ObjectType = 'Star' | 'Planet' | 'FighterShip' | 'BattleShip' | 'Homing';
export type AttackType = 'laser' | 'ray';
// Humans, Insects, Waters, Lizards
export type ObjectRace = 'Humans' | 'Waters' | 'Insects' | 'Lizards';

export type StartGameData = {
    cmd?: 'start',
    timer: number,
    playerWallet: string,
    enemyWallet: string
}

export type GameCompleteData = {
    status: 'win' | 'lose' | 'draw'
}

export type FieldInitData = {
    fieldParams: any,
    playerPosition: 'top' | 'bot'
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

export type PlanetLaserData = {
    planetId: number,
    pos: { x, y, z },
    dir: { x, y, z },
    length: number
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