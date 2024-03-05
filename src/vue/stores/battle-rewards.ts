import { defineStore } from 'pinia';
import { BattleReward, SceneName } from '@/types';

import { ref } from 'vue';
import { useWallet } from '@/services';
import { useScenesStore } from '@/stores/scenes';

export const useBattleRewardsStore = defineStore('battleRewards', () => {
  const list = ref<BattleReward[]>([])
  const boxesIds = ref<number[]>([])
  const waitingBox = ref(false)

  const setRewards = (rewards: BattleReward[]) => {
    list.value = rewards
    waitingBox.value = false
  }

  const setBoxesIds = (ids: number[]) => {
    boxesIds.value = ids
  }

  const reset = () => {
    waitingBox.value = false
    list.value = []
  }

  const waitBox = () => {
    waitingBox.value = true
  }

  const openBox = async () => {
    const [firstBoxId] = boxesIds.value

    if (firstBoxId) {
      waitingBox.value = true

      const wallet = useWallet()
      const scenes = useScenesStore()
      const success = await wallet.provider.openBox(firstBoxId)

      if (success) {
        boxesIds.value = boxesIds.value.slice(1)
        console.log(`boxes left: ${boxesIds.value}`);

        const boxData = await wallet.provider.getBoxData(firstBoxId)
        const laserLevel = await wallet.provider.getLaserLevel(boxData.rewardId)

        setRewards([
          { name: `Laser ${laserLevel}`, image: '/gui/images/box.svg' },
        ]);
      }

      waitingBox.value = false
    }
  }

  return {
    list,
    boxesIds,
    waitingBox,
    waitBox,
    setBoxesIds,
    setRewards,
    reset,
    openBox,
  }
});
