<template>
  <div class="BaseItem__row" :class="{ isHide: hide }">
    <button class="BaseItem" @click="handleClick">
      <div v-if="!buy">
        <svg class="BaseItem__outline" viewBox="0 0 194 214" fill="none">
          <path
            d="M192.39 69.34V145.04C192.39 150.4 190.96 155.55 188.37 160.04C185.78 164.52 182.03 168.34 177.39 171.02L144.62 189.94L111.84 208.86C107.2 211.54 102.02 212.88 96.84 212.88C91.66 212.88 86.48 211.54 81.84 208.86L49.07 189.94L16.29 171.02C11.65 168.34 7.90004 164.52 5.31004 160.04C2.72004 155.55 1.29004 150.4 1.29004 145.04V69.34C1.29004 63.99 2.72004 58.83 5.31004 54.35C7.90004 49.86 11.65 46.04 16.29 43.36L49.07 24.4399L81.84 5.52002C86.48 2.84002 91.66 1.5 96.84 1.5C102.02 1.5 107.2 2.84002 111.84 5.52002L144.62 24.4399L177.39 43.36C182.03 46.04 185.78 49.86 188.37 54.35C190.96 58.83 192.39 63.99 192.39 69.34Z"
            stroke="#00FFFF" stroke-width="2" stroke-miterlimit="10" />
          <g v-if="icon">
            <svg class="BaseItem__inner-icon" width="172" height="192" viewBox="0 0 172 192" fill="none" x="10.5"
              y="10.5">
              <path opacity="0.3"
                d="M85.8498 191.88C82.3398 191.88 78.8898 190.95 75.8498 189.2L10.2998 151.35C4.1298 147.79 0.299805 141.15 0.299805 134.03V58.34C0.299805 51.22 4.1298 44.58 10.2998 41.02L75.8498 3.17004C78.8898 1.42004 82.3398 0.48999 85.8498 0.48999C89.3598 0.48999 92.8098 1.42004 95.8498 3.17004L161.4 41.02C167.57 44.58 171.4 51.22 171.4 58.34V134.03C171.4 141.15 167.57 147.79 161.4 151.35L95.8498 189.2C92.8098 190.95 89.3598 191.88 85.8498 191.88Z"
                fill="url(#paint0_linear_1_3785)" />
              <defs>
                <linearGradient id="paint0_linear_1_3785" x1="85.8398" y1="191.88" x2="85.8398" y2="0.499983"
                  gradientUnits="userSpaceOnUse">
                  <stop stop-color="#00FFFF" />
                  <stop offset="1" stop-color="#00FFFF" stop-opacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </g>
        </svg>
      </div>
      <div v-else>
        <svg class="BaseItem__outline" viewBox="0 0 192 212" fill="none">
          <path
            d="M96.1501 6.5C100.36 6.5 104.51 7.60997 108.15 9.71997L173.7 47.5699C181.1 51.8399 185.7 59.81 185.7 68.35V144.04C185.7 152.59 181.1 160.55 173.7 164.82L108.15 202.67C104.51 204.77 100.36 205.89 96.1501 205.89C91.9401 205.89 87.7901 204.78 84.1501 202.67L18.6001 164.82C11.2001 160.55 6.6001 152.58 6.6001 144.04V68.35C6.6001 59.8 11.2001 51.8399 18.6001 47.5699L84.1501 9.71997C87.7901 7.61997 91.9401 6.5 96.1501 6.5ZM96.1501 0.5C90.9701 0.5 85.7901 1.84002 81.1501 4.52002L15.6001 42.37C6.3201 47.73 0.600098 57.63 0.600098 68.35V144.04C0.600098 154.76 6.3201 164.66 15.6001 170.02L81.1501 207.87C85.7901 210.55 90.9701 211.89 96.1501 211.89C101.33 211.89 106.51 210.55 111.15 207.87L176.7 170.02C185.98 164.66 191.7 154.76 191.7 144.04V68.35C191.7 57.63 185.98 47.73 176.7 42.37L111.15 4.52002C106.51 1.84002 101.33 0.5 96.1501 0.5Z"
            fill="#F9EB21" />
          <g v-if="icon">
            <svg class="BaseItem__inner-icon" width="172" height="192" viewBox="0 0 172 192" fill="none"
              xmlns="http://www.w3.org/2000/svg" x="10.5" y="10.5">
              <path opacity="0.3"
                d="M85.8498 191.88C82.3398 191.88 78.8898 190.95 75.8498 189.2L10.2998 151.35C4.1298 147.79 0.299805 141.15 0.299805 134.03V58.34C0.299805 51.22 4.1298 44.58 10.2998 41.02L75.8498 3.17004C78.8898 1.42004 82.3398 0.48999 85.8498 0.48999C89.3598 0.48999 92.8098 1.42004 95.8498 3.17004L161.4 41.02C167.57 44.58 171.4 51.22 171.4 58.34V134.03C171.4 141.15 167.57 147.79 161.4 151.35L95.8498 189.2C92.8098 190.95 89.3598 191.88 85.8498 191.88Z"
                fill="url(#paint0_linear_1_3785)" />
              <defs>
                <linearGradient id="paint0_linear_1_3785" x1="85.8398" y1="191.88" x2="85.8398" y2="0.499983"
                  gradientUnits="userSpaceOnUse">
                  <stop stop-color="#00FFFF" />
                  <stop offset="1" stop-color="#00FFFF" stop-opacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </g>
        </svg>
      </div>
      <div v-if="icon" class="BaseItem__icon">
        <component :is="icon" />
      </div>
    </button>

    <transition name="fade">
    <div v-if="detail">
      <div :class="['BaseItem__extend', { 'BaseItem__extend--left': id <= 1, 'BaseItem__extend--right': id > 1 }]">
        <svg class="BaseItem__outline" :viewBox="'0 0 560 214'" fill="none" :transform="id > 1 ? 'rotate(180 0 0)' : ''">
          <path
            d="M558.6 69.35V145.04C558.6 155.76 552.88 165.66 543.6 171.02L478.04 208.86C473.4 211.54 468.22 212.88 463.04 212.88H0.839844C6.01984 212.88 11.1998 211.54 15.8398 208.86L48.6198 189.94L81.3899 171.02C86.0299 168.34 89.7798 164.52 92.3698 160.04C94.9598 155.55 96.3899 150.4 96.3899 145.04V69.34C96.3899 63.99 94.9598 58.83 92.3698 54.35C89.7798 49.86 86.0299 46.04 81.3899 43.36L48.6198 24.4399L15.8398 5.52002C11.1998 2.84002 6.01984 1.5 0.839844 1.5H463.04C468.22 1.5 473.4 2.84002 478.04 5.52002L543.6 43.36C552.88 48.72 558.6 58.63 558.6 69.35Z"
            stroke="#00FFFF" stroke-width="2" stroke-miterlimit="10" />
        </svg>
      </div>
      <div :class="['BaseItem__detailIcon', { 'BaseItem__detailIcon--left': id <= 1, 'BaseItem__detailIcon--right': id > 1 }]" @click="handleItemViewCloseClick">
        <component :is="id <= 1 ? 'DetailLeftIcon' : 'DetailRightIcon'" />
      </div>
      <div :class="['BaseItem__detailText', { 'BaseItem__detailText--left': id <= 1, 'BaseItem__detailText--right': id > 1 }]">
        People who live in urban areas are exposed to all kinds.
      </div>
    </div>
  </transition>

  </div>
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
  DetailRightIcon,
  DetailLeftIcon,
  BackGroundIcon,
} from './icons'
import { DefineComponent, PropType } from 'vue';
import { BattleItemNameType } from '@/types';

export default {
  name: 'BaseItem',
  components: {
    DetailRightIcon,
    DetailLeftIcon,
    BackGroundIcon,
  },
  props: {
    id: {
      type: Number,
    },
    name: {
      type: String as PropType<BattleItemNameType>,
    },
    detail: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    hide: {
      type: Boolean,
      default: false
    },
    buy: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  emits: ['itemDescription', 'itemViewClose'],
  methods: {
    handleClick() {
      this.$emit('itemDescription', this.id);
    },
    handleItemViewCloseClick() {
      this.$emit('itemViewClose', this.id);
    }
  },
  computed: {
    icon() {
      const icons: Record<BattleItemNameType, DefineComponent<{}, {}, any>> = {
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
  }
};
</script>

<style scoped src="./BaseItem.css" />