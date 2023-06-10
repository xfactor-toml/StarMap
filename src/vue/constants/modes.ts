import { GuiMode, GuiModeName } from '../types';

export const MODES: Record<GuiModeName, GuiMode> = {
  phantom: {
    views: [
      {
        name: 'galaxy',
        enabled: true
      }
    ],
    enabled: true
  },
  real: {
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
    views: [],
    enabled: false
  }
};
