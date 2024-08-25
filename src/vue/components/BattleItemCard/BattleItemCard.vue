<template>
  <BasePopup class="BattleItemCard" @close="$emit('close')">
    <div class="BattleItemCard__content">
      <div class="BattleItemCard__row">
        <div class="BattleItemCard__preview">
          <img class="BattleItemCard__image" :src="image" />
        </div>
        <div class="BattleItemCard__gold">
           Gold: {{ price }}
        </div>
      </div>
      <div class="BattleItemCard__title">{{ title }}</div>
      <div class="BattleItemCard__text">{{ description }}</div>
      <button
        v-if="!tradingStatus"
        :disabled="!canBuy"
        class="BattleItemCard__buybutton"
        @click="canBuy && $emit('buy')"
      >Buy
      </button>
      <button
        v-if="tradingStatus"
        class="BattleItemCard__sellbutton"
        @click="$emit('sell')"
      >Sell
      </button>
    </div>
  </BasePopup>
</template>

<script lang="ts">
import { BasePopup } from '@/components'

export default {
  name: 'BattleItemCard',
  components: {
    BasePopup
  },
  emits: ['buy', 'sell', 'close'],
  props: {
    title: String,
    description: String,
    icon: String,
    price: Number,
    canBuy: Boolean,
    tradingStatus: Boolean,
  },
  computed: {
    image() {
      return '../assets/battleIcon/thunder.png'
    }
  }
};
</script>

<style scoped src="./BattleItemCard.css"></style>
