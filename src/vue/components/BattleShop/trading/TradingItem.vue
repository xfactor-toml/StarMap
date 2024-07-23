<template>
  <div class="TradingItem" >
    <slot />
    <template v-if="true">
      <button v-if="!tradingStatus" class="TradingItem__trading" :class="{ isDirection: (id%4 > 1 && detail) || special }" @click="itemShow">
         <TradingBuyIcon />
        <span class="TradingItem__levelUpText">BUY</span>
      </button>

      <button v-else class="TradingItem__trading" :class="{ isDirection: (id%4 > 1 && detail) ||special }" @click="itemShow" >
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
  emits: ['itemShow'],
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
      required: true
    },
    special: {
      type: Boolean,
    }
   
  }, 

  methods: {
    itemShow() {
      this.$emit('itemShow', this.id);
    }
  }
};
</script>

<style scoped src="./TradingItem.css" />