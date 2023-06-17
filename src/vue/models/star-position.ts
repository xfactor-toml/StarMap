import { Coords } from '~/blockchain/types';

export class StarScreenPosition {
  x: number;
  y: number;

  constructor({ x, y }: { x: number; y: number }) {
    this.x = x;
    this.y = y;
  }
}

export class StarGalaxyPosition {
  x: number;
  y: number;
  z: number;

  constructor({ x, y, z }: { x: number; y: number; z: number }) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toContractFormat(): Coords {
    return {
      X: this.x,
      Y: this.y,
      Z: this.z
    };
  }
}

export class StarPosition {
  screen: StarScreenPosition;
  galaxy: StarGalaxyPosition;

  constructor(
    screen: ConstructorParameters<typeof StarScreenPosition>[number],
    galaxy: ConstructorParameters<typeof StarGalaxyPosition>[number]
  ) {
    this.screen = new StarScreenPosition(screen);
    this.galaxy = new StarGalaxyPosition(galaxy);
  }
}
