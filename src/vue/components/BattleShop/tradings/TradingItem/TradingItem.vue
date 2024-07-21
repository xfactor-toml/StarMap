<template>
  <div class="TradingItem" :class="{
    isDisabled: disabled
  }">
    <slot />
    <template v-if="true">
      <!-- <button class="TradingItem__levelUp" :disabled="disabled" @click="$emit('levelUp')">
         <TradingBuyIcon />
        <span class="TradingItem__levelUpText">BUY</span>
      </button> -->

      <button class="TradingItem__levelUp" :disabled="disabled" @click="$emit('levelUp')">
         <TradingSellIcon />
        <span class="TradingItem__levelUpText">SELL</span>
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import {
  TradingBuyIcon,
  TradingSellIcon
} from './icons';
import { BattleSkill } from '@/types';
import { PropType } from 'vue';

export default {
  name: 'TradingItem',
  components: {
    TradingBuyIcon,
    TradingSellIcon,
  },
  props: {
    params: {
      type: Object as PropType<BattleSkill>,
    },

    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
   
  },
 
};
</script>

<style scoped src="./TradingItem.css" />