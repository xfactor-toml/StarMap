import { Race } from "~/blockchain/types";

export type BattleActionType = 'satelliteFire' | 'rocketFire' | 'slowdown' | 'invisibility';

export type BattlePlayer = {
  address: string
  star: string
  name: string
  race: Race
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

export type BattleStoreState = {
  players: {
    current: BattlePlayer,
    connected: BattlePlayer,
  },
  level: number,
  gold: number,
  skills: {
    [K in BattleActionType]?: BattleSkill
  }
}
