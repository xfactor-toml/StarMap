import { GuiScreen, GuiScreenName } from '@/types';
import { GalaxyScreen, PreloaderScreen, WelcomeScreen } from '@/screens';
import { PhantomMode, RealMode } from '@/modes';

export const SCREENS: { [K in GuiScreenName]: GuiScreen<K> } = {
  preloader: {
    name: 'preloader',
    getComponent: () => PreloaderScreen,
  },
  welcome: {
    name: 'welcome',
    getComponent: () => WelcomeScreen,
  },
  galaxy: {
    name: 'galaxy',
    getComponent: () => GalaxyScreen,
    modes: [
      {
        name: 'phantom',
        label: 'Phantom',
        getComponent: () => PhantomMode,
        views: [
          {
            name: 'galaxy',
            label: 'Galaxy',
            enabled: true,
            clickable: true
          }
        ],
        enabled: true,
      },
      {
        name: 'real',
        label: 'Real',
        getComponent: () => RealMode,
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
      {
        name: 'season',
        label: 'Season',
        getComponent: () => null,
        views: [],
        enabled: false
      }
    ],
    defaultMode: 'real'
  },
};
