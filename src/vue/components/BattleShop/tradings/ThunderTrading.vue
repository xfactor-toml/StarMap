<template>
  <div>
    <TradingItem>
      <ThunderItem />
    </TradingItem>
  </div>
</template>

<script lang="ts">
import { TradingItem } from './TradingItem'
import { ThunderItem } from '../items';
import { PropType } from 'vue';

export default {
  name: 'ThunderTrading',
  components: {
    TradingItem,
    ThunderItem,
  },

}
</script>