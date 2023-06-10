import { RaceType } from '@/types';

export class Star {
  description: string;
  level: number;
  name: string;
  owner: string;
  pos2d: {
    x: number;
    y: number;
  };
  race: RaceType;
  scale: number;
  starId: number;

  static RACES: Record<RaceType, string> = {
    Humans: 'human',
    Simbionts: 'simbionts',
    Lizards: 'lizards',
    Insects: 'insects',
    Robots: 'robots'
  };

  static getRaceId = (raceType: RaceType) => Star.RACES[raceType];

  constructor(data: Omit<Star, 'preview' | 'position'>) {
    Object.assign(this, data);
  }

  get preview() {
    return `./gui/images/tooltip/race-${Star.getRaceId(this.race)}.png`;
  }

  get position() {
    return this.pos2d;
  }
}
