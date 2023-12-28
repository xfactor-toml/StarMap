<template>
  <BaseControl
    :name="'rocketFire'"
    :active="active"
    :disabled="disabled"
    :cooldown="cooldown"
    :progress="progress"
  />
</template>

<script lang="ts">
import { BaseControl } from './BaseControl';

export default {
  name: 'RocketFireControl',
  components: {
    BaseControl,
  },
  props: {
    active: {
      type: Boolean,
    },
    cooldown: {
      type: Number,
    },
    progress: {
      type: Number,
    },
    disabled: {
      type: Boolean,
    }
  }
};
</script>
