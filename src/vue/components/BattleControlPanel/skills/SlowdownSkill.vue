<template>
  <BaseSkill>
    <SlowdownControl
      :active="active"
      :disabled="disabled"
      :cooldown="cooldown"
      :progress="progress"
    />
  </BaseSkill>
</template>

<script lang="ts">
import { BaseSkill } from './BaseSkill';
import { SlowdownControl } from '../controls';

export default {
  name: 'SlowdownSkill',
  components: {
    BaseSkill,
    SlowdownControl,
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
