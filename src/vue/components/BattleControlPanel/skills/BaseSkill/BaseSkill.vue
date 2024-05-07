<template>
  <div
    class="BaseSkill"
    :class="{
      isDisabled: disabled
    }"
  >
    <slot/>
    <template v-if="canLevelUp">
      <button
        class="BaseSkill__levelUp"
        :disabled="disabled"
        @click="$emit('levelUp')"
      >
        <svg viewBox="30.0699 30.73 87.46 97.81" fill="#00FFFF">
          <path d="M73.7999 128.54C72.8999 128.54 72.0099 128.42 71.1499 128.19C70.2899 127.96 69.4599 127.62 68.6799 127.17L51.9299 117.5L35.1799 107.83C33.5999 106.92 32.3299 105.62 31.4399 104.09C30.5599 102.56 30.0699 100.8 30.0699 98.98V60.29C30.0699 58.47 30.5599 56.7099 31.4399 55.1799C32.3199 53.6499 33.5999 52.3499 35.1799 51.4399L51.9299 41.77L68.6799 32.1001C69.4599 31.6501 70.2899 31.3101 71.1499 31.0801C72.0099 30.8501 72.8999 30.73 73.7999 30.73C74.7 30.73 75.5899 30.8501 76.4499 31.0801C77.3099 31.3101 78.1399 31.6501 78.9199 32.1001L95.6699 41.77L112.42 51.4399C114 52.3499 115.27 53.6499 116.16 55.1799C117.04 56.7099 117.53 58.47 117.53 60.29V98.98C117.53 100.8 117.04 102.56 116.16 104.09C115.28 105.62 114 106.92 112.42 107.83L95.6699 117.5L78.9199 127.17C78.1399 127.62 77.3099 127.96 76.4499 128.19C75.5899 128.42 74.7 128.54 73.7999 128.54Z"/>
        </svg>
        <span class="BaseSkill__levelUpText">+</span>
      </button>
    </template>
    <template v-if="params">
      <div class="BaseSkill__levelBar">
        <template v-for="n in 4">
          <div
            class="BaseSkill__level"
            :class="{
              active: n <= level
            }"
          />
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { BattleSkill } from '@/types';
import { PropType } from 'vue';

export default {
  name: 'BaseSkill',
  props: {
    params: {
      type: Object as PropType<BattleSkill>,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    hasCooldown: {
      type: Boolean,
      default: false
    },
    shortcut: {
      type: String,
      required: true
    },
  },
  emits: ['levelUp', 'apply'],
  computed: {
    level() {
      return this.params?.level ?? 0
    },
    canLevelUp() {
      return this.params?.levelUpAvailable || false
    }
  },
  methods: {
    handleKeypress({ code, shiftKey }: KeyboardEvent) {
      if (this.disabled || code !== this.shortcut) {
        return
      }

      if (shiftKey) {
        this.canLevelUp && this.$emit('levelUp')
      } else {
        this.active && !this.hasCooldown && this.$emit('apply')
      }
    }
  },
  mounted() {
    window.addEventListener('keypress', this.handleKeypress)
  },
  unmounted() {
    window.removeEventListener('keypress', this.handleKeypress)
  },
};
</script>

<style scoped src="./BaseSkill.css"/>
