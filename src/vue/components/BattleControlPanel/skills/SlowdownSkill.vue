<template>
  <BaseSkill
    :params="params"
    @levelUp="$emit('levelUp')"
  >
    <SlowdownControl
      :active="params?.level > 0"
      :disabled="disabled"
      :cooldown="cooldown === null ? null : toSeconds(cooldown.duration)"
      :progress="cooldown ? cooldown.progress : 0"
      @click="$emit('apply')"
    />
  </BaseSkill>
</template>

<script lang="ts">
import { BaseSkill } from './BaseSkill';
import { SlowdownControl } from '../controls';
import { BattleSkill, BattleCooldown, BattleActionType } from '@/types';
import { toSeconds } from '@/utils';
import { PropType } from 'vue';

export default {
  name: 'SlowdownSkill',
  components: {
    BaseSkill,
    SlowdownControl,
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
