<template>
  <div class="TradingItem" :class="{ isHide: this.hide }">
    <slot />
    <template v-if="true">

      <button class="TradingItem__trading" :class="{ isDirection: (id % 4 > 1 && detail) || special }"
        @click="itemShow">
        <component :is="tradingStatus ? 'TradingSellIcon' : 'TradingBuyIcon'" />
        <span class="TradingItem__tradingText">{{ tradingStatus ? 'SELL' : 'BUY' }}</span>
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
      default: true,
    },
    special: {
      type: Boolean,
    },
    hide: {
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