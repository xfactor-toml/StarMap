<template>
    <TradingItem>
        <SurgeSpiresItem />
    </TradingItem>
</template>

<script lang="ts">
import { TradingItem } from './TradingItem'
import { SurgeSpiresItem } from '../items';
import { PropType } from 'vue';

export default {
    name: 'ThunderTrading',
    components: {
        TradingItem,
        SurgeSpiresItem,
    },

}
</script>