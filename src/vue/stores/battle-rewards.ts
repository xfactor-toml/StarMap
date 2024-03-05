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
      const success = true; // await wallet.provider.openBox(firstBoxId)

      if (success) {
        boxesIds.value = boxesIds.value.slice(1)
        console.log(`boxes left: ${boxesIds.value}`);

        const boxData = await wallet.provider.getBoxData(firstBoxId);
        console.log(`boxData:`, boxData);
        // const laserLevel = await wallet.provider.getLaserLevel(boxData.rewardId)
        // const rankByLevel = ['common', 'uncommon', 'rare'];

        let list: {
          type: 'vrp' | 'biomass' | 'carbon' | 'metal' | 'spice' | 'spores' | 'laser',
          value?: number, // for res
          laserLevel?: number // 1-3
        }[] = [];

        

        const testList = [
          // { name: `Laser (${rankByLevel[laserLevel] || laserLevel})`, image: '/gui/images/box.svg' },
          { name: `VRP +500`, image: '/gui/images/icons/coins.png' },
          { name: `Biomass +50`, image: '/gui/images/icons/biomass.png' },
          { name: `Carbon +150`, image: '/gui/images/icons/hydrocarbon.png' },
          { name: `Metal +10`, image: '/gui/images/icons/metal.png' },
          { name: `Spice +100`, image: '/gui/images/icons/spice.png' },
          { name: `Spores +80`, image: '/gui/images/icons/spores.png' },
          { name: `Laser Lv.1`, image: '/gui/images/icons/laser-red.png' },
          { name: `Laser Lv.2`, image: '/gui/images/icons/laser-white.png' },
          { name: `Laser Lv.3`, image: '/gui/images/icons/laser-violet.png' },
        ]

        setRewards(testList);
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
