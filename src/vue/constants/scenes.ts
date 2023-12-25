import { GuiScene, GuiSceneName } from '@/types';
import { GalaxyScene, StartScene } from '@/scenes';
import { PhantomMode, PreloaderMode, RealMode, WelcomeMode } from '@/modes';

export const SCENES: Record<GuiSceneName, GuiScene> = {
  start: {
    name: 'start',
    getComponent: () => StartScene,
    modes: [
      {
        name: 'preloader',
        getComponent: () => PreloaderMode,
      },
      {
        name: 'welcome',
        getComponent: () => WelcomeMode,
      },
    ],
    initialMode: 'preloader'
  },
  galaxy: {
    name: 'galaxy',
    getComponent: () => GalaxyScene,
    modes: [
      {
        name: 'phantom',
        label: 'Phantom',
        getComponent: () => PhantomMode,
        enabled: true,
      },
      {
        name: 'real',
        label: 'Real',
        getComponent: () => RealMode,
        clientScenes: [
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
        enabled: false
      }
    ],
    initialMode: 'real'
  },
};
