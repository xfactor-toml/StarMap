<template>
  <button
    class="PowerIndicator"
    :class="{ active }"
    @mousedown="start"
    @mouseup="stop"
    @mouseleave="stop"
  >
    <div
      class="PowerIndicator__arrow"
      :style="`--rotation: ${rotation}deg`"
    />
    <div class="PowerIndicator__power">{{ power }}</div>
    <div
      class="PowerIndicator__overlay"
      :style="{ color: status }"
    />
  </button>
</template>

<script lang="ts">
import { cancelAnimation } from '@/utils';
import { default as anime } from 'animejs'

type ProgressStatus = 'white' | 'blue' | 'green' | 'orange' | 'red'

const INCREASE_SPEED = 10000
const MAX_DEGREE = 280
const ZONE_MAX_POWER = 80
const ZONES = {
  WHITE: 0,
  BLUE: 50,
  GREEN: 65,
  ORANGE: 90,
  RED: 100,
}


const getStatus = (progress: number): ProgressStatus => {
  switch (true) {
    case progress === ZONES.WHITE:
      return 'white'
    case progress <= ZONES.BLUE:
      return 'blue'
    case progress <= ZONES.GREEN:
      return 'green'
    case progress <= ZONES.ORANGE:
      return 'orange'
  }
  
  return 'red'
}

const calcPower = (status: ProgressStatus, progress: number): number => {
  switch (status) {
    case 'blue': {
      const ratio = ZONES.BLUE / 100
      const percent = progress / ratio
      const value = Math.trunc(ZONE_MAX_POWER / 100 * percent)

      return value
    }

    case 'green': {
      return 100
    }

    case 'orange': {
      const ratio = (ZONES.ORANGE - ZONES.GREEN) / 100
      const percent = (progress - ZONES.GREEN) / ratio
      const value = ZONE_MAX_POWER - Math.trunc(ZONE_MAX_POWER / 100 * percent)

      return value
    }
  }

  return 0
}

export default {
  name: 'PowerIndicator',
  data() {
    return {
      active: false,
      progress: 0,
      overheat: false,
      animation: null
    }
  },
  computed: {
    status() {
      return this.active ? getStatus(this.progress) : 'white'
    },
    power() {
      return calcPower(this.status, Math.trunc(this.progress))
    },
    rotation() {
      return MAX_DEGREE / 100 * this.progress
    },
  },
  watch: {
    active() {
      if (this.active) {
        this.play()
      } else {
        this.back()
      }
    },
    status() {
      if (this.status === 'red') {
        this.overheat = true
      }
    }
  },
  methods: {
    start() {
      this.active = true
    },
    stop() {
      if (this.active) {
        this.pushPower()
        this.active = false
      }
    },
    play() {
      this.cancelAnimation()
      this.animation = anime({
        targets: this,
        progress: [0, 100],
        easing: 'easeOutQuart',
        duration: INCREASE_SPEED,
        update: () => {
          if (this.overheat && this.progress >= ZONES.ORANGE + 5) {
            this.active = false
          }
        }
      })
    },
    back() {
      this.cancelAnimation()
      this.animation = anime({
        targets: this,
        progress: [this.progress, 0],
        easing: 'easeInSine',
        duration: this.progress * 4,
        complete: () => {
          this.progress = 0
          this.overheat = false
        }
      })
    },
    cancelAnimation() {
      if (this.animation) {
        this.animation.pause()
        cancelAnimation(this.animation)
      }
    },
    pushPower() {
      console.log({ power: this.power });
    }
  },
};
</script>

<style scoped src="./PowerIndicator.css"></style>
