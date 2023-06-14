import { ServerStarData } from '~/data/Types';
import { FrontEvents } from '~/events/FrontEvents';

type ClientEventName =
  | 'GAME_LOADING'
  | 'GAME_LOADED'
  | 'GAME_CREATED'
  | 'GAME_FULLSCREEN'
  | 'HIDE_STAR_PREVIEW'
  | 'HIDE_STAR_GUI'
  | 'SHOW_STAR_PREVIEW'
  | 'SHOW_STAR_GUI'
  | 'SHOW_REAL_MODE'
  | 'SHOW_PHANTOM_MODE'
  | 'PHANTOM_STAR_PREVIEW';

interface BaseEvent {
  eventName: ClientEventName;
}

export interface GameLoadingEvent extends BaseEvent {
  eventName: 'GAME_LOADING';
  percent: number;
}

export interface GameLoadedEvent extends BaseEvent {
  eventName: 'GAME_LOADED';
  frontEvents: typeof FrontEvents;
}

export interface GameCreatedEvent extends BaseEvent {
  eventName: 'GAME_CREATED';
}

export interface GameFullscreenEvent extends BaseEvent {
  eventName: 'GAME_FULLSCREEN';
  v: boolean;
}

export interface HideStarPreviewEvent extends BaseEvent {
  eventName: 'HIDE_STAR_PREVIEW';
}

export interface HideStarGuiEvent extends BaseEvent {
  eventName: 'HIDE_STAR_GUI';
}

export interface ShowStarPreviewEvent extends BaseEvent {
  eventName: 'SHOW_STAR_PREVIEW';
  starData: ServerStarData;
  pos2d: { x; y };
}

export interface ShowStarGuiEvent extends BaseEvent {
  eventName: 'SHOW_STAR_GUI';
  starData: ServerStarData;
  scale: number;
}

export interface PhantomStarPreviewEvent extends BaseEvent {
  eventName: 'PHANTOM_STAR_PREVIEW';
  pos3d: { x: number; y: number; z: number };
  pos2d: { x: number; y: number };
}

export interface ShowRealModeEvent extends BaseEvent {
  eventName: 'SHOW_REAL_MODE';
}

export interface ShowPhantomModeEvent extends BaseEvent {
  eventName: 'SHOW_PHANTOM_MODE';
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
  | PhantomStarPreviewEvent;
