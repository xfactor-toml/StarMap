<template>
    <TradingItem>
        <SpiralSentinelItem />
    </TradingItem>
</template>

<script lang="ts">
import { TradingItem } from './TradingItem'
import SpiralSentinelItem from '../items/SpiralSentinelItem.vue';
import { PropType } from 'vue';

export default {
    name: 'ThunderTrading',
    components: {
        TradingItem,
        SpiralSentinelItem,
    },

}
</script>