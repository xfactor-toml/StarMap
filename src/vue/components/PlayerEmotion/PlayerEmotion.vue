<template>
  <div
    class="PlayerEmotion"
    :style="{
      top: `${coords.y}px`,
      left: `${coords.x}px`,
    }"
  >
    <div 
      ref="emotion"
      :class="`PlayerEmotion__icon is-${type}`"
    />
  </div>
</template>

<script lang="ts">
import { default as anime } from "animejs"
import { PropType } from 'vue'
import { Coords } from '@/stores/battle-emotions';
import { Emotion } from "~/game/battle/Types";

const SHOW_DURATION = 3000

export default {
  name: 'PlayerEmotion',
  props: {
    type: String as PropType<Emotion>,
    coords: Object as PropType<Coords>,
  },
  methods: {
    show() {
      anime({
        targets: this.$refs.emotion,
        scale: [0, 1],
        duration: 1000,
        easing: 'easeOutElastic',
        complete: () => {
          this.animate()
        }
      })
    },
    animate() {
      anime({
        targets: this.$refs.emotion,
        duration: SHOW_DURATION,
        complete: () => {
          this.hide()
        }
      })
    },
    hide() {
      anime({
        targets: this.$refs.emotion,
        scale: 0,
        duration: 600,
        easing: 'easeInBack',
        complete: () => {
          this.$emit('close')
        }
      })
    },
  },
  mounted() {
    this.show()
  }
};
</script>

<style scoped src="./PlayerEmotion.css"></style>
