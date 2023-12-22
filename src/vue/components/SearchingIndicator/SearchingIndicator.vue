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
  emits: ['click', 'expired'],
  props: {
    duration: {
      type: Number,
      required: true
    },
    updateInterval: {
      type: Number,
      default: 200
    }
  },
  data: () => ({
    activeDot: 1,
    dotsAmount: 7,
    timeLeft: 0,
    interval: null,
  }),
  computed: {
    expiredDate() {
      return Date.now() + this.duration
    },
    formattedDuration() {
      return formatDuration(this.timeLeft)
    }
  },
  methods: {
    getTimeLeft() {
      return this.expiredDate - Date.now()
    }
  },
  mounted() {
    this.timeLeft = this.getTimeLeft()
    this.interval = setInterval(() => {
      const nextDot = this.activeDot + 1
      this.activeDot = nextDot > this.dotsAmount ? 1 : nextDot 

      if (this.timeLeft > 0) {
        this.timeLeft = this.getTimeLeft()
      } else {
        if (this.activeDot === 1) {
          clearInterval(this.interval)
          this.interval = null
          this.$emit('expired')
        }
      }

    }, this.updateInterval);
  },
  unmounted() {
    clearInterval(this.interval)
  }
};
</script>

<style scoped src="./SearchingIndicator.css"></style>
