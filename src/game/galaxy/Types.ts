
export type StarGameData = {
  id: number;
  title: string;
  starName: string;
  starPosition: {
    x: number;
    y: number;
    z: number;
  }
}

export const STAR_GAMES = [
  {
    id: 3,
    title: 'Star Defender',
    // starName: 'Antares',
    // starPosition: { x: 20, y: 0, z: 20 },
  }
]
