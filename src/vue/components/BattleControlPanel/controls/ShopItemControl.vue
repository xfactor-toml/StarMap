<template>
    <div v-if="items?.length == 2" class="ShopItemControl__row">
        <BaseControl :name="itemName[items[0].id]" :disabled="true" />
        <BaseControl :name="itemName[items[1].id]" :disabled="true" />
    </div>

    <div v-if="items?.length == 1" class="ShopItemControl__row">
        <BaseControl :name="itemName[items[0].id]" :disabled="true" />
        <BaseControl :disabled="true" />
    </div>

    <div v-if="items?.length == 0" class="ShopItemControl__row">
        <BaseControl :disabled="true" />
        <BaseControl :disabled="true" />
    </div>
</template>

<script lang="ts">
import { ItemTradingType } from '@/types';
import { BaseControl } from './BaseControl';
import { PropType } from 'vue';
export default {
    name: 'shopItemControl',
    components: {
        BaseControl
    },
    props: {
        items: {
            type: Array as PropType<ItemTradingType[]>,
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
