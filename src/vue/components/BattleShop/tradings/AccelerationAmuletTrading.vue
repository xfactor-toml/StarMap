<template>
    <TradingItem>
        <AccelerationAmuletItem />
    </TradingItem>
</template>

<script lang="ts">
import { TradingItem } from './TradingItem'
import { AccelerationAmuletItem } from '../items';
import { PropType } from 'vue';

export default {
    name: 'ThunderTrading',
    components: {
        TradingItem,
        AccelerationAmuletItem,
    },

}
</script>