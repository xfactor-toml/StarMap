
import { wait } from '@/utils';
import { useBattleStore, useScenesStore } from '@/stores';
import { UISceneNames } from '@/types';

export const battleRunMock = async () => {
  const scenes = useScenesStore()
  const battle = useBattleStore()

  battle.process.setState({
    players: {
      connected: {
        address: '0xADDR-ENEMY',
        name: 'Kepler',
        race: 'Humans',
        star: '2048RX',
      },
      current: {
        address: '0xADDR-PLAYER',
        name: 'Anthares',
        race: 'Insects',
        star: '2048RX',
      },
    },
    gold: 1000,
    level: {
      current: 1,
      progress: 0
    },
    skills: {
      satelliteFire: {
        level: 1,
        levelUpAvailable: true,
        cooldown: {
          duration: 3000,
        }
      },
      // slowdown: {
      //   level: 1,
      //   levelUpAvailable: true,
      //   cooldown: {
      //     duration: 4000,
      //   }
      // },
      // invisibility: {
      //   level: 2,
      //   levelUpAvailable: true,
      //   cooldown: {
      //     duration: 2000,
      //   }
      // },
    }
  });

  scenes.setScene(UISceneNames.Battle, {
    mode: 'process'
  })

  await wait(2000)

  battle.process.setLevel({
    current: 1,
    progress: 50
  });

  await wait(1000)

  battle.process.setLevel({
    current: 2,
    progress: 10
  });
  
  battle.process.setGold(100);
}
