import { defineStore } from "pinia";
import { ref } from 'vue';
import { ShopItemData } from "~/game/battle/Types";

export const useBattleShopStore = defineStore('battleShopStore', () => {
    const items = ref<ShopItemData[]>([]);
    const pendingList = ref<Set<number>>(new Set())
    const purchasedList = ref<Set<number>>(new Set())

    const setItems = (value: ShopItemData[]) => {
        items.value = value
    }

    const removeFromPurchasedList = (itemId: number) => {
        purchasedList.value.delete(itemId) 
    }

    const addToPendingList = (itemId: number) => {
        pendingList.value.add(itemId)
    }

    const removeFromPendingList = (itemId: number) => {
        pendingList.value.delete(itemId)     
    }

    const addToPurchasedList = (itemId: number) => {
        purchasedList.value.add(itemId)
    }

    const purchasedItemsArray = () => {
        return Array.from(purchasedList.value);
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
        purchasedList,
        purchasedItemsArray,
        setItems,
        addToPendingList,
        removeFromPendingList,
        removeFromPurchasedList,
        clearPendingList,
        addToPurchasedList,
        reset,   
    };
});

