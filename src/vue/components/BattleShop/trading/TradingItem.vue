<template>
  <div
    class="TradingItem"
    :class="{
      isHide: this.hide,
      canBuy: this.canBuy
    }">
    <div class="TradingItem__content">
      <slot />
    </div>
    <Loader
      v-if="loading"
      class="TradingItem__loader"
    />
    <button
      v-else
      class="TradingItem__trading"
      :class="{
        isDirection: (id % 4 > 1 && detail) || special
      }"
      @click="itemShow"
    >
      <component :is="tradingStatus ? 'TradingSellIcon' : 'TradingBuyIcon'" />
      <span class="TradingItem__tradingText">{{ tradingStatus ? 'SELL' : 'BUY' }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import { TradingBuyIcon, TradingSellIcon } from './icons';
import { Loader } from '../../Loader';

export default {
  name: 'TradingItem',
  components: {
    Loader,
    TradingBuyIcon,
    TradingSellIcon,
  },
  emits: ['itemShow'],
  props: {
    id: {
      type: Number,
    },
    loading: {
      type: Boolean,
      default: false
    },
    canBuy: {
      type: Boolean,
      default: false
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
