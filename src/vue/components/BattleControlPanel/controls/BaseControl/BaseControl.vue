<template>
  <button
    class="BaseControl"
    :class="{
      active,
      cooldown: hasCooldown,
      hasContent: Boolean($slots.default),
      [name]: Boolean(name),
    }"
    :disabled="!active || disabled"
    @click="$emit('click')"
  >
    <svg
      viewBox="0 0 193 213"
      fill="none"
    >
      <path
        stroke="currentColor"
        d="M1.40002 144.21V68.52C1.40002 57.8 7.12002 47.9 16.4 42.54L81.95 4.68992C91.23 -0.670078 102.67 -0.670078 111.95 4.68992L177.5 42.54C186.78 47.9 192.5 57.8 192.5 68.52V144.21C192.5 154.93 186.78 164.83 177.5 170.19L111.95 208.04C102.67 213.4 91.23 213.4 81.95 208.04L16.4 170.19C7.12002 164.83 1.40002 154.93 1.40002 144.21Z"
      />
      <g v-if="icon || hasCooldown" class="BaseControl__fill">
        <path
          d="M96.95 202.05C93.44 202.05 89.99 201.12 86.95 199.37L21.4 161.52C15.23 157.96 11.4 151.32 11.4 144.2V68.5101C11.4 61.3901 15.23 54.7501 21.4 51.1901L86.95 13.3401C89.99 11.5901 93.44 10.6602 96.95 10.6602C100.46 10.6602 103.91 11.5901 106.95 13.3401L172.5 51.1901C178.67 54.7501 182.5 61.3901 182.5 68.5101V144.2C182.5 151.32 178.67 157.96 172.5 161.52L106.95 199.37C103.91 201.12 100.46 202.05 96.95 202.05Z"
        />
      </g>
      <template v-else>
        <path
          stroke="currentColor"
          stroke-width="2"
          d="M96.95 202.05C93.44 202.05 89.99 201.12 86.95 199.37L21.4 161.52C15.23 157.96 11.4 151.32 11.4 144.2V68.5101C11.4 61.3901 15.23 54.7501 21.4 51.1901L86.95 13.3401C89.99 11.5901 93.44 10.6602 96.95 10.6602C100.46 10.6602 103.91 11.5901 106.95 13.3401L172.5 51.1901C178.67 54.7501 182.5 61.3901 182.5 68.5101V144.2C182.5 151.32 178.67 157.96 172.5 161.52L106.95 199.37C103.91 201.12 100.46 202.05 96.95 202.05Z"
        />
        <path
          v-if="progress"
          :style="progressStyle"
          stroke="currentColor"
          stroke-width="10"
          d="M96.95 202.05C93.44 202.05 89.99 201.12 86.95 199.37L21.4 161.52C15.23 157.96 11.4 151.32 11.4 144.2V68.5101C11.4 61.3901 15.23 54.7501 21.4 51.1901L86.95 13.3401C89.99 11.5901 93.44 10.6602 96.95 10.6602C100.46 10.6602 103.91 11.5901 106.95 13.3401L172.5 51.1901C178.67 54.7501 182.5 61.3901 182.5 68.5101V144.2C182.5 151.32 178.67 157.96 172.5 161.52L106.95 199.37C103.91 201.12 100.46 202.05 96.95 202.05Z"
        />
        <path
          stroke="currentColor"
          stroke-width="2"
          d="M96.95 192.05C95.2 192.05 93.47 191.59 91.95 190.71L26.4 152.86C23.32 151.08 21.4 147.76 21.4 144.2V68.5101C21.4 64.9501 23.32 61.6301 26.4 59.8501L91.95 22.0001C93.47 21.1201 95.2 20.6602 96.95 20.6602C98.7 20.6602 100.43 21.1201 101.95 22.0001L167.5 59.8501C170.58 61.6301 172.5 64.9501 172.5 68.5101V144.2C172.5 147.76 170.58 151.08 167.5 152.86L101.95 190.71C100.43 191.59 98.7 192.05 96.95 192.05Z"
        />
      </template>
    </svg>
    <div
      v-if="icon"
      class="BaseControl__icon"
    >
      <component :is="icon"/>
    </div>
    <div
      v-if="$slots.default"
      class="BaseControl__content"
    >
      <slot/>
    </div>
    <template v-if="hasCooldown">
      <svg
        class="BaseControl__cooldown"
        viewBox="0 0 193 213"
        fill="none"
      >
        <path
          stroke="currentColor"
          stroke-width="1"
          d="M96.95 202.05C93.44 202.05 89.99 201.12 86.95 199.37L21.4 161.52C15.23 157.96 11.4 151.32 11.4 144.2V68.5101C11.4 61.3901 15.23 54.7501 21.4 51.1901L86.95 13.3401C89.99 11.5901 93.44 10.6602 96.95 10.6602C100.46 10.6602 103.91 11.5901 106.95 13.3401L172.5 51.1901C178.67 54.7501 182.5 61.3901 182.5 68.5101V144.2C182.5 151.32 178.67 157.96 172.5 161.52L106.95 199.37C103.91 201.12 100.46 202.05 96.95 202.05Z"
        />
        <path
          v-if="progress"
          :style="progressStyle"
          stroke="currentColor"
          stroke-width="10"
          d="M 96.95 10.6602 C 100.46 10.6602 103.91 11.5901 106.95 13.3401 L 172.5 51.1901 C 178.67 54.7501 182.5 61.3901 182.5 68.5101 V 144.2 C 182.5 151.32 178.67 157.96 172.5 161.52 L 106.95 199.37 C 103.91 201.12 100.46 202.05 96.95 202.05 C 93.44 202.05 89.99 201.12 86.95 199.37 L 21.4 161.52 C 15.23 157.96 11.4 151.32 11.4 144.2 V 68.5101 C 11.4 61.3901 15.23 54.7501 21.4 51.1901 L 86.95 13.3401 C 89.99 11.5901 93.44 10.6602 96.95 10.6602 Z"
        />
      </svg>
      <div class="BaseControl__cooldownCount">{{ cooldown }}</div>
    </template>
  </button>
</template>

<script lang="ts">
import { MyMath } from '@/utils';

import {
  InvisibilityIcon,
  RocketFireIcon,
  SatelliteFireIcon,
  SlowdownIcon
} from './icons';
import { DefineComponent, PropType } from 'vue';
import { BattleActionType } from '@/types';

export default {
  name: 'BaseControl',
  props: {
    progress: {
      type: Number,
      default: 0
    },
    cooldown: {
      type: [Number, null],
      default: null
    },
    name: {
      type: String as PropType<BattleActionType>,
    },
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  emits: ['click'],
  computed: {
    hasCooldown() {
      return this.cooldown !== null
    },
    icon() {
      const icons: Record<BattleActionType, DefineComponent<{}, {}, any>> = {
        invisibility: InvisibilityIcon,
        satelliteFire: SatelliteFireIcon,
        rocketFire: RocketFireIcon,
        slowdown: SlowdownIcon,
      }
      
      return icons[this.name]
    },
    progressStyle() {
      const dasharray = 580
      const offset = dasharray - dasharray * this.progress / 100

      return {
        'stroke-dasharray': `${dasharray}px`,
        'stroke-dashoffset': `${MyMath.clamp(offset, 0, dasharray)}px`
      };
    },
  }
};
</script>

<style scoped src="./BaseControl.css"/>
