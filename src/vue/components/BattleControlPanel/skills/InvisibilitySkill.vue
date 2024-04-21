<template>
  <BaseSkill
    :shortcut="'Digit4'"
    :params="params"
    :active="active"
    :disabled="disabled"
    :hasCooldown="hasCooldown"
    @apply="$emit('apply')"
    @levelUp="$emit('levelUp')"
  >
    <InvisibilityControl
      :active="active"
      :disabled="disabled"
      :cooldown="hasCooldown ? toSeconds(cooldown.duration) : null"
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
