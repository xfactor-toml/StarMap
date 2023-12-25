<template>
  <button
    class="SearchingIndicator"
    @click="$emit('click')"
  >
    <span class="SearchingIndicator__label">Searching</span>
    <div class="SearchingIndicator__loading">
    <div
      v-for="dot in dotsAmount"
      class="SearchingIndicator__dot"
      :class="{
        'is-active': dot === activeDot,
        'is-disabled': interval === null,
      }"
    />
    </div>
    <span class="SearchingIndicator__time">{{ formattedDuration }}</span>
  </button>
</template>

<script lang="ts">
import { formatDuration } from '@/utils';

export default {
  name: 'SearchingIndicator',
  emits: ['click'],
  props: {
    updateInterval: {
      type: Number,
      default: 200
    }
  },
  data: () => ({
    activeDot: 1,
    dotsAmount: 7,
    initialTime: Date.now(),
    interval: null,
    passedTime: 0,
  }),
  computed: {
    formattedDuration() {
      return formatDuration(this.passedTime)
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      const nextDot = this.activeDot + 1
      this.passedTime = Date.now() - this.initialTime
      this.activeDot = nextDot > this.dotsAmount ? 1 : nextDot 
    }, this.updateInterval);
  },
  unmounted() {
    clearInterval(this.interval)
  }
};
</script>

<style scoped src="./SearchingIndicator.css"></style>
