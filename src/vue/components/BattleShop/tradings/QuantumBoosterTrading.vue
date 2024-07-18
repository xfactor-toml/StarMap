<template>
    <div>
        <TradingItem>
            <QuantumBoosterItem />
        </TradingItem>
    </div>
</template>

<script lang="ts">
import { TradingItem } from './TradingItem'
import { QuantumBoosterItem } from '../items';
import { PropType } from 'vue';

export default {
    name: 'ThunderTrading',
    components: {
        TradingItem,
        QuantumBoosterItem,
    },

}
</script>