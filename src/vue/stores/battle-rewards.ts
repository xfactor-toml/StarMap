import { defineStore } from 'pinia';
import { BattleReward, UISceneNames } from '@/types';
import { ref } from 'vue';
import { useWallet } from '@/services';
import { useScenesStore } from '@/stores/scenes';
import { LogMng } from '~/monax/LogMng';
import { web2assets } from '~/blockchainTotal/getters/boxesWeb2';
import { mapAssets } from '@/utils';

export const useBattleRewardsStore = defineStore('battleRewards', () => {
    const list = ref<BattleReward[]>([])
    const boxesIds = ref<number[]>([])
    const waitingBox = ref(false)
    const coins = ref(0)

    const setRewards = (rewards: BattleReward[]) => {
        list.value = rewards
        waitingBox.value = false
    }

    const setCoins = (value: number) => {
        coins.value = value
    }

    const setBoxesIds = (ids: number[]) => {
        LogMng.debug(`vue: setBoxesIds(): ids:`, ids)
        boxesIds.value = ids
    }

    const reset = () => {
        waitingBox.value = false
        list.value = []
        coins.value = 0
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

            if (!wallet.connected) {
                const connection = await wallet.connect("local");
            }
            const openResult: web2assets = await wallet.provider.openBox(firstBoxId);
            LogMng.debug(`openResult:`, openResult);

            if (openResult) {
                boxesIds.value = boxesIds.value.slice(1)
                LogMng.debug(`boxes left: ${boxesIds.value}`);

                // const boxData: BoxDataWeb2 = await wallet.provider.getBoxData(firstBoxId);
                // LogMng.debug(`boxData:`, boxData);

                // if (boxData.type != undefined) {
    
                // const testList = [
                // { name: `Laser (${rankByLevel[laserLevel] || laserLevel})`, image: '/gui/images/box.svg' },
                // { name: `VRP +500`, image: '/gui/images/icons/coins.png' },
                // { name: `Biomass +50`, image: '/gui/images/icons/biomass.png' },
                // { name: `Carbon +150`, image: '/gui/images/icons/hydrocarbon.png' },
                // { name: `Metal +10`, image: '/gui/images/icons/metal.png' },
                // { name: `Spice +100`, image: '/gui/images/icons/spice.png' },
                // { name: `Spores +80`, image: '/gui/images/icons/spores.png' },
                // { name: `Laser Lv.1`, image: '/gui/images/icons/laser-red.png' },
                // { name: `Laser Lv.2`, image: '/gui/images/icons/laser-white.png' },
                // { name: `Laser Lv.3`, image: '/gui/images/icons/laser-violet.png' },
                // ]

                setRewards(mapAssets(openResult));

                // }
                // else {
                //     LogMng.error(`Box open error: ${openResult}`);
                //     alert(`Box opening error, try again.`);
                // }
            }
            else {
                LogMng.error(`Box open error: ${openResult}`);
                alert(`Box opening error, try again.`);
            }

            waitingBox.value = false
        }

        return list.value
    }

    return {
        coins,
        list,
        boxesIds,
        waitingBox,
        waitBox,
        setCoins,
        setBoxesIds,
        setRewards,
        reset,
        openBox,
    }
});
