<template>
  <BaseSkill
    :count="charges.count"
    :fractions="charges.fractions"
  >
    <SatelliteFireControl
      :active="params !== undefined"
      :disabled="disabled"
      :cooldown="cooldown.times"
      :progress="cooldown.progress"
      @click="fire"
    />
  </BaseSkill>
</template>

<script lang="ts">
import { BaseSkill } from './BaseSkill';
import { SatelliteFireControl } from '../controls';
import { PropType } from 'vue';
import { BattleSkill } from '@/types';
import { default as anime } from 'animejs';

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
    disabled: {
      type: Boolean,
    }
  },
  emits: ['fire'],
  data: () => ({
    cooldown: {
      progress: 0,
      times: 0,
    },
    charges: {
      count: 0,
      fractions: 0
    },
    cooldownDelay: 200
  }),
  created() {
    this.charges = {
      count: this.params.charges.count - 1,
      fractions: this.params.charges.fractions
    }
  },
  methods: {
    fire() {
      this.charges.fractions -= 1

      if (this.charges.fractions === 0) {
        if (this.charges.count > 0) {
          this.charges.count -= 1
          this.charges.fractions = this.params.charges.fractions
        } else {
          this.cooldown.times = this.params.charges.count - 1
          this.runCooldown()
          return
        }
      }

      this.$emit('fire')
    },
    runCooldown() {
      if (this.cooldown.times === 0) {
        return
      }

      anime({
        targets: this.cooldown,
        progress: 1,
        duration: this.params.cooldown.duration - this.cooldownDelay,
        easing: 'easeInOutSine',
        begin: () => {
          this.charges.fractions = 0
        },
        update: ({ progress }) => {
          this.charges.fractions = Math.trunc(this.params.charges.fractions / 80 * Math.ceil(progress))
        },
        complete: () => {
          this.charges.fractions = this.params.charges.fractions
          
          setTimeout(() => {
            this.charges.count += 1
            this.cooldown.times -= 1
            this.cooldown.progress = 0
            this.runCooldown()
          }, this.cooldownDelay);
        }
      })
    },

  }
};
</script>
