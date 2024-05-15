<template>
  <BasePopup
    class="ConfirmPopup"
    @close="$emit('close')"
  >
    <div class="ConfirmPopup__content">
      <div class="ConfirmPopup__title">{{ title || 'Confirm' }}</div>
      <div
        v-if="description"
        class="ConfirmPopup__text"
      >{{ description }}
      </div>
      <div class="ConfirmPopup__buttons">
        <button
          class="ConfirmPopup__button"
          @click="$emit('confirm')"
          >Yes
        </button>
        <button
          class="ConfirmPopup__button is-cancel"
          @click="$emit('close')"
        >Cancel
      </button>
    </div>
    </div>
  </BasePopup>
</template>

<script lang="ts">
import { BasePopup } from '@/components'

export default {
  name: 'ConfirmPopup',
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

<style scoped src="./ConfirmPopup.css"></style>
