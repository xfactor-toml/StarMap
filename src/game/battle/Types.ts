
export enum PackTitle {
    // for lobby
    sign = 'sign',
    startSearchGame = 'startSearchGame', // request
    stopSearchGame = 'stopSearchGame', // request
    gameSearching = 'gameSearching', // status, update, info
    gameStart = 'gameStart',
    // for game
    fieldInit = 'fieldInit',
    objectCreate = 'objectCreate',
    objectUpdate = 'objectUpdate',
    objectDestroy = 'objectDestroy',
    attack = 'attack'
}

export type ObjectType = 'Star' | 'Planet' | 'FighterShip' | 'BattleShip' | 'Homing';

export type StartGameData = {
    cmd?: 'start',
    timer: number,
}

export type FieldInitData = {
    fieldParams: any,
    playerPosition: 'top' | 'bot'
}