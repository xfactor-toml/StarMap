<template>
    <div v-if="purchasedList.length == 2" class="ShopItemControl__row">
        <BaseControl :name="itemName[purchasedList[0]]" :disabled="true" />
        <BaseControl :name="itemName[purchasedList[1]]" :disabled="true" />
    </div>

    <div v-if="purchasedList.length == 1" class="ShopItemControl__row">
        <BaseControl :name="itemName[purchasedList[0]]" :disabled="true" />
        <BaseControl :disabled="true" />
    </div>

    <div v-if="purchasedList.length == 0" class="ShopItemControl__row">
        <BaseControl :disabled="true" />
        <BaseControl :disabled="true" />
    </div>
</template>

<script lang="ts">
import { BaseControl } from './BaseControl';
import { PropType } from 'vue';
import { ShopItemData } from '~/game/battle/Types';
import { useBattleStore } from '@/stores';
import { mapStores } from 'pinia';
export default {
    name: 'shopItemControl',
    components: {
        BaseControl
    },
    computed: {
        purchasedList() {
            return this.battleStore.shop.purchasedItemsArray()
        },
        ...mapStores(useBattleStore)
    },
    props: {
        items: {
            type: Array as PropType<ShopItemData[]>,
        },
    },
    data() {
        return {
            itemName: ['thunder', 'velocityVector','nuclearOrb' , 'spiralSentinel','accelerationAmulet' , 'surgesSpire' , 'momentumMatrix', 'quantumBooster'],
        }
    },
}
</script>

<style>
.ShopItemControl__row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 5px;
}
</style>
