<template>
  <BaseSkill>
    <RocketFireControl
      :active="active"
      :disabled="disabled"
      :cooldown="cooldown"
      :progress="progress"
    />
  </BaseSkill>
</template>

<script lang="ts">
import { BaseSkill } from './BaseSkill';
import { RocketFireControl } from '../controls';

export default {
  name: 'RocketFireSkill',
  components: {
    BaseSkill,
    RocketFireControl
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
