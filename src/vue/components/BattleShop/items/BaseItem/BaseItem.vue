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
      @click="$emit('click')"
    >
      <svg
        class="BaseControl__outline"
        viewBox="0 0 193 213"
        fill="none"
      >
        <path
          stroke="currentColor"
          d="M1.40002 144.21V68.52C1.40002 57.8 7.12002 47.9 16.4 42.54L81.95 4.68992C91.23 -0.670078 102.67 -0.670078 111.95 4.68992L177.5 42.54C186.78 47.9 192.5 57.8 192.5 68.52V144.21C192.5 154.93 186.78 164.83 177.5 170.19L111.95 208.04C102.67 213.4 91.23 213.4 81.95 208.04L16.4 170.19C7.12002 164.83 1.40002 154.93 1.40002 144.21Z"
        />
        <g v-if="icon" class="BaseControl__fill">
          <path
            d="M96.95 202.05C93.44 202.05 89.99 201.12 86.95 199.37L21.4 161.52C15.23 157.96 11.4 151.32 11.4 144.2V68.5101C11.4 61.3901 15.23 54.7501 21.4 51.1901L86.95 13.3401C89.99 11.5901 93.44 10.6602 96.95 10.6602C100.46 10.6602 103.91 11.5901 106.95 13.3401L172.5 51.1901C178.67 54.7501 182.5 61.3901 182.5 68.5101V144.2C182.5 151.32 178.67 157.96 172.5 161.52L106.95 199.37C103.91 201.12 100.46 202.05 96.95 202.05Z"
          />
          
        </g>
       
      </svg>
      <div
        v-if="icon"
        class="BaseControl__icon"
      >
        <component :is="icon"/>
      </div>
    
    </button>
  </template>
  
  <script lang="ts">
  import {
    ThunderIcon,
    VelocityVectorIcon,
    SurgeSpiresIcon,
    SpiralSentinelIcon,
    NuclearOrbIcon,
    MomentumMatrixIcon,
    QuantumBoosterIcon,
    AccelerationAmuletIcon, 
  } from './icons'
  import { DefineComponent, PropType } from 'vue';
  import { BattleItemType } from '@/types';
  import { MyMath } from '~/monax/MyMath';
  
  export default {
    name: 'BaseItem',
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
        type: String as PropType<BattleItemType>,
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
        const icons: Record<BattleItemType, DefineComponent<{}, {}, any>> = {
           thunder: ThunderIcon,
           velocityVector: VelocityVectorIcon,
           surgesSpire: SurgeSpiresIcon,
           spiralSentinel: SpiralSentinelIcon,
           nuclearOrb: NuclearOrbIcon,
           momentumMatrix: MomentumMatrixIcon,
           quantumBooster: QuantumBoosterIcon,
           accelerationAmulet: AccelerationAmuletIcon, 
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
  
  <style scoped src="./BaseItem.css"/>