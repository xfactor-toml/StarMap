<template>
  <BasePopup
    class="InventoryCardPopup"
    @close="$emit('close')"
  >
    <div class="InventoryCardPopup__content">
      <div class="InventoryCardPopup__preview">
        <img class="InventoryCardPopup__image" :src="image"/>
      </div>
      <div class="InventoryCardPopup__title">{{ title }}</div>
      <div class="InventoryCardPopup__text">{{ description }}</div>
      <button
        class="InventoryCardPopup__button"
        @click="$emit('buy')"
      >Buy</button>
    </div>
  </BasePopup>
</template>

<script lang="ts">
import { BasePopup } from '@/components'

export default {
  name: 'InventoryCardPopup',
  components: {
    BasePopup
  },
  props: {
    title: String,
    description: String,
    image: String,
    type: String,
  }
};
</script>

<style scoped src="./InventoryCardPopup.css"></style>
