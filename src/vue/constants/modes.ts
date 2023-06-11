import { GuiMode, GuiModeName } from '@/types';

export const MODES: { [K in GuiModeName]: GuiMode<K> } = {
  phantom: {
    name: 'phantom',
    label: 'Phantom',
    views: [
      {
        name: 'galaxy',
        label: 'Galaxy',
        enabled: true,
        clickable: true
      }
    ],
    enabled: true
  },
  real: {
    name: 'real',
    label: 'Real',
    views: [
      {
        name: 'galaxy',
        label: 'Galaxy',
        enabled: true,
        clickable: true
      },
      {
        name: 'star',
        label: 'Star',
        enabled: true,
        clickable: false
      },
      {
        name: 'planet',
        label: 'Planet',
        enabled: false,
        clickable: false
      }
    ],
    enabled: true
  },
  season: {
    name: 'season',
    label: 'Season',
    views: [],
    enabled: false
  }
};
