import { RaceType } from '@/types/planets';

export type ClientEvent =
  | 'GAME_LOADING'
  | 'GAME_LOADED'
  | 'GAME_CREATED'
  | 'GAME_FULLSCREEN'
  | 'GAME_CREATED'
  | 'SHOW_STAR_PREVIEW'
  | 'HIDE_STAR_PREVIEW'
  | 'SHOW_STAR_GUI';

export type ClientData = {
  starId: number;
  eventName: ClientEvent;
  name: string;
  description: string;
  level: number;
  race: RaceType;
  pos2d: { x: number; y: number };
  percent: number;
  v: boolean;
  textAutofit?: boolean;
  scale?: number;
  planetSlots?: number;
  energy?: number;
  life?: number;
};
