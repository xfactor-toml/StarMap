<template>
  <BaseControl
    :disabled="disabled"
    :progress="progress"
  >
    <span class="text">
      <strong class="level">{{ level }}</strong><br>level
    </span>
  </BaseControl>
</template>

<script lang="ts">
import { BaseControl } from './BaseControl';

export default {
  name: 'LevelControl',
  components: {
    BaseControl,
  },
  props: {
    level: {
      type: Number,
      required: true
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

<style scoped>
.text {
  position: relative;
  top: -2px;
  color: #39B24A;
  text-transform: uppercase;
}

.level {
  font-size: 1.2em;
}
</style>
