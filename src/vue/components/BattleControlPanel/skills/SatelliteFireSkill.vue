<template>
  <BaseSkill
    :count="params.charges.count"
    :fractions="params.charges.fractions"
  >
    <SatelliteFireControl
      :active="params !== undefined"
      :disabled="disabled"
      :cooldown="cooldown === null ? null : toSeconds(cooldown.duration)"
      :progress="cooldown ? cooldown.progress / 100 : 0"
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
    }
  },
  emits: ['fire'],
  methods: {
    toSeconds
  }
};
</script>
