
import { wait } from '@/utils';
import { useBattleStore, useScenesStore } from '@/stores';
import { SceneName } from '@/types';

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
        charges: {
          count: 3,
          fractions: 4
        },
        cooldown: {
          duration: 3000,
        }
      }
    }
  });

  scenes.setScene(SceneName.Battle, {
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
}
