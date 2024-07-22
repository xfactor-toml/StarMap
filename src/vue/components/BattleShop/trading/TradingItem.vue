<template>
  <div class="TradingItem" >
    <slot />
    <template v-if="true">
      <button v-if="tradingStatus" class="TradingItem__trading" :class="{ isDirection: this.id > 1 && detail }" @click="">
         <TradingBuyIcon />
        <span class="TradingItem__levelUpText">BUY</span>
      </button>

      <button v-else class="TradingItem__trading" :class="{ isDirection: this.id > 1 && detail }" >
         <TradingSellIcon />
        <span class="TradingItem__tradingText">SELL</span>
      </button>
    </template>
  </div>
 
</template>

<script lang="ts">

import { TradingBuyIcon, TradingSellIcon } from './icons';

export default {
  name: 'TradingItem',
  components: {
    TradingBuyIcon,
    TradingSellIcon,
  },
  props: {
    id: {
      type: Number,
    },
    detail: {
      type: Boolean,
      default: false
    },
    tradingStatus: {
      type: Boolean,
      default: true
    }
   
  }, 
};
</script>

<style scoped src="./TradingItem.css" />