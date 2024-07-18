<template>
    <TradingItem>
        <MomentumMatrixItem />
    </TradingItem>
</template>

<script lang="ts">
import { TradingItem } from './TradingItem'
import { MomentumMatrixItem } from '../items';
import { PropType } from 'vue';

export default {
    name: 'ThunderTrading',
    components: {
        TradingItem,
        MomentumMatrixItem,
    },

}
</script>