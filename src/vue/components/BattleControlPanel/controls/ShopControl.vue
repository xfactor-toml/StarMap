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
  emits: ['openShop'],
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
      this.$emit('openShop');
      console.log("1233434")
    }
  }
};
</script>
