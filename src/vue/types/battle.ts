import { Race } from "~/blockchainTotal/types";

export type BattleActionType = 'satelliteFire' | 'rocketFire' | 'slowdown' | 'invisibility';

export type BattleItemType = 'thunder' | 'velocityVector' | 'surgesSpire' | 'spiralSentinel' | 'nuclearOrb' | 'momentumMatrix' | 'quantumBooster' | 'accelerationAmulet'

export type BattleItem = {
  name: BattleItemType
  hide: boolean
  detail: boolean
  id: number
  buy: boolean
}
export type BattlePlayer = {
  address: string
  star: string
  name: string
  race: Race
  isNick: boolean
}

export type BattleConnectedUsers = {
  current: number
  max: number
}

export type BattleSkill = {
  level: number,
  levelUpAvailable: boolean,
  cooldown: {
    duration: number,
  }
}

export type BattleData = {
  players: {
    current: BattlePlayer,
    connected: BattlePlayer,
  },
  level: {
    current: number,
    progress: number
  },
  gold: number,
  skills: {
    [K in BattleActionType]?: BattleSkill
  }
}

export type BattleResults = {
  type: 'victory' | 'defeat'
  player: string
  owner: string
  demage: number
  gold: number
  exp: number
  rating: {
    previous: number
    current: number
  },
  box: {
    show: boolean,
    level: number
  },
  claim: {
    show: boolean
  }
}

export type BattleCooldown = {
  [K in BattleActionType]?: null | {
    duration: number
    progress: number
  }
}

export type BattleActiveCooldown = {
  [K in BattleActionType]?: anime.AnimeInstance
}

export type BattleActionPayload = {
  action: BattleActionType
  type: 'call' | 'levelUp'
}

export type BattleReward = {
  name: string,
  image: string
  rare: string
  value?: number
}
