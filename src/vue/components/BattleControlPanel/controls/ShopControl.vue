<template>
 <BaseControl
    :active="active"
    :disabled="disabled"
    @click="handleClick"
  >SHOP
  </BaseControl>
</template>

<script lang="ts">
import { BaseControl } from './BaseControl';

export default {
  name: 'ShopControl',
  components: {
    BaseControl,
  },
  props: {
    disabled: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    }
  }, 
  methods: {
    handleClick() {
      this.$emit('action')
    }
  }
};
</script>
