import { defineStore } from "pinia";
import { ref } from 'vue';
import { ShopItemData } from "~/game/battle/Types";

export const useBattleShopStore = defineStore('battleShopStore', () => {
    const items = ref<ShopItemData[]>([]);
    const pendingList = ref<Set<number>>(new Set())

    const setItems = (value: ShopItemData[]) => {
        items.value = value
    }

    const sellItem = (itemId: number) => {
        items.value = items.value.filter(item => item.id !== itemId);    
    };

    const addToPendingList = (itemId: number) => {
        pendingList.value.add(itemId)
    }

    const removeFromPendingList = (itemId: number) => {
        pendingList.value.delete(itemId)
    }

    const clearPendingList = () => {
        pendingList.value.clear()
    }

    const reset = () => {
        items.value = []
    }

    return {
        items,
        pendingList,
        sellItem,
        setItems,
        addToPendingList,
        removeFromPendingList,
        clearPendingList,
        reset,
    };
});

