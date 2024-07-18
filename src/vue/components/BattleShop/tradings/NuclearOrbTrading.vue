<template>
    <TradingItem>
        <NuclearOrbItem />
    </TradingItem>
</template>

<script lang="ts">
import { TradingItem } from './TradingItem'
import { NuclearOrbItem } from '../items';
import { PropType } from 'vue';

export default {
    name: 'NuclearTrading',
    components: {
        TradingItem,
        NuclearOrbItem,
    },

}
</script>