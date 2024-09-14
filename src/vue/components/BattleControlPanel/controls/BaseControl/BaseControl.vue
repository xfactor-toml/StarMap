<template>
  <div class="BaseControl__container">
    <button
    class="BaseControl"
    :class="{ active, disabled, cooldown: hasCooldown, hasContent: Boolean($slots.default),[name]: Boolean(name), canLevelUp: canLevelUp}"
    :disabled="!active || disabled"
    ref="skillContent"
    :draggable="canLevelUp"
    @dragstart="handleDragStart"
    @drag="handleDrag"
    @dragend="handleDragEnd"
    >
   <svg 
    class="BaseControl__outline" 
    viewBox="0 0 74 85" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M38.25 1.80978C37.87 1.59036 37.4388 1.47485 37 1.47485C36.5612 1.47485 36.1301 1.59036 35.75 1.80978L2.25 21.151C1.86995 21.3704 1.55436 21.686 1.33493 22.0661C1.11551 22.4461 0.999997 22.8772 1 23.3161L1.00001 61.9986C0.999999 62.4374 1.11551 62.8685 1.33493 63.2486C1.55436 63.6286 1.86995 63.9442 2.25 64.1636L35.75 83.5049C36.1301 83.7243 36.5612 83.8398 37 83.8398C37.4388 83.8398 37.87 83.7243 38.25 83.5049L71.75 64.1636C72.1301 63.9442 72.4456 63.6286 72.6651 63.2486C72.8845 62.8685 73 62.4374 73 61.9986V23.3161C73 22.8772 72.8845 22.4461 72.6651 22.0661C72.4456 21.686 72.1301 21.3704 71.75 21.151L38.25 1.80978Z" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        fill-opacity="0.4"
        fill="currentColor"
        />
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
          transform="scale(0.95) translate(4, 5)"
        />
        <path
          v-if="progress"
          :style="progressStyle"
          stroke="currentColor"
          stroke-width="10"
          d="M 96.95 10.6602 C 100.46 10.6602 103.91 11.5901 106.95 13.3401 L 172.5 51.1901 C 178.67 54.7501 182.5 61.3901 182.5 68.5101 V 144.2 C 182.5 151.32 178.67 157.96 172.5 161.52 L 106.95 199.37 C 103.91 201.12 100.46 202.05 96.95 202.05 C 93.44 202.05 89.99 201.12 86.95 199.37 L 21.4 161.52 C 15.23 157.96 11.4 151.32 11.4 144.2 V 68.5101 C 11.4 61.3901 15.23 54.7501 21.4 51.1901 L 86.95 13.3401 C 89.99 11.5901 93.44 10.6602 96.95 10.6602 Z"
          transform="scale(0.95) translate(4, 5)"
          />
      </svg>
      <div class="BaseControl__cooldownCount">{{ cooldown }}</div>
    </template>
  
  </button>
    <div
      v-if="canLevelUp"
      class="BaseSkill__levelUp"
      ref="levelUp"
      @dragover.prevent
      @drop="handleDrop"
      >
      <div class="BaseSkill__levelContainer">
        <div v-for="(item, index) in 6" :key="index" class="BaseSkill__levelAnimation">
          <img src="/gui/images/pre-game-countdown/emotion-border.svg">
        </div>
      </div>
    </div>
</div>
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
import { BattleSkill } from '@/types';

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
    params: {
      type: Object as PropType<BattleSkill>,
    },
  },
  data() {
    return {
      dragging: false,
      dragStartX: 0,
      dragStartY: 0,
      levelUp: false,
    };
  },
  computed: {
    hasCooldown() {
      console.log(this.cooldown, 'cooldown')
     return this.cooldown !== null
    },
    canDrag() {
      return this.canLevelUp && this.hasCooldown;
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
    canLevelUp() {
      return this.params?.levelUpAvailable || false
    }
  },

  methods: {
  handleDragStart(event: DragEvent) {
    this.dragging = true;
    event.dataTransfer?.setData('text/plain', 'dragging');
    // Save initial positions
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
  },
  handleDrag(event: DragEvent) {
    if (!event.clientX || !event.clientY) return;

    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    const content = this.$refs.skillContent as HTMLElement;
    const svgElement = content.querySelector('svg');
    const levelUp = this.$refs.levelUp as HTMLElement;

    const contentRect = content.getBoundingClientRect();
    const levelUpRect = levelUp.getBoundingClientRect();
    content.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    if (contentRect.top < levelUpRect.top) {
      svgElement.style.setProperty('opacity', '1', 'important');
      this.levelUp = true;
    }
  },
  handleDragEnd(event: DragEvent) {
    this.dragging = false;
    const content = this.$refs.skillContent as HTMLElement;
    content.style.transform = '';
  },
  handleDrop(event: DragEvent) {
    const content = this.$refs.skillContent as HTMLElement;
    const levelUp = this.$refs.levelUp as HTMLElement;

    const contentRect = content.getBoundingClientRect();
    const levelUpRect = levelUp.getBoundingClientRect();
    if (this.levelUp) {
    this.$emit('levelUp');
    console.log('levelUp========================')
    this.levelUp = false;
  }
}
  }
}
</script>

<style scoped src="./BaseControl.css"/>
