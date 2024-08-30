import { AcceptScreenAction, BattleShopAction, BoxOpenData, ExpData, GameCompleteData, ShopData, StartGameData } from '~/game/battle/Types';
import { ServerStarData } from '~/game/data/Types';
import { FrontEvents } from '~/game/events/FrontEvents';
import { EmotionEventData, ExplosionEventData, GameEvent, StarGameEventData } from '~/game/events/Types';

interface BaseEvent {
  eventName: GameEvent;
  msg: string
}

export interface MessageEvent extends BaseEvent {
  eventName: GameEvent.MESSAGE;
  msg: string;
}

export interface GameLoadingEvent extends BaseEvent {
  eventName: GameEvent.GAME_LOADING;
  percent: number;
}

export interface GameLoadedEvent extends BaseEvent {
  eventName: GameEvent.GAME_LOADED;
  frontEvents: typeof FrontEvents;
}

export interface GameCreatedEvent extends BaseEvent {
  eventName: GameEvent.GAME_CREATED;
}

export interface GameFullscreenEvent extends BaseEvent {
  eventName: GameEvent.GAME_FULLSCREEN;
  v: boolean;
}

export interface HideStarPreviewEvent extends BaseEvent {
  eventName: GameEvent.HIDE_STAR_PREVIEW;
}

export interface HideStarGuiEvent extends BaseEvent {
  eventName: GameEvent.HIDE_STAR_GUI;
}

export interface ShowStarPreviewEvent extends BaseEvent {
  eventName: GameEvent.SHOW_STAR_PREVIEW;
  starData: ServerStarData;
  pos2d: { x: number; y: number; };
}

export interface ShowStarGuiEvent extends BaseEvent {
  eventName: GameEvent.SHOW_STAR_GUI;
  starData: ServerStarData;
  scale: number;
}

export interface PhantomStarPreviewEvent extends BaseEvent {
  eventName: GameEvent.PHANTOM_STAR_PREVIEW;
  pos3d: { x: number; y: number; z: number };
  pos2d: { x: number; y: number };
}

export interface ShowRealModeEvent extends BaseEvent {
  eventName: GameEvent.SHOW_REAL_MODE;
}

export interface ShowPhantomModeEvent extends BaseEvent {
  eventName: GameEvent.SHOW_PHANTOM_MODE;
}

export interface GalaxyModeEvent extends BaseEvent {
  eventName: GameEvent.GALAXY_MODE;
}

export interface StarModeEvent extends BaseEvent {
  eventName: GameEvent.STAR_MODE;
}

export interface BattleAcceptScreen extends BaseEvent {
  eventName: GameEvent.BATTLE_ACCEPT_SCREEN;
  action: AcceptScreenAction;
  time?: {
    acceptTimeSec: number
  },
  state?: {
    current: number,
    max: number
  }
}
export interface BattleSearchingStart extends BaseEvent {
  eventName: GameEvent.BATTLE_SEARCHING_START;
}
export interface BattleSearchingStop extends BaseEvent {
  eventName: GameEvent.BATTLE_SEARCHING_STOP;
}
export interface BattleSearchingError extends BaseEvent {
  eventName: GameEvent.BATTLE_SEARCHING_ERROR;
  reason: string;
}
export interface BattlePrerollShow extends BaseEvent, StartGameData {
  eventName: GameEvent.BATTLE_PREROLL_SHOW;
}
export interface BattleCompleteShow extends BaseEvent, GameCompleteData {
  eventName: GameEvent.BATTLE_COMPLETE_SHOW;
}
export interface BattleCompleteHide extends BaseEvent, GameCompleteData {
  eventName: GameEvent.BATTLE_COMPLETE_HIDE;
}
export interface BattleShowTokenReward extends BaseEvent {
  eventName: GameEvent.SHOW_TOKEN_REWARD;
  tokens: number;
}
export interface BattleShowBoxOpen extends BaseEvent, BoxOpenData {
  eventName: GameEvent.SHOW_BOX_OPEN;
}
export interface BattleExpData extends BaseEvent, ExpData {
  eventName: GameEvent.BATTLE_EXP_DATA;
}
export interface BattleEmotion extends BaseEvent, EmotionEventData {
  eventName: GameEvent.BATTLE_EMOTION;
}
export interface BattleExplosion extends BaseEvent, ExplosionEventData {
  eventName: GameEvent.BATTLE_EXPLOSION;
}

export interface BattleShopEvent extends BaseEvent {
  eventName: GameEvent.BATTLE_SHOP;
  data: ShopData;
}

export interface StarGameEvent extends BaseEvent, StarGameEventData {
  eventName: GameEvent.STAR_GAME;
}

export type ClientEvent =
    MessageEvent
  | GameLoadingEvent
  | GameLoadedEvent
  | GameCreatedEvent
  | GameFullscreenEvent
  | HideStarPreviewEvent
  | HideStarGuiEvent
  | ShowStarPreviewEvent
  | ShowStarGuiEvent
  | ShowRealModeEvent
  | ShowPhantomModeEvent
  | PhantomStarPreviewEvent
  | GalaxyModeEvent
  | StarModeEvent
  | BattleAcceptScreen
  | BattleSearchingStart
  | BattleSearchingStop
  | BattleSearchingError
  | BattlePrerollShow
  | BattleCompleteShow
  | BattleCompleteHide
  | BattleShowTokenReward
  | BattleShowBoxOpen
  | BattleExpData
  | BattleEmotion
  | BattleExplosion
  | BattleShopEvent
  | StarGameEvent;


export type GuiLevel = {
  value: number;
  label: string;
};
