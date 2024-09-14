<template>
  <BaseSkill
    :shortcut="'Digit3'"
    :params="params"
    :active="active"
    :disabled="disabled"
    :hasCooldown="hasCooldown"
    @apply="$emit('apply')"
    @levelUp="$emit('levelUp')"
  >
    <SlowdownControl
      :active="active"
      :disabled="disabled"
      :cooldown="hasCooldown ? toSeconds(cooldown.duration) : null"
      :progress="cooldown ? cooldown.progress : 0"
      :params="params"
      @click="$emit('apply')"
      @levelUp="$emit('levelUp')"
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
  computed: {
    active() {
      return this.params?.level > 0
    },
    hasCooldown() {
      return this.cooldown !== null
    }
  },
  methods: {
    toSeconds
  }
};
</script>
