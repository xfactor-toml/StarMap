<template>
  <BaseSkill>
    <InvisibilityControl
      :active="active"
      :disabled="disabled"
      :cooldown="cooldown"
      :progress="progress"
    />
  </BaseSkill>
</template>

<script lang="ts">
import { InvisibilityControl } from '../controls';
import { BaseSkill } from './BaseSkill';

export default {
  name: 'InvisibilitySkill',
  components: {
    BaseSkill,
    InvisibilityControl,
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
