<template>
  <button
    class="BaseControl"
    :class="{
      active,
      disabled,
      cooldown: hasCooldown,
      hasContent: Boolean($slots.default),
      [name]: Boolean(name),
    }"
    :disabled="!active || disabled"
  >
    <svg 
     class="BaseControl__outline" 
     viewBox="0 0 74 85" 
     fill="none">
      <path 
        d="M38.25 1.80978C37.87 1.59036 37.4388 1.47485 37 1.47485C36.5612 1.47485 36.1301 1.59036 35.75 1.80978L2.25 21.151C1.86995 21.3704 1.55436 21.686 1.33493 22.0661C1.11551 22.4461 0.999997 22.8772 1 23.3161L1.00001 61.9986C0.999999 62.4374 1.11551 62.8685 1.33493 63.2486C1.55436 63.6286 1.86995 63.9442 2.25 64.1636L35.75 83.5049C36.1301 83.7243 36.5612 83.8398 37 83.8398C37.4388 83.8398 37.87 83.7243 38.25 83.5049L71.75 64.1636C72.1301 63.9442 72.4456 63.6286 72.6651 63.2486C72.8845 62.8685 73 62.4374 73 61.9986V23.3161C73 22.8772 72.8845 22.4461 72.6651 22.0661C72.4456 21.686 72.1301 21.3704 71.75 21.151L38.25 1.80978Z" 
        fill="#005EEA" 
        fill-opacity="0.4" 
        stroke="#005EEA" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
    </svg>

      <!-- <g v-if="icon || hasCooldown" class="BaseControl__fill">
        <path
          d="M96.95 202.05C93.44 202.05 89.99 201.12 86.95 199.37L21.4 161.52C15.23 157.96 11.4 151.32 11.4 144.2V68.5101C11.4 61.3901 15.23 54.7501 21.4 51.1901L86.95 13.3401C89.99 11.5901 93.44 10.6602 96.95 10.6602C100.46 10.6602 103.91 11.5901 106.95 13.3401L172.5 51.1901C178.67 54.7501 182.5 61.3901 182.5 68.5101V144.2C182.5 151.32 178.67 157.96 172.5 161.52L106.95 199.37C103.91 201.12 100.46 202.05 96.95 202.05Z"
        />
      </g> -->
      <!-- <template v-else>
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
      </template> -->
 
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

    <div v-if="this.showEmotion"  class="Emotion">
        <div class="Emotion__area">
           <div v-for="(item, index) in 6" class="Emmotion__animation">
              <img src="/gui/images/pre-game-countdown/emotion-border.svg">
           </div>

        </div>
    </div>
  </button>
</template>

<script lang="ts">

import {
  InvisibilityIcon,
  RocketFireIcon,
  SatelliteFireIcon,
  SlowdownIcon
} from './icons';
import { 
  ThunderIcon,
  VelocityVectorIcon,
  SurgeSpiresIcon,
  SpiralSentinelIcon,
  NuclearOrbIcon,
  MomentumMatrixIcon,
  QuantumBoosterIcon,
  AccelerationAmuletIcon,
 } from '@/components/BattleShop/item/icons';
import { DefineComponent, PropType } from 'vue';
import { BattleActionType } from '@/types';
import { MyMath } from '~/monax/MyMath';

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
      type: String ,
    },
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showEmotion: {
      type: Boolean,
      default: false,
    }
  },
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
        thunder: ThunderIcon,
        velocityVector: VelocityVectorIcon,
        nuclearOrb: NuclearOrbIcon,
        spiralSentinel: SpiralSentinelIcon,
        accelerationAmulet: AccelerationAmuletIcon,
        surgesSpire: SurgeSpiresIcon,
        momentumMatrix: MomentumMatrixIcon,
        quantumBooster: QuantumBoosterIcon,
        
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
