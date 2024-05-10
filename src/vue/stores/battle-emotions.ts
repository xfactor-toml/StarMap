import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Emotion } from '~/game/battle/Types';

export type Coords = {
    x: number,
    y: number
}

export const useBattleEmotionsStore = defineStore('battleEmotions', () => {
    const selectorCoords = ref<Coords | null>()
    const playerEmotion = ref<{
        type: Emotion
        coords: Coords
    } | null>()

    const showSelector = (coords: Coords) => {
        if (!selectorCoords.value) {
            selectorCoords.value = coords
        }
    }

    const closeSelector = () => {
        selectorCoords.value = null
    }

    const showPlayerEmotion = (type: Emotion, coords: Coords) => {
        playerEmotion.value = {
            type,
            coords
        }
    }
    
    const removePlayerEmotion = () => {
        playerEmotion.value = null
    }

    return {
        selectorCoords,
        playerEmotion,
        showSelector,
        closeSelector,
        showPlayerEmotion,
        removePlayerEmotion
    }
});
