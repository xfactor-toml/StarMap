import { RACES } from '@/constants';
import { Race, StarData } from '~/blockchain/types';
import { ServerStarParams } from '~/data/Types';
import { StarMath } from '~/math/StarMath';

export type StarHudParam = 'mass' | 'slots' | 'totalEnergy' | 'energyPerHour' | 'life';

export type StarHudParams = {
  [K in StarHudParam]: {
    percent: number;
    value: number;
  };
};

export class Star {
  id: number;
  owner: string;
  description: string;
  params: ServerStarParams;
  scale = 1;

  constructor({ id, owner, params }: StarData) {
    this.id = id;
    this.owner = owner;
    this.description = `${params.race}`.toUpperCase();
    this.params = params;
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
      params: { ...this.params }
    };
  }

  setScale(scale: number) {
    this.scale = scale;
  }

  static getRandomRace(): Race {
    const racesList = Object.keys(RACES) as Race[];
    const racesAmount = racesList.length;
    const randomIndex = Math.ceil(Math.random() * racesAmount) - 1;

    return racesList[randomIndex];
  }
}
