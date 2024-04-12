
import { default as anime } from 'animejs';
import { toMilliseconds, wait } from '@/utils';
import { useBattleStore, useScenesStore } from '@/stores';
import { UISceneNames } from '@/types';

export const playersConnectMock = async () => {
  // seconds
  const ACCEPT_TIME = 6
  const LOADING_TIME = 4

  const scenes = useScenesStore()
  const battle = useBattleStore()

  scenes.setScene(UISceneNames.Battle)

  // Accept
  scenes.setSceneMode('accept');
  battle.connecting.setAcceptTime(ACCEPT_TIME)

  await wait(toMilliseconds({
    seconds: ACCEPT_TIME / 3
  }))

  // Connect
  scenes.setSceneMode('connect');
  battle.connecting.setConnectedUsers({
    current: 1,
    max: 2,
  })

  await wait(toMilliseconds({
    seconds: ACCEPT_TIME / 3
  }))
  
  battle.connecting.setConnectedUsers({
    current: 2,
    max: 2,
  })

  await wait(toMilliseconds({
    seconds: ACCEPT_TIME / 3
  }))

  // Loading
  scenes.setSceneMode('loading');

  anime({
    targets: { progress: 0 },
    progress: 100,
    easing: 'linear',
    duration: toMilliseconds({
      seconds: LOADING_TIME
    }),
    update({ progress }) {
      battle.connecting.setLoadingProgress(progress)
    },
    complete() {
      scenes.setScene(UISceneNames.Galaxy);
    }
  })
}
