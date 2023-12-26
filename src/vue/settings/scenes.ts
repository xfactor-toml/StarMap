import { GuiScenes, SceneName } from '@/types';
import { BattleScene, GalaxyScene, StartScene } from '@/scenes';
import { PhantomMode, PreloaderMode, RealMode, WelcomeMode } from '@/modes';
import { BattleInitMode, BattleProcessMode } from '@/modes';
import { wait } from '@/utils';

export const SCENES: GuiScenes = {
  start: {
    name: SceneName.Start,
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
    name: SceneName.Galaxy,
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
  battle: {
    name: SceneName.Battle,
    getComponent: () => BattleScene,
    modes: [
      {
        name: 'init',
        getComponent: () => BattleInitMode,
        beforeLeave: () => wait(),
      },
      {
        name: 'process',
        getComponent: () => BattleProcessMode,
      },
    ],
    initialMode: 'init'
  },
};
