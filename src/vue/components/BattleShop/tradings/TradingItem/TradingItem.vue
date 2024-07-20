<template>
  <div class="TradingItem" >
    <slot />
    <template v-if="true">
      <button v-if="tradingStatus" class="TradingItem__trading" :class="{ isDirection: id > 1 && detail }" @click="handleBuyClick">
         <TradingBuyIcon />
        <span class="TradingItem__levelUpText">BUY</span>
      </button>

      <button v-else class="TradingItem__trading" :class="{ isDirection: id > 1 && detail }" >
         <TradingSellIcon />
        <span class="TradingItem__tradingText">SELL</span>
      </button>
    </template>
  </div>
  <BattleItemCard
      v-if="itemCardShow"
      :title="this.BattleItemCards[this.id].name"
      :description="this.BattleItemCards[this.id].description"
      :image="this.BattleItemCards[this.id].src"
      :price="this.BattleItemCards[this.id].price"
      @close="handleCloseClick"
      @buy="handleConfirm"
      @sell="handleConfirm"
    />
  <ConfirmPopup
    v-if="confirmation"
    :title="'Are you sure you want to make this purchase?'"
    @close="handleCloseClick"
    @confirm="resolveConfirm"
  /> 
</template>

<script lang="ts">
import BattleItemCard from '@/components/BattleItemCard/BattleItemCard.vue';
import { BattleItemCards } from '@/constants';
import { ConfirmPopup } from '@/components/ConfirmPopup';
import { TradingBuyIcon, TradingSellIcon } from './icons';

export default {
  name: 'TradingItem',
  components: {
    TradingBuyIcon,
    TradingSellIcon,
    BattleItemCard,
    ConfirmPopup
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
  data() {
    return {
      itemCardShow: false,
      confirmation: false,
      BattleItemCards
    }
  },
  methods: {
    handleBuyClick() {
      this.itemCardShow = true   
    },
    handleCloseClick() {
      this.itemCardShow = false,
      this.confirmation = false
    },
    handleConfirm() {
      this.confirmation = true
    },
    resolveConfirm() {
      this.itemCardShow = false,
      this.confirmation = false
    }
  }
 
};
</script>

<style scoped src="./TradingItem.css" />