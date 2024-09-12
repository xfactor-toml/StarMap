<template>
  <BaseControl
    :name="'invisibility'"
    :active="active"
    :disabled="disabled"
    :cooldown="cooldown"
    :progress="progress"
    :params="params"
  />
</template>

<script lang="ts">
import { BaseControl } from './BaseControl';
import { BattleSkill } from '@/types';
import { PropType } from 'vue';

export default {
  name: 'InvisibilityControl',
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
    },
    params: {
      type: Object as PropType<BattleSkill>,
    },
  }
};
</script>
