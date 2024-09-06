import { ref } from 'vue';
import { defineStore } from "pinia"
export const useUiStarDefenderStore = defineStore('uiStarDefender', () => { 
    const starDefenderMenu = ref<string | null>(null);
    
    const setStarDefenderMenu = ( menu: string) => {
        starDefenderMenu.value = menu;
    }

    const reset = () => {
        starDefenderMenu.value = null;
    }

    return {
        starDefenderMenu,
        setStarDefenderMenu,
        reset
    }
})