<template>
    <TradingItem>
        <VelocityVectorItem />
    </TradingItem>
</template>

<script lang="ts">
import { TradingItem } from './TradingItem'
import { VelocityVectorItem } from '../items';
import { PropType } from 'vue';

export default {
    name: 'ThunderTrading',
    components: {
        TradingItem,
        VelocityVectorItem,
    },

}
</script>