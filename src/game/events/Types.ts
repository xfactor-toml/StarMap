import { AcceptScreenAction, Emotion, ShopData } from "../battle/Types"

export enum GameEvent {

  MESSAGE = 'MESSAGE',

  GAME_LOADING = 'GAME_LOADING',
  GAME_LOADED = 'GAME_LOADED',
  GAME_CREATED = 'GAME_CREATED',
  GAME_FULLSCREEN = 'GAME_FULLSCREEN',

  /**
   * starData: ServerStarData
   * pos2d: { x, y }
   */
  SHOW_STAR_PREVIEW = 'SHOW_STAR_PREVIEW',
  HIDE_STAR_PREVIEW = 'HIDE_STAR_PREVIEW',

  /**
   * pos3d: {x, y, z}
   * pos2d: { x, y }
   */
  PHANTOM_STAR_PREVIEW = 'PHANTOM_STAR_PREVIEW',

  /**
   * starData: ServerStarData
   * scale
   */
  SHOW_STAR_GUI = 'SHOW_STAR_GUI',
  HIDE_STAR_GUI = 'HIDE_STAR_GUI',

  GALAXY_MODE = 'GALAXY_MODE',
  STAR_MODE = 'STAR_MODE',

  SHOW_REAL_MODE = 'SHOW_REAL_MODE',
  SHOW_PHANTOM_MODE = 'SHOW_PHANTOM_MODE',

  STAR_GAME = 'STAR_GAME',

  // BATTLE
  BATTLE_ACCEPT_SCREEN = 'BATTLE_ACCEPT_SCREEN',
  BATTLE_SEARCHING_START = 'BATTLE_SEARCHING_START',
  BATTLE_SEARCHING_STOP = 'BATTLE_SEARCHING_STOP',
  /**
   * reason: string
  */
  BATTLE_SEARCHING_ERROR = 'BATTLE_SEARCHING_ERROR',
  BATTLE_PREROLL_SHOW = 'BATTLE_PREROLL_SHOW',
  // battle results
  BATTLE_COMPLETE_SHOW = 'BATTLE_COMPLETE_SHOW',
  BATTLE_COMPLETE_HIDE = 'BATTLE_COMPLETE_HIDE',
  SHOW_TOKEN_REWARD = 'SHOW_TOKEN_REWARD',
  SHOW_BOX_OPEN = 'SHOW_BOX_OPEN',
  // battle process
  BATTLE_EXP_DATA = 'BATTLE_EXP_DATA',
  BATTLE_EMOTION = 'BATTLE_EMOTION',
  BATTLE_SHOP = 'BATTLE_SHOP',

  BATTLE_EXPLOSION = 'BATTLE_EXPLOSION'

}

export type AcceptEventData = {
  eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
  action: AcceptScreenAction,
  time?: {
    acceptTimeSec: number
  },
  state?: {
    current: number,
    max: number
  }
}

export type EmotionEventData = {
  eventName: GameEvent.BATTLE_EMOTION,
  type: 'showSelection' | 'show' | 'selected',
  emotion?: Emotion,
  position2d?: { x: number, y: number }
}

export type ShopEventData = {
  eventName: GameEvent.BATTLE_SHOP,
  data: ShopData
}

export type ExplosionEventData = {
  eventName: GameEvent.BATTLE_EXPLOSION,
  position2d: { x: number, y: number }
}

export type StarGameInitData = {
  id: number,
  gameTitle: string,
  starName: string,
  position2d: { x: number, y: number }
};

export type StarGameUpdateData = {
  id: number,
  position2d: { x: number, y: number }
};

export type StarGameEventData = {
  eventName: GameEvent.STAR_GAME,
  action: 'init' | 'update' | 'visible',
  visible?: boolean,
  initList?: StarGameInitData[],
  updateData?: StarGameUpdateData
}