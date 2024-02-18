<template>
  <BaseSkill
    :params="params"
    @levelUp="$emit('levelUp')"
  >
    <InvisibilityControl
      :active="params !== undefined"
      :disabled="disabled"
      :cooldown="cooldown === null ? null : toSeconds(cooldown.duration)"
      :progress="cooldown ? cooldown.progress : 0"
      @click="$emit('apply')"
    />
  </BaseSkill>
</template>

<script lang="ts">
import { BattleSkill, BattleCooldown, BattleActionType } from '@/types';
import { PropType } from 'vue';
import { InvisibilityControl } from '../controls';
import { BaseSkill } from './BaseSkill';
import { toSeconds } from '@/utils';

export default {
  name: 'InvisibilitySkill',
  components: {
    BaseSkill,
    InvisibilityControl,
  },
  props: {
    params: {
      type: Object as PropType<BattleSkill>,
    },
    cooldown: {
      type: Object as PropType<BattleCooldown[BattleActionType]>
    },
    disabled: {
      type: Boolean,
    }
  },
  emits: ['apply', 'levelUp'],
  methods: {
    toSeconds
  }
};
</script>
