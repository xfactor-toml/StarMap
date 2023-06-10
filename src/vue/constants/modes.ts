import { GuiMode, GuiModeName } from '../types/types';

export const MODES: { [K in GuiModeName]: GuiMode<K> } = {
  phantom: {
    name: 'phantom',
    views: [
      {
        name: 'galaxy',
        enabled: true
      }
    ],
    enabled: true
  },
  real: {
    name: 'real',
    views: [
      {
        name: 'galaxy',
        enabled: true
      },
      {
        name: 'star',
        enabled: true
      },
      {
        name: 'planet',
        enabled: false
      }
    ],
    enabled: true
  },
  season: {
    name: 'season',
    views: [],
    enabled: false
  }
};
