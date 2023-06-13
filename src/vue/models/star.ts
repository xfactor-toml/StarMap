import { RACES } from '@/constants';
import { Coords, Race, StarData } from '~/blockchain/types';

export type StarHudParam = 'mass' | 'slots' | 'totalEnergy' | 'energyPerHour' | 'life';

export type StarHudParams = {
  [K in StarHudParam]: {
    percent: number;
    text: string;
  };
};

export class Star {
  id: number;
  owner: string;
  name: string;
  description: string;
  params: {
    isLive: boolean;
    creation: number; // timestamp
    updated: number;
    level: number;
    fuel: number;
    levelUpFuel: number;
    fuelSpendings: number; // per hour
    habitableZoneMin: number;
    habitableZoneMax: number;
    planetSlots: number;
    mass: number;
    race: Race;
    coords: Coords;
  };

  scale = 1;

  constructor({ id, owner, params }: StarData) {
    this.id = id;
    this.owner = owner;
    this.description = `Federation of ${params.race}`;
    this.params = params;
  }

  get preview() {
    return `./gui/images/tooltip/race-${RACES[this.params.race]}.png`;
  }

  get croppedOwner() {
    return `...${this.owner.slice(-5)}`;
  }

  get hud(): StarHudParams {
    return {
      mass: {
        percent: 50,
        text: '330 000 E.M.'
      },
      slots: {
        percent: 50,
        text: '330 000 E.M.'
      },
      totalEnergy: {
        percent: 50,
        text: '340 000 E.M.'
      },
      energyPerHour: {
        percent: 50,
        text: '530 000 E.M.'
      },
      life: {
        percent: 50,
        text: '360 000 E.M.'
      }
    };
  }

  static getRandomRace(): Race {
    const racesList = Object.keys(RACES) as Race[];
    const racesAmount = racesList.length;
    const randomIndex = Math.ceil(Math.random() * racesAmount) - 1;

    return racesList[randomIndex];
  }
}
