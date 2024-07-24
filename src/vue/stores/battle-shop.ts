import { defineStore } from "pinia";
import { computed, ref } from 'vue';
import { ItemTradingType } from "@/types";

const getInitialState = () => ( {
    items: [] as ItemTradingType[]
})

export const useBattleShopStore = defineStore('battleShopStore', () => {
    const state = ref(getInitialState());
    const items = computed(() => state.value.items);

    const addItem = (itemId: number) => {
        state.value.items.push({ id: itemId, buy: true });
    };

    const sellItem = (itemId: number) => {
        state.value.items = state.value.items.filter(item => item.id !== itemId);    
    };

    const reset = () => {
        state.value = getInitialState()
    }

    return {
        state,
        items,
        addItem,
        sellItem,
        reset
    };
});

