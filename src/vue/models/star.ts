import { RaceType } from '@/types';
import { RACES } from '@/constants';

export class Star {
  description = '';
  level = 1;
  name = 'noname';
  owner = 'unknown';
  pos2d: {
    x: number;
    y: number;
  } = { x: 0, y: 0 };
  race: RaceType = 'Humans';
  scale = 1;
  starId = 1;

  constructor(data: Omit<Star, 'preview' | 'position' | 'croppedOwner'>) {
    Object.assign(this, data);
  }

  get preview() {
    return `./gui/images/tooltip/race-${RACES[this.race]}.png`;
  }

  get position() {
    return this.pos2d;
  }

  get croppedOwner() {
    return `...${this.owner.slice(-5)}`;
  }
}
