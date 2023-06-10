import { RACES } from '../constants';
import { RaceType } from '../types/types';

export const getRaceId = (raceName: RaceType) => RACES[raceName] || '';

export const getRaceImage = (race: RaceType, folder: 'tooltip' | 'star-panel') =>
  `./gui/images/${folder}/race-${getRaceId(race)}.png`;
