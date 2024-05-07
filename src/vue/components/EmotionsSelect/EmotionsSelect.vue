<template>
  <div
    class="EmotionsSelect"
    v-click-outside="close"
    :style="{
      top: `${coords.y}px`,
      left: `${coords.x}px`,
    }"
  >
    <button
      v-for="emotion in emotions"
      ref="emotion"
      :data-emotion="emotion"
      :class="`EmotionsSelect__button is-${emotion}`"
      @click="select(emotion)"
    />
  </div>
</template>

<script lang="ts">
import { default as anime } from "animejs"
import { PropType } from 'vue'
import { default as vClickOutside } from 'click-outside-vue3';
import { Coords } from '@/stores/battle-emotions';
import { Emotion } from "~/game/battle/Types";

const emotions: Emotion[] = ['smile', 'thinking', 'evil', 'angry', 'dead', 'sad']
const radius = 80
const offset = 30

const getRadians = (index: number) => {
  const degree = 360 / emotions.length * index - offset
  const radians = degree / 180 * Math.PI

  return radians
}

const getXOffset = (index: number) => {
  return Math.sin(getRadians(index)) * radius * -1
}

const getYOffset = (index: number) => {
  return Math.cos(getRadians(index)) * radius
}

export default {
  name: 'EmotionsSelect',
  props: {
    coords: Object as PropType<Coords>,
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      emotions,
      order: [1, 3, 5, 4, 2, 0],
    }
  },
  computed: {
    elementsRefs() {
      return this.order.map(emotionIndex => this.$refs.emotion[emotionIndex])
    }
  },
  methods: {
    show() {
      anime({
        targets: this.elementsRefs,
        translateX: (el, i) => [getXOffset(i), 0],
        translateY: (el, i) => [getYOffset(i), 0],
        scale: [0, 1],
        duration: 1400,
        delay: anime.stagger(40),
        easing: 'easeOutElastic'
      })
    },
    hide() {
      return anime({
        targets: [...this.elementsRefs].reverse(),
        translateX: (el, i) => [0, getYOffset(i)],
        translateY: (el, i) => [0, getXOffset(i)],
        scale: [1, 0],
        duration: 600,
        delay: anime.stagger(30),
        easing: 'easeInBack'
      }).finished
    },
    close() {
      this.hide().then(() => {
        this.$emit('close')
      })
    },
    select(emotion: string) {
      this.$emit('select', emotion)
      this.close()
    }
  },
  mounted() {
    this.show()
  }
};
</script>

<style scoped src="./EmotionsSelect.css"></style>
