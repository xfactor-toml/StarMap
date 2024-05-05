import { defineStore } from 'pinia';
import { ref } from 'vue';

type Coords = {
    x: number,
    y: number
}

export const useBattleEmotionsStore = defineStore('battleEmotions', () => {
    const selectorCoords = ref<Coords | null>()

    const showSelector = (coords: Coords) => {
        selectorCoords.value = coords
    }

    const closeSelector = () => {
        selectorCoords.value = null
    }

    return {
        selectorCoords,
        showSelector,
        closeSelector
    }
});
