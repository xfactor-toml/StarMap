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
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
   <template v-if="isInventory && isAnimatedInventory">
    <div class="BaseControl__animated-inventory">
      <img src="/gui/images/inventory-list/icon_blink_64.webp" />
    </div>
   </template>
   <template v-else-if="canLevelUp && isAnimatedLevelUp">
    <div class="BaseControl__animated-levelUp">
      <img src="/gui/images/inventory-list/icon_blink_128.webp" />
    </div>
   </template>
   <template v-else>
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
   </template>
    <div
      v-if="icon"
      class='BaseControl__icon'
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
    <div v-if="canLevelUp" class="BaseControl__levelUp-bg">
      <svg width="80" height="92" viewBox="0 0 80 92" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M41.3889 0.374101C40.9666 0.129013 40.4876 0 40 0C39.5124 0 39.0334 0.129013 38.6111 0.374101L1.38889 21.9779C0.966614 22.223 0.615952 22.5755 0.37215 23C0.128348 23.4245 -3.0765e-06 23.906 0 24.3962L7.31633e-06 67.6038C-6.9749e-07 68.094 0.128349 68.5755 0.37215 69C0.61595 69.4245 0.966612 69.777 1.38889 70.0221L38.6111 91.6259C39.0334 91.871 39.5124 92 40 92C40.4876 92 40.9666 91.871 41.3889 91.6259L78.6111 70.0221C79.0334 69.777 79.384 69.4245 79.6279 69C79.8717 68.5755 80 68.094 80 67.6038V24.3962C80 23.906 79.8717 23.4245 79.6279 23C79.384 22.5755 79.0334 22.223 78.6111 21.9779L41.3889 0.374101Z" fill="black"/>
      </svg>
    </div>
    <div
      v-if="canLevelUp"
      class="BaseControl__levelUp"
      ref="levelUp"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @touchend="handleTouchEnd"
      >
      <div class="BaseControl__levelContainer">
        <svg width="74" height="62" viewBox="0 0 74 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M38.128 0.300751L72.8719 20.2609C73.2149 20.4579 73.4997 20.7413 73.6977 21.0826C73.8958 21.4239 74 21.811 74 22.2051V59.7551C74 60.1492 73.8957 60.5363 73.6977 60.8776C73.4997 61.2188 73.2149 61.5022 72.8719 61.6992C72.529 61.8963 72.1399 62 71.7439 62C71.3478 62 70.9588 61.8963 70.6158 61.6992L37.6281 61.3008C37.6281 61.3008 36.896 61 36.5 61C36.104 61 35.7149 61.1037 35.3719 61.3008L3.38414 61.6992C3.04117 61.8963 2.65212 62 2.25609 62C1.86006 62 1.47101 61.8963 1.12804 61.6992C0.78507 61.5022 0.500259 61.2188 0.302246 60.8776C0.104234 60.5363 -2.73551e-06 60.1491 0 59.7551V22.205C4.53456e-06 21.811 0.104256 21.4238 0.30227 21.0826C0.500285 20.7413 0.785085 20.4579 1.12805 20.2609L35.872 0.300751C36.2149 0.103725 36.604 -6.17311e-06 37 2.75533e-10C37.396 -6.17311e-06 37.7851 0.103725 38.128 0.300751Z"
                fill="#0167FF" />
        </svg>
         <svg width="74" height="62" viewBox="0 0 74 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M38.128 0.300751L72.8719 20.2609C73.2149 20.4579 73.4997 20.7413 73.6977 21.0826C73.8958 21.4239 74 21.811 74 22.2051V59.7551C74 60.1492 73.8957 60.5363 73.6977 60.8776C73.4997 61.2188 73.2149 61.5022 72.8719 61.6992C72.529 61.8963 72.1399 62 71.7439 62C71.3478 62 70.9588 61.8963 70.6158 61.6992L37.6281 61.3008C37.6281 61.3008 36.896 61 36.5 61C36.104 61 35.7149 61.1037 35.3719 61.3008L3.38414 61.6992C3.04117 61.8963 2.65212 62 2.25609 62C1.86006 62 1.47101 61.8963 1.12804 61.6992C0.78507 61.5022 0.500259 61.2188 0.302246 60.8776C0.104234 60.5363 -2.73551e-06 60.1491 0 59.7551V22.205C4.53456e-06 21.811 0.104256 21.4238 0.30227 21.0826C0.500285 20.7413 0.785085 20.4579 1.12805 20.2609L35.872 0.300751C36.2149 0.103725 36.604 -6.17311e-06 37 2.75533e-10C37.396 -6.17311e-06 37.7851 0.103725 38.128 0.300751Z"
                fill="#0167FF" />
        </svg>
        <svg width="74" height="62" viewBox="0 0 74 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M38.128 0.300751L72.8719 20.2609C73.2149 20.4579 73.4997 20.7413 73.6977 21.0826C73.8958 21.4239 74 21.811 74 22.2051V59.7551C74 60.1492 73.8957 60.5363 73.6977 60.8776C73.4997 61.2188 73.2149 61.5022 72.8719 61.6992C72.529 61.8963 72.1399 62 71.7439 62C71.3478 62 70.9588 61.8963 70.6158 61.6992L37.6281 61.3008C37.6281 61.3008 36.896 61 36.5 61C36.104 61 35.7149 61.1037 35.3719 61.3008L3.38414 61.6992C3.04117 61.8963 2.65212 62 2.25609 62C1.86006 62 1.47101 61.8963 1.12804 61.6992C0.78507 61.5022 0.500259 61.2188 0.302246 60.8776C0.104234 60.5363 -2.73551e-06 60.1491 0 59.7551V22.205C4.53456e-06 21.811 0.104256 21.4238 0.30227 21.0826C0.500285 20.7413 0.785085 20.4579 1.12805 20.2609L35.872 0.300751C36.2149 0.103725 36.604 -6.17311e-06 37 2.75533e-10C37.396 -6.17311e-06 37.7851 0.103725 38.128 0.300751Z"
                fill="#0167FF" />
        </svg>
      </div>
    </div>
