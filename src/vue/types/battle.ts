import { Race } from "~/blockchain/types";

export type BattleActionType = 'satelliteFire' | 'rocketFire' | 'slowdown' | 'invisibility';


export type BattlePlayer = {
  address: string
  star: string
  name: string
  race: Race
}

export type BattleConnectedUsers = {
  current: number
  max: number
}

export type BattleSkill = {
  charges: {
    count: number
    fractions: number
  },
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
    prevoius: number
    current: number
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
