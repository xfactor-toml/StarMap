<template>
  <BaseSkill
    :shortcut="'Digit1'"
    :params="params"
    :active="active"
    :disabled="disabled"
    :hasCooldown="hasCooldown"
    @apply="$emit('fire')"
    @levelUp="$emit('levelUp')"
  >
    <SatelliteFireControl
      :active="active"
      :disabled="disabled"
      :cooldown="hasCooldown ? toSeconds(cooldown.duration) : null"
      :progress="cooldown ? cooldown.progress : 0"
      @click="$emit('fire')"
    />
  </BaseSkill>
</template>

<script lang="ts">
import { BaseSkill } from './BaseSkill';
import { SatelliteFireControl } from '../controls';
import { PropType } from 'vue';
import { BattleActionType, BattleCooldown, BattleSkill } from '@/types';
import { toSeconds } from '@/utils';

export default {
  name: 'SatelliteFireSkill',
  components: {
    BaseSkill,
    SatelliteFireControl,
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
    },
  },
  emits: ['fire', 'levelUp'],
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
