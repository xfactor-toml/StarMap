import { ServerStarData } from '~/game/data/Types';
import { FrontEvents } from '~/game/events/FrontEvents';
import { GameEvent, GameEventDispatcher } from '~/game/events/GameEvents';

interface BaseEvent {
  eventName: GameEvent;
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
export interface BattlePrerollShow extends BaseEvent {
  eventName: GameEvent.BATTLE_PREROLL_SHOW;
  playerWallet: string;
  enemyWallet: string;
}

export type ClientEvent =
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
  | BattleSearchingStart
  | BattleSearchingStop
  | BattleSearchingError
  | BattlePrerollShow;

export type GuiLevel = {
  value: number;
  label: string;
};