</div>
</template>
<script lang="ts">

import {
  InvisibilityIcon,
  RocketFireIcon,
  SatelliteFireIcon,
  SlowdownIcon,
  StarIcon,
  TowerIcon,
  ShipIcon,
  LinkorIcon,
} from './icons';
import { DefineComponent, PropType } from 'vue';
import { BattleActionType } from '@/types';
import { MyMath } from '~/monax/MyMath';
import { BattleSkill } from '@/types';
import { ref } from 'vue';

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
    isInventory: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dragging: false,
      dragStartX: 0,
      dragStartY: 0,
      touchStartX: 0,
      touchStartY: 0,  
      previousY: 0,
      directionChanged: false,  
      isAnimatedInventory: true,
      isAnimatedLevelUp: true,
    };
  },

  computed: {
    hasCooldown() {
      return this.cooldown !== null && this.cooldown !== undefined;
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
        tower: TowerIcon,
        star: StarIcon,
        ship: ShipIcon,
        linkor: LinkorIcon, 
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

  watch: {
    canLevelUp(newVal) {
      this.isAnimatedLevelUp = true;
      if (newVal) {
        setTimeout(() => {
          this.isAnimatedLevelUp = false;
        }, 1000);
      }
    }
  },

  mounted() {
    if(this.isInventory) {
      setTimeout(() => {
        this.isAnimatedInventory = false;
      }, 1000);
    }
  },

  methods: {
  handleDragStart(event: DragEvent) {
    this.dragging = true;
    event.dataTransfer?.setData('text/plain', 'dragging');

    if (!navigator.userAgent.includes('Mac OS')) {
    const img = new Image();
    img.src = ''; // Empty source makes it invisible
    event.dataTransfer?.setDragImage(img, 0, 0);
  }
    // Save initial positions
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.previousY = this.dragStartY;
    const content = this.$refs.skillContent as HTMLElement;
    const svgElement = content.querySelector('svg');
    svgElement.style.setProperty('opacity', '1', 'important');
  },
  handleDrag(event: DragEvent) {
    if (!event.clientX || !event.clientY) return;
    const deltaX = this.dragStartX - event.clientX;
    const deltaY = this.dragStartY - event.clientY;
    const content = this.$refs.skillContent as HTMLElement;
    const svgElement = content.querySelector('svg');
    
    if (event.clientY !== this.previousY) {
      if (deltaY > 0 && this.previousY > event.clientY) {
        this.directionChanged = true;
        svgElement.style.setProperty('opacity', '1', 'important');
      } else {
        this.directionChanged = false;
        svgElement.style.setProperty('opacity', '0.3', 'important');
      }
      this.previousY = event.clientY;
  }
    content.style.transform = `translateY(${-Math.max(0, deltaY)}px)`;
  },
  handleDragEnd(event: DragEvent) {
    this.dragging = false;
    const content = this.$refs.skillContent as HTMLElement;
    const svgElement = content.querySelector('svg');
    content.style.transform = '';
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;
    if (Math.abs(deltaY) > 0 && this.directionChanged) {
      this.$emit('levelUp');
    } else {
      if(this.params?.level == 0){
        svgElement.style.setProperty('opacity', '0.3', 'important');
      }
      else {
        svgElement.style.setProperty('opacity', '1', 'important');
      }
    }
  },
  handleDrop() {
},
  handleTouchStart(event: TouchEvent) {
    this.dragging = true;
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.previousY = this.touchStartX;
    const content = this.$refs.skillContent as HTMLElement;
    const svgElement = content.querySelector('svg');
    svgElement.style.setProperty('opacity', '1', 'important');
  },
  handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    if (!this.dragging || !this.canLevelUp) return;
    const touch = event.touches[0];
    const deltaY = this.touchStartY - touch.clientY;
    const content = this.$refs.skillContent as HTMLElement;
    const svgElement = content.querySelector('svg');
    
    if (touch.clientY !== this.previousY) {
      if (deltaY > 0 && this.previousY > touch.clientY) {
        this.directionChanged = true;
        svgElement.style.setProperty('opacity', '1', 'important');
      } else {
        this.directionChanged = false;
        svgElement.style.setProperty('opacity', '0.3', 'important');
      }
      this.previousY = touch.clientY;
  }
    content.style.transform = `translateY(${-Math.max(0, deltaY)}px)`;
  },
  handleTouchEnd(event: TouchEvent) {
    if (!this.dragging) return;
    this.dragging = false;
    const content = this.$refs.skillContent as HTMLElement;
    const svgElement = content.querySelector('svg');
    content.style.transform = '';
    const touch = event.changedTouches[0];
    const deltaY = touch.clientY - this.touchStartY;
    if (Math.abs(deltaY) > 0 && this.directionChanged) {
      this.$emit('levelUp');
    } else {
      if(this.params?.level == 0){
        svgElement.style.setProperty('opacity', '0.3', 'important');
      }
      else {
        svgElement.style.setProperty('opacity', '1', 'important');
      }
    }

  }
  }
}
</script>

<style scoped src="./BaseControl.css"/>

