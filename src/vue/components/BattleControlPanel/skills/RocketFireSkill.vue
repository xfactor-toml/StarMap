<template>
  <BaseSkill
    :shortcut="'Digit2'"
    :params="params"
    :active="active"
    :disabled="disabled"
    @apply="$emit('fire')"
    @levelUp="$emit('levelUp')"
  >
    <RocketFireControl
      :active="active"
      :disabled="disabled"
      :cooldown="cooldown === null ? null : toSeconds(cooldown.duration)"
      :progress="cooldown ? cooldown.progress : 0"
      @click="$emit('fire')"
    />
  </BaseSkill>
</template>

<script lang="ts">
import { BaseSkill } from './BaseSkill';
import { RocketFireControl } from '../controls';
import { PropType } from 'vue';
import { BattleActionType, BattleCooldown, BattleSkill } from '@/types';
import { toSeconds } from '@/utils';

export default {
  name: 'RocketFireSkill',
  components: {
    BaseSkill,
    RocketFireControl
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
  emits: ['fire', 'levelUp'],
  computed: {
    active() {
      return this.params?.level > 0
    }
  },
  methods: {
    toSeconds
  }
};
</script>
