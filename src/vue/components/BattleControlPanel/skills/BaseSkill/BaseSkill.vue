<template>
  <div
    class="BaseSkill"
    :class="{
      isDisabled: disabled
    }"
  >
    <slot/>
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
  data() {
    return {
      dragging: false
    };
  },
  computed: {
    level() {
      return this.params?.level ?? 0;
    },
    canLevelUp() {
      return this.params?.levelUpAvailable || false;
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
  
}
</script>


<style scoped src="./BaseSkill.css"/>
