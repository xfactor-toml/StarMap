<template>
  <BaseControl :disabled="disabled">
    <span class="text">
      <strong>{{ formattedAmount }}</strong><br>GOLD
    </span>
  </BaseControl>
</template>

<script lang="ts">
import { formatNumber } from '@/utils';
import { BaseControl } from './BaseControl';

export default {
  name: 'GoldControl',
  components: {
    BaseControl,
  },
  props: {
    amount: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
    }
  },
  computed: {
    formattedAmount() {
      return formatNumber(this.amount)
    }
  }
};
</script>

<style scoped>
.text {
  color: #F9EB21;
}
</style>
