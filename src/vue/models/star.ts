import { RACES } from '@/constants';
import { Race, StarData } from '~/blockchainTotal/types';
import { ServerStarParams } from '~/game/data/Types';
import { StarMath } from '~/game/math/StarMath';

export type StarHudParam = 'mass' | 'slots' | 'totalEnergy' | 'energyPerHour' | 'life';

export type StarHudParams = {
  [K in StarHudParam]: {
    percent: number;
    value: number;
    unit: string
  };
};

export class Star {
  id: number;
  owner: string;
  description: string;
  params: ServerStarParams;

  constructor({ id, owner, params }: StarData) {
    this.id = id;
    this.owner = owner.toLowerCase();
    this.description = `${params.race}`.toUpperCase();
    this.params = params;
  }

  get levelUpFuel() {
    return this.params.levelUpFuel / 1e18;
  }

  get fuel() {
    return this.params.fuel / 1e18;
  }

  get name() {
    return this.params.name;
  }

  get preview() {
    return `./gui/images/races/${RACES[this.params.race]}.png`;
  }

  get croppedOwner() {
    return `...${this.owner.slice(-5)}`;
  }

  get hud(): StarHudParams {
    return {
      mass: StarMath.getMassValues(this.params),
      slots: StarMath.getSlotsValues(this.params),
      totalEnergy: StarMath.getTotalEnergyValues(this.params),
      energyPerHour: StarMath.getEnergyPerHourValues(this.params),
      life: StarMath.getLifeValues(this.params)
    };
  }

  toRaw(): StarData {
    return {
      id: this.id,
      owner: this.owner,
      params: {
        ...this.params,
        coords: {
          ...this.params.coords
        }
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
